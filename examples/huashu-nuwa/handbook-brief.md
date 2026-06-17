# handbook-brief · 女娲 · Skill 造人术

## 源信息

- 源 skill 路径：`/home/guwanhua/Desktop/git/nuwa-skill`
- name：`huashu-nuwa`，slug：`huashu-nuwa`
- 一句话：输入人名 / 主题 / 甚至模糊需求，自动「深度调研 → 思维框架提炼 → 生成可运行的人物 Skill」。
- 包结构：
  - `SKILL.md`（644 行，入口调度，Phase 0–5 全流程）
  - `references/extraction-framework.md`（三重验证方法论 + 质量自检清单）
  - `references/skill-template.md`（目标人物 Skill 的骨架模板）
  - `scripts/`：`download_subtitles.sh`、`srt_to_transcript.py`、`merge_research.py`、`quality_check.py`
  - `examples/`：16 个已生成的 `*-perspective` / `*-framework` skill（芒格、乔布斯、费曼、马斯克、纳瓦尔、塔勒布、MrBeast、X-mastery 等），多数带 `references/research/01-06.md`
  - `assets/`、`promo/`、多语 README

## 基线声明

```
基线：同款模型、不带本 skill、收到用户一句话 prompt（如「帮我做一个乔布斯的思维 skill」）
的默认 agent。
人类基线：没做过人物建模、手头只会摘金句的认真写作者。
```

全册每一条难点都是对这个基线的断言，写成「可观察症状 + 证据等级」。

## 贯穿例子

- **label：** 蒸馏史蒂夫·乔布斯（直接路径 / 明确人名）
- **用户请求：** 「帮我做一个乔布斯的思维 skill」
- **为什么挑它：** 走主路径（Phase 0A 直接蒸馏），不绕诊断分支；`examples/steve-jobs-perspective/` 里有完整的 `references/research/01-06.md`、可跑的 `merge_research.py` 输出、6/6 通过的成品 `SKILL.md`——每一站都有真实物料可引。
- **预期产出：** `.claude/skills/steve-jobs-perspective/SKILL.md`，6 个心智模型 + 表达 DNA + Agentic Protocol + 诚实边界，`quality_check.py` 6/6 PASS。

## 可执行工件清单（脚本必跑）

| 脚本 | 跑了？ | 输入 | 一句结果 |
| --- | --- | --- | --- |
| `merge_research.py` | ✅ 跑了（实测） | `examples/steve-jobs-perspective` | 输出 Phase 1.5 摘要表；暴露两处量化盲区：把 URL 数当来源数（`05-decisions.md` 无 URL → 报「决策 0 来源」），把关键词命中数当一手占比（报「134/244」噪声值） |
| `quality_check.py` | ✅ 跑了（实测） | steve-jobs `SKILL.md` → 6/6 PASS；munger `SKILL.md` → 5/6，诚实边界 FAIL | munger 其实有 6 条诚实边界，但用 `1.`/`2.` 编号，checker 只数 `-`/`*` 项目符号 → 假阴性 |
| `srt_to_transcript.py` | ❌ 没跑 | 包内无 `.srt`/`.vtt` 样本（`sources/` 为空），无合法 in-package 输入 | 逻辑已审读：去时间戳/去序号/去重/按 200 字或句末标点分段 |
| `download_subtitles.sh` | ❌ 没跑 | 需 YouTube URL + 网络 + `yt-dlp`，无 in-package 输入 | 逻辑已审读：人工字幕→中文→英文→自动字幕四级 fallback；注：`find -newer /tmp/.ytdlp_marker` 的 marker 从未创建，是个小瑕疵 |

实测来源记录：steve-jobs 的 `03-expression-dna.md`（"One more thing"、超级形容词词库、iPhone 2007 三幕结构）为真实研究档案标本；munger `SKILL.md` 为真实成品标本。其余引用均来自源包原文，无 模拟样本。

## Ordinary-view pain scan

基线：同款模型、不带本 skill、用户一句话 prompt 的默认 agent。

| Ordinary assumption | Real friction | First visible symptom | Dimension | Evidence | Skill mechanism | Where it appears |
| --- | --- | --- | --- | --- | --- | --- |
| 做人物 skill 就是把这个人的金句收集起来 | 金句是 WHAT they said，不是 HOW they think；语录拼出来的是漫画式人设 | 问乔布斯 skill「该不该做折叠屏」，它背几句「stay hungry」然后给一段谁都能写的正确话，遇到没说过的新问题就崩 | 领域-认知 | 作者证词（核心理念「捕捉 HOW 不是 WHAT」）+ pain-dimensions.md 原文举此例 | 中间产物改成可迁移的心智模型；三重验证（跨域复现/生成力/排他性）筛模型 | stage-04 / A1 |
| 模型本来就「认识」乔布斯，直接写就行 | 训练语料里的人设是模糊平均值，且会对截止日期后的事实张口就编 | 问「乔布斯会怎么看 Vision Pro」，它凭旧记忆编一段像乔布斯的话，事实可能全错 | 行为 | 作者证词（Phase 3「没有这个段落，人物 Skill 会凭训练语料编造」） | Agentic Protocol：问题三分类 + 需要事实必须先 WebSearch | stage-05 / A2 |
| 一个 agent 把这人查全就好 | 一个人的全画像有 6 个互不相同的维度，单上下文装不全、还会偏科 | 只读了几篇文章就下笔，著作维度厚、决策/他者维度空，人设单薄 | 编排 | 作者证词（6 Agent 分工表）+ 结构推断 | 6 个并行 subagent 各管一维度，各写独立 `0X.md`，「不存文件的调研等于没做」 | stage-03 / A3 |
| 一口气调研完直接写 SKILL.md | 调研质量决定成品上限；写完 400 行才发现方向错，返工极贵 | 提炼到一半发现「他者视角」全是营销稿，推倒重查 | 行为 | 作者证词（「在这里拦截比在 Phase 4 返工成本低得多」） | Phase 1.5 / 2.5 两个检查点，暂停展示摘要让用户确认 | stage-03b / A4 |
| 用户说「帮我提升决策」我就开始查 | 用户常给的是模糊需求，不知道该蒸馏谁；猜错对象整条流水线白做 | 默认 agent 直接问「你想蒸馏谁」或随手选一个，对不上需求 | 需求 | 作者证词（Phase 0B）+ pain-dimensions.md 原文举此例 | Phase 0 入口分流；Phase 0B 用需求维度表反推 2-3 个候选 | stage-01 / A5 |
| 「像不像」我自己读一遍就知道 | 「有辨识度、不像 AI 味」说不清也难固化；作者自评会放水 | 自评觉得「挺像」，旁人读 100 字认不出是谁，全是通用鸡汤 | 品味 | 作者证词（Phase 4 风格测试 + 通过标准表） | 盲读 100 字认人 + 通过标准表；Phase 4/5 一律派独立子 agent 测，避免自评偏差 | stage-06 / A6 |
| 信息不足也得硬写出一个完整 skill | 信息不足时强行生成 = 编造，出一个看着完美实则虚构的 90 分假货 | 冷门人物只有 5 条来源，仍写出 7 个「深刻」心智模型 | 品味 | 作者证词（「宁可 60 分诚实也不要 90 分编造」红线） | 来源<10 提前降级；诚实边界 section；矛盾保留为「内在张力」 | stage-04 / A7 |
| 拿视频当语料，字幕复制粘贴就行 | 字幕带时间戳/序号/自动字幕重复行/多语言优先级，手清易错且烦 | 把带 `00:00:12,340` 的 SRT 直接喂模型，满屏时间戳污染语料 | 领域-工程 | 作者证词（脚本注释）+ 结构推断（四级 fallback 的具体性） | `download_subtitles.sh` 四级 fallback + `srt_to_transcript.py` 清洗分段 | stage-03 / A8 |
| 用什么来源都行，搜到就用 | 中文生态里知乎洗稿、公众号无法验证、百度百科陈旧，用了就污染人设 | 蒸馏中国人物时大段引用知乎答案，事实失真 | 品味 | 作者证词（信息源黑名单段） | 黑名单（知乎/公众号/百度永久排除）+ 一手>二手优先级表 + 中/西人物来源切换 | stage-03 / A9 |
| 统计 6 个文件的来源数、一手占比，手点一遍 | 跨文件手工统计烦且易错，但脚本用关键词/URL 近似会失真 | 决策档案明明有 4 个决策却报「0 来源」，一手占比 134/244 不可解读 | 领域-工程 | 实测（跑 `merge_research.py`） | `merge_research.py` 自动出检查点摘要表——省事但量化是近似，需人读 | stage-03b / A10 |

## 全量盘点附录

### 中间产物清单（逐个，不漏）

1. 用户输入：人名 / 主题 / 模糊需求（Phase 0 分流的判据）
2. skill 目录骨架（Phase 0.5：`SKILL.md` 占位 + `scripts/` + `references/research/` + `references/sources/{books,transcripts,articles}`）
3. `references/research/01-writings.md` … `06-timeline.md`（6 个调研档案，每个 subagent 必落盘）
4. `references/sources/`（一手素材：用户提供 + 下载的书/字幕/文章）
5. `merge_research.py` 输出的 Phase 1.5 摘要表（来源数/一手占比/矛盾/缺口）
6. Phase 2 提炼结果（心智模型 3-7、决策启发式 5-10、表达 DNA、价值观/反模式、内在张力、智识谱系、诚实边界）——主 agent 内部产物
7. Phase 2.5 提炼摘要（暂停展示给用户）
8. `SKILL.md`（最终产物，按 `skill-template.md` 组装）
9. `quality_check.py` 输出（6 项 PASS/FAIL）
10. Phase 4 三测试结果（已知测试 / 边缘测试 / 风格测试，由独立子 agent 跑）
11. Phase 5 两份精炼报告（auto-skill-optimizer 视角 + skill-creator 视角）

### 风险缓解（非难点，三问②答「小概率」）

- 单个 Agent 超时（搜 5 分钟无结果）→ 不等待，标「信息不足」继续。
- Agent 结果冲突 → 保留矛盾，收进「内在张力」。
- 更新模式只跑 Agent 2/5/6 增量更新。

### 残渣与砍掉候选

- **Phase 5 双 Agent 精炼**：Phase 4 已做验证，Phase 5 再加一轮「auto-skill-optimizer 视角 + skill-creator 视角」的双 agent 评审。判定倾向：过度设计 / 半货物崇拜——它点名两个外部 skill 视角，但包里没有这两个 agent 定义；价值真实但与 Phase 4 边界重叠。
- **`merge_research.py` 的一手占比算法**：用关键词命中数估占比，输出 134/244 这种不可解读的数；判定：过度简化的便利件，读数需人脑覆盖。
- **`download_subtitles.sh` 的 `/tmp/.ytdlp_marker`**：用 `find -newer` 比对一个从未创建的 marker 文件，第一条 fallback 判断不可靠；判定：平台伤疤 / 小 bug。

### 盲区（裸做想象想到、skill 没强制防的）

- 三重验证全靠主观判断，没有任何 machine gate 拦「听起来深刻其实是套话」的心智模型。
- 「过度模仿变 caricature」只在自检清单提了一句，无强制机制。
- `quality_check.py` 的一手占比检查在「未标记来源类型」时直接跳过——很多成品就不标，这道门形同虚设（munger 即「跳过检查」）。
- 版权：建议用 Z-Library/LibGen 下书，法律灰色，skill 未提示风险。
- 伦理：蒸馏活人做出有偏差人设的名誉/隐私风险，诚实边界提了「公开 vs 真实想法有差距」但没防误用。

## 带走候选清单（steal scan：六镜头，至少 2-6 镜头跑过）

| 候选 | 镜头 | 档位 | 用在哪 | 进手册的位置 |
| --- | --- | --- | --- | --- |
| 心智模型三重验证（跨域复现 / 生成力 / 排他性） | 验法+知识 | 直接抄走 | 判断任何一个观点是某人的真信念还是随口一说 | stage-04 机制段 |
| 盲读认人测试（删掉名字还能认出是谁） | 验法 | 直接抄走 | 任何模仿写作 / 角色一致性的验收 | stage-06 机制段 |
| 六维取证目录 `research/01-06.md` | 产物形状 | 直接抄走 | 系统调研一个人或一个主题，避免偏科 | stage-03 / dataflow |
| 需求维度表（10 维需求 → 思维框架方向） | 知识 | 直接抄走 | 帮人把模糊困惑翻成「该学谁的思维方式」 | stage-01 机制段 |
| 「HOW they think 不是 WHAT they said / DNA 不是金句」 | 概念 | 思路带走 | 任何「提炼一个人/一套方法」的建模任务 | overview / stage-04 |
| Agentic Protocol 问题三分类（需要事实 / 纯框架 / 混合） | 验法+概念 | 直接抄走 | 让任何 LLM 角色「先做功课再开口」 | stage-05 机制段 |
| 信息源黑名单 + 一手>二手优先级表 | 知识 | 直接抄走 | 任何中文人物 / 主题调研选源 | stage-03 机制段 |
| 独立子 agent 验证（避免自评放水） | 痛点 | 思路带走 | 任何「质量门不能让作者自己把」的场景 | stage-06 机制段 |

## stage 列表（walkthrough 一站一行）

- stage-01 入口分流与澄清：判断人名 vs 模糊需求，澄清 5 问 / 诊断推荐。
- stage-02 建自包含目录：调研前先搭骨架，research 必须在 skill 内部。
- stage-03 六 Agent 并行采集：六维度各派一 subagent，选源、落盘、标可信度。
- stage-03b 调研 Review 检查点：merge_research 出摘要，暂停确认，垃圾不进下一步。
- stage-04 框架提炼：三重验证筛心智模型，DNA、反模式、张力、诚实边界。
- stage-05 构建 SKILL.md：套模板填充，按心智模型推导 Agentic Protocol。
- stage-06 质量验证与精炼：独立子 agent 三测试 + 通过标准表 + 双 agent 精炼。

### 跨站机制线索（mechanism threads）

- **反编造线**：stage-03（必落盘、标一手/二手）→ stage-04（诚实边界、保留矛盾）→ stage-05（Agentic Protocol 先查再答）→ stage-06（边缘测试要求「不确定」）。
- **防自评线**：stage-03b（检查点让用户把关）→ stage-06（独立子 agent 测试 + 双 agent 精炼）。
- **可迁移产物线**：stage-04 的「心智模型而非金句」是整册的认知核心，stage-03 的六维取证为它供料。

## 术语（glossary 候选，3-8）

- 心智模型（vs 金句 / 决策启发式）
- 三重验证
- 表达 DNA
- Agentic Protocol（回答工作流）
- 诚实边界
- 内在张力
- 自包含 skill

## 难点档案卡 ID

- A1 心智模型而非金句 · 领域-认知（高）
- A2 Agentic Protocol 先查再答 · 行为（高）
- A3 六维并行取证 + 必落盘 · 编排（高）
- A4 调研/提炼双检查点 · 行为（高）
- A5 入口分流 · 需求（高）
- A6 独立子 agent + 盲读认人 · 品味（高）
- A7 信息不足就降级 · 品味（高）
- A8 字幕脚本（下载+清洗） · 领域-工程（高）
- A9 信息源黑名单 · 品味（高）
- A10 merge_research 浅统计 · 领域-工程（低，附 quality_check 假阴性）

## 需要的图

- `main-flow`（panorama）：Phase 0→0.5→1→1.5→2→2.5→3→4→5 全流水线。overview 收尾 + walkthrough 开头复用。
- `dataflow`：用户输入 → research/01-06 → merge 摘要 → 提炼结果 → SKILL.md → quality_check → 精炼成品。dataflow 章脊柱。
- `pain-network`：七维度难点网络。archive 章开头。

## 风险 / 缺证据 / 假设

- A1/A2/A5 的「默认会编造/会问错」是作者证词 + pain-dimensions 举例，未做带/不带 ablation；如需升级为实测须跑对照，本册标作者证词。
- Phase 5 双 agent 精炼的真实效果无 in-package 证据，归残渣讨论而非难点。

## voice gate log

- 作者自查：第一道，已过；机器门 check-content.py 一轮报 3 个 warning（stage-05/07 加号公式、stage-03 相邻 callout），已就地改掉，复跑 0 warning。
- 独立 reviewer（general-purpose subagent）：读 voice-style-gate.md + voice-gate-examples.md，两遍扫——PASS1 高曝光字段（h1/lede/坑/最值得学的一招/症状/Therefore/为什么长这样/可偷的招/callout/glossary），PASS2 工程缩写清单全文扫（落盘/下游/降级/回炉/闸/门…），并逐页抽 5 段念读测试。
- 命中与处置：
  - **blocking · stage-03「三道闸」** = 类8 自造隐喻当指代骨架 → 改：闸→关卡/办法，「正交」→「互不重叠」。已改。
  - lede + 「降级模型数」中英夹杂/jargon → lede 加中文「怎么想/说过什么」，「降级模型数」→「减少模型数」。已改。
  - 下游（dataflow + steal 标题）→「后面的步骤/后续」。已改。
  - 正交六维（dataflow/archive）→「互不重叠的六维」。已改。
  - 回炉（stage-07 收尾）→「重做」。已改。
  - dataflow:61 双「是因为」长句 → 拆两句。已改。
  - 「说得像/做得像」全册口头禅 → 判定为源 skill 真实框架（鹦鹉学舌→可靠顾问）的合法母题，驳回，不改。
- 复跑机器门：0 错 0 警。

## source-guide learner review log

- 独立 learner reviewer（general-purpose subagent，第一次读源包的读者立场）：读 source-guide-writing.md + 草稿 source-guide.md + 真实 nuwa/SKILL.md，逐锚点核对。
- 命中与处置：
  - **真缺陷 · extraction-framework 卡「stage-06 会用到」** = handbook 构建术语泄漏，源里只有 Phase → 改成「Phase 3 收尾和 Phase 4 质量验证会逐项对照」。已改。
  - examples 数「十六个」实为 15 → 全册改 15/十五（overview/archive/source-guide）。已改。
  - 「九步/九个 Phase」轻微不精确：源 Phase 计数（9）与手册教学站数（7）不同 → 手册叙述统一为「七站」，源包导读保留「九个 Phase」（对源准确）。已分离。
- reviewer 总评：作为首次读者，读完能带着清晰计划打开源码（先读 SKILL.md，提炼时翻 extraction-framework，构建时翻 template，脚本读数当近似）。Yes。
