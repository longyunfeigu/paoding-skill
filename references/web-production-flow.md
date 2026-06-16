# Web production flow

Use this reference only when the requested output is a multi-page web
handbook. It exists to prevent two bad results: writing a long `handbook.md`
and slicing it into pages that all sound the same, and hand-editing the build
artifact until nothing is checkable.

## Core rule

The hand-written layer is `content/*.md`. Everything below it is generated:

```text
generation/<skill-slug>/
  handbook-brief.md     # sweep output: pain scan, inventory, threads (hand-written)
  page-packets/         # per-page writing instructions (hand-written)
  content/              # the eight content files (hand-written, the deliverable)
  assets/data.js        # BUILD ARTIFACT — never hand-edit
  index.html  pages/  assets/{site.js,styles.css,diagrams/}   # scaffold-owned
```

`<skill-slug>` is derived from the source skill's `name:` field. ASCII
letters, digits, and hyphens only.

## 1. Scaffold first

```bash
bash scripts/scaffold-web-app.sh generation/<skill-slug> \
  --title="<Skill Name> 解剖手册" \
  --skill-name="<Skill Name>" \
  --source-path="<source skill path>"
```

The scaffold owns the page shells (六章 + 附录: overview, walkthrough,
dataflow, source-guide, archive, apply-it, glossary), the renderer, the CSS, a starter
`data.js`, and `assets/diagrams/`. Edit `site.js`, page shells, or CSS only
when the schema, page list, or visual system actually changes.

## 2. Write `handbook-brief.md`

Run the item-driven sweep from `references/pain-dimensions.md` first. The
brief is source material, not page copy. Include:

- source path, package map, and the baseline declaration;
- the ordinary-view pain scan table (dimension + evidence columns) from
  `references/handbook-spec.md`;
- the 带走候选清单 table from the steal scan
  (`references/steal-scan.md` — six lenses, two tiers; at least lenses
  2-6 must have run, the pain sweep alone misses pure craft knowledge);
- the 全量盘点附录: intermediate-artifact inventory, risk mitigations,
  residue, blind spots;
- one running example;
- total task in one sentence;
- stage IDs and one-line summaries; cross-stage mechanism threads;
- term IDs, archive-card IDs (A1...) with dimension and evidence grade;
- required diagrams and where each appears;
- risks, missing evidence, assumptions.

## 3. Write one anchor slice

Before producing every page, write a small anchor slice in `content/`:

- the overview opening scene;
- one full walkthrough stage (all seven skeleton parts);
- one archive card;
- one artifact card.
- one source-guide file card.

Run `build-data.py` + `check-content.py` on it early — the parser is part of
the contract, and the anchor is the cheapest place to discover format
mistakes. If the anchor exposes problems in the brief, fix the brief before
continuing.

After the anchor slice, decide serial versus parallel. Choose serial while
the brief or voice is still moving. Choose parallel page work only when each
page maps to a disjoint `content/*.md` file — they do, which is the point of
the split — and merge by file, never by editing data.js.

## 3.5 Collect real material

Before page writing starts, collect the concrete material the pages will
need, following the ladder in `references/evidence-collection.md`:

- mine the source package (`examples/`, README images, fixtures) for
  ready-made specimens and wow material;
- run every shipped script that has a valid in-package input
  (mandatory — see 可执行工件必跑 in `references/evidence-collection.md`);
- if the load-bearing artifact has no real instance anywhere, run a slice
  (跑到第一个承重工件、沿人工检查点切开、产物落盘采集);
- ablate only the cheap counter-intuitive claims worth upgrading to 实测;
- whatever stays synthesized must be labeled 模拟样本 in content.

Record in the brief which level each key excerpt came from, and include
the script checklist (every shipped script: 跑了/没跑 + 理由 + 一句结果).
Page packets then point at collected files instead of asking writers to
invent samples.

## 4. Produce page packets

Each page packet is a self-contained handoff. Do not clone the same packet
six times with different titles.

```markdown
# <page>.packet

**Page job:** <what this page helps the reader do>
**Reader state:** <what the reader already knows or may not know>
**Voice:** <how this page should sound>
**Page-specific standard:** <concrete checks for this page>
**Evidence shape:** <examples, tables, snippets, traces, cards, diagrams>
**Failure mode:** <most likely bad version of this page>
**Pain scan rows used:** <which rows from the brief this page consumes>
**Inputs:** <brief fields, source files, stage IDs, card IDs>
**Must include:** <orientation, diagrams, cards, tables, real material>
**Must avoid:** <page-specific bad output>
**Packet output:** <which content/*.md file and which sections>
**Self-check:** <page-specific checks>
```

Page jobs (details in `references/handbook-spec.md`):

| Page | Must do | Common failure |
| --- | --- | --- |
| Overview | ordinary failure first, baseline, panorama last | TOC or abstract praise |
| Walkthrough | panorama, then the seven-part stage skeleton per stage | checklist with no scene or evidence |
| Dataflow | follow the data; 为什么长这样 per artifact | directory listing |
| Source guide | package layers, reference chain, load-bearing file cards, reading priorities | source directory pasted as prose |
| Archive | three-question pain cards + residue + blind spots | renamed section headings |
| Apply it | transfer exercise with collapsed reference answer | motivational summary |
| Glossary | lookup appendix, 3-8 design-heavy terms | chapter-sized dictionary |

For `walkthrough.packet`, add a short **Mechanism threads** block saying
which thread each relevant stage touches.

## 5. Build and machine-check

```bash
python3 scripts/build-data.py generation/<skill-slug>
python3 scripts/check-content.py generation/<skill-slug>
```

Both must pass with zero errors. The build rejects format violations
(unknown fields, missing evidence grades, pain-carrying stages without a
predict point). The checker rejects broken diagram references, empty
contrast pairs, illegal effect values, and dangling card links. Fix the
content, rebuild — never patch data.js.

## 6. Voice gate

After each page is drafted and building, run the voice gate before marking
it done.

- `references/voice-style-gate.md` — the seven hard rules (H1-H7), then
  anti-jargon and teaching-voice checks.
- `references/voice-gate-examples.md` — high-exposure field scan.

Fix blocking issues. Do not report them as unresolved work unless the user
explicitly asked for a review only.

**作者自查是第一道，不是最后一道。必须再派一个独立 subagent 审高曝光字段——
这一步不是 optional。** 作者对自己的文字脸盲：他读到的是「我当时想表达的
意思」，不是纸面上真实的句子，所以自查会系统性放水。独立 subagent 没有
「这是我写的」的包袱，只读字面，能扫出作者自己看不见的 AI 味。

独立 reviewer 的任务轮廓：读 `references/voice-style-gate.md` +
`references/voice-gate-examples.md`（如可用，再加 renwei 的 AI 句式清单）；
扫高曝光字段（标题、lede、坑、最值得学的一招、症状、Therefore、为什么
长这样、可偷的招、callout、glossary 各字段）；逐处命中（位置 + 命中哪条
规则 + 原文摘录 + 一句改法 + 严重度）；不改文件，把否决权留给作者。
reviewer 的命中清单和你的逐处处置（改了／驳回+理由）记进 brief 的 voice
gate log——独立 review 跑了没、改了几处，要可查。

**工程缩写要清单驱动、逐行全文扫，不能只采样或只看改动 diff。** 门／下游／
落盘／锚点／降级／消费（作动词）／归属／真相源／信息池／硬节点 这类工程
缩写是作者的肌肉记忆，作者和泛泛找 AI 味的 reviewer 都会脱敏；只复查改动
diff 更会整段漏掉没动过的存量 jargon。给 reviewer 一张 voice-style-gate
第 7/8 条的缩写清单，让它 grep 全文、逐处判「换人话／就地解释过可留／是源
skill 真实术语可留」。（实测病历：last30days 手册「一回合门／前置条件门／
下游接管／消费／归属」连漏两轮——第一轮采样没命中，第二轮只复查改动 diff
没扫存量；第三轮清单驱动全文扫才一次清干净 13 处。）

**金句位置是 AI 味高发区，告诉 reviewer 重点盯。** 模板里那些要求「收一句」
的位置——难点档案的 Therefore、产物卡的「为什么长这样」收尾、预览卡的
「最值得学的一招」、收尾的「可偷的招」——诱导作者写「一句点睛金句」，
于是反复落到「不是X而是Y」「与其不如」「这是『……抽象名词』」三种对仗
公式上；那不是在解释，是在表演。叙事段往往反而达标，AI 味集中在这几个要
「收一句」的地方。（实测病历：last30days 解剖手册首版，overview /
walkthrough 的叙事段口语达标，AI 味全聚集在 archive 的 Therefore 和
dataflow 的「为什么长这样」——作者自查时把这些当成点睛之笔放了水，独立
subagent 一扫即现。）

The gate is NOT a banned-word grep. Its hard half is the read-aloud /
Feynman pass, and that pass must leave a trace: per page, pick 5 random
narrative paragraphs, run them through 「念出来像人话吗？没读过源 skill 的
人能跟上吗？」, and record in the brief which paragraphs were sampled and
what changed. A voice-gate step with no recorded samples and zero rewrites
is presumed not to have run — the same 「查了不改等于没查」 rule the
handbooks themselves teach.

## 7. Editor pass

Before delivery, verify:

- one running example stays consistent;
- stage, term, and card IDs match the brief;
- the panorama appears in Overview and Walkthrough before any detail;
- every detail page orients before its first card;
- every page has a distinct job and voice;
- no page depends on another page to define its first important term;
- repeated paragraphs are removed;
- `content/` is the only hand-written layer below the brief — no stray
  edits in `assets/`.

## 8. Serve and verify

```bash
python3 -m http.server --directory generation/<skill-slug> 8000
```

Open every page once. `check-content.py` already verified diagram files
exist and are non-empty, but rendering is the only test of layout — check
the panorama, one stage, one archive card, and the collapsed reference
answer by eye.

Only after the web app is coherent, generate `handbook.md` as a linear
export if the user wants one. Do not use that export as the next run's
source.
