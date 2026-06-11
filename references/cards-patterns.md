# Difficulty-archive cards

Use this reference when writing or reviewing the 难点档案 chapter. Older
handbooks split "design choices" and "patterns" into two pages; this spec
merges them into one card type with a transferability field. A design choice
worth writing about is the answer to a pain; a pattern is the same answer with
high transferability.

Term cards and artifact cards are defined in `references/handbook-spec.md`
(Glossary standard, 中间产物与数据流 standard). This file owns only the
archive card.

## Chapter shape

- Open with orientation: a pain panorama grouped by dimension (seven labels
  from `references/pain-dimensions.md`), then an index table with one-line
  summaries and anchors.
- 8-15 cards that explain the skill's shape. Do not card every rule. Prefer
  pains whose mechanism changed the AI's behavior or the artifact design:
  - why the skill does not answer immediately;
  - why a checkpoint exists;
  - why an intermediate artifact has a counter-intuitive shape;
  - why a later phase gets decision power;
  - why validation must fix before reporting;
  - why a script handles a fragile step.
- Close with two honest sections from the sweep appendix: 残渣与砍掉候选
  (rules that failed the pain test, each with the reason: platform scar,
  over-design, or cargo cult) and 盲区 (pains the skill does not cover).

## Card template

```markdown
### A<n> <难点名，大白话> · 维度：<七标签之一>

**症状（基线会怎么坏）：** <observable bad output, rework, or user-visible
defect. Not "质量下降"。> （证据：<实测/作者证词/结构推断/假设>）

**最小对照：**

| 没有这个机制 | 有这个机制 |
| --- | --- |
| <bad sample> | <good sample> |

两个样本只允许差一个变量。差三个变量的对照等于没对照。

❖ &nbsp; ❖ &nbsp; ❖

**Therefore:** <one-line pivot from problem to solution>

❖ &nbsp; ❖ &nbsp; ❖

**skill 怎么解（贴原文）：**

> <verbatim quote of the rule, gate text, or script lines>

<one or two sentences mapping the quote to the symptom it blocks>

**解法层次：** 脚本解法 / 表征解法（中间产物形态）/ 流程解法（阶段、gate、
检查点）

**可迁移性：高 / 低**

- 高 → 补全：**什么时候用：** ... **什么时候太重：** ...
  **反例（看着像但不是这招）：** ... **在哪几个 skill 里见过：** ...
- 低 → 说明原因：项目特有 / 平台伤疤（给哪个工具或模型版本擦屁股）/
  尚无第二个佐证案例

**不同场景下的力度对比：**

| 场景 | 效果 | 为什么 |
| --- | --- | --- |
| <典型场景> | 管用 | <为什么这是它的甜区> |
| <边缘场景> | 得让一步 / 用力过了 / 可以简化 | <为什么这里它是负担> |
| <反例场景> | 用不上 / 看情况 | <为什么这里规则空转> |

**和哪些卡一起读：**
- → A<n> <卡名>（搭配用：...）
- → A<n> <卡名>（前置 / 区别于 / 下游接管 / 对照 / 可能冲突：...）
```

## Field rules

**症状** is the load-bearing field. It must pass the three-question pain test
in `references/pain-dimensions.md`: concrete enough to check, claimed against
the declared baseline, graded by evidence. A card whose symptom cannot be
observed is rejected at the gate.

The symptom must be a stageable scene, not a summary of one. Give the sample
itself (a line of dialogue, an output snippet, an error), then one sentence
on why it is bad. Cards serve direct-link readers who have not read Overview;
a symptom that needs the Overview story to decompress is broken.

Bad (a summary the reader must decompress):

```text
用语录拼出来的人设，问到训练语料之外的新问题，凭旧记忆编一个像样的回答。
```

Good (the scene itself):

```text
你问人设：「Vision Pro 现在值不值得做？」它答：「人们不知道自己想要什么，
直到你把它放到他们面前。值得做。」——流畅、像他，但没查任何最新事实，
是用旧语料编的，而且你看不出来。
```

The 最小对照 cells follow the same rule: put samples in the cells, not
descriptions of samples, whenever the sample fits in a table cell.

**最小对照** makes the counterfactual visible. If a real bad sample exists
(from ablation or the skill's own docs), use it; otherwise construct one and
keep the evidence grade honest (结构推断 or 假设).

**贴原文** is mandatory. A paraphrased mechanism teaches the reviewer's
understanding, not the skill's actual move. Quote, then explain — side by
side, never "see chapter X".

**解法层次** tells the reader where the intelligence lives:

- 脚本解法：易错的机械活交给代码（领域-工程 pains usually land here）;
- 表征解法：换中间产物的形态（领域-认知 pains usually land here — the
  counter-intuitive artifact heuristic）;
- 流程解法：切阶段、加 gate、停下来问（行为/编排/需求 pains usually land
  here）.

**可迁移性** is what separates this chapter from a rule list. 高 cards feed
the Apply-it chapter and a future cross-skill cookbook; 低 cards are still
worth a card when they explain the skill's shape, but must say why they do
not travel.

Allowed `effect` values in the 力度对比 table（用大白话的短语，读者一眼能懂；
不要发明术语）：

- **绿色档：** 管用
- **琥珀档：** 可以松点 / 得让一步 / 用力过了 / 可以简化 / 不用做 / 看情况 /
  也许碍事
- **灰色档：** 用不上 / 没必要 / 反而碍事

旧词对照（旧产出迁移用）：救你 → 管用；绑你 → 反而碍事；部分让位 → 得让一步；
部分过度 → 用力过了；应简化 → 可以简化；可以跳过 → 不用做；取决于 → 看情况；
完全失效 → 用不上；完全多余/完全冗余 → 没必要；可能绑你 → 也许碍事；
可以放宽 → 可以松点。

The `❖ ❖ ❖` divider tells the reader to stop one second between problem and
solution. The cross-link section turns isolated cards into a navigable
network; each relation names its kind（搭配用 / 前置 / 区别于 / 下游接管 /
对照 / 可能冲突）, never just "相关".

## Cards self-check

- Does every card's symptom pass the three-question pain test, with an
  evidence grade?
- Does every card carry a verbatim quote and a minimal contrast (one variable
  of difference)?
- Is the solution layer named, and does it match the dimension's usual
  pattern (mismatches are interesting — call them out)?
- Is transferability decided, with 什么时候太重 for 高 and a reason for 低?
- Are all three scenario effects positive? If yes, rewrite at least one as a
  real constraint, partial fit, or failure case.
- Does every card link to at least one related card, with the relation kind
  named?
- Does the chapter close with 残渣与砍掉候选 and 盲区?
