#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SCRIPT="$ROOT/scripts/scaffold-web-app.sh"

fail() {
  echo "FAIL: $*" >&2
  exit 1
}

assert_file() {
  [[ -f "$1" ]] || fail "missing file: $1"
}

assert_dir() {
  [[ -d "$1" ]] || fail "missing dir: $1"
}

assert_grep() {
  local pattern="$1"
  local file="$2"
  grep -Eq "$pattern" "$file" || fail "expected pattern '$pattern' in $file"
}

assert_not_grep() {
  local pattern="$1"
  local file="$2"
  if grep -Eq "$pattern" "$file"; then
    fail "unexpected pattern '$pattern' in $file"
  fi
}

[[ -x "$SCRIPT" ]] || fail "script is not executable: $SCRIPT"

TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

OUT="$TMP/generation/demo-skill"
"$SCRIPT" "$OUT" --title="Demo Skill Handbook" --source-path="/tmp/source-skill"
assert_dir "$TMP/generation"

assert_file "$OUT/index.html"
for page in overview walkthrough dataflow archive apply-it glossary; do
  assert_file "$OUT/pages/$page.html"
  assert_grep "data-page=\"$page\"" "$OUT/pages/$page.html"
done
for page in file-map design-choices patterns; do
  [[ ! -f "$OUT/pages/$page.html" ]] || fail "stale v1 page shell: $page.html"
done

assert_dir "$OUT/content"
assert_file "$OUT/assets/site.js"
assert_file "$OUT/assets/styles.css"
assert_file "$OUT/assets/data.js"
assert_dir "$OUT/assets/diagrams"
assert_file "$OUT/assets/diagrams/.gitkeep"

assert_grep "Demo Skill Handbook" "$OUT/index.html"
assert_grep "title: \"Demo Skill Handbook\"" "$OUT/assets/data.js"
assert_grep "sourcePath: \"/tmp/source-skill\"" "$OUT/assets/data.js"
assert_grep "window.handbook" "$OUT/assets/data.js"
assert_grep "renderers" "$OUT/assets/site.js"
node --check "$OUT/assets/data.js" >/dev/null

for file in "$OUT/assets/data.js" "$OUT/index.html" "$OUT"/pages/*.html; do
  assert_not_grep "__HANDBOOK|__SKILL|__SOURCE" "$file"
done

for file in "$OUT/assets/site.js" "$OUT/assets/styles.css" "$OUT/index.html" "$OUT"/pages/*.html; do
  assert_not_grep "nuwa|女娲|塔勒布" "$file"
done

NONEMPTY="$TMP/nonempty"
mkdir -p "$NONEMPTY"
touch "$NONEMPTY/existing.txt"
if "$SCRIPT" "$NONEMPTY" >/tmp/scaffold-web-app-test.out 2>/tmp/scaffold-web-app-test.err; then
  fail "script should refuse a non-empty target directory"
fi
assert_file "$NONEMPTY/existing.txt"

QUOTED="$TMP/generation/quoted-skill"
"$SCRIPT" "$QUOTED" \
  --title='Demo "Quoted" & <Skill>' \
  --skill-name='Skill "Q"' \
  --source-path='/tmp/source "skill"'

assert_grep 'Demo &quot;Quoted&quot; &amp; &lt;Skill&gt;' "$QUOTED/index.html"
assert_grep 'title: "Demo \\"Quoted\\" & <Skill>"' "$QUOTED/assets/data.js"
assert_grep 'skillName: "Skill \\"Q\\""' "$QUOTED/assets/data.js"
assert_grep 'sourcePath: "/tmp/source \\"skill\\""' "$QUOTED/assets/data.js"
node --check "$QUOTED/assets/data.js" >/dev/null

echo "scaffold-web-app tests passed"
