---
title: 女娲造人 Skill 解剖手册
skillName: 女娲造人
audience: 想偷招的人 / 还没用过这个 skill 的 AI
sourcePath: /home/guwanhua/Desktop/git/nuwa-skill
version: v2
baseline: 同款模型、不带女娲、收到「帮我做一个乔布斯 skill」的默认 agent。
---

## 贯穿例子
**label:** 乔布斯 skill
**用户请求:** 帮我做一个乔布斯 skill，用来审视产品设计和战略取舍。
**为什么挑这个例子:** 明确人名走直接路径，会完整经过分流、建目录、六维调研、两个检查点、提炼、构建、验证全部六站，没有岔路损耗。
**预期产出:** 一个自包含的 `.claude/skills/steve-jobs-perspective/` 目录：可激活的 SKILL.md、六份调研文件、一手素材库，复制走就能用。

## 图表
### main-flow
**标题:** 六站流水线全景
**说明:** 一句话请求从左边进；中间六站，每站交出一个有固定住址的产物；两个菱形是必须停下来让用户看质量的检查点。
**kicker:** panorama
**文件:** assets/diagrams/main-flow.svg

### data-flow
**标题:** 中间产物数据流
**说明:** 数据怎么从一句话流成一个可运行的 skill：素材进 sources/，调研写进 research/01-06，提炼结果按模板灌进 SKILL.md。
**kicker:** dataflow
**文件:** assets/diagrams/data-flow.svg
