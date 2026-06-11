# Pain dimensions

Version: v1. This file is the single source for classifying what a skill
overcomes. Read it before writing the ordinary-view pain scan, the Walkthrough
stage pains, or any difficulty-archive card.

This taxonomy is falsifiable by design. It does not claim to be complete; it
claims that incompleteness becomes visible. See "Residue rule" and "Known edge
cases" below.

## Why these dimensions

Do not memorize the list; rebuild it from the situation. Every skill execution
has the same six parts:

```text
一个执行者，接收一个输入，在一个环境里，做一个任务，按某个标准，在规模约束下交付。
```

Difficulty can only attach to one of the six parts. One part, one dimension.
The task part splits into two kinds, so the label list has seven values.

| # | Situation part | Dimension label | One-line test |
| --- | --- | --- | --- |
| 1 | 任务（动作执行难） | 领域-工程 | 这件事换一个能干的人来做，也会在这里翻车吗？ |
| 2 | 任务（想对才难） | 领域-认知 | 动作不难，但"该产出什么形态的东西"想错就全错？ |
| 3 | 执行者 | 行为 | 只有当执行者是 LLM 时这个问题才存在吗？ |
| 4 | 规模 | 编排 | 单次上下文装不下、或并行/交接才出的问题吗？ |
| 5 | 标准 | 品味 | "好"说不清楚、说清楚也难固化的问题吗？ |
| 6 | 输入 | 需求 | 用户给的输入本身模糊、缺信息、口是心非吗？ |
| 7 | 环境 | 平台 | 换个模型版本、工具、操作系统，这条还存在吗？ |

Examples from real skills:

- 领域-工程：生图模型给"近白底"而不是纯白底，贴白页显灰（解法：脚本强制漂白 +
  色键抠透明）。视频里的音画同步。长 prompt 生图超时（解法：精简 + 失败重试）。
- 领域-认知：用语录拼人设，遇到没见过的新问题就崩（解法：中间产物改成可迁移的
  思维模型，"DNA 而不是金句"）。只看一篇文章理解一个人，产出漫画式人设
  （解法：先设计六个取证维度再调研）。
- 行为：模型写完代码不跑测试，输出"测试应该能通过"就报完成（解法：必须粘贴
  测试命令原始输出）。
- 编排：多章并行写作互相污染（解法：每章独立文件 + 写作契约，子任务只认契约）。
- 品味：手绘信息图默认偏黑白、显闷（解法："彩色平涂、每张 ≥4 色、不同分区
  不同色"写进风格前缀）。
- 需求："帮我做一个乔布斯 skill"没说清是明确人名还是模糊需求（解法：第一步
  强制分流提问）。
- 平台：字体依赖运行环境，换机器排版崩（解法：开工先 `typst fonts` 确认，
  缺了换等价字体）。

Dimension labels are a recall aid, not a coverage guarantee. Coverage comes
from the item-driven sweep below.

## Where each dimension lives in a package

Use this table to know where to look. It tells you the usual address, not the
only address.

| Dimension | Usual address in the package | Extraction question |
| --- | --- | --- |
| 领域-工程 | `scripts/`、重试逻辑、魔法数字、"坑/经验/红线"小节 | 这个脚本替 agent 干掉了哪个易错的活？那活为什么易错？ |
| 领域-认知 | 中间产物的 schema、维度/清单类 reference、"产出什么"的规定 | 这个中间产物为什么长这样？清单为什么是这几项、少一项会怎样？ |
| 行为 | MUST/NEVER、gate、强制贴证据、检查点暂停 | 没有这条强制令，模型默认会干什么？ |
| 编排 | 阶段划分、文件契约、并行/串行决定、交接文档 | 为什么在这里切一刀？两段共享什么、靠什么文件交接？ |
| 品味 | `styles/`、示例、rubric、具体到数字的审美规则 | 它在排除什么样的"差但说不出哪差"？ |
| 需求 | 开场提问、分流逻辑、对齐检查点 | 用户最常给出哪种残缺输入？猜错的代价是什么？ |
| 平台 | 环境探测、依赖说明、版本怪癖注记、大写强调 | 这条是给哪个工具/模型版本擦屁股的？换了环境还需要吗？ |

## Two cross-cutting heuristics

Apply these while sweeping, regardless of dimension:

1. **任何"具体得可疑"的细节，背后都是一个踩过的坑。**
   "每张 ≥4 色"、"漂白阈值"、"只取本次新增图"——没有人凭空写出这种规则。
   见到可疑的具体性，追问"什么失败逼出了这行字"。
2. **任何"反直觉的中间产物"，背后都是一个领域洞察。**
   直觉做法是收到请求直接出结果；流水线却先生产一个你裸做时不会想到的
   中间文件。追问"为什么不直接出结果，为什么中间要过这个东西"。

## The pain test: three questions per item

"难"是感受，"失败"是事实。手册里禁止出现"这一步很难"式断言。一个条目要被
标成难点，必须答出三问：

```text
① 反事实问：去掉它，第一个坏掉的产物是什么？
   必须写成可观察的症状：坏输出样例、返工、用户可见缺陷。
   写不具体，就不许标为难点。
② 基线问：这个坏结果对声明的基线，是默认发生还是小概率？
   默认发生 = 难点。小概率 = 风险缓解（另立一类，价值较低）。
   不发生 = 非难点，进残渣清单，标为砍掉候选。
③ 证据问：凭什么相信 ① 和 ②？给证据定级（见下表）。
```

Bad symptom (rejected):

```text
没有六维取证，人设质量会下降。
```

Good symptom (accepted):

```text
没有六维取证，问它 Vision Pro 值不值得买，它会凭旧记忆编一个像乔布斯的回答。
```

### Baseline declaration

Difficulty is relative. Every handbook declares its baseline once, in
`handbook-brief.md` and in Overview:

```text
基线：同款模型、不带本 skill、用户一句话 prompt 的默认 agent。
（领域难点可另加人类基线：没做过这类项目的合格工程师。）
```

All pain claims are made against the declared baseline, never against the
reader. A senior reader saying "我才不会犯这个错" does not refute a claim about
the baseline.

### Evidence grades

| Grade | Meaning | Example |
| --- | --- | --- |
| 实测 | 真做了带/不带的对比，观察到失败 | 去掉漂白脚本跑一次，图真的显灰 |
| 作者证词 | skill 自己的"坑/红线/经验"小节、修复型 commit | README 明写"生图模型常给近白底" |
| 结构推断 | 可疑的具体性、重试逻辑、防御性设计 | "每张 ≥4 色"不会凭空出现 |
| 假设 | 纯靠对模型/任务的理解推断 | 必须明确标注"未验证" |

A handbook may carry 假设-grade pains. It may not disguise a 假设 as a
conclusion. Disputed items upgrade by running the ablation, not by arguing.

## The sweep: item-driven, not dimension-driven

Dimensions tell you what questions to ask. Coverage comes from sweeping every
item in the package:

```text
1. 裸做想象：不看 skill，先写下"基线裸做这个任务会死在哪"。
   人类新手一遍，默认 agent 一遍。得到难点假设清单。
2. 全量盘点：包里每条规则、每个脚本、每个中间产物、每个检查点逐条入册。
   中间产物必须单独列全：每个阶段交接的文件/数据，一个不漏。
3. 贴标签：每个条目过三问。通过的标维度 + 证据等级；
   ②答"小概率"的标为风险缓解；②答"不发生"的进残渣。
4. 残渣对账：两边对清。
   - skill 防了、你没想到的 → 你学到的新东西，重点写。
   - 你想到了、skill 没防的 → 它的盲区，诚实写进手册。
   - 无法归入任何维度的条目 → 显式列出，不许静默丢弃。
```

### Residue rule

Unclassifiable residue is the alarm for taxonomy gaps. If a sweep produces
items that pass the pain test but fit no dimension, do two things:

1. Keep them in the handbook under "未归类"; do not force-fit.
2. Record the case in "Known edge cases" below. Repeated residue of the same
   shape means this file needs a new version with a new dimension — and a new
   row in the situation derivation, not just a new label.

## Known edge cases

- 安全/合规类红线（如"闭源系统内部细节一律用'据社区逆向'措辞"）：目前归
  行为（防编造）或品味（交付标准），尚无独立维度的必要。再遇到归类别扭的
  案例时在此记录。
