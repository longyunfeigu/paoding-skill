---
name: paoding-skill
description: Use when studying, reverse-engineering, comparing, reviewing, or learning from AI skill packages, SKILL.md files, Claude/Codex skills, prompt workflows, or agent playbooks; use when the user wants reusable skill design patterns, a keep/cut review, Markdown report, structured pattern notes, or multi-page web handbook. 触发词：「庖丁」「庖丁解 skill」「解剖这个 skill」「拆解 xx skill」「这个 skill 怎么实现的」.
---

# 庖丁 · Skill 解剖术

## Purpose

Turn a skill package into useful creator notes. Explain how the skill changes an
agent's behavior, what bad output it prevents, which parts are worth copying,
and which parts are too heavy for the job.

Default to the smallest useful output. A web handbook is an output mode, not the
identity of this skill.

## Start Here

1. Map the source package first.
2. Choose the output mode from the user's request:
   - **Review / keep-cut advice:** write a direct Markdown review.
   - **Pattern extraction:** write human notes and optional JSON/YAML.
   - **Web handbook / 解剖手册:** read `references/handbook-spec.md`, then
     `references/web-production-flow.md`.
3. Load only the companion reference needed for the current section. Examples
   are calibration only; references and source files are the contract.

## Workflow

### 1. Map the Package

Treat the input as a single `SKILL.md`, a skill directory, or a folder of skills.

- Find every `SKILL.md`.
- Note `references/`, `scripts/`, `assets/`, `examples/`, `tests/`, and metadata.
- Read the entry `SKILL.md` first.
- Read referenced files only when they explain the skill's design.
- Inspect scripts to see which fragile jobs they take away from the agent.

For a batch, analyze representative skills first, then scan the rest for
repeated structures.

### 2. Find the Real Task Pain

Read `references/pain-dimensions.md`, then run its item-driven sweep:

1. Imagine doing the task bare (a human novice, then a default agent) and
   list where each would fail.
2. Inventory every rule, script, intermediate artifact, and checkpoint in
   the package. List the intermediate artifacts completely.
3. Run each item through the three-question pain test (counterfactual,
   baseline, evidence grade) and tag it with one of the seven dimension
   labels.
4. Reconcile: pains the skill catches that you missed, pains you expected
   that it ignores (blind spots), and residue that fits nowhere.

"这一步很难" with no observable symptom is not a finding. Difficulty claims
are made against a declared baseline and carry an evidence grade.

For web handbooks, write the full `ordinary-view pain scan` described in
`references/handbook-spec.md`. For shorter reviews, fold the same thinking into
the findings.

When a claim needs evidence beyond the package text, or a handbook needs
real artifact excerpts, follow the collection ladder in
`references/evidence-collection.md` (mine `examples/` → slice-run →
targeted ablation).

### 3. Read Like a Skill Designer

Preserve three layers:

1. **How it runs:** phases, gates, loops, handoffs, validation.
2. **How it is packaged:** entry file, references, scripts, assets, examples,
   tests, generated outputs.
3. **What design moves it contains:** reusable patterns, costs, and cases where
   they are too heavy.

Answer in plain language:

- What bad AI output does this prevent?
- What does it force the agent to do before answering?
- What shortcuts does it block?
- Which terms need explanation before they are useful?
- Which moves are reusable skill patterns?
- Which moves are platform workarounds or one-off project scars?

### 4. Choose the Output Shape

**Review / keep-cut advice**

Lead with findings. Group content as:

- what is working;
- what is too heavy, duplicated, or stale;
- what to delete, merge, or move to assets/scripts;
- what to keep as non-negotiable behavior control.

**Pattern extraction**

Write reusable pattern cards. Each card says:

- bad result prevented;
- when to use it;
- how it works;
- where it usually lives in the package;
- cost and counter-case;
- example from the source skill.

Use `references/cards-patterns.md` when writing many design-choice or pattern
cards.

**Web handbook**

Use one running example through the whole handbook. Follow:

1. `references/handbook-spec.md` for the content contract (五章 + 附录).
2. `references/web-production-flow.md` for `generation/<skill-slug>/`,
   `handbook-brief.md`, page packets, scaffold, build, and final checks.
3. `references/content-format.md` when writing `content/*.md` — the only
   hand-written layer; `scripts/build-data.py` turns it into `data.js`.
4. `references/stage-writing.md`, `references/cards-patterns.md`,
   `references/visuals-and-quality.md`, and `references/voice-style-gate.md`
   only for the sections that need them.

### 5. Quality Check

Before finishing, check:

- Did the answer explain the behavior change, not just summarize files?
- Can the user steal at least three concrete moves?
- Did you preserve both workflow and package structure?
- Did every pattern say when it is useful and when it is too heavy?
- Did you avoid turning one project's generated output into the rule?

## Non-Negotiables

- Start from the pains the skill overcomes — domain difficulties as well as
  bad AI behavior. Every pain claim names an observable symptom, a baseline,
  and an evidence grade (`references/pain-dimensions.md`).
- Keep `SKILL.md` lean; move detailed writing rules, templates, and visual
  implementation notes to references or assets.
- Do not rely on examples as specification.
- Do not treat generated `generation/` output as reusable skill material.
- Collect concrete material per `references/evidence-collection.md`; any
  synthesized artifact excerpt in a handbook is labeled 模拟样本 — the
  honesty rule applies to the handbook itself.
- Use scripts/assets for repeatable mechanics instead of re-explaining them in
  prose.
- For web handbooks: data.js 是构建产物，禁止手写 — write `content/*.md` and
  run `scripts/build-data.py` + `scripts/check-content.py`.
- If producing a web handbook, use code-native diagrams for exact relationships
  and verify referenced SVG files exist.

## Resources

- `references/pain-dimensions.md` — the six-source dimension taxonomy, the
  three-question pain test, evidence grades, and the item-driven sweep.
- `references/evidence-collection.md` — the evidence collection ladder
  (mine examples / slice-run / targeted ablation) and specimen rules.
- `references/handbook-spec.md` — content contract for multi-page handbooks
  (五章 + 附录) and the ordinary-view pain scan format.
- `references/web-production-flow.md` — concise web production flow: scaffold,
  brief, packets, build, check, verification.
- `references/content-format.md` — the `content/*.md` format contract shared
  by the writing agent, the build script, and the renderer.
- `references/stage-writing.md` — walkthrough-specific writing rules.
- `references/cards-patterns.md` — difficulty-archive card rules.
- `references/visuals-and-quality.md` — diagram rules and final quality checks.
- `references/voice-style-gate.md` — seven hard rules plus voice gate rules.
- `references/voice-gate-examples.md` — reviewer examples for common voice
  failures.
- `references/web-app-visuals.md` — short visual constraints for the static web
  template.
- `scripts/scaffold-web-app.sh` — creates the static handbook skeleton from
  `assets/web-app-template/`.
- `scripts/build-data.py` — builds `assets/data.js` from `content/*.md`.
- `scripts/check-content.py` — machine half of the hard gate.
