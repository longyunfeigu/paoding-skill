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
  content/              # the seven content files (hand-written, the deliverable)
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

The scaffold owns the page shells (五章 + 附录: overview, walkthrough,
dataflow, archive, apply-it, glossary), the renderer, the CSS, a starter
`data.js`, and `assets/diagrams/`. Edit `site.js`, page shells, or CSS only
when the schema, page list, or visual system actually changes.

## 2. Write `handbook-brief.md`

Run the item-driven sweep from `references/pain-dimensions.md` first. The
brief is source material, not page copy. Include:

- source path, package map, and the baseline declaration;
- the ordinary-view pain scan table (dimension + evidence columns) from
  `references/handbook-spec.md`;
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
- if the load-bearing artifact has no real instance anywhere, run a slice
  (跑到第一个承重工件、沿人工检查点切开、产物落盘采集);
- ablate only the cheap counter-intuitive claims worth upgrading to 实测;
- whatever stays synthesized must be labeled 模拟样本 in content.

Record in the brief which level each key excerpt came from. Page packets
then point at collected files instead of asking writers to invent samples.

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
explicitly asked for a review only. If an independent reviewer is available
and appropriate, use it for high-exposure fields only.

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
