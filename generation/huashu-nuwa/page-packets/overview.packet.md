# overview.packet

**Page job:** 让从没见过女娲的读者,先看见「默认 agent 造人物 prompt 会怎么坏」,再带着全景图离开:女娲是一条「取证→提炼→组装→外部验证」的流水线,不是一个角色扮演 prompt 生成器。
**Reader state:** 可能用过 Claude skill,但不知道「人物 skill」这个品类;不知道任何女娲术语(Phase/六维/三重验证)。
**Voice:** 教学口吻,先场景后规则;开场禁止出现源 skill 术语。
**Page-specific standard:** 开场只用读者语言(「让 AI 扮演孙宇晨」),Phase 编号、六维取证等词只能在 Primer 之后出现;难点预览 3-5 张卡,维度异质;wow 用真表格(语录拼贴 vs 认知框架对照,材料来自 README 真实对话)。
**Evidence shape:** README 真实对话摘录(标「来源:源包 README」)、对照表、main-flow 全景图。
**Failure mode:** 写成 nuwa-skill 的功能列表或赞美(「强大的六路并行采集」);或先讲 Phase 0-5 再讲为什么。
**Pain scan rows used:** P1(开场主轴), P6, P8, P10, P13(难点预览候选:P1/P10/P8/P13,覆盖 领域-认知/需求/行为)。
**Inputs:** brief 的基线声明、贯穿例子、全景 stage 表、main-flow 图;README 效果示例(Naval/乔布斯/张雪峰对话)。
**Must include:** 开场失败场景 6-10 块;predictPrompt;Primer 5-9 拍(第一拍后插 main-flow 图…实际按格式 wowDiagram/panoramaDiagram 字段);难点预览每卡四件套(坑/最值得学的一招含具体细节/维度/深入指针 stage-NN·An);章节逻辑列表。
**Must avoid:** 把 pain scan 表原样贴出;难点预览写全机制;抽象吹捧。
**Packet output:** `content/overview.md` 全部 sections(frontmatter + 开场 + Primer + 难点预览 + 章节逻辑)。
**Self-check:** 开场段落里有没有提前出现「六维取证/三重验证/Phase」?难点预览的「一招」是否都含具体细节(数字、文件名、规则原文片段)?四张卡维度是否≥3 种?
