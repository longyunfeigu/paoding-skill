---
title: 女娲 · Skill 造人术 解剖手册
skillName: 女娲 · Skill 造人术
audience: 想偷招的 skill 作者 / 还没用过这个 skill 的 AI
sourcePath: /home/guwanhua/Desktop/git/nuwa-skill
version: v1
baseline: 同款模型、不带本 skill、收到用户一句话 prompt（如「帮我做一个乔布斯的思维 skill」）的默认 agent；人类基线是没做过人物建模、只会摘金句的认真写作者。
---

## 贯穿例子

**label:** 蒸馏史蒂夫·乔布斯
**用户请求:** 帮我做一个乔布斯的思维 skill
**为什么挑这个例子:** 它走主路径——用户给的是明确人名，直接进 Phase 0A 蒸馏，不绕模糊需求的诊断分支。而且源包的 `examples/steve-jobs-perspective/` 里留了完整的六维调研档案、一份 6/6 通过的成品 SKILL.md，连 `merge_research.py`、`quality_check.py` 都能在它身上真跑出结果——每一站都有真实物料可引，不靠编。
**预期产出:** `.claude/skills/steve-jobs-perspective/SKILL.md`：6 个心智模型、完整表达 DNA、一段按模型推导的 Agentic Protocol、3 条诚实边界，`quality_check.py` 跑出 6/6 PASS。

## 图表

### main-flow
**标题:** 女娲七站流水线
**说明:** 从「人名/主题/模糊需求」到「可运行的人物 SKILL.md」，中间七站加两个暂停检查点；黄框是检查点，红色虚线是验证不通过时的回炉环路（最多 2 次）。
**kicker:** 全景
**文件:** assets/diagrams/main-flow.svg

### dataflow
**标题:** 中间产物数据流
**说明:** 跟着数据走：用户输入 → 六维调研档案（必落盘）→ merge 摘要 → 提炼结果 → SKILL.md → quality_check → 交付成品。脚本是虚线框。
**kicker:** 数据流
**文件:** assets/diagrams/dataflow.svg

### pain-network
**标题:** 难点的七维度分布
**说明:** 女娲防住的难点按「执行者/输入/环境/任务/标准/规模」六部分拆出的七个维度归类；平台维度确无独立卡，来源黑名单并入品味。
**kicker:** 难点网络
**文件:** assets/diagrams/pain-network.svg
