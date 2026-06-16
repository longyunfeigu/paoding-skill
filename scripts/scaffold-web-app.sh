#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'USAGE'
Usage:
  bash scripts/scaffold-web-app.sh <target-dir> [--title=<title>] [--skill-name=<name>] [--source-path=<path>]

Convention: each handbook lives under generation/<skill-slug>/ where
<skill-slug> is the kebab-case name of the source skill. Example:
  bash scripts/scaffold-web-app.sh generation/nuwa-skill \
    --title="女娲 Skill 造人术 解剖手册" \
    --skill-name="女娲 Skill 造人术" \
    --source-path="/path/to/nuwa-skill"

Creates the fixed static web handbook skeleton (六章 + 附录):
  index.html
  pages/{overview,walkthrough,dataflow,source-guide,archive,apply-it,glossary,source}.html
  content/                  <- write content/*.md here (the only hand-written layer)
  assets/{data.js,source-data.js,site.js,styles.css,diagrams/.gitkeep}

The page shells and renderer are meant to stay stable. Two build artifacts,
both never hand-edited:
  assets/data.js        <- from content/*.md via scripts/build-data.py
  assets/source-data.js <- the source skill's real source code, mirrored into
                           附录 · 源码 by scripts/gen-source-data.py (ships
                           empty; the 源码 page/nav appear once it is filled).
USAGE
}

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TEMPLATE_DIR="$ROOT/assets/web-app-template"

TARGET=""
TITLE="Skill 解剖手册"
SKILL_NAME=""
SOURCE_PATH=""

for arg in "$@"; do
  case "$arg" in
    -h|--help)
      usage
      exit 0
      ;;
    --title=*)
      TITLE="${arg#--title=}"
      ;;
    --skill-name=*)
      SKILL_NAME="${arg#--skill-name=}"
      ;;
    --source-path=*)
      SOURCE_PATH="${arg#--source-path=}"
      ;;
    --*)
      echo "Unknown option: $arg" >&2
      usage >&2
      exit 1
      ;;
    *)
      if [[ -n "$TARGET" ]]; then
        echo "Only one target directory is supported." >&2
        usage >&2
        exit 1
      fi
      TARGET="$arg"
      ;;
  esac
done

if [[ -z "$TARGET" ]]; then
  usage >&2
  exit 1
fi

if [[ ! -d "$TEMPLATE_DIR" ]]; then
  echo "Template directory not found: $TEMPLATE_DIR" >&2
  exit 1
fi

if [[ -z "$SKILL_NAME" ]]; then
  SKILL_NAME="${TITLE% 解剖手册}"
  [[ -n "$SKILL_NAME" ]] || SKILL_NAME="$TITLE"
fi

if [[ -d "$TARGET" && -n "$(ls -A "$TARGET" 2>/dev/null || true)" ]]; then
  echo "Target directory exists and is not empty: $TARGET" >&2
  exit 1
fi

mkdir -p "$TARGET"
cp -R "$TEMPLATE_DIR"/. "$TARGET"/
mkdir -p "$TARGET/content"

sed_safe() {
  printf '%s' "$1" | sed -e 's/[\\&|]/\\&/g'
}

html_escape() {
  local value="$1"
  value="${value//&/&amp;}"
  value="${value//</&lt;}"
  value="${value//>/&gt;}"
  value="${value//\"/&quot;}"
  value="${value//\'/&#39;}"
  printf '%s' "$value"
}

json_string() {
  local value="$1"
  value="${value//\\/\\\\}"
  value="${value//\"/\\\"}"
  value="${value//$'\n'/\\n}"
  value="${value//$'\r'/\\r}"
  value="${value//$'\t'/\\t}"
  printf '"%s"' "$value"
}

replace_token() {
  local token="$1"
  local value
  local tmp
  value="$(sed_safe "$2")"
  while IFS= read -r -d '' file; do
    tmp="$(mktemp "${TMPDIR:-/tmp}/scaffold-web-app.XXXXXX")"
    sed "s|$token|$value|g" "$file" > "$tmp"
    mv "$tmp" "$file"
  done < <(find "$TARGET" -type f \( -name '*.html' -o -name '*.js' \) -print0)
}

replace_token "__HANDBOOK_TITLE__" "$(html_escape "$TITLE")"
replace_token "__HANDBOOK_TITLE_JSON__" "$(json_string "$TITLE")"
replace_token "__SKILL_NAME_JSON__" "$(json_string "$SKILL_NAME")"
replace_token "__SOURCE_PATH_JSON__" "$(json_string "$SOURCE_PATH")"

cat <<EOF
Created web handbook skeleton:
  $TARGET

Next:
  1. Write $TARGET/handbook-brief.md and $TARGET/page-packets/*.md.
  2. Write $TARGET/content/*.md per references/content-format.md.
  3. Draw real SVGs under $TARGET/assets/diagrams/ and register them in content/meta.md.
  4. Build:  python3 scripts/build-data.py "$TARGET"
  5. Check:  python3 scripts/check-content.py "$TARGET"
  6. Source: python3 scripts/gen-source-data.py "${SOURCE_PATH:-<源 skill 路径>}" "$TARGET"
            （镜像源 skill 真实源码到「附录 · 源码」；不跑则该附录不出现）
  7. Serve:  python3 -m http.server --directory "$TARGET" 8000
EOF
