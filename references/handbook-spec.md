# Skill handbook spec

Read this file first only when producing a multi-page handbook or web
documentation app. It defines the content contract.
`references/web-production-flow.md` defines how to turn that contract into
files. `references/pain-dimensions.md` defines how pains are found, tested,
and graded — read it before the pain scan.

The handbook answers:

```text
我，一个正在使用这个 skill 的 AI，拿到用户输入后，是怎样被这个 skill
一步步约束、引导、暂停、检查、产出结果的？
它克服的难点是什么，用什么手段克服的，哪些手段值得搬走？
```

Evidence and concrete material are collected per
`references/evidence-collection.md` (mine `examples/` → slice-run →
targeted ablation); synthesized artifact excerpts are labeled 模拟样本.
Alongside the pain sweep, run the steal scan
(`references/steal-scan.md`): six lenses over the package for what a
practitioner can carry away, marked in place with `!steal` callouts and
auto-aggregated into the 带走工具箱 appendix.

Before answering from inside the skill, answer from outside it:

```text
普通用户或默认 agent 以为这个任务难在哪里？
真正会让工作错位、返工、失控的地方在哪里？
这个 skill 用哪些机制提前处理掉？
```

Use first person for the agent's visible working path. Do not invent private
hidden thoughts. Show auditable actions, files, checks, and outputs.

## Baseline declaration

Every handbook declares its baseline once in `handbook-brief.md`, and repeats
it in one sentence in Overview:

```text
基线：同款模型、不带本 skill、用户一句话 prompt 的默认 agent。
（领域难点可另加人类基线：没做过这类项目的合格工程师。）
```

Every pain claim in the handbook is a claim about the baseline, written as an
observable symptom with an evidence grade. "这一步很难" with no symptom is a
gate failure. See `references/pain-dimensions.md` for the three-question pain
test and evidence grades.

## Ordinary-view pain scan

Write this into `handbook-brief.md` before page prose. It is the output of the
item-driven sweep defined in `references/pain-dimensions.md` (裸做想象 →
全量盘点 → 贴标签 → 残渣对账).

```markdown
## Ordinary-view pain scan

基线：<one sentence>

| Ordinary assumption | Real friction | First visible symptom | Dimension | Evidence | Skill mechanism | Where it appears |
| --- | --- | --- | --- | --- | --- | --- |
| <what the task seems to be about> | <deeper pain> | <observable symptom> | <领域-工程/领域-认知/行为/编排/品味/需求/平台> | <实测/作者证词/结构推断/假设> | <file/rule/script/checkpoint> | <stage/page> |

## 全量盘点附录

- 中间产物清单：<every file/data handed between stages, none omitted>
- 风险缓解（非难点，三问②答"小概率"）：<list>
- 残渣（无法归类或三问②答"不发生"）：<list, never silently dropped>
- skill 的盲区（裸做想象想到了、skill 没防的）：<list>
```

Every dimension must be visited. An empty dimension is written as
"此 skill 确无 <维度> 类难点", never silently skipped.

The scan is the full set; three chapters consume it at three altitudes,
answering three different reader questions:

- Overview curates 3-5 rows into the 难点预览 — "这里有什么值得学？"
- Walkthrough turns stage-relevant rows into 错位症状 -> 机制 -> 现场证据 —
  "它怎么实现的？"
- 难点档案 turns the full table into cards, plus 残渣/盲区 — "我能搬走吗？
  什么时候失效？"

Repetition across the three altitudes is intended; each pass must add its
own layer, never paste the same prose. The preview card's 坑 and the archive
card's 症状 describing the same pain must be written at different altitudes
(preview = shorter, hookier; archive = stageable scene) — near-verbatim
overlap between them is checked by machine and means one altitude is not
doing its job.

Do not paste the table as reader-facing prose.

## Required layers

Every handbook preserves three layers:

1. **How the skill runs:** phases, gates, loops, handoffs, validation.
2. **How it is packaged:** entry file, references, scripts, assets, tests,
   examples, outputs — seen as a data flow of intermediate artifacts.
3. **What design moves it contains:** pains, mechanisms, costs, counter-cases,
   transferability.

## Page map

Five chapters plus one appendix, in fixed reading order. Each chapter only
depends on concepts established by earlier chapters.

| # | Page | Job | Common failure |
| --- | --- | --- | --- |
| 1 | Overview | show the ordinary failure first, then the high-level map and baseline | table of contents, abstract praise, or source terms before the problem |
| 2 | Walkthrough | panorama first, then the agent moving stage by stage through one running example | checklist with no scene, real material, or handoff |
| 3 | 中间产物与数据流 (dataflow) | follow the data: user input -> intermediate artifacts -> delivery; for each artifact, who writes, who reads, why this shape | directory listing, or ownership rows with no "why this shape" |
| 4 | 难点档案 (archive) | every pain as a card: symptom, baseline, evidence, mechanism, transferability; plus residue and cut candidates | generic best practices, or patterns as renamed section headings |
| 5 | Apply it | transfer exercises: the reader picks cards, combines them, sketches a mini-skill skeleton | motivational advice, or a summary disguised as exercises |
| 附录 1 | Glossary | lookup utility for design-heavy terms, off the main reading path | a chapter-sized dictionary interrupting the narrative |
| 附录 2 | 带走工具箱 | auto-aggregated from in-context `!steal` callouts (see `references/steal-scan.md`); grouped by tier, each item links back to its spot | hand-writing the page (a second copy that drifts), or marking so many callouts the highlight stops meaning anything |

Whole-before-parts is enforced at two levels:

- Book level: Overview ends with the full pipeline panorama (one diagram:
  input, all stages, output) before any chapter goes deep.
- Chapter level: every detail page opens with orientation before its first
  detailed card — total task in one sentence, a top-level diagram when
  relationships matter, and an index table with one-line summaries and anchors.

## Overview standard

Overview is the entry point. A reader who has never seen the source skill
should leave with a 3-5 sentence explanation of what the skill does, plus the
panorama in their head.

Before writing Overview, consume the ordinary-view pain scan. The opening
scene must stay in the reader's language: show what a default agent or normal
user would get wrong before introducing source-skill terms, file names, phase
names, or the skill's own solution.

Required sections:

1. **Hero:** concrete h1 and lede. Show default AI behavior versus
   skill-shaped behavior. Do not praise the skill abstractly.
2. **Opening scene:** 6-10 short narrative blocks showing the failure mode
   before naming the source skill's solution.
3. **Predict prompt:** ask the reader to guess the fix before revealing the
   skill's mechanism.
4. **Baseline:** the one-sentence baseline declaration.
5. **Primer beats:** 5-9 short beats that build the domain map. Include an
   orientation diagram after the first beat.
6. **Wow moment:** if comparing 2+ entities, use a real table or SVG compare
   diagram. Do not make the reader assemble the comparison from prose.
7. **难点预览 (pain preview):** 3-5 curated cards. This is the shop window,
   not the archive: same pains, different altitude. Each card has exactly
   four parts — 坑 (a stageable failure sample, one or two lines), 最值得学
   的一招 (a one-sentence solution hook that MUST contain one concrete
   detail — "它有取证机制" is a noun, not a hook), 维度 tag, and 深入
   pointers (which walkthrough stage responds, which archive card
   systematizes). Do not put the full mechanism here; the hook shows the
   solution's existence and edge, the walkthrough earns the rest.
   Curation rules: pick the most counter-intuitive pains first; cover
   heterogeneous dimensions (a preview where every card is 行为 is a
   selection failure); prefer pains that thread through later chapters.
8. **Running example:** user request, why this example represents the main
   path, and expected output.
9. **Panorama:** the full pipeline diagram (input -> stages -> output) with
   one line per stage. This is the skeleton every later chapter hangs on.
10. **Why this shape:** one sentence for the ordering logic and a structured
    `chapterLogic` list.

## Walkthrough standard

Read `references/stage-writing.md` before writing Walkthrough.

Walkthrough opens with the pipeline panorama (reusing the Overview diagram)
plus one line per stage, before stage 1. No stage detail before the whole.

Each stage follows a fixed skeleton, in order:

1. **我在哪：** mini-map or breadcrumb locating this stage in the panorama.
2. **场景再现：** what I hold entering this stage (real input excerpt) and
   what I must hand over. When the behavior change comes from reading a
   package file, excerpt enough of it for the reader to simulate that
   reading — naming the file (or quoting one teaser line) is not enough.
3. **难点：** two questions, each answerable as "确无" but never skipped:
   - 领域难点：这一站克服的任务固有难点（工程或认知）；
   - 行为难点：默认 agent 在这会怎么坏。
   Each pain is an observable symptom with an evidence grade, pulled from the
   pain scan, not invented per stage.
4. **预测点：** before revealing the mechanism, ask the reader to design the
   fix themselves. Mandatory for stages that carry a pain.
5. **机制：** the skill's concrete countermeasure, quoting the actual rule,
   gate text, or script lines, each mapped to which half of the pain it
   blocks.
6. **真实产出：** its own `### 真实产出` section (machine-checked): what
   this stage hands over, with real values — a schema with field names but
   no values is not a 产出. Sourcing per the evidence ladder.
7. **可偷的招 + 交接：** one reusable move, then the handoff to the next
   stage.

Plus, where relevant: cross-stage mechanism thread, collapsible stage quick
reference, reader challenge block.

## 中间产物与数据流 standard

This chapter follows the data, not the directory. Spine: one flow diagram from
user input through every intermediate artifact to final delivery.

For each important artifact:

```markdown
#### `<artifact>`

**谁写它：** <stage or script>
**谁读它：** <later stage, script, user, or validator>
**它管什么：** <decision dimension> ／ **它不管什么：** <boundary>
**为什么长这样：** <why this shape and not the intuitive one;
  what bad outcome the intuitive shape causes>
**写错会坏什么：** <observable downstream failure>
```

The "为什么长这样" field is where 领域-认知 insights usually live (the
counter-intuitive intermediate artifact heuristic). An artifact card without
it is a directory listing row.

Every artifact that also earns a glossary card gets a **标本** on its
artifact card: one real-valued instance (code block after the field lines)
plus field-level annotation — what design decision each field encodes, what
breaks downstream when written badly. The instance lives here only;
walkthrough and glossary reference it instead of re-pasting it.

## 难点档案 standard

Read `references/cards-patterns.md` before writing this chapter. The chapter
merges what older handbooks split into "design choices" and "patterns": one
card type, one transferability field.

- Open with orientation: a pain panorama grouped by dimension (six sources,
  seven labels), then the index table.
- Each card follows the difficulty-archive schema in
  `references/cards-patterns.md`: symptom, baseline, evidence grade, quoted
  mechanism, minimal contrast, solution layer, transferability.
- Pick the 8-15 pains that explain the skill's shape. Do not card every rule.
- Close with two honest sections from the sweep appendix:
  - **残渣与砍掉候选：** rules that failed the pain test (platform scars,
    over-design, cargo cult), each with the reason;
  - **盲区：** pains the bare-task imagination found that the skill does not
    cover.

## Apply it standard

Apply it is a transfer exercise set, not a summary. It consumes only the
archive cards marked 可迁移性=高.

- Open with the **骨架模式**: the skill's composed shape distilled into one
  transferable archetype (a formula plus its invariants). Atoms live in the
  archive; this is the composition level — the single biggest thing the
  reader takes away. Do not re-list the cards here.
- Give the reader a new concrete scenario (a different task domain).
- Ask them to pick which cards apply, combine them, and sketch a mini-skill
  skeleton (entry file outline + key gates + intermediate artifacts).
- Provide a reference answer after the exercise, not instead of it.
- This chapter is the seed of a future cross-skill cookbook: every card it
  exercises carries its source citation.

## Glossary standard (appendix)

Glossary is a lookup utility, off the main path. In prose, every term is
already explained in place before use (hard gate); Glossary only expands the
3-8 terms that carry design weight across chapters.

Each term card needs: concrete example value (the `**例:**` field — a real
instance, not a re-description; machine-checked); stage where it appears;
problem or confusion it prevents; how the agent uses it; easy-to-confuse
contrast. If the term names an artifact that has a dataflow specimen, the
例 is a compressed form of that specimen, not a third description.

## Visual layer

Read `references/visuals-and-quality.md` before planning diagrams.

- Use code-native diagrams (SVG, Mermaid-rendered) for exact relationships.
  No AI-generated illustration for precise structure.
- Every diagram referenced in content must point to a real file.
- The panorama diagram and the stage mini-map reuse the same artwork with
  different highlights; do not redraw the pipeline per stage.

## Final checks

- Does Overview show ordinary pain before source-skill mechanics, and declare
  the baseline?
- Does the panorama appear before any stage detail, and does every detail page
  orient before its first card?
- Does one running example carry the handbook?
- Is every pain an observable symptom with an evidence grade — no "这里很难"
  claims?
- Were all seven dimension labels visited, with empty ones declared "确无"?
- Does every stage with a pain have a predict point before its mechanism?
- Does every contrast pair differ in exactly one variable?
- Does the dataflow chapter answer "为什么长这样" for each artifact?
- Does the archive close with residue, cut candidates, and blind spots?
- Does Apply it make the reader produce something, not just read?
- Can the reader steal at least three concrete design moves?
