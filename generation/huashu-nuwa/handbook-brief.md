# Handbook brief — 女娲造人（huashu-nuwa）v2

源：/home/guwanhua/Desktop/git/nuwa-skill
基线：同款模型、不带女娲、收到「帮我做一个乔布斯 skill」的默认 agent。
（领域难点另加人类基线：没做过人物建模的合格写作者。）

## 包地图

- `SKILL.md`（644 行）：入口 + 全部 Phase（0 分流 / 0A 澄清 / 0B 诊断 / 0.5 建目录 /
  1 六维并行调研 / 1.5 检查点 / 2 提炼 / 2.5 检查点 / 3 构建 / 4 验证 / 5 双 Agent 精炼）
- `references/extraction-framework.md`（151 行）：三重验证、表达 DNA 量化、矛盾处理、质量自检清单
- `references/skill-template.md`（115 行）：目标 skill 的结构契约
- `scripts/`：download_subtitles.sh / srt_to_transcript.py / merge_research.py / quality_check.py
- `examples/`：15 个已生成的人物 skill（生成产物，不当规范）

## 贯穿例子

用户请求：「帮我做一个乔布斯 skill，用来审视产品设计和战略取舍。」
为什么代表主路径：明确人名 → 直接路径，走完全部 Phase。
预期产出：`.claude/skills/steve-jobs-perspective/`，含 SKILL.md + research/01-06 + sources/。

## Ordinary-view pain scan

| Ordinary assumption | Real friction | First visible symptom | Dimension | Evidence | Skill mechanism | Where it appears |
| --- | --- | --- | --- | --- | --- | --- |
| 做人设就是写一段像他的话 | 金句人设没有生成力，新问题就崩 | 问 Vision Pro 值不值得买，它凭旧记忆编一个像乔布斯的回答 | 领域-认知 | 作者证词 | 核心理念「HOW they think 不是 WHAT they said」+ skill-template 的心智模型结构 | stage-05 / A1 |
| 随便挑几条像的观点就行 | 随口一说和真信念分不清 | 把一句场合话当成核心思想写进人设 | 领域-认知 | 作者证词 | extraction-framework 三重验证（跨域复现/生成力/排他性） | stage-05 / A2 |
| 看几篇文章就能了解一个人 | 单一来源产出漫画式人设 | 人设只会重复一篇爆款文章里的论调 | 领域-认知 | 作者证词 | 6 Agent 六维取证 + 信息源权重表 | stage-03 / A3 |
| 并行调研结果汇总一下就行 | 子 agent 调研结果丢在上下文里会蒸发 | 提炼时引用不出任何来源，全凭印象 | 编排 | 作者证词 | 「不存文件的调研等于没做」+ 固定目录结构 | stage-02 / A4 |
| 一口气跑完直接交付 | 垃圾进垃圾出，写完 400 行才发现方向错 | 交付后用户说「这根本不像他」，全部返工 | 行为 | 作者证词 | Phase 1.5 / 2.5 两个用户检查点 | stage-04 / A5 |
| 矛盾的材料要调和成一致 | 调和出来的人设假得发亮 | 「观点高度一致（太假）」——Phase 4 的不通过信号 | 领域-认知 | 作者证词 | 矛盾处理三分类 +「内在张力」section | stage-05 / A6 |
| 信息不够就尽量写满 | 强行生成 = 编造 | 看起来完美的 90 分 skill，实际在编造 | 品味 | 作者证词 | 「60 分诚实 > 90 分编造」红线 + 诚实边界 section | stage-03 / A7 |
| 自己生成自己检查就行 | 主 agent 自评必然偏高 | 验证全过但用户一测就穿帮 | 行为 | 实测 | Phase 4 spawn 子 agent 独立测试 | stage-06 / A8 |
| 搜中文资料哪里都能搜 | 中文信息生态洗稿严重 | 调研文件里全是二手转述和洗稿文 | 平台 | 作者证词 | 信息源黑名单（知乎/公众号/百度系永远排除） | stage-03 / A9 |
| 用户不知道要谁就没法做 | 模糊需求需要反推蒸馏对象 | 直接问「你要蒸馏谁」把用户问跑 | 需求 | 作者证词 | Phase 0B 需求诊断表 + 候选推荐格式 | stage-01 / A10 |
| 字幕下载清洗手工搞 | 下载/清洗易错且重复 | 滚动重复污染「≥3 次=真信念」判据 | 领域-工程 | 实测 | scripts/ 四个脚本接管机械活 | stage-03 / A11 |

## 全量盘点附录

- 中间产物清单：`references/research/01-06.md`（六维调研文件）、`sources/{books,transcripts,articles}/`（一手素材库）、
  Phase 1.5 调研摘要表（瞬态，merge_research.py 生成）、Phase 2 提炼结果（心智模型/启发式/DNA/张力/边界）、
  Phase 2.5 提炼摘要（瞬态）、最终 `SKILL.md`、quality_check.py 的 PASS/FAIL 报告（瞬态）
- 风险缓解（非难点）：Agent 超时 5 分钟不等待继续推进；迭代上限 Phase 2→4 最多 2 轮
- 残渣：Phase 5 双 Agent 精炼依赖 auto-skill-optimizer / skill-creator 两个外部视角（平台伤疤）；
  「品味守则」速查表与 Phase 4 通过标准大面积重复（过度设计）
- 盲区：同名人物歧义没有处理指引；黑名单靠自觉遵守，没有机器校验来源；
  在世人物的争议立场带来的法律/名誉风险没有指引

## Stage IDs

- stage-01 入口分流与需求澄清（Phase 0 / 0A / 0B）
- stage-02 先建目录，给调研钉住址（Phase 0.5）
- stage-03 六维并行取证（Phase 1）
- stage-04 调研检查点（Phase 1.5）
- stage-05 三重验证提炼（Phase 2 / 2.5）
- stage-06 构建、独立验证、精炼（Phase 3 / 4 / 5）

跨阶段机制线：固定文件住址（stage-02 建 → stage-03 写 → stage-05 只读它提炼 → stage-06 引用汇总）；
检查点节奏（stage-04 拦调研质量 → stage-05 末拦提炼方向 → stage-06 末展示验证结果）。

## Term IDs

心智模型 / 决策启发式 / 表达 DNA / 三重验证 / 诚实边界 / Agentic Protocol

## Card IDs

A1 金句不是 DNA（领域-认知/表征/高，作者证词）
A2 三重验证筛模型（领域-认知/流程/高，作者证词）
A3 六维取证（领域-认知/表征/高，作者证词）
A4 不存文件的调研等于没做（编排/流程/高，作者证词）
A5 便宜返工点检查点（行为/流程/高，作者证词）
A6 矛盾是特征不是 bug（领域-认知/表征/高，作者证词）
A7 60 分诚实大于 90 分编造（品味/流程/高，作者证词）
A8 子 agent 独立验证（行为/流程/高，结构推断）
A9 信息源黑名单（平台/流程/低，作者证词）
A10 需求诊断反推对象（需求/流程/高，作者证词）
A11 字幕管线脚本化（领域-工程/脚本/高，结构推断）

七个维度标签全部有卡，无空维度。

## Diagrams

- main-flow.svg：九站流水线全景（Overview panorama + Walkthrough 开头复用）
- data-flow.svg：中间产物数据流（dataflow 章）

## Pages

五章 + 附录，按 references/handbook-spec.md。

## Risks / assumptions

- A8（自评偏差）、A11（字幕坑）与 stage-01 行为难点已于 2026-06 消融实测（见 ablation/）：
  A8、A11 确认升级；stage-01 原断言被证伪并改写（基线不会干瘪反问，但 0/3 进入人物蒸馏解法空间）。
- 六维清单「为什么是这六个」缺作者解释，卡 A3 的反事实是推断。
- A2 卡的力度对比在实验 3 中获得意外佐证：稀薄材料下三重验证确实把 5 个候选全部拦在模型门外。
