#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

fail() {
  echo "FAIL: $*" >&2
  exit 1
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

assert_max_lines() {
  local file="$1"
  local max="$2"
  local lines
  lines="$(wc -l < "$file" | tr -d ' ')"
  [[ "$lines" -le "$max" ]] || fail "$file has $lines lines; expected <= $max"
}

cd "$ROOT"

assert_grep '^name: paoding-skill' SKILL.md
assert_grep '^description: Use when studying, reverse-engineering, comparing, reviewing, or learning from AI skill packages' SKILL.md
assert_grep 'Markdown report, structured pattern notes, or multi-page web handbook' SKILL.md
assert_grep '庖丁' SKILL.md
# 政策：generation/ 是工作产出目录（gitignore，不入库），精选样例搬到 examples/ 入库
assert_grep '^generation/' .gitignore
[[ -f examples/huashu-nuwa/index.html ]] || fail "expected sample handbook at examples/huashu-nuwa/"

assert_max_lines references/web-app-visuals.md 120
assert_max_lines references/web-production-flow.md 240
assert_max_lines references/stage-writing.md 300
assert_max_lines references/pain-dimensions.md 240
assert_max_lines references/content-format.md 330
assert_max_lines references/handbook-spec.md 330
assert_max_lines references/source-guide-writing.md 160

assert_grep 'data.js 是构建产物' SKILL.md
assert_grep 'pain-dimensions' SKILL.md
assert_grep 'source-guide-writing' SKILL.md

echo "skill structure tests passed"
