# Steal scan · 带走点扫描与 callout

Version: v1. Read this file when producing a web handbook (alongside the
pain sweep in `references/pain-dimensions.md`), or whenever the user asks
"这个 skill 里有什么我能直接拿走的". The pain sweep answers "这个 skill
防了什么"; this scan answers "这个包里本身装着什么" — the two are
complements, and the second is systematically missed by the first.

## Why a second sweep

The pain sweep inventories mechanisms **as answers to pains**. But a skill
package also carries content that never answered a pain: craft tables,
magic constants, named distinctions, message templates, evaluation methods.
None of them "防住" anything, so a pain-driven sweep never lists them —
yet they are exactly what a practitioner reader can copy out and use
tomorrow, without the skill, without the pipeline.

「去 AI 味五类清单」是判例：它在痛点表里只是 stage-01 的一个机制；
但任何写公众号、写演讲稿的人，把这张清单单独撕下来就能用。手册若只把
它当机制讲，读者要自己悟出「这是张通用清单」——steal scan 的工作就是
替读者把这层悟出来、标在现场。

## Two tiers

| 档位 | 含义 | 判据 |
| --- | --- | --- |
| 直接抄走 | 清单、数值、对照表、话术——原样复制就能用 | 不需要懂这个 skill 的其它部分 |
| 思路带走 | 原则、模式、做法——思路直接搬，落地要适配 | 换个领域后「形」变「神」不变 |

## The filter: three tests per candidate

1. **脱离流水线测试：** 把规则原文单独抄到便签上，扔掉整个 skill，
   它还能独立执行、独立产生价值吗？（去 AI 味清单 ✅；narrations 长度
   约束 ❌——离开那套架构没有意义。）
2. **自带工具测试：** 它自带判断标准和操作步骤（黑名单＋改法＋检验法），
   不需要读者补脑上下文？过 → 直接抄走；理念层面过得了测试 1 但要适配
   → 思路带走。
3. **场景明确测试：** 能用一句话说清「你将来在〔什么场景〕拿它干
   〔什么〕」，且那个场景与源 skill 的任务域无关。

三个测试都过不了的不标。标了等于稀释：满屏荧光笔等于没有荧光笔。

## The sweep: six lenses over the package

Candidates come from sweeping the package six ways. Lens 1 reuses the pain
sweep's output; lenses 2-6 ask "它本身是什么" instead of "它防什么":

| # | 镜头 | 问什么 | 典型产出 |
| --- | --- | --- | --- |
| 1 | 痛点扫描 | 这条机制防住了什么坑？ | 设计模式（思路带走为主） |
| 2 | 知识扫描 | 这一节撕下来是知识还是胶水？ | 数值表、经验法则、对照表 |
| 3 | 概念扫描 | 作者给什么现象起了名字？ | 可带走的思维词汇（「语录 vs 镜片」「呼吸感」） |
| 4 | 话术扫描 | 有没有写好的、面向人的消息模板 / 提问 / 验收单？ | 检查点话术、追问限流话术 |
| 5 | 验法扫描 | 有没有可独立使用的检验 / 评估方法？ | 念出来测试、盲测认人、跨域复现三问 |
| 6 | 产物形状扫描 | 有没有可照抄结构的中间产物模板？ | 信息池条目格式、调研档案目录结构 |

Sweep procedure: walk every reference file section by section with lenses
2-6 (lens 1 is already done by the pain sweep). Each hit goes through the
three-test filter, then into the brief's 带走候选清单 table:

```markdown
## 带走候选清单

| 候选 | 镜头 | 档位 | 用在哪 | 进手册的位置 |
| --- | --- | --- | --- | --- |
| 去 AI 味三层自检 | 验法+知识 | 直接抄走 | 任何写作与文案 | stage-01 机制段 |
```

## The callout: `!steal` in content

A qualified candidate is marked **at the spot where the reader meets it** —
in the walkthrough stage or dataflow card where the mechanism/knowledge
lives — with a `!steal` block (syntax in `references/content-format.md`):

```markdown
!steal(去AI味三层自检 ｜ 直接抄走 ｜ 任何写作与文案)
> 这张清单和视频无关——下次你写完任何要发出去的文字，可以直接拿
> 三层过一遍：先扫 8 条形式原则，再扫五类腔调指纹（假共情 / 假深刻 /
> 自我标榜 / 万能模板 / 排比），最后挑 3 段真的张嘴念。
```

Writing rules:

- **第二人称、沟通语气。** Callout 是手册作者对读者说话的块，跳出
  agent 第一人称叙事；正文必须出现「你」。
- **三件套：** 一句「这和源任务无关」的破壁、规则本体的最小可用形态
  （直接抄走档要给到能照做的程度）、一句「你将来在 X 场景这么用」。
- **不复述机制原文。** 机制原文在引用块里已经有了；callout 讲的是
  "怎么搬"，不是"它是什么"。
- **密度上限：每站最多 3 个**（机器告警）。超了就挑最值钱的，其余
  留给档案卡的可迁移性字段。
- **不许连发：两个 callout 之间至少隔一个正文块**（机器告警）。
  连续两屏荧光底，高亮就失去了稀缺性——需要相邻时，写一句过渡正文
  把两招的关系交代出来，顺便把读者从上一招带进下一招。
- 和「可偷的招」的分工：收尾那行是本站设计动作的浓缩（条件→动作，
  面向 skill 作者）；callout 是领域手艺的现场移交（面向干活的人）。
  同一个点两边都值得时，各写各的角度，不许同文。

## 带走工具箱 (toolbox appendix)

`build-data.py` aggregates every `!steal` block into `handbook.toolbox`,
and the renderer ships an auto-generated appendix page (附录 2 · 带走
工具箱), grouped by tier, each item linking back to its in-context spot.
There is no `content/toolbox.md` — the page is a build artifact, callouts
in page content are the single source of truth. Do not hand-write a
collection chapter; that would be a second copy.

## Self-check

- Did lenses 2-6 actually run（brief 里有带走候选清单表，且至少一条
  不来自痛点表）？
- Does every callout pass the three tests, carry a tier, and name a
  scene outside the source task domain?
- Is every callout written to the reader（出现「你」），with the
  minimal usable form inline?
- Density: ≤3 per stage; the toolbox page exists and every item's
  back-link lands on the callout.
