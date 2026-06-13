---
---

用户输入五个字:`/last30days Kanye West`。从这五个字到一份带证据链的社交舆情综述,中间要走六站。每一站解决一个「默认 agent 必然踩的坑」。

!diagram(main-flow)

| 站 | 一句话 |
| --- | --- |
| stage-01 话题理解与质量预检 | 判断话题类型,拦截关键词陷阱,确认自己没从旧副本加载 |
| stage-02 前置情报解析 | WebSearch 解析 X handle、GitHub 用户、子版块、TikTok/IG 创作者 |
| stage-03 查询计划生成 | 我自己写 JSON 查询计划,传给引擎 |
| stage-04 引擎执行与后置补充 | 跑 Python 引擎(前台,5 分钟超时)+ 2-3 次独立 WebSearch 补充 |
| stage-05 合成与输出 | 读引擎 stdout,按 LAW 1-8 和模板合成,自检后输出 |
| stage-06 对话续接 | 用户追问用已有研究回答,不重新搜索;要 prompt 按格式写 |

下面逐站走一遍。

## stage-01 话题理解与质量预检

**kicker:** 先验话题,再动引擎
**summary:** 收到用户话题后,先解析意图、检测关键词陷阱、确认自己没从陈旧副本加载,然后才往下走。
**面包屑:** 【话题理解】 → 前置情报 → 查询计划 → 引擎+补充 → 合成输出 → 对话续接

### 场景再现

我收到 `/last30days Kanye West`。

我手里有一个话题字符串和一整份 1700 行的 SKILL.md。第一件事不是搜索,是解析这个字符串:

> 1. **TOPIC**: What they want to learn about
> 2. **TARGET TOOL** (if specified): Where they'll use the prompts
> 3. **QUERY TYPE**: What kind of research they want:
>    - **PROMPTING** - "X prompts", "prompting for X"
>    - **RECOMMENDATIONS** - "best X", "top X"
>    - **NEWS** - "what's happening with X"
>    - **COMPARISON** - "X vs Y"
>    - **GENERAL** - anything else

「Kanye West」不含 vs、不含 best、不含 prompts,分到 GENERAL。意图解析完,我要做两件预检。

第一件:Step 0.45 关键词陷阱检测。第二件:Step 0 陈旧克隆自检。

### 难点

**领域难点:** 确无

**行为难点:** 默认 agent 拿到话题后直接开搜。两种方式坏掉:一,话题本身是陷阱(「gift for 42 year old man」在社交媒体上不存在这种表达,引擎跑 5 分钟返回 r/todayilearned 和 r/japannews 的噪声);二,加载了旧版 SKILL.md(Claude Code 的 marketplaces 目录自动恢复到 origin/main,可能落后缓存多个版本,整条功能缺失)。（证据：实测）

### 预测点

先猜一遍:用户输入「gift for 42 year old man」,你要跑一个覆盖 Reddit/X/YouTube 的社交引擎。这个引擎接受关键词,每次跑 5 分钟。你怎么在启动前判断「这个关键词大概率跑废」?列两个判断规则,再看 skill 的四类陷阱。

### 机制与产出

#### 关键词陷阱四分类

Step 0.45 定义了四类陷阱,每类带一个处理动作:

> **Class 1: Demographic shopping query**
> - Pattern: `gift for {age} year old {gender}`, `what to buy for my {relationship}`
> - Why it fails: no human on Reddit posts "I bought a 42 year old man a gift." Real posts use relationship + hobbies + budget.
> - Action: **Ask ONE clarifying question upfront**

> **Class 2: Numeric / age keyword trap**
> - Pattern: topic contains a specific number that collides with unrelated content (42 = Jackie Robinson + Hitchhiker's + a 42" quilt)
> - Action: Strip the number from the engine search query unless it is semantically load-bearing

> **Class 3: Overly-literal concept phrase**
> - Pattern: `how to use X`, `what is Y`, `tutorial for Z`
> - Why it fails: social posts about Docker do not say "how to use Docker"; they say "my Docker setup"
> - Action: Reframe from tutorial phrasing to discussion phrasing

> **Class 4: Generic single-noun common word**
> - Pattern: topic is a single common noun with no specific hook (`bread`, `sneakers`, `coffee`)
> - Action: Ask for specificity before running

四类的共同逻辑:用户的自然语言和社交媒体的实际表达之间存在词汇鸿沟。引擎是关键词驱动的,喂错词等于浪费 5 分钟。陷阱检测把这个鸿沟拦在引擎之前。

「Kanye West」是专有名词,不匹配任何一类,直接通过:

> If the topic does NOT match any class, emit a one-liner: `Pre-Flight: topic is a {named-entity / comparison / concept} - proceeding to Step 0.5.`

!steal(关键词陷阱四分类 + 一回合门 ｜ 直接抄走 ｜ 任何要把用户自然语言转成搜索查询的场景)
> 你下次做任何搜索驱动的工具,把这四类陷阱清单直接贴进 prompt。人群购物语 - 拆成关系、爱好和预算再搜;数字碰撞 - 42 会撞上 Jackie Robinson 球衣号码,去掉数字再搜;教程腔 - 把「how to use Docker」改成「my Docker setup」;光秃名词 - 追问一个具体切面。每类带一个处置动作。检测不花时间,但能省掉一次 5 分钟的废跑。

#### 陈旧克隆自检

第二件预检是 Step 0:

> Before reading anything else in this file, check whether you loaded SKILL.md from the one known stale-clone location: Claude Code's marketplaces directory.

这是平台伤疤,不是通用机制。Claude Code 的 `~/.claude/plugins/marketplaces/` 会自动恢复到 origin/main,可能落后缓存。2026-04-22 的三次测试(Linear, Coinbase)从旧路径加载,看不到 `--competitors` 标志,整条功能缺失。

修复方式是一段 bash:检测当前加载路径,如果是 marketplaces 就切到 cache 目录的最新版。我的 `/last30days Kanye West` 不是从 marketplaces 加载的,自检通过。

### 真实产出

这一站的产出是三个变量和一个通过判定(模拟样本,按 SKILL.md 的 Parse User Intent 节推导):

```text
TOPIC = Kanye West
TARGET_TOOL = unknown
QUERY_TYPE = GENERAL
Pre-Flight: topic is a named-entity - proceeding to Step 0.5.
```

加上面向用户的确认消息:

```text
/last30days - searching Reddit, X, YouTube, TikTok, Instagram,
Hacker News, Polymarket, and more for what people are saying
about Kanye West.
```

### 收尾

**可偷的招:** 当搜索引擎的输入是用户自然语言时 → 在启动前跑一遍关键词陷阱分类,匹配到就一回合澄清或重构,不匹配就一行日志放行。
**对应档案:** A4
**下一步靠这个:** 话题已确认为 GENERAL 类的 named-entity「Kanye West」,下一步可以直接去解析他的 X handle、GitHub 用户名和相关子版块。

## stage-02 前置情报解析

**kicker:** 搜人先找门牌号
**summary:** 用 WebSearch 把话题翻译成平台上的具体标识符:X handle、GitHub 用户名、子版块、TikTok 标签、IG 创作者,全量检查清单逐条过。
**面包屑:** 话题理解 → 【前置情报】 → 查询计划 → 引擎+补充 → 合成输出 → 对话续接
**接上一步:** 话题是 GENERAL 类 named-entity「Kanye West」,无关键词陷阱,可以开始解析平台标识符。

### 场景再现

我知道话题是 Kanye West。我的本能是直接把「Kanye West」扔进引擎。

skill 不让。Step 0.5 的开头是一张检查清单,配一句警告:

> **Pre-Flight Checklist - do NOT stop after the first flag. Every applicable flag below is MANDATORY for its topic class.**
>
> | Flag | Resolved in | Applies when |
> | --- | --- | --- |
> | `--x-handle={handle}` | Step 0.5 (Section A) | Topic is a person, brand, product, or creator with an X presence |
> | `--x-related={h1,h2,...}` | Step 0.5 (Section A) | Topic has associated entities |
> | `--github-user={user}` | Step 0.5b | Topic is a person who ships code |
> | `--github-repo={owner/repo}` | Step 0.5c | Topic is a product / project / open-source tool |
> | `--subreddits={sub1,sub2,...}` | Step 0.55 | Always |
> | `--tiktok-hashtags={h1,h2,...}` | Step 0.55 | Always |
> | `--tiktok-creators={c1,c2,...}` | Step 0.55 | Creator / influencer / brand topics |
> | `--ig-creators={c1,c2,...}` | Step 0.55 | Creator / brand topics |
> | `--auto-resolve` | Fallback | WebSearch available but could not resolve everything |

Kanye West 是人物,不是开发者,不是产品。适用的 flag:`--x-handle`(有 X 账号)、`--x-related`(有关联人物)、`--subreddits`(永远适用)、`--tiktok-hashtags`(永远适用)、`--tiktok-creators`(名人有 TikTok)、`--ig-creators`(名人有 IG)。不适用:`--github-user`(他不写代码)、`--github-repo`(不是项目)。

### 难点

**领域难点:** 搜「Kanye West」这三个字,Reddit 返回的帖子分散在 r/Kanye、r/WestSubEver、r/hiphopheads、r/Music 四个子版块。不知道子版块名就只能用全站搜索,噪声量是定向搜索的 10 倍。同样,不知道 X handle 就拿不到 @kanyewest 的时间线。每个平台都有自己的「门牌号」,搜人名只是搜噪声。（证据：实测）

**行为难点:** 默认 agent 解析了 X handle 就觉得完事了。Peter Steinberger 灾难(2026-04-18)就是这样坏的:模型读了「X handle resolution」一节就停了,跳过了 GitHub、子版块、TikTok 的全部解析。SKILL.md 的原话:「the model treated the X-handle subsection as the full contract for pre-flight resolution and didn't --help the script to see what else existed」。结果:弱 Reddit 定向、无 GitHub 人物模式、无相关声音扩展、语料单薄。（证据：实测）

### 预测点

先猜一遍:你要搜 Peter Steinberger(一个 iOS 开发者)。你已经找到了他的 X handle @steipete。默认 agent 在这里会停下来直接跑引擎。你觉得还漏了什么?列出至少三个「门牌号」,再看 skill 的完整清单。

### 机制与产出

检查清单的核心逻辑是:每个平台有自己的寻址方式,搜名字只是最差的兜底。

X handle 的解析分三类:

> **1. Primary handle** (the entity itself):
> `WebSearch("{TOPIC} X twitter handle site:x.com")`
>
> **2. Company/organization handle OR founder/creator handle**
>
> **3. 1-2 related handles** - People/entities closely associated with the topic, PLUS 1-2 prominent commentator/media handles

子版块和其他平台标识符在 Step 0.55 解析。TikTok 和 IG 的规则是推断优先、不浪费搜索:

> **TikTok hashtags + creators** - **INFER these from your topic knowledge. Do NOT WebSearch for "{PERSON} TikTok account" - most people/CEOs don't have TikTok, and the search is wasted.**

GitHub 的判断也有明确规则:

> **MANDATORY when the topic is a person (developer, creator, CEO, founder, engineer, researcher) and WebSearch is available.** Resolving the X handle but NOT the GitHub handle is the documented Peter Steinberger failure mode.

Kanye West 不是开发者,`--github-user` 跳过。不触发品类同行扩展(他不是产品)。

!steal(全量前置情报检查清单 ｜ 思路带走 ｜ 任何 CLI 工具调用前需要多维度参数解析的场景)
> 你下次写一个需要调用外部工具的 skill,把所有可选参数列成一张检查清单表,每个参数写清「什么时候适用」。然后在 prompt 里写死一句:「不要解析完第一个就停,逐条过完整张表。」Peter Steinberger 灾难的教训:模型会把第一个小节当成全部契约。

除了 handle 和子版块解析,品类同行扩展是另一个容易漏的环节。它和前置情报检查清单是搭配关系 - 前者确保每个 flag 都过了,后者确保子版块列表不是只有品牌社区。

!steal(品类同行子版块表 ｜ 直接抄走 ｜ 社交媒体调研、竞品分析、产品舆情监控)
> 你做产品舆情时,品牌子版块(r/OpenAI)只有用户问题,跨产品技巧讨论在品类通用社区(r/StableDiffusion、r/midjourney)。这张 10 品类表你可以直接抄走:AI 图像生成 → StableDiffusion, midjourney, dalle2, aiArt;AI 编码 agent → ChatGPTCoding, LocalLLaMA, singularity。你用 WebSearch 返回的子版块打底,再从品类表里补 2-3 个同行,上限 10 个去重。

### 真实产出

Kanye West 的情报解析结果(模拟样本,按 SKILL.md 的 Kanye West 示例和 Step 0.55 具体例子推导):

```text
Resolved:
- X: @kanyewest (+ @travisscott, @PopBase, @HotFreestyle)
- Reddit: r/Kanye, r/WestSubEver, r/hiphopheads, r/Music
- TikTok: #kanyewest, #ye, #bully
- YouTube: kanye west bully review, kanye west bully reaction
- Instagram: kanyewest
- GitHub: (skipped - not a developer)
```

每一行对应一个 CLI flag。这个 Resolved 块是下一站生成查询计划的输入。

### 收尾

**可偷的招:** 当调用外部工具需要多个参数、且模型倾向于解析完第一个就停时 → 列一张全量检查清单,每项标「适用条件」,prompt 里写「逐条过完整张表」。
**对应档案:** A2
**下一步靠这个:** 所有平台标识符已解析完毕,下一步可以直接用这些值生成 JSON 查询计划。

## stage-03 查询计划生成

**kicker:** 我自己就是规划器
**summary:** 我根据话题和已解析的情报,自己写一份 JSON 查询计划,包含 intent、freshness_mode、cluster_mode 和 2-4 条子查询,写到临时文件传给引擎。
**面包屑:** 话题理解 → 前置情报 → 【查询计划】 → 引擎+补充 → 合成输出 → 对话续接
**接上一步:** X handle、子版块、TikTok 标签全部解析完毕,我现在知道引擎需要哪些定向参数。

### 场景再现

我手里有 Resolved 块的全部标识符。下一步是调用 `scripts/last30days.py`。

引擎有一个 `--plan` 参数,接受一个 JSON 文件路径。如果不传 plan,引擎会用自己的内部规划器(需要 API key)或确定性回退(质量差)。skill 的要求是:我自己就是规划器。

> **LAW 7 - YOU ARE THE PLANNER. `--plan` IS MANDATORY ON NAMED-ENTITY TOPICS.** If you are the reasoning model hosting this skill, YOU generate the JSON query plan. You do not need an API key, "LLM provider" credentials, or an external planning service - you ARE the LLM.

### 难点

**领域难点:** 确无

**行为难点:** 模型跳过 `--plan`,直接裸跑引擎。引擎 stderr 打出「No --plan and no LLM provider configured. Using deterministic fallback...」。模型把 "provider" 这个词理解成「我需要一个外部服务来做规划」,而不是「我自己就是那个 provider」。2026-04-19 Hermes Agent 第一次调用就是这样坏的:裸跑,无 plan,确定性回退,产出单薄。同日第二次调用用了 `--plan`,同模型同缓存,结果干净。差异就是这一步。（证据：实测）

### 预测点

先猜一遍:引擎 stderr 打出「No LLM provider configured」。你是一个 reasoning model,你自己就能写 JSON。你会怎么理解这条消息?如果你是 skill 作者,你会怎么防止模型误读?写下你的防误读策略,再看 LAW 7 的原文。

### 机制与产出

查询计划的 schema 在 Step 0.75:

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
>     }
>   ]
> }
> ```

规则很具体:

> - Emit 1 to 4 subqueries
> - **CRITICAL: Your PRIMARY subquery MUST include ALL of these sources: reddit, x, youtube, tiktok, instagram, hackernews, polymarket.**
> - NEVER include temporal phrases in search_query: no "last 30 days", "recent", month names, year numbers
> - NEVER include meta-research phrases: no "news", "updates", "public appearances"

intent 到 freshness_mode 的映射也是写死的:

> **Intent -> freshness_mode mapping:**
> - breaking_news, prediction -> `strict_recent`
> - concept, how_to -> `evergreen_ok`
> - everything else -> `balanced_recent`

plan 必须写到文件再传路径,不能内联 JSON:

> The `--plan` flag exists precisely so a reasoning model generates its own plan upstream and passes it to the engine. Never inline `--plan '$JSON'`, apostrophes in search/ranking strings break shell parsing.

写法是 heredoc + mktemp:

> ```bash
> QUERY_PLAN_FILE=$(mktemp "${TMPDIR:-/tmp}/last30days-plan.XXXXXX")
> trap 'rm -f "$QUERY_PLAN_FILE"' EXIT
> cat > "$QUERY_PLAN_FILE" <<'PLAN_EOF'
> {QUERY_PLAN_JSON_FROM_STEP_0.75}
> PLAN_EOF
> ```

引号包裹的 `'PLAN_EOF'` 是承重的 - 它阻止 shell 展开 JSON 里的 `$` 和反引号。

### 真实产出

Kanye West 的查询计划(模拟样本,按 SKILL.md Step 0.75 的 Kanye West 示例推导):

```json
{
  "intent": "opinion",
  "freshness_mode": "balanced_recent",
  "cluster_mode": "none",
  "subqueries": [
    {
      "label": "primary",
      "search_query": "kanye west",
      "ranking_query": "What notable events involving Kanye West happened in the last 30 days?",
      "sources": ["reddit", "x", "hackernews", "youtube", "tiktok", "instagram", "polymarket"],
      "weight": 1.0
    },
    {
      "label": "album",
      "search_query": "kanye west bully album",
      "ranking_query": "How was Kanye West's BULLY album received?",
      "sources": ["youtube", "reddit", "tiktok", "instagram"],
      "weight": 0.8
    },
    {
      "label": "reactions",
      "search_query": "kanye west bully review reaction",
      "ranking_query": "What are the reviews and reactions to Kanye West's BULLY?",
      "sources": ["youtube", "tiktok", "reddit"],
      "weight": 0.6
    }
  ]
}
```

这份 JSON 写入 tmpfile,路径存为 `$QUERY_PLAN_FILE`,下一步传给引擎。

### 收尾

**可偷的招:** 当 reasoning model 自己就能做规划、但引擎的错误消息暗示「需要外部 provider」时 → 在 SKILL.md 里写死一条 LAW,明确说「你就是那个 provider」,并列出错误消息的正确解读方式。
**对应档案:** A5
**下一步靠这个:** JSON plan 已写入 tmpfile,Resolved 块的所有 flag 已就绪,下一步直接拼 bash 命令跑引擎。

## stage-04 引擎执行与后置补充

**kicker:** 引擎跑完还要补课
**summary:** 拼完整的 bash 命令跑 Python 引擎(前台,5 分钟超时,--emit=compact),读完全部 stdout;然后独立预算 2-3 次 WebSearch 补充博客/新闻深度,追加到原始文件。
**面包屑:** 话题理解 → 前置情报 → 查询计划 → 【引擎+补充】 → 合成输出 → 对话续接
**接上一步:** JSON plan 在 tmpfile 里,所有 CLI flag 已解析,可以拼命令了。

### 场景再现

我现在要拼一条 bash 命令。skill 给了模板:

```bash
"${LAST30DAYS_PYTHON}" "${SKILL_DIR}/scripts/last30days.py" \
  "Kanye West" \
  --emit=compact \
  --save-dir="${LAST30DAYS_MEMORY_DIR}" \
  --save-suffix=v3 \
  --plan "$QUERY_PLAN_FILE" \
  --x-handle=kanyewest \
  --x-related=travisscott,PopBase,HotFreestyle \
  --subreddits=Kanye,WestSubEver,hiphopheads,Music \
  --tiktok-hashtags=kanyewest,ye,bully \
  --ig-creators=kanyewest
```

运行条件写得很硬:

> **CRITICAL: Run this command in the FOREGROUND with a 5-minute timeout. Do NOT use run_in_background. The full output contains Reddit, X, AND YouTube data that you need to read completely.**

引擎跑完,stdout 包含八个数据段:Reddit 条目、X 条目、YouTube 条目(含字幕高亮)、TikTok 条目、Instagram Reels 条目、Hacker News 条目、Polymarket 条目、WebSearch 条目。末尾是 emoji-tree 统计脚注,被 `<!-- PASS-THROUGH FOOTER -->` 注释包裹。

然后是 Step 2:后置 WebSearch 补充。

### 难点

**领域难点:** 社交引擎拿到了「人们在说什么」,但漏掉了长文分析、评论文章、新闻背景。Billboard 对 BULLY 的深度评论、Pitchfork 的评分、Wireless Festival 禁令的新闻背景,这些不在 Reddit/X/TikTok 上。合成只有社交片段,没有深度和交叉验证,读起来像朋友圈转发而不是调研报告。（证据：作者证词）

**行为难点:** 两个失败模式。第一个是最常见的:模型读了 SKILL.md,跳过引擎,直接用 3-10 次 WebSearch 回答。SKILL.md 原话:「The single most common failure mode of this skill is the model reading this file, skimming the section headers, and then answering the user's topic with 3-10 WebSearch calls followed by a prose summary. That is wrong output.」产出是纯新闻摘要,没有社交信号,没有互动数据,没法判断哪个观点有影响力。第二个:引擎跑完,模型把 Step 0.55 的搜索次数算进 Step 2 的预算,补充只剩 1 次,深度塌陷。（证据：实测）

### 预测点

先猜一遍:引擎已经从八个信号源拉了上百条数据。你觉得还需要补充什么?如果需要,补充的搜索次数应该怎么算 - 和前面的预检搜索合并算,还是独立算?

### 机制与产出

#### 引擎不是可选的

SKILL.md 用三个结构关键约束防止模型跳过引擎:

> **How v3.0.7 fixes it:** three structural anchors.
> 1. **The MANDATORY first-line badge** (`🌐 last30days v{VERSION} - synced {YYYY-MM-DD}`) at the top of every response
> 2. **The SKILL_DIR substitution** in the engine Bash calls uses the directory of the SKILL.md the model just Read
> 3. **This preface** tells you plainly: do NOT improvise. Follow SKILL.md top to bottom.

这三个关键约束的存在理由是 0/8 回归:2026-04-18 同日同模型,带关键约束 10/10 通过,不带关键约束 0/8 全部违规。变量就是这三个关键约束。

!steal(三结构约束防即兴 ｜ 思路带走 ｜ 长 SKILL.md 场景下防止模型跳过契约直接回答)
> 你写的 SKILL.md 超过 500 行,模型会跳过后半部分直接回答。防法:在文件开头放三个关键约束 - 一个强制输出格式(badge)、一个绑定执行路径(SKILL_DIR)、一段明确说「不要即兴」的前言。2026-04-18 的 0/8 vs 10/10 对照证明:不是模型不行,是关键约束没放对位置。

#### 独立预算后置补充

Step 2 的预算和 Step 0.55 是隔离的:

> **Run 2-3 post-engine WebSearch supplements. This is a SEPARATE budget from Step 0.55 pre-research. Pre-research WebSearches DO NOT count against this budget.**
>
> - Default: 3 supplements. Drop to 2 if the engine returned 80+ items AND the topic is niche enough that extra web context would be noise.
> - Zero supplements is almost never correct.
> - Ceiling: 3. Do not fire 5+ "just in case"

补充完成后,Step 2.5 要求把结果追加到引擎保存的原始文件:

> **MANDATORY - do not skip this step.** Every post-engine WebSearch supplement you ran in Step 2 MUST be appended to the saved raw file under `LAST30DAYS_MEMORY_DIR`.

格式也是写死的:

> Each bullet: `- **{Publisher}** ({domain}) - {1-2 sentence excerpt of what you found}`. Publisher is the site name or author; domain is the clean hostname.

### 真实产出

引擎跑完后,stdout 末尾的 emoji-tree 脚注长这样(模拟样本,按 SKILL.md 描述的格式和 Kanye West 话题推导):

```text
---
✅ All agents reported back!
├─ 🟠 Reddit: 28 threads (14.2K upvotes, 3.1K comments) from r/Kanye, r/WestSubEver, r/hiphopheads, r/Music
├─ 🔵 X: 35 posts (8.7K likes) from @kanyewest, @PopBase, @HotFreestyle
├─ 🔴 YouTube: 12 videos (2.1M views, 45K likes) with mass transcript data
├─ 🎵 TikTok: 18 videos (4.3M views, 280K likes) via #kanyewest, #bully
├─ 📸 Instagram: 6 reels (890K views) from @kanyewest
├─ 🟡 HN: 2 stories (340 points)
├─ 📊 Polymarket: 0 markets
├─ 🌐 Web: Billboard, Pitchfork, Rolling Stone
└─ 📎 Raw results saved to ~/Documents/Last30Days/kanye-west-raw-v3.md
---
```

Step 2 补充后,追加到原始文件的内容:

```text
## WebSearch Supplemental Results

- **Billboard** (billboard.com) - BULLY debuted at No. 2 on Billboard 200, first-week sales of 142K equivalent album units
- **Pitchfork** (pitchfork.com) - Review scores BULLY at 7.2, calling it "his most focused work since MBDTF but still uneven"
- **The Guardian** (theguardian.com) - Wireless Festival confirms Kanye West ban following antisemitic remarks; organizers cite "zero tolerance policy"
```

### 收尾

**可偷的招:** 当多阶段调研中,前置搜索和后置补充都用同一个工具(WebSearch)时 → 把两者的预算写成独立的数字,在 prompt 里明确说「前置的不算进后置的」。
**对应档案:** A1
**下一步靠这个:** 引擎 stdout(含 emoji-tree 脚注)加上 WebSearch 补充,是合成的全部原料。下一步读这些原料,按 LAW 1-8 合成输出。

## stage-05 合成与输出

**kicker:** 八条律法管住嘴
**summary:** 读引擎 stdout 和 WebSearch 补充,按 LAW 1-8 和 GENERAL 模板合成:badge 首行、What I learned 叙事、KEY PATTERNS 编号列表、emoji-tree 透传、邀请结尾。自检后输出。
**面包屑:** 话题理解 → 前置情报 → 查询计划 → 引擎+补充 → 【合成输出】 → 对话续接
**接上一步:** 引擎跑完了,stdout 在手里,WebSearch 补充也追加到了原始文件。现在是纯合成。

### 场景再现

我手里有:引擎的 `--emit=compact` stdout(包含证据集群、emoji-tree 脚注,以及注释边界分隔的原始证据块)和 3 条 WebSearch 补充。

引擎 stdout 里有两种内容,用 HTML 注释分隔:

> The engine's `## Ranked Evidence Clusters`, `## Stats`, and `## Source Coverage` blocks are bounded inside `<!-- EVIDENCE FOR SYNTHESIS -->` / `<!-- END EVIDENCE FOR SYNTHESIS -->` comments in the `--emit compact` stdout. They are raw evidence for YOU to read, not output to emit.

注释边界之外的 emoji-tree 脚注被另一对注释包裹:

> `<!-- PASS-THROUGH FOOTER -->` / `<!-- END PASS-THROUGH FOOTER -->`

我要做的:读证据块,写合成叙事;读 emoji-tree,原样透传。

### 难点

**领域难点:** 推荐类查询有一个认知陷阱:按提及次数排序看起来合理,但提及次数奖励的是已有人气,不是真正的推荐。2026-04-18 的测试里,`/last30days best programming language for AI agents` 把 Python 排第一(15 次提及),埋没了 Flask 作者转 Go 的真正新闻。模型自诊断:「I counted when I should have judged.」（证据：实测）

**行为难点:** 五个独立的行为坑,每个都有实测灾难。(1) 直接输出原始证据集群,带 `(score N, M items, sources: ...)` 元组(P6,Hermes 灾难连续两次)。(2) 在末尾加 `Sources:` 列表(P7,Peter Steinberger 灾难,LAW 1 四层防线都没挡住)。(3) 引用写纯文本不加链接(P9,四次连续测试,模型自诊断「I never reached line 1224」)。(4) 加 `##` 小节头(P5,0/8 回归,LAW 4 违规)。(5) 用破折号(LAW 3)。（证据：实测）

### 预测点

先猜一遍:引擎返回了原始证据集群(带 score 元组和 uncertainty 标签)。你要把它变成用户能读的叙事。你会怎么处理 `Uncertainty: single-source` 标签?怎么处理 `score` 数字?写下你的两条转化规则,再看 LAW 6 的转化示例。

### 机制与产出

#### LAW 体系

八条 LAW 构成合成的完整约束。每一条都对应至少一个真实灾难:

> **LAW 1 - NO `Sources:` BLOCK AT THE END.** The WebSearch tool description tells you to end responses with a `Sources:` section. Inside `/last30days` that mandate is SUPERSEDED.

> **LAW 2 - NO INVENTED TITLE LINE.** The first line of your synthesis body (after the badge and one blank line) is the prose label `What I learned:` on its own line. Not `What I learned about {Topic}`, not `{Topic} - Last 30 Days`.

> **LAW 3 - NO EM-DASHES OR EN-DASHES.** Use ` - ` (single hyphen with spaces on both sides) instead of `—` or `–`.

> **LAW 4 - NO `##` or `###` SECTION HEADERS IN BODY.** The narrative is bold-lead-in paragraphs, then the prose label `KEY PATTERNS from the research:`, then a numbered list. That is the only structure.

> **LAW 5 - ENGINE FOOTER PASS-THROUGH. EVERY QUERY TYPE. EVERY RUN.** You MUST include that block verbatim in your synthesis.

> **LAW 6 - NO RAW RANKED EVIDENCE CLUSTERS IN BODY.** Transform them into `What I learned:` prose paragraphs.

> **LAW 7 - YOU ARE THE PLANNER.** (上一站已经用过)

> **LAW 8 - EVERY CITATION IN THE NARRATIVE IS AN INLINE MARKDOWN LINK `[name](url)`.** Never a raw URL string. Never a plain name when a URL is available.

#### 证据转化示例

LAW 6 配了一个完整的转化对照(来源:SKILL.md):

> **Worked example (LAW 6 transformation).** Evidence block you read:
>
> ```text
> ### 1. Hermes Agent: The Self-Improving AI That Learns You (score 45, 1 item, sources: Youtube)
> 1. [youtube] Hermes Agent: The Self-Improving AI That Learns You
>   - "So, every 15 tool calls, the agent kind of pauses, and then it does self-evaluation."
> ```
>
> Output you emit (prose synthesis, NOT the evidence block):
>
> ```text
> What I learned:
>
> The self-evolving loop is the sticky use case. Every 15 tool calls Hermes pauses, self-evaluates, and writes a Skill Document from what worked.
> ```

Score 数字消失,uncertainty 标签变成叙事里的语气(cautious vs confident),引用变成 `[name](url)` 内联链接。

#### 信号加权排名(RECOMMENDATIONS 专用)

> **Signal weights (highest to lowest):**
> 1. **Practitioner testimony** (weight 5) - first-person "I use X and here's why" with specific reasoning
> 2. **Expert defection / authority move** (weight 4) - a domain insider publicly switching
> 3. **Measurable claim** (weight 4) - specific number, benchmark, production adoption proof
> 4. **Reasoned comparison** (weight 3) - side-by-side analysis with tradeoffs
> 5. **Pattern across independent sources** (weight 2) - multiple unaffiliated voices converging
> 6. **Descriptive mention** (weight 1) - existence, not recommendation
> 7. **Promotional / bootcamp / course-caption** (weight 0) - skip entirely

Kanye West 是 GENERAL 不是 RECOMMENDATIONS,这张表不启用。但这张表本身是通用的。

!steal(信号加权 7 级权重表 ｜ 直接抄走 ｜ 任何需要从噪声中识别真正推荐的排名场景)
> 你下次做任何「从众多提及中挑出真正推荐」的工作,这张 7 级表直接抄:从业者证词 5、专家叛逃 4、可量化主张 4、有理据比较 3、独立来源收敛 2、描述性提及 1、推广/训练营 0。先把「存在」和「被推荐」分开,再按权重排。提及次数不是推荐。

#### 输出模板

GENERAL 类的输出骨架:

> ```text
> 🌐 last30days v{VERSION} - synced {YYYY-MM-DD}
>
> What I learned:
>
> **{Headline summarizing topic 1}** - [1-2 sentences, per [@handle](url) or [r/sub](url)]
>
> **{Headline summarizing topic 2}** - [1-2 sentences, per [@handle](url)]
>
> KEY PATTERNS from the research:
> 1. [Pattern] - per [@handle](url)
> 2. [Pattern] - per [r/sub](url)
> 3. [Pattern] - per [@handle](url)
> ```

之后是 emoji-tree 脚注(LAW 5 透传)和邀请块。输出到邀请块结束,后面不加任何东西(LAW 1)。

#### 自检清单

合成完成、输出之前,要过一遍自检:

> 1. **Bold headlines present.** Every narrative paragraph starts with `**Headline phrase** -`
> 2. **Per-source emoji headers in the stats footer.**
> 3. **Quoted highlights where evidence supports them.** At least 2 verbatim quotes.
> 4. **Polymarket block present if markets were returned.**
> 5. **Coverage footer matches the actual output.**
> 6. **NO trailing Sources section.**
> 7. **Research protocol was followed.**

最多重新生成一次。如果第二次还不过,输出最好的版本并告诉用户哪些检查没满足。

### 真实产出

Kanye West 的合成输出骨架(模拟样本,按 SKILL.md 模板、Kanye West 示例和 LAW 1-8 推导):

```text
🌐 last30days v3.3.2 - synced 2026-06-13

What I learned:

**BULLY dropped and it's dominating** - Kanye's new album
debuted at No. 2 on Billboard 200. Fans on
[r/WestSubEver](https://reddit.com/r/WestSubEver) are calling
it his most cohesive work since MBDTF, while
[r/hiphopheads](https://reddit.com/r/hiphopheads) is more
split - top comment (1,338 upvotes): "Where's the limewire
link"

**Europe is banning him one country at a time** - Wireless
Festival confirmed the ban. Per
[@PopBase](https://x.com/PopBase), organizers cite "zero
tolerance policy." TikTok reactions under #kanyewest are
overwhelmingly sympathetic.

**The apology letter is getting forensic analysis** - Ye's
handwritten apology got 4.2K upvotes on r/Kanye, per
[@honest30bgfan_](https://x.com/honest30bgfan_) "fans on X
are split on whether it's genuine or PR"

KEY PATTERNS from the research:
1. Album reception positive on fan subs, mixed on general music
   subs - per [r/hiphopheads](https://reddit.com/r/hiphopheads)
2. Ban momentum spreading across European festivals - per
   [@PopBase](https://x.com/PopBase)
3. TikTok reactions skew younger and more sympathetic than
   Reddit/X - per #kanyewest

---
✅ All agents reported back!
├─ 🟠 Reddit: 28 threads (14.2K upvotes, 3.1K comments)
├─ 🔵 X: 35 posts (8.7K likes)
...
└─ 📎 Raw results saved to ~/Documents/Last30Days/kanye-west-raw-v3.md
---

I'm now an expert on Kanye West. Some things I can help with:
- What's the real story behind the apology letter - genuine or PR move?
- Break down the BULLY tracklist reactions and what fans are expecting
- Compare how Reddit vs X are reacting to the Bianca narrative

I have all the links to the 28 Reddit threads, 35 X posts,
and 12 YouTube videos I pulled from. Just ask.
```

注意:没有 `##` 头、没有破折号、没有 `Sources:` 尾巴、没有原始 score 元组。引用全是 `[name](url)` 内联链接。emoji-tree 原样透传。

### 收尾

**可偷的招:** 当 LLM 输出格式容易漂移(加标题、加小节头、加引用尾巴)时 → 把格式约束写成编号 LAW,每条带一个真实违规案例和日期,放在文件头部而不是尾部。
**对应档案:** A5
**下一步靠这个:** 综述已输出,用户看到了完整的研究结果。下一步是等用户回复,用已有研究回答,不重新搜索。

## stage-06 对话续接

**kicker:** 已经是专家了,别再搜
**summary:** 用户追问时从已有研究回答,不重新搜索;用户要 prompt 时按格式写;用户要调模式(FUN_LEVEL/ELI5)时写 .env。
**面包屑:** 话题理解 → 前置情报 → 查询计划 → 引擎+补充 → 合成输出 → 【对话续接】
**接上一步:** 综述已输出,引擎原始数据保存在 `~/Documents/Last30Days/kanye-west-raw-v3.md`,用户看到了邀请块。

### 场景再现

用户看完 Kanye West 的综述,回复:「BULLY 的 tracklist 具体是什么反应?」

我的本能是再跑一次 WebSearch。skill 明确禁止:

> **CRITICAL: After research is complete, treat yourself as an EXPERT on this topic.**
>
> When the user asks follow-up questions:
> - **DO NOT run new WebSearches** - you already have the research
> - **Answer from what you learned** - cite the Reddit threads, X posts, and web sources
> - **Only do new research if the user explicitly asks about a DIFFERENT topic.**

如果用户要 prompt,则走 prompt 写作流程。格式也是写死的:

> ```text
> Here's your prompt for {TARGET_TOOL}:
>
> ---
>
> [The actual prompt IN THE FORMAT THE RESEARCH RECOMMENDS]
>
> ---
>
> This uses [brief 1-line explanation of what research insight you applied].
> ```

### 难点

**领域难点:** 确无

**行为难点:** 默认 agent 收到追问后重新搜索,因为它没有「我已经做过研究」的状态意识。结果:浪费时间,且新搜索结果可能和已有研究矛盾,破坏一致性。（证据：结构推断）

### 预测点

先猜一遍:用户问了一个你的研究数据里有答案的问题。你会怎么判断「从已有数据回答」还是「需要新搜索」?写下你的判断标准。

### 机制与产出

判断标准就一条:话题变了才重新搜索。

> - If they ask a **QUESTION** about the topic -> Answer from your research (no new searches, no prompt)
> - If they ask to **GO DEEPER** on a subtopic -> Elaborate using your research findings
> - If they describe something they want to **CREATE** -> Write ONE perfect prompt
> - **Only do new research if the user explicitly asks about a DIFFERENT topic.**

模式调节也在这里:

> - If they say **"more fun"** -> Write `FUN_LEVEL=high` to `~/.config/last30days/.env`
> - If they say **"eli5 on"** -> Write `ELI5_MODE=true` to `~/.config/last30days/.env`

Prompt 写完后有一个质量清单:

> - FORMAT MATCHES RESEARCH - If research said JSON/structured/etc, prompt IS that format
> - Directly addresses what the user said they want to create
> - Uses specific patterns/keywords discovered in research
> - Ready to paste with zero edits

### 真实产出

用户问「BULLY 的 tracklist 具体是什么反应?」,我从已有研究回答(模拟样本):

```text
Based on what I found:

**Fan subs are track-by-track dissecting** - r/WestSubEver's
megathread has 2.1K comments with per-track ratings. The
consensus favorites are tracks 3 and 7, per the upvote
distribution.

**General music subs are more skeptical** - r/hiphopheads' top
comment (1,338 upvotes) was "Where's the limewire link",
which tells you the cultural temperature. The second-highest
comment actually praised the production quality.

**YouTube reviewers are split** - Fantano's first reaction has
890K views but no formal score yet. Smaller channels like
DeadEndHipHop gave it a 7/10.

Want me to go deeper on any specific track, or write a prompt
for something you're creating?
```

没有新的 WebSearch。所有数据来自引擎 stdout 和 Step 2 补充。

### 收尾

**可偷的招:** 当 agent 已经完成一轮深度调研后 → 在 prompt 里写明「追问用已有数据回答,只有话题完全变了才重新搜索」,让 agent 保持专家模式而不是重新变成搜索机器。
**对应档案:** A1
**下一步靠这个:** 从 `/last30days Kanye West` 五个字进来,到带证据链的综述加上可续接的对话出去 - 账在这里结清。
