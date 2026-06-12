---
title: Web Video Presentation 解剖手册
skillName: Web Video Presentation
audience: 想自己写 skill 的创作者，以及想知道「AI 做的网页为什么总像 PPT」的内容作者
sourcePath: /home/guwanhua/Desktop/git/garden-skills/skills/web-video-presentation
version: v1
baseline: 同款模型、不带本 skill、用户一句话 prompt（「把我这篇文章做成视频网页」）的默认 agent；领域难点另加人类基线：会写 React 但没做过录屏视频网页的前端工程师
---

## 贯穿例子
**label:** 测评视频《我让 5 个 AI 工具重写我的博客》
**用户请求:** 「这是我公众号那篇《我让 5 个 AI 工具重写我的博客》，大概 2000 字，帮我做成 B 站视频。」
**为什么挑这个例子:** 科技测评是源包 case-tech-review 示例和 midnight-press 主题 bestFor（AI / 工具评测）双命中的主路径题材；自带数字、对比、案例，信息池和双源原则都有真实用武之地；「5 个工具」天然演示「1 项 = 1 step」。源包不带成品案例，所以本例的稿件摘录是模拟样本，工程类摘录全部来自切片实测。
**预期产出:** `my-video/` 目录：script.md（约 1280 字 / 约 5 分 20 秒）＋ outline.md（5 章 38 步＋信息池＋素材清单）＋ presentation/ Vite 工程（midnight-press 主题）＋ 38 个 mp3 ＋ `?auto=1` 一镜到底录屏成片。

## 图表

### main-flow
**标题:** 全流程：一篇文章怎么变成一支可录屏的视频
**说明:** 蓝色是工作站，黄色是必须等用户点头的检查点，绿色是最终交付。注意两个黄色节点的位置：一个堵在写代码之前，一个堵在烧钱合成音频之前。
**kicker:** flow
**文件:** assets/diagrams/main-flow.svg

### data-flow
**标题:** 数据流：从 article.md 到成片，每一站交接什么
**说明:** 粉色文件用户可以直接改；蓝色是工程代码；黄色是脚本生成的构建产物。注意 article.md 有一条跨过 script.md 直达章节代码的边——这就是双源原则。
**kicker:** dataflow
**文件:** assets/diagrams/data-flow.svg

### truth-source
**标题:** narrations.ts：一个文件钉死五个消费方
**说明:** step 数和口播文本本来散落五处、必然漂移。这个 skill 把它们全部收拢到每章一个 narrations.ts 数组：长度就是 step 数，元素就是音频文本。改节奏只改这一个文件。
**kicker:** anchor
**文件:** assets/diagrams/truth-source.svg

### wow-compare
**标题:** 同一篇文章，两种「视频网页」
**说明:** 左边是默认 agent 的产出（模拟样本）：滚动长页、列表全亮、紫粉渐变。右边是本 skill 的产出结构：16:9 固定舞台、一步一画面、隐形进度条。差别不在审美，在于右边是给录屏机器人设计的，左边是给浏览者设计的。
**kicker:** compare
**文件:** assets/diagrams/wow-compare.svg
