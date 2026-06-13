---
flowDiagram: main-flow
intro: 用户输入一个话题,经过六站流水线,最终产出一份有证据链的社交舆情综述文档。
---

## 产物卡

### .env 配置文件
**谁写它:** 首次运行向导（setup_wizard.py）或用户手动编辑
**谁读它:** env.py 加载后供全部后续步骤使用
**它管什么:** API 密钥、信号源开关（EXCLUDE_SOURCES）、行为偏好（FUN_LEVEL, ELI5_MODE）
**它不管什么:** 单次运行的话题、查询参数 - 这些走 CLI 参数
**为什么长这样:** 把长期不变的密钥和偏好存成文件,避免每次调用都让用户粘贴 API key。首次运行向导检测到文件不存在时自动触发,写入 SETUP_COMPLETE=true 后跳过。如果存成环境变量,换终端窗口就丢了。
**写错会坏什么:** 密钥格式错误导致某路信号源静默失败 - 引擎不会 crash,但返回 0 条该源结果,合成侧以为该源无数据。

### Resolved 情报块
**谁写它:** 模型通过 WebSearch 在 Step 0.5/0.55 中逐项解析
**谁读它:** Step 0.75 查询计划的 subqueries 编排；Research Execution 的 CLI 参数拼接
**它管什么:** 话题到平台账号的映射（X handle、GitHub user、子版块、TikTok hashtag、IG creator）
**它不管什么:** 具体搜什么子查询、用什么权重 - 那是查询计划的事
**为什么长这样:** 社交平台用 handle 而不是关键词来组织内容。直接搜名字拿到的是「提到此人」的帖子,不是此人的帖子和圈子的讨论。把 handle 解析提前做完,后面的查询计划和引擎参数都能用同一份情报,不用每站重复搜。Peter Steinberger disaster 证明:漏了一个 handle,整条流水线的该源数据就是空的。

> 模拟样本 - Kanye West 的 Resolved 情报块:
>
> ```text
> Resolved:
> - X: @kanyewest (+ @travisscott, @PopBase, @HotFreestyle)
> - Reddit: r/Kanye, r/WestSubEver, r/hiphopheads, r/Music
> - TikTok: #kanyewest, #ye, #bully
> - YouTube: kanye west bully review, kanye west bully reaction
> ```

**写错会坏什么:** handle 写错（比如写了粉丝号而不是官方号）导致拉到不相关内容;子版块漏了品类同行导致视角单一。

### 查询计划 JSON
**谁写它:** 模型在 Step 0.75 自行生成,写入 tmpfile
**谁读它:** 引擎 --plan 参数读入,跳过内部 LLM planner
**它管什么:** 搜索意图分类（breaking_news/product/comparison 等）、子查询列表（search_query + ranking_query + sources + weight）、时效模式、聚类模式
**它不管什么:** 具体哪个 API endpoint 去调、怎么处理返回结果 - 那是引擎内部 pipeline 的事
**为什么长这样:** 模型是推理引擎,引擎是数据管道。让模型写计划而不是让引擎自己用 LLM 规划,是因为模型手头有完整的话题上下文和刚解析的情报,而引擎的内部 planner 只能看到话题字符串。内部 planner 是 cron/无头模式的回退,不是首选。查询计划必须写文件再传路径 - 如果 inline 传 JSON 字符串,搜索词里的撇号（McDonald's）会截断 shell 引号。

> 模拟样本 - Kanye West 查询计划:
>
> ```json
> {
>   "intent": "breaking_news",
>   "freshness_mode": "strict_recent",
>   "cluster_mode": "story",
>   "subqueries": [
>     {
>       "label": "primary",
>       "search_query": "kanye west",
>       "ranking_query": "What notable events involving Kanye West happened in the last 30 days?",
>       "sources": ["reddit", "x", "hackernews", "youtube", "tiktok", "instagram"],
>       "weight": 1.0
>     },
>     {
>       "label": "album",
>       "search_query": "kanye west bully album",
>       "ranking_query": "How was Kanye West's BULLY album received?",
>       "sources": ["youtube", "reddit", "tiktok", "instagram"],
>       "weight": 0.8
>     }
>   ]
> }
> ```

**写错会坏什么:** search_query 带了时间词（「last 30 days」）会和引擎的时间过滤重复,拉回旧内容。primary subquery 漏了某个 source 会导致该源整体缺失。weight 设错会把次要话题推到主位。

### 引擎 stdout（compact 格式）
**谁写它:** last30days.py --emit=compact
**谁读它:** 模型 - 用于合成「What I learned」叙事
**它管什么:** 聚类后的证据（按故事/主题分组而不是按源分组）、emoji-tree 统计脚注、PASS-THROUGH FOOTER
**它不管什么:** 最终面向用户的叙事文本 - 那是模型合成的事
**为什么长这样:** 输出用 HTML 注释分成两个区域。`<!-- EVIDENCE FOR SYNTHESIS -->` 里面是模型读的原始证据（score tuples、uncertainty tags）- 这些是给模型看的工作素材。`<!-- PASS-THROUGH FOOTER -->` 里面是引擎计算好的统计信息 - 这些直接透传给用户。这个分区是 LAW 6 的基础:没有它,模型分不清哪些该转化、哪些该透传。

**写错会坏什么:** 证据区泄漏到用户输出（LAW 6 违规 - Hermes Agent 灾难）。脚注区被模型重算（数字不一致）。

### 保存的原始文件
**谁写它:** 引擎 --save-dir 自动写 + 模型在 Step 2.5 追加 WebSearch 补充
**谁读它:** 未来会话的上下文、用户手动回溯、watchlist 模式的历史对比
**它管什么:** 完整的研究记录:引擎输出全文 + WebSearch 补充来源
**它不管什么:** 合成后的叙事文本 - 用户看到的综述不存这个文件
**为什么长这样:** 把引擎数据和补充数据合并到一个 Markdown 文件里,是为了让未来的任何人（包括另一个 agent 会话）都能看到这次研究的全部原始材料。Step 2.5 的追加是一个容易漏的步骤 - SKILL.md 单独拿了一整节来防这个,因为如果只存引擎输出,补充的博客/新闻就永久丢失了。

**写错会坏什么:** 忘了 Step 2.5 追加,原始文件缺 WebSearch 来源,未来会话无法溯源博客引用。

### --competitors-plan JSON（VS 模式）
**谁写它:** 模型在比较查询时写入 tmpfile
**谁读它:** 引擎 --competitors-plan 参数 → 每实体独立 pipeline.run()
**它管什么:** 对手实体的定向信息:每个实体的 x_handle、subreddits[]、github_user、context
**它不管什么:** 主话题的定向 - 主话题走外层 --x-handle/--subreddits 参数
**为什么长这样:** VS 模式需要 N 个实体各自有独立的前置情报。如果只给名字不给 handle/sub,对手侧就退回到关键词搜索,数据明显比主话题薄。heredoc 标记必须加引号（`'PLAN_EOF'`）来抑制 shell 变量展开 - 否则 JSON 里的 `$` 和撇号会触发 shell 解析。

**写错会坏什么:** 对手实体 Resolved 块全是 dash,产出的比较是 1 vs 0.3 的不对称对比。
