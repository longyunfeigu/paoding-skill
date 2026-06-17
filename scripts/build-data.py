#!/usr/bin/env python3
"""Build assets/data.js from content/*.md.

Usage: python3 scripts/build-data.py generation/<skill-slug>

The format contract lives in references/content-format.md. data.js is a build
artifact: never hand-write it. Zero third-party dependencies.
"""

import json
import re
import sys
from pathlib import Path

EVIDENCE_RE = re.compile(r"（证据：(实测|作者证词|结构推断|假设)）\s*$")
FIELD_RE = re.compile(r"^\*\*(.+?):?\s*[:：]\*\*\s*(.*)$")
DIAGRAM_REF_RE = re.compile(r"^!diagram\((.+?)\)\s*$")
STEAL_REF_RE = re.compile(r"^!steal\((.+?)\)\s*$")
DIMENSIONS = ["领域-工程", "领域-认知", "行为", "编排", "品味", "需求", "平台"]
STEAL_TIERS = ["直接抄走", "思路带走"]


class BuildError(Exception):
    pass


def err(path, line, msg):
    raise BuildError(f"{path}:{line}: {msg}")


# ---------------------------------------------------------------- tokenizer

def tokenize(path):
    """Return (frontmatter dict, list of nodes).

    Node: dict with keys kind, line, plus kind-specific payload.
    Kinds: h2, h3, field, para, list, code, quote, table, diagram.
    """
    text = path.read_text(encoding="utf-8")
    lines = text.splitlines()
    i = 0
    front = {}

    if i < len(lines) and lines[i].strip() == "---":
        i += 1
        while i < len(lines) and lines[i].strip() != "---":
            line = lines[i]
            if line.strip():
                if ":" not in line:
                    err(path, i + 1, f"frontmatter 行缺少冒号: {line!r}")
                key, _, value = line.partition(":")
                front[key.strip()] = value.strip()
            i += 1
        if i >= len(lines):
            err(path, 1, "frontmatter 没有结束的 --- ")
        i += 1

    nodes = []
    n = len(lines)
    while i < n:
        line = lines[i]
        stripped = line.strip()
        lineno = i + 1

        if not stripped:
            i += 1
            continue

        if stripped.startswith("#### "):
            nodes.append({"kind": "h4", "line": lineno, "text": stripped[5:].strip()})
            i += 1
            continue
        if stripped.startswith("### "):
            nodes.append({"kind": "h3", "line": lineno, "text": stripped[4:].strip()})
            i += 1
            continue
        if stripped.startswith("## "):
            nodes.append({"kind": "h2", "line": lineno, "text": stripped[3:].strip()})
            i += 1
            continue

        if stripped.startswith("```"):
            lang = stripped[3:].strip()
            i += 1
            body = []
            while i < n and not lines[i].strip().startswith("```"):
                body.append(lines[i])
                i += 1
            if i >= n:
                err(path, lineno, "代码块没有结束的 ``` ")
            i += 1
            nodes.append({"kind": "code", "line": lineno, "lang": lang, "text": "\n".join(body)})
            continue

        m = DIAGRAM_REF_RE.match(stripped)
        if m:
            nodes.append({"kind": "diagram", "line": lineno, "id": m.group(1).strip()})
            i += 1
            continue

        m = STEAL_REF_RE.match(stripped)
        if m:
            nodes.append({"kind": "steal", "line": lineno, "header": m.group(1).strip()})
            i += 1
            continue

        if stripped.startswith("|"):
            rows = []
            while i < n and lines[i].strip().startswith("|"):
                cells = [c.strip() for c in lines[i].strip().strip("|").split("|")]
                rows.append(cells)
                i += 1
            rows = [r for r in rows if not all(set(c) <= set("-: ") for c in r)]
            nodes.append({"kind": "table", "line": lineno, "rows": rows})
            continue

        if stripped.startswith("- "):
            items = []
            while i < n and lines[i].strip().startswith("- "):
                items.append(lines[i].strip()[2:].strip())
                i += 1
            nodes.append({"kind": "list", "line": lineno, "items": items})
            continue

        if stripped.startswith("> "):
            quote = []
            while i < n and lines[i].strip().startswith(">"):
                inner = lines[i].strip()
                inner = inner[1:] if inner.startswith(">") else inner
                if inner.startswith(" "):
                    inner = inner[1:]
                quote.append(inner.rstrip())
                i += 1
            nodes.append({"kind": "quote", "line": lineno,
                          "text": "\n".join(q.strip() for q in quote),
                          "blocks": quote_subblocks(quote)})
            continue

        m = FIELD_RE.match(stripped)
        if m:
            name = m.group(1).strip().rstrip(":：").strip()
            value_lines = [m.group(2).strip()] if m.group(2).strip() else []
            i += 1
            while i < n:
                nxt = lines[i].strip()
                if (not nxt or nxt.startswith(("#", "```", "|", "- ", "> ", "**"))
                        or DIAGRAM_REF_RE.match(nxt) or STEAL_REF_RE.match(nxt)):
                    break
                value_lines.append(nxt)
                i += 1
            nodes.append({"kind": "field", "line": lineno, "name": name,
                          "value": "\n".join(value_lines)})
            continue

        para = [stripped]
        i += 1
        while i < n:
            nxt = lines[i].strip()
            if (not nxt or nxt.startswith(("#", "```", "|", "- ", "> ", "**"))
                    or DIAGRAM_REF_RE.match(nxt) or STEAL_REF_RE.match(nxt)):
                break
            para.append(nxt)
            i += 1
        nodes.append({"kind": "para", "line": lineno, "text": "\n".join(para)})

    return front, nodes


# ---------------------------------------------------------------- helpers

HEADING_RE = re.compile(r"^#{1,6}\s+(.*)$")


def quote_subblocks(qlines):
    """Parse the inside of a quote into structured sub-blocks.

    Quoted source text often carries tables, lists, fenced code, and
    headings. Flattening them into one string renders as raw pipes and
    hashes; this keeps the structure so the renderer can show it.
    Sub-block kinds: para, list, table, code.
    """
    blocks = []
    i, n = 0, len(qlines)
    while i < n:
        s = qlines[i].strip()
        if not s:
            i += 1
            continue
        if s.startswith("```"):
            lang = s[3:].strip()
            body = []
            i += 1
            while i < n and not qlines[i].strip().startswith("```"):
                body.append(qlines[i])
                i += 1
            i += 1  # closing fence (or end of quote)
            block = {"kind": "code", "text": "\n".join(body)}
            if lang:
                block["lang"] = lang
            blocks.append(block)
            continue
        if s.startswith("|"):
            rows = []
            while i < n and qlines[i].strip().startswith("|"):
                cells = [c.strip() for c in qlines[i].strip().strip("|").split("|")]
                rows.append(cells)
                i += 1
            rows = [r for r in rows if not all(set(c) <= set("-: ") for c in r)]
            blocks.append({"kind": "table", "rows": rows})
            continue
        if s.startswith("- ") or s.startswith("* "):
            items = []
            while i < n and (qlines[i].strip().startswith("- ")
                             or qlines[i].strip().startswith("* ")):
                items.append(qlines[i].strip()[2:].strip())
                i += 1
            blocks.append({"kind": "list", "items": items})
            continue
        m = HEADING_RE.match(s)
        if m:
            blocks.append({"kind": "para", "text": f"**{m.group(1).strip()}**"})
            i += 1
            continue
        para = [s]
        i += 1
        while i < n:
            nxt = qlines[i].strip()
            if not nxt or nxt.startswith(("#", "```", "|", "- ", "* ")):
                break
            para.append(nxt)
            i += 1
        blocks.append({"kind": "para", "text": "\n".join(para)})
    return blocks


def split_sections(nodes):
    """Group nodes by h2 heading -> {title: [nodes]} preserving order."""
    sections = {}
    current = None
    for node in nodes:
        if node["kind"] == "h2":
            current = node["text"]
            sections.setdefault(current, [])
        elif current is not None:
            sections[current].append(node)
    return sections


def split_items(nodes):
    """Group nodes by h3 heading -> list of (title, line, [nodes])."""
    items = []
    current = None
    for node in nodes:
        if node["kind"] == "h3":
            current = (node["text"], node["line"], [])
            items.append(current)
        elif current is not None:
            current[2].append(node)
    return items


def to_blocks(nodes, path):
    blocks = []
    i = 0
    while i < len(nodes):
        node = nodes[i]
        if node["kind"] == "para":
            blocks.append({"kind": "para", "text": node["text"]})
        elif node["kind"] == "list":
            blocks.append({"kind": "list", "items": node["items"]})
        elif node["kind"] == "code":
            block = {"kind": "code", "text": node["text"]}
            if node["lang"]:
                block["lang"] = node["lang"]
            blocks.append(block)
        elif node["kind"] == "quote":
            blocks.append({"kind": "quote", "text": node["text"],
                           "blocks": node.get("blocks", [])})
        elif node["kind"] == "h4":
            blocks.append({"kind": "h4", "text": node["text"]})
        elif node["kind"] == "diagram":
            blocks.append({"kind": "diagram", "id": node["id"]})
        elif node["kind"] == "steal":
            parts = [p.strip() for p in re.split(r"[｜|]", node["header"])]
            if len(parts) != 3 or not all(parts):
                err(path, node["line"],
                    "!steal 头需要 `名字 ｜ 档位 ｜ 用在哪` 三段: " f"{node['header']!r}")
            name, tier, scene = parts
            if tier not in STEAL_TIERS:
                err(path, node["line"],
                    f"!steal 档位 {tier!r} 不合法（合法：{'、'.join(STEAL_TIERS)}）")
            if i + 1 >= len(nodes) or nodes[i + 1]["kind"] != "quote":
                err(path, node["line"],
                    "!steal(...) 后面必须紧跟一个 > 引用块作为正文（第二人称：你将来怎么用）")
            body = nodes[i + 1]
            blocks.append({"kind": "steal", "name": name, "tier": tier,
                           "scene": scene, "text": body["text"],
                           "blocks": body.get("blocks", [])})
            i += 1  # consume the quote body
        elif node["kind"] == "field":
            err(path, node["line"], f"此区块不接受字段行: **{node['name']}:**")
        elif node["kind"] == "table":
            blocks.append({"kind": "table", "rows": node["rows"]})
        i += 1
    return blocks


def fields_map(nodes, path, label_map, context):
    """Map field nodes through label_map {中文label: key}; unknown -> error."""
    out = {}
    for node in nodes:
        if node["kind"] != "field":
            continue
        if node["name"] not in label_map:
            err(path, node["line"],
                f"{context} 出现未知字段 **{node['name']}:**（合法字段：{'、'.join(label_map)}）")
        out[label_map[node["name"]]] = node["value"]
    return out


def split_evidence(value, path, line, required=True):
    value = value.strip()
    if value == "确无":
        return {"text": "确无"}
    m = EVIDENCE_RE.search(value)
    if not m:
        if required:
            err(path, line, f"缺少证据标记（证据：实测/作者证词/结构推断/假设）: {value[:40]!r}")
        return {"text": value}
    return {"text": EVIDENCE_RE.sub("", value).strip(), "evidence": m.group(1)}


def next_node_of(nodes, idx, kind, path, line, what):
    for node in nodes[idx + 1:]:
        if node["kind"] == "field" or node["kind"] in ("h2", "h3"):
            break
        if node["kind"] == kind:
            return node
    err(path, line, f"**{what}:** 后面应紧跟一个{kind}区块")


# ---------------------------------------------------------------- per-file

def build_meta(path):
    front, nodes = tokenize(path)
    for key in ("title", "skillName", "sourcePath"):
        if key not in front:
            err(path, 1, f"meta.md frontmatter 缺少 {key}")
    meta = {
        "title": front.get("title", ""),
        "skillName": front.get("skillName", ""),
        "audience": front.get("audience", "想偷招的人 / 还没用过这个 skill 的 AI"),
        "sourcePath": front.get("sourcePath", ""),
        "version": front.get("version", "v1"),
        "baseline": front.get("baseline", ""),
    }
    if not meta["baseline"]:
        err(path, 1, "meta.md frontmatter 缺少 baseline（基线声明是硬要求）")

    sections = split_sections(nodes)
    if "贯穿例子" not in sections:
        err(path, 1, "meta.md 缺少 `## 贯穿例子`")
    example = fields_map(sections["贯穿例子"], path, {
        "label": "label",
        "用户请求": "userRequest",
        "为什么挑这个例子": "whyThisExample",
        "预期产出": "expectedOutput",
    }, "贯穿例子")

    diagrams = []
    for title, line, item_nodes in split_items(sections.get("图表", [])):
        fields = fields_map(item_nodes, path, {
            "标题": "title", "说明": "description",
            "kicker": "kicker", "文件": "image",
        }, f"图表 {title}")
        if "image" not in fields:
            err(path, line, f"图表 {title} 缺少 **文件:**")
        diagrams.append({"id": title, **fields})

    return meta, example, diagrams


def build_overview(path):
    front, nodes = tokenize(path)
    sections = split_sections(nodes)
    for required in ("开场", "Primer", "难点预览", "章节逻辑"):
        if required not in sections:
            err(path, 1, f"overview.md 缺少 `## {required}`")

    preview = []
    for title, line, item_nodes in split_items(sections["难点预览"]):
        fields = fields_map(item_nodes, path, {
            "坑": "pit", "最值得学的一招": "hook",
            "维度": "dimension", "深入": "goDeeper",
        }, f"难点预览 {title}")
        for key, label in (("pit", "坑"), ("hook", "最值得学的一招"),
                           ("dimension", "维度"), ("goDeeper", "深入")):
            if key not in fields:
                err(path, line, f"预览卡 {title} 缺少 **{label}:**")
        if fields["dimension"] not in DIMENSIONS:
            err(path, line, f"预览卡 {title} 维度 {fields['dimension']!r} 不合法"
                            f"（合法：{'、'.join(DIMENSIONS)}）")
        stage_m = re.search(r"stage-\d+", fields["goDeeper"])
        if not stage_m:
            err(path, line, f"预览卡 {title} 的 **深入:** 需要含 stage-NN（如 stage-06 · A1）")
        card_m = re.search(r"\bA\d+\b", fields["goDeeper"])
        fields["goDeeperStage"] = stage_m.group(0)
        fields["goDeeperCard"] = card_m.group(0) if card_m else ""
        preview.append({"title": title, **fields})
    if not 3 <= len(preview) <= 5:
        err(path, 1, f"难点预览需要 3-5 张卡（现在 {len(preview)} 张）——这是橱窗不是档案")

    chapter_logic = []
    for node in sections["章节逻辑"]:
        if node["kind"] == "list":
            for item in node["items"]:
                if "｜" not in item:
                    err(path, node["line"], f"章节逻辑行需要 `章名｜理由` 格式: {item!r}")
                chapter, _, why = item.partition("｜")
                chapter_logic.append({"chapter": chapter.strip(), "why": why.strip()})

    return {
        "h1": front.get("h1", ""),
        "oneLiner": front.get("oneLiner", ""),
        "openingScene": to_blocks(sections["开场"], path),
        "predictPrompt": front.get("predictPrompt", ""),
        "primerBeats": to_blocks(sections["Primer"], path),
        "wowSetup": front.get("wowSetup", ""),
        "wowDiagramId": front.get("wowDiagram", ""),
        "wowMoment": front.get("wowMoment", ""),
        "painPreview": preview,
        "panoramaDiagramId": front.get("panoramaDiagram", ""),
        "shapeReason": front.get("shapeReason", "按读者意图排，不按源文件顺序"),
        "chapterLogic": chapter_logic,
    }


STAGE_SECTIONS = ["场景再现", "难点", "预测点", "机制与产出", "真实产出", "收尾", "阶段速查"]
QUICKREF_LABELS = {
    "这一步收到什么": "receives", "skill 让我读什么": "reads",
    "我不能直接做什么": "blockedShortcut", "我做什么": "action",
    "我产出什么": "output", "机制线索": "mechanismThread",
    "下一步谁用它": "nextConsumer", "自由度": "freedom",
}


def build_walkthrough(path):
    _, nodes = tokenize(path)
    stages = []
    for raw_title, line, stage_nodes in [(t, l, ns) for t, l, ns in iter_h2(nodes)]:
        m = re.match(r"^(stage-\d+)\s+(.+)$", raw_title)
        if not m:
            err(path, line, f"stage 标题需要 `## stage-NN 标题` 格式: {raw_title!r}")
        stage_id, title = m.group(1), m.group(2)

        top_fields = {}
        sub = {}
        current = None
        for node in stage_nodes:
            if node["kind"] == "h3":
                if node["text"] not in STAGE_SECTIONS:
                    err(path, node["line"],
                        f"{stage_id} 出现未知小节 `### {node['text']}`（合法：{'、'.join(STAGE_SECTIONS)}）")
                current = node["text"]
                sub.setdefault(current, [])
            elif current is None:
                if node["kind"] == "field":
                    top_fields[node["name"]] = node
                else:
                    err(path, node["line"], f"{stage_id} 小节之外只允许字段行")
            else:
                sub[current].append(node)

        allowed_top = {"kicker", "summary", "面包屑", "接上一步"}
        for name, node in top_fields.items():
            if name not in allowed_top:
                err(path, node["line"], f"{stage_id} 未知字段 **{name}:**")

        for required in ("场景再现", "难点", "机制与产出", "收尾"):
            if required not in sub:
                err(path, line, f"{stage_id} 缺少 `### {required}`")

        pain_fields = {}
        for node in sub["难点"]:
            if node["kind"] != "field":
                err(path, node["line"], f"{stage_id} 难点小节只允许字段行")
            if node["name"] not in ("领域难点", "行为难点"):
                err(path, node["line"], f"{stage_id} 难点小节未知字段 **{node['name']}:**")
            pain_fields[node["name"]] = split_evidence(node["value"], path, node["line"])
        for required in ("领域难点", "行为难点"):
            if required not in pain_fields:
                err(path, line, f"{stage_id} 难点小节缺少 **{required}:**（确无也要写）")

        has_pain = any(p.get("text") != "确无" for p in pain_fields.values())
        predict = to_blocks(sub.get("预测点", []), path)
        if has_pain and not predict:
            err(path, line, f"{stage_id} 有难点但缺少 `### 预测点`（机制揭晓前必须让读者先猜）")

        closing_fields = {}
        challenges = []
        for node in sub["收尾"]:
            if node["kind"] == "field":
                if node["name"] not in ("可偷的招", "对应档案", "下一步靠这个", "练习"):
                    err(path, node["line"], f"{stage_id} 收尾未知字段 **{node['name']}:**")
                closing_fields[node["name"]] = node["value"]
            elif node["kind"] == "list":
                challenges = node["items"]
        move_card = closing_fields.get("对应档案", "").strip()
        if move_card and not re.fullmatch(r"A\d+", move_card):
            err(path, line, f"{stage_id} 对应档案需要 A<n> 格式: {move_card!r}")

        quickref = fields_map(sub.get("阶段速查", []), path, QUICKREF_LABELS,
                              f"{stage_id} 阶段速查")

        stages.append({
            "id": stage_id,
            "title": title,
            "kicker": top_fields.get("kicker", {}).get("value", ""),
            "summary": top_fields.get("summary", {}).get("value", ""),
            "breadcrumb": top_fields.get("面包屑", {}).get("value", ""),
            "hookOpen": top_fields.get("接上一步", {}).get("value", ""),
            "sceneBody": to_blocks(sub["场景再现"], path),
            "painDomain": pain_fields["领域难点"],
            "painBehavior": pain_fields["行为难点"],
            "predictBody": predict,
            "mechanismBody": to_blocks(sub["机制与产出"], path),
            "outputBody": to_blocks(sub.get("真实产出", []), path),
            "reusableMove": closing_fields.get("可偷的招", ""),
            "moveCard": move_card,
            "hookClose": closing_fields.get("下一步靠这个", ""),
            "challenges": challenges,
            "quickref": quickref,
        })
    if not stages:
        err(path, 1, "walkthrough.md 没有任何 `## stage-NN` ")
    return stages


def iter_h2(nodes):
    groups = []
    current = None
    for node in nodes:
        if node["kind"] == "h2":
            current = (node["text"], node["line"], [])
            groups.append(current)
        elif current is not None:
            current[2].append(node)
    return groups


def build_dataflow(path):
    front, nodes = tokenize(path)
    sections = split_sections(nodes)
    if "产物卡" not in sections:
        err(path, 1, "dataflow.md 缺少 `## 产物卡`")
    artifacts = []
    label_map = {
        "谁写它": "writtenBy", "谁读它": "readBy", "它管什么": "owns",
        "它不管什么": "doesNotOwn", "为什么长这样": "whyThisShape",
        "写错会坏什么": "failureIfWrong",
    }
    for title, line, item_nodes in split_items(sections["产物卡"]):
        fields = fields_map(item_nodes, path, label_map, f"产物卡 {title}")
        for key, label in label_map.items():
            if label not in fields:
                err(path, line, f"产物卡 {title} 缺少 **{key}:**")
        body = to_blocks([n for n in item_nodes if n["kind"] != "field"], path)
        artifacts.append({"path": title.strip("`"), **fields, "body": body})
    return {
        "flowDiagramId": front.get("flowDiagram", ""),
        "intro": front.get("intro", ""),
        "artifacts": artifacts,
    }


SOURCE_FILE_LABELS = {
    "文件类型": "fileType",
    "先给读者搭桥": "readerBridge",
    "文件里实际讲了什么": "actualContent",
    "读它时先抓什么": "readingFocus",
    "它把细节交给谁": "handoff",
    "读完你应该能复述": "takeaway",
    "可以先略过什么": "skippable",
}

SOURCE_PRIORITY_LABELS = {
    "文件": "files",
    "原因": "reason",
}

SENTENCE_RE = re.compile(r"[^。！？!?；;]+[。！？!?；;]?")
SOURCE_GUIDE_PLUS_RE = re.compile(r"[\w一-龥][^。！？!?；;]{0,24}\s*[+＋]\s*[^。！？!?；;]{1,24}[\w一-龥]")
SOURCE_GUIDE_JARGON_RE = re.compile(r"(外包给|甩给|丢给)\s*`?references/?`?", re.I)


def reject_source_guide_compression(value, path, line, title, field):
    if SOURCE_GUIDE_PLUS_RE.search(value):
        err(path, line,
            f"承重文件 {title} 的 **{field}:** 出现 `A + B` 式压缩；"
            "源包导读要把锚点展开成读者能跟上的动作链")
    if SOURCE_GUIDE_JARGON_RE.search(value):
        err(path, line,
            f"承重文件 {title} 的 **{field}:** 使用了“外包/甩给 references”式项目内行说法；"
            "请说明什么细节移到哪个文件、读者什么时候该打开它")


def validate_actual_content(value, path, line, title):
    compact = re.sub(r"\s+", "", value)
    sentences = [s.strip() for s in SENTENCE_RE.findall(value) if s.strip()]
    if len(sentences) < 2:
        err(path, line,
            f"承重文件 {title} 的 **文件里实际讲了什么:** 至少写 2 句；"
            "它是小型内容导览，不是一句话职责摘要")
    if len(sentences) > 5:
        err(path, line,
            f"承重文件 {title} 的 **文件里实际讲了什么:** 最多写 5 句；"
            "详细逐段解释放到原文阅读，不放导读卡")
    if len(compact) < 60:
        err(path, line,
            f"承重文件 {title} 的 **文件里实际讲了什么:** 信息量太低（少于 60 字）；"
            "需要写出主线、真实锚点和关键转折")
    reject_source_guide_compression(value, path, line, title, "文件里实际讲了什么")


def validate_reader_bridge(value, path, line, title):
    compact = re.sub(r"\s+", "", value)
    sentences = [s.strip() for s in SENTENCE_RE.findall(value) if s.strip()]
    if len(sentences) > 3:
        err(path, line,
            f"承重文件 {title} 的 **先给读者搭桥:** 最多写 3 句；"
            "这是读前垫脚石，不是另一段文件摘要")
    if len(compact) < 35:
        err(path, line,
            f"承重文件 {title} 的 **先给读者搭桥:** 信息量太低（少于 35 字）；"
            "需要先把陌生术语或文件用途翻成读者能懂的话")
    reject_source_guide_compression(value, path, line, title, "先给读者搭桥")


def build_source_guide(path):
    front, nodes = tokenize(path)
    sections = split_sections(nodes)
    for required in ("总框架", "入口文件导读", "引用关系", "承重文件", "阅读优先级", "通读路线"):
        if required not in sections:
            err(path, 1, f"source-guide.md 缺少 `## {required}`")

    files = []
    for title, line, item_nodes in split_items(sections["承重文件"]):
        fields = fields_map(item_nodes, path, SOURCE_FILE_LABELS, f"承重文件 {title}")
        for label, key in SOURCE_FILE_LABELS.items():
            if key not in fields:
                err(path, line, f"承重文件 {title} 缺少 **{label}:**")
        actual_node = next((n for n in item_nodes
                            if n["kind"] == "field" and n["name"] == "文件里实际讲了什么"), None)
        if actual_node:
            validate_actual_content(fields["actualContent"], path, actual_node["line"], title)
        bridge_node = next((n for n in item_nodes
                            if n["kind"] == "field" and n["name"] == "先给读者搭桥"), None)
        if bridge_node:
            validate_reader_bridge(fields["readerBridge"], path, bridge_node["line"], title)
        files.append({
            "path": title.strip("`"),
            **fields,
            "body": to_blocks([n for n in item_nodes if n["kind"] != "field"], path),
        })

    priorities = []
    for title, line, item_nodes in split_items(sections["阅读优先级"]):
        fields = fields_map(item_nodes, path, SOURCE_PRIORITY_LABELS, f"阅读优先级 {title}")
        for label, key in SOURCE_PRIORITY_LABELS.items():
            if key not in fields:
                err(path, line, f"阅读优先级 {title} 缺少 **{label}:**")
        priorities.append({"level": title, **fields})

    return {
        "h1": front.get("h1", "源包导读"),
        "summary": front.get("summary", ""),
        "framework": to_blocks(sections["总框架"], path),
        "entryGuide": to_blocks(sections["入口文件导读"], path),
        "referenceMap": to_blocks(sections["引用关系"], path),
        "files": files,
        "priorities": priorities,
        "readingPath": to_blocks(sections["通读路线"], path),
    }


CARD_HEAD_RE = re.compile(r"^(A\d+)\s+(.+?)\s*·\s*维度：(.+)$")
CARD_LABELS = {
    "症状": "symptom", "Therefore": "therefore", "机制说明": "mechanismNote",
    "解法层次": "solutionLayer", "可迁移性": "transferability",
    "什么时候用": "useWhen", "什么时候太重": "tooHeavyWhen", "反例": "antiExample",
    "在哪几个 skill 里见过": "seenIn", "不可迁移原因": "lowReason",
    "最小对照": None, "机制原文": None, "力度对比": None, "一起读": None,
}
RELATED_RE = re.compile(r"^(A\d+)\s+(.+?)（(.+)）$")


def build_archive(path):
    front, nodes = tokenize(path)
    sections = split_sections(nodes)
    if "卡片" not in sections:
        err(path, 1, "archive.md 缺少 `## 卡片`")

    cards = []
    for title, line, item_nodes in split_items(sections["卡片"]):
        m = CARD_HEAD_RE.match(title)
        if not m:
            err(path, line, f"卡片标题需要 `### A<n> 名字 · 维度：<标签>` 格式: {title!r}")
        card_id, card_title, dimension = m.group(1), m.group(2), m.group(3).strip()
        if dimension not in DIMENSIONS:
            err(path, line, f"卡片 {card_id} 维度 {dimension!r} 不合法（合法：{'、'.join(DIMENSIONS)}）")

        card = {"id": card_id, "title": card_title, "dimension": dimension}
        for idx, node in enumerate(item_nodes):
            if node["kind"] != "field":
                continue
            name = node["name"]
            if name not in CARD_LABELS:
                err(path, node["line"], f"卡片 {card_id} 未知字段 **{name}:**")
            if name == "症状":
                pain = split_evidence(node["value"], path, node["line"])
                card["symptom"] = pain["text"]
                card["evidence"] = pain.get("evidence", "")
            elif name == "最小对照":
                table = next_node_of(item_nodes, idx, "table", path, node["line"], name)
                body = [r for r in table["rows"][1:] if len(r) >= 2]
                if not body:
                    err(path, table["line"], f"卡片 {card_id} 最小对照表需要一行两列")
                card["contrast"] = {"without": body[0][0], "with": body[0][1]}
            elif name == "机制原文":
                quote = next_node_of(item_nodes, idx, "quote", path, node["line"], name)
                card["mechanismQuote"] = quote["text"]
                card["mechanismQuoteBlocks"] = quote.get("blocks", [])
            elif name == "力度对比":
                table = next_node_of(item_nodes, idx, "table", path, node["line"], name)
                card["counterScenarios"] = [
                    {"when": r[0], "effect": r[1], "why": r[2]}
                    for r in table["rows"][1:] if len(r) >= 3
                ]
            elif name == "一起读":
                lst = next_node_of(item_nodes, idx, "list", path, node["line"], name)
                related = []
                for item in lst["items"]:
                    rm = RELATED_RE.match(item)
                    if not rm:
                        err(path, lst["line"], f"一起读行需要 `A<n> 卡名（关系：…）` 格式: {item!r}")
                    related.append({"to": rm.group(1), "label": rm.group(2), "relation": rm.group(3)})
                card["related"] = related
            else:
                card[CARD_LABELS[name]] = node["value"]

        for required, label in (("symptom", "症状"), ("therefore", "Therefore"),
                                ("mechanismQuote", "机制原文"), ("solutionLayer", "解法层次"),
                                ("transferability", "可迁移性"), ("contrast", "最小对照")):
            if required not in card:
                err(path, line, f"卡片 {card_id} 缺少 **{label}:**")
        if card["transferability"] == "高":
            for required, label in (("useWhen", "什么时候用"), ("tooHeavyWhen", "什么时候太重")):
                if required not in card:
                    err(path, line, f"卡片 {card_id} 可迁移性=高，缺少 **{label}:**")
        elif card["transferability"] == "低":
            if "lowReason" not in card:
                err(path, line, f"卡片 {card_id} 可迁移性=低，缺少 **不可迁移原因:**")
        else:
            err(path, line, f"卡片 {card_id} 可迁移性必须是 高 或 低")
        cards.append(card)

    residue = []
    for title, line, item_nodes in split_items(sections.get("残渣与砍掉候选", [])):
        fields = fields_map(item_nodes, path, {"判定": "verdict", "理由": "reason"},
                            f"残渣 {title}")
        residue.append({"item": title, **fields})

    blind_spots = []
    for node in sections.get("盲区", []):
        if node["kind"] == "list":
            blind_spots.extend(node["items"])

    return {
        "panoramaDiagramId": front.get("panoramaDiagram", ""),
        "cards": cards,
        "residue": residue,
        "blindSpots": blind_spots,
    }


def build_apply(path):
    front, nodes = tokenize(path)
    sections = split_sections(nodes)
    for required in ("骨架模式", "新场景", "任务", "参考答案", "下一步"):
        if required not in sections:
            err(path, 1, f"apply-it.md 缺少 `## {required}`")

    tasks = []
    for node in sections["任务"]:
        if node["kind"] == "list":
            tasks.extend(node["items"])

    next_steps = {"author": [], "thief": []}
    current_key = None
    for node in sections["下一步"]:
        if node["kind"] == "field":
            if node["name"] == "作者":
                current_key = "author"
            elif node["name"] == "偷招的人":
                current_key = "thief"
            else:
                err(path, node["line"], f"下一步未知字段 **{node['name']}:**")
        elif node["kind"] == "list" and current_key:
            next_steps[current_key].extend(node["items"])

    return {
        "h1": front.get("h1", ""),
        "summary": front.get("summary", ""),
        "skeleton": to_blocks(sections["骨架模式"], path),
        "scenario": to_blocks(sections["新场景"], path),
        "tasks": tasks,
        "referenceAnswer": to_blocks(sections["参考答案"], path),
        "starterPrompt": front.get("starterPrompt", "").replace("\\n", "\n"),
        "nextSteps": next_steps,
    }


def build_glossary(path):
    _, nodes = tokenize(path)
    label_map = {
        "定义": "definition", "例": "example",
        "它在哪个 stage 出现": "whereItAppears",
        "它解决什么问题": "solvedProblem", "我怎么用它": "howToUse",
        "容易误解": "commonMisread",
    }
    terms = []
    for title, line, item_nodes in split_items(nodes):
        fields = fields_map(item_nodes, path, label_map, f"术语 {title}")
        for key, label in label_map.items():
            if label not in fields:
                err(path, line, f"术语 {title} 缺少 **{key}:**")
        terms.append({"term": title, **fields})
    return terms


# ---------------------------------------------------------------- toolbox

def collect_toolbox(handbook):
    """Walk every narrative block list, give each steal block a stable anchor,
    and aggregate them into handbook["toolbox"] (带走工具箱 is a build
    artifact — single source of truth stays in the page content)."""
    items = []

    def walk(blocks, page, where):
        for b in blocks or []:
            if b.get("kind") != "steal":
                continue
            b["anchor"] = f"steal-{len(items) + 1}"
            items.append({
                "anchor": b["anchor"], "name": b["name"], "tier": b["tier"],
                "scene": b["scene"], "page": page, "where": where,
                "text": b.get("text", ""), "blocks": b.get("blocks", []),
            })

    ov = handbook.get("overview", {})
    walk(ov.get("openingScene"), "overview", "Overview · 开场")
    walk(ov.get("primerBeats"), "overview", "Overview · Primer")
    for stage in handbook.get("walkthrough", []):
        where = f"{stage.get('id', '')} {stage.get('title', '')}".strip()
        for key in ("sceneBody", "predictBody", "mechanismBody", "outputBody"):
            walk(stage.get(key), "walkthrough", where)
    for art in handbook.get("dataflow", {}).get("artifacts", []):
        walk(art.get("body"), "dataflow", f"产物卡 · {art.get('path', '')}")
    sg = handbook.get("sourceGuide", {})
    for key, label in (("framework", "源包导读 · 总框架"),
                       ("entryGuide", "源包导读 · 入口文件导读"),
                       ("referenceMap", "源包导读 · 引用关系"),
                       ("readingPath", "源包导读 · 通读路线")):
        walk(sg.get(key), "source-guide", label)
    for f in sg.get("files", []):
        walk(f.get("body"), "source-guide", f"承重文件 · {f.get('path', '')}")
    ap = handbook.get("applyIt", {})
    for key in ("skeleton", "scenario", "referenceAnswer"):
        walk(ap.get(key), "apply-it", "Apply It")
    return items


# ---------------------------------------------------------------- main

REQUIRED_FILES = ["meta.md", "overview.md", "walkthrough.md", "dataflow.md",
                  "source-guide.md", "archive.md", "apply-it.md", "glossary.md"]


def main():
    if len(sys.argv) != 2:
        print(__doc__.strip(), file=sys.stderr)
        return 2
    target = Path(sys.argv[1])
    content = target / "content"
    if not content.is_dir():
        print(f"找不到内容目录: {content}", file=sys.stderr)
        return 1
    missing = [f for f in REQUIRED_FILES if not (content / f).is_file()]
    if missing:
        print(f"content/ 缺少必需文件: {', '.join(missing)}", file=sys.stderr)
        return 1

    try:
        meta, example, diagrams = build_meta(content / "meta.md")
        handbook = {
            "meta": meta,
            "example": example,
            "diagrams": diagrams,
            "overview": build_overview(content / "overview.md"),
            "walkthrough": build_walkthrough(content / "walkthrough.md"),
            "dataflow": build_dataflow(content / "dataflow.md"),
            "sourceGuide": build_source_guide(content / "source-guide.md"),
            "archive": build_archive(content / "archive.md"),
            "applyIt": build_apply(content / "apply-it.md"),
            "glossary": build_glossary(content / "glossary.md"),
        }
    except BuildError as exc:
        print(f"构建失败 — {exc}", file=sys.stderr)
        return 1

    handbook["toolbox"] = collect_toolbox(handbook)

    out = target / "assets" / "data.js"
    out.parent.mkdir(parents=True, exist_ok=True)
    payload = json.dumps(handbook, ensure_ascii=False, indent=2)
    out.write_text(
        "// 构建产物 —— 由 scripts/build-data.py 生成，禁止手写。\n"
        f"window.handbook = {payload};\n",
        encoding="utf-8",
    )
    stages = len(handbook["walkthrough"])
    cards = len(handbook["archive"]["cards"])
    source_files = len(handbook["sourceGuide"]["files"])
    print(f"OK {out} （{stages} 个 stage / {cards} 张难点卡 / "
          f"{source_files} 个源包文件 / {len(handbook['glossary'])} 个术语 / {len(diagrams)} 张图 / "
          f"{len(handbook['toolbox'])} 个可带走点）")
    return 0


if __name__ == "__main__":
    sys.exit(main())
