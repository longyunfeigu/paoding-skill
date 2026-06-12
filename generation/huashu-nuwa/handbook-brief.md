# Handbook brief · 女娲 · Skill造人术

> 本文件是扫描产物,不是页面文案。所有页面包和 content/*.md 以此为素材源。

## 源信息

- **源路径**: `/Users/guwanhua/git/nuwa-skill`
- **skill name**: `huashu-nuwa`(SKILL.md frontmatter)
- **一句话总任务**: 输入一个人名(或一个模糊需求),产出一个可运行的「人物思维框架 Skill」——不是语录复读机,而是一套提炼自公开信息、带诚实边界的认知操作系统。

### 包结构图

```text
nuwa-skill/
├── SKILL.md                        # 入口,644 行:Phase 0→5 完整流水线
├── references/
│   ├── extraction-framework.md     # 151 行:三重验证、表达DNA量化、矛盾处理、自检清单
│   └── skill-template.md           # 115 行:目标 SKILL.md 的固定骨架
├── scripts/
│   ├── download_subtitles.sh       # yt-dlp 字幕下载(人工>自动,中文>英文 回退链)
│   ├── srt_to_transcript.py        # SRT/VTT → 纯文本(去时间戳/去重/合段)
│   ├── merge_research.py           # 扫描 research/01-06.md,生成 Phase 1.5 摘要表
│   └── quality_check.py            # 对 SKILL.md 跑 6 项通过标准的 regex 检查
├── examples/                       # 13 人物 + 1 主题,部分含完整调研档案
│   └── sun-yuchen-perspective/     # ★ 贯穿例子来源:SKILL.md 488行 + research/ 6文件 2087行
├── output/                         # 一次性生成残留(html/bak),非 skill 机制
└── README.md                       # 作者证词:背景故事、效果对话、版本史
```

git 版本史关键证词:`4282c4c feat: 女娲v3.0 — 全部人物Skill升级Agentic Protocol`;`9ab1736 生成的Skill自动添加创建者归属`。

## 基线声明

基线:同款模型、不带本 skill、用户一句话 prompt(「帮我做一个孙宇晨 skill」)的默认 agent。
(领域难点另加人类基线:没做过人物研究的普通写作者。)

## 贯穿例子

**label**: 蒸馏孙宇晨
**用户请求**: 「蒸馏一个孙宇晨」
**为什么挑这个例子**: examples/ 里唯一同时具备 (a) 标准 6 文件调研档案(references/research/01-06.md,共 2087 行)、(b) v3.0 Agentic Protocol 段落、(c) 表达 DNA 最极端(割味造句公式),三层中间产物全部有真实标本可挖,不需要合成样本。
**预期产出**: `sun-yuchen-perspective/SKILL.md`(488 行)——6 个心智模型、8 条决策启发式、5 种造句公式、诚实边界 6 条。

## Ordinary-view pain scan

| # | Ordinary assumption | Real friction | First visible symptom | Dimension | Evidence | Skill mechanism | Where it appears |
|---|---|---|---|---|---|---|---|
| P1 | 「写个人物 prompt 就是收集金句」 | 语录没有预测力,新问题一来就编 | 问语录拼的「乔布斯」Vision Pro 值不值得买,它凭旧语料编一个像他的回答,且你看不出来 | 领域-认知 | 作者证词(SKILL.md「捕捉HOW不是WHAT」+ README「不是复读语录」) | 中间产物改成心智模型(镜片),六维取证先行 | stage-03/04, A1 |
| P2 | 「他说过的话都算他的观点」 | 随口一说≠真信念,收录门槛缺失 | 单场景发言被写成「核心心智模型」,人设遇到新领域立场漂移 | 领域-认知 | 作者证词(extraction-framework 三重验证) | 跨域复现+生成力+排他性,不过三重→降级/丢弃 | stage-04, A2 |
| P3 | 「subagent 调研完汇报就行」 | 调研只在对话里,主 agent 上下文装不下也无法复查 | 6 路调研聚合时素材丢失,附录引用无处可指 | 编排 | 作者证词(「不存文件的调研等于没做」) | 每个 agent 必须写入 references/research/0X.md | stage-02/03, A3 |
| P4 | 「调研文件放哪都一样」 | 存到外部目录,skill 复制走就断链 | 开源分发后 `07-调研与分析/` 不在包里,引用全部 404 | 编排 | 作者证词(SKILL.md 明令禁止存外部目录,可疑的具体性=踩过的坑) | 「Skill 必须自包含」规则,目录先于调研创建 | stage-02, A3 |
| P5 | 「中文资料搜知乎就有」 | 洗稿、二手转述失真率高 | 知乎洗稿的「马云说过」进入人设,本人从未说过 | 领域-工程 | 作者证词(黑名单:「知乎洗稿严重、信息失真率高」) | 信息源黑名单+权威中文媒体白名单+一手>二手权重表 | stage-03, A4 |
| P6 | 「信息不够就让 AI 补全」 | 模型在信息稀薄处自动编造 | 冷门人物的「心智模型」全是模板化推测,读不出此人 | 行为 | 作者证词(「宁可60分诚实,不要90分编造」) | 来源<10条→降级到2-3个模型+扩容诚实边界+提前告知用户 | stage-01/03, A6 |
| P7 | 「人设输出像不像无所谓,意思对就行」 | 默认输出是通用 AI 味鸡汤 | 角色扮演输出「客观、理性、有保留」——孙宇晨 SKILL.md 原文判这是「完全不对」 | 品味 | 作者证词(Phase 4 风格测试+孙宇晨语气校准锚点) | 表达DNA量化(句式指纹/禁忌词)+造句公式+语气锚点 | stage-04/06, A10 |
| P8 | 「生成完自己检查一下就能交付」 | 主 agent 自评必然全过 | 验证环节全绿,但读 100 字认不出是谁 | 行为 | 作者证词(Phase 4「spawn子agent…避免自评偏差」) | 独立子 agent 跑已知/边缘/风格三测试 + quality_check.py 机器检查 | stage-06, A7 |
| P9 | 「一口气跑完全流程效率最高」 | 调研质量差时,错误被放大到 400 行成品才暴露 | 写完整份 SKILL.md 才发现方向不对,全部返工 | 编排 | 作者证词(Phase 1.5「在这里拦截比Phase 4返工成本低得多」) | Phase 1.5 调研摘要表 + Phase 2.5 提炼摘要,两次暂停等用户确认 | stage-03/04, A8 |
| P10 | 「用户会告诉你要蒸馏谁」 | 一半用户只有困惑没有人名 | 「我想提升决策质量」被当成闲聊回答,或被反问成问卷 | 需求 | 作者证词(Phase 0B 整节+「最多问2轮,不要变成问卷调查」) | 入口分流:明确人名→直接;模糊需求→维度表定位→≤3候选(各带局限) | stage-01, A9 |
| P11 | 「发现人物言行矛盾要圆回来」 | 调和矛盾=抹掉人格深度 | 「观点高度一致」的人设,quality_check 判「太假」不通过 | 领域-认知 | 作者证词(extraction-framework「矛盾是人格核心特征,不是Bug」;通过标准≥2对张力) | 三类矛盾分型处理,「内在张力」独立 section | stage-04, A5 |
| P12 | 「找视频字幕就是下载一下」 | 字幕语言/人工自动/格式多歧,逐个试错浪费上下文 | agent 手动试 yt-dlp 参数失败三次,字幕乱码或拿到纯时间戳 | 平台 | 结构推断(脚本里「人工中文→人工英文→自动生成」三级回退链不会凭空出现) | download_subtitles.sh + srt_to_transcript.py 脚本链 | stage-03, A12 |
| P13 | 「人物 skill 生成完就静态可用」 | 人物 skill 答事实问题时凭训练语料编数据 | 问「Solana 最近怎么样」,人设直接报过时 TVL,数字是编的 | 行为 | 作者证词(v3.0 commit + SKILL.md「没有这个段落…凭训练语料编造」) | 生成的 skill 内嵌 Agentic Protocol:问题分类→先搜再答,研究维度从心智模型推导 | stage-05, A11 |

七维度覆盖检查:领域-工程(P5,P12)、领域-认知(P1,P2,P11)、行为(P6,P8,P13)、编排(P3,P4,P9)、品味(P7)、需求(P10)、平台(P12)。全部到访,无空维度。

## 全量盘点附录

### 中间产物清单(一个不漏)

| 产物 | 谁写 | 谁读 |
|---|---|---|
| skill 目录骨架(`[person]-perspective/`) | Phase 0.5 主 agent | 全部后续 Phase |
| `references/research/01-writings.md` | Agent 1 | Phase 1.5 摘要、Phase 2 提炼、成品附录 |
| `references/research/02-conversations.md` | Agent 2 | 同上 |
| `references/research/03-expression-dna.md` | Agent 3 | Phase 2.3 表达DNA分析 |
| `references/research/04-external-views.md` | Agent 4 | Phase 2.4 反模式/张力 |
| `references/research/05-decisions.md` | Agent 5 | Phase 2.2 启发式 |
| `references/research/06-timeline.md` | Agent 6 | Phase 3 身份卡/时间线 |
| `sources/books|transcripts|articles/` 一手素材 | 用户提供或脚本下载 | 6 个调研 Agent |
| SRT/VTT 字幕 → `*_transcript.txt` | download_subtitles.sh → srt_to_transcript.py | Agent 2/3 |
| Phase 1.5 调研摘要表(对话内,merge_research.py 可生成) | 主 agent/脚本 | 用户(检查点) |
| Phase 2 提炼摘要(对话内) | 主 agent | 用户(检查点 2.5) |
| 目标 `SKILL.md` | Phase 3 主 agent(按 skill-template.md) | Phase 4 子 agent、quality_check.py、最终用户 |
| Phase 4 三测试结果 | 验证子 agent | 用户(确认后交付) |
| Phase 5 双 Agent 精炼报告 ×2 | Agent A/B | 主 agent 综合,用户确认 |

### 风险缓解(非难点,三问②答「小概率」)

- Agent 超时 5 分钟不等待,继续推进(防卡死,非默认发生)
- Phase 2→4 迭代上限 2 次(防无限打磨)
- merge_research.py 的 regex 矛盾检测(辅助提示,粗糙)

### 残渣与砍掉候选

- `output/` 目录:某次生成的 html/md/bak 残留物,与 skill 机制无关,留在仓库里违背自身「自包含、可分发」的洁癖 → 砍掉候选
- `quality_check.py` 的「一手来源占比」检查:用关键词计数(「一手」出现次数 / 「一手」+「二手」),不是真在数来源条目 → 弱实现,伪精确,标注为过度设计倾向
- README 的 Star History / 达尔文.skill 推广区:营销内容,不参与 skill 执行(不入册为机制)
- `skills-lock.json`:分发平台产物,平台伤疤

### skill 的盲区(裸做想象想到了、skill 没防的)

1. **调研 agent 自己编造来源**:女娲要求标注来源 URL,但没有任何 URL 可达性/真实性校验机制——6 个 subagent 同样是 LLM,同样会编 URL
2. **Phase 4 已知测试的测试集污染**:测试问题若与调研素材重合,子 agent 带着 skill 答对只证明复读,不证明框架泛化
3. **活人名誉/人格权风险无系统机制**:孙宇晨 skill 的免责声明是个案手工添加,SKILL.md 流程里没有「争议人物→强制免责」的规则
4. **生成 skill 的长度无上限**:孙宇晨 488 行,每次激活全量进上下文,token 成本无人管
5. **多语言人物的表达 DNA 分裂**:调研发现孙宇晨中英两套人设,但 skill-template.md 没有承接字段,处理与否全凭当次发挥

## Stage 地图(walkthrough 用)

| Stage ID | 标题 | 一句话 | 消费的 pain rows |
|---|---|---|---|
| stage-01 | 入口分流 | 人名走直接路径,困惑走诊断路径,冷门人物提前压预期 | P10, P6 |
| stage-02 | 目录先行 | 调研之前先建自包含目录,定死 6 个落盘文件名 | P3, P4 |
| stage-03 | 六路取证 | 6 个并行 agent 按维度采集,黑名单过滤,结果落盘,1.5 检查点拦截 | P1, P5, P12, P9, P6 |
| stage-04 | 三重验证提炼 | 候选论点过三道筛,矛盾保留为张力,2.5 检查点确认 | P2, P11, P7, P9 |
| stage-05 | 组装人格 | 按模板填充,从心智模型推导 Agentic Protocol 研究维度 | P13 |
| stage-06 | 三面测试与精炼 | 独立子 agent 跑已知/边缘/风格测试,机器自检,双 Agent 精炼 | P8, P7 |

### 跨阶段机制线

- **T1 落盘即证据线**: stage-02 建目录定文件名 → stage-03 每个 agent 写 md → stage-06 成品附录引用 research/ 文件
- **T2 诚实优先线**: stage-01 冷门预警 → stage-03 信息不足标注 → stage-04 信息不足处理表 → stage-05 诚实边界 section → stage-06 通过标准「≥3条边界」
- **T3 检查点拦截线**: stage-03 末 Phase 1.5 → stage-04 末 Phase 2.5 → stage-06 验证结果展示,三次暂停的位置都在「错误即将被放大」的前一刻

## 档案卡 ID

| ID | 卡名 | 维度 | 证据 | 可迁移性 |
|---|---|---|---|---|
| A1 | 先取证再提炼,不许凭记忆写人设 | 领域-认知 | 作者证词 | 高 |
| A2 | 三重验证当收录门槛 | 领域-认知 | 作者证词 | 高 |
| A3 | 调研不落盘等于没做 | 编排 | 作者证词 | 高 |
| A4 | 信息源黑名单 | 领域-工程 | 作者证词 | 高 |
| A5 | 矛盾保留为张力 | 领域-认知 | 作者证词 | 高 |
| A6 | 60 分诚实优于 90 分编造 | 行为 | 作者证词 | 高 |
| A7 | 验证权交给外人和机器 | 行为 | 作者证词 | 高 |
| A8 | 检查点设在错误放大之前 | 编排 | 作者证词 | 高 |
| A9 | 模糊需求先诊断再开工 | 需求 | 作者证词 | 高 |
| A10 | 表达 DNA 量化+语气校准锚点 | 品味 | 作者证词 | 高 |
| A11 | 给人设装 Agentic Protocol | 行为 | 作者证词 | 高 |
| A12 | 字幕获取交给脚本回退链 | 平台 | 结构推断 | 低(平台伤疤,yt-dlp 专用) |

## 术语表候选(6 个)

六维取证、三重验证、心智模型、表达DNA、诚实边界、Agentic Protocol

## 图表计划

### main-flow
**Purpose:** Overview 全景 + Walkthrough 开头复用;读者先看见整条流水线再进站
**Type:** SVG(code-native,关系必须准确)
**Content:** 用户输入 → 入口分流(0/0A/0B) → 目录先行(0.5) → 六路取证(1) → 检查点1.5 → 三重验证提炼(2) → 检查点2.5 → 组装(3) → 三面测试(4) → 双Agent精炼(5) → 交付;检查点用暂停标记区分
**Avoid:** 把 Phase 编号写错;漏掉两个检查点

### data-flow
**Purpose:** dataflow 章主轴:数据怎么从用户一句话流成 488 行 SKILL.md
**Type:** SVG
**Content:** 用户输入/本地语料 → sources/ → research/01-06.md(6 份) → 1.5 摘要表 → 提炼结果 → SKILL.md → 测试报告/精炼报告;标出「谁写/谁读」方向
**Avoid:** 画成目录树;漏掉 sources/ 与脚本链

## 证据采集记录(对照 evidence-collection 阶梯)

- **Level 1 尸检**:SKILL.md/references/scripts/README 全文已读 → 作者证词、结构推断
- **Level 2 标本采集**:源包 examples/sun-yuchen-perspective 完整挖掘——SKILL.md 488 行(成品标本)、research/03-expression-dna.md 与 06-timeline.md(调研档案标本)、README 对话样例(wow 素材)。所有承重工件均有真实实例,**无需合成样本**
- **Level 3 活体切片**:跳过。理由:承重工件(调研档案、成品 SKILL.md)在 examples/ 里已有真实实例,切片只能提供重复证据,不划算
- **Level 4 定点消融**:跳过。理由:核心声称(无三重验证→语录拼贴)的消融需要完整跑一次蒸馏(6 agent 网络调研),复现成本高;现有作者证词+标本对照足以支撑当前证据等级,卡片如实标注等级即可

### 可执行工件必跑清单(源包 4 个脚本)

| 脚本 | 跑了? | 输入 | 一句结果 |
|---|---|---|---|
| quality_check.py | ✅ | examples/sun-yuchen-perspective/SKILL.md | 5/6 不通过:诚实边界 6 条被数成 0(正则只认 `-`/`*` 列表);一手占比检查因关键词匹配不上直接跳过(实测) |
| merge_research.py | ✅ | examples/sun-yuchen-perspective | 表格能出、来源计数可用;但「一手占比 73/150=48.7%」是关键词出现次数,按女娲自家「>50%」标准出厂示例不过线;矛盾检测抓到的是「争议(2018年1月爆发)**:」这类转折词碎片(实测) |
| srt_to_transcript.py | ✅ | 仓库 .claude/skills/huashu-writing-perspective/ 内置 SRT | 正常:去时间戳、合段,4844 字 47 段,输出可读(实测) |
| download_subtitles.sh | ❌ 没跑 | 需要活的 YouTube URL + 网络 + yt-dlp,包内无合法输入 | 维持结构推断,不造输入凑数 |

## 风险与假设

- P12(字幕脚本)只有结构推断级证据,卡片如实标注
- 「Phase 5 双 Agent 精炼引用达尔文体系」依赖 README 一句话,不展开为机制
- 生成 skill 的实际激活效果(如「割味」是否稳定)无实测,引用 README 对话样例时标注「来源:源包 README」
