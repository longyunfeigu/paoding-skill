# Handbook brief · last30days · 社交舆情研究引擎

> 本文件是扫描产物,不是页面文案。所有页面包和 content/*.md 以此为素材源。

## 源信息

- **源路径**: `/Users/guwanhua/git/last30days-skill/skills/last30days`
- **skill name**: `last30days`(SKILL.md frontmatter）
- **版本**: v3.3.2
- **一句话总任务**: 输入一个话题,从 Reddit/X/YouTube/TikTok/Instagram/HN/Polymarket/Web 八路信号源拉取过去 30 天的帖子和互动数据,跑一遍聚类排序,产出一份有证据链的社交舆情综述。

### 包结构图

```text
last30days-skill/skills/last30days/
├── SKILL.md                           # 入口,1710 行:Step 0→合成的完整契约
├── references/
│   └── save-html-brief.md             # HTML 分享文档的保存流程
├── scripts/
│   ├── last30days.py                  # 主研究引擎 CLI
│   ├── briefing.py                    # 简报生成
│   ├── watchlist.py                   # 监控列表管理
│   ├── store.py                       # SQLite 持久化
│   ├── evaluate_search_quality.py     # 搜索质量评估
│   ├── verify_v3.py                   # v3 版本验证
│   ├── build-skill.sh                 # 构建脚本
│   ├── compare.sh                     # 对比脚本
│   ├── setup-keychain.sh              # 钥匙串配置
│   └── lib/                           # 40+ 模块
│       ├── pipeline.py                # 核心管道编排
│       ├── planner.py                 # 查询计划(LLM/确定性回退)
│       ├── query.py                   # 子查询分发
│       ├── fusion.py                  # 多源融合
│       ├── cluster.py                 # 证据聚类
│       ├── rerank.py                  # 排序
│       ├── render.py                  # Markdown 输出渲染
│       ├── dedupe.py                  # 去重
│       ├── relevance.py               # 相关性评分
│       ├── snippet.py                 # 摘要提取
│       ├── resolve.py                 # 自动解析(handle/sub)
│       ├── grounding.py               # Web 搜索兜底
│       ├── reddit.py + reddit_*.py    # 5 种 Reddit 获取路径
│       ├── bird_x.py / xai_x.py / xurl_x.py / xquik.py  # 4 种 X 获取路径
│       ├── youtube_yt.py              # YouTube (yt-dlp)
│       ├── hackernews.py              # HN Algolia API
│       ├── polymarket.py              # Polymarket Gamma API
│       ├── tiktok.py                  # TikTok (ScrapeCreators)
│       ├── instagram.py               # Instagram (ScrapeCreators)
│       ├── bluesky.py                 # Bluesky
│       ├── truthsocial.py             # Truth Social
│       ├── pinterest.py               # Pinterest
│       ├── digg.py                    # Digg
│       ├── github.py                  # GitHub (person-mode + project-mode)
│       ├── env.py                     # 环境变量管理
│       ├── categories.py              # 品类-同行子版块映射
│       ├── competitors.py             # 竞品对比编排
│       ├── entity_extract.py          # 实体提取
│       ├── normalize.py               # 数据标准化
│       ├── schema.py                  # 数据模型
│       ├── signals.py                 # 信号提取
│       ├── quality_nudge.py           # 覆盖率提示
│       ├── html_render.py             # HTML 简报渲染
│       ├── http.py                    # HTTP 工具
│       ├── log.py                     # 日志
│       ├── ui.py                      # CLI 进度条
│       ├── preflight.py               # 预检查
│       ├── skill_meta.py              # Skill 元数据
│       ├── setup_wizard.py            # 首次运行向导
│       ├── chrome_cookies.py          # 浏览器 cookie 提取
│       ├── safari_cookies.py          # Safari cookie
│       ├── cookie_extract.py          # Cookie 统一提取
│       ├── subproc.py                 # 子进程管理
│       └── vendor/bird-search/        # 内嵌 X 搜索客户端 (MIT)
├── agents/
│   └── openai.yaml                    # OpenAI agent 配置
├── assets/                            # 5 张演示图片/音频
└── (repo root)
    ├── CLAUDE.md / AGENTS.md          # agent 行为约束
    ├── CONFIGURATION.md               # 配置详解
    ├── CONCEPTS.md                    # 核心概念文档
    ├── tests/                         # 90+ 测试文件
    ├── fixtures/                      # 测试数据样本
    └── hooks/                         # 配置检查钩子
```

## 基线声明

基线：同款模型、不带本 skill、用户一句话 prompt（「帮我查一下最近 Kanye West 怎么样」）的默认 agent。
（领域难点另加人类基线：不熟悉社交媒体 API 的调研人员。）

## 贯穿例子

**label**: 调研 Kanye West 最近 30 天
**用户请求**: `/last30days Kanye West`
**为什么挑这个例子**: SKILL.md 全文的主贯穿例子——涵盖人物类话题的全部特殊路径（X handle 解析、GitHub 跳过、子版块发现、类别同行扩展不适用、TikTok/IG 推断、比较模板不适用），且 SKILL.md 给出了完整的 CLI 参数样例、合成模板和失败案例。
**预期产出**: 一份以 `🌐 last30days v3.3.2 · synced 2026-06-13` 开头、以 emoji-tree 统计脚注结尾的综述文档,保存为 `~/Documents/Last30Days/kanye-west-raw-v3.md`。

## Ordinary-view pain scan

| # | Ordinary assumption | Real friction | First visible symptom | Dimension | Evidence | Skill mechanism | Where it appears |
|---|---|---|---|---|---|---|---|
| P1 | 「搜几下 WebSearch 就能做舆情调研」 | WebSearch 只有博客/新闻,没有社交信号（点赞、评论、播放量）;也拿不到 YouTube 字幕、Reddit 评论、TikTok 标题 | 产出一份纯新闻摘要,没有「人们在说什么」,没有互动数据,无法判断哪个观点真正有影响力 | 领域-工程 | 作者证词（SKILL.md「The single most common failure mode... answering with 3-10 WebSearch calls」） | 八路信号源 Python 引擎 + WebSearch 仅作补充 | stage-04, A1 |
| P2 | 「搜一个关键词就能找到相关讨论」 | 人名/产品名需要解析成 X handle、GitHub 用户名、具体子版块,否则搜出来的是不相关噪声 | 搜「Peter Steinberger」只返回随机提到这个名字的帖子,漏掉 @steipete 的推文、r/iOSProgramming 的讨论、steipete 的 GitHub 活动 | 领域-认知 | 实测（作者证词：Peter Steinberger disaster #2,「the model treated the X-handle subsection as the full contract」;0/8 regression） | Step 0.5/0.55 前置情报:WebSearch 解析 handle→subreddit→GitHub user,全量检查清单 | stage-02/03, A2 |
| P3 | 「产品话题搜品牌子版块就够了」 | 跨产品技术讨论发生在品类通用社区,品牌子版块只有用户问题 | 搜 GPT Image 2 只看 r/OpenAI、r/ChatGPT,漏掉 r/StableDiffusion、r/midjourney 里大量的横向技巧讨论 | 领域-认知 | 实测（作者证词：2026-04-22 GPT Image 2 failure,「user had to manually prompt 'check image generation reddits too'」） | Step 0.55 Section 2a 品类同行扩展:10 个品类表 + 合并规则 + 上限 10 个子版块 | stage-03, A3 |
| P4 | 「用户说什么就直接搜什么」 | 「gift for 42 year old man」在社交媒体上不存在这种表达;「42」引出 Jackie Robinson 帖子 | 引擎跑 5 分钟,返回 r/todayilearned、r/japannews 的噪声,没有礼物相关内容 | 需求 | 实测（作者证词：2026-04-18「Birthday gift for 42 year old man」disaster） | Step 0.45 查询质量预检:4 类关键词陷阱检测 + 一回合澄清 + 重构规则 | stage-01, A4 |
| P5 | 「模型自己就能规划搜索策略」 | 模型跳过 SKILL.md 的分步契约,直接即兴回答（当成通用搜索关键词处理） | 8 次连续调用全部违规:虚构标题（「The headline」「Why he is everywhere」）、加 ## 小节头、带 Sources: 尾巴 | 行为 | 实测（作者证词：v3.0.6 0/8 regression,同日 10/10 beta 通过——变量是三个结构锚点的有无） | 三结构锚点:首行 badge 强制模板、SKILL_DIR 绑定、前言「do NOT improvise」 | stage-04/05, A5 |
| P6 | 「合成的时候把引擎输出总结一下就行」 | 引擎输出包含原始证据集群（score tuples, uncertainty tags）,直接粘贴暴露内部结构 | 两次连续调用直接输出 `## Ranked Evidence Clusters` 原始块,带 `(score N, M items, sources: ...)` 元组 | 行为 | 实测（作者证词：2026-04-19 Hermes Agent Use Cases disaster,连续两次） | LAW 6 原始证据禁止输出 + EVIDENCE FOR SYNTHESIS 注释边界 + 转化示例 | stage-05, A6 |
| P7 | 「WebSearch 工具说加 Sources: 就加」 | `/last30days` 的引用在 emoji-tree 脚注里,加 Sources: 尾巴是重复引用且破坏格式 | Peter Steinberger 三次调用每次都带 7-9 项 Sources 列表,4 层 LAW 1 强化都没挡住 | 行为 | 实测（作者证词：Peter Steinberger disaster #3,模型自诊断「tool-level reminder is the direct cause」） | LAW 1 四层防线:规则→模式覆盖→合成前自检→verbatim-pattern override | stage-05, A7 |
| P8 | 「引擎跑完直接输出就行,不用补充」 | 社交引擎漏博客长文分析、评论文章、新闻背景——合成缺少深度和交叉验证 | 合成只有社交片段,没有 Billboard/Pitchfork 深度评论,读起来像朋友圈转发而不是调研报告 | 领域-工程 | 作者证词（SKILL.md Step 2「Zero supplements is almost never correct」,budget 独立于 Step 0.55） | Step 2 后置 WebSearch 补充:独立预算 2-3 次,覆盖博客/教程/新闻深度 | stage-04/05, A8 |
| P9 | 「引用直接写名字就好,不用加链接」 | Claude Code 把 `[text](url)` 渲染成蓝色可点击文字;纯文本引用无法溯源 | 合成中所有引用都是纯文本「per Rolling Stone」「per @handle」,用户无法点击跳转验证 | 品味 | 实测（作者证词：2026-04-20 inline-links saga,4 次连续测试,模型自诊断「I never reached line 1224」） | LAW 8 强制内联 Markdown 链接 + 合成前自检计数 + 纯文本仅当 URL 确实缺失时回退 | stage-05, A9 |
| P10 | 「推荐类查询按提及次数排就行」 | 提及次数奖励已有人气,不是真正的推荐——bootcamp 内容、过期教程都算提及 | `/last30days best programming language for AI agents` 把 Python 排第一（15 次提及）,埋没了 Flask 作者转 Go 的真正新闻 | 领域-认知 | 实测（作者证词：2026-04-18,模型自诊断「I counted when I should have judged」） | 信号加权排名:7 级权重表（从业者证词 5 → 宣传 0）+ EXISTS vs RECOMMENDED 分离 + Delta 优先 | stage-05, A10 |
| P11 | 「VS 比较就是两个话题各搜一遍拼起来」 | 每个实体需要独立的全套 Step 0.55 情报解析,否则对手侧数据明显单薄 | Resolved Entities 块里对手实体全是 dash（—），只有主话题有 handle/sub 数据 | 编排 | 作者证词（SKILL.md「A Resolved Entities block with dashes for any entity means you skipped Step 0.55 for that one」） | --competitors-plan JSON:每个实体独立的 handle/sub/GitHub/context + N 路并行 pipeline.run() | stage-03, A11 |
| P12 | 「陈旧的 skill 副本也能正常工作」 | Claude Code 的 marketplaces 目录自动恢复到 origin/main,可能落后缓存多个版本 | 3 次测试（Linear, Coinbase）从 marketplaces/ 加载旧版,看不到 --competitors 标志,整条功能缺失 | 平台 | 实测（作者证词：2026-04-22,3/3 从旧路径加载,2/3 完全没用到竞品功能） | Step 0 自检:检测陈旧克隆 + 缓存最新版回退 + 路径对齐规则 | stage-01, A12 |

七维度覆盖检查:领域-工程（P1, P8）、领域-认知（P2, P3, P10）、行为（P5, P6, P7）、编排（P11）、品味（P9）、需求（P4）、平台（P12）。全部到访,无空维度。

## 带走候选清单

| # | 候选 | 镜头 | 档位 | 用在哪 | 进手册的位置 |
|---|---|---|---|---|---|
| S1 | 关键词陷阱四分类 + 一回合门 | 知识+验法 | 直接抄走 | 任何要把用户自然语言转成搜索查询的场景 | stage-01 |
| S2 | 品类同行子版块表（10 品类 × 优先级列表） | 知识 | 直接抄走 | 社交媒体调研、竞品分析、产品舆情监控 | stage-03 |
| S3 | 信号加权 7 级权重表（从业者 5 → 宣传 0） | 知识 | 直接抄走 | 任何需要从噪声中识别真正推荐的排名场景 | stage-05 |
| S4 | 三结构锚点防即兴模式 | 概念+验法 | 思路带走 | 长 SKILL.md 场景下防止模型跳过契约直接回答 | stage-04/05 |
| S5 | LAW 体系（8 条输出格式律） | 话术 | 思路带走 | 任何需要严格控制 LLM 输出格式的 skill | stage-05 |
| S6 | 前置情报检查清单模式（全量 flag 必须逐条过） | 验法 | 思路带走 | 任何 CLI 工具调用前需要多维度参数解析的场景 | stage-02/03 |
| S7 | 独立预算 WebSearch 补充（引擎后 2-3 次,不与前置混算） | 产物形状 | 思路带走 | 多阶段调研中后置补充信息的预算隔离设计 | stage-04 |
| S8 | 失败案例+日期作为 SKILL.md 内联测试用例 | 概念 | 思路带走 | 任何 skill 的行为约束编写——用真实灾难日期锚定规则 | 全文 |
| S9 | 证据聚类优先于信号源分类的合成策略 | 概念 | 思路带走 | 多源信息融合的合成——先看故事再看渠道 | stage-05 |
| S10 | emoji-tree 统计脚注（引擎自动生成,模型只需透传） | 产物形状 | 直接抄走 | 自动化报告的统计信息呈现,引擎生成+模型透传 | stage-05 |

## 全量盘点附录

### 中间产物清单（一个不漏）

| 产物 | 谁写 | 谁读 |
|---|---|---|
| `.env` 配置文件 (`~/.config/last30days/.env`) | 首次运行向导 / 用户手动 | env.py → 全部后续步骤 |
| 话题解析结果（TOPIC, QUERY_TYPE, TARGET_TOOL 等变量） | 模型（Step Parse User Intent） | Step 0.45, 0.5, 0.55, 0.75 |
| Step 0.45 预检判定（关键词陷阱分类 + 重构/澄清决定） | 模型 | 决定是否继续或暂停 |
| Resolved 情报块（X handle, subreddits, GitHub user, TikTok hashtags 等） | 模型通过 WebSearch（Step 0.5/0.55） | Step 0.75 查询计划, Research Execution CLI 参数 |
| 查询计划 JSON（intent, freshness_mode, cluster_mode, subqueries[]） | 模型（Step 0.75） | 写入 tmpfile → --plan 传给引擎 |
| 引擎 stdout（compact 格式:证据集群 + emoji-tree 脚注 + 通过注释边界分隔的原始证据块） | last30days.py | 模型读取并合成 |
| 保存的原始文件 `{slug}-raw-v3.md` | 引擎 --save-dir | 未来会话 / 用户回溯 |
| WebSearch 补充结果（Step 2,2-3 次独立搜索） | WebSearch 工具 | 模型合成 + 追加到原始文件 |
| `## WebSearch Supplemental Results` 追加块 | 模型（Step 2.5） | 原始文件的永久引用 |
| 最终合成输出（badge + What I learned + KEY PATTERNS + emoji-tree 脚注 + invitation） | 模型 | 用户 |
| 可选 HTML 简报文件 | 模型按 save-html-brief.md | 分享（Slack/邮件） |
| --competitors-plan JSON（VS 模式） | 模型写入 tmpfile | 引擎 → N 路并行 pipeline.run() |
| 每实体 `{slug}-raw.md`（VS 模式） | 引擎 | 模型合成比较 |

### 风险缓解（非难点,三问②答「小概率」）

- 引擎超时 300 秒兜底（CLI timeout=300000）
- 陈旧缓存 Step 0 自检（只在 Claude Code marketplaces 路径触发）
- 单次重新生成上限 1 次（LAW 自检失败时）
- Reddit 5 路回退链（reddit.py → reddit_public → reddit_keyless → reddit_rss → reddit_shreddit → reddit_listing）

### 残渣与砍掉候选

- **STEP 0 陈旧克隆自检**：只针对 Claude Code 一个路径 `~/.claude/plugins/marketplaces/` 的平台伤疤,换平台无意义 → 平台伤疤
- **LAW 1 四层防线**（规则→模式覆盖→自检→verbatim-pattern override）：四层做一件事（禁 Sources 尾巴）,是同一个 bug 被修了四次的累积痕迹 → 过度设计（但有效）
- **RECOMMENDATIONS 模板中的旧 `🏆 Most mentioned:` 模板**：和信号加权排名矛盾——SKILL.md 同时保留了旧模板（「If RECOMMENDATIONS」节）和新模板（信号加权节），后者才是规范 → 砍掉候选
- **ELI5 模式**：写入 .env 的布尔开关,只影响语气,不改变流程 → 非机制（功能性配置）
- **FUN_LEVEL 开关**：同上
- **`test-v1-vs-v2.sh`、`test_device_auth.py`**：历史版本对比工具,v3 时代不再有意义 → 历史残留

### skill 的盲区（裸做想象想到了、skill 没防的）

1. **引擎数据质量无校验**：引擎返回的帖子可能是误匹配（同名不同人）,模型合成时没有交叉验证机制——Step 0.55 的 disambiguation 只是建议,不是 gate
2. **非英语话题的信号源覆盖严重不足**：八路信号源几乎全是英文平台,中文话题（微博/小红书/B站）、日文、韩文话题会拿到极薄语料
3. **引擎故障时无降级路径**：如果 Python 引擎 crash 或所有源都返回 0,模型没有被指导做什么（LAW 5 说「if the block is present... if not, skip」,但没有给无数据场景的合成指导）
4. **长期跟踪无差异检测**：watchlist 模式存 SQLite,但没有「和上次比有什么变化」的差异机制——每次都是全新报告
5. **合成质量无机器检查**：8 条 LAW 是自然语言约束,依赖模型自检；引擎侧没有任何 post-synthesis 检查器

## 阶段划分

| ID | 阶段 | 一句话 |
|---|---|---|
| stage-01 | 话题理解与质量预检 | 解析用户意图（话题/类型/工具）,检测关键词陷阱,决定继续还是澄清 |
| stage-02 | 前置情报解析（handle/sub） | WebSearch 解析 X handle、GitHub 用户、子版块、TikTok/IG 创作者 |
| stage-03 | 查询计划生成 | 模型自己写 JSON 查询计划（2-4 子查询 × 信号源 × 权重） |
| stage-04 | 引擎执行与后置补充 | 跑 Python 引擎（前台,5 分钟超时）→ 2-3 次独立 WebSearch 补充 |
| stage-05 | 合成与输出 | 读引擎 stdout,按 LAW 1-8 和模板合成,自检后输出 |
| stage-06 | 对话续接 | 用户追问时用已有研究回答,不重新搜索；用户要 prompt 时按格式写 |

### 跨阶段机制线索

- **LAW 体系线索**：LAW 1-8 在 stage-05 合成时执行,但它们的存在理由分散在 stage-01 到 stage-06 的各个失败案例中
- **Resolved 情报线索**：stage-02 产出 handle/sub → stage-03 写入 JSON plan → stage-04 作为 CLI 参数 → stage-05 合成时作为引用依据
- **陈旧副本线索**：stage-01 Step 0 自检 → 贯穿全流程（错误版本 → 所有后续步骤都错）

## 卡片 ID 表

| ID | 卡名 | 维度 | 证据 |
|---|---|---|---|
| A1 | 八路引擎不是可选的 | 领域-工程 | 作者证词 |
| A2 | 全量前置情报检查清单 | 领域-认知 | 实测 |
| A3 | 品类同行子版块扩展 | 领域-认知 | 实测 |
| A4 | 关键词陷阱一回合门 | 需求 | 实测 |
| A5 | 三结构锚点防即兴 | 行为 | 实测 |
| A6 | 原始证据禁止透传 | 行为 | 实测 |
| A7 | 工具级指令覆盖（LAW 1 四层） | 行为 | 实测 |
| A8 | 独立预算后置补充 | 领域-工程 | 作者证词 |
| A9 | 强制内联链接 | 品味 | 实测 |
| A10 | 信号加权代替计数 | 领域-认知 | 实测 |
| A11 | 每实体独立情报解析（VS 模式） | 编排 | 作者证词 |
| A12 | 陈旧克隆自检 | 平台 | 实测 |

## 图表

| ID | 标题 | 在哪出现 |
|---|---|---|
| main-flow | 六站流水线全景 | overview panorama, walkthrough 开篇 |
| resolve-tree | 前置情报解析树 | stage-02 |
| evidence-flow | 证据从引擎到合成的边界 | stage-04/05 衔接 |
| dataflow-spine | 产物流向图 | dataflow 脊柱 |

## 证据采集记录

### 可执行工件清单

| 脚本 | 跑了/没跑 | 输入 | 一句结果 |
|---|---|---|---|
| scripts/last30days.py | 跑了 --help | 无话题 | 正常输出 80+ 行帮助,确认 40+ flag 存在 |
| scripts/last30days.py --mock | 没跑 | 需要 fixtures 对齐 | --mock 模式存在但未验证 |
| scripts/evaluate_search_quality.py | 没跑 | 需要 fixtures/eval_topics.json + API key | 评估工具,非核心流程 |
| scripts/verify_v3.py | 没跑 | 需要完整运行产出 | 验证工具 |
| scripts/build-skill.sh | 没跑 | 构建工具,非研究流程 | — |
| scripts/setup-keychain.sh | 没跑 | macOS Keychain 操作 | — |
| tests/ (pytest) | 没跑 | 需要 venv 依赖 | 90+ 测试文件存在 |

## Voice gate log

（待产出内容后填写）
