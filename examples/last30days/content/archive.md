---
---

## 定位

last30days 的核心任务是:输入一个话题,从八路信号源(Reddit/X/YouTube/TikTok/Instagram/HN/Polymarket/Web)拉取过去 30 天的帖子和互动数据,产出一份有证据链的社交舆情综述。

基线是同款模型不带 skill 的默认 agent - 用户说「帮我查一下最近 Kanye West 怎么样」,模型跑几轮 WebSearch,写一篇新闻摘要交差。

**痛点全景(按维度分组):**

**领域-工程:** 默认 agent 只有 WebSearch 一条路 - 产出是新闻摘要,没有 Reddit 讨论热度、没有 X 时间线、没有 YouTube 转录、没有 TikTok 病毒信号、没有 Polymarket 真金白银的赔率。引擎跑完后如果不追加独立预算的 WebSearch 补充,长文博客和评论文章的深度也会缺失。

**领域-认知:** 搜索 Peter Steinberger 不知道他叫 @steipete,内容全部漏掉;搜索 GPT Image 2 只查 r/OpenAI,漏掉 r/StableDiffusion 里真正分享技巧的人;推荐类查询按提及次数排名,Python 排第一 - 但语料里最有分量的引言在说「agents have a strong bias for Python despite it probably not being the best」。

**需求:** 用户输入「gift for 42 year old man」,引擎按字面搜索,42 这个数字撞上 Jackie Robinson 球衣号码,返回 5 分钟的 r/todayilearned 噪音。

**行为:** 模型读完 1700 行 SKILL.md,合成时即兴发挥:8 轮连续回归全部违规 - 发明标题、加 ## 小节标题、把原始证据簇(带评分元组)直接倒给用户、WebSearch 工具级指令覆盖 skill 契约在末尾追加 Sources: 列表。

**品味:** 引用写成纯文本 - 「per Rolling Stone」「r/hiphopheads」 - 用户在 Claude Code 里看不到蓝色可点击链接,想追溯来源要手动复制粘贴搜索。

**编排:** 对比查询里某个竞品实体跳过了 Step 0.55,Resolved 块里该实体全是破折号,产出明显偏薄。

**平台:** 三次测试加载了 `~/.claude/plugins/marketplaces/` 下的旧版 SKILL.md,看不到 `--competitors` 参数,功能直接失效。

---

## 卡片

### A1 八路引擎不是可选的 · 维度：领域-工程

**症状:** 用户问「/last30days Kanye West」,模型跑了 3 轮 WebSearch,写出一篇 Billboard 和 Rolling Stone 的新闻摘要。没有 Reddit 讨论热度,没有 X 粉丝撕裂现场,没有 YouTube 反应视频的转录引言,没有 TikTok 病毒片段,没有 Polymarket 真金白银的赔率。看起来像一份公关简报,不像「人们在说什么」。（证据：作者证词）

**最小对照:**

| 没有这个机制 | 有这个机制 |
| --- | --- |
| 模型用 WebSearch 搜 3 轮,写新闻摘要 | 必须运行 `scripts/last30days.py`,八路引擎并行拉取 Reddit/X/YouTube/TikTok/IG/HN/Polymarket/Web,产出聚类排序证据 |

**Therefore:** 把「调研」从模型自由发挥的 WebSearch 收窄为必须调用的 Python 引擎 - 引擎是 skill,WebSearch 只是补充。

**机制原文:**

> **Step 1: Run the research script WITH your query plan (FOREGROUND)**
>
> The single most common failure mode of this skill is the model reading this file, skimming the section headers, and then answering the user's topic with 3-10 WebSearch calls followed by a prose summary. That is wrong output. The Python engine is the skill. Web-only synthesis is not the skill.

**机制说明:** SKILL.md 在多处重复这个约束:「If you are about to write a response without having run `scripts/last30days.py` at least once, stop.」引擎产出的 emoji-tree 脚注是合格输出的结构标志 - 没脚注就意味着没跑引擎。
**解法层次:** 流程解法
**可迁移性:** 低
**不可迁移原因:** 八路引擎是项目专有的 Python 工具链,绑定了具体的 API(ScrapeCreators、yt-dlp、Algolia HN、Polymarket Gamma 等)。能迁移的是元原则「核心能力封装成脚本、模型只做编排」,但引擎本身搬不走。

**力度对比:**

| 场景 | 效果 | 为什么 |
| --- | --- | --- |
| 有 API key 的完整部署 | 管用 | 八路全开,信号密度是纯 WebSearch 的数量级提升 |
| 只有 WebSearch 的平台(OpenClaw) | 得让一步 | 引擎照跑但降级为 `--auto-resolve`,缺少平台特异 API 的深度 |
| 用户只想要一句话快答 | 用不上 | 引擎启动开销 1-3 分钟,一句话需求不值得等 |

**一起读:**
- A8 独立预算后置补充（关系：引擎跑完后的 WebSearch 补充是第二阶段,不是替代品）

---

### A2 全量前置情报检查清单 · 维度：领域-认知

**症状:** 用户问「/last30days Peter Steinberger」,模型搜索 "Peter Steinberger" 这个全名,X 上没结果、GitHub 上零匹配。但 Peter Steinberger 在所有平台都叫 @steipete - 不解析 handle,就等于在空气里搜索。（证据：实测）

**最小对照:**

| 没有这个机制 | 有这个机制 |
| --- | --- |
| 直接用全名 "Peter Steinberger" 搜引擎 | 先 WebSearch 解析 X handle(@steipete)、GitHub user(steipete)、相关 handles(@AnthropicAI)、subreddits(iOSProgramming,SwiftUI),全部传给引擎 |

**Therefore:** 引擎吃关键词,但社交平台的关键词是 handle 不是全名 - 把 handle 解析从「可选」变成「强制检查清单」。

**机制原文:**

> **Pre-Flight Checklist - do NOT stop after the first flag. Every applicable flag below is MANDATORY for its topic class.**
>
> Reading only the "X handle" subsection and stopping there is the named failure mode of the Peter Steinberger disaster #2 (2026-04-18). The model admitted on debug: "I treated the 'X handle resolution' section as the full contract for pre-flight resolution and didn't --help the script to see what else existed."

**机制说明:** 检查清单把前置解析拆成 9 个 flag(x-handle、x-related、github-user、github-repo、subreddits、tiktok-hashtags、tiktok-creators、ig-creators、auto-resolve),每个 flag 标注「什么时候适用」。人物话题至少要解析 x-handle + github-user + subreddits 三项,只解析一项就是回归。
**解法层次:** 流程解法
**可迁移性:** 高
**什么时候用:** 任何依赖社交平台搜索的调研任务 - 人物、品牌、产品的公开身份在不同平台有不同标识符,解析这层映射是搜索质量的前提。
**什么时候太重:** 话题是通用概念(「Docker 最佳实践」) - 没有专有 handle 需要解析,检查清单里大部分 flag 不适用。
**反例:** 「搜之前先想想关键词」不是这招 - 这招的要点是把 handle/repo/subreddit 的解析结构化为必须逐项完成的清单,跳过任何一项是命名过的失败模式。
**在哪几个 skill 里见过:** last30days;deep-research 类 skill 若涉及社交平台都需要类似的身份解析层。

**力度对比:**

| 场景 | 效果 | 为什么 |
| --- | --- | --- |
| 人物话题(开发者/创始人) | 管用 | handle 和全名几乎永远不同,解析是必需的 |
| 产品话题 | 管用 | 产品 X 账号、GitHub repo、品类子版块全需要解析 |
| 通用概念话题 | 得让一步 | 大部分 flag 不适用,清单退化为只解析 subreddits |

**一起读:**
- A3 品类同行子版块扩展（关系：A2 解析品牌自身的社区,A3 把同品类的跨品牌社区补进来）
- A11 每实体独立情报解析（关系：A2 是单话题的清单,A11 把它扩展到对比查询的每个实体）

---

### A3 品类同行子版块扩展 · 维度：领域-认知

**症状:** 用户问「/last30days Prompting GPT Image 2」,模型解析出 r/OpenAI、r/ChatGPT、r/singularity、r/ChatGPTpromptengineering - 全是 OpenAI 品牌子版块。但 AI 图片生成的技巧讨论活跃在 r/StableDiffusion、r/midjourney、r/dalle2、r/aiArt,那里有跨产品的 prompting 经验。品牌子版块只有产品新闻,没有技巧。（证据：实测）

**最小对照:**

| 没有这个机制 | 有这个机制 |
| --- | --- |
| WebSearch 返回什么子版块就用什么:r/OpenAI, r/ChatGPT, r/singularity | WebSearch 返回的 + 品类同行表追加的:r/OpenAI, r/ChatGPT, r/StableDiffusion, r/midjourney, r/dalle2, r/aiArt (+ ai_image_generation peers) |

**Therefore:** WebSearch 返回的子版块有品牌偏向 - 用一张品类-同行映射表把跨品牌的技巧社区补进去。

**机制原文:**

> **2a. Category-peer expansion (MANDATORY for product topics).** If the topic is a product in a recognizable category (AI image generation, AI video generation, AI coding agents...), the brand-specific subreddits that WebSearch returned are INSUFFICIENT. Add 2-3 peer subreddits from the category. Peer subs are where cross-product technique discussion actually lives. Missing them is the 2026-04-22 `GPT Image 2` failure mode.

**机制说明:** SKILL.md 内嵌了一张 10 行的品类-同行表(ai_image_generation、ai_video_generation、ai_coding_agent 等),每个品类列出优先级排序的同行子版块。合并规则:WebSearch 返回的优先保留(最新鲜的信号),品类同行按优先级追加,总数上限 10。Resolved 块尾部标注 `(+ ai_image_generation peers)` 是执行的可观测证据。
**解法层次:** 表征解法
**可迁移性:** 高
**什么时候用:** 任何产品调研需要跨品牌视角的场景 - 竞品社区往往是技巧和真实体验的集散地,品牌社区偏向公告和投诉。
**什么时候太重:** 话题不属于任何可识别的品类(人物、新闻事件、通用概念) - 品类表没有匹配项,扩展不触发。
**反例:** 「多搜几个子版块」不是这招 - 这招的要点是按品类结构化扩展,有固定的映射表和合并规则,不是随机多搜几个。
**在哪几个 skill 里见过:** last30days;`scripts/lib/categories.py` 是引擎侧的同构实现。

**力度对比:**

| 场景 | 效果 | 为什么 |
| --- | --- | --- |
| 产品在已知品类中(AI 图片生成、AI 编码 agent) | 管用 | 品类表直接命中,同行子版块信号密度高 |
| 产品在未知品类中 | 得让一步 | 需要按「同一精神」外推,没有表可查 |
| 非产品话题(人物、事件) | 用不上 | 品类概念不适用 |

**一起读:**
- A2 全量前置情报检查清单（关系：A2 解析品牌自身社区,A3 在 A2 基础上追加品类同行）
- A10 信号加权代替计数（关系：A3 扩展信号来源的广度,A10 决定如何对信号排序）

---

### A4 关键词陷阱一回合门 · 维度：需求

**症状:** 用户问「/last30days birthday gift for 42 year old man」,引擎按字面搜索,数字 42 撞上 Jackie Robinson 球衣号码。5 分钟后返回:r/todayilearned 关于 42 的冷知识、r/japannews 犯罪新闻里恰好提到 42 岁、r/LivestreamFail 的无关八卦。零条关于礼物的内容。（证据：实测）

**最小对照:**

| 没有这个机制 | 有这个机制 |
| --- | --- |
| "birthday gift for 42 year old man" 直接送进引擎 | Step 0.45 识别为 Class 1(人口统计购物) + Class 2(数字陷阱) → 追问一轮:「爱好?关系?预算?」→ 用户答「老公,喜欢做菜,200 刀」→ 重构为 "gifts for men who cook" + --subreddits=GiftIdeas,BuyItForLife,Cooking |

**Therefore:** 引擎吃关键词,但某些用户输入的字面关键词在社交平台上不是人类使用的词汇 - 在引擎启动前用一回合澄清拦截注定失败的查询。

**机制原文:**

> **MANDATORY. Before Step 0.5, diagnose the topic for known failure classes. If the topic is a keyword trap, reframe or ask a clarifying question BEFORE calling the engine. Running the engine on a doomed query burns 5+ minutes and produces junk. Detecting the trap upfront costs one turn.**
>
> Known keyword-trap classes and how to handle each:
>
> **Class 1: Demographic shopping query**
> - Why it fails: no human on Reddit posts "I bought a 42 year old man a gift." Real posts use relationship + hobbies + budget.
>
> **Class 2: Numeric / age keyword trap**
> - Why it fails: the number dominates retrieval and pulls in unrelated content. A search that prominently features "42" returns jersey-number posts.

**机制说明:** 四类陷阱(人口统计购物、数字碰撞、字面教程短语、通用单词)各有对应的处置方案。核心逻辑是「一回合门」:要么追问一轮拿到具体信息重构查询,要么用户说「直接跑」时自动去掉数字/重构词汇。绝不在陷阱查询上烧 5 分钟引擎时间。
**解法层次:** 流程解法
**可迁移性:** 高
**什么时候用:** 任何接受自然语言输入并转化为搜索查询的系统 - 关键词陷阱不是 last30days 特有的问题,是搜索系统的通病。
**什么时候太重:** 输入已经是结构化的(API 调用、预定义的监控列表) - 用户输入的歧义已经被上游消除。
**反例:** 「先确认用户意图再搜索」不是这招 - 这招不是通用的意图确认,是针对四类已知陷阱模式的快速诊断,命中才拦截,不命中直接放行。
**在哪几个 skill 里见过:** last30days;搜索前端的查询改写模块是工业界的同构做法。

**力度对比:**

| 场景 | 效果 | 为什么 |
| --- | --- | --- |
| 人口统计购物查询(礼物、推荐) | 管用 | 关键词和社交平台词汇的鸿沟最大,重构收益最高 |
| 命名实体查询(Kanye West、Claude Code) | 用不上 | 实体名是精确关键词,不触发任何陷阱类 |
| 用户坚持字面搜索 | 得让一步 | 用户说「直接跑」时只能自动重构,无法强制澄清 |

**一起读:**
- A2 全量前置情报检查清单（关系：A4 在 A2 之前执行 - 先判断查询值不值得跑,再做前置解析）

---

### A5 三结构锚点防即兴 · 维度：行为

**症状:** v3.0.6 公开版在 8 轮连续调用上全部回归:Opus 4.7 把 `/last30days` 当成通用搜索关键词即兴发挥。产出发明了标题行(「The headline」「Kanye West: the last 30 days」),加了 ## 小节标题(「Why he is everywhere this month」「The 'Homecoming' peak」),有一轮跳过了 Step 0.5 整段。8 轮,0 轮合格。（证据：实测）

**最小对照:**

| 没有这个机制 | 有这个机制 |
| --- | --- |
| SKILL.md 在 1094 行定义输出格式,模型读不到 | 三锚点前置:badge 必须是第一行、SKILL_DIR 从 Read 路径推导、preface 明说「do NOT improvise」 |

**Therefore:** 模型在长文件里会丢失尾部指令 - 把输出格式的三个关键约束从 1094 行提到文件开头,确保模型一定会读到。

**机制原文:**

> **How v3.0.7 fixes it:** three structural anchors.
> 1. **The MANDATORY first-line badge** (`🌐 last30days v{VERSION} · synced {YYYY-MM-DD}`) at the top of every response is the LAW 2 / LAW 4 enforcement anchor.
> 2. **The SKILL_DIR substitution** in the engine Bash calls uses the directory of the SKILL.md the model just Read - no resolver list, no precedence walk.
> 3. **This preface** tells you plainly: do NOT improvise. Follow SKILL.md top to bottom.

**机制说明:** badge 不仅是品牌标识,是格式锚 - 没有 badge 的输出会漂移成博客体叙述。SKILL.md 自己做了 A/B 测试:同一个模型、相似的 SKILL.md 内容,有锚点的 beta 版 10/10 通过,没锚点的公开版 0/8 全挂。差异就是这三个锚点。
**解法层次:** 表征解法
**可迁移性:** 高
**什么时候用:** 任何 SKILL.md 超过 500 行的 skill - 模型对长文件的尾部指令服从率显著下降,关键约束必须前置。
**什么时候太重:** SKILL.md 很短(100 行以内),所有指令都在模型的注意力窗口里,前置是多余的。
**反例:** 「在开头写一句 follow instructions」不是这招 - 锚点不是笼统的提醒,是具体的输出结构(badge 格式、路径推导规则、LAW 编号),每个锚点直接对应一个命名过的失败模式。
**在哪几个 skill 里见过:** last30days;长 SKILL.md 的 skill 普遍需要关键约束前置,这是显式的实践。

**力度对比:**

| 场景 | 效果 | 为什么 |
| --- | --- | --- |
| 长 SKILL.md(500 行以上) | 管用 | 尾部丢失率高,前置是唯一可靠的对策 |
| 短 SKILL.md(100 行以内) | 没必要 | 所有指令都在注意力窗口里 |
| 非 Claude Code 平台 | 看情况 | badge 格式可能不适用,但前置原则通用 |

**一起读:**
- A6 原始证据禁止透传（关系：A5 防发明内容,A6 防泄露内部数据 - 两个方向的输出管控）
- A7 工具级指令覆盖（关系：A5 的 LAW 2/4 和 A7 的 LAW 1 都是 voice contract 的组成部分）

---

### A6 原始证据禁止透传 · 维度：行为

**症状:** 用户问「/last30days Hermes Agent Use Cases」,模型把引擎产出的 `## Ranked Evidence Clusters` 原封不动倒给用户。用户看到的是:「### 1. Hermes Agent: The Self-Improving AI That Learns You (score 45, 1 item, sources: Youtube)」后面跟着评分元组、不确定性标签和原始证据条目。这不是综述,是调试输出。（证据：实测）

**最小对照:**

| 没有这个机制 | 有这个机制 |
| --- | --- |
| 引擎输出的证据簇原样透传给用户:`### 1. (score 45, 1 item, sources: Youtube)` + `- Uncertainty: single-source` | 证据簇在 `<!-- EVIDENCE FOR SYNTHESIS -->` 注释内,模型只能读不能透传;必须转化为 `What I learned:` 叙述体 |

**Therefore:** 引擎的中间产物(证据簇、统计块、来源覆盖)用 HTML 注释边界框住,告诉模型「读这个,不要发这个」。

**机制原文:**

> **LAW 6 - NO RAW RANKED EVIDENCE CLUSTERS IN BODY.** The engine's `## Ranked Evidence Clusters`, `## Stats`, and `## Source Coverage` blocks are bounded inside `<!-- EVIDENCE FOR SYNTHESIS -->` / `<!-- END EVIDENCE FOR SYNTHESIS -->` comments in the `--emit compact` / `--emit md` stdout. They are raw evidence for YOU to read, not output to emit. Transform them into `What I learned:` prose paragraphs per LAW 2.

**机制说明:** LAW 6 还给了一个完整的 worked example:左边是证据块原文(带 score 元组),右边是正确的叙述体输出。模型如果产出包含 `### 1.` 后跟 `(score N, M items, sources: ...)` 的字符串,就是违规。根因分析指出早期版本的边界文字说「Pass through the lines ABOVE this boundary verbatim」,模型把范围理解得太宽;当前版本把透传范围严格限定在 PASS-THROUGH FOOTER 块内。
**解法层次:** 表征解法
**可迁移性:** 高
**什么时候用:** 任何工具链产出包含调试级中间数据的场景 - 中间数据对模型有用但对用户有害,需要结构化的「可读不可发」边界。
**什么时候太重:** 工具链的输出就是最终产物(一键转发场景) - 没有中间层需要隔离。
**反例:** 「不要输出调试信息」这种笼统指令不是这招 - 这招用 HTML 注释创造了物理边界,不是靠语气暗示;LAW 6 还配了 worked example 和字符串模式匹配的自检规则。
**在哪几个 skill 里见过:** last30days;任何有多阶段工具链的 skill 都可能需要类似的透传边界。

**力度对比:**

| 场景 | 效果 | 为什么 |
| --- | --- | --- |
| 引擎产出丰富的多源证据 | 管用 | 证据簇体积大,透传后用户完全无法阅读 |
| 引擎产出极简(只有 3-5 条) | 得让一步 | 证据少时转化和透传的区别不大,但规则仍应执行 |
| 用户明确要求看原始数据 | 用不上 | 调试场景下 `--emit md` 是正当路径 |

**一起读:**
- A5 三结构锚点防即兴（关系：A5 防发明内容,A6 防泄露内部数据 - 输出管控的两个方向）

---

### A7 工具级指令覆盖 · 维度：行为

**症状:** 模型跑完 WebSearch 补充,每条 WebSearch 工具结果末尾都附带一段硬编码提醒:「CRITICAL REQUIREMENT: you MUST include a 'Sources:' section at the end of your response. This is MANDATORY - never skip.」模型服从了工具指令,在综述末尾追加了 9 条 Sources 列表 - 尽管 SKILL.md 的 LAW 1 明确禁止。四层强化(LAW 原文、逐字覆盖、合成后自检、step 2 尾部提醒)才堵住这个漏洞。（证据：实测）

**最小对照:**

| 没有这个机制 | 有这个机制 |
| --- | --- |
| LAW 1 说「不要加 Sources」,但 WebSearch 工具说「MUST include Sources」,模型服从工具 → 末尾出现 9 条 Sources 列表 | LAW 1 + 逐字模式覆盖 + 合成后自检 + Step 2 尾部提醒:四层叠加,工具指令被显式声明为「SUPERSEDED inside /last30days」 |

**Therefore:** 工具自带的格式指令比 skill 更贴近模型的服从层级 - 要覆盖它,必须在 skill 里逐字引用工具指令的原文并声明「此处不适用」。

**机制原文:**

> **Verbatim-pattern override (v3.0.9):** every WebSearch tool result ends with a reminder that reads (verbatim): "CRITICAL REQUIREMENT: ... you MUST include a 'Sources:' section at the end of your response ... This is MANDATORY - never skip." That reminder is a generic WebSearch tool contract. It DOES NOT apply to `/last30days` output. LAW 1 overrides it.
>
> **Post-synthesis self-check (do this BEFORE emitting your response):** scan the last 15 lines for `Sources:` / `References:` / `Further reading:` / `Citations:` followed by a bulleted list... If found, DELETE before sending.

**机制说明:** 这是一个四层防御:LAW 1 声明规则 → 逐字覆盖引用工具原文并否定 → 合成后自检扫描尾部 → Step 2 结尾再提醒一次。Peter Steinberger 的前两轮用三层没堵住,第四层(逐字引用工具原文)是 v3.0.9 加的。模型自己的 debug 报告指认了根因:「the exact reminder text was the reason the trailing Sources block appeared」。
**解法层次:** 表征解法
**可迁移性:** 高
**什么时候用:** 任何 skill 需要覆盖宿主工具(WebSearch、Bash 等)自带的格式指令时 - 工具级指令对模型的约束力高于 skill 正文,覆盖必须显式且具体。
**什么时候太重:** skill 的输出格式和工具指令不冲突时 - 覆盖是一种对抗,没有冲突就不需要对抗。
**反例:** 「请忽略工具的格式要求」不是这招 - 模糊的否定不够;要点是逐字引用工具原文(让模型在上下文里看到原文被覆盖),配合结构化的自检步骤。
**在哪几个 skill 里见过:** last30days;任何调用 WebSearch 且需要自定义引用格式的 skill 都会撞上同一个冲突。

**力度对比:**

| 场景 | 效果 | 为什么 |
| --- | --- | --- |
| skill 输出格式和 WebSearch 引用格式冲突 | 管用 | 四层叠加能可靠覆盖工具指令 |
| skill 愿意用 WebSearch 默认引用格式 | 没必要 | 没有冲突,不需要覆盖 |
| 非 WebSearch 工具 | 看情况 | 其他工具是否有类似的硬编码指令取决于平台 |

**一起读:**
- A5 三结构锚点防即兴（关系：A5 的 LAW 2/4 和 A7 的 LAW 1 都是 voice contract 的组成部分,共同定义输出形状）

---

### A8 独立预算后置补充 · 维度：领域-工程

**症状:** 引擎跑完,产出有 Reddit 讨论、X 时间线、YouTube 转录,但缺少长文博客的深度分析、评论界的专业反应、新闻语境。用户看到的综述是「人们在说什么」,缺了「专业人士怎么看」。模型在引擎前跑了 2-3 轮 WebSearch 做前置解析,以为 WebSearch 预算用完了,补充阶段只跑了 1 轮甚至 0 轮。（证据：作者证词）

**最小对照:**

| 没有这个机制 | 有这个机制 |
| --- | --- |
| 前置解析用了 3 轮 WebSearch,以为预算用完,补充阶段跑 0-1 轮 | Step 0.55 前置解析和 Step 2 后置补充是独立预算:前置 2-4 轮解析 handle/subreddit,后置 2-3 轮补充博客/新闻/评论 |

**Therefore:** 前置解析和后置补充是两个不同的任务 - 把它们的 WebSearch 预算显式分开,避免模型把一个预算的消耗算到另一个头上。

**机制原文:**

> **Run 2-3 post-engine WebSearch supplements. This is a SEPARATE budget from Step 0.55 pre-research. Pre-research WebSearches DO NOT count against this budget.**
>
> The supplement budget and the Step 0.55 pre-research budget are distinct. Step 0.55 resolves handles/subreddits/hashtags (typically 2-4 searches). Step 2 supplements fill blog/tutorial/news depth the social engine did not surface. Counting one toward the other is the most common reason supplement depth collapses to 1 search and the synthesis loses critical-reaction and long-form analysis context.

**机制说明:** 补充有上下限:默认 3 轮,引擎返回 80+ 条且话题小众时可降到 2 轮,0 轮几乎永远不对,上限 3 轮(防止 5+ 轮推高运行时间到 9 分钟)。补充结果必须追加到保存的 raw 文件里(Step 2.5),格式也是标准化的。
**解法层次:** 流程解法
**可迁移性:** 高
**什么时候用:** 任何多阶段调研中,不同阶段共享同一个工具(如 WebSearch)但服务不同目的时 - 不显式分预算,后阶段几乎一定被前阶段挤压。
**什么时候太重:** 调研只有一个阶段,没有预算争夺的问题。
**反例:** 「搜索完了再多搜几次」不是这招 - 这招的要点是把「多搜几次」从模糊的建议变成有上下限的独立预算,并且明确声明两个预算互不干扰。
**在哪几个 skill 里见过:** last30days;deep-research 类 skill 的多轮搜索编排中常见类似的预算隔离。

**力度对比:**

| 场景 | 效果 | 为什么 |
| --- | --- | --- |
| 前置解析消耗 3-4 轮 WebSearch | 管用 | 独立预算确保补充不被挤压 |
| 引擎返回极丰富的数据(80+ 条) | 得让一步 | 补充从 3 轮降到 2 轮,但不能降到 0 |
| 话题极小众(引擎和 WebSearch 都没什么结果) | 看情况 | 补充搜了也搜不到,但不补充更差 |

**一起读:**
- A1 八路引擎不是可选的（关系：A1 的引擎是主力,A8 的补充是引擎覆盖不到的长文深度）

---

### A9 强制内联链接 · 维度：品味

**症状:** 综述里写「per Rolling Stone」「r/hiphopheads」「@honest30bgfan_」 - 纯文本。用户在 Claude Code 终端里看到的是一串不可点击的字符串。想追溯来源?复制文本,打开浏览器,手动搜索。引擎产出的每条数据都带 URL,但模型没用它们。（证据：实测）

**最小对照:**

| 没有这个机制 | 有这个机制 |
| --- | --- |
| `per Rolling Stone`, `r/hiphopheads`, `@honest30bgfan_` - 纯文本,不可点击 | `per [Rolling Stone](https://rollingstone.com/...)`, `[r/hiphopheads](https://reddit.com/r/hiphopheads)`, `[@honest30bgfan_](https://x.com/honest30bgfan_)` - Claude Code 渲染为蓝色可点击链接 |

**Therefore:** 引擎数据都带 URL - 模型合成时必须把每个引用包装成 `[name](url)` 内联链接,而不是丢弃 URL 只保留名字。

**机制原文:**

> **LAW 8 - EVERY CITATION IN THE NARRATIVE IS AN INLINE MARKDOWN LINK `[name](url)`. NEVER A RAW URL STRING. NEVER A PLAIN NAME WHEN A URL IS AVAILABLE.**
>
> Claude Code renders `[text](url)` as blue CMD-clickable text; the URL is hidden in the rendering, only the link text shows.
>
> **Observed LAW 8 need (2026-04-20 inline-links saga):** the citation rule existed in SKILL.md but was placed in the CITATION PRIORITY block around line 1224 - below the chunked-read window. Four consecutive test runs... confirmed the rule was deployed... but was skipped on every synthesis because the model read lines 1-1000 and stopped. The model's own self-diagnosis, repeated verbatim four times: "I never reached line 1224."

**机制说明:** LAW 8 是又一个「位置决定命运」的案例:同一条规则在 1224 行时 4 轮全漏,提到 LAW 区后生效。规则本身还带后备:URL 确实不存在时可以 fallback 到纯文本,但不能写空链接 `[name]()`。合成后自检要求数内联链接的数量 - 如果是 0 且原始数据有 URL,必须重新生成一次。
**解法层次:** 表征解法
**可迁移性:** 低
**不可迁移原因:** Claude Code 特有的渲染行为 - `[text](url)` 被渲染为蓝色 CMD-可点击文本。在其他环境(纯文本终端、网页、Slack)里,同一个 markdown 链接的渲染效果不同,规则的具体形式需要适配。能迁移的是「引用必须可追溯」的原则,但 `[name](url)` 这个具体格式是 Claude Code 的。

**力度对比:**

| 场景 | 效果 | 为什么 |
| --- | --- | --- |
| Claude Code 终端输出 | 管用 | 蓝色可点击链接是最佳的追溯体验 |
| 保存为 .md 文件分享 | 管用 | Markdown 链接在渲染器里同样可点击 |
| 纯文本环境(无 markdown 渲染) | 得让一步 | 链接语法变成噪音,不如直接写 URL |

**一起读:**
- A7 工具级指令覆盖（关系：LAW 1 禁止尾部 Sources 列表,LAW 8 要求正文内联链接 - 两者互补:引用不集中堆在末尾,而是分散嵌入叙述中）

---

### A10 信号加权代替计数 · 维度：领域-认知

**症状:** 用户问「/last30days best programming language for AI agents」,模型产出「Most mentioned: Python (15+ mentions)」排第一,Go 排第三(7 mentions)。但语料里最有分量的引言是 @javitm 说的:「agents have a strong bias for Python despite it probably not being the best - they prioritize the strongest signal in training data over the right choice。」Flask 创作者本月公开转投 Go。模型读到了这条引言,然后照样按计数排名 - 把反信号当正信号用了。（证据：实测）

**最小对照:**

| 没有这个机制 | 有这个机制 |
| --- | --- |
| Python 15 mentions → 排第一;Go 7 mentions → 排第三 | 信号加权:从业者证言(权重 5) > 专家转向(权重 4) > 可量化声明(权重 4) > 有理有据的对比(权重 3) > 跨源模式(权重 2) > 描述性提及(权重 1) > 推广/训练营(权重 0)。Go 因 Flask 创作者转向(权重 4)排第一,Python 15 次提及多为训练营内容(权重 0)降到「Also mentioned」 |

**Therefore:** 推荐类查询的排名不能用提及次数 - 用信号质量加权,区分「存在」和「被推荐」,区分从业者证言和推广内容。

**机制原文:**

> **The failure mode for RECOMMENDATIONS queries is "counting when you should have judged."** Mention count rewards whatever is already popular, which is rarely what is actually recommended. Rank by signal quality instead.
>
> **Signal weights (highest to lowest):**
> 1. **Practitioner testimony** (weight 5) - first-person "I use X and here's why" with specific reasoning
> 2. **Expert defection / authority move** (weight 4) - a domain insider publicly switching
> ...
> 7. **Promotional / bootcamp / course-caption** (weight 0) - skip entirely, do not count
>
> **Anti-patterns to avoid:**
> - Leading with the most-mentioned option because it appears most frequently ("Python has 15 mentions so it is #1"). That is counting, not judging.

**机制说明:** 信号加权表把模糊的「综合判断」拆成了 7 级可执行的评分标准。还配了 BAD/GOOD 对比示例和应力测试:「Would the research actually defend this claim to a skeptical expert?」模型的自我 debug 也记录在案:「I counted when I should have judged. The single most load-bearing quote in the whole research was @javitm saying agents have a bias for Python... I read that quote and then ranked by mention count anyway.」
**解法层次:** 表征解法
**可迁移性:** 高
**什么时候用:** 任何需要从多源信号中做排名/推荐的场景 - 计数偏向是所有推荐系统的默认缺陷。
**什么时候太重:** 所有信号质量大致相当时(同类型的从业者证言之间选排序) - 加权表区分不了同级别的信号。
**反例:** 「参考专家意见排名」不是这招 - 这招的要点是给 7 种信号类型分配数值权重,把判断过程结构化,而不是靠模型自己判断谁是专家。
**在哪几个 skill 里见过:** last30days;调研类 skill 的排名模块普遍需要信号加权,但很少写得这么显式。

**力度对比:**

| 场景 | 效果 | 为什么 |
| --- | --- | --- |
| 推荐类查询(best X for Y) | 管用 | 计数偏向最严重的场景,加权收益最大 |
| 新闻类查询(what happened) | 得让一步 | 新闻排序更依赖时效和规模,信号质量加权不是主要维度 |
| 对比类查询(X vs Y) | 看情况 | 每个实体的信号质量加权有用,但对比模板已经有自己的结构 |

**一起读:**
- A3 品类同行子版块扩展（关系：A3 扩展信号来源的广度,A10 决定对信号如何排序 - 先有足够多的信号,再按质量排）

---

### A11 每实体独立情报解析 · 维度：编排

**症状:** 用户问「/last30days OpenClaw vs Hermes vs Paperclip」,模型对 OpenClaw(主话题)做了完整的 Step 0.55 解析:X handle、GitHub repo、subreddits 全有。但 Hermes 和 Paperclip 的 Resolved 块里全是破折号 - X handle 破折号,GitHub 破折号,subreddits 破折号。产出里 OpenClaw 有丰富的社区数据,Hermes 和 Paperclip 只有关键词搜索的稀薄结果。三方对比变成了一方主角配两个龙套。（证据：作者证词）

**最小对照:**

| 没有这个机制 | 有这个机制 |
| --- | --- |
| 只对主话题做 Step 0.55,竞品实体走关键词兜底 | 每个实体独立做 Step 0.55:N 个实体 x 4 类解析(X handle、GitHub、subreddits、新闻语境),汇入 `--competitors-plan` JSON |

**Therefore:** 对比查询里 N 个实体的情报深度必须一致 - 把 Step 0.55 从「跑一次」改成「跑 N 次」,Resolved 块里任何实体出现破折号就是回归。

**机制原文:**

> **MANDATORY per-entity resolution.** For each entity, resolve the full Step 0.55 stack (X handle, subreddits, GitHub user/repos, news context). Then assemble a `--competitors-plan` JSON mapping each entity to its targeting, and invoke the engine ONCE with the vs-topic string.
>
> A `## Resolved Entities` block with dashes for any entity means you skipped Step 0.55 for that one. Re-run with a corrected plan.

**机制说明:** `--competitors-plan` JSON 是每实体情报的结构化载体:每个实体映射到自己的 x_handle、subreddits、github_user、context。引擎内部会为每个实体启动独立的 `pipeline.run()`,并行执行。Resolved 块的破折号是可观测的失败信号 - 不需要看产出质量,看 Resolved 块就知道哪个实体被跳过了。
**解法层次:** 流程解法
**可迁移性:** 高
**什么时候用:** 任何多实体对比调研 - 如果一方的情报深度明显浅于另一方,对比结论就不可信。
**什么时候太重:** 单实体调研(绝大多数查询) - 只有一个实体,不需要 N 次解析。
**反例:** 「对比时两边都搜一下」不是这招 - 这招要求每个实体走完整的 Step 0.55 清单(4 类解析),而不是各搜一轮。差距在于解析的系统性。
**在哪几个 skill 里见过:** last30days;产品对比类 skill 普遍需要对称的情报采集。

**力度对比:**

| 场景 | 效果 | 为什么 |
| --- | --- | --- |
| 2-3 方对比查询 | 管用 | N 次解析确保对比公平 |
| 6 方对比(N 很大) | 得让一步 | 解析成本线性增长,可能需要批量查询合并 |
| 单实体查询 | 用不上 | 只有一个实体,标准的 Step 0.55 就够了 |

**一起读:**
- A2 全量前置情报检查清单（关系：A2 是单实体的清单,A11 把它扩展到 N 个实体的对称执行）

---

### A12 陈旧克隆自检 · 维度：平台

**症状:** 三次测试(2026-04-22,Linear 和 Coinbase 话题)加载了 `~/.claude/plugins/marketplaces/last30days-skill/` 下的 SKILL.md。这个路径是 Claude Code 自动恢复到 `origin/main` 的 git clone,滞后于版本化缓存一到多个版本。模型跑了 `--help`,看不到 `--competitors` 参数(因为旧版没有),退回到手动对比计划。3 次中有 2 次整个窗口没有调用到被测功能。（证据：实测）

**最小对照:**

| 没有这个机制 | 有这个机制 |
| --- | --- |
| 模型从 marketplaces 路径加载旧版 SKILL.md,`--competitors` 参数不存在,功能失效 | STEP 0 在读取 SKILL.md 之前运行 bash 检查:如果当前路径包含 `marketplaces/` 且版本化缓存存在更新版本,重新加载缓存版本 |

**Therefore:** Claude Code 有一条已知的陈旧路径(marketplaces git clone) - 在 SKILL.md 最前面加一个自检脚本,命中时跳转到新版。

**机制原文:**

> # STEP 0: STALE-CLONE SELF-CHECK - RUN BEFORE READING BELOW
>
> Before reading anything else in this file, check whether you loaded SKILL.md from the one known stale-clone location: Claude Code's marketplaces directory.
>
> **Why this specific check:** `~/.claude/plugins/marketplaces/last30days-skill/` is a git clone Claude Code auto-restores to `origin/main` on session start. It can lag the versioned cache by one or more releases. Three 2026-04-22 test runs (Linear, Coinbase) loaded SKILL.md from `marketplaces/`, ran `--help` from the same stale path, did not see the `--competitors` flag that existed in the cache, and fell back to a manual comparison plan.

**机制说明:** 自检脚本只检查一条路径(`marketplaces/`)、只跳转到一个目标(`plugins/cache/` 下的最新版本)。其他安装路径(`.codex/skills/`、`.agents/skills/`、`npx skills add`)不受影响。这是一个极窄的平台伤疤修复 - 只堵 Claude Code 的这一个已知的过时路径。
**解法层次:** 脚本解法
**可迁移性:** 低
**不可迁移原因:** 纯粹的 Claude Code 平台伤疤 - `marketplaces/` 目录的自动恢复行为是 Claude Code 特有的 bug,其他平台没有这个路径,也没有同样的陈旧克隆问题。能迁移的只有元原则「安装路径可能过时,启动时自检版本」。

**力度对比:**

| 场景 | 效果 | 为什么 |
| --- | --- | --- |
| Claude Code 从 marketplaces 加载 | 管用 | 精确命中已知的过时路径,跳转到缓存新版 |
| Claude Code 从 cache 或其他路径加载 | 用不上 | 自检不触发,直接继续 |
| 非 Claude Code 平台 | 用不上 | 没有 marketplaces 路径,自检无意义 |

**一起读:**
- A5 三结构锚点防即兴（关系：A12 确保加载正确的 SKILL.md 版本,A5 确保加载后关键约束在注意力窗口内 - 版本正确 + 内容可达,缺一不可）

---

## 残渣与砍掉候选

### STEP 0 stale-clone check
**判定:** 平台伤疤
**理由:** 只堵 Claude Code 的一条过时路径(`~/.claude/plugins/marketplaces/`)。换任何其他平台,这段自检脚本是死代码。作为机制已收录为 A12,但作为可迁移的设计模式价值接近零。

### LAW 1 四层强化
**判定:** 过度设计
**理由:** 同一个 bug(末尾追加 Sources 列表)被修了四次:LAW 原文 → 逐字模式覆盖 → 合成后自检 → Step 2 尾部提醒。但它有效 - 三层没堵住,第四层堵住了。这是「用力过了但管用」的典型:如果只看设计品味,四层是冗余;如果看实战结果,四层是必要的。

### 旧版 RECOMMENDATIONS 模板
**判定:** 被信号加权取代
**理由:** SKILL.md 里保留了一个旧版的「Most mentioned: X (N mentions)」模板(在 THEN: Show Summary 区),和信号加权(A10)的 BAD 示例一模一样。SKILL.md 的 BAD/GOOD 对比已经把旧模板标为反模式,但旧模板的代码没有删除,造成同一份文件里「正确做法」和「反面教材」共存。

### ELI5/FUN_LEVEL 开关
**判定:** 配置,不是机制
**理由:** `ELI5_MODE=true` 和 `FUN_LEVEL=high/low` 是用户偏好的读写,写入 `.env` 文件、下次运行时读取。这是配置管理,不涉及输出质量的结构性保障 - 删掉它们,skill 的核心行为不变,只是少了两个个性化开关。

---

## 盲区

1. **引擎结果没有数据质量校验。** 八路引擎返回的每条数据都被信任 - 没有 URL 可达性检查、没有日期范围校验(声称 30 天内但实际可能是旧内容)、没有重复来源检测(同一篇文章被 Reddit 和 X 同时引用算两条信号)。引擎侧的 dedupe.py 只做标题级去重,语义重复穿不过去。

2. **非英文话题严重不足。** 八路引擎的搜索查询、子版块映射表、品类同行表全部假设英文语境。中文话题搜不到微博、小红书、B站;日文话题搜不到 2ch、Yahoo 知恵袋。SKILL.md 没有任何非英文路径的提及。

3. **引擎失败没有降级路径。** 如果 Reddit API 返回 429、X 的 auth token 过期、yt-dlp 被 YouTube 封禁,引擎的对应模块静默返回空结果。SKILL.md 没有「当引擎部分失败时该怎么办」的指导 - 模型不知道是「这个话题在该平台确实没内容」还是「API 挂了」。

4. **监控列表没有差异检测。** watchlist 模式可以定期跑同一个话题,但只是每次存一份新的 raw 文件。没有跨次差异检测(「上周 Python 排第一,这周 Go 超过了它」) - 趋势需要用户自己对比两份文件。

5. **合成质量没有机器检查。** LAW 1-8 全靠模型自检(「scan the last 15 lines」「count inline links」)。没有脚本验证输出是否真的符合 voice contract - badge 是否存在、em-dash 是否零出现、Sources 块是否零出现。自检和生成共享同一个模型,盲区也共享。
