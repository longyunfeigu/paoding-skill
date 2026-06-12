# archive.packet

**Page job:** 12 张难点档案卡(A1-A12,见 brief),每张:症状(可上演场景)+最小对照(单变量)+原文引用+解法层次+可迁移性+力度对比+互链;收尾残渣与盲区两节诚实清单。
**Reader state:** 可能从直链进来没读前章——每张卡的症状必须自带场景,不依赖 Overview 解压。
**Voice:** 卡片体,症状先行;「Therefore」一行完成问题到解法的转折。
**Page-specific standard:** 按 cards-patterns.md 模板;力度对比三行不许全绿;每卡至少一条命名关系的互链;A12 可迁移性=低(平台伤疤)。
**Evidence shape:** SKILL.md / extraction-framework / 脚本原文引文;sun-yuchen 对照样本。
**Failure mode:** 把 SKILL.md 小节换个标题当卡;症状写成「质量会下降」式总结。
**Pain scan rows used:** 全表 P1-P13 → A1-A12(P1→A1, P2→A2, P3+P4→A3, P5→A4, P11→A5, P6→A6, P8→A7, P9→A8, P10→A9, P7→A10, P13→A11, P12→A12)。
**Inputs:** brief 档案卡 ID 表、残渣清单、盲区清单;各机制原文。
**Must include:** 开头维度分组导览+索引表;12 张卡;残渣与砍掉候选(output/、quality_check 一手占比 regex、skills-lock.json);盲区 5 条。
**Must avoid:** 全绿力度表;无证据等级的症状;「相关」式无名互链。
**Packet output:** `content/archive.md`。
**Self-check:** 每张卡的最小对照是否只差一个变量?低迁移卡说原因了吗?盲区是不是真的「skill 没防」而非「我没找到」?
