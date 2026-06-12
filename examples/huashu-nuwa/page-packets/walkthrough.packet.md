# walkthrough.packet

**Page job:** 第一人称(执行中的 agent)带读者走完「蒸馏孙宇晨」六站,每站按七件套骨架(场景→难点→预测点→机制→真实产出→可偷的招→交接)。
**Reader state:** 已读 Overview,知道全景和基线,见过「语录拼贴」失败场景;没读过 SKILL.md 原文。
**Voice:** 「我」=正在被 skill 约束的 agent;预测点和挑战用「你」。
**Page-specific standard:** 机制必须贴 SKILL.md/references 原文(引文块),不许转述;每站有 `### 真实产出` 且含至少一个 code/quote 块,真实值来自 sun-yuchen example(标注来源),不许只给 schema。
**Evidence shape:** SKILL.md 规则原文引文;sun-yuchen research/ 文件摘录;成品 SKILL.md 片段;merge_research.py 表格样式。
**Failure mode:** 写成 Phase 0-5 的清单复述,没有场景、没有真实素材;或每站重画不同的流程图。
**Pain scan rows used:** stage-01:P10,P6;stage-02:P3,P4;stage-03:P1,P5,P12,P9;stage-04:P2,P11,P9;stage-05:P13;stage-06:P8,P7。
**Mechanism threads:** T1 落盘即证据(stage-02→03→06);T2 诚实优先(stage-01→03→04→05→06);T3 检查点拦截(stage-03→04→06)。每站交接处点名所属线。
**Inputs:** brief stage 表;SKILL.md 各 Phase 原文;extraction-framework.md 三重验证;skill-template.md;sun-yuchen SKILL.md+research/;main-flow 图(开头复用)。
**Must include:** 开头全景图+每站一句话;每站面包屑(同一条:分流 → 建目录 → 取证 → 提炼 → 组装 → 测试);有痛点的站必有预测点;最后一站「这里把账结清」。
**Must avoid:** 「我作为 AI」;转述规则清单;无值 schema 充当产出。
**Packet output:** `content/walkthrough.md` 全部 6 个 stage。
**Self-check:** 每站两问难点(领域/行为)都答了吗(可答「确无」)?引文是否逐字?真实产出是否都标了来源或「模拟样本」?
