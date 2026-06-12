---
title: 女娲 · Skill造人术 解剖手册
skillName: 女娲 · Skill造人术
audience: 想自己写 skill 的创作者,以及想知道「人物 skill 为什么不是角色扮演 prompt」的使用者
sourcePath: /Users/guwanhua/git/nuwa-skill
version: v1
baseline: 同款模型、不带本 skill、用户一句话 prompt(「帮我做一个孙宇晨 skill」)的默认 agent;领域难点另加人类基线:没做过人物研究的普通写作者
---

## 贯穿例子
**label:** 蒸馏孙宇晨
**用户请求:** 「蒸馏一个孙宇晨」
**为什么挑这个例子:** 源包 examples/ 里唯一同时具备三层真实标本的案例:标准 6 文件调研档案(2087 行)、v3.0 Agentic Protocol 段落、最极端的表达 DNA(割味造句公式)。手册里所有摘录都能用真材料,不需要编。
**预期产出:** `sun-yuchen-perspective/SKILL.md`,488 行——6 个心智模型、8 条决策启发式、5 种造句公式、6 条诚实边界。

## 图表

### main-flow
**标题:** 女娲流水线全景:从一个名字到一个可运行的人物 skill
**说明:** 六站流水线加两个暂停点。蓝色是工作站,黄色是必须等用户点头的检查点,绿色是最终交付物。
**kicker:** flow
**文件:** assets/diagrams/main-flow.svg

### data-flow
**标题:** 数据流:一句话怎么变成 488 行 SKILL.md
**说明:** 粉色文件落在 skill 目录里、永久存在;黄色产物只活在对话里、专门给用户做确认用。两类产物的分工是这条流水线的关键设计。
**kicker:** dataflow
**文件:** assets/diagrams/data-flow.svg

### wow-compare
**标题:** 同一个问题,两种「孙宇晨」
**说明:** 左边是默认 agent 用训练记忆拼出来的人设(模拟样本),右边是女娲产出的 skill 在源包里的真实示例。差别不在文采,在于右边先查了真数据、再用他的判断框架开口。
**kicker:** compare
**文件:** assets/diagrams/wow-compare.svg
