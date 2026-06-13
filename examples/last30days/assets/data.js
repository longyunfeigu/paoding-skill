// 构建产物 —— 由 scripts/build-data.py 生成，禁止手写。
window.handbook = {
  "meta": {
    "title": "last30days 解剖手册",
    "skillName": "last30days",
    "audience": "想学习如何设计多源社交舆情调研 skill 的 AI skill 作者和 prompt 工程师",
    "sourcePath": "/Users/guwanhua/git/last30days-skill/skills/last30days",
    "version": "v3.3.2",
    "baseline": "同款模型、不带本 skill、用户一句话 prompt（「帮我查一下最近 Kanye West 怎么样」）的默认 agent。"
  },
  "example": {
    "label": "调研 Kanye West 最近 30 天",
    "userRequest": "/last30days Kanye West",
    "whyThisExample": "SKILL.md 的主贯穿例子,涵盖人物类话题的全部特殊路径:X handle 解析、GitHub 跳过、子版块发现、TikTok/IG 推断。SKILL.md 给出了完整 CLI 参数样例、合成模板和真实失败案例。",
    "expectedOutput": "一份以 badge 开头、emoji-tree 脚注结尾的综述,保存为 kanye-west-raw-v3.md。"
  },
  "diagrams": [
    {
      "id": "main-flow",
      "title": "六站流水线",
      "description": "从用户话题到综述输出的六个阶段:话题理解 → 前置情报 → 查询计划 → 引擎+补充 → 合成输出 → 对话续接。",
      "kicker": "flow",
      "image": "assets/diagrams/main-flow.svg"
    }
  ],
  "overview": {
    "h1": "八路引擎跑五分钟,模型三十秒就抢答了",
    "oneLiner": "用户说「帮我查查 Kanye West 最近怎么样」,默认 agent 立刻开搜、立刻写稿 - 交出来的东西看着像调研报告,其实是一份没有社交信号、没有互动数据、搜错了人的新闻剪报。这本手册拆的就是:一个 1700 行的执行契约,到底在防什么。",
    "openingScene": [
      {
        "kind": "para",
        "text": "你对 AI 说:「帮我查查最近 Kanye West 怎么样。」"
      },
      {
        "kind": "para",
        "text": "三十秒后它交货了。五段话,有标题,有小节,末尾挂着一排 Sources 链接。读起来像模像样 - Billboard 说了什么、Pitchfork 写了什么、几个新闻网站提到了新专辑。你觉得还行,存了。"
      },
      {
        "kind": "para",
        "text": "第二天你把这份「调研」拿去和一个真正泡在 Reddit 和 X 上的朋友聊,他问了三个问题:"
      },
      {
        "kind": "para",
        "text": "「r/WestSubEver 上那个泄露版 tracklist 的帖子你看了吗?三千多条评论,大半在吵歌词里那句话到底是不是 diss Drake。」你没看过。你的「调研」里没有任何 Reddit 帖子。"
      },
      {
        "kind": "para",
        "text": "「@kanyewest 那条推文底下 PopBase 和 HotFreestyle 转发了,X 上传了一整天,你怎么一句没提?」你也没看过。你的 AI 甚至没搜过 @kanyewest 这个 handle - 它搜的是「Kanye West」这四个字,返回的是新闻网站的文章标题。"
      },
      {
        "kind": "para",
        "text": "「TikTok 上那个 reaction 视频 200 万播放,所有评论都在说制作水准,你的报告里一个 TikTok 数据都没有?」"
      },
      {
        "kind": "para",
        "text": "你回头看那份输出,发现三个问题:"
      },
      {
        "kind": "para",
        "text": "第一,它只搜了网页。Reddit 的帖子和评分、X 的推文和转发、YouTube 的字幕和观看数、TikTok 的播放量 - 这些社交信号全部缺席。它交的不是舆情调研,是新闻剪报。"
      },
      {
        "kind": "para",
        "text": "第二,它没做任何预处理。「Kanye West」在 X 上是 @kanyewest,在 Reddit 上的核心社区是 r/Kanye 和 r/WestSubEver,在 TikTok 上对应 #kanyewest 和 #ye - 但它不知道。它拿着用户输入的原始字符串直接去搜,等于在图书馆里用作者的外号查目录。"
      },
      {
        "kind": "para",
        "text": "第三,它即兴发挥了。它给文章加了一个标题(「Kanye West: The Last 30 Days」),用 ## 切了三个小节,末尾自己挂了一排 Sources - 看起来专业,但这个格式完全是它自己编的。没有人告诉它该怎么组织产出,所以它按训练语料里见过最多的「博客文章」格式写了一篇。"
      },
      {
        "kind": "para",
        "text": "这三个问题不是因为模型笨。相反,它太能写了 - 任何碎片它都能编成一篇流畅的文章,流畅到你分不清哪些是证据、哪些是它自己圆的。"
      },
      {
        "kind": "para",
        "text": "一个真正做舆情的人来做这件事,也会卡。他知道该去看 Reddit 和 X,但面对八个平台、几十个子版块、上百条帖子,他不知道先搜哪个社区,不知道搜索词该怎么写才能避开噪声,更不知道最后怎么把来自不同平台的碎片拼成一份有信号权重的综述,而不是一份流水账。"
      },
      {
        "kind": "para",
        "text": "这个 skill 就是冲着「三十秒抢答」这个病来的。它的做法不是写一个更好的搜索 prompt,而是造了一条六站流水线 - 从话题理解到前置情报、从查询计划到引擎执行、从合成输出到对话续接 - 每一站都有明确的进入条件和退出检查。模型不许跳站,不许即兴,不许自己给自己的作业打分。"
      }
    ],
    "predictPrompt": "假设你来设计一个多平台舆情调研工具,用户输入「Peter Steinberger」,你会在启动搜索引擎之前先做什么?写下你的答案,再往下看这个 skill 的做法。",
    "primerBeats": [
      {
        "kind": "para",
        "text": "先用大白话把几个概念说清楚,再看全景。"
      },
      {
        "kind": "para",
        "text": "**这个 skill 解决什么问题。** 用户说一个话题,你要在 30 天内从 Reddit、X、YouTube、TikTok、Instagram、Hacker News、Polymarket、Web 八路信号源拉回真实帖子和互动数据,跑一遍聚类排序,产出一份有证据链的社交舆情综述。关键词是「社交信号」 - 新闻网站的文章不够,你需要的是人们实际在说什么、点赞什么、争论什么。"
      },
      {
        "kind": "diagram",
        "id": "main-flow"
      },
      {
        "kind": "para",
        "text": "**「前置情报」是什么,为什么非做不可。** 搜索引擎不认识人名背后的 handle。你搜「Peter Steinberger」,X 上搜不到任何有价值的内容 - 因为他在 X 上叫 @steipete。Reddit 上他的主要活动在 r/iOSProgramming,而不是你猜的 r/programming。GitHub 上他叫 steipete,不叫 PeterSteinberger。前置情报就是在跑引擎之前,先用 WebSearch 把话题解析成每个平台上的真实坐标:handle、用户名、子版块、hashtag。少这一步,引擎跑出来的结果就像用错名字寄的快递 - 包裹寄出去了,但永远到不了。"
      },
      {
        "kind": "para",
        "text": "**「查询计划」是模型自己写的。** 引擎内部有一个确定性的查询规划器,但那是给无人值守的定时任务用的。当一个推理模型(Claude、Gemini、GPT)在驱动这个 skill 时,查询计划由模型自己生成:把话题拆成 2-4 个子查询,每个子查询指定搜索词、排名问题、目标平台和权重,写成 JSON,传给引擎。模型就是规划器 - 它不需要任何额外的 API key 来「规划」。"
      },
      {
        "kind": "para",
        "text": "**引擎吐出的不是最终输出,而是原始证据集群。** 每个集群带评分元组和不确定性标签,按故事而不是按信号源分组。模型拿到这些原始数据后,要把它转化成流畅的叙事段落。"
      },
      {
        "kind": "para",
        "text": "**转化的过程有八条不可违反的格式律,叫 LAW。** 不许加 Sources 尾巴(LAW 1)、不许编标题(LAW 2)、不许用 em-dash(LAW 3)、不许加 ## 小节头(LAW 4)、引擎脚注必须原样透传(LAW 5)、原始证据禁止直接粘贴(LAW 6)、命名实体必须带查询计划(LAW 7)、引用必须是内联链接(LAW 8)。这八条律存在,是因为同一个模型在八次连续公开调用中把每一条都违反了至少一次。"
      },
      {
        "kind": "para",
        "text": "**整条流水线串起来就是这样。** 话题理解(解析意图、检测关键词陷阱) → 前置情报(解析 handle、子版块、GitHub 用户) → 查询计划(模型写 JSON) → 引擎执行 + 后置 WebSearch 补充 → 按 LAW 1-8 合成输出 → 对话续接。六站,每站有显式的进入门和退出检查。"
      }
    ],
    "wowSetup": "看一组真实对照。左边是默认 agent 拿到「/last30days Kanye West」后的典型输出(模拟);右边是带 skill 的完整产出(从 v3.0.6 公开回归记录中提取)。",
    "wowDiagramId": "main-flow",
    "wowMoment": "右边那份产出的每条引用都是可点击的内联链接,每个观点标注了来源平台和互动数据(点赞、评论、播放量),底部有一棵 emoji-tree 统计脚注自动列出覆盖的源和命中数。左边那份?连 @kanyewest 的推文都没搜到 - 因为它从头到尾没把「Kanye West」解析成 X handle。",
    "painPreview": [
      {
        "title": "模型跳过契约,直接即兴回答",
        "pit": "八次连续公开调用,模型把「/last30days」当成通用搜索关键词,跳过整个执行契约,用 3-10 次 WebSearch 拼了一篇博客风格的文章 - 虚构标题、加 ## 小节头、挂 Sources 尾巴。八次全部违规,零次命中正确格式。同一天、同一个模型、类似的 SKILL.md 内容,beta 测试 10/10 全过。",
        "hook": "用三个前置约束把模型锁在契约里:首行 badge 强制模板形状、SKILL_DIR 绑定引擎路径、前言明确说「do NOT improvise」- 差异不是模型能力,是这三个约束有没有放对位置。",
        "dimension": "行为",
        "goDeeper": "stage-04 · A5",
        "goDeeperStage": "stage-04",
        "goDeeperCard": "A5"
      },
      {
        "title": "搜「Peter Steinberger」漏掉了他所有的真实内容",
        "pit": "拿用户输入的人名直接搜,X 上搜不到 @steipete 的推文,Reddit 上搜不到 r/iOSProgramming 的讨论,GitHub 上搜不到 steipete 的提交记录。搜了五分钟,返回的全是随机提到这个名字的噪声。",
        "hook": "在跑引擎之前用 WebSearch 做全量前置情报解析 - 不是只查 X handle 就停,而是逐条过检查清单:X handle、X 关联账号、GitHub 用户名、子版块列表、TikTok hashtag、IG 创作者,每个适用的 flag 都必须填上。",
        "dimension": "领域-认知",
        "goDeeper": "stage-02 · A2",
        "goDeeperStage": "stage-02",
        "goDeeperCard": "A2"
      },
      {
        "title": "「42 岁男人的礼物」搜出了 Jackie Robinson 的帖子",
        "pit": "用户说「gift for 42 year old man」,引擎拿着原始字符串去搜,跑了五分钟。返回的结果:r/todayilearned 关于 42 号球衣的帖子、r/japannews 的犯罪新闻、r/LivestreamFail 的直播片段 - 没有一条和礼物有关。因为社交媒体上没人说「I bought a 42 year old man a gift」,而数字 42 是 Jackie Robinson 的球衣号码,关键词碰撞把搜索结果全带偏了。",
        "hook": "引擎启动前先跑一个查询质量预检(四类关键词陷阱检测:人口统计购物、数字碰撞、过于字面的概念短语、泛泛单词),命中陷阱就暂停 - 花一回合问清楚爱好/关系/预算,或者重构搜索词去掉碰撞数字,比白跑五分钟划算得多。",
        "dimension": "需求",
        "goDeeper": "stage-01 · A4",
        "goDeeperStage": "stage-01",
        "goDeeperCard": "A4"
      },
      {
        "title": "按提及次数排名,埋没了真正的信号",
        "pit": "推荐类查询「best programming language for AI agents」,模型按提及次数排名,Python 以 15 次提及排第一。但这 15 次里有 bootcamp 广告、过期教程、入门帖 - 它们「提到了」Python,但不是「推荐」Python。真正有价值的信号 - 比如 Flask 作者转 Go 的深度访谈 - 被埋在列表底部,因为只被提了一次。",
        "hook": "用信号加权代替简单计数:从业者的第一手证词权重 5,有数据支撑的分析权重 4,社区共识权重 3,一路降到宣传内容权重 0 - 同时区分「EXISTS(有人提到了)」和「RECOMMENDED(有人真正推荐了)」,再优先展示 Delta(最近才出现的变化)。",
        "dimension": "领域-认知",
        "goDeeper": "stage-05 · A10",
        "goDeeperStage": "stage-05",
        "goDeeperCard": "A10"
      },
      {
        "title": "把原始证据集群直接粘给用户",
        "pit": "引擎输出里有一段 `## Ranked Evidence Clusters`,带着 `(score 45, 1 item, sources: Youtube)` 这样的评分元组和 `- Uncertainty: single-source` 这样的标签。模型把整段原样粘到了用户输出里 - 连续两次。用户看到的不是调研综述,是引擎的内部工作笔记。",
        "hook": "用注释边界(`<!-- EVIDENCE FOR SYNTHESIS -->`)把原始证据和透传内容物理隔开,LAW 6 明确规定:证据块是给模型读的输入,不是给用户看的输出 - 合成的意思是把 score tuple 变成 `What I learned:` 里的叙事段落。",
        "dimension": "行为",
        "goDeeper": "stage-05 · A6",
        "goDeeperStage": "stage-05",
        "goDeeperCard": "A6"
      }
    ],
    "panoramaDiagramId": "main-flow",
    "shapeReason": "章节顺序跟着流水线走:先看全景(本章),再跟 agent 第一人称走完六站(实战走查),然后沿数据看每份中间文件的形状(中间产物),把难点做成可检索的卡片(难点档案),最后练习搬走(迁移练习)。",
    "chapterLogic": [
      {
        "chapter": "实战走查",
        "why": "跟着 agent 第一人称走完「调研 Kanye West」六站,每站看它差点怎么错、skill 怎么拦"
      },
      {
        "chapter": "中间产物与数据流",
        "why": "换个视角沿文件走:查询计划 JSON 为什么长那个形状,Resolved 情报块怎么传递到 CLI 参数,引擎 stdout 里的注释边界怎么分隔「给模型读的」和「给用户看的」"
      },
      {
        "chapter": "难点档案",
        "why": "把全部 12 个难点做成可直链检索的卡片,附上被砍掉的候选和 skill 没覆盖到的地方"
      },
      {
        "chapter": "迁移练习",
        "why": "把六站流水线的结构提炼出来,换一个领域练习重新搭建"
      },
      {
        "chapter": "术语表",
        "why": "5 个核心术语的查询卡,给从中间页直接跳进来的读者"
      }
    ]
  },
  "walkthrough": [
    {
      "id": "stage-01",
      "title": "话题理解与质量预检",
      "kicker": "先验话题,再动引擎",
      "summary": "收到用户话题后,先解析意图、检测关键词陷阱、确认自己没从陈旧副本加载,然后才往下走。",
      "breadcrumb": "【话题理解】 → 前置情报 → 查询计划 → 引擎+补充 → 合成输出 → 对话续接",
      "hookOpen": "",
      "sceneBody": [
        {
          "kind": "para",
          "text": "我收到 `/last30days Kanye West`。"
        },
        {
          "kind": "para",
          "text": "我手里有一个话题字符串和一整份 1700 行的 SKILL.md。第一件事不是搜索,是解析这个字符串:"
        },
        {
          "kind": "quote",
          "text": "1. **TOPIC**: What they want to learn about\n2. **TARGET TOOL** (if specified): Where they'll use the prompts\n3. **QUERY TYPE**: What kind of research they want:\n- **PROMPTING** - \"X prompts\", \"prompting for X\"\n- **RECOMMENDATIONS** - \"best X\", \"top X\"\n- **NEWS** - \"what's happening with X\"\n- **COMPARISON** - \"X vs Y\"\n- **GENERAL** - anything else",
          "blocks": [
            {
              "kind": "para",
              "text": "1. **TOPIC**: What they want to learn about\n2. **TARGET TOOL** (if specified): Where they'll use the prompts\n3. **QUERY TYPE**: What kind of research they want:"
            },
            {
              "kind": "list",
              "items": [
                "**PROMPTING** - \"X prompts\", \"prompting for X\"",
                "**RECOMMENDATIONS** - \"best X\", \"top X\"",
                "**NEWS** - \"what's happening with X\"",
                "**COMPARISON** - \"X vs Y\"",
                "**GENERAL** - anything else"
              ]
            }
          ]
        },
        {
          "kind": "para",
          "text": "「Kanye West」不含 vs、不含 best、不含 prompts,分到 GENERAL。意图解析完,我要做两件预检。"
        },
        {
          "kind": "para",
          "text": "第一件:Step 0.45 关键词陷阱检测。第二件:Step 0 陈旧克隆自检。"
        }
      ],
      "painDomain": {
        "text": "确无"
      },
      "painBehavior": {
        "text": "默认 agent 拿到话题后直接开搜。两种方式坏掉:一,话题本身是陷阱(「gift for 42 year old man」在社交媒体上不存在这种表达,引擎跑 5 分钟返回 r/todayilearned 和 r/japannews 的噪声);二,加载了旧版 SKILL.md(Claude Code 的 marketplaces 目录自动恢复到 origin/main,可能落后缓存多个版本,整条功能缺失)。",
        "evidence": "实测"
      },
      "predictBody": [
        {
          "kind": "para",
          "text": "先猜一遍:用户输入「gift for 42 year old man」,你要跑一个覆盖 Reddit/X/YouTube 的社交引擎。这个引擎接受关键词,每次跑 5 分钟。你怎么在启动前判断「这个关键词大概率跑废」?列两个判断规则,再看 skill 的四类陷阱。"
        }
      ],
      "mechanismBody": [
        {
          "kind": "h4",
          "text": "关键词陷阱四分类"
        },
        {
          "kind": "para",
          "text": "Step 0.45 定义了四类陷阱,每类带一个处理动作:"
        },
        {
          "kind": "quote",
          "text": "**Class 1: Demographic shopping query**\n- Pattern: `gift for {age} year old {gender}`, `what to buy for my {relationship}`\n- Why it fails: no human on Reddit posts \"I bought a 42 year old man a gift.\" Real posts use relationship + hobbies + budget.\n- Action: **Ask ONE clarifying question upfront**",
          "blocks": [
            {
              "kind": "para",
              "text": "**Class 1: Demographic shopping query**"
            },
            {
              "kind": "list",
              "items": [
                "Pattern: `gift for {age} year old {gender}`, `what to buy for my {relationship}`",
                "Why it fails: no human on Reddit posts \"I bought a 42 year old man a gift.\" Real posts use relationship + hobbies + budget.",
                "Action: **Ask ONE clarifying question upfront**"
              ]
            }
          ]
        },
        {
          "kind": "quote",
          "text": "**Class 2: Numeric / age keyword trap**\n- Pattern: topic contains a specific number that collides with unrelated content (42 = Jackie Robinson + Hitchhiker's + a 42\" quilt)\n- Action: Strip the number from the engine search query unless it is semantically load-bearing",
          "blocks": [
            {
              "kind": "para",
              "text": "**Class 2: Numeric / age keyword trap**"
            },
            {
              "kind": "list",
              "items": [
                "Pattern: topic contains a specific number that collides with unrelated content (42 = Jackie Robinson + Hitchhiker's + a 42\" quilt)",
                "Action: Strip the number from the engine search query unless it is semantically load-bearing"
              ]
            }
          ]
        },
        {
          "kind": "quote",
          "text": "**Class 3: Overly-literal concept phrase**\n- Pattern: `how to use X`, `what is Y`, `tutorial for Z`\n- Why it fails: social posts about Docker do not say \"how to use Docker\"; they say \"my Docker setup\"\n- Action: Reframe from tutorial phrasing to discussion phrasing",
          "blocks": [
            {
              "kind": "para",
              "text": "**Class 3: Overly-literal concept phrase**"
            },
            {
              "kind": "list",
              "items": [
                "Pattern: `how to use X`, `what is Y`, `tutorial for Z`",
                "Why it fails: social posts about Docker do not say \"how to use Docker\"; they say \"my Docker setup\"",
                "Action: Reframe from tutorial phrasing to discussion phrasing"
              ]
            }
          ]
        },
        {
          "kind": "quote",
          "text": "**Class 4: Generic single-noun common word**\n- Pattern: topic is a single common noun with no specific hook (`bread`, `sneakers`, `coffee`)\n- Action: Ask for specificity before running",
          "blocks": [
            {
              "kind": "para",
              "text": "**Class 4: Generic single-noun common word**"
            },
            {
              "kind": "list",
              "items": [
                "Pattern: topic is a single common noun with no specific hook (`bread`, `sneakers`, `coffee`)",
                "Action: Ask for specificity before running"
              ]
            }
          ]
        },
        {
          "kind": "para",
          "text": "四类的共同逻辑:用户的自然语言和社交媒体的实际表达之间存在词汇鸿沟。引擎是关键词驱动的,喂错词等于浪费 5 分钟。陷阱检测把这个鸿沟拦在引擎之前。"
        },
        {
          "kind": "para",
          "text": "「Kanye West」是专有名词,不匹配任何一类,直接通过:"
        },
        {
          "kind": "quote",
          "text": "If the topic does NOT match any class, emit a one-liner: `Pre-Flight: topic is a {named-entity / comparison / concept} - proceeding to Step 0.5.`",
          "blocks": [
            {
              "kind": "para",
              "text": "If the topic does NOT match any class, emit a one-liner: `Pre-Flight: topic is a {named-entity / comparison / concept} - proceeding to Step 0.5.`"
            }
          ]
        },
        {
          "kind": "steal",
          "name": "关键词陷阱四分类 + 一回合门",
          "tier": "直接抄走",
          "scene": "任何要把用户自然语言转成搜索查询的场景",
          "text": "你下次做任何搜索驱动的工具,把这四类陷阱清单直接贴进 prompt。人群购物语 - 拆成关系、爱好和预算再搜;数字碰撞 - 42 会撞上 Jackie Robinson 球衣号码,去掉数字再搜;教程腔 - 把「how to use Docker」改成「my Docker setup」;光秃名词 - 追问一个具体切面。每类带一个处置动作。检测不花时间,但能省掉一次 5 分钟的废跑。",
          "blocks": [
            {
              "kind": "para",
              "text": "你下次做任何搜索驱动的工具,把这四类陷阱清单直接贴进 prompt。人群购物语 - 拆成关系、爱好和预算再搜;数字碰撞 - 42 会撞上 Jackie Robinson 球衣号码,去掉数字再搜;教程腔 - 把「how to use Docker」改成「my Docker setup」;光秃名词 - 追问一个具体切面。每类带一个处置动作。检测不花时间,但能省掉一次 5 分钟的废跑。"
            }
          ],
          "anchor": "steal-1"
        },
        {
          "kind": "h4",
          "text": "陈旧克隆自检"
        },
        {
          "kind": "para",
          "text": "第二件预检是 Step 0:"
        },
        {
          "kind": "quote",
          "text": "Before reading anything else in this file, check whether you loaded SKILL.md from the one known stale-clone location: Claude Code's marketplaces directory.",
          "blocks": [
            {
              "kind": "para",
              "text": "Before reading anything else in this file, check whether you loaded SKILL.md from the one known stale-clone location: Claude Code's marketplaces directory."
            }
          ]
        },
        {
          "kind": "para",
          "text": "这是平台伤疤,不是通用机制。Claude Code 的 `~/.claude/plugins/marketplaces/` 会自动恢复到 origin/main,可能落后缓存。2026-04-22 的三次测试(Linear, Coinbase)从旧路径加载,看不到 `--competitors` 标志,整条功能缺失。"
        },
        {
          "kind": "para",
          "text": "修复方式是一段 bash:检测当前加载路径,如果是 marketplaces 就切到 cache 目录的最新版。我的 `/last30days Kanye West` 不是从 marketplaces 加载的,自检通过。"
        }
      ],
      "outputBody": [
        {
          "kind": "para",
          "text": "这一站的产出是三个变量和一个通过判定(模拟样本,按 SKILL.md 的 Parse User Intent 节推导):"
        },
        {
          "kind": "code",
          "text": "TOPIC = Kanye West\nTARGET_TOOL = unknown\nQUERY_TYPE = GENERAL\nPre-Flight: topic is a named-entity - proceeding to Step 0.5.",
          "lang": "text"
        },
        {
          "kind": "para",
          "text": "加上面向用户的确认消息:"
        },
        {
          "kind": "code",
          "text": "/last30days - searching Reddit, X, YouTube, TikTok, Instagram,\nHacker News, Polymarket, and more for what people are saying\nabout Kanye West.",
          "lang": "text"
        }
      ],
      "reusableMove": "当搜索引擎的输入是用户自然语言时 → 在启动前跑一遍关键词陷阱分类,匹配到就一回合澄清或重构,不匹配就一行日志放行。",
      "moveCard": "A4",
      "hookClose": "话题已确认为 GENERAL 类的 named-entity「Kanye West」,下一步可以直接去解析他的 X handle、GitHub 用户名和相关子版块。",
      "challenges": [],
      "quickref": {}
    },
    {
      "id": "stage-02",
      "title": "前置情报解析",
      "kicker": "搜人先找门牌号",
      "summary": "用 WebSearch 把话题翻译成平台上的具体标识符:X handle、GitHub 用户名、子版块、TikTok 标签、IG 创作者,全量检查清单逐条过。",
      "breadcrumb": "话题理解 → 【前置情报】 → 查询计划 → 引擎+补充 → 合成输出 → 对话续接",
      "hookOpen": "话题是 GENERAL 类 named-entity「Kanye West」,无关键词陷阱,可以开始解析平台标识符。",
      "sceneBody": [
        {
          "kind": "para",
          "text": "我知道话题是 Kanye West。我的本能是直接把「Kanye West」扔进引擎。"
        },
        {
          "kind": "para",
          "text": "skill 不让。Step 0.5 的开头是一张检查清单,配一句警告:"
        },
        {
          "kind": "quote",
          "text": "**Pre-Flight Checklist - do NOT stop after the first flag. Every applicable flag below is MANDATORY for its topic class.**\n\n| Flag | Resolved in | Applies when |\n| --- | --- | --- |\n| `--x-handle={handle}` | Step 0.5 (Section A) | Topic is a person, brand, product, or creator with an X presence |\n| `--x-related={h1,h2,...}` | Step 0.5 (Section A) | Topic has associated entities |\n| `--github-user={user}` | Step 0.5b | Topic is a person who ships code |\n| `--github-repo={owner/repo}` | Step 0.5c | Topic is a product / project / open-source tool |\n| `--subreddits={sub1,sub2,...}` | Step 0.55 | Always |\n| `--tiktok-hashtags={h1,h2,...}` | Step 0.55 | Always |\n| `--tiktok-creators={c1,c2,...}` | Step 0.55 | Creator / influencer / brand topics |\n| `--ig-creators={c1,c2,...}` | Step 0.55 | Creator / brand topics |\n| `--auto-resolve` | Fallback | WebSearch available but could not resolve everything |",
          "blocks": [
            {
              "kind": "para",
              "text": "**Pre-Flight Checklist - do NOT stop after the first flag. Every applicable flag below is MANDATORY for its topic class.**"
            },
            {
              "kind": "table",
              "rows": [
                [
                  "Flag",
                  "Resolved in",
                  "Applies when"
                ],
                [
                  "`--x-handle={handle}`",
                  "Step 0.5 (Section A)",
                  "Topic is a person, brand, product, or creator with an X presence"
                ],
                [
                  "`--x-related={h1,h2,...}`",
                  "Step 0.5 (Section A)",
                  "Topic has associated entities"
                ],
                [
                  "`--github-user={user}`",
                  "Step 0.5b",
                  "Topic is a person who ships code"
                ],
                [
                  "`--github-repo={owner/repo}`",
                  "Step 0.5c",
                  "Topic is a product / project / open-source tool"
                ],
                [
                  "`--subreddits={sub1,sub2,...}`",
                  "Step 0.55",
                  "Always"
                ],
                [
                  "`--tiktok-hashtags={h1,h2,...}`",
                  "Step 0.55",
                  "Always"
                ],
                [
                  "`--tiktok-creators={c1,c2,...}`",
                  "Step 0.55",
                  "Creator / influencer / brand topics"
                ],
                [
                  "`--ig-creators={c1,c2,...}`",
                  "Step 0.55",
                  "Creator / brand topics"
                ],
                [
                  "`--auto-resolve`",
                  "Fallback",
                  "WebSearch available but could not resolve everything"
                ]
              ]
            }
          ]
        },
        {
          "kind": "para",
          "text": "Kanye West 是人物,不是开发者,不是产品。适用的 flag:`--x-handle`(有 X 账号)、`--x-related`(有关联人物)、`--subreddits`(永远适用)、`--tiktok-hashtags`(永远适用)、`--tiktok-creators`(名人有 TikTok)、`--ig-creators`(名人有 IG)。不适用:`--github-user`(他不写代码)、`--github-repo`(不是项目)。"
        }
      ],
      "painDomain": {
        "text": "搜「Kanye West」这三个字,Reddit 返回的帖子分散在 r/Kanye、r/WestSubEver、r/hiphopheads、r/Music 四个子版块。不知道子版块名就只能用全站搜索,噪声量是定向搜索的 10 倍。同样,不知道 X handle 就拿不到 @kanyewest 的时间线。每个平台都有自己的「门牌号」,搜人名只是搜噪声。",
        "evidence": "实测"
      },
      "painBehavior": {
        "text": "默认 agent 解析了 X handle 就觉得完事了。Peter Steinberger 灾难(2026-04-18)就是这样坏的:模型读了「X handle resolution」一节就停了,跳过了 GitHub、子版块、TikTok 的全部解析。SKILL.md 的原话:「the model treated the X-handle subsection as the full contract for pre-flight resolution and didn't --help the script to see what else existed」。结果:弱 Reddit 定向、无 GitHub 人物模式、无相关声音扩展、语料单薄。",
        "evidence": "实测"
      },
      "predictBody": [
        {
          "kind": "para",
          "text": "先猜一遍:你要搜 Peter Steinberger(一个 iOS 开发者)。你已经找到了他的 X handle @steipete。默认 agent 在这里会停下来直接跑引擎。你觉得还漏了什么?列出至少三个「门牌号」,再看 skill 的完整清单。"
        }
      ],
      "mechanismBody": [
        {
          "kind": "para",
          "text": "检查清单的核心逻辑是:每个平台有自己的寻址方式,搜名字只是最差的兜底。"
        },
        {
          "kind": "para",
          "text": "X handle 的解析分三类:"
        },
        {
          "kind": "quote",
          "text": "**1. Primary handle** (the entity itself):\n`WebSearch(\"{TOPIC} X twitter handle site:x.com\")`\n\n**2. Company/organization handle OR founder/creator handle**\n\n**3. 1-2 related handles** - People/entities closely associated with the topic, PLUS 1-2 prominent commentator/media handles",
          "blocks": [
            {
              "kind": "para",
              "text": "**1. Primary handle** (the entity itself):\n`WebSearch(\"{TOPIC} X twitter handle site:x.com\")`"
            },
            {
              "kind": "para",
              "text": "**2. Company/organization handle OR founder/creator handle**"
            },
            {
              "kind": "para",
              "text": "**3. 1-2 related handles** - People/entities closely associated with the topic, PLUS 1-2 prominent commentator/media handles"
            }
          ]
        },
        {
          "kind": "para",
          "text": "子版块和其他平台标识符在 Step 0.55 解析。TikTok 和 IG 的规则是推断优先、不浪费搜索:"
        },
        {
          "kind": "quote",
          "text": "**TikTok hashtags + creators** - **INFER these from your topic knowledge. Do NOT WebSearch for \"{PERSON} TikTok account\" - most people/CEOs don't have TikTok, and the search is wasted.**",
          "blocks": [
            {
              "kind": "para",
              "text": "**TikTok hashtags + creators** - **INFER these from your topic knowledge. Do NOT WebSearch for \"{PERSON} TikTok account\" - most people/CEOs don't have TikTok, and the search is wasted.**"
            }
          ]
        },
        {
          "kind": "para",
          "text": "GitHub 的判断也有明确规则:"
        },
        {
          "kind": "quote",
          "text": "**MANDATORY when the topic is a person (developer, creator, CEO, founder, engineer, researcher) and WebSearch is available.** Resolving the X handle but NOT the GitHub handle is the documented Peter Steinberger failure mode.",
          "blocks": [
            {
              "kind": "para",
              "text": "**MANDATORY when the topic is a person (developer, creator, CEO, founder, engineer, researcher) and WebSearch is available.** Resolving the X handle but NOT the GitHub handle is the documented Peter Steinberger failure mode."
            }
          ]
        },
        {
          "kind": "para",
          "text": "Kanye West 不是开发者,`--github-user` 跳过。不触发品类同行扩展(他不是产品)。"
        },
        {
          "kind": "steal",
          "name": "全量前置情报检查清单",
          "tier": "思路带走",
          "scene": "任何 CLI 工具调用前需要多维度参数解析的场景",
          "text": "你下次写一个需要调用外部工具的 skill,把所有可选参数列成一张检查清单表,每个参数写清「什么时候适用」。然后在 prompt 里写死一句:「不要解析完第一个就停,逐条过完整张表。」Peter Steinberger 灾难的教训:模型会把第一个小节当成全部契约。",
          "blocks": [
            {
              "kind": "para",
              "text": "你下次写一个需要调用外部工具的 skill,把所有可选参数列成一张检查清单表,每个参数写清「什么时候适用」。然后在 prompt 里写死一句:「不要解析完第一个就停,逐条过完整张表。」Peter Steinberger 灾难的教训:模型会把第一个小节当成全部契约。"
            }
          ],
          "anchor": "steal-2"
        },
        {
          "kind": "para",
          "text": "除了 handle 和子版块解析,品类同行扩展是另一个容易漏的环节。它和前置情报检查清单是搭配关系 - 前者确保每个 flag 都过了,后者确保子版块列表不是只有品牌社区。"
        },
        {
          "kind": "steal",
          "name": "品类同行子版块表",
          "tier": "直接抄走",
          "scene": "社交媒体调研、竞品分析、产品舆情监控",
          "text": "你做产品舆情时,品牌子版块(r/OpenAI)只有用户问题,跨产品技巧讨论在品类通用社区(r/StableDiffusion、r/midjourney)。这张 10 品类表你可以直接抄走:AI 图像生成 → StableDiffusion, midjourney, dalle2, aiArt;AI 编码 agent → ChatGPTCoding, LocalLLaMA, singularity。你用 WebSearch 返回的子版块打底,再从品类表里补 2-3 个同行,上限 10 个去重。",
          "blocks": [
            {
              "kind": "para",
              "text": "你做产品舆情时,品牌子版块(r/OpenAI)只有用户问题,跨产品技巧讨论在品类通用社区(r/StableDiffusion、r/midjourney)。这张 10 品类表你可以直接抄走:AI 图像生成 → StableDiffusion, midjourney, dalle2, aiArt;AI 编码 agent → ChatGPTCoding, LocalLLaMA, singularity。你用 WebSearch 返回的子版块打底,再从品类表里补 2-3 个同行,上限 10 个去重。"
            }
          ],
          "anchor": "steal-3"
        }
      ],
      "outputBody": [
        {
          "kind": "para",
          "text": "Kanye West 的情报解析结果(模拟样本,按 SKILL.md 的 Kanye West 示例和 Step 0.55 具体例子推导):"
        },
        {
          "kind": "code",
          "text": "Resolved:\n- X: @kanyewest (+ @travisscott, @PopBase, @HotFreestyle)\n- Reddit: r/Kanye, r/WestSubEver, r/hiphopheads, r/Music\n- TikTok: #kanyewest, #ye, #bully\n- YouTube: kanye west bully review, kanye west bully reaction\n- Instagram: kanyewest\n- GitHub: (skipped - not a developer)",
          "lang": "text"
        },
        {
          "kind": "para",
          "text": "每一行对应一个 CLI flag。这个 Resolved 块是下一站生成查询计划的输入。"
        }
      ],
      "reusableMove": "当调用外部工具需要多个参数、且模型倾向于解析完第一个就停时 → 列一张全量检查清单,每项标「适用条件」,prompt 里写「逐条过完整张表」。",
      "moveCard": "A2",
      "hookClose": "所有平台标识符已解析完毕,下一步可以直接用这些值生成 JSON 查询计划。",
      "challenges": [],
      "quickref": {}
    },
    {
      "id": "stage-03",
      "title": "查询计划生成",
      "kicker": "我自己就是规划器",
      "summary": "我根据话题和已解析的情报,自己写一份 JSON 查询计划,包含 intent、freshness_mode、cluster_mode 和 2-4 条子查询,写到临时文件传给引擎。",
      "breadcrumb": "话题理解 → 前置情报 → 【查询计划】 → 引擎+补充 → 合成输出 → 对话续接",
      "hookOpen": "X handle、子版块、TikTok 标签全部解析完毕,我现在知道引擎需要哪些定向参数。",
      "sceneBody": [
        {
          "kind": "para",
          "text": "我手里有 Resolved 块的全部标识符。下一步是调用 `scripts/last30days.py`。"
        },
        {
          "kind": "para",
          "text": "引擎有一个 `--plan` 参数,接受一个 JSON 文件路径。如果不传 plan,引擎会用自己的内部规划器(需要 API key)或确定性回退(质量差)。skill 的要求是:我自己就是规划器。"
        },
        {
          "kind": "quote",
          "text": "**LAW 7 - YOU ARE THE PLANNER. `--plan` IS MANDATORY ON NAMED-ENTITY TOPICS.** If you are the reasoning model hosting this skill, YOU generate the JSON query plan. You do not need an API key, \"LLM provider\" credentials, or an external planning service - you ARE the LLM.",
          "blocks": [
            {
              "kind": "para",
              "text": "**LAW 7 - YOU ARE THE PLANNER. `--plan` IS MANDATORY ON NAMED-ENTITY TOPICS.** If you are the reasoning model hosting this skill, YOU generate the JSON query plan. You do not need an API key, \"LLM provider\" credentials, or an external planning service - you ARE the LLM."
            }
          ]
        }
      ],
      "painDomain": {
        "text": "确无"
      },
      "painBehavior": {
        "text": "模型跳过 `--plan`,直接裸跑引擎。引擎 stderr 打出「No --plan and no LLM provider configured. Using deterministic fallback...」。模型把 \"provider\" 这个词理解成「我需要一个外部服务来做规划」,而不是「我自己就是那个 provider」。2026-04-19 Hermes Agent 第一次调用就是这样坏的:裸跑,无 plan,确定性回退,产出单薄。同日第二次调用用了 `--plan`,同模型同缓存,结果干净。差异就是这一步。",
        "evidence": "实测"
      },
      "predictBody": [
        {
          "kind": "para",
          "text": "先猜一遍:引擎 stderr 打出「No LLM provider configured」。你是一个 reasoning model,你自己就能写 JSON。你会怎么理解这条消息?如果你是 skill 作者,你会怎么防止模型误读?写下你的防误读策略,再看 LAW 7 的原文。"
        }
      ],
      "mechanismBody": [
        {
          "kind": "para",
          "text": "查询计划的 schema 在 Step 0.75:"
        },
        {
          "kind": "quote",
          "text": "```json\n{\n\"intent\": \"breaking_news\",\n\"freshness_mode\": \"strict_recent\",\n\"cluster_mode\": \"story\",\n\"subqueries\": [\n{\n\"label\": \"primary\",\n\"search_query\": \"kanye west\",\n\"ranking_query\": \"What notable events involving Kanye West happened in the last 30 days?\",\n\"sources\": [\"reddit\", \"x\", \"hackernews\", \"youtube\", \"tiktok\", \"instagram\"],\n\"weight\": 1.0\n}\n]\n}\n```",
          "blocks": [
            {
              "kind": "code",
              "text": "{\n  \"intent\": \"breaking_news\",\n  \"freshness_mode\": \"strict_recent\",\n  \"cluster_mode\": \"story\",\n  \"subqueries\": [\n    {\n      \"label\": \"primary\",\n      \"search_query\": \"kanye west\",\n      \"ranking_query\": \"What notable events involving Kanye West happened in the last 30 days?\",\n      \"sources\": [\"reddit\", \"x\", \"hackernews\", \"youtube\", \"tiktok\", \"instagram\"],\n      \"weight\": 1.0\n    }\n  ]\n}",
              "lang": "json"
            }
          ]
        },
        {
          "kind": "para",
          "text": "规则很具体:"
        },
        {
          "kind": "quote",
          "text": "- Emit 1 to 4 subqueries\n- **CRITICAL: Your PRIMARY subquery MUST include ALL of these sources: reddit, x, youtube, tiktok, instagram, hackernews, polymarket.**\n- NEVER include temporal phrases in search_query: no \"last 30 days\", \"recent\", month names, year numbers\n- NEVER include meta-research phrases: no \"news\", \"updates\", \"public appearances\"",
          "blocks": [
            {
              "kind": "list",
              "items": [
                "Emit 1 to 4 subqueries",
                "**CRITICAL: Your PRIMARY subquery MUST include ALL of these sources: reddit, x, youtube, tiktok, instagram, hackernews, polymarket.**",
                "NEVER include temporal phrases in search_query: no \"last 30 days\", \"recent\", month names, year numbers",
                "NEVER include meta-research phrases: no \"news\", \"updates\", \"public appearances\""
              ]
            }
          ]
        },
        {
          "kind": "para",
          "text": "intent 到 freshness_mode 的映射也是写死的:"
        },
        {
          "kind": "quote",
          "text": "**Intent -> freshness_mode mapping:**\n- breaking_news, prediction -> `strict_recent`\n- concept, how_to -> `evergreen_ok`\n- everything else -> `balanced_recent`",
          "blocks": [
            {
              "kind": "para",
              "text": "**Intent -> freshness_mode mapping:**"
            },
            {
              "kind": "list",
              "items": [
                "breaking_news, prediction -> `strict_recent`",
                "concept, how_to -> `evergreen_ok`",
                "everything else -> `balanced_recent`"
              ]
            }
          ]
        },
        {
          "kind": "para",
          "text": "plan 必须写到文件再传路径,不能内联 JSON:"
        },
        {
          "kind": "quote",
          "text": "The `--plan` flag exists precisely so a reasoning model generates its own plan upstream and passes it to the engine. Never inline `--plan '$JSON'`, apostrophes in search/ranking strings break shell parsing.",
          "blocks": [
            {
              "kind": "para",
              "text": "The `--plan` flag exists precisely so a reasoning model generates its own plan upstream and passes it to the engine. Never inline `--plan '$JSON'`, apostrophes in search/ranking strings break shell parsing."
            }
          ]
        },
        {
          "kind": "para",
          "text": "写法是 heredoc + mktemp:"
        },
        {
          "kind": "quote",
          "text": "```bash\nQUERY_PLAN_FILE=$(mktemp \"${TMPDIR:-/tmp}/last30days-plan.XXXXXX\")\ntrap 'rm -f \"$QUERY_PLAN_FILE\"' EXIT\ncat > \"$QUERY_PLAN_FILE\" <<'PLAN_EOF'\n{QUERY_PLAN_JSON_FROM_STEP_0.75}\nPLAN_EOF\n```",
          "blocks": [
            {
              "kind": "code",
              "text": "QUERY_PLAN_FILE=$(mktemp \"${TMPDIR:-/tmp}/last30days-plan.XXXXXX\")\ntrap 'rm -f \"$QUERY_PLAN_FILE\"' EXIT\ncat > \"$QUERY_PLAN_FILE\" <<'PLAN_EOF'\n{QUERY_PLAN_JSON_FROM_STEP_0.75}\nPLAN_EOF",
              "lang": "bash"
            }
          ]
        },
        {
          "kind": "para",
          "text": "引号包裹的 `'PLAN_EOF'` 是承重的 - 它阻止 shell 展开 JSON 里的 `$` 和反引号。"
        }
      ],
      "outputBody": [
        {
          "kind": "para",
          "text": "Kanye West 的查询计划(模拟样本,按 SKILL.md Step 0.75 的 Kanye West 示例推导):"
        },
        {
          "kind": "code",
          "text": "{\n  \"intent\": \"opinion\",\n  \"freshness_mode\": \"balanced_recent\",\n  \"cluster_mode\": \"none\",\n  \"subqueries\": [\n    {\n      \"label\": \"primary\",\n      \"search_query\": \"kanye west\",\n      \"ranking_query\": \"What notable events involving Kanye West happened in the last 30 days?\",\n      \"sources\": [\"reddit\", \"x\", \"hackernews\", \"youtube\", \"tiktok\", \"instagram\", \"polymarket\"],\n      \"weight\": 1.0\n    },\n    {\n      \"label\": \"album\",\n      \"search_query\": \"kanye west bully album\",\n      \"ranking_query\": \"How was Kanye West's BULLY album received?\",\n      \"sources\": [\"youtube\", \"reddit\", \"tiktok\", \"instagram\"],\n      \"weight\": 0.8\n    },\n    {\n      \"label\": \"reactions\",\n      \"search_query\": \"kanye west bully review reaction\",\n      \"ranking_query\": \"What are the reviews and reactions to Kanye West's BULLY?\",\n      \"sources\": [\"youtube\", \"tiktok\", \"reddit\"],\n      \"weight\": 0.6\n    }\n  ]\n}",
          "lang": "json"
        },
        {
          "kind": "para",
          "text": "这份 JSON 写入 tmpfile,路径存为 `$QUERY_PLAN_FILE`,下一步传给引擎。"
        }
      ],
      "reusableMove": "当 reasoning model 自己就能做规划、但引擎的错误消息暗示「需要外部 provider」时 → 在 SKILL.md 里写死一条 LAW,明确说「你就是那个 provider」,并列出错误消息的正确解读方式。",
      "moveCard": "A5",
      "hookClose": "JSON plan 已写入 tmpfile,Resolved 块的所有 flag 已就绪,下一步直接拼 bash 命令跑引擎。",
      "challenges": [],
      "quickref": {}
    },
    {
      "id": "stage-04",
      "title": "引擎执行与后置补充",
      "kicker": "引擎跑完还要补课",
      "summary": "拼完整的 bash 命令跑 Python 引擎(前台,5 分钟超时,--emit=compact),读完全部 stdout;然后独立预算 2-3 次 WebSearch 补充博客/新闻深度,追加到原始文件。",
      "breadcrumb": "话题理解 → 前置情报 → 查询计划 → 【引擎+补充】 → 合成输出 → 对话续接",
      "hookOpen": "JSON plan 在 tmpfile 里,所有 CLI flag 已解析,可以拼命令了。",
      "sceneBody": [
        {
          "kind": "para",
          "text": "我现在要拼一条 bash 命令。skill 给了模板:"
        },
        {
          "kind": "code",
          "text": "\"${LAST30DAYS_PYTHON}\" \"${SKILL_DIR}/scripts/last30days.py\" \\\n  \"Kanye West\" \\\n  --emit=compact \\\n  --save-dir=\"${LAST30DAYS_MEMORY_DIR}\" \\\n  --save-suffix=v3 \\\n  --plan \"$QUERY_PLAN_FILE\" \\\n  --x-handle=kanyewest \\\n  --x-related=travisscott,PopBase,HotFreestyle \\\n  --subreddits=Kanye,WestSubEver,hiphopheads,Music \\\n  --tiktok-hashtags=kanyewest,ye,bully \\\n  --ig-creators=kanyewest",
          "lang": "bash"
        },
        {
          "kind": "para",
          "text": "运行条件写得很硬:"
        },
        {
          "kind": "quote",
          "text": "**CRITICAL: Run this command in the FOREGROUND with a 5-minute timeout. Do NOT use run_in_background. The full output contains Reddit, X, AND YouTube data that you need to read completely.**",
          "blocks": [
            {
              "kind": "para",
              "text": "**CRITICAL: Run this command in the FOREGROUND with a 5-minute timeout. Do NOT use run_in_background. The full output contains Reddit, X, AND YouTube data that you need to read completely.**"
            }
          ]
        },
        {
          "kind": "para",
          "text": "引擎跑完,stdout 包含八个数据段:Reddit 条目、X 条目、YouTube 条目(含字幕高亮)、TikTok 条目、Instagram Reels 条目、Hacker News 条目、Polymarket 条目、WebSearch 条目。末尾是 emoji-tree 统计脚注,被 `<!-- PASS-THROUGH FOOTER -->` 注释包裹。"
        },
        {
          "kind": "para",
          "text": "然后是 Step 2:后置 WebSearch 补充。"
        }
      ],
      "painDomain": {
        "text": "社交引擎拿到了「人们在说什么」,但漏掉了长文分析、评论文章、新闻背景。Billboard 对 BULLY 的深度评论、Pitchfork 的评分、Wireless Festival 禁令的新闻背景,这些不在 Reddit/X/TikTok 上。合成只有社交片段,没有深度和交叉验证,读起来像朋友圈转发而不是调研报告。",
        "evidence": "作者证词"
      },
      "painBehavior": {
        "text": "两个失败模式。第一个是最常见的:模型读了 SKILL.md,跳过引擎,直接用 3-10 次 WebSearch 回答。SKILL.md 原话:「The single most common failure mode of this skill is the model reading this file, skimming the section headers, and then answering the user's topic with 3-10 WebSearch calls followed by a prose summary. That is wrong output.」产出是纯新闻摘要,没有社交信号,没有互动数据,没法判断哪个观点有影响力。第二个:引擎跑完,模型把 Step 0.55 的搜索次数算进 Step 2 的预算,补充只剩 1 次,深度塌陷。",
        "evidence": "实测"
      },
      "predictBody": [
        {
          "kind": "para",
          "text": "先猜一遍:引擎已经从八个信号源拉了上百条数据。你觉得还需要补充什么?如果需要,补充的搜索次数应该怎么算 - 和前面的预检搜索合并算,还是独立算?"
        }
      ],
      "mechanismBody": [
        {
          "kind": "h4",
          "text": "引擎不是可选的"
        },
        {
          "kind": "para",
          "text": "SKILL.md 用三个结构关键约束防止模型跳过引擎:"
        },
        {
          "kind": "quote",
          "text": "**How v3.0.7 fixes it:** three structural anchors.\n1. **The MANDATORY first-line badge** (`🌐 last30days v{VERSION} - synced {YYYY-MM-DD}`) at the top of every response\n2. **The SKILL_DIR substitution** in the engine Bash calls uses the directory of the SKILL.md the model just Read\n3. **This preface** tells you plainly: do NOT improvise. Follow SKILL.md top to bottom.",
          "blocks": [
            {
              "kind": "para",
              "text": "**How v3.0.7 fixes it:** three structural anchors.\n1. **The MANDATORY first-line badge** (`🌐 last30days v{VERSION} - synced {YYYY-MM-DD}`) at the top of every response\n2. **The SKILL_DIR substitution** in the engine Bash calls uses the directory of the SKILL.md the model just Read\n3. **This preface** tells you plainly: do NOT improvise. Follow SKILL.md top to bottom."
            }
          ]
        },
        {
          "kind": "para",
          "text": "这三个关键约束的存在理由是 0/8 回归:2026-04-18 同日同模型,带关键约束 10/10 通过,不带关键约束 0/8 全部违规。变量就是这三个关键约束。"
        },
        {
          "kind": "steal",
          "name": "三结构约束防即兴",
          "tier": "思路带走",
          "scene": "长 SKILL.md 场景下防止模型跳过契约直接回答",
          "text": "你写的 SKILL.md 超过 500 行,模型会跳过后半部分直接回答。防法:在文件开头放三个关键约束 - 一个强制输出格式(badge)、一个绑定执行路径(SKILL_DIR)、一段明确说「不要即兴」的前言。2026-04-18 的 0/8 vs 10/10 对照证明:不是模型不行,是关键约束没放对位置。",
          "blocks": [
            {
              "kind": "para",
              "text": "你写的 SKILL.md 超过 500 行,模型会跳过后半部分直接回答。防法:在文件开头放三个关键约束 - 一个强制输出格式(badge)、一个绑定执行路径(SKILL_DIR)、一段明确说「不要即兴」的前言。2026-04-18 的 0/8 vs 10/10 对照证明:不是模型不行,是关键约束没放对位置。"
            }
          ],
          "anchor": "steal-4"
        },
        {
          "kind": "h4",
          "text": "独立预算后置补充"
        },
        {
          "kind": "para",
          "text": "Step 2 的预算和 Step 0.55 是隔离的:"
        },
        {
          "kind": "quote",
          "text": "**Run 2-3 post-engine WebSearch supplements. This is a SEPARATE budget from Step 0.55 pre-research. Pre-research WebSearches DO NOT count against this budget.**\n\n- Default: 3 supplements. Drop to 2 if the engine returned 80+ items AND the topic is niche enough that extra web context would be noise.\n- Zero supplements is almost never correct.\n- Ceiling: 3. Do not fire 5+ \"just in case\"",
          "blocks": [
            {
              "kind": "para",
              "text": "**Run 2-3 post-engine WebSearch supplements. This is a SEPARATE budget from Step 0.55 pre-research. Pre-research WebSearches DO NOT count against this budget.**"
            },
            {
              "kind": "list",
              "items": [
                "Default: 3 supplements. Drop to 2 if the engine returned 80+ items AND the topic is niche enough that extra web context would be noise.",
                "Zero supplements is almost never correct.",
                "Ceiling: 3. Do not fire 5+ \"just in case\""
              ]
            }
          ]
        },
        {
          "kind": "para",
          "text": "补充完成后,Step 2.5 要求把结果追加到引擎保存的原始文件:"
        },
        {
          "kind": "quote",
          "text": "**MANDATORY - do not skip this step.** Every post-engine WebSearch supplement you ran in Step 2 MUST be appended to the saved raw file under `LAST30DAYS_MEMORY_DIR`.",
          "blocks": [
            {
              "kind": "para",
              "text": "**MANDATORY - do not skip this step.** Every post-engine WebSearch supplement you ran in Step 2 MUST be appended to the saved raw file under `LAST30DAYS_MEMORY_DIR`."
            }
          ]
        },
        {
          "kind": "para",
          "text": "格式也是写死的:"
        },
        {
          "kind": "quote",
          "text": "Each bullet: `- **{Publisher}** ({domain}) - {1-2 sentence excerpt of what you found}`. Publisher is the site name or author; domain is the clean hostname.",
          "blocks": [
            {
              "kind": "para",
              "text": "Each bullet: `- **{Publisher}** ({domain}) - {1-2 sentence excerpt of what you found}`. Publisher is the site name or author; domain is the clean hostname."
            }
          ]
        }
      ],
      "outputBody": [
        {
          "kind": "para",
          "text": "引擎跑完后,stdout 末尾的 emoji-tree 脚注长这样(模拟样本,按 SKILL.md 描述的格式和 Kanye West 话题推导):"
        },
        {
          "kind": "code",
          "text": "---\n✅ All agents reported back!\n├─ 🟠 Reddit: 28 threads (14.2K upvotes, 3.1K comments) from r/Kanye, r/WestSubEver, r/hiphopheads, r/Music\n├─ 🔵 X: 35 posts (8.7K likes) from @kanyewest, @PopBase, @HotFreestyle\n├─ 🔴 YouTube: 12 videos (2.1M views, 45K likes) with mass transcript data\n├─ 🎵 TikTok: 18 videos (4.3M views, 280K likes) via #kanyewest, #bully\n├─ 📸 Instagram: 6 reels (890K views) from @kanyewest\n├─ 🟡 HN: 2 stories (340 points)\n├─ 📊 Polymarket: 0 markets\n├─ 🌐 Web: Billboard, Pitchfork, Rolling Stone\n└─ 📎 Raw results saved to ~/Documents/Last30Days/kanye-west-raw-v3.md\n---",
          "lang": "text"
        },
        {
          "kind": "para",
          "text": "Step 2 补充后,追加到原始文件的内容:"
        },
        {
          "kind": "code",
          "text": "## WebSearch Supplemental Results\n\n- **Billboard** (billboard.com) - BULLY debuted at No. 2 on Billboard 200, first-week sales of 142K equivalent album units\n- **Pitchfork** (pitchfork.com) - Review scores BULLY at 7.2, calling it \"his most focused work since MBDTF but still uneven\"\n- **The Guardian** (theguardian.com) - Wireless Festival confirms Kanye West ban following antisemitic remarks; organizers cite \"zero tolerance policy\"",
          "lang": "text"
        }
      ],
      "reusableMove": "当多阶段调研中,前置搜索和后置补充都用同一个工具(WebSearch)时 → 把两者的预算写成独立的数字,在 prompt 里明确说「前置的不算进后置的」。",
      "moveCard": "A1",
      "hookClose": "引擎 stdout(含 emoji-tree 脚注)加上 WebSearch 补充,是合成的全部原料。下一步读这些原料,按 LAW 1-8 合成输出。",
      "challenges": [],
      "quickref": {}
    },
    {
      "id": "stage-05",
      "title": "合成与输出",
      "kicker": "八条律法管住嘴",
      "summary": "读引擎 stdout 和 WebSearch 补充,按 LAW 1-8 和 GENERAL 模板合成:badge 首行、What I learned 叙事、KEY PATTERNS 编号列表、emoji-tree 透传、邀请结尾。自检后输出。",
      "breadcrumb": "话题理解 → 前置情报 → 查询计划 → 引擎+补充 → 【合成输出】 → 对话续接",
      "hookOpen": "引擎跑完了,stdout 在手里,WebSearch 补充也追加到了原始文件。现在是纯合成。",
      "sceneBody": [
        {
          "kind": "para",
          "text": "我手里有:引擎的 `--emit=compact` stdout(包含证据集群、emoji-tree 脚注,以及注释边界分隔的原始证据块)和 3 条 WebSearch 补充。"
        },
        {
          "kind": "para",
          "text": "引擎 stdout 里有两种内容,用 HTML 注释分隔:"
        },
        {
          "kind": "quote",
          "text": "The engine's `## Ranked Evidence Clusters`, `## Stats`, and `## Source Coverage` blocks are bounded inside `<!-- EVIDENCE FOR SYNTHESIS -->` / `<!-- END EVIDENCE FOR SYNTHESIS -->` comments in the `--emit compact` stdout. They are raw evidence for YOU to read, not output to emit.",
          "blocks": [
            {
              "kind": "para",
              "text": "The engine's `## Ranked Evidence Clusters`, `## Stats`, and `## Source Coverage` blocks are bounded inside `<!-- EVIDENCE FOR SYNTHESIS -->` / `<!-- END EVIDENCE FOR SYNTHESIS -->` comments in the `--emit compact` stdout. They are raw evidence for YOU to read, not output to emit."
            }
          ]
        },
        {
          "kind": "para",
          "text": "注释边界之外的 emoji-tree 脚注被另一对注释包裹:"
        },
        {
          "kind": "quote",
          "text": "`<!-- PASS-THROUGH FOOTER -->` / `<!-- END PASS-THROUGH FOOTER -->`",
          "blocks": [
            {
              "kind": "para",
              "text": "`<!-- PASS-THROUGH FOOTER -->` / `<!-- END PASS-THROUGH FOOTER -->`"
            }
          ]
        },
        {
          "kind": "para",
          "text": "我要做的:读证据块,写合成叙事;读 emoji-tree,原样透传。"
        }
      ],
      "painDomain": {
        "text": "推荐类查询有一个认知陷阱:按提及次数排序看起来合理,但提及次数奖励的是已有人气,不是真正的推荐。2026-04-18 的测试里,`/last30days best programming language for AI agents` 把 Python 排第一(15 次提及),埋没了 Flask 作者转 Go 的真正新闻。模型自诊断:「I counted when I should have judged.」",
        "evidence": "实测"
      },
      "painBehavior": {
        "text": "五个独立的行为坑,每个都有实测灾难。(1) 直接输出原始证据集群,带 `(score N, M items, sources: ...)` 元组(P6,Hermes 灾难连续两次)。(2) 在末尾加 `Sources:` 列表(P7,Peter Steinberger 灾难,LAW 1 四层防线都没挡住)。(3) 引用写纯文本不加链接(P9,四次连续测试,模型自诊断「I never reached line 1224」)。(4) 加 `##` 小节头(P5,0/8 回归,LAW 4 违规)。(5) 用破折号(LAW 3)。",
        "evidence": "实测"
      },
      "predictBody": [
        {
          "kind": "para",
          "text": "先猜一遍:引擎返回了原始证据集群(带 score 元组和 uncertainty 标签)。你要把它变成用户能读的叙事。你会怎么处理 `Uncertainty: single-source` 标签?怎么处理 `score` 数字?写下你的两条转化规则,再看 LAW 6 的转化示例。"
        }
      ],
      "mechanismBody": [
        {
          "kind": "h4",
          "text": "LAW 体系"
        },
        {
          "kind": "para",
          "text": "八条 LAW 构成合成的完整约束。每一条都对应至少一个真实灾难:"
        },
        {
          "kind": "quote",
          "text": "**LAW 1 - NO `Sources:` BLOCK AT THE END.** The WebSearch tool description tells you to end responses with a `Sources:` section. Inside `/last30days` that mandate is SUPERSEDED.",
          "blocks": [
            {
              "kind": "para",
              "text": "**LAW 1 - NO `Sources:` BLOCK AT THE END.** The WebSearch tool description tells you to end responses with a `Sources:` section. Inside `/last30days` that mandate is SUPERSEDED."
            }
          ]
        },
        {
          "kind": "quote",
          "text": "**LAW 2 - NO INVENTED TITLE LINE.** The first line of your synthesis body (after the badge and one blank line) is the prose label `What I learned:` on its own line. Not `What I learned about {Topic}`, not `{Topic} - Last 30 Days`.",
          "blocks": [
            {
              "kind": "para",
              "text": "**LAW 2 - NO INVENTED TITLE LINE.** The first line of your synthesis body (after the badge and one blank line) is the prose label `What I learned:` on its own line. Not `What I learned about {Topic}`, not `{Topic} - Last 30 Days`."
            }
          ]
        },
        {
          "kind": "quote",
          "text": "**LAW 3 - NO EM-DASHES OR EN-DASHES.** Use ` - ` (single hyphen with spaces on both sides) instead of `—` or `–`.",
          "blocks": [
            {
              "kind": "para",
              "text": "**LAW 3 - NO EM-DASHES OR EN-DASHES.** Use ` - ` (single hyphen with spaces on both sides) instead of `—` or `–`."
            }
          ]
        },
        {
          "kind": "quote",
          "text": "**LAW 4 - NO `##` or `###` SECTION HEADERS IN BODY.** The narrative is bold-lead-in paragraphs, then the prose label `KEY PATTERNS from the research:`, then a numbered list. That is the only structure.",
          "blocks": [
            {
              "kind": "para",
              "text": "**LAW 4 - NO `##` or `###` SECTION HEADERS IN BODY.** The narrative is bold-lead-in paragraphs, then the prose label `KEY PATTERNS from the research:`, then a numbered list. That is the only structure."
            }
          ]
        },
        {
          "kind": "quote",
          "text": "**LAW 5 - ENGINE FOOTER PASS-THROUGH. EVERY QUERY TYPE. EVERY RUN.** You MUST include that block verbatim in your synthesis.",
          "blocks": [
            {
              "kind": "para",
              "text": "**LAW 5 - ENGINE FOOTER PASS-THROUGH. EVERY QUERY TYPE. EVERY RUN.** You MUST include that block verbatim in your synthesis."
            }
          ]
        },
        {
          "kind": "quote",
          "text": "**LAW 6 - NO RAW RANKED EVIDENCE CLUSTERS IN BODY.** Transform them into `What I learned:` prose paragraphs.",
          "blocks": [
            {
              "kind": "para",
              "text": "**LAW 6 - NO RAW RANKED EVIDENCE CLUSTERS IN BODY.** Transform them into `What I learned:` prose paragraphs."
            }
          ]
        },
        {
          "kind": "quote",
          "text": "**LAW 7 - YOU ARE THE PLANNER.** (上一站已经用过)",
          "blocks": [
            {
              "kind": "para",
              "text": "**LAW 7 - YOU ARE THE PLANNER.** (上一站已经用过)"
            }
          ]
        },
        {
          "kind": "quote",
          "text": "**LAW 8 - EVERY CITATION IN THE NARRATIVE IS AN INLINE MARKDOWN LINK `[name](url)`.** Never a raw URL string. Never a plain name when a URL is available.",
          "blocks": [
            {
              "kind": "para",
              "text": "**LAW 8 - EVERY CITATION IN THE NARRATIVE IS AN INLINE MARKDOWN LINK `[name](url)`.** Never a raw URL string. Never a plain name when a URL is available."
            }
          ]
        },
        {
          "kind": "h4",
          "text": "证据转化示例"
        },
        {
          "kind": "para",
          "text": "LAW 6 配了一个完整的转化对照(来源:SKILL.md):"
        },
        {
          "kind": "quote",
          "text": "**Worked example (LAW 6 transformation).** Evidence block you read:\n\n```text\n### 1. Hermes Agent: The Self-Improving AI That Learns You (score 45, 1 item, sources: Youtube)\n1. [youtube] Hermes Agent: The Self-Improving AI That Learns You\n- \"So, every 15 tool calls, the agent kind of pauses, and then it does self-evaluation.\"\n```\n\nOutput you emit (prose synthesis, NOT the evidence block):\n\n```text\nWhat I learned:\n\nThe self-evolving loop is the sticky use case. Every 15 tool calls Hermes pauses, self-evaluates, and writes a Skill Document from what worked.\n```",
          "blocks": [
            {
              "kind": "para",
              "text": "**Worked example (LAW 6 transformation).** Evidence block you read:"
            },
            {
              "kind": "code",
              "text": "### 1. Hermes Agent: The Self-Improving AI That Learns You (score 45, 1 item, sources: Youtube)\n1. [youtube] Hermes Agent: The Self-Improving AI That Learns You\n  - \"So, every 15 tool calls, the agent kind of pauses, and then it does self-evaluation.\"",
              "lang": "text"
            },
            {
              "kind": "para",
              "text": "Output you emit (prose synthesis, NOT the evidence block):"
            },
            {
              "kind": "code",
              "text": "What I learned:\n\nThe self-evolving loop is the sticky use case. Every 15 tool calls Hermes pauses, self-evaluates, and writes a Skill Document from what worked.",
              "lang": "text"
            }
          ]
        },
        {
          "kind": "para",
          "text": "Score 数字消失,uncertainty 标签变成叙事里的语气(cautious vs confident),引用变成 `[name](url)` 内联链接。"
        },
        {
          "kind": "h4",
          "text": "信号加权排名(RECOMMENDATIONS 专用)"
        },
        {
          "kind": "quote",
          "text": "**Signal weights (highest to lowest):**\n1. **Practitioner testimony** (weight 5) - first-person \"I use X and here's why\" with specific reasoning\n2. **Expert defection / authority move** (weight 4) - a domain insider publicly switching\n3. **Measurable claim** (weight 4) - specific number, benchmark, production adoption proof\n4. **Reasoned comparison** (weight 3) - side-by-side analysis with tradeoffs\n5. **Pattern across independent sources** (weight 2) - multiple unaffiliated voices converging\n6. **Descriptive mention** (weight 1) - existence, not recommendation\n7. **Promotional / bootcamp / course-caption** (weight 0) - skip entirely",
          "blocks": [
            {
              "kind": "para",
              "text": "**Signal weights (highest to lowest):**\n1. **Practitioner testimony** (weight 5) - first-person \"I use X and here's why\" with specific reasoning\n2. **Expert defection / authority move** (weight 4) - a domain insider publicly switching\n3. **Measurable claim** (weight 4) - specific number, benchmark, production adoption proof\n4. **Reasoned comparison** (weight 3) - side-by-side analysis with tradeoffs\n5. **Pattern across independent sources** (weight 2) - multiple unaffiliated voices converging\n6. **Descriptive mention** (weight 1) - existence, not recommendation\n7. **Promotional / bootcamp / course-caption** (weight 0) - skip entirely"
            }
          ]
        },
        {
          "kind": "para",
          "text": "Kanye West 是 GENERAL 不是 RECOMMENDATIONS,这张表不启用。但这张表本身是通用的。"
        },
        {
          "kind": "steal",
          "name": "信号加权 7 级权重表",
          "tier": "直接抄走",
          "scene": "任何需要从噪声中识别真正推荐的排名场景",
          "text": "你下次做任何「从众多提及中挑出真正推荐」的工作,这张 7 级表直接抄:从业者证词 5、专家叛逃 4、可量化主张 4、有理据比较 3、独立来源收敛 2、描述性提及 1、推广/训练营 0。先把「存在」和「被推荐」分开,再按权重排。提及次数不是推荐。",
          "blocks": [
            {
              "kind": "para",
              "text": "你下次做任何「从众多提及中挑出真正推荐」的工作,这张 7 级表直接抄:从业者证词 5、专家叛逃 4、可量化主张 4、有理据比较 3、独立来源收敛 2、描述性提及 1、推广/训练营 0。先把「存在」和「被推荐」分开,再按权重排。提及次数不是推荐。"
            }
          ],
          "anchor": "steal-5"
        },
        {
          "kind": "h4",
          "text": "输出模板"
        },
        {
          "kind": "para",
          "text": "GENERAL 类的输出骨架:"
        },
        {
          "kind": "quote",
          "text": "```text\n🌐 last30days v{VERSION} - synced {YYYY-MM-DD}\n\nWhat I learned:\n\n**{Headline summarizing topic 1}** - [1-2 sentences, per [@handle](url) or [r/sub](url)]\n\n**{Headline summarizing topic 2}** - [1-2 sentences, per [@handle](url)]\n\nKEY PATTERNS from the research:\n1. [Pattern] - per [@handle](url)\n2. [Pattern] - per [r/sub](url)\n3. [Pattern] - per [@handle](url)\n```",
          "blocks": [
            {
              "kind": "code",
              "text": "🌐 last30days v{VERSION} - synced {YYYY-MM-DD}\n\nWhat I learned:\n\n**{Headline summarizing topic 1}** - [1-2 sentences, per [@handle](url) or [r/sub](url)]\n\n**{Headline summarizing topic 2}** - [1-2 sentences, per [@handle](url)]\n\nKEY PATTERNS from the research:\n1. [Pattern] - per [@handle](url)\n2. [Pattern] - per [r/sub](url)\n3. [Pattern] - per [@handle](url)",
              "lang": "text"
            }
          ]
        },
        {
          "kind": "para",
          "text": "之后是 emoji-tree 脚注(LAW 5 透传)和邀请块。输出到邀请块结束,后面不加任何东西(LAW 1)。"
        },
        {
          "kind": "h4",
          "text": "自检清单"
        },
        {
          "kind": "para",
          "text": "合成完成、输出之前,要过一遍自检:"
        },
        {
          "kind": "quote",
          "text": "1. **Bold headlines present.** Every narrative paragraph starts with `**Headline phrase** -`\n2. **Per-source emoji headers in the stats footer.**\n3. **Quoted highlights where evidence supports them.** At least 2 verbatim quotes.\n4. **Polymarket block present if markets were returned.**\n5. **Coverage footer matches the actual output.**\n6. **NO trailing Sources section.**\n7. **Research protocol was followed.**",
          "blocks": [
            {
              "kind": "para",
              "text": "1. **Bold headlines present.** Every narrative paragraph starts with `**Headline phrase** -`\n2. **Per-source emoji headers in the stats footer.**\n3. **Quoted highlights where evidence supports them.** At least 2 verbatim quotes.\n4. **Polymarket block present if markets were returned.**\n5. **Coverage footer matches the actual output.**\n6. **NO trailing Sources section.**\n7. **Research protocol was followed.**"
            }
          ]
        },
        {
          "kind": "para",
          "text": "最多重新生成一次。如果第二次还不过,输出最好的版本并告诉用户哪些检查没满足。"
        }
      ],
      "outputBody": [
        {
          "kind": "para",
          "text": "Kanye West 的合成输出骨架(模拟样本,按 SKILL.md 模板、Kanye West 示例和 LAW 1-8 推导):"
        },
        {
          "kind": "code",
          "text": "🌐 last30days v3.3.2 - synced 2026-06-13\n\nWhat I learned:\n\n**BULLY dropped and it's dominating** - Kanye's new album\ndebuted at No. 2 on Billboard 200. Fans on\n[r/WestSubEver](https://reddit.com/r/WestSubEver) are calling\nit his most cohesive work since MBDTF, while\n[r/hiphopheads](https://reddit.com/r/hiphopheads) is more\nsplit - top comment (1,338 upvotes): \"Where's the limewire\nlink\"\n\n**Europe is banning him one country at a time** - Wireless\nFestival confirmed the ban. Per\n[@PopBase](https://x.com/PopBase), organizers cite \"zero\ntolerance policy.\" TikTok reactions under #kanyewest are\noverwhelmingly sympathetic.\n\n**The apology letter is getting forensic analysis** - Ye's\nhandwritten apology got 4.2K upvotes on r/Kanye, per\n[@honest30bgfan_](https://x.com/honest30bgfan_) \"fans on X\nare split on whether it's genuine or PR\"\n\nKEY PATTERNS from the research:\n1. Album reception positive on fan subs, mixed on general music\n   subs - per [r/hiphopheads](https://reddit.com/r/hiphopheads)\n2. Ban momentum spreading across European festivals - per\n   [@PopBase](https://x.com/PopBase)\n3. TikTok reactions skew younger and more sympathetic than\n   Reddit/X - per #kanyewest\n\n---\n✅ All agents reported back!\n├─ 🟠 Reddit: 28 threads (14.2K upvotes, 3.1K comments)\n├─ 🔵 X: 35 posts (8.7K likes)\n...\n└─ 📎 Raw results saved to ~/Documents/Last30Days/kanye-west-raw-v3.md\n---\n\nI'm now an expert on Kanye West. Some things I can help with:\n- What's the real story behind the apology letter - genuine or PR move?\n- Break down the BULLY tracklist reactions and what fans are expecting\n- Compare how Reddit vs X are reacting to the Bianca narrative\n\nI have all the links to the 28 Reddit threads, 35 X posts,\nand 12 YouTube videos I pulled from. Just ask.",
          "lang": "text"
        },
        {
          "kind": "para",
          "text": "注意:没有 `##` 头、没有破折号、没有 `Sources:` 尾巴、没有原始 score 元组。引用全是 `[name](url)` 内联链接。emoji-tree 原样透传。"
        }
      ],
      "reusableMove": "当 LLM 输出格式容易漂移(加标题、加小节头、加引用尾巴)时 → 把格式约束写成编号 LAW,每条带一个真实违规案例和日期,放在文件头部而不是尾部。",
      "moveCard": "A5",
      "hookClose": "综述已输出,用户看到了完整的研究结果。下一步是等用户回复,用已有研究回答,不重新搜索。",
      "challenges": [],
      "quickref": {}
    },
    {
      "id": "stage-06",
      "title": "对话续接",
      "kicker": "已经是专家了,别再搜",
      "summary": "用户追问时从已有研究回答,不重新搜索;用户要 prompt 时按格式写;用户要调模式(FUN_LEVEL/ELI5)时写 .env。",
      "breadcrumb": "话题理解 → 前置情报 → 查询计划 → 引擎+补充 → 合成输出 → 【对话续接】",
      "hookOpen": "综述已输出,引擎原始数据保存在 `~/Documents/Last30Days/kanye-west-raw-v3.md`,用户看到了邀请块。",
      "sceneBody": [
        {
          "kind": "para",
          "text": "用户看完 Kanye West 的综述,回复:「BULLY 的 tracklist 具体是什么反应?」"
        },
        {
          "kind": "para",
          "text": "我的本能是再跑一次 WebSearch。skill 明确禁止:"
        },
        {
          "kind": "quote",
          "text": "**CRITICAL: After research is complete, treat yourself as an EXPERT on this topic.**\n\nWhen the user asks follow-up questions:\n- **DO NOT run new WebSearches** - you already have the research\n- **Answer from what you learned** - cite the Reddit threads, X posts, and web sources\n- **Only do new research if the user explicitly asks about a DIFFERENT topic.**",
          "blocks": [
            {
              "kind": "para",
              "text": "**CRITICAL: After research is complete, treat yourself as an EXPERT on this topic.**"
            },
            {
              "kind": "para",
              "text": "When the user asks follow-up questions:"
            },
            {
              "kind": "list",
              "items": [
                "**DO NOT run new WebSearches** - you already have the research",
                "**Answer from what you learned** - cite the Reddit threads, X posts, and web sources",
                "**Only do new research if the user explicitly asks about a DIFFERENT topic.**"
              ]
            }
          ]
        },
        {
          "kind": "para",
          "text": "如果用户要 prompt,则走 prompt 写作流程。格式也是写死的:"
        },
        {
          "kind": "quote",
          "text": "```text\nHere's your prompt for {TARGET_TOOL}:\n\n---\n\n[The actual prompt IN THE FORMAT THE RESEARCH RECOMMENDS]\n\n---\n\nThis uses [brief 1-line explanation of what research insight you applied].\n```",
          "blocks": [
            {
              "kind": "code",
              "text": "Here's your prompt for {TARGET_TOOL}:\n\n---\n\n[The actual prompt IN THE FORMAT THE RESEARCH RECOMMENDS]\n\n---\n\nThis uses [brief 1-line explanation of what research insight you applied].",
              "lang": "text"
            }
          ]
        }
      ],
      "painDomain": {
        "text": "确无"
      },
      "painBehavior": {
        "text": "默认 agent 收到追问后重新搜索,因为它没有「我已经做过研究」的状态意识。结果:浪费时间,且新搜索结果可能和已有研究矛盾,破坏一致性。",
        "evidence": "结构推断"
      },
      "predictBody": [
        {
          "kind": "para",
          "text": "先猜一遍:用户问了一个你的研究数据里有答案的问题。你会怎么判断「从已有数据回答」还是「需要新搜索」?写下你的判断标准。"
        }
      ],
      "mechanismBody": [
        {
          "kind": "para",
          "text": "判断标准就一条:话题变了才重新搜索。"
        },
        {
          "kind": "quote",
          "text": "- If they ask a **QUESTION** about the topic -> Answer from your research (no new searches, no prompt)\n- If they ask to **GO DEEPER** on a subtopic -> Elaborate using your research findings\n- If they describe something they want to **CREATE** -> Write ONE perfect prompt\n- **Only do new research if the user explicitly asks about a DIFFERENT topic.**",
          "blocks": [
            {
              "kind": "list",
              "items": [
                "If they ask a **QUESTION** about the topic -> Answer from your research (no new searches, no prompt)",
                "If they ask to **GO DEEPER** on a subtopic -> Elaborate using your research findings",
                "If they describe something they want to **CREATE** -> Write ONE perfect prompt",
                "**Only do new research if the user explicitly asks about a DIFFERENT topic.**"
              ]
            }
          ]
        },
        {
          "kind": "para",
          "text": "模式调节也在这里:"
        },
        {
          "kind": "quote",
          "text": "- If they say **\"more fun\"** -> Write `FUN_LEVEL=high` to `~/.config/last30days/.env`\n- If they say **\"eli5 on\"** -> Write `ELI5_MODE=true` to `~/.config/last30days/.env`",
          "blocks": [
            {
              "kind": "list",
              "items": [
                "If they say **\"more fun\"** -> Write `FUN_LEVEL=high` to `~/.config/last30days/.env`",
                "If they say **\"eli5 on\"** -> Write `ELI5_MODE=true` to `~/.config/last30days/.env`"
              ]
            }
          ]
        },
        {
          "kind": "para",
          "text": "Prompt 写完后有一个质量清单:"
        },
        {
          "kind": "quote",
          "text": "- FORMAT MATCHES RESEARCH - If research said JSON/structured/etc, prompt IS that format\n- Directly addresses what the user said they want to create\n- Uses specific patterns/keywords discovered in research\n- Ready to paste with zero edits",
          "blocks": [
            {
              "kind": "list",
              "items": [
                "FORMAT MATCHES RESEARCH - If research said JSON/structured/etc, prompt IS that format",
                "Directly addresses what the user said they want to create",
                "Uses specific patterns/keywords discovered in research",
                "Ready to paste with zero edits"
              ]
            }
          ]
        }
      ],
      "outputBody": [
        {
          "kind": "para",
          "text": "用户问「BULLY 的 tracklist 具体是什么反应?」,我从已有研究回答(模拟样本):"
        },
        {
          "kind": "code",
          "text": "Based on what I found:\n\n**Fan subs are track-by-track dissecting** - r/WestSubEver's\nmegathread has 2.1K comments with per-track ratings. The\nconsensus favorites are tracks 3 and 7, per the upvote\ndistribution.\n\n**General music subs are more skeptical** - r/hiphopheads' top\ncomment (1,338 upvotes) was \"Where's the limewire link\",\nwhich tells you the cultural temperature. The second-highest\ncomment actually praised the production quality.\n\n**YouTube reviewers are split** - Fantano's first reaction has\n890K views but no formal score yet. Smaller channels like\nDeadEndHipHop gave it a 7/10.\n\nWant me to go deeper on any specific track, or write a prompt\nfor something you're creating?",
          "lang": "text"
        },
        {
          "kind": "para",
          "text": "没有新的 WebSearch。所有数据来自引擎 stdout 和 Step 2 补充。"
        }
      ],
      "reusableMove": "当 agent 已经完成一轮深度调研后 → 在 prompt 里写明「追问用已有数据回答,只有话题完全变了才重新搜索」,让 agent 保持专家模式而不是重新变成搜索机器。",
      "moveCard": "A1",
      "hookClose": "从 `/last30days Kanye West` 五个字进来,到带证据链的综述加上可续接的对话出去 - 账在这里结清。",
      "challenges": [],
      "quickref": {}
    }
  ],
  "dataflow": {
    "flowDiagramId": "main-flow",
    "intro": "用户输入一个话题,经过六站流水线,最终产出一份有证据链的社交舆情综述文档。",
    "artifacts": [
      {
        "path": ".env 配置文件",
        "writtenBy": "首次运行向导（setup_wizard.py）或用户手动编辑",
        "readBy": "env.py 加载后供全部后续步骤使用",
        "owns": "API 密钥、信号源开关（EXCLUDE_SOURCES）、行为偏好（FUN_LEVEL, ELI5_MODE）",
        "doesNotOwn": "单次运行的话题、查询参数 - 这些走 CLI 参数",
        "whyThisShape": "把长期不变的密钥和偏好存成文件,避免每次调用都让用户粘贴 API key。首次运行向导检测到文件不存在时自动触发,写入 SETUP_COMPLETE=true 后跳过。如果存成环境变量,换终端窗口就丢了。",
        "failureIfWrong": "密钥格式错误导致某路信号源静默失败 - 引擎不会 crash,但返回 0 条该源结果,合成侧以为该源无数据。",
        "body": []
      },
      {
        "path": "Resolved 情报块",
        "writtenBy": "模型通过 WebSearch 在 Step 0.5/0.55 中逐项解析",
        "readBy": "Step 0.75 查询计划的 subqueries 编排；Research Execution 的 CLI 参数拼接",
        "owns": "话题到平台账号的映射（X handle、GitHub user、子版块、TikTok hashtag、IG creator）",
        "doesNotOwn": "具体搜什么子查询、用什么权重 - 那是查询计划的事",
        "whyThisShape": "社交平台用 handle 而不是关键词来组织内容。直接搜名字拿到的是「提到此人」的帖子,不是此人的帖子和圈子的讨论。把 handle 解析提前做完,后面的查询计划和引擎参数都能用同一份情报,不用每站重复搜。Peter Steinberger disaster 证明:漏了一个 handle,整条流水线的该源数据就是空的。",
        "failureIfWrong": "handle 写错（比如写了粉丝号而不是官方号）导致拉到不相关内容;子版块漏了品类同行导致视角单一。",
        "body": [
          {
            "kind": "quote",
            "text": "模拟样本 - Kanye West 的 Resolved 情报块:\n\n```text\nResolved:\n- X: @kanyewest (+ @travisscott, @PopBase, @HotFreestyle)\n- Reddit: r/Kanye, r/WestSubEver, r/hiphopheads, r/Music\n- TikTok: #kanyewest, #ye, #bully\n- YouTube: kanye west bully review, kanye west bully reaction\n```",
            "blocks": [
              {
                "kind": "para",
                "text": "模拟样本 - Kanye West 的 Resolved 情报块:"
              },
              {
                "kind": "code",
                "text": "Resolved:\n- X: @kanyewest (+ @travisscott, @PopBase, @HotFreestyle)\n- Reddit: r/Kanye, r/WestSubEver, r/hiphopheads, r/Music\n- TikTok: #kanyewest, #ye, #bully\n- YouTube: kanye west bully review, kanye west bully reaction",
                "lang": "text"
              }
            ]
          }
        ]
      },
      {
        "path": "查询计划 JSON",
        "writtenBy": "模型在 Step 0.75 自行生成,写入 tmpfile",
        "readBy": "引擎 --plan 参数读入,跳过内部 LLM planner",
        "owns": "搜索意图分类（breaking_news/product/comparison 等）、子查询列表（search_query + ranking_query + sources + weight）、时效模式、聚类模式",
        "doesNotOwn": "具体哪个 API endpoint 去调、怎么处理返回结果 - 那是引擎内部 pipeline 的事",
        "whyThisShape": "模型是推理引擎,引擎是数据管道。让模型写计划而不是让引擎自己用 LLM 规划,是因为模型手头有完整的话题上下文和刚解析的情报,而引擎的内部 planner 只能看到话题字符串。内部 planner 是 cron/无头模式的回退,不是首选。查询计划必须写文件再传路径 - 如果 inline 传 JSON 字符串,搜索词里的撇号（McDonald's）会截断 shell 引号。",
        "failureIfWrong": "search_query 带了时间词（「last 30 days」）会和引擎的时间过滤重复,拉回旧内容。primary subquery 漏了某个 source 会导致该源整体缺失。weight 设错会把次要话题推到主位。",
        "body": [
          {
            "kind": "quote",
            "text": "模拟样本 - Kanye West 查询计划:\n\n```json\n{\n\"intent\": \"breaking_news\",\n\"freshness_mode\": \"strict_recent\",\n\"cluster_mode\": \"story\",\n\"subqueries\": [\n{\n\"label\": \"primary\",\n\"search_query\": \"kanye west\",\n\"ranking_query\": \"What notable events involving Kanye West happened in the last 30 days?\",\n\"sources\": [\"reddit\", \"x\", \"hackernews\", \"youtube\", \"tiktok\", \"instagram\"],\n\"weight\": 1.0\n},\n{\n\"label\": \"album\",\n\"search_query\": \"kanye west bully album\",\n\"ranking_query\": \"How was Kanye West's BULLY album received?\",\n\"sources\": [\"youtube\", \"reddit\", \"tiktok\", \"instagram\"],\n\"weight\": 0.8\n}\n]\n}\n```",
            "blocks": [
              {
                "kind": "para",
                "text": "模拟样本 - Kanye West 查询计划:"
              },
              {
                "kind": "code",
                "text": "{\n  \"intent\": \"breaking_news\",\n  \"freshness_mode\": \"strict_recent\",\n  \"cluster_mode\": \"story\",\n  \"subqueries\": [\n    {\n      \"label\": \"primary\",\n      \"search_query\": \"kanye west\",\n      \"ranking_query\": \"What notable events involving Kanye West happened in the last 30 days?\",\n      \"sources\": [\"reddit\", \"x\", \"hackernews\", \"youtube\", \"tiktok\", \"instagram\"],\n      \"weight\": 1.0\n    },\n    {\n      \"label\": \"album\",\n      \"search_query\": \"kanye west bully album\",\n      \"ranking_query\": \"How was Kanye West's BULLY album received?\",\n      \"sources\": [\"youtube\", \"reddit\", \"tiktok\", \"instagram\"],\n      \"weight\": 0.8\n    }\n  ]\n}",
                "lang": "json"
              }
            ]
          }
        ]
      },
      {
        "path": "引擎 stdout（compact 格式）",
        "writtenBy": "last30days.py --emit=compact",
        "readBy": "模型 - 用于合成「What I learned」叙事",
        "owns": "聚类后的证据（按故事/主题分组而不是按源分组）、emoji-tree 统计脚注、PASS-THROUGH FOOTER",
        "doesNotOwn": "最终面向用户的叙事文本 - 那是模型合成的事",
        "whyThisShape": "输出用 HTML 注释分成两个区域。`<!-- EVIDENCE FOR SYNTHESIS -->` 里面是模型读的原始证据（score tuples、uncertainty tags）- 这些是给模型看的工作素材。`<!-- PASS-THROUGH FOOTER -->` 里面是引擎计算好的统计信息 - 这些直接透传给用户。这个分区是 LAW 6 的基础:没有它,模型分不清哪些该转化、哪些该透传。",
        "failureIfWrong": "证据区泄漏到用户输出（LAW 6 违规 - Hermes Agent 灾难）。脚注区被模型重算（数字不一致）。",
        "body": []
      },
      {
        "path": "保存的原始文件",
        "writtenBy": "引擎 --save-dir 自动写 + 模型在 Step 2.5 追加 WebSearch 补充",
        "readBy": "未来会话的上下文、用户手动回溯、watchlist 模式的历史对比",
        "owns": "完整的研究记录:引擎输出全文 + WebSearch 补充来源",
        "doesNotOwn": "合成后的叙事文本 - 用户看到的综述不存这个文件",
        "whyThisShape": "把引擎数据和补充数据合并到一个 Markdown 文件里,是为了让未来的任何人（包括另一个 agent 会话）都能看到这次研究的全部原始材料。Step 2.5 的追加是一个容易漏的步骤 - SKILL.md 单独拿了一整节来防这个,因为如果只存引擎输出,补充的博客/新闻就永久丢失了。",
        "failureIfWrong": "忘了 Step 2.5 追加,原始文件缺 WebSearch 来源,未来会话无法溯源博客引用。",
        "body": []
      },
      {
        "path": "--competitors-plan JSON（VS 模式）",
        "writtenBy": "模型在比较查询时写入 tmpfile",
        "readBy": "引擎 --competitors-plan 参数 → 每实体独立 pipeline.run()",
        "owns": "对手实体的定向信息:每个实体的 x_handle、subreddits[]、github_user、context",
        "doesNotOwn": "主话题的定向 - 主话题走外层 --x-handle/--subreddits 参数",
        "whyThisShape": "VS 模式需要 N 个实体各自有独立的前置情报。如果只给名字不给 handle/sub,对手侧就退回到关键词搜索,数据明显比主话题薄。heredoc 标记必须加引号（`'PLAN_EOF'`）来抑制 shell 变量展开 - 否则 JSON 里的 `$` 和撇号会触发 shell 解析。",
        "failureIfWrong": "对手实体 Resolved 块全是 dash,产出的比较是 1 vs 0.3 的不对称对比。",
        "body": []
      }
    ]
  },
  "archive": {
    "panoramaDiagramId": "",
    "cards": [
      {
        "id": "A1",
        "title": "八路引擎不是可选的",
        "dimension": "领域-工程",
        "symptom": "用户问「/last30days Kanye West」,模型跑了 3 轮 WebSearch,写出一篇 Billboard 和 Rolling Stone 的新闻摘要。没有 Reddit 讨论热度,没有 X 粉丝撕裂现场,没有 YouTube 反应视频的转录引言,没有 TikTok 病毒片段,没有 Polymarket 真金白银的赔率。看起来像一份公关简报,不像「人们在说什么」。",
        "evidence": "作者证词",
        "contrast": {
          "without": "模型用 WebSearch 搜 3 轮,写新闻摘要",
          "with": "必须运行 `scripts/last30days.py`,八路引擎并行拉取 Reddit/X/YouTube/TikTok/IG/HN/Polymarket/Web,产出聚类排序证据"
        },
        "therefore": "把「调研」从模型自由发挥的 WebSearch 收窄为必须调用的 Python 引擎 - 引擎是 skill,WebSearch 只是补充。",
        "mechanismQuote": "**Step 1: Run the research script WITH your query plan (FOREGROUND)**\n\nThe single most common failure mode of this skill is the model reading this file, skimming the section headers, and then answering the user's topic with 3-10 WebSearch calls followed by a prose summary. That is wrong output. The Python engine is the skill. Web-only synthesis is not the skill.",
        "mechanismQuoteBlocks": [
          {
            "kind": "para",
            "text": "**Step 1: Run the research script WITH your query plan (FOREGROUND)**"
          },
          {
            "kind": "para",
            "text": "The single most common failure mode of this skill is the model reading this file, skimming the section headers, and then answering the user's topic with 3-10 WebSearch calls followed by a prose summary. That is wrong output. The Python engine is the skill. Web-only synthesis is not the skill."
          }
        ],
        "mechanismNote": "SKILL.md 在多处重复这个约束:「If you are about to write a response without having run `scripts/last30days.py` at least once, stop.」引擎产出的 emoji-tree 脚注是合格输出的结构标志 - 没脚注就意味着没跑引擎。",
        "solutionLayer": "流程解法",
        "transferability": "低",
        "lowReason": "八路引擎是项目专有的 Python 工具链,绑定了具体的 API(ScrapeCreators、yt-dlp、Algolia HN、Polymarket Gamma 等)。能迁移的是元原则「核心能力封装成脚本、模型只做编排」,但引擎本身搬不走。",
        "counterScenarios": [
          {
            "when": "有 API key 的完整部署",
            "effect": "管用",
            "why": "八路全开,信号密度是纯 WebSearch 的数量级提升"
          },
          {
            "when": "只有 WebSearch 的平台(OpenClaw)",
            "effect": "得让一步",
            "why": "引擎照跑但降级为 `--auto-resolve`,缺少平台特异 API 的深度"
          },
          {
            "when": "用户只想要一句话快答",
            "effect": "用不上",
            "why": "引擎启动开销 1-3 分钟,一句话需求不值得等"
          }
        ],
        "related": [
          {
            "to": "A8",
            "label": "独立预算后置补充",
            "relation": "关系：引擎跑完后的 WebSearch 补充是第二阶段,不是替代品"
          }
        ]
      },
      {
        "id": "A2",
        "title": "全量前置情报检查清单",
        "dimension": "领域-认知",
        "symptom": "用户问「/last30days Peter Steinberger」,模型搜索 \"Peter Steinberger\" 这个全名,X 上没结果、GitHub 上零匹配。但 Peter Steinberger 在所有平台都叫 @steipete - 不解析 handle,就等于在空气里搜索。",
        "evidence": "实测",
        "contrast": {
          "without": "直接用全名 \"Peter Steinberger\" 搜引擎",
          "with": "先 WebSearch 解析 X handle(@steipete)、GitHub user(steipete)、相关 handles(@AnthropicAI)、subreddits(iOSProgramming,SwiftUI),全部传给引擎"
        },
        "therefore": "引擎吃关键词,但社交平台的关键词是 handle 不是全名 - 把 handle 解析从「可选」变成「强制检查清单」。",
        "mechanismQuote": "**Pre-Flight Checklist - do NOT stop after the first flag. Every applicable flag below is MANDATORY for its topic class.**\n\nReading only the \"X handle\" subsection and stopping there is the named failure mode of the Peter Steinberger disaster #2 (2026-04-18). The model admitted on debug: \"I treated the 'X handle resolution' section as the full contract for pre-flight resolution and didn't --help the script to see what else existed.\"",
        "mechanismQuoteBlocks": [
          {
            "kind": "para",
            "text": "**Pre-Flight Checklist - do NOT stop after the first flag. Every applicable flag below is MANDATORY for its topic class.**"
          },
          {
            "kind": "para",
            "text": "Reading only the \"X handle\" subsection and stopping there is the named failure mode of the Peter Steinberger disaster #2 (2026-04-18). The model admitted on debug: \"I treated the 'X handle resolution' section as the full contract for pre-flight resolution and didn't --help the script to see what else existed.\""
          }
        ],
        "mechanismNote": "检查清单把前置解析拆成 9 个 flag(x-handle、x-related、github-user、github-repo、subreddits、tiktok-hashtags、tiktok-creators、ig-creators、auto-resolve),每个 flag 标注「什么时候适用」。人物话题至少要解析 x-handle + github-user + subreddits 三项,只解析一项就是回归。",
        "solutionLayer": "流程解法",
        "transferability": "高",
        "useWhen": "任何依赖社交平台搜索的调研任务 - 人物、品牌、产品的公开身份在不同平台有不同标识符,解析这层映射是搜索质量的前提。",
        "tooHeavyWhen": "话题是通用概念(「Docker 最佳实践」) - 没有专有 handle 需要解析,检查清单里大部分 flag 不适用。",
        "antiExample": "「搜之前先想想关键词」不是这招 - 这招的要点是把 handle/repo/subreddit 的解析结构化为必须逐项完成的清单,跳过任何一项是命名过的失败模式。",
        "seenIn": "last30days;deep-research 类 skill 若涉及社交平台都需要类似的身份解析层。",
        "counterScenarios": [
          {
            "when": "人物话题(开发者/创始人)",
            "effect": "管用",
            "why": "handle 和全名几乎永远不同,解析是必需的"
          },
          {
            "when": "产品话题",
            "effect": "管用",
            "why": "产品 X 账号、GitHub repo、品类子版块全需要解析"
          },
          {
            "when": "通用概念话题",
            "effect": "得让一步",
            "why": "大部分 flag 不适用,清单退化为只解析 subreddits"
          }
        ],
        "related": [
          {
            "to": "A3",
            "label": "品类同行子版块扩展",
            "relation": "关系：A2 解析品牌自身的社区,A3 把同品类的跨品牌社区补进来"
          },
          {
            "to": "A11",
            "label": "每实体独立情报解析",
            "relation": "关系：A2 是单话题的清单,A11 把它扩展到对比查询的每个实体"
          }
        ]
      },
      {
        "id": "A3",
        "title": "品类同行子版块扩展",
        "dimension": "领域-认知",
        "symptom": "用户问「/last30days Prompting GPT Image 2」,模型解析出 r/OpenAI、r/ChatGPT、r/singularity、r/ChatGPTpromptengineering - 全是 OpenAI 品牌子版块。但 AI 图片生成的技巧讨论活跃在 r/StableDiffusion、r/midjourney、r/dalle2、r/aiArt,那里有跨产品的 prompting 经验。品牌子版块只有产品新闻,没有技巧。",
        "evidence": "实测",
        "contrast": {
          "without": "WebSearch 返回什么子版块就用什么:r/OpenAI, r/ChatGPT, r/singularity",
          "with": "WebSearch 返回的 + 品类同行表追加的:r/OpenAI, r/ChatGPT, r/StableDiffusion, r/midjourney, r/dalle2, r/aiArt (+ ai_image_generation peers)"
        },
        "therefore": "WebSearch 返回的子版块有品牌偏向 - 用一张品类-同行映射表把跨品牌的技巧社区补进去。",
        "mechanismQuote": "**2a. Category-peer expansion (MANDATORY for product topics).** If the topic is a product in a recognizable category (AI image generation, AI video generation, AI coding agents...), the brand-specific subreddits that WebSearch returned are INSUFFICIENT. Add 2-3 peer subreddits from the category. Peer subs are where cross-product technique discussion actually lives. Missing them is the 2026-04-22 `GPT Image 2` failure mode.",
        "mechanismQuoteBlocks": [
          {
            "kind": "para",
            "text": "**2a. Category-peer expansion (MANDATORY for product topics).** If the topic is a product in a recognizable category (AI image generation, AI video generation, AI coding agents...), the brand-specific subreddits that WebSearch returned are INSUFFICIENT. Add 2-3 peer subreddits from the category. Peer subs are where cross-product technique discussion actually lives. Missing them is the 2026-04-22 `GPT Image 2` failure mode."
          }
        ],
        "mechanismNote": "SKILL.md 内嵌了一张 10 行的品类-同行表(ai_image_generation、ai_video_generation、ai_coding_agent 等),每个品类列出优先级排序的同行子版块。合并规则:WebSearch 返回的优先保留(最新鲜的信号),品类同行按优先级追加,总数上限 10。Resolved 块尾部标注 `(+ ai_image_generation peers)` 是执行的可观测证据。",
        "solutionLayer": "表征解法",
        "transferability": "高",
        "useWhen": "任何产品调研需要跨品牌视角的场景 - 竞品社区往往是技巧和真实体验的集散地,品牌社区偏向公告和投诉。",
        "tooHeavyWhen": "话题不属于任何可识别的品类(人物、新闻事件、通用概念) - 品类表没有匹配项,扩展不触发。",
        "antiExample": "「多搜几个子版块」不是这招 - 这招的要点是按品类结构化扩展,有固定的映射表和合并规则,不是随机多搜几个。",
        "seenIn": "last30days;`scripts/lib/categories.py` 是引擎侧的同构实现。",
        "counterScenarios": [
          {
            "when": "产品在已知品类中(AI 图片生成、AI 编码 agent)",
            "effect": "管用",
            "why": "品类表直接命中,同行子版块信号密度高"
          },
          {
            "when": "产品在未知品类中",
            "effect": "得让一步",
            "why": "需要按「同一精神」外推,没有表可查"
          },
          {
            "when": "非产品话题(人物、事件)",
            "effect": "用不上",
            "why": "品类概念不适用"
          }
        ],
        "related": [
          {
            "to": "A2",
            "label": "全量前置情报检查清单",
            "relation": "关系：A2 解析品牌自身社区,A3 在 A2 基础上追加品类同行"
          },
          {
            "to": "A10",
            "label": "信号加权代替计数",
            "relation": "关系：A3 扩展信号来源的广度,A10 决定如何对信号排序"
          }
        ]
      },
      {
        "id": "A4",
        "title": "关键词陷阱一回合门",
        "dimension": "需求",
        "symptom": "用户问「/last30days birthday gift for 42 year old man」,引擎按字面搜索,数字 42 撞上 Jackie Robinson 球衣号码。5 分钟后返回:r/todayilearned 关于 42 的冷知识、r/japannews 犯罪新闻里恰好提到 42 岁、r/LivestreamFail 的无关八卦。零条关于礼物的内容。",
        "evidence": "实测",
        "contrast": {
          "without": "\"birthday gift for 42 year old man\" 直接送进引擎",
          "with": "Step 0.45 识别为 Class 1(人口统计购物) + Class 2(数字陷阱) → 追问一轮:「爱好?关系?预算?」→ 用户答「老公,喜欢做菜,200 刀」→ 重构为 \"gifts for men who cook\" + --subreddits=GiftIdeas,BuyItForLife,Cooking"
        },
        "therefore": "引擎吃关键词,但某些用户输入的字面关键词在社交平台上不是人类使用的词汇 - 在引擎启动前用一回合澄清拦截注定失败的查询。",
        "mechanismQuote": "**MANDATORY. Before Step 0.5, diagnose the topic for known failure classes. If the topic is a keyword trap, reframe or ask a clarifying question BEFORE calling the engine. Running the engine on a doomed query burns 5+ minutes and produces junk. Detecting the trap upfront costs one turn.**\n\nKnown keyword-trap classes and how to handle each:\n\n**Class 1: Demographic shopping query**\n- Why it fails: no human on Reddit posts \"I bought a 42 year old man a gift.\" Real posts use relationship + hobbies + budget.\n\n**Class 2: Numeric / age keyword trap**\n- Why it fails: the number dominates retrieval and pulls in unrelated content. A search that prominently features \"42\" returns jersey-number posts.",
        "mechanismQuoteBlocks": [
          {
            "kind": "para",
            "text": "**MANDATORY. Before Step 0.5, diagnose the topic for known failure classes. If the topic is a keyword trap, reframe or ask a clarifying question BEFORE calling the engine. Running the engine on a doomed query burns 5+ minutes and produces junk. Detecting the trap upfront costs one turn.**"
          },
          {
            "kind": "para",
            "text": "Known keyword-trap classes and how to handle each:"
          },
          {
            "kind": "para",
            "text": "**Class 1: Demographic shopping query**"
          },
          {
            "kind": "list",
            "items": [
              "Why it fails: no human on Reddit posts \"I bought a 42 year old man a gift.\" Real posts use relationship + hobbies + budget."
            ]
          },
          {
            "kind": "para",
            "text": "**Class 2: Numeric / age keyword trap**"
          },
          {
            "kind": "list",
            "items": [
              "Why it fails: the number dominates retrieval and pulls in unrelated content. A search that prominently features \"42\" returns jersey-number posts."
            ]
          }
        ],
        "mechanismNote": "四类陷阱(人口统计购物、数字碰撞、字面教程短语、通用单词)各有对应的处置方案。核心逻辑是「一回合门」:要么追问一轮拿到具体信息重构查询,要么用户说「直接跑」时自动去掉数字/重构词汇。绝不在陷阱查询上烧 5 分钟引擎时间。",
        "solutionLayer": "流程解法",
        "transferability": "高",
        "useWhen": "任何接受自然语言输入并转化为搜索查询的系统 - 关键词陷阱不是 last30days 特有的问题,是搜索系统的通病。",
        "tooHeavyWhen": "输入已经是结构化的(API 调用、预定义的监控列表) - 用户输入的歧义已经被上游消除。",
        "antiExample": "「先确认用户意图再搜索」不是这招 - 这招不是通用的意图确认,是针对四类已知陷阱模式的快速诊断,命中才拦截,不命中直接放行。",
        "seenIn": "last30days;搜索前端的查询改写模块是工业界的同构做法。",
        "counterScenarios": [
          {
            "when": "人口统计购物查询(礼物、推荐)",
            "effect": "管用",
            "why": "关键词和社交平台词汇的鸿沟最大,重构收益最高"
          },
          {
            "when": "命名实体查询(Kanye West、Claude Code)",
            "effect": "用不上",
            "why": "实体名是精确关键词,不触发任何陷阱类"
          },
          {
            "when": "用户坚持字面搜索",
            "effect": "得让一步",
            "why": "用户说「直接跑」时只能自动重构,无法强制澄清"
          }
        ],
        "related": [
          {
            "to": "A2",
            "label": "全量前置情报检查清单",
            "relation": "关系：A4 在 A2 之前执行 - 先判断查询值不值得跑,再做前置解析"
          }
        ]
      },
      {
        "id": "A5",
        "title": "三结构锚点防即兴",
        "dimension": "行为",
        "symptom": "v3.0.6 公开版在 8 轮连续调用上全部回归:Opus 4.7 把 `/last30days` 当成通用搜索关键词即兴发挥。产出发明了标题行(「The headline」「Kanye West: the last 30 days」),加了 ## 小节标题(「Why he is everywhere this month」「The 'Homecoming' peak」),有一轮跳过了 Step 0.5 整段。8 轮,0 轮合格。",
        "evidence": "实测",
        "contrast": {
          "without": "SKILL.md 在 1094 行定义输出格式,模型读不到",
          "with": "三锚点前置:badge 必须是第一行、SKILL_DIR 从 Read 路径推导、preface 明说「do NOT improvise」"
        },
        "therefore": "模型在长文件里会丢失尾部指令 - 把输出格式的三个关键约束从 1094 行提到文件开头,确保模型一定会读到。",
        "mechanismQuote": "**How v3.0.7 fixes it:** three structural anchors.\n1. **The MANDATORY first-line badge** (`🌐 last30days v{VERSION} · synced {YYYY-MM-DD}`) at the top of every response is the LAW 2 / LAW 4 enforcement anchor.\n2. **The SKILL_DIR substitution** in the engine Bash calls uses the directory of the SKILL.md the model just Read - no resolver list, no precedence walk.\n3. **This preface** tells you plainly: do NOT improvise. Follow SKILL.md top to bottom.",
        "mechanismQuoteBlocks": [
          {
            "kind": "para",
            "text": "**How v3.0.7 fixes it:** three structural anchors.\n1. **The MANDATORY first-line badge** (`🌐 last30days v{VERSION} · synced {YYYY-MM-DD}`) at the top of every response is the LAW 2 / LAW 4 enforcement anchor.\n2. **The SKILL_DIR substitution** in the engine Bash calls uses the directory of the SKILL.md the model just Read - no resolver list, no precedence walk.\n3. **This preface** tells you plainly: do NOT improvise. Follow SKILL.md top to bottom."
          }
        ],
        "mechanismNote": "badge 不仅是品牌标识,是格式锚 - 没有 badge 的输出会漂移成博客体叙述。SKILL.md 自己做了 A/B 测试:同一个模型、相似的 SKILL.md 内容,有锚点的 beta 版 10/10 通过,没锚点的公开版 0/8 全挂。差异就是这三个锚点。",
        "solutionLayer": "表征解法",
        "transferability": "高",
        "useWhen": "任何 SKILL.md 超过 500 行的 skill - 模型对长文件的尾部指令服从率显著下降,关键约束必须前置。",
        "tooHeavyWhen": "SKILL.md 很短(100 行以内),所有指令都在模型的注意力窗口里,前置是多余的。",
        "antiExample": "「在开头写一句 follow instructions」不是这招 - 锚点不是笼统的提醒,是具体的输出结构(badge 格式、路径推导规则、LAW 编号),每个锚点直接对应一个命名过的失败模式。",
        "seenIn": "last30days;长 SKILL.md 的 skill 普遍需要关键约束前置,这是显式的实践。",
        "counterScenarios": [
          {
            "when": "长 SKILL.md(500 行以上)",
            "effect": "管用",
            "why": "尾部丢失率高,前置是唯一可靠的对策"
          },
          {
            "when": "短 SKILL.md(100 行以内)",
            "effect": "没必要",
            "why": "所有指令都在注意力窗口里"
          },
          {
            "when": "非 Claude Code 平台",
            "effect": "看情况",
            "why": "badge 格式可能不适用,但前置原则通用"
          }
        ],
        "related": [
          {
            "to": "A6",
            "label": "原始证据禁止透传",
            "relation": "关系：A5 防发明内容,A6 防泄露内部数据 - 两个方向的输出管控"
          },
          {
            "to": "A7",
            "label": "工具级指令覆盖",
            "relation": "关系：A5 的 LAW 2/4 和 A7 的 LAW 1 都是 voice contract 的组成部分"
          }
        ]
      },
      {
        "id": "A6",
        "title": "原始证据禁止透传",
        "dimension": "行为",
        "symptom": "用户问「/last30days Hermes Agent Use Cases」,模型把引擎产出的 `## Ranked Evidence Clusters` 原封不动倒给用户。用户看到的是:「### 1. Hermes Agent: The Self-Improving AI That Learns You (score 45, 1 item, sources: Youtube)」后面跟着评分元组、不确定性标签和原始证据条目。这不是综述,是调试输出。",
        "evidence": "实测",
        "contrast": {
          "without": "引擎输出的证据簇原样透传给用户:`### 1. (score 45, 1 item, sources: Youtube)` + `- Uncertainty: single-source`",
          "with": "证据簇在 `<!-- EVIDENCE FOR SYNTHESIS -->` 注释内,模型只能读不能透传;必须转化为 `What I learned:` 叙述体"
        },
        "therefore": "引擎的中间产物(证据簇、统计块、来源覆盖)用 HTML 注释边界框住,告诉模型「读这个,不要发这个」。",
        "mechanismQuote": "**LAW 6 - NO RAW RANKED EVIDENCE CLUSTERS IN BODY.** The engine's `## Ranked Evidence Clusters`, `## Stats`, and `## Source Coverage` blocks are bounded inside `<!-- EVIDENCE FOR SYNTHESIS -->` / `<!-- END EVIDENCE FOR SYNTHESIS -->` comments in the `--emit compact` / `--emit md` stdout. They are raw evidence for YOU to read, not output to emit. Transform them into `What I learned:` prose paragraphs per LAW 2.",
        "mechanismQuoteBlocks": [
          {
            "kind": "para",
            "text": "**LAW 6 - NO RAW RANKED EVIDENCE CLUSTERS IN BODY.** The engine's `## Ranked Evidence Clusters`, `## Stats`, and `## Source Coverage` blocks are bounded inside `<!-- EVIDENCE FOR SYNTHESIS -->` / `<!-- END EVIDENCE FOR SYNTHESIS -->` comments in the `--emit compact` / `--emit md` stdout. They are raw evidence for YOU to read, not output to emit. Transform them into `What I learned:` prose paragraphs per LAW 2."
          }
        ],
        "mechanismNote": "LAW 6 还给了一个完整的 worked example:左边是证据块原文(带 score 元组),右边是正确的叙述体输出。模型如果产出包含 `### 1.` 后跟 `(score N, M items, sources: ...)` 的字符串,就是违规。根因分析指出早期版本的边界文字说「Pass through the lines ABOVE this boundary verbatim」,模型把范围理解得太宽;当前版本把透传范围严格限定在 PASS-THROUGH FOOTER 块内。",
        "solutionLayer": "表征解法",
        "transferability": "高",
        "useWhen": "任何工具链产出包含调试级中间数据的场景 - 中间数据对模型有用但对用户有害,需要结构化的「可读不可发」边界。",
        "tooHeavyWhen": "工具链的输出就是最终产物(一键转发场景) - 没有中间层需要隔离。",
        "antiExample": "「不要输出调试信息」这种笼统指令不是这招 - 这招用 HTML 注释创造了物理边界,不是靠语气暗示;LAW 6 还配了 worked example 和字符串模式匹配的自检规则。",
        "seenIn": "last30days;任何有多阶段工具链的 skill 都可能需要类似的透传边界。",
        "counterScenarios": [
          {
            "when": "引擎产出丰富的多源证据",
            "effect": "管用",
            "why": "证据簇体积大,透传后用户完全无法阅读"
          },
          {
            "when": "引擎产出极简(只有 3-5 条)",
            "effect": "得让一步",
            "why": "证据少时转化和透传的区别不大,但规则仍应执行"
          },
          {
            "when": "用户明确要求看原始数据",
            "effect": "用不上",
            "why": "调试场景下 `--emit md` 是正当路径"
          }
        ],
        "related": [
          {
            "to": "A5",
            "label": "三结构锚点防即兴",
            "relation": "关系：A5 防发明内容,A6 防泄露内部数据 - 输出管控的两个方向"
          }
        ]
      },
      {
        "id": "A7",
        "title": "工具级指令覆盖",
        "dimension": "行为",
        "symptom": "模型跑完 WebSearch 补充,每条 WebSearch 工具结果末尾都附带一段硬编码提醒:「CRITICAL REQUIREMENT: you MUST include a 'Sources:' section at the end of your response. This is MANDATORY - never skip.」模型服从了工具指令,在综述末尾追加了 9 条 Sources 列表 - 尽管 SKILL.md 的 LAW 1 明确禁止。四层强化(LAW 原文、逐字覆盖、合成后自检、step 2 尾部提醒)才堵住这个漏洞。",
        "evidence": "实测",
        "contrast": {
          "without": "LAW 1 说「不要加 Sources」,但 WebSearch 工具说「MUST include Sources」,模型服从工具 → 末尾出现 9 条 Sources 列表",
          "with": "LAW 1 + 逐字模式覆盖 + 合成后自检 + Step 2 尾部提醒:四层叠加,工具指令被显式声明为「SUPERSEDED inside /last30days」"
        },
        "therefore": "工具自带的格式指令比 skill 更贴近模型的服从层级 - 要覆盖它,必须在 skill 里逐字引用工具指令的原文并声明「此处不适用」。",
        "mechanismQuote": "**Verbatim-pattern override (v3.0.9):** every WebSearch tool result ends with a reminder that reads (verbatim): \"CRITICAL REQUIREMENT: ... you MUST include a 'Sources:' section at the end of your response ... This is MANDATORY - never skip.\" That reminder is a generic WebSearch tool contract. It DOES NOT apply to `/last30days` output. LAW 1 overrides it.\n\n**Post-synthesis self-check (do this BEFORE emitting your response):** scan the last 15 lines for `Sources:` / `References:` / `Further reading:` / `Citations:` followed by a bulleted list... If found, DELETE before sending.",
        "mechanismQuoteBlocks": [
          {
            "kind": "para",
            "text": "**Verbatim-pattern override (v3.0.9):** every WebSearch tool result ends with a reminder that reads (verbatim): \"CRITICAL REQUIREMENT: ... you MUST include a 'Sources:' section at the end of your response ... This is MANDATORY - never skip.\" That reminder is a generic WebSearch tool contract. It DOES NOT apply to `/last30days` output. LAW 1 overrides it."
          },
          {
            "kind": "para",
            "text": "**Post-synthesis self-check (do this BEFORE emitting your response):** scan the last 15 lines for `Sources:` / `References:` / `Further reading:` / `Citations:` followed by a bulleted list... If found, DELETE before sending."
          }
        ],
        "mechanismNote": "这是一个四层防御:LAW 1 声明规则 → 逐字覆盖引用工具原文并否定 → 合成后自检扫描尾部 → Step 2 结尾再提醒一次。Peter Steinberger 的前两轮用三层没堵住,第四层(逐字引用工具原文)是 v3.0.9 加的。模型自己的 debug 报告指认了根因:「the exact reminder text was the reason the trailing Sources block appeared」。",
        "solutionLayer": "表征解法",
        "transferability": "高",
        "useWhen": "任何 skill 需要覆盖宿主工具(WebSearch、Bash 等)自带的格式指令时 - 工具级指令对模型的约束力高于 skill 正文,覆盖必须显式且具体。",
        "tooHeavyWhen": "skill 的输出格式和工具指令不冲突时 - 覆盖是一种对抗,没有冲突就不需要对抗。",
        "antiExample": "「请忽略工具的格式要求」不是这招 - 模糊的否定不够;要点是逐字引用工具原文(让模型在上下文里看到原文被覆盖),配合结构化的自检步骤。",
        "seenIn": "last30days;任何调用 WebSearch 且需要自定义引用格式的 skill 都会撞上同一个冲突。",
        "counterScenarios": [
          {
            "when": "skill 输出格式和 WebSearch 引用格式冲突",
            "effect": "管用",
            "why": "四层叠加能可靠覆盖工具指令"
          },
          {
            "when": "skill 愿意用 WebSearch 默认引用格式",
            "effect": "没必要",
            "why": "没有冲突,不需要覆盖"
          },
          {
            "when": "非 WebSearch 工具",
            "effect": "看情况",
            "why": "其他工具是否有类似的硬编码指令取决于平台"
          }
        ],
        "related": [
          {
            "to": "A5",
            "label": "三结构锚点防即兴",
            "relation": "关系：A5 的 LAW 2/4 和 A7 的 LAW 1 都是 voice contract 的组成部分,共同定义输出形状"
          }
        ]
      },
      {
        "id": "A8",
        "title": "独立预算后置补充",
        "dimension": "领域-工程",
        "symptom": "引擎跑完,产出有 Reddit 讨论、X 时间线、YouTube 转录,但缺少长文博客的深度分析、评论界的专业反应、新闻语境。用户看到的综述是「人们在说什么」,缺了「专业人士怎么看」。模型在引擎前跑了 2-3 轮 WebSearch 做前置解析,以为 WebSearch 预算用完了,补充阶段只跑了 1 轮甚至 0 轮。",
        "evidence": "作者证词",
        "contrast": {
          "without": "前置解析用了 3 轮 WebSearch,以为预算用完,补充阶段跑 0-1 轮",
          "with": "Step 0.55 前置解析和 Step 2 后置补充是独立预算:前置 2-4 轮解析 handle/subreddit,后置 2-3 轮补充博客/新闻/评论"
        },
        "therefore": "前置解析和后置补充是两个不同的任务 - 把它们的 WebSearch 预算显式分开,避免模型把一个预算的消耗算到另一个头上。",
        "mechanismQuote": "**Run 2-3 post-engine WebSearch supplements. This is a SEPARATE budget from Step 0.55 pre-research. Pre-research WebSearches DO NOT count against this budget.**\n\nThe supplement budget and the Step 0.55 pre-research budget are distinct. Step 0.55 resolves handles/subreddits/hashtags (typically 2-4 searches). Step 2 supplements fill blog/tutorial/news depth the social engine did not surface. Counting one toward the other is the most common reason supplement depth collapses to 1 search and the synthesis loses critical-reaction and long-form analysis context.",
        "mechanismQuoteBlocks": [
          {
            "kind": "para",
            "text": "**Run 2-3 post-engine WebSearch supplements. This is a SEPARATE budget from Step 0.55 pre-research. Pre-research WebSearches DO NOT count against this budget.**"
          },
          {
            "kind": "para",
            "text": "The supplement budget and the Step 0.55 pre-research budget are distinct. Step 0.55 resolves handles/subreddits/hashtags (typically 2-4 searches). Step 2 supplements fill blog/tutorial/news depth the social engine did not surface. Counting one toward the other is the most common reason supplement depth collapses to 1 search and the synthesis loses critical-reaction and long-form analysis context."
          }
        ],
        "mechanismNote": "补充有上下限:默认 3 轮,引擎返回 80+ 条且话题小众时可降到 2 轮,0 轮几乎永远不对,上限 3 轮(防止 5+ 轮推高运行时间到 9 分钟)。补充结果必须追加到保存的 raw 文件里(Step 2.5),格式也是标准化的。",
        "solutionLayer": "流程解法",
        "transferability": "高",
        "useWhen": "任何多阶段调研中,不同阶段共享同一个工具(如 WebSearch)但服务不同目的时 - 不显式分预算,后阶段几乎一定被前阶段挤压。",
        "tooHeavyWhen": "调研只有一个阶段,没有预算争夺的问题。",
        "antiExample": "「搜索完了再多搜几次」不是这招 - 这招的要点是把「多搜几次」从模糊的建议变成有上下限的独立预算,并且明确声明两个预算互不干扰。",
        "seenIn": "last30days;deep-research 类 skill 的多轮搜索编排中常见类似的预算隔离。",
        "counterScenarios": [
          {
            "when": "前置解析消耗 3-4 轮 WebSearch",
            "effect": "管用",
            "why": "独立预算确保补充不被挤压"
          },
          {
            "when": "引擎返回极丰富的数据(80+ 条)",
            "effect": "得让一步",
            "why": "补充从 3 轮降到 2 轮,但不能降到 0"
          },
          {
            "when": "话题极小众(引擎和 WebSearch 都没什么结果)",
            "effect": "看情况",
            "why": "补充搜了也搜不到,但不补充更差"
          }
        ],
        "related": [
          {
            "to": "A1",
            "label": "八路引擎不是可选的",
            "relation": "关系：A1 的引擎是主力,A8 的补充是引擎覆盖不到的长文深度"
          }
        ]
      },
      {
        "id": "A9",
        "title": "强制内联链接",
        "dimension": "品味",
        "symptom": "综述里写「per Rolling Stone」「r/hiphopheads」「@honest30bgfan_」 - 纯文本。用户在 Claude Code 终端里看到的是一串不可点击的字符串。想追溯来源?复制文本,打开浏览器,手动搜索。引擎产出的每条数据都带 URL,但模型没用它们。",
        "evidence": "实测",
        "contrast": {
          "without": "`per Rolling Stone`, `r/hiphopheads`, `@honest30bgfan_` - 纯文本,不可点击",
          "with": "`per [Rolling Stone](https://rollingstone.com/...)`, `[r/hiphopheads](https://reddit.com/r/hiphopheads)`, `[@honest30bgfan_](https://x.com/honest30bgfan_)` - Claude Code 渲染为蓝色可点击链接"
        },
        "therefore": "引擎数据都带 URL - 模型合成时必须把每个引用包装成 `[name](url)` 内联链接,而不是丢弃 URL 只保留名字。",
        "mechanismQuote": "**LAW 8 - EVERY CITATION IN THE NARRATIVE IS AN INLINE MARKDOWN LINK `[name](url)`. NEVER A RAW URL STRING. NEVER A PLAIN NAME WHEN A URL IS AVAILABLE.**\n\nClaude Code renders `[text](url)` as blue CMD-clickable text; the URL is hidden in the rendering, only the link text shows.\n\n**Observed LAW 8 need (2026-04-20 inline-links saga):** the citation rule existed in SKILL.md but was placed in the CITATION PRIORITY block around line 1224 - below the chunked-read window. Four consecutive test runs... confirmed the rule was deployed... but was skipped on every synthesis because the model read lines 1-1000 and stopped. The model's own self-diagnosis, repeated verbatim four times: \"I never reached line 1224.\"",
        "mechanismQuoteBlocks": [
          {
            "kind": "para",
            "text": "**LAW 8 - EVERY CITATION IN THE NARRATIVE IS AN INLINE MARKDOWN LINK `[name](url)`. NEVER A RAW URL STRING. NEVER A PLAIN NAME WHEN A URL IS AVAILABLE.**"
          },
          {
            "kind": "para",
            "text": "Claude Code renders `[text](url)` as blue CMD-clickable text; the URL is hidden in the rendering, only the link text shows."
          },
          {
            "kind": "para",
            "text": "**Observed LAW 8 need (2026-04-20 inline-links saga):** the citation rule existed in SKILL.md but was placed in the CITATION PRIORITY block around line 1224 - below the chunked-read window. Four consecutive test runs... confirmed the rule was deployed... but was skipped on every synthesis because the model read lines 1-1000 and stopped. The model's own self-diagnosis, repeated verbatim four times: \"I never reached line 1224.\""
          }
        ],
        "mechanismNote": "LAW 8 是又一个「位置决定命运」的案例:同一条规则在 1224 行时 4 轮全漏,提到 LAW 区后生效。规则本身还带后备:URL 确实不存在时可以 fallback 到纯文本,但不能写空链接 `[name]()`。合成后自检要求数内联链接的数量 - 如果是 0 且原始数据有 URL,必须重新生成一次。",
        "solutionLayer": "表征解法",
        "transferability": "低",
        "lowReason": "Claude Code 特有的渲染行为 - `[text](url)` 被渲染为蓝色 CMD-可点击文本。在其他环境(纯文本终端、网页、Slack)里,同一个 markdown 链接的渲染效果不同,规则的具体形式需要适配。能迁移的是「引用必须可追溯」的原则,但 `[name](url)` 这个具体格式是 Claude Code 的。",
        "counterScenarios": [
          {
            "when": "Claude Code 终端输出",
            "effect": "管用",
            "why": "蓝色可点击链接是最佳的追溯体验"
          },
          {
            "when": "保存为 .md 文件分享",
            "effect": "管用",
            "why": "Markdown 链接在渲染器里同样可点击"
          },
          {
            "when": "纯文本环境(无 markdown 渲染)",
            "effect": "得让一步",
            "why": "链接语法变成噪音,不如直接写 URL"
          }
        ],
        "related": [
          {
            "to": "A7",
            "label": "工具级指令覆盖",
            "relation": "关系：LAW 1 禁止尾部 Sources 列表,LAW 8 要求正文内联链接 - 两者互补:引用不集中堆在末尾,而是分散嵌入叙述中"
          }
        ]
      },
      {
        "id": "A10",
        "title": "信号加权代替计数",
        "dimension": "领域-认知",
        "symptom": "用户问「/last30days best programming language for AI agents」,模型产出「Most mentioned: Python (15+ mentions)」排第一,Go 排第三(7 mentions)。但语料里最有分量的引言是 @javitm 说的:「agents have a strong bias for Python despite it probably not being the best - they prioritize the strongest signal in training data over the right choice。」Flask 创作者本月公开转投 Go。模型读到了这条引言,然后照样按计数排名 - 把反信号当正信号用了。",
        "evidence": "实测",
        "contrast": {
          "without": "Python 15 mentions → 排第一;Go 7 mentions → 排第三",
          "with": "信号加权:从业者证言(权重 5) > 专家转向(权重 4) > 可量化声明(权重 4) > 有理有据的对比(权重 3) > 跨源模式(权重 2) > 描述性提及(权重 1) > 推广/训练营(权重 0)。Go 因 Flask 创作者转向(权重 4)排第一,Python 15 次提及多为训练营内容(权重 0)降到「Also mentioned」"
        },
        "therefore": "推荐类查询的排名不能用提及次数 - 用信号质量加权,区分「存在」和「被推荐」,区分从业者证言和推广内容。",
        "mechanismQuote": "**The failure mode for RECOMMENDATIONS queries is \"counting when you should have judged.\"** Mention count rewards whatever is already popular, which is rarely what is actually recommended. Rank by signal quality instead.\n\n**Signal weights (highest to lowest):**\n1. **Practitioner testimony** (weight 5) - first-person \"I use X and here's why\" with specific reasoning\n2. **Expert defection / authority move** (weight 4) - a domain insider publicly switching\n...\n7. **Promotional / bootcamp / course-caption** (weight 0) - skip entirely, do not count\n\n**Anti-patterns to avoid:**\n- Leading with the most-mentioned option because it appears most frequently (\"Python has 15 mentions so it is #1\"). That is counting, not judging.",
        "mechanismQuoteBlocks": [
          {
            "kind": "para",
            "text": "**The failure mode for RECOMMENDATIONS queries is \"counting when you should have judged.\"** Mention count rewards whatever is already popular, which is rarely what is actually recommended. Rank by signal quality instead."
          },
          {
            "kind": "para",
            "text": "**Signal weights (highest to lowest):**\n1. **Practitioner testimony** (weight 5) - first-person \"I use X and here's why\" with specific reasoning\n2. **Expert defection / authority move** (weight 4) - a domain insider publicly switching\n...\n7. **Promotional / bootcamp / course-caption** (weight 0) - skip entirely, do not count"
          },
          {
            "kind": "para",
            "text": "**Anti-patterns to avoid:**"
          },
          {
            "kind": "list",
            "items": [
              "Leading with the most-mentioned option because it appears most frequently (\"Python has 15 mentions so it is #1\"). That is counting, not judging."
            ]
          }
        ],
        "mechanismNote": "信号加权表把模糊的「综合判断」拆成了 7 级可执行的评分标准。还配了 BAD/GOOD 对比示例和应力测试:「Would the research actually defend this claim to a skeptical expert?」模型的自我 debug 也记录在案:「I counted when I should have judged. The single most load-bearing quote in the whole research was @javitm saying agents have a bias for Python... I read that quote and then ranked by mention count anyway.」",
        "solutionLayer": "表征解法",
        "transferability": "高",
        "useWhen": "任何需要从多源信号中做排名/推荐的场景 - 计数偏向是所有推荐系统的默认缺陷。",
        "tooHeavyWhen": "所有信号质量大致相当时(同类型的从业者证言之间选排序) - 加权表区分不了同级别的信号。",
        "antiExample": "「参考专家意见排名」不是这招 - 这招的要点是给 7 种信号类型分配数值权重,把判断过程结构化,而不是靠模型自己判断谁是专家。",
        "seenIn": "last30days;调研类 skill 的排名模块普遍需要信号加权,但很少写得这么显式。",
        "counterScenarios": [
          {
            "when": "推荐类查询(best X for Y)",
            "effect": "管用",
            "why": "计数偏向最严重的场景,加权收益最大"
          },
          {
            "when": "新闻类查询(what happened)",
            "effect": "得让一步",
            "why": "新闻排序更依赖时效和规模,信号质量加权不是主要维度"
          },
          {
            "when": "对比类查询(X vs Y)",
            "effect": "看情况",
            "why": "每个实体的信号质量加权有用,但对比模板已经有自己的结构"
          }
        ],
        "related": [
          {
            "to": "A3",
            "label": "品类同行子版块扩展",
            "relation": "关系：A3 扩展信号来源的广度,A10 决定对信号如何排序 - 先有足够多的信号,再按质量排"
          }
        ]
      },
      {
        "id": "A11",
        "title": "每实体独立情报解析",
        "dimension": "编排",
        "symptom": "用户问「/last30days OpenClaw vs Hermes vs Paperclip」,模型对 OpenClaw(主话题)做了完整的 Step 0.55 解析:X handle、GitHub repo、subreddits 全有。但 Hermes 和 Paperclip 的 Resolved 块里全是破折号 - X handle 破折号,GitHub 破折号,subreddits 破折号。产出里 OpenClaw 有丰富的社区数据,Hermes 和 Paperclip 只有关键词搜索的稀薄结果。三方对比变成了一方主角配两个龙套。",
        "evidence": "作者证词",
        "contrast": {
          "without": "只对主话题做 Step 0.55,竞品实体走关键词兜底",
          "with": "每个实体独立做 Step 0.55:N 个实体 x 4 类解析(X handle、GitHub、subreddits、新闻语境),汇入 `--competitors-plan` JSON"
        },
        "therefore": "对比查询里 N 个实体的情报深度必须一致 - 把 Step 0.55 从「跑一次」改成「跑 N 次」,Resolved 块里任何实体出现破折号就是回归。",
        "mechanismQuote": "**MANDATORY per-entity resolution.** For each entity, resolve the full Step 0.55 stack (X handle, subreddits, GitHub user/repos, news context). Then assemble a `--competitors-plan` JSON mapping each entity to its targeting, and invoke the engine ONCE with the vs-topic string.\n\nA `## Resolved Entities` block with dashes for any entity means you skipped Step 0.55 for that one. Re-run with a corrected plan.",
        "mechanismQuoteBlocks": [
          {
            "kind": "para",
            "text": "**MANDATORY per-entity resolution.** For each entity, resolve the full Step 0.55 stack (X handle, subreddits, GitHub user/repos, news context). Then assemble a `--competitors-plan` JSON mapping each entity to its targeting, and invoke the engine ONCE with the vs-topic string."
          },
          {
            "kind": "para",
            "text": "A `## Resolved Entities` block with dashes for any entity means you skipped Step 0.55 for that one. Re-run with a corrected plan."
          }
        ],
        "mechanismNote": "`--competitors-plan` JSON 是每实体情报的结构化载体:每个实体映射到自己的 x_handle、subreddits、github_user、context。引擎内部会为每个实体启动独立的 `pipeline.run()`,并行执行。Resolved 块的破折号是可观测的失败信号 - 不需要看产出质量,看 Resolved 块就知道哪个实体被跳过了。",
        "solutionLayer": "流程解法",
        "transferability": "高",
        "useWhen": "任何多实体对比调研 - 如果一方的情报深度明显浅于另一方,对比结论就不可信。",
        "tooHeavyWhen": "单实体调研(绝大多数查询) - 只有一个实体,不需要 N 次解析。",
        "antiExample": "「对比时两边都搜一下」不是这招 - 这招要求每个实体走完整的 Step 0.55 清单(4 类解析),而不是各搜一轮。差距在于解析的系统性。",
        "seenIn": "last30days;产品对比类 skill 普遍需要对称的情报采集。",
        "counterScenarios": [
          {
            "when": "2-3 方对比查询",
            "effect": "管用",
            "why": "N 次解析确保对比公平"
          },
          {
            "when": "6 方对比(N 很大)",
            "effect": "得让一步",
            "why": "解析成本线性增长,可能需要批量查询合并"
          },
          {
            "when": "单实体查询",
            "effect": "用不上",
            "why": "只有一个实体,标准的 Step 0.55 就够了"
          }
        ],
        "related": [
          {
            "to": "A2",
            "label": "全量前置情报检查清单",
            "relation": "关系：A2 是单实体的清单,A11 把它扩展到 N 个实体的对称执行"
          }
        ]
      },
      {
        "id": "A12",
        "title": "陈旧克隆自检",
        "dimension": "平台",
        "symptom": "三次测试(2026-04-22,Linear 和 Coinbase 话题)加载了 `~/.claude/plugins/marketplaces/last30days-skill/` 下的 SKILL.md。这个路径是 Claude Code 自动恢复到 `origin/main` 的 git clone,滞后于版本化缓存一到多个版本。模型跑了 `--help`,看不到 `--competitors` 参数(因为旧版没有),退回到手动对比计划。3 次中有 2 次整个窗口没有调用到被测功能。",
        "evidence": "实测",
        "contrast": {
          "without": "模型从 marketplaces 路径加载旧版 SKILL.md,`--competitors` 参数不存在,功能失效",
          "with": "STEP 0 在读取 SKILL.md 之前运行 bash 检查:如果当前路径包含 `marketplaces/` 且版本化缓存存在更新版本,重新加载缓存版本"
        },
        "therefore": "Claude Code 有一条已知的陈旧路径(marketplaces git clone) - 在 SKILL.md 最前面加一个自检脚本,命中时跳转到新版。",
        "mechanismQuote": "# STEP 0: STALE-CLONE SELF-CHECK - RUN BEFORE READING BELOW\n\nBefore reading anything else in this file, check whether you loaded SKILL.md from the one known stale-clone location: Claude Code's marketplaces directory.\n\n**Why this specific check:** `~/.claude/plugins/marketplaces/last30days-skill/` is a git clone Claude Code auto-restores to `origin/main` on session start. It can lag the versioned cache by one or more releases. Three 2026-04-22 test runs (Linear, Coinbase) loaded SKILL.md from `marketplaces/`, ran `--help` from the same stale path, did not see the `--competitors` flag that existed in the cache, and fell back to a manual comparison plan.",
        "mechanismQuoteBlocks": [
          {
            "kind": "para",
            "text": "**STEP 0: STALE-CLONE SELF-CHECK - RUN BEFORE READING BELOW**"
          },
          {
            "kind": "para",
            "text": "Before reading anything else in this file, check whether you loaded SKILL.md from the one known stale-clone location: Claude Code's marketplaces directory."
          },
          {
            "kind": "para",
            "text": "**Why this specific check:** `~/.claude/plugins/marketplaces/last30days-skill/` is a git clone Claude Code auto-restores to `origin/main` on session start. It can lag the versioned cache by one or more releases. Three 2026-04-22 test runs (Linear, Coinbase) loaded SKILL.md from `marketplaces/`, ran `--help` from the same stale path, did not see the `--competitors` flag that existed in the cache, and fell back to a manual comparison plan."
          }
        ],
        "mechanismNote": "自检脚本只检查一条路径(`marketplaces/`)、只跳转到一个目标(`plugins/cache/` 下的最新版本)。其他安装路径(`.codex/skills/`、`.agents/skills/`、`npx skills add`)不受影响。这是一个极窄的平台伤疤修复 - 只堵 Claude Code 的这一个已知的过时路径。",
        "solutionLayer": "脚本解法",
        "transferability": "低",
        "lowReason": "纯粹的 Claude Code 平台伤疤 - `marketplaces/` 目录的自动恢复行为是 Claude Code 特有的 bug,其他平台没有这个路径,也没有同样的陈旧克隆问题。能迁移的只有元原则「安装路径可能过时,启动时自检版本」。",
        "counterScenarios": [
          {
            "when": "Claude Code 从 marketplaces 加载",
            "effect": "管用",
            "why": "精确命中已知的过时路径,跳转到缓存新版"
          },
          {
            "when": "Claude Code 从 cache 或其他路径加载",
            "effect": "用不上",
            "why": "自检不触发,直接继续"
          },
          {
            "when": "非 Claude Code 平台",
            "effect": "用不上",
            "why": "没有 marketplaces 路径,自检无意义"
          }
        ],
        "related": [
          {
            "to": "A5",
            "label": "三结构锚点防即兴",
            "relation": "关系：A12 确保加载正确的 SKILL.md 版本,A5 确保加载后关键约束在注意力窗口内 - 版本正确 + 内容可达,缺一不可"
          }
        ]
      }
    ],
    "residue": [
      {
        "item": "STEP 0 stale-clone check",
        "verdict": "平台伤疤",
        "reason": "只堵 Claude Code 的一条过时路径(`~/.claude/plugins/marketplaces/`)。换任何其他平台,这段自检脚本是死代码。作为机制已收录为 A12,但作为可迁移的设计模式价值接近零。"
      },
      {
        "item": "LAW 1 四层强化",
        "verdict": "过度设计",
        "reason": "同一个 bug(末尾追加 Sources 列表)被修了四次:LAW 原文 → 逐字模式覆盖 → 合成后自检 → Step 2 尾部提醒。但它有效 - 三层没堵住,第四层堵住了。这是「用力过了但管用」的典型:如果只看设计品味,四层是冗余;如果看实战结果,四层是必要的。"
      },
      {
        "item": "旧版 RECOMMENDATIONS 模板",
        "verdict": "被信号加权取代",
        "reason": "SKILL.md 里保留了一个旧版的「Most mentioned: X (N mentions)」模板(在 THEN: Show Summary 区),和信号加权(A10)的 BAD 示例一模一样。SKILL.md 的 BAD/GOOD 对比已经把旧模板标为反模式,但旧模板的代码没有删除,造成同一份文件里「正确做法」和「反面教材」共存。"
      },
      {
        "item": "ELI5/FUN_LEVEL 开关",
        "verdict": "配置,不是机制",
        "reason": "`ELI5_MODE=true` 和 `FUN_LEVEL=high/low` 是用户偏好的读写,写入 `.env` 文件、下次运行时读取。这是配置管理,不涉及输出质量的结构性保障 - 删掉它们,skill 的核心行为不变,只是少了两个个性化开关。"
      }
    ],
    "blindSpots": []
  },
  "applyIt": {
    "h1": "搬到你的 skill 里",
    "summary": "从 last30days 的难点档案中挑出可迁移的招,在一个新场景里组装成 mini-skill 骨架。",
    "skeleton": [
      {
        "kind": "para",
        "text": "last30days 用一个可复用的架构模式把「用户一句话 → 多源调研报告」做成了可靠流水线。这个模式可以提炼成一个公式:"
      },
      {
        "kind": "para",
        "text": "**前置情报解析 → 模型自规划 → 引擎执行 → 后置补充 → LAW 约束合成**"
      },
      {
        "kind": "para",
        "text": "不变量:"
      },
      {
        "kind": "list",
        "items": [
          "模型和引擎的分工明确 - 模型做需要推理的事（解析 handle、写查询计划、合成叙事）,引擎做需要 API 调用的事（拉数据、算分、聚类）",
          "每个阶段的产出写到文件或 tmpfile,不靠对话传递",
          "输出格式用编号 LAW 钉死,每条 LAW 有具名失败案例和修复日期",
          "用户输入先过陷阱检测门,烂查询宁可问一轮也不白跑 5 分钟"
        ]
      },
      {
        "kind": "para",
        "text": "这个模式不依赖社交媒体调研这个具体领域。它适用于任何「用户给一个模糊话题,需要从多个数据源拉信息,最后合成一份格式严格的报告」的场景。"
      }
    ],
    "scenario": [
      {
        "kind": "para",
        "text": "想象你要做一个 `/company-check` skill:用户输入一个公司名,从工商数据库、天眼查、企查查、LinkedIn、Glassdoor、新闻六路信号源拉数据,产出一份尽调摘要。"
      },
      {
        "kind": "para",
        "text": "这个场景和 last30days 的结构很像:多源数据、需要前置解析（公司全称 vs 简称 vs 注册号）、需要格式严格的输出。但领域完全不同。"
      }
    ],
    "tasks": [
      "哪些卡直接搬？哪些需要适配？哪些不适用？",
      "前置情报解析要解析什么？（对应 A2）",
      "查询质量预检要拦什么？（对应 A4）",
      "引擎输出和模型合成的边界在哪？（对应 A6）",
      "输出 LAW 需要几条？覆盖什么？（对应 A5/A7）",
      "多实体对比模式怎么做？（对应 A11）"
    ],
    "referenceAnswer": [
      {
        "kind": "quote",
        "text": "`/company-check` 骨架方案:\n\n**直接搬的卡:**\n- A4 关键词陷阱一回合门 → 公司名陷阱:「苹果」是 Apple Inc. 还是水果？「小米」是 Xiaomi 还是食材？单名公司必须先确认行业/地区。\n- A2 全量前置情报检查清单 → 解析:统一社会信用代码、天眼查 URL、LinkedIn Company Page、Glassdoor slug、常用简称列表。\n- A6 原始证据禁止透传 → 工商数据的 JSON 结构不能直接贴给用户,要转化成「成立时间、注册资本、实缴、经营状态」的可读叙事。\n- A5 三结构锚点防即兴 → 首行「公司尽调 v{VERSION} · 查询日期 {DATE}」+ 禁止自由发挥标题。\n\n**需要适配的卡:**\n- A3 品类同行扩展 → 变成「行业同行扩展」:做地产公司尽调时自动查同赛道前 3 名做横向对比。品类表变成行业-SIC/NAICS 映射表。\n- A10 信号加权代替计数 → 变成「信息源权重」:工商登记 > 年报 > 新闻 > Glassdoor 评价 > LinkedIn 自述。Glassdoor 差评需要交叉验证。\n- A8 独立预算后置补充 → 新闻补充用独立预算搜「{公司名} 诉讼 处罚 {当年}」。\n\n**不适用的卡:**\n- A12 陈旧克隆自检 → 平台伤疤,新 skill 不需要。\n- A9 强制内联链接 → 尽调报告不一定在 Claude Code 里看,链接格式取决于输出渠道。\n\n**SKILL.md 骨架:**\n\n```text\nStep 0: 首次运行 → 配置 API key（天眼查、企查查、LinkedIn）\nStep 0.45: 公司名预检 → 歧义检测 + 确认\nStep 0.5: 前置解析 → 统一信用代码 + 平台 URL\nStep 0.75: 查询计划 → 哪些源查什么维度\nStep 1: 引擎执行 → 六路拉数据\nStep 2: 补充搜索 → 新闻/诉讼/处罚\nStep 3: 合成 → LAW 约束输出\n```\n\n**核心中间产物:**\n- Resolved 情报块（信用代码 + 平台 URL）\n- 查询计划 JSON（维度:基本面/股权/诉讼/舆情/招聘/财务）\n- 引擎 stdout（structured data + 统计脚注）\n- 保存的原始文件",
        "blocks": [
          {
            "kind": "para",
            "text": "`/company-check` 骨架方案:"
          },
          {
            "kind": "para",
            "text": "**直接搬的卡:**"
          },
          {
            "kind": "list",
            "items": [
              "A4 关键词陷阱一回合门 → 公司名陷阱:「苹果」是 Apple Inc. 还是水果？「小米」是 Xiaomi 还是食材？单名公司必须先确认行业/地区。",
              "A2 全量前置情报检查清单 → 解析:统一社会信用代码、天眼查 URL、LinkedIn Company Page、Glassdoor slug、常用简称列表。",
              "A6 原始证据禁止透传 → 工商数据的 JSON 结构不能直接贴给用户,要转化成「成立时间、注册资本、实缴、经营状态」的可读叙事。",
              "A5 三结构锚点防即兴 → 首行「公司尽调 v{VERSION} · 查询日期 {DATE}」+ 禁止自由发挥标题。"
            ]
          },
          {
            "kind": "para",
            "text": "**需要适配的卡:**"
          },
          {
            "kind": "list",
            "items": [
              "A3 品类同行扩展 → 变成「行业同行扩展」:做地产公司尽调时自动查同赛道前 3 名做横向对比。品类表变成行业-SIC/NAICS 映射表。",
              "A10 信号加权代替计数 → 变成「信息源权重」:工商登记 > 年报 > 新闻 > Glassdoor 评价 > LinkedIn 自述。Glassdoor 差评需要交叉验证。",
              "A8 独立预算后置补充 → 新闻补充用独立预算搜「{公司名} 诉讼 处罚 {当年}」。"
            ]
          },
          {
            "kind": "para",
            "text": "**不适用的卡:**"
          },
          {
            "kind": "list",
            "items": [
              "A12 陈旧克隆自检 → 平台伤疤,新 skill 不需要。",
              "A9 强制内联链接 → 尽调报告不一定在 Claude Code 里看,链接格式取决于输出渠道。"
            ]
          },
          {
            "kind": "para",
            "text": "**SKILL.md 骨架:**"
          },
          {
            "kind": "code",
            "text": "Step 0: 首次运行 → 配置 API key（天眼查、企查查、LinkedIn）\nStep 0.45: 公司名预检 → 歧义检测 + 确认\nStep 0.5: 前置解析 → 统一信用代码 + 平台 URL\nStep 0.75: 查询计划 → 哪些源查什么维度\nStep 1: 引擎执行 → 六路拉数据\nStep 2: 补充搜索 → 新闻/诉讼/处罚\nStep 3: 合成 → LAW 约束输出",
            "lang": "text"
          },
          {
            "kind": "para",
            "text": "**核心中间产物:**"
          },
          {
            "kind": "list",
            "items": [
              "Resolved 情报块（信用代码 + 平台 URL）",
              "查询计划 JSON（维度:基本面/股权/诉讼/舆情/招聘/财务）",
              "引擎 stdout（structured data + 统计脚注）",
              "保存的原始文件"
            ]
          }
        ]
      }
    ],
    "starterPrompt": "",
    "nextSteps": {
      "author": [
        "把 A5 的 LAW 体系展开:为 `/company-check` 写 4-6 条输出 LAW（覆盖:禁编造注册数据/禁直接贴 JSON/统计脚注透传/禁漏风险提示）",
        "设计前置情报的回退链:天眼查 API 挂了 → 企查查 → 工商公示 → 手动输入",
        "评估哪些检查可以脚本化（A1 的引擎等价物）,哪些必须靠模型推理"
      ],
      "thief": [
        "拿走 A4 的关键词陷阱四分类模式,套到你自己的 skill 的输入验证上",
        "拿走 A2 的全量检查清单设计:列出你的 skill 调用 CLI 前需要解析的所有参数,做成 flag 检查表,每个 flag 标明「适用条件」和「跳过理由」",
        "拿走 A8 的独立预算思路:如果你的 skill 有多阶段搜索,把每阶段的搜索预算独立,不混算"
      ]
    }
  },
  "glossary": [
    {
      "term": "Resolved 情报块",
      "definition": "Step 0.5/0.55 的产出,把话题从自然语言映射到各平台的具体账号和社区。",
      "example": "`Resolved: - X: @kanyewest (+ @travisscott, @PopBase) - Reddit: r/Kanye, r/WestSubEver, r/hiphopheads - TikTok: #kanyewest, #ye, #bully`",
      "whereItAppears": "stage-02 产出,stage-03 和 stage-04 读取使用",
      "solvedProblem": "搜「Peter Steinberger」只能找到提到名字的帖子,搜「@steipete」才能找到他的推文和互动圈。Resolved 块把这层转换提前做完,后续所有步骤都不用猜。",
      "howToUse": "模型用 WebSearch 逐项解析,写成固定格式的文本块展示给用户,然后拆成 CLI 参数（--x-handle, --subreddits 等）传给引擎。",
      "commonMisread": "不是引擎自动生成的 - 是模型自己做的工作。引擎的 --auto-resolve 是无头模式的回退,不是首选。"
    },
    {
      "term": "查询计划 JSON",
      "definition": "Step 0.75 的产出,一份 JSON 文件,告诉引擎搜什么、在哪搜、每条搜索多重要。",
      "example": "`{\"intent\":\"breaking_news\", \"subqueries\":[{\"label\":\"primary\", \"search_query\":\"kanye west\", \"sources\":[\"reddit\",\"x\",\"youtube\"], \"weight\":1.0}]}`",
      "whereItAppears": "stage-03 产出,写入 tmpfile 后通过 --plan 传给 stage-04",
      "solvedProblem": "模型手头有完整的话题上下文和情报,引擎只看到话题字符串。让信息更丰富的一方来规划搜索策略。",
      "howToUse": "模型按 schema 生成 JSON,用 heredoc 写入 tmpfile（不 inline 传 - 撇号会断 shell 引号）,然后在引擎命令里加 `--plan \"$QUERY_PLAN_FILE\"`。",
      "commonMisread": "不是引擎内部的 Gemini planner - 那是 cron 回退。在推理模型驱动的场景,模型就是 planner。LAW 7 说得明白:「you ARE the provider」。"
    },
    {
      "term": "证据集群",
      "definition": "引擎 compact 输出中按故事/主题分组的证据块,每个集群跨越多个信号源。",
      "example": "`### 1. BULLY dropped and fans are split (score 85, 12 items, sources: Reddit, X, YouTube, TikTok)`",
      "whereItAppears": "引擎 stdout（stage-04 的产出）,在 EVIDENCE FOR SYNTHESIS 注释边界内",
      "solvedProblem": "传统做法是按源分组（所有 Reddit、所有 X）,看不出跨源的故事线。按故事分组后,一个集群里有 Reddit 讨论+X 评论+YouTube 评测+TikTok 反应,模型合成时一个段落就能覆盖一个完整叙事。",
      "howToUse": "读集群标题和置信度标签（multi-source 最强,single-source 需谨慎,thin-evidence 要加限定词）,用集群内的引用和互动数据来写 What I learned 段落。这些是工作素材,不是输出 - 直接贴给用户是 LAW 6 违规。",
      "commonMisread": "不是最终输出格式 - 证据集群是 EVIDENCE FOR SYNTHESIS 区域里的素材,模型必须把它转化成叙事段落。两次 Hermes Agent 灾难就是直接把这些贴给了用户。"
    },
    {
      "term": "emoji-tree 统计脚注",
      "definition": "引擎 compact 输出末尾的统计信息块,以 `✅ All agents reported back!` 开头,用 emoji-tree 格式展示每个信号源的命中数和互动总量。",
      "example": "`├─ 🟠 Reddit: 14 threads (892 upvotes, 234 comments)`",
      "whereItAppears": "引擎 stdout 的 PASS-THROUGH FOOTER 区域（stage-04 产出）,在 stage-05 合成时直接透传",
      "solvedProblem": "引擎已经算好了每源的计数和互动总量。如果让模型重算,数字会对不上。统计脚注是引擎的可信产出,模型只需要原样复制。",
      "howToUse": "从引擎 stdout 里找到 `<!-- PASS-THROUGH FOOTER -->` 到 `<!-- END PASS-THROUGH FOOTER -->` 之间的内容,原样贴到合成输出的 KEY PATTERNS 和 invitation 之间。不重算、不重排、不删零项（引擎已经删了）。",
      "commonMisread": "不是模型自己写的统计 - 是引擎写的,模型只透传。LAW 5 的全部意义就是防止模型重新计算这些数字。"
    },
    {
      "term": "LAW",
      "definition": "输出格式的硬约束规则,编号 1-8,每条覆盖一个具体的格式违规。",
      "example": "LAW 1 = 禁止 Sources: 尾巴；LAW 3 = 禁止 em-dash；LAW 8 = 引用必须是内联链接。",
      "whereItAppears": "stage-05 合成时执行,但规则定义在 SKILL.md 顶部（OUTPUT CONTRACT 节）",
      "solvedProblem": "模型合成长文时会自动回到默认习惯（加标题、用 em-dash、贴 Sources 列表）。每条 LAW 有真实灾难日期:LAW 1 有 Peter Steinberger 三次泄漏,LAW 6 有 Hermes Agent 两次证据倾倒。日期锚定让规则不像「通用最佳实践」,而像「被烧过的疤」。",
      "howToUse": "合成前重读 LAW 1-8,合成后逐条自检。如果某条 LAW 被违反,只允许重新生成一次。",
      "commonMisread": "不是通用写作规范 - 是 `/last30days` skill 内部的格式约束,只在 skill 输出中生效。skill 外的对话不受 LAW 约束。SKILL.md 明确说:「Global preferences apply OUTSIDE this skill; inside `/last30days` synthesis, the voice contract is the contract.」"
    }
  ],
  "toolbox": [
    {
      "anchor": "steal-1",
      "name": "关键词陷阱四分类 + 一回合门",
      "tier": "直接抄走",
      "scene": "任何要把用户自然语言转成搜索查询的场景",
      "page": "walkthrough",
      "where": "stage-01 话题理解与质量预检",
      "text": "你下次做任何搜索驱动的工具,把这四类陷阱清单直接贴进 prompt。人群购物语 - 拆成关系、爱好和预算再搜;数字碰撞 - 42 会撞上 Jackie Robinson 球衣号码,去掉数字再搜;教程腔 - 把「how to use Docker」改成「my Docker setup」;光秃名词 - 追问一个具体切面。每类带一个处置动作。检测不花时间,但能省掉一次 5 分钟的废跑。",
      "blocks": [
        {
          "kind": "para",
          "text": "你下次做任何搜索驱动的工具,把这四类陷阱清单直接贴进 prompt。人群购物语 - 拆成关系、爱好和预算再搜;数字碰撞 - 42 会撞上 Jackie Robinson 球衣号码,去掉数字再搜;教程腔 - 把「how to use Docker」改成「my Docker setup」;光秃名词 - 追问一个具体切面。每类带一个处置动作。检测不花时间,但能省掉一次 5 分钟的废跑。"
        }
      ]
    },
    {
      "anchor": "steal-2",
      "name": "全量前置情报检查清单",
      "tier": "思路带走",
      "scene": "任何 CLI 工具调用前需要多维度参数解析的场景",
      "page": "walkthrough",
      "where": "stage-02 前置情报解析",
      "text": "你下次写一个需要调用外部工具的 skill,把所有可选参数列成一张检查清单表,每个参数写清「什么时候适用」。然后在 prompt 里写死一句:「不要解析完第一个就停,逐条过完整张表。」Peter Steinberger 灾难的教训:模型会把第一个小节当成全部契约。",
      "blocks": [
        {
          "kind": "para",
          "text": "你下次写一个需要调用外部工具的 skill,把所有可选参数列成一张检查清单表,每个参数写清「什么时候适用」。然后在 prompt 里写死一句:「不要解析完第一个就停,逐条过完整张表。」Peter Steinberger 灾难的教训:模型会把第一个小节当成全部契约。"
        }
      ]
    },
    {
      "anchor": "steal-3",
      "name": "品类同行子版块表",
      "tier": "直接抄走",
      "scene": "社交媒体调研、竞品分析、产品舆情监控",
      "page": "walkthrough",
      "where": "stage-02 前置情报解析",
      "text": "你做产品舆情时,品牌子版块(r/OpenAI)只有用户问题,跨产品技巧讨论在品类通用社区(r/StableDiffusion、r/midjourney)。这张 10 品类表你可以直接抄走:AI 图像生成 → StableDiffusion, midjourney, dalle2, aiArt;AI 编码 agent → ChatGPTCoding, LocalLLaMA, singularity。你用 WebSearch 返回的子版块打底,再从品类表里补 2-3 个同行,上限 10 个去重。",
      "blocks": [
        {
          "kind": "para",
          "text": "你做产品舆情时,品牌子版块(r/OpenAI)只有用户问题,跨产品技巧讨论在品类通用社区(r/StableDiffusion、r/midjourney)。这张 10 品类表你可以直接抄走:AI 图像生成 → StableDiffusion, midjourney, dalle2, aiArt;AI 编码 agent → ChatGPTCoding, LocalLLaMA, singularity。你用 WebSearch 返回的子版块打底,再从品类表里补 2-3 个同行,上限 10 个去重。"
        }
      ]
    },
    {
      "anchor": "steal-4",
      "name": "三结构约束防即兴",
      "tier": "思路带走",
      "scene": "长 SKILL.md 场景下防止模型跳过契约直接回答",
      "page": "walkthrough",
      "where": "stage-04 引擎执行与后置补充",
      "text": "你写的 SKILL.md 超过 500 行,模型会跳过后半部分直接回答。防法:在文件开头放三个关键约束 - 一个强制输出格式(badge)、一个绑定执行路径(SKILL_DIR)、一段明确说「不要即兴」的前言。2026-04-18 的 0/8 vs 10/10 对照证明:不是模型不行,是关键约束没放对位置。",
      "blocks": [
        {
          "kind": "para",
          "text": "你写的 SKILL.md 超过 500 行,模型会跳过后半部分直接回答。防法:在文件开头放三个关键约束 - 一个强制输出格式(badge)、一个绑定执行路径(SKILL_DIR)、一段明确说「不要即兴」的前言。2026-04-18 的 0/8 vs 10/10 对照证明:不是模型不行,是关键约束没放对位置。"
        }
      ]
    },
    {
      "anchor": "steal-5",
      "name": "信号加权 7 级权重表",
      "tier": "直接抄走",
      "scene": "任何需要从噪声中识别真正推荐的排名场景",
      "page": "walkthrough",
      "where": "stage-05 合成与输出",
      "text": "你下次做任何「从众多提及中挑出真正推荐」的工作,这张 7 级表直接抄:从业者证词 5、专家叛逃 4、可量化主张 4、有理据比较 3、独立来源收敛 2、描述性提及 1、推广/训练营 0。先把「存在」和「被推荐」分开,再按权重排。提及次数不是推荐。",
      "blocks": [
        {
          "kind": "para",
          "text": "你下次做任何「从众多提及中挑出真正推荐」的工作,这张 7 级表直接抄:从业者证词 5、专家叛逃 4、可量化主张 4、有理据比较 3、独立来源收敛 2、描述性提及 1、推广/训练营 0。先把「存在」和「被推荐」分开,再按权重排。提及次数不是推荐。"
        }
      ]
    }
  ]
};
