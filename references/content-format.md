# Content format

The single contract between three parties: the writing agent (writes
`content/*.md`), `scripts/build-data.py` (parses content into
`assets/data.js`), and `assets/site.js` (renders data.js). If this file and
the parser disagree, fix the parser.

Never hand-write `assets/data.js`. It is a build artifact.

## Files

```text
generation/<skill-slug>/content/
  meta.md        # handbook meta, running example, diagram registry
  overview.md    # chapter 1
  walkthrough.md # chapter 2
  dataflow.md    # chapter 3 中间产物与数据流
  archive.md     # chapter 4 难点档案
  apply-it.md    # chapter 5 transfer exercises
  glossary.md    # appendix
```

All seven files are required. Build fails on a missing file.

## Shared syntax

Five constructs, nothing else:

1. **Frontmatter** — flat `key: value` lines between `---` fences at the top
   of a file. No nesting, no YAML lists, one line per value.
2. **Headings** — `##` opens a section, `###` opens an item (stage, card,
   term, artifact); names are matched exactly. In free-block areas `####`
   opens an auto-numbered road-sign sub-heading (`{kind: "h4"}`): skeleton
   for a long section (3+ units), plain-word titles, none when short.
3. **Field lines** — `**字段名:** 值` inside an item or section. The value
   runs to the end of the paragraph (single newlines join, blank line ends).
   Field names are looked up in the per-file label tables below; an unknown
   field name is a build error (catches typos).
4. **Free blocks** — in sections marked *blocks* below, normal markdown maps
   to narrative blocks:
   - paragraph → `{kind: "para"}`
   - `- ` list → `{kind: "list"}`
   - markdown table → `{kind: "table", rows}` (first row renders as header)
   - fenced code (```lang) → `{kind: "code", lang}`
   - `> ` quote → `{kind: "quote"}`
   - `!diagram(id)` alone on a line → `{kind: "diagram", id}` (id must exist
     in meta.md's diagram registry)
   - `!steal(名字 ｜ 档位 ｜ 用在哪)` + a following `> ` quote body →
     `{kind: "steal"}`. 档位 is 直接抄走 or 思路带走; the body addresses 你.
     Steal blocks aggregate into the auto-generated 带走工具箱 appendix
     (never hand-written). See `references/steal-scan.md`.
5. **Structure inside quotes** — a `> ` quote may carry markdown tables,
   `- ` lists, fenced code, and `###` headings (each line still prefixed
   with `> `). The parser keeps them as nested sub-blocks and the renderer
   shows real tables/lists/code inside the blockquote — quoting a source
   skill's table verbatim is safe. Headings inside quotes render as bold
   lines. This applies to free-block quotes and to archive 机制原文 quotes
   alike. Numbered lists (`1.`) inside quotes are joined as plain paragraph
   text — prefer `- ` lists when quoting list-shaped source text.

Inline markup: paragraphs, quotes, list items, and field values support
`**加粗**` and backtick `code` (the renderer renders both; everything else
is literal text). **Structured shapes — schemas, JSON objects, field lists —
go in fenced code blocks with a language tag, never as inline code inside a
quote**: a one-line schema in backticks renders as unreadable italic prose.

Evidence grades ride inline at the end of a field value:
`...症状描述（证据：作者证词）`. Allowed grades: 实测 / 作者证词 / 结构推断 /
假设. The parser strips the marker into an `evidence` field.

## meta.md

Frontmatter keys: `title`, `skillName`, `audience`, `sourcePath`, `version`,
`baseline`.

```markdown
## 贯穿例子
**label:** 乔布斯产品判断 skill
**用户请求:** ...
**为什么挑这个例子:** ...
**预期产出:** ...

## 图表
### main-flow
**标题:** 六站流水线
**说明:** ...
**kicker:** flow
**文件:** assets/diagrams/main-flow.svg
```

Every diagram referenced anywhere must have an entry here, and the file must
exist on disk (checked by `scripts/check-content.py`).

## overview.md

Frontmatter keys: `h1`, `oneLiner`, `predictPrompt`, `wowSetup`,
`wowDiagram`, `wowMoment`, `panoramaDiagram`, `shapeReason`.

Sections, in order:

```markdown
## 开场          (blocks — the failure scene, no source-skill terms)
## Primer        (blocks — domain map beats, diagram after first beat)
## 难点预览
### <难点名，大白话>
**坑:** 可上演的失败样本，一两行
**最值得学的一招:** 一句解法钩子，必须含一个具体细节
**维度:** 七标签之一
**深入:** stage-NN · A<n>   (stage token 必填、卡 token 可选；构建解析成
                            真实跳转链接，checker 校验指针存在；被指向的
                            stage 会自动出现「Overview 预告过」回声标记)
## 章节逻辑      (list; each line "章名｜为什么排在这里")
```

难点预览 is curated (3-5 cards, heterogeneous dimensions), not the full
archive — see the Overview standard in `references/handbook-spec.md`.

The baseline sentence comes from meta.md frontmatter; do not repeat it here.

## walkthrough.md

Frontmatter keys: none required.

Each stage is one `##` heading: `## stage-NN 标题`. Inside, fixed `###`
sections in skeleton order:

```markdown
## stage-01 调研开题

**kicker:** 阶段定位短语
**summary:** 一句话
**面包屑:** 调研 → 取证 → 提炼 → 检查点 → 生成 → 测试
**接上一步:** ...        (first stage: omit; renderer shows 从这里开始)

### 场景再现     (blocks — entering state + real input excerpt)

### 难点
**领域难点:** ...（证据：结构推断）     (or exactly: 确无)
**行为难点:** ...（证据：作者证词）     (or exactly: 确无)

### 预测点      (blocks — the guess-first prompt; mandatory unless both
                 pains are 确无)

### 机制与产出   (blocks — quote the actual rule/script, map it to the
                 symptom)

### 真实产出    (blocks — what this stage hands over, with real values;
                 must contain at least one code or quote block; sourcing
                 rules in references/evidence-collection.md, synthesized
                 samples labeled 模拟样本)

### 收尾
**可偷的招:** 当〔触发条件〕→ 〔动作一句话〕   (条件起手，纯动作不合格)
**对应档案:** A<n>       (optional; renders as a link, checker validates)
**下一步靠这个:** ...    (last stage: the renderer labels it 这里把账结清)
**练习:**               (optional; followed by a `- ` list)

### 阶段速查    (optional; field lines)
**这一步收到什么:** ... ／ **skill 让我读什么:** ... ／
**我不能直接做什么:** ... ／ **我做什么:** ... ／ **我产出什么:** ... ／
**机制线索:** ... ／ **下一步谁用它:** ... ／ **自由度:** ...
```

## dataflow.md

Frontmatter keys: `flowDiagram`, `intro` (one-sentence total task).

```markdown
## 产物卡
### toc.json
**谁写它:** ...
**谁读它:** ...
**它管什么:** ...
**它不管什么:** ...
**为什么长这样:** ...     (mandatory; the counter-intuitive-shape question)
**写错会坏什么:** ...

（可选标本区：字段行之后可以跟自由 blocks——通常是一个真实实例的代码块
＋逐字段注释段。glossary 收录的承重工件必须带标本；来源与「模拟样本」
标注规则见 references/evidence-collection.md。）
```

## archive.md

Frontmatter keys: `panoramaDiagram` (optional pain-network diagram).

```markdown
## 卡片
### A1 先取证再提炼 · 维度：领域-认知

**症状:** ...（证据：作者证词）

**最小对照:**

| 没有这个机制 | 有这个机制 |
| --- | --- |
| <bad sample> | <good sample> |

**Therefore:** ...

**机制原文:**

> verbatim quote of the rule / gate text / script lines

**机制说明:** ...
**解法层次:** 脚本解法 ／ 表征解法 ／ 流程解法
**可迁移性:** 高 ／ 低
**什么时候用:** ...        (高 only)
**什么时候太重:** ...      (高 only)
**反例:** ...              (高 only)
**在哪几个 skill 里见过:** ...  (高 only)
**不可迁移原因:** ...      (低 only: 项目特有 / 平台伤疤 / 缺第二案例)

**力度对比:**

| 场景 | 效果 | 为什么 |
| --- | --- | --- |
| ... | 管用 | ... |
| ... | 得让一步 | ... |
| ... | 用不上 | ... |

**一起读:**
- A3 卡名（搭配用：...）

## 残渣与砍掉候选
### <规则或文件>
**判定:** 平台伤疤 ／ 过度设计 ／ 货物崇拜
**理由:** ...

## 盲区          (list)
```

Card heading format is `### A<n> <名字> · 维度：<七标签之一>`. Allowed
dimension labels: 领域-工程 / 领域-认知 / 行为 / 编排 / 品味 / 需求 / 平台.
Allowed 效果 values: see `references/cards-patterns.md`.

## apply-it.md

Frontmatter keys: `h1`, `summary`, `starterPrompt` (optional, may contain
`\n`).

```markdown
## 骨架模式      (blocks — the skill's composed shape as ONE transferable
                 archetype: a short formula plus its invariants; atoms stay
                 in the archive, this is the composition level)
## 新场景        (blocks — a concrete scenario in a different domain)
## 任务          (list — instantiate the skeleton + chosen cards in the new
                 domain)
## 参考答案      (blocks — rendered collapsed; the reader works first)
## 下一步
**作者:**        (followed by a `- ` list)
**偷招的人:**    (followed by a `- ` list)
```

## glossary.md

Frontmatter keys: none.

```markdown
### <术语>
**定义:** ...
**例:** ...               (mandatory; a real instance with values, not a
                          re-description — if the term has a dataflow
                          specimen, this is its compressed form)
**它在哪个 stage 出现:** ...
**它解决什么问题:** ...
**我怎么用它:** ...
**容易误解:** ...
```

3-8 terms. More terms means in-place explanations are failing their job.
The renderer auto-links each term's first occurrence per page to its
glossary anchor — write terms exactly as their card headings so the link
matcher can find them.

## Build and check

```bash
python3 scripts/build-data.py generation/<skill-slug>     # content/ -> assets/data.js
python3 scripts/check-content.py generation/<skill-slug>  # hard-gate checks
```

Build errors name the file, the line, and the missing or unknown field. Both
must pass before the voice gate runs.
