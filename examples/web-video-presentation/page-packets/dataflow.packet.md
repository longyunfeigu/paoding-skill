# dataflow.packet

**Page job:** 沿数据走一遍：article.md → script → outline → narrations/章节代码 → segments → mp3 → 成片，每个产物回答「为什么长这样」。
**Reader state:** 读过走查，见过这些文件名出场。
**Voice:** 产物卡字段化，叙述句短。
**Page-specific standard:** 每卡六字段齐全；「为什么长这样」必须给出「直觉形态 + 它为什么坏」的对照；glossary 收录的承重工件（narrations.ts、tokens.css、audio-segments.json）必须带逐字段标本。
**Evidence shape:** 切片实测标本（narrations.ts 全文、tokens.css 节选、segments 条目）；模拟样本（script 节拍、outline 章节）。
**Failure mode:** 目录清单化——只有谁写谁读、没有为什么。
**Pain scan rows used:** 真相源、双源、token、STORAGE_KEY、outline 留白对应的产物行。
**Inputs:** brief 中间产物清单（13 项全覆盖，轻产物可并卡）。
**Must include:** data-flow 总图（frontmatter flowDiagram）；article.md 跨级直达章节代码的那条边要点破。
**Must avoid:** 把标本贴三遍（walkthrough/glossary 只引用）。
**Packet output:** content/dataflow.md。
**Self-check:** 每卡「写错会坏什么」是可观察的下游故障。
