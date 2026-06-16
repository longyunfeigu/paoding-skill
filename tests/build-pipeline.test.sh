#!/usr/bin/env bash
# content/*.md -> build-data.py -> data.js -> check-content.py 全链路回归
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
FIXTURE="$ROOT/tests/fixtures/content-sample"

fail() {
  echo "FAIL: $*" >&2
  exit 1
}

TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

OUT="$TMP/generation/demo-skill"
bash "$ROOT/scripts/scaffold-web-app.sh" "$OUT" \
  --title="示例 Skill 解剖手册" --skill-name="示例 Skill" \
  --source-path="/tmp/example-skill" >/dev/null
cp "$FIXTURE"/*.md "$OUT/content/"

# 构建成功且产物可被 node 解析
python3 "$ROOT/scripts/build-data.py" "$OUT" >/dev/null || fail "build-data.py failed on fixture"
node --check "$OUT/assets/data.js" >/dev/null || fail "generated data.js has a syntax error"
grep -q '"painDomain"' "$OUT/assets/data.js" || fail "stage pains missing from data.js"
grep -q '"transferability": "低"' "$OUT/assets/data.js" || fail "low-transferability card missing"
grep -q '"example"' "$OUT/assets/data.js" || fail "glossary example field missing from data.js"
grep -q '"outputBody"' "$OUT/assets/data.js" || fail "stage outputBody missing from data.js"
grep -q 'interview-1995' "$OUT/assets/data.js" || fail "dataflow specimen block missing from data.js"
grep -q '"sourceGuide"' "$OUT/assets/data.js" || fail "source guide missing from data.js"
grep -q 'references/pain.md' "$OUT/assets/data.js" || fail "source guide file card missing from data.js"

# check-content：缺 SVG 时必须失败
if python3 "$ROOT/scripts/check-content.py" "$OUT" >/dev/null 2>&1; then
  fail "check-content.py should fail while the referenced SVG is missing"
fi
printf '<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"/>' \
  > "$OUT/assets/diagrams/main-flow.svg"
python3 "$ROOT/scripts/check-content.py" "$OUT" >/dev/null || fail "check-content.py failed on valid fixture"

# 报错路径：glossary 缺「例」字段 -> 构建必须失败
sed '/^\*\*例:\*\*/d' "$FIXTURE/glossary.md" > "$OUT/content/glossary.md"
if python3 "$ROOT/scripts/build-data.py" "$OUT" >/dev/null 2>&1; then
  fail "build-data.py should reject a glossary term without an example field"
fi
cp "$FIXTURE/glossary.md" "$OUT/content/glossary.md"

# 报错路径：症状缺证据标记 -> 构建必须失败并报出文件名
sed 's/（证据：作者证词）//' "$FIXTURE/archive.md" > "$OUT/content/archive.md"
if python3 "$ROOT/scripts/build-data.py" "$OUT" >/dev/null 2>"$TMP/err.log"; then
  fail "build-data.py should reject a symptom without an evidence marker"
fi
grep -q "archive.md" "$TMP/err.log" || fail "build error should name the offending file"
cp "$FIXTURE/archive.md" "$OUT/content/archive.md"

# 报错路径：源包导读「文件里实际讲了什么」太短 -> 构建必须失败
sed '0,/^\*\*文件里实际讲了什么:\*\*.*/s//**文件里实际讲了什么:** 它定义核心行为。/' \
  "$FIXTURE/source-guide.md" > "$OUT/content/source-guide.md"
if python3 "$ROOT/scripts/build-data.py" "$OUT" >/dev/null 2>"$TMP/source-guide.err"; then
  fail "build-data.py should reject a one-sentence source-guide actual-content field"
fi
grep -q "source-guide.md" "$TMP/source-guide.err" || fail "source-guide build error should name the offending file"
cp "$FIXTURE/source-guide.md" "$OUT/content/source-guide.md"

# 报错路径：有难点但删掉预测点 -> 构建必须失败
python3 - "$OUT/content/walkthrough.md" <<'PY'
import sys
p = sys.argv[1]
s = open(p, encoding="utf-8").read()
open(p, "w", encoding="utf-8").write(s.replace("### 预测点\n\n你会加什么规则防住它？先写下来。\n", ""))
PY
if python3 "$ROOT/scripts/build-data.py" "$OUT" >/dev/null 2>&1; then
  fail "build-data.py should reject a pain-carrying stage without a predict point"
fi

# 六页 + index 在 DOM 模拟器里全部渲染、关键区块命中
cp "$FIXTURE/walkthrough.md" "$OUT/content/walkthrough.md"
python3 "$ROOT/scripts/build-data.py" "$OUT" >/dev/null
node -e '
const fs = require("fs");
const dataSrc = fs.readFileSync(process.argv[1] + "/assets/data.js", "utf8");
const siteSrc = fs.readFileSync(process.argv[1] + "/assets/site.js", "utf8");
const checks = {
  index: ["六章 + 一个附录"],
  overview: ["本书的基线", "流水线全景"],
  walkthrough: ["这一站的难点", "先猜一遍", "确无——这一站没有这类难点", "真实产出", "term-link",
                "<strong>必须先建目录</strong>", "inline-code"],
  dataflow: ["为什么长这样", "标本", "interview-1995"],
  "source-guide": ["源包导读", "承重文件", "references/pain.md", "阅读优先级"],
  archive: ["没有这个机制", "残渣与砍掉候选", "盲区"],
  "apply-it": ["展开参考答案"],
  glossary: ["附录"]
};
for (const [page, markers] of Object.entries(checks)) {
  const app = { innerHTML: "" };
  const win = { location: { pathname: page === "index" ? "/index.html" : "/pages/x.html" } };
  const doc = { body: { dataset: { page } }, title: "", querySelector: () => app };
  new Function("window", "document", dataSrc + "\n" + siteSrc)(win, doc);
  const missing = markers.filter((m) => !app.innerHTML.includes(m));
  if (missing.length) { console.error(`render check failed on ${page}: ${missing}`); process.exit(1); }
  if (page === "walkthrough" && app.innerHTML.includes("**必须先建目录**")) {
    console.error("inline bold rendered literally on walkthrough"); process.exit(1);
  }
}
' "$OUT" || fail "rendered pages are missing expected blocks"

echo "build-pipeline tests passed"
