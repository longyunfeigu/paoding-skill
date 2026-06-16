#!/usr/bin/env python3
"""Hard-gate machine checks for a built handbook.

Usage: python3 scripts/check-content.py generation/<skill-slug>

Runs AFTER scripts/build-data.py. Reads assets/data.js (the build artifact)
plus files on disk. Errors block delivery (exit 1); warnings print but pass.
The human-judgment half of the gate lives in references/voice-style-gate.md.
"""

import json
import re
import sys
from pathlib import Path

EVIDENCE_GRADES = {"实测", "作者证词", "结构推断", "假设"}
EFFECT_VALUES = {
    "管用",
    "可以松点", "得让一步", "用力过了", "可以简化", "不用做", "看情况", "也许碍事",
    "用不上", "没必要", "反而碍事",
}

errors = []
warnings = []


def error(msg):
    errors.append(msg)


def warn(msg):
    warnings.append(msg)


def load_handbook(target):
    data_js = target / "assets" / "data.js"
    if not data_js.is_file():
        print(f"找不到 {data_js}——先跑 scripts/build-data.py", file=sys.stderr)
        sys.exit(1)
    text = data_js.read_text(encoding="utf-8")
    m = re.search(r"window\.handbook\s*=\s*(\{.*\});\s*$", text, re.S)
    if not m:
        print(f"{data_js} 不是构建产物的形状（找不到 window.handbook = {{...}};）", file=sys.stderr)
        sys.exit(1)
    return json.loads(m.group(1))


def iter_blocks(handbook):
    """Yield (location, block) for every narrative block in reading order."""
    ov = handbook.get("overview", {})
    for name in ("openingScene", "primerBeats"):
        for b in ov.get(name, []):
            yield f"overview.{name}", b
    for i, stage in enumerate(handbook.get("walkthrough", []), 1):
        for name in ("sceneBody", "predictBody", "mechanismBody", "outputBody"):
            for b in stage.get(name, []):
                yield f"walkthrough.{stage.get('id', i)}.{name}", b
    sg = handbook.get("sourceGuide", {})
    for name in ("framework", "entryGuide", "referenceMap", "readingPath"):
        for b in sg.get(name, []):
            yield f"sourceGuide.{name}", b
    for f in sg.get("files", []):
        for b in f.get("body", []):
            yield f"sourceGuide.{f.get('path', '')}", b
    ap = handbook.get("applyIt", {})
    for name in ("scenario", "referenceAnswer"):
        for b in ap.get(name, []):
            yield f"applyIt.{name}", b


def check_diagrams(handbook, target):
    registry = {d.get("id"): d for d in handbook.get("diagrams", [])}
    for d in handbook.get("diagrams", []):
        image = d.get("image", "")
        if not image:
            error(f"图表 {d.get('id')} 没有 image 路径")
            continue
        f = target / image
        if not f.is_file():
            error(f"图表 {d.get('id')} 指向的文件不存在: {image}")
        elif f.stat().st_size == 0:
            error(f"图表 {d.get('id')} 的文件是 0 字节: {image}")

    referenced = set()
    ov = handbook.get("overview", {})
    for key in ("wowDiagramId", "panoramaDiagramId"):
        if ov.get(key):
            referenced.add((f"overview.{key}", ov[key]))
    if handbook.get("dataflow", {}).get("flowDiagramId"):
        referenced.add(("dataflow.flowDiagramId", handbook["dataflow"]["flowDiagramId"]))
    if handbook.get("archive", {}).get("panoramaDiagramId"):
        referenced.add(("archive.panoramaDiagramId", handbook["archive"]["panoramaDiagramId"]))
    for loc, block in iter_blocks(handbook):
        if block.get("kind") == "diagram":
            referenced.add((loc, block.get("id", "")))
    for loc, diagram_id in referenced:
        if diagram_id not in registry:
            error(f"{loc} 引用了不存在的图表 id: {diagram_id}（meta.md 的图表注册表里没有）")

    if not ov.get("panoramaDiagramId"):
        error("overview 缺少 panoramaDiagram——全景图先行是硬要求")


def check_baseline(handbook):
    if not handbook.get("meta", {}).get("baseline", "").strip():
        error("meta.baseline 为空——基线声明是硬要求")


def check_preview_links(handbook):
    stage_ids = {s.get("id") for s in handbook.get("walkthrough", [])}
    card_ids = {c.get("id") for c in handbook.get("archive", {}).get("cards", [])}
    for card in handbook.get("overview", {}).get("painPreview", []):
        title = card.get("title", "?")
        stage = card.get("goDeeperStage", "")
        if stage and stage not in stage_ids:
            error(f"预览卡「{title}」深入指向不存在的 {stage}")
        cid = card.get("goDeeperCard", "")
        if cid and cid not in card_ids:
            error(f"预览卡「{title}」深入指向不存在的档案卡 {cid}")


def check_stages(handbook):
    for i, stage in enumerate(handbook.get("walkthrough", []), 1):
        sid = stage.get("id", f"stage-{i}")
        if not stage.get("breadcrumb", "").strip():
            warn(f"{sid} 没有面包屑（我在哪）")
        for key, label in (("painDomain", "领域难点"), ("painBehavior", "行为难点")):
            pain = stage.get(key) or {}
            text = pain.get("text", "").strip()
            if not text:
                error(f"{sid} 的{label}为空（确无也要写）")
            elif text != "确无":
                grade = pain.get("evidence", "")
                if grade not in EVIDENCE_GRADES:
                    error(f"{sid} 的{label}证据等级不合法: {grade!r}")
        has_pain = any((stage.get(k) or {}).get("text", "确无") != "确无"
                       for k in ("painDomain", "painBehavior"))
        if has_pain:
            if not stage.get("predictBody"):
                error(f"{sid} 有难点但没有预测点")
            mech = stage.get("mechanismBody", [])
            if not any(b.get("kind") in ("quote", "code") for b in mech):
                error(f"{sid} 的机制小节没有任何引用块或代码块——机制必须贴原文（H2）")
        if not any(b.get("kind") in ("quote", "code") for b in stage.get("sceneBody", [])):
            error(f"{sid} 的场景再现没有实物片段（代码块或引用块）——光点文件名不算实物")
        output = stage.get("outputBody", [])
        if not any(b.get("kind") in ("quote", "code") for b in output):
            # TODO(升级): 女娲手册回填「真实产出」小节后，把这条升为 error。
            warn(f"{sid} 缺少带实物片段的「真实产出」小节——"
                 f"只有字段名没有值的 schema 不算产出（来源规则见 references/evidence-collection.md）")
        move = stage.get("reusableMove", "").strip()
        if not move:
            warn(f"{sid} 没有可偷的招")
        elif not move.startswith("当"):
            warn(f"{sid} 的可偷的招没有以触发条件（当…）起手")
        move_card = stage.get("moveCard", "")
        if move_card:
            card_ids = {c.get("id") for c in handbook.get("archive", {}).get("cards", [])}
            if move_card not in card_ids:
                error(f"{sid} 的对应档案指向不存在的卡: {move_card}")


def check_archive(handbook):
    archive = handbook.get("archive", {})
    cards = archive.get("cards", [])
    ids = {c.get("id") for c in cards}
    for c in cards:
        cid = c.get("id", "?")
        for key, label in (("symptom", "症状"), ("therefore", "Therefore"),
                           ("mechanismQuote", "机制原文"), ("solutionLayer", "解法层次")):
            if not str(c.get(key, "")).strip():
                error(f"卡片 {cid} 的 {label} 为空")
        if c.get("evidence") not in EVIDENCE_GRADES:
            error(f"卡片 {cid} 证据等级不合法: {c.get('evidence')!r}")
        contrast = c.get("contrast") or {}
        if not contrast.get("without", "").strip() or not contrast.get("with", "").strip():
            error(f"卡片 {cid} 最小对照不成对（两格都要有内容）")
        for s in c.get("counterScenarios", []):
            if s.get("effect") not in EFFECT_VALUES:
                error(f"卡片 {cid} 力度对比效果值不合法: {s.get('effect')!r}"
                      f"（合法值见 references/cards-patterns.md）")
        effects = {s.get("effect") for s in c.get("counterScenarios", [])}
        if effects and effects <= {"管用"}:
            error(f"卡片 {cid} 力度对比全是正面档——至少一行要是真实的让步或失效场景")
        for rp in c.get("related", []):
            if rp.get("to") not in ids:
                error(f"卡片 {cid} 的一起读指向不存在的卡: {rp.get('to')}")
    if cards and not (archive.get("residue") or archive.get("blindSpots")):
        warn("难点档案没有残渣也没有盲区——全量对账通常会留下点什么，确认不是漏写")


def check_glossary(handbook):
    for t in handbook.get("glossary", []):
        term = t.get("term", "?")
        if not str(t.get("example", "")).strip():
            error(f"术语「{term}」缺少 **例:**——没有实例的定义看了等于没看")


def _normalize(text):
    return re.sub(r"[\s，。、；：「」『』（）()\"'：:！？!?·…—\-]", "", text)


def check_altitude_dedup(handbook):
    """三高度复读粗查：预览卡的「坑」和它指向的档案卡「症状」不许近乎逐字。"""
    import difflib
    cards = {c.get("id"): c for c in handbook.get("archive", {}).get("cards", [])}
    for p in handbook.get("overview", {}).get("painPreview", []):
        card = cards.get(p.get("goDeeperCard", ""))
        if not card:
            continue
        a, b = _normalize(p.get("pit", "")), _normalize(card.get("symptom", ""))
        if not a or not b:
            continue
        ratio = difflib.SequenceMatcher(None, a, b).ratio()
        if ratio > 0.6:
            warn(f"预览卡「{p.get('title')}」的坑与档案卡 {card.get('id')} 症状"
                 f"相似度 {ratio:.0%}——三高度各自要加自己那一层，不是复制粘贴")


def check_term_density(handbook):
    """H6 粗查：同一段落里首次出现 >=2 个 glossary 术语。"""
    terms = [t.get("term", "") for t in handbook.get("glossary", []) if t.get("term")]
    if not terms:
        return
    seen = set()
    for loc, block in iter_blocks(handbook):
        if block.get("kind") != "para":
            continue
        text = block.get("text", "")
        fresh = [t for t in terms if t not in seen and t in text]
        for t in fresh:
            seen.add(t)
        if len(fresh) >= 2:
            warn(f"{loc} 一段里首次出现了 {len(fresh)} 个术语（{'、'.join(fresh)}）——"
                 f"H6 要求一段最多引入一个新术语（粗查，人工复核）")


PLUS_FORMULA_RE = re.compile(r"[^\s＋+]{2,}\s*[＋+]\s*[^\s＋+]{2,}\s*[＋+]\s*[^\s＋+]{2,}")
PAREN_DUMP_RE = re.compile(r"[（(][^）)]*、[^）)]*、[^）)]*、[^）)]*[）)]")


def check_voice_compression(handbook):
    """声纹粗查（类 4 / 类 10 的机器半边）：正文段落里的加号公式
    （「A + B + C」念出来像伪代码）和括号名词堆叠（一个括号塞 ≥3 个顿号）。
    只查 para；引用块里的源 skill 原文不查（原文长什么样是证据）。"""
    for loc, block in iter_blocks(handbook):
        if block.get("kind") != "para":
            continue
        text = block.get("text", "")
        if PLUS_FORMULA_RE.search(text):
            warn(f"{loc} 出现加号公式（「A + B + C」式压缩）——展开成场景，"
                 f"见 voice-gate-examples.md 类 10")
        if PAREN_DUMP_RE.search(text):
            warn(f"{loc} 一个括号里塞了 ≥4 个并列项——正文不堆名词，"
                 f"给一个例子、其余交给表格或卡片（类 4）")


def check_toolbox(handbook):
    """带走工具箱粗查：每站 callout 密度 ≤3（满屏荧光笔等于没有荧光笔）；
    相邻两个 callout 之间至少隔一个正文块（连发会稀释高亮）；
    工具箱条目本体由 build 校验（档位合法、正文必须是引用块）。"""
    prev = None
    for loc, block in iter_blocks(handbook):
        if block.get("kind") == "steal" and prev and prev[1].get("kind") == "steal" \
                and prev[0] == loc:
            warn(f"{loc} 有两个相邻的可带走 callout（「{prev[1].get('name')}」→"
                 f"「{block.get('name')}」）——中间至少隔一个正文块，连发稀释高亮")
        prev = (loc, block)

    items = handbook.get("toolbox", [])
    per_where = {}
    for it in items:
        key = (it.get("page"), it.get("where"))
        per_where[key] = per_where.get(key, 0) + 1
    for (page, where), count in per_where.items():
        if count > 3:
            warn(f"{page} 的「{where}」有 {count} 个可带走 callout——"
                 f"每站最多 3 个，挑最值钱的，其余收进档案")
    for it in items:
        body = (it.get("text") or "").strip()
        if body and not any(w in body for w in ("你", "你的")):
            warn(f"可带走「{it.get('name')}」正文没有出现第二人称——"
                 f"callout 是对读者说话的块，写法见 references/steal-scan.md")


def main():
    if len(sys.argv) != 2:
        print(__doc__.strip(), file=sys.stderr)
        return 2
    target = Path(sys.argv[1])
    handbook = load_handbook(target)

    check_baseline(handbook)
    check_preview_links(handbook)
    check_diagrams(handbook, target)
    check_stages(handbook)
    check_archive(handbook)
    check_glossary(handbook)
    check_altitude_dedup(handbook)
    check_term_density(handbook)
    check_voice_compression(handbook)
    check_toolbox(handbook)

    for w in warnings:
        print(f"warning: {w}")
    for e in errors:
        print(f"ERROR: {e}")
    if errors:
        print(f"\n未通过：{len(errors)} 个错误，{len(warnings)} 个警告。")
        return 1
    print(f"\n通过：0 个错误，{len(warnings)} 个警告。"
          f"（机器检查只是 gate 的一半，另一半见 references/voice-style-gate.md）")
    return 0


if __name__ == "__main__":
    sys.exit(main())
