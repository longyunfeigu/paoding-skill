---
title: last30days 解剖手册
skillName: last30days
audience: 想学习如何设计多源社交舆情调研 skill 的 AI skill 作者和 prompt 工程师
sourcePath: /Users/guwanhua/git/last30days-skill/skills/last30days
version: v3.3.2
baseline: 同款模型、不带本 skill、用户一句话 prompt（「帮我查一下最近 Kanye West 怎么样」）的默认 agent。
---

## 贯穿例子
**label:** 调研 Kanye West 最近 30 天
**用户请求:** /last30days Kanye West
**为什么挑这个例子:** SKILL.md 的主贯穿例子,涵盖人物类话题的全部特殊路径:X handle 解析、GitHub 跳过、子版块发现、TikTok/IG 推断。SKILL.md 给出了完整 CLI 参数样例、合成模板和真实失败案例。
**预期产出:** 一份以 badge 开头、emoji-tree 脚注结尾的综述,保存为 kanye-west-raw-v3.md。

## 图表
### main-flow
**标题:** 六站流水线
**说明:** 从用户话题到综述输出的六个阶段:话题理解 → 前置情报 → 查询计划 → 引擎+补充 → 合成输出 → 对话续接。
**kicker:** flow
**文件:** assets/diagrams/main-flow.svg
