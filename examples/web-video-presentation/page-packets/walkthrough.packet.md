# walkthrough.packet

**Page job:** 读者跟着第一人称的 agent 把「5 个 AI 工具测评」做完七站，每站看到：默认会怎么坏 → skill 怎么防（贴原文）→ 真实产出。
**Reader state:** 读完 Overview，知道 step / 双源 / token 的大白话定义。
**Voice:** 第一人称执行（「我」），不写「我作为 AI」；预测点用「你」。
**Page-specific standard:** 每站七件套齐全；难点从 brief 拉，不现编；机制必须引原文块；真实产出有真值（实测的标来源，编的标模拟样本）。
**Evidence shape:** SKILL.md / SCRIPT-STYLE / OUTLINE-FORMAT / CHAPTER-CRAFT / AUDIO / RECORDING 原文引用；切片实测材料（scaffold 输出、tokens.css、audio-segments.json、退化路径报错）；贯穿例子的 script/outline/narrations 模拟样本。
**Failure mode:** 无场景的清单复述；机制转述不贴原文；真实产出只有 schema 没有值。
**Pain scan rows used:** 全部 17 行按 Where 列分配到七站。
**Mechanism threads:** T1 真相源链（01→05→06→07）；T2 自检协议链（01/04/05）；T3 双源链（01/04/05）；T4 主题 token 链（02/03/04/05）。
**Inputs:** brief 的 stage 表、threads、证据采集记录；源包各 reference 原文。
**Must include:** stage-06 放 extract 实测产物与 minHoldMs 删除现场；stage-03 放 scaffold 实测输出与绝对路径脚注。
**Must avoid:** 每站重画不同的流程图（面包屑统一）。
**Packet output:** content/walkthrough.md 七个 stage。
**Self-check:** 有难点的站必有预测点；末站收尾被渲染为「这里把账结清」；交接句首尾相扣。
