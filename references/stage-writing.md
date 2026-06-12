# Stage writing rules

Use this reference when writing or reviewing the Walkthrough page.
`references/handbook-spec.md` defines the fixed stage skeleton (我在哪 →
场景再现 → 难点 → 预测点 → 机制 → 真实产出 → 可偷的招+交接). This file
defines how to write each part well.

## Panorama before stage 1

Walkthrough opens with the pipeline panorama: the same diagram Overview ends
with, plus one line per stage. The reader must hold the whole chain before any
stage detail. Do not start stage 1 with its own scene; start it with its
position in the chain.

## 我在哪：mini-map

Every stage starts by locating itself. Reuse one artwork with the current
stage highlighted, or a plain text breadcrumb:

```text
调研 → 取证 → 【提炼 DNA】 → 检查点 → 生成 → 测试
```

Do not redraw the pipeline differently per stage; the reader should recognize
the same map every time.

## 场景再现：carry real material

State what I hold entering the stage and what I must hand over. Each side gets
a concrete excerpt — a source excerpt, a prompt sent to the user, a command or
output trace, or a Markdown / JSON sample showing the artifact shape. Naming a
file is not enough.

The same applies to the stage's reading material: when the skill makes the
agent read a file (「读 style.md 把口味载入脑子」), excerpt the part that
does the behavior change — the token table, the contract lines — so the
reader can simulate the reading. One cherry-picked line is a teaser, not an
excerpt.

## 真实产出：real values, sourced

`### 真实产出` is its own section after 机制与产出. It shows what this stage
hands over **with real values** — a filled artifact instance, a command
trace, a presented checkpoint message. Schema field names without values do
not qualify. Source the excerpt per the ladder in
`references/evidence-collection.md` and label synthesized ones 模拟样本 in
the introducing sentence. If the artifact has a dataflow specimen, show a
compact slice here and let the specimen carry the field-level annotation —
do not paste the full annotated instance twice.

The metadata rows (receives / reads / output / freedom / nextConsumer) belong
in a collapsible "阶段速查" panel below the narrative. The default reading
path is the story plus evidence.

## 难点：two questions, pulled not invented

Ask both, answer "确无" explicitly when empty:

- **领域难点：** 这一站克服的任务固有难点。工程类（动作易错）还是认知类
  （产出形态想错就全错）？
- **行为难点：** 默认 agent 在这会怎么坏？

Pull pains from the `handbook-brief.md` pain scan instead of inventing new
ones per stage. Each pain is written as an observable symptom with its
evidence grade. Overview and Walkthrough explain the same pains from
different angles.

Template:

```markdown
这一步表面是在 <动作>。真正挡住的是 <具体错位症状>。

如果直接 <默认做法>，最先露出的症状会是 <可观察结果>。（证据：<等级>）
```

## 预测点：reader designs the fix first

Between the pain and the mechanism, force a guess. Mandatory for stages that
carry a pain. The reader learns more from one wrong guess than from ten clear
explanations.

```markdown
**先猜一遍：** 设想你和我坐同一把椅子上。<当前状态>。
默认 agent 在这会 <症状>。如果让你来写规则防住它，你会加什么？
写下来再读下面 skill 实际怎么防。
```

Do not write "你是这个 AI"; that changes the point of view. Use direct "你"
only in predict points and reader challenge blocks, not in the agent's main
execution narrative.

## 机制：quote, then map

Quote the actual rule, gate text, or script lines — not a paraphrase. This
applies to **every enumeration of the skill's own rules anywhere in the
stage**, not just the 机制 section: a paraphrased checklist drifts (counts
go wrong, items merge) the moment it leaves the source. If you must compress
a quoted list, keep the quote visible and compress around it.

Then map each quoted piece to which half of the pain it blocks:

```markdown
skill 的处理是 <机制>：<文件 / 规则 / 脚本> 先钉住 <维度>，
后面的 <stage / 文件 / 命令> 只读这一个来源。
```

Put the quote and its explanation side by side. Do not make the reader jump to
another chapter to understand a load-bearing mechanism.

When the verbatim text is a one-line prose schema or field list, do not leave
it as inline code inside the quote — render the shape as a fenced code block
(`jsonc` for object schemas) next to it, noting 「原文为一行散文式 schema」.
Fidelity stays in the quote; readability lives in the block.

## Explain terms before names

When a source-skill term first appears anywhere, add a short local
explanation. Do not make the reader jump to Glossary just to keep reading.

Good:

```text
我先生成 `script.md`（能念出口的口播节拍稿），再按 `---` 切出的节拍点
（每个节拍点大致对应一个 step）拆章节。
```

Bad:

```text
我先生成 script.md，按 SCRIPT-STYLE.md 三层标准改写，注意保留节拍点。
```

Only promote 1-3 terms to full Glossary cards. Promote a term when
misunderstanding it would make several later stages confusing.

## Use first-person execution voice

Walkthrough uses "我" because the page shows the agent being guided by the
skill. Do not keep saying "我作为 AI"; the reader already knows the speaker.

Good:

```text
我手里有 6 份调研文件。

第一秒我想挑最醒目的 5 句话，把它们包装成心智模型。

skill 不让。它要求每个候选都过三道筛。
```

Bad:

```text
我作为 AI agent 在此阶段根据 skill protocol 执行 framework synthesis。
```

## Show freedom level

For creative stages, show default instinct versus constrained result as a
minimal contrast — the two samples differ in exactly one variable.

````markdown
默认本能会这样写：

```tsx
<p>准确率从 64% 提到 89%</p>
```

skill 不让这样写。它把 64% -> 89% 判成 "对比 + 增长"，所以画面必须同时呈现
两个数字、颜色差异和上升动作。
````

For almost-mechanical stages, say why there is little freedom:

```text
这一步几乎没发散空间。`script.md` 已经把顺序、关键数字和语气钉住了。
我只需要按 step 顺序填进数组，并保证数组长度等于页面 step 数。
```

## Connect stages

Each stage should have a short opening and closing handoff.

```markdown
**接上一步：** <上一步留下了什么，所以这一步可以做什么>

<stage narrative>

**这里能偷的招：** 当 <触发条件> → <动作一句话>

**下一步靠这个：** <这一步让下一步不用重新判断什么>
```

The move starts with its trigger condition. A bare action ("先把文件名定死")
degrades into a noun once copied out of context; "当多个并行产出要被下游消费
时 → 先钉死文件名" survives the copy. Full conditional knowledge (太重/反例)
lives in the matching archive card — link it with **对应档案:**, do not
restate it.

First stage uses `**从这里开始：**`. Last stage uses `**这里把账结清：**`.

The closing handoff for stage N and the opening handoff for stage N+1 should
say the same thing from two sides.

## Mark carry-away craft with `!steal`

When a stage's mechanism is itself reusable craft outside the source
skill's task domain（一张清单、一组数值、一个验法——判据见
`references/steal-scan.md`），mark it in place with a `!steal` callout
right after the mechanism quote. The callout speaks to the reader in
second person（「下次你写…可以直接拿…」), gives the minimal usable form,
and names a scene outside the task domain. Max 3 per stage. It does not
replace 可偷的招 — that line stays the stage's design move (条件→动作,
for skill authors); the callout hands over domain craft (for
practitioners). Same point, two angles, never the same prose.

## End with reader challenges

Challenges are for the human reader as a future skill author. Put them in a
visually distinct block so they do not sound like the agent's inner monologue.

Use 3-4 concrete questions from real edge cases:

- boundary the stage does not fully cover;
- conflict between two rules;
- cost case where the rule may be too heavy;
- missing input or weak evidence case.

## Self-check

- Does the walkthrough open with the panorama before stage 1?
- Does every stage locate itself on the same mini-map?
- Are both pain questions asked, with "确无" written when empty?
- Is every pain an observable symptom with an evidence grade, pulled from the
  brief?
- Does every pain-carrying stage have a predict point before its mechanism?
- Is the mechanism quoted, not paraphrased, and explained in place — and is
  every enumeration of skill rules a quote rather than a paraphrase?
- Are input, reading material, and output backed by real material?
- Does every stage have a 真实产出 section with real values, each excerpt
  sourced per the evidence ladder (synthesized ones labeled 模拟样本)?
- Are important terms explained before use?
- Does the narrative use first-person execution voice without repeating
  "我作为 AI"?
- If creative, does it show a minimal contrast? If mechanical, does it say why
  there is little freedom?
- Do the handoffs create a clear cause-and-effect chain?
