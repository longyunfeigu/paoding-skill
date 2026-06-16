#!/usr/bin/env python3
"""把源 skill 的真实源码打包成 <generation-dir>/assets/source-data.js，
供手册「附录 · 源码」页直接展示——读者不用再翻 repo。

这是 data.js 之外的第二个构建产物：data.js 是正文（来自 content/*.md），
source-data.js 是源码镜像（来自源 skill 包）。两者独立，互不覆盖。

用法:
    python3 scripts/gen-source-data.py <源 skill 路径> <generation 目录>

示例:
    python3 scripts/gen-source-data.py /path/to/nuwa-skill generation/huashu-nuwa

收录策略（「会去读的源码」）：
- 入口 SKILL.md（排最前）
- references/ 下所有文本文件（递归）
- scripts/ 下所有文本文件（递归）
不收 examples/（跑出来的产物不是源码）、assets/、图片、二进制、生成目录、.git。
单文件超过 MAX_BYTES 的截断并标注（防止把巨型文件灌进页面）。
"""

import sys
import json
from pathlib import Path

MAX_BYTES = 200_000  # 单文件上限，超出截断

# 扩展名 → 代码块语言标签
LANG = {
    ".md": "markdown", ".py": "python", ".sh": "bash", ".bash": "bash",
    ".js": "javascript", ".mjs": "javascript", ".ts": "typescript",
    ".json": "json", ".yaml": "yaml", ".yml": "yaml", ".toml": "toml",
    ".css": "css", ".html": "html", ".txt": "text", ".jsonc": "jsonc",
}
TEXT_EXTS = set(LANG.keys())


def role_note(rel: str) -> str:
    """根据路径给一句角色说明。"""
    if rel == "SKILL.md":
        return "入口 · 完整执行流程"
    if rel.startswith("references/"):
        return "reference · 被 SKILL.md 引用"
    if rel.startswith("scripts/"):
        return "script · 机械活兜底"
    return "源文件"


def collect(src: Path):
    """按 SKILL.md → references → scripts 的顺序收集文本源码文件。"""
    out = []

    entry = src / "SKILL.md"
    if entry.exists():
        out.append(entry)

    for sub in ("references", "scripts"):
        d = src / sub
        if not d.is_dir():
            continue
        for p in sorted(d.rglob("*")):
            if p.is_file() and p.suffix.lower() in TEXT_EXTS:
                out.append(p)

    return out


def main():
    if len(sys.argv) < 3:
        print("用法: python3 gen-source-data.py <源 skill 路径> <generation 目录>")
        sys.exit(1)

    src = Path(sys.argv[1]).expanduser().resolve()
    gen = Path(sys.argv[2]).expanduser().resolve()

    if not src.is_dir():
        print(f"❌ 源 skill 路径不存在: {src}")
        sys.exit(1)
    assets = gen / "assets"
    if not assets.is_dir():
        print(f"❌ 没找到 {assets}（先 scaffold 出手册骨架再跑这个）")
        sys.exit(1)

    files = collect(src)
    if not files:
        print(f"⚠️  在 {src} 下没找到 SKILL.md / references / scripts 里的文本源码")

    payload = []
    for p in files:
        rel = p.relative_to(src).as_posix()
        raw = p.read_text(encoding="utf-8", errors="replace")
        truncated = False
        if len(raw.encode("utf-8")) > MAX_BYTES:
            raw = raw.encode("utf-8")[:MAX_BYTES].decode("utf-8", errors="ignore")
            raw += "\n\n…（文件过长，已截断；完整内容见源 skill 仓库）"
            truncated = True
        payload.append({
            "path": rel,
            "lang": LANG.get(p.suffix.lower(), "text"),
            "note": role_note(rel) + (" · 已截断" if truncated else ""),
            "lines": raw.count("\n") + 1,
            "content": raw,
        })

    out = assets / "source-data.js"
    out.write_text(
        "window.SOURCE_FILES = " + json.dumps(payload, ensure_ascii=False) + ";\n",
        encoding="utf-8",
    )
    total = sum(f["lines"] for f in payload)
    print(f"OK {out}  （{len(payload)} 个源码文件 / {total} 行）")
    for f in payload:
        print(f"   - {f['path']}  [{f['lang']}, {f['lines']} 行]")


if __name__ == "__main__":
    main()
