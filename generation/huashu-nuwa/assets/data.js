// 构建产物 —— 由 scripts/build-data.py 生成，禁止手写。
window.handbook = {
  "meta": {
    "title": "女娲造人 Skill 解剖手册",
    "skillName": "女娲造人",
    "audience": "想偷招的人 / 还没用过这个 skill 的 AI",
    "sourcePath": "/home/guwanhua/Desktop/git/nuwa-skill",
    "version": "v2",
    "baseline": "同款模型、不带女娲、收到「帮我做一个乔布斯 skill」的默认 agent。"
  },
  "example": {
    "label": "乔布斯 skill",
    "userRequest": "帮我做一个乔布斯 skill，用来审视产品设计和战略取舍。",
    "whyThisExample": "明确人名走直接路径，会完整经过分流、建目录、六维调研、两个检查点、提炼、构建、验证全部六站，没有岔路损耗。",
    "expectedOutput": "一个自包含的 `.claude/skills/steve-jobs-perspective/` 目录：可激活的 SKILL.md、六份调研文件、一手素材库，复制走就能用。"
  },
  "diagrams": [
    {
      "id": "main-flow",
      "title": "六站流水线全景",
      "description": "一句话请求从左边进；中间六站，每站交出一个有固定住址的产物；两个菱形是必须停下来让用户看质量的检查点。",
      "kicker": "panorama",
      "image": "assets/diagrams/main-flow.svg"
    },
    {
      "id": "data-flow",
      "title": "中间产物数据流",
      "description": "数据怎么从一句话流成一个可运行的 skill：素材进 sources/，调研写进 research/01-06，提炼结果按模板灌进 SKILL.md。",
      "kicker": "dataflow",
      "image": "assets/diagrams/data-flow.svg"
    }
  ],
  "overview": {
    "h1": "它不让 AI 扮演名人——它让 AI 先把造人的苦工做完",
    "oneLiner": "女娲把一个人名或一句模糊需求，变成一条有证据、有检查点、敢承认自己不知道什么的人物 skill 生产线。",
    "openingScene": [
      {
        "kind": "para",
        "text": "先不要看任何机制。想象一个默认 AI 收到这个请求：「帮我做一个乔布斯 skill，用来审视产品设计和战略取舍。」"
      },
      {
        "kind": "para",
        "text": "它最顺手的做法，是马上写一段漂亮的角色设定：几条传记事实、几句著名语录、一些「Stay hungry」式的短句。你看一眼，觉得挺有味道。"
      },
      {
        "kind": "para",
        "text": "问题会在第一个新问题里露出来。你问它：「Vision Pro 现在值不值得做？」它凭训练语料里的旧记忆，编了一个听起来很像乔布斯的回答——流畅、自信、没有任何一手依据。"
      },
      {
        "kind": "para",
        "text": "这不是语气问题。它没有证据，没有来源质量判断，没有把观点筛成能应对新问题的判断系统，更不会在该查资料的时候先去查。"
      },
      {
        "kind": "para",
        "text": "更麻烦的是，你看不出来它在编。回答越像，越难发现底下是空的。"
      },
      {
        "kind": "para",
        "text": "女娲对付的就是这个错位：你以为要的是一个会说话的人设，真正需要的是一个能被安装、能复用、敢说「这个我不知道」的思维工具。"
      }
    ],
    "predictPrompt": "如果让你来修这个默认 AI，你会先加什么？更多语录？更像的语气？还是先规定它必须保存哪些证据？把答案写下来，后面每一站都可以对一次。",
    "primerBeats": [
      {
        "kind": "para",
        "text": "这个 skill 的核心动作，是把一个人的公开材料压缩成一套可运行的判断系统。「可运行」不是指会输出名人腔，而是指面对新问题时，它知道先查什么、用什么模型判断、在哪里必须犹豫。"
      },
      {
        "kind": "diagram",
        "id": "main-flow"
      },
      {
        "kind": "para",
        "text": "整条流水线有几个反直觉的地方，值得现在先记住。"
      },
      {
        "kind": "para",
        "text": "它收到请求后不马上调研，先建一个空目录——因为调研结果必须有固定住址，丢在对话里的调研等于没做。"
      },
      {
        "kind": "para",
        "text": "它调研一个人要开六个并行的子 agent，分别去翻著作、长对话、碎片表达、他人评价、决策记录、时间线——因为一篇文章代表不了一个人。"
      },
      {
        "kind": "para",
        "text": "它在调研后和提炼后各停一次，把质量摘要拍在你面前——因为垃圾进垃圾出，在源头拦截比写完 400 行再返工便宜得多。"
      },
      {
        "kind": "para",
        "text": "它交付前会另开一个子 agent 拿着新 skill 答题——自己检查自己，分数永远偏高。"
      }
    ],
    "wowSetup": "",
    "wowDiagramId": "",
    "wowMoment": "",
    "painPreview": [
      {
        "title": "像不像不是问题，编不编才是",
        "pit": "你问人设：「Vision Pro 现在值不值得做？」它答：「人们不知道自己想要什么，直到你把它放到他们面前。值得做。」——流畅、像他，但没查任何最新事实，纯编的，而且你看不出来。",
        "hook": "它给生成的人设写死一条「回答工作流」：需要事实的问题必须先用工具查再答，研究维度还是从这个人的心智模型反推的——芒格查激励结构，塔勒布查尾部风险，不是通用的「搜索相关信息」。",
        "dimension": "领域-认知",
        "goDeeper": "stage-06 · A1",
        "goDeeperStage": "stage-06",
        "goDeeperCard": "A1"
      },
      {
        "title": "并行调研，三天后什么都找不到",
        "pit": "六路子 agent 调研完各自在消息里汇报「已完成」，到提炼阶段你想引用某条访谈原话——上下文里只剩印象，一条来源都翻不出来。",
        "hook": "一句死命令：「不存文件的调研等于没做」——而且目录和六个文件名在调研开始前就建好了，先有住址再有居民。",
        "dimension": "编排",
        "goDeeper": "stage-02 · A4",
        "goDeeperStage": "stage-02",
        "goDeeperCard": "A4"
      },
      {
        "title": "中文搜索，搜出来的全是洗稿",
        "pit": "搜「乔布斯 思维方式」，前十条是知乎高赞和公众号爆款——观点互相抄、来源不可考，调研文件写得很厚，全是二手失真。",
        "hook": "一张「永远排除」的黑名单点名到平台（知乎/公众号/百度系），白名单点名到媒体（晚点/财新/极客公园）——对失真生态不留自由裁量。",
        "dimension": "平台",
        "goDeeper": "stage-03 · A9",
        "goDeeperStage": "stage-03",
        "goDeeperCard": "A9"
      },
      {
        "title": "用户不知道自己要谁",
        "pit": "用户说「我想提升决策质量」，你反问「那你想蒸馏谁？」——他要是知道就不会这么问了，对话当场冷掉。",
        "hook": "一张十行的「需求维度 → 思维框架方向」对照表 + 追问上限 2 轮 + 候选必须写「局限」——把开放式反问变成结构化反推。",
        "dimension": "需求",
        "goDeeper": "stage-01 · A10",
        "goDeeperStage": "stage-01",
        "goDeeperCard": "A10"
      },
      {
        "title": "材料不够，篇幅来凑",
        "pit": "蒸馏一个公开信息很少的人，产物照样是七个模型的「完整」skill——缺的部分全用通用道理补齐，看起来越完整，编造越多。",
        "hook": "一条红线：「宁可生成一个诚实标注了局限的 60 分 Skill，也不要生成一个看起来完美但实际上在编造的 90 分 Skill」——配套的降级动作是减少模型数量、每个标注「基于有限信息推测」、加大诚实边界篇幅。",
        "dimension": "品味",
        "goDeeper": "stage-03 · A7",
        "goDeeperStage": "stage-03",
        "goDeeperCard": "A7"
      }
    ],
    "panoramaDiagramId": "main-flow",
    "shapeReason": "先看坏在哪，再看怎么跑，看清数据，深挖难点，最后自己动手",
    "chapterLogic": [
      {
        "chapter": "Overview",
        "why": "先在读者自己的语言里看到坏结果，再给全景图"
      },
      {
        "chapter": "Walkthrough",
        "why": "跟着 agent 走六站，每站先猜再看机制原文"
      },
      {
        "chapter": "中间产物与数据流",
        "why": "流程里见过的文件，集中看清它们为什么长这样"
      },
      {
        "chapter": "难点档案",
        "why": "十一张卡：症状、证据、机制、什么时候这招太重"
      },
      {
        "chapter": "Apply It",
        "why": "拿着高可迁移的卡，自己画一个新领域的骨架"
      },
      {
        "chapter": "Glossary",
        "why": "附录查阅，不在主线上"
      }
    ]
  },
  "walkthrough": [
    {
      "id": "stage-01",
      "title": "入口分流与需求澄清",
      "kicker": "Phase 0 / 0A / 0B",
      "summary": "先判断用户给的是明确人名还是模糊需求，两条路走法完全不同。",
      "breadcrumb": "【分流澄清】 → 建目录 → 六维取证 → 调研检查点 → 提炼 → 构建验证",
      "hookOpen": "",
      "sceneBody": [
        {
          "kind": "para",
          "text": "我收到的全部输入是这一句："
        },
        {
          "kind": "code",
          "text": "帮我做一个乔布斯 skill，用来审视产品设计和战略取舍。",
          "lang": "text"
        },
        {
          "kind": "para",
          "text": "这是个明确人名，走直接路径。但同样常见的输入是另一种："
        },
        {
          "kind": "code",
          "text": "我总觉得自己做决定太慢，想来想去最后还是选错。",
          "lang": "text"
        },
        {
          "kind": "para",
          "text": "这种输入里没有任何人名。我要交出的东西是一样的：确认过的蒸馏对象 + 用途 + 语料情况。"
        }
      ],
      "painDomain": {
        "text": "确无"
      },
      "painBehavior": {
        "text": "实测了 3 个不带女娲的基线 agent：没有一个干瘪反问（它们把需求拆解得有模有样），但 3/3 走向「给你造一个通用决策教练工具」，0/3 想到「有人已经把这个问题想透了——去蒸馏他」。默认 agent 到不了这个解法空间，而且用户不知道自己错过了什么。",
        "evidence": "实测"
      },
      "predictBody": [
        {
          "kind": "para",
          "text": "用户只说「想提升决策质量」，没说要谁。如果是你写规则，你会让 agent 怎么把这句话变成一个具体的蒸馏对象？先想好你的方案。"
        }
      ],
      "mechanismBody": [
        {
          "kind": "para",
          "text": "skill 把模糊路径做成了一张「需求维度 → 思维框架方向」的对照表，并且管住了追问的节奏："
        },
        {
          "kind": "quote",
          "text": "追问原则：\n- 最多问 2 轮，不要变成问卷调查\n- 如果用户已经表达得足够清晰，不追问，直接推荐\n- 追问的目的是区分相似维度（比如「决策」是商业决策还是人生决策？）"
        },
        {
          "kind": "para",
          "text": "推荐时还强制带上局限——「必须说清楚局限——没有万能的思维框架」。这一站结束时我手里有："
        },
        {
          "kind": "code",
          "text": "对象：乔布斯 ／ 用途：思维顾问（聚焦产品与战略） ／ 语料：无本地素材，走网络搜索",
          "lang": "text"
        }
      ],
      "reusableMove": "当入口可能收到说不清的需求时 → 把澄清做成「需求维度对照表 + 追问轮数上限」，不要开放式反问。",
      "moveCard": "A10",
      "hookClose": "对象和用途定了，建目录时才知道目录该叫什么、调研该聚焦哪个方向。",
      "challenges": [],
      "quickref": {
        "receives": "用户一句话（人名或模糊需求）",
        "blockedShortcut": "不能跳过确认直接开始调研",
        "output": "确认过的对象 + 用途 + 语料模式",
        "freedom": "limited"
      }
    },
    {
      "id": "stage-02",
      "title": "先建目录，给调研钉住址",
      "kicker": "Phase 0.5",
      "summary": "调研还没开始，先把空目录建好——每份调研结果都有固定住址。",
      "breadcrumb": "分流澄清 → 【建目录】 → 六维取证 → 调研检查点 → 提炼 → 构建验证",
      "hookOpen": "对象和用途已确认，可以放心创建以它命名的目录了。",
      "sceneBody": [
        {
          "kind": "para",
          "text": "我还没搜任何资料，先执行的是建目录："
        },
        {
          "kind": "code",
          "text": ".claude/skills/steve-jobs-perspective/\n├── SKILL.md                  # 最终产物（现在是空的）\n├── scripts/\n└── references/\n    ├── research/             # 01-writings.md ... 06-timeline.md\n    └── sources/              # books/ transcripts/ articles/",
          "lang": "text"
        }
      ],
      "painDomain": {
        "text": "确无"
      },
      "painBehavior": {
        "text": "并行子 agent 的调研结果如果只活在各自的对话上下文里，汇总时就只剩印象——引用不出任何一条具体来源。",
        "evidence": "作者证词"
      },
      "predictBody": [
        {
          "kind": "para",
          "text": "六个并行 agent 马上要出发了。你会用什么办法保证它们的成果三天后还找得到、而且别的阶段能直接用？"
        }
      ],
      "mechanismBody": [
        {
          "kind": "para",
          "text": "skill 把这条规则写成了死命令，原文只有一句话但份量很重："
        },
        {
          "kind": "quote",
          "text": "每个 subagent 必须把调研结果写入对应的 md 文件。不存文件的调研等于没做。"
        },
        {
          "kind": "para",
          "text": "还有一条配套的自包含约束："
        },
        {
          "kind": "quote",
          "text": "所有调研文件必须存在 skill 目录内部（`references/research/`）……Skill 必须是自包含的——复制整个 skill 目录就能独立使用，不依赖任何外部文件。这是为开源分发设计的核心原则。"
        },
        {
          "kind": "para",
          "text": "这一站的产出就是那个空目录本身——六个文件名已经钉死，后面谁写哪个文件没有任何发挥空间。"
        }
      ],
      "reusableMove": "当多个并行 agent 的产出要被下游消费时 → 开工前先钉死产物的文件名和位置，先有住址再有居民。",
      "moveCard": "A4",
      "hookClose": "六个 agent 各自知道往哪写，提炼阶段知道去哪读。",
      "challenges": [],
      "quickref": {
        "receives": "确认过的对象与用途",
        "action": "创建目录骨架，检查更新模式/本地语料",
        "output": "带固定文件名的空目录",
        "freedom": "almost-none"
      }
    },
    {
      "id": "stage-03",
      "title": "六维并行取证",
      "kicker": "Phase 1",
      "summary": "六个并行子 agent 分头翻著作、对话、表达、他评、决策、时间线。",
      "breadcrumb": "分流澄清 → 建目录 → 【六维取证】 → 调研检查点 → 提炼 → 构建验证",
      "hookOpen": "住址钉好了，六个 agent 可以同时出发。",
      "sceneBody": [
        {
          "kind": "para",
          "text": "我现在要 spawn 六个子 agent。给 Agent 1（著作）的任务原文是这样的："
        },
        {
          "kind": "code",
          "text": "你的任务：调研乔布斯的著作和系统性长文。\n搜索方向：\n- 反复出现≥3次的核心论点（这些是真信念）\n- 自创术语和概念\n输出要求：\n- 写入 [skill目录]/references/research/01-writings.md\n- 每条信息标注来源URL和可信度\n- 区分一手（此人写的）vs 二手（别人总结的）\n信息源黑名单：不使用知乎、微信公众号、百度百科。",
          "lang": "text"
        }
      ],
      "painDomain": {
        "text": "只看一种来源，理解出来的人是漫画。一篇爆款文章里的乔布斯和决策记录里的乔布斯不是同一个人——理解一个人本身就需要取证维度的设计。",
        "evidence": "作者证词"
      },
      "painBehavior": {
        "text": "默认 agent 搜中文资料会大量命中洗稿文和二手转述，调研文件看着厚实，全是失真信息。",
        "evidence": "作者证词"
      },
      "predictBody": [
        {
          "kind": "para",
          "text": "如果让你设计「理解一个人」的调研分工，你会切成哪几块？切完对一下女娲的六维，看看你漏了哪个、它漏了哪个。"
        }
      ],
      "mechanismBody": [
        {
          "kind": "para",
          "text": "六维分工每一维都有明确的「提取重点」，不是泛泛的「搜索相关信息」："
        },
        {
          "kind": "quote",
          "text": "| 1 著作 | 反复出现的核心论点（≥3次=真信念）、自创术语、推荐书单 |\n| 2 对话 | 被追问时的回答方式、即兴类比、改变立场的瞬间、拒绝回答的问题 |\n| 5 决策 | 决策背景与逻辑、事后反思、言行一致/不一致案例 |"
        },
        {
          "kind": "para",
          "text": "来源质量有一张权重表（一手素材最高、二手转述最低），中文渠道有一条不留余地的黑名单："
        },
        {
          "kind": "quote",
          "text": "信息源黑名单（永远排除）：知乎：洗稿严重、信息失真率高……微信公众号：封闭生态、无法验证……百度百科/百度知道：信息陈旧且不可靠。"
        },
        {
          "kind": "para",
          "text": "机械活全部交给脚本：字幕用 `download_subtitles.sh` 下载、`srt_to_transcript.py` 清洗（去时间戳、序号、重复行）。信息源不足时不硬撑："
        },
        {
          "kind": "quote",
          "text": "宁可生成一个诚实标注了局限的 60 分 Skill，也不要生成一个看起来完美但实际上在编造的 90 分 Skill。"
        },
        {
          "kind": "para",
          "text": "产出是六份各自归位的调研文件："
        },
        {
          "kind": "code",
          "text": "references/research/01-writings.md      （8 篇来源）\nreferences/research/02-conversations.md （5 段长访谈）\n...\nreferences/research/06-timeline.md      （含最近 12 个月动态）",
          "lang": "text"
        }
      ],
      "reusableMove": "当你要让并行 agent 调研一个复杂对象时 → 任务书里写「提取重点」而不是「搜索主题」，配上来源权重表和黑名单。",
      "moveCard": "A3",
      "hookClose": "检查点要拿这六份文件算账：来源够不够、矛盾在哪。",
      "challenges": [],
      "quickref": {
        "receives": "空目录 + 对象与聚焦方向",
        "reads": "六维分工表、信息源权重与黑名单",
        "blockedShortcut": "不能用黑名单来源，不能不落盘",
        "output": "research/01-06.md 六份调研文件",
        "mechanismThread": "固定住址线：建目录 → 写文件 → 提炼只读文件",
        "freedom": "limited"
      }
    },
    {
      "id": "stage-04",
      "title": "调研检查点",
      "kicker": "Phase 1.5",
      "summary": "全部 agent 完成后暂停，把调研质量摘要拍给用户看。",
      "breadcrumb": "分流澄清 → 建目录 → 六维取证 → 【调研检查点】 → 提炼 → 构建验证",
      "hookOpen": "六份调研文件就位，但先别急着提炼。",
      "sceneBody": [
        {
          "kind": "para",
          "text": "我跑 `merge_research.py` 自动统计六份文件，然后把这张表展示给用户："
        },
        {
          "kind": "code",
          "text": "│ Agent            │ 来源数量  │ 关键发现                  │\n│ 1 著作           │ 8篇      │ 核心论点: 现实扭曲力场... │\n│ 3 表达           │ 120条    │ 高频词: \"insanely great\" │\n│ 矛盾点           │ 2处      │ Agent1说X, Agent4说Y     │\n│ 信息不足维度      │ 无       │                          │",
          "lang": "text"
        }
      ],
      "painDomain": {
        "text": "确无"
      },
      "painBehavior": {
        "text": "默认 agent 拿到材料就闷头往下跑，方向错误要到交付时才暴露，返工成本最大。",
        "evidence": "作者证词"
      },
      "predictBody": [
        {
          "kind": "para",
          "text": "检查点放在哪最划算？调研后？提炼后？构建后？女娲放了两个，先想想你会放在哪、为什么。"
        }
      ],
      "mechanismBody": [
        {
          "kind": "para",
          "text": "skill 自己把这个检查点的存在理由说得很清楚："
        },
        {
          "kind": "quote",
          "text": "这个检查点的意义：调研质量决定了最终 Skill 的上限。垃圾进垃圾出，在这里拦截比在 Phase 4 返工成本低得多。"
        },
        {
          "kind": "para",
          "text": "用户确认 OK 才进提炼；觉得某维度不够，就补充调研再继续。产出是一个被用户盖过章的调研基线。"
        }
      ],
      "reusableMove": "当流水线里有「主观判断重、下游返工贵」的接缝时 → 把检查点钉在接缝上，给用户结构化摘要而不是原始材料。",
      "moveCard": "A5",
      "hookClose": "提炼拿到的是用户确认过质量的材料，不用边提炼边怀疑地基。",
      "challenges": [],
      "quickref": {
        "receives": "六份调研文件",
        "action": "跑 merge_research.py，展示摘要，等用户确认",
        "output": "用户确认过的调研基线",
        "freedom": "almost-none"
      }
    },
    {
      "id": "stage-05",
      "title": "三重验证提炼",
      "kicker": "Phase 2 / 2.5",
      "summary": "把 15-30 个候选论点筛成 3-7 个心智模型，宁少勿多。",
      "breadcrumb": "分流澄清 → 建目录 → 六维取证 → 调研检查点 → 【提炼】 → 构建验证",
      "hookOpen": "调研质量用户已确认，现在开始整条流水线主观判断最重的一站。",
      "sceneBody": [
        {
          "kind": "para",
          "text": "我逐个读 `01-writings.md` 到 `05-decisions.md`，列出乔布斯所有反复出现的论点，得到 20 多个候选："
        },
        {
          "kind": "code",
          "text": "候选 01  现实扭曲力场            （出现于: 02-conversations, 04-external-views）\n候选 02  专注就是说不            （出现于: 01-writings, 02, 05-decisions）\n候选 03  技术与人文路口          （出现于: 01, 02）\n候选 04  不做市场调研            （出现于: 02, 05）\n候选 05  舞台演讲穿黑色高领      （出现于: 03-expression-dna）\n...",
          "lang": "text"
        },
        {
          "kind": "para",
          "text": "第一秒的本能是把最醒目的几条直接包装成心智模型。skill 不让。"
        }
      ],
      "painDomain": {
        "text": "两层。第一层：随口一说和真信念长得一模一样，不筛就会把场合话写成核心思想。第二层：就算筛对了，如果产出形态是语录集，遇到新问题照样没有生成力——这正是开场那个「编 Vision Pro 答案」的根。",
        "evidence": "作者证词"
      },
      "painBehavior": {
        "text": "默认 agent 提炼时会把矛盾的材料调和成一个圆滑的版本，产出「观点高度一致（太假）」的人设。",
        "evidence": "作者证词"
      },
      "predictBody": [
        {
          "kind": "para",
          "text": "「专注就是说不」和「舞台演讲穿黑色高领」都是乔布斯反复出现的特征。你用什么标准判断哪个该进心智模型、哪个只是表面特征？写下你的筛法。"
        }
      ],
      "mechanismBody": [
        {
          "kind": "para",
          "text": "每个候选要过三道筛，原文在 extraction-framework.md："
        },
        {
          "kind": "quote",
          "text": "验证1: 跨域复现——同一个思维框架出现在此人讨论的至少 2 个不同领域。\n验证2: 有生成力——用这个模型可以推断此人对新问题的可能立场。\n验证3: 有排他性——不是所有聪明人都会这样想。"
        },
        {
          "kind": "para",
          "text": "三重全过才算心智模型；只过一两重降级为决策启发式；全不过丢弃。矛盾不调和，有专门的处理框架："
        },
        {
          "kind": "quote",
          "text": "矛盾是人格的核心特征，不是需要修复的 Bug。……错误的处理方式：❌ 选一边忽略另一边 ❌ 编一个调和的解释 ❌ 假装矛盾不存在"
        },
        {
          "kind": "para",
          "text": "提炼完成后是第二个检查点（Phase 2.5），把「心智模型 N 个、启发式 N 条、核心张力 N 对」的摘要再给用户确认一次。产出长这样："
        },
        {
          "kind": "code",
          "text": "心智模型（4个）: 现实扭曲力场 / 专注即拒绝 / 技术×人文 / 端到端控制\n决策启发式（7条）: 「如果要做市场调研，就已经输了」...\n核心张力（2对）: 极简主义 vs 完美主义的无限打磨\n诚实边界: 不能预测他对 AI 时代的立场；信息截止 2026-06",
          "lang": "text"
        }
      ],
      "reusableMove": "当你要从一堆候选里挑「真正核心」时 → 定多重验证判据 + 降级通道——不达标的不是删掉，是降级。",
      "moveCard": "A2",
      "hookClose": "构建阶段只做组装，所有判断在这一站已经做完并被确认。",
      "challenges": [],
      "quickref": {
        "receives": "六份确认过的调研文件",
        "reads": "extraction-framework.md 的三重验证与矛盾处理",
        "blockedShortcut": "不能把金句直接包装成模型，不能调和矛盾",
        "output": "心智模型/启发式/表达DNA/张力/诚实边界 + 用户确认",
        "mechanismThread": "检查点节奏线：1.5 拦材料 → 2.5 拦方向 → 4 拦质量",
        "freedom": "creative"
      }
    },
    {
      "id": "stage-06",
      "title": "构建、独立验证、精炼",
      "kicker": "Phase 3 / 4 / 5",
      "summary": "按模板组装 SKILL.md，spawn 子 agent 独立测试，最后双 Agent 精炼。",
      "breadcrumb": "分流澄清 → 建目录 → 六维取证 → 调研检查点 → 提炼 → 【构建验证】",
      "hookOpen": "提炼结果用户已确认，组装不再有方向风险。",
      "sceneBody": [
        {
          "kind": "para",
          "text": "我读 `skill-template.md`，把提炼结果逐 section 填进去。最特别的一段是「回答工作流（Agentic Protocol）」——它要求我根据乔布斯的心智模型，反推他分析问题时会查什么："
        },
        {
          "kind": "code",
          "text": "乔布斯式研究维度（从心智模型推导）：\n- 看产品：上手体验的前 30 秒？哪里能砍掉一半功能？\n- 看战略：这件事是不是处在技术与人文的路口？\n- 看人：团队里谁是 A player？",
          "lang": "text"
        }
      ],
      "painDomain": {
        "text": "人设「说得像」不等于「做得像」——没有回答工作流，skill 遇到事实问题还是会编。研究维度还必须因人而异，芒格查激励结构、塔勒布查尾部风险，通用的「搜索相关信息」等于没有。",
        "evidence": "作者证词"
      },
      "painBehavior": {
        "text": "主 agent 检查自己的产物，分数必然偏高——能发现的问题在生成时就不会犯。消融实测：生成者自检 6/0 全过，两个独立评审一致 5/1，漏的正是承重项。",
        "evidence": "实测"
      },
      "predictBody": [
        {
          "kind": "para",
          "text": "你怎么测一个人物 skill 像不像？想出三个测法，再对照女娲的三项测试。"
        }
      ],
      "mechanismBody": [
        {
          "kind": "para",
          "text": "验证由独立的子 agent 执行，原文点明了原因："
        },
        {
          "kind": "quote",
          "text": "生成 Skill 后，用子 agent 执行 3 项测试（独立于主 agent，避免自评偏差）"
        },
        {
          "kind": "para",
          "text": "三项测试各管一头：已知测试对答案（拿他公开表态过的问题对方向）、边缘测试看分寸（没讨论过的问题，期望「基于模型 X 的推断，可能……但不确定」而不是斩钉截铁）、风格测试防 AI 味。通过标准是张可机检的表（quality_check.py 自动跑），其中最反直觉的一条是："
        },
        {
          "kind": "quote",
          "text": "| 内在张力 | 至少 2 对矛盾 | 观点高度一致（太假） |"
        },
        {
          "kind": "para",
          "text": "矛盾太少反而不通过。迭代有上限（Phase 2→4 最多循环 2 次），到顶就在诚实边界里标注薄弱维度交付，不无限打磨。最后 Phase 5 双 Agent 精炼，展示验证结果给用户确认后交付。"
        }
      ],
      "reusableMove": "当产物的质量只能主观判断时 → 验证交给没参与生成的子 agent，并把「不通过信号」写成与通过标准并列的一列。",
      "moveCard": "A8",
      "hookClose": "",
      "challenges": [
        "「内在张力至少 2 对」这条标准，对政治人物 skill 会不会反而危险？",
        "迭代上限 2 次是拍脑袋还是有依据？你的项目里这个数该怎么定？",
        "Agentic Protocol 的研究维度从心智模型推导——如果某人的模型全是抽象哲学，推不出可搜索的维度怎么办？"
      ],
      "quickref": {
        "receives": "确认过的提炼结果 + skill-template.md",
        "blockedShortcut": "不能自己验证自己，不能无限迭代",
        "output": "通过验证的 steve-jobs-perspective/SKILL.md",
        "nextConsumer": "最终用户激活使用",
        "freedom": "limited"
      }
    }
  ],
  "dataflow": {
    "flowDiagramId": "data-flow",
    "intro": "一句话请求进来，一个自包含的人物 skill 目录出去。",
    "artifacts": [
      {
        "path": "references/research/01-06.md",
        "writtenBy": "stage-03 的六个并行子 agent，一人一份，文件名在 stage-02 就钉死了",
        "readBy": "stage-04 的 merge_research.py 统计来源；stage-05 提炼时逐份扫描；stage-06 汇总进「调研来源」section",
        "owns": "原始证据——谁说的、在哪说的、可信度几级、一手还是二手、矛盾原样保留",
        "doesNotOwn": "结论。这六份文件里不许出现「所以他的心智模型是……」",
        "whyThisShape": "直觉做法是边搜边总结，一步到位。拆成「证据文件 → 提炼」两层，是因为提炼是主观判断最重的环节——判断必须能被审计。用户在检查点质疑某个模型时，能翻回证据文件看它是从哪几条材料推出来的；证据和判断混在一起，错了连错在哪一层都查不出来。",
        "failureIfWrong": "二手洗稿文混进来没标可信度，下游三重验证拿着失真材料照样三重通过，整个 skill 建立在假证据上。"
      },
      {
        "path": "sources/（books / transcripts / articles）",
        "writtenBy": "用户提供的一手素材直接放入；字幕脚本下载清洗后存入 transcripts/",
        "readBy": "六个调研 agent 按维度分类消化（一本书可能同时覆盖著作和表达两个维度）",
        "owns": "未经任何转述的一手原文",
        "doesNotOwn": "任何分析和摘要",
        "whyThisShape": "信息源权重表里「用户提供的一手素材」排最高一档。给一手素材单独的物理住址，是为了让「一手」和「二手」的边界在文件系统层面就分开，而不是靠调研文件里的一个标注。复制整个目录时，证据链跟着走。",
        "failureIfWrong": "一手二手混放，来源权重表失去抓手，「一手来源占比 >50%」这条通过标准没法算。"
      },
      {
        "path": "references/skill-template.md",
        "writtenBy": "女娲的作者，随包分发，运行时只读",
        "readBy": "stage-06 构建时逐 section 填充",
        "owns": "目标 skill 的结构契约——frontmatter、角色扮演规则、心智模型、表达 DNA、诚实边界、每个 section 的格式和顺序",
        "doesNotOwn": "内容本身。模板里没有任何乔布斯",
        "whyThisShape": "直觉做法是让 agent「参考之前的例子写一个」。模板把结构从生成里抽出来，意味着 15 个 examples 里的人物 skill 结构完全一致——用户学会用一个就会用全部，质检脚本也才有固定的锚点可查。",
        "failureIfWrong": "模板缺一个 section（比如诚实边界），所有后续生成的人物 skill 集体缺这个 section，quality_check.py 全部报错。"
      },
      {
        "path": "steve-jobs-perspective/SKILL.md",
        "writtenBy": "stage-06 组装，stage-04～05 的两次用户确认决定了它的内容",
        "readBy": "最终用户的 agent 激活使用；「更新模式」下女娲自己重读它做增量更新",
        "owns": "可运行的判断系统——心智模型、决策启发式、表达 DNA、回答工作流、诚实边界",
        "doesNotOwn": "证据细节（住在 research/）和一手原文（住在 sources/）",
        "whyThisShape": "它不是文档，是程序。「回答工作流」一段让它面对新问题时先查再答；「诚实边界」一段让它知道自己不知道什么。一个会引用语录的文件是数据，一个知道何时犹豫的文件才是判断系统——这是整条流水线对任务本质的回答。",
        "failureIfWrong": "缺了回答工作流，skill 退化回开场那个凭旧记忆编 Vision Pro 答案的默认 AI——整条流水线白跑。"
      }
    ]
  },
  "archive": {
    "panoramaDiagramId": "",
    "cards": [
      {
        "id": "A1",
        "title": "金句不是 DNA",
        "dimension": "领域-认知",
        "symptom": "你问人设：「Vision Pro 现在值不值得做？」它答：「人们不知道自己想要什么，直到你把它放到他们面前。值得做。」——流畅、像他，但没查任何最新事实，是用旧语料编的，而且你看不出来。",
        "evidence": "作者证词",
        "contrast": {
          "without": "中间产物是语录集：50 条「Stay hungry」式金句",
          "with": "中间产物是判断系统：4 个心智模型，每个带应用方式和局限"
        },
        "therefore": "把流水线的中间产物从「他说过什么」换成「他怎么想」。",
        "mechanismQuote": "女娲不是复制人，是提炼思维框架。……关键区分：捕捉的是 HOW they think，不是 WHAT they said。",
        "mechanismNote": "这是表征层的决定：同样的调研材料，压缩目标不同，产物的泛化能力天差地别。语录只能复述，模型能推断新立场。",
        "solutionLayer": "表征解法",
        "transferability": "高",
        "useWhen": "任何「从材料中提炼可复用知识」的任务——拆解一个 skill、总结一个领域、做一个顾问。问自己：中间产物是表面特征还是生成机制？",
        "tooHeavyWhen": "用户就是要一个语录墙或表情包人设——娱乐场景里判断系统是过度工程。",
        "antiExample": "把金句分类整理得再好（按主题/年份/场景），仍然是金句，不是模型。",
        "seenIn": "huashu-nuwa",
        "counterScenarios": [
          {
            "when": "思维顾问类人物 skill",
            "effect": "管用",
            "why": "核心价值就是对新问题的判断力"
          },
          {
            "when": "娱乐向角色扮演",
            "effect": "用力过了",
            "why": "用户要的是味道，不是推理"
          },
          {
            "when": "历史人物教学 skill",
            "effect": "看情况",
            "why": "教思想史要模型，教生平金句也够"
          }
        ],
        "related": [
          {
            "to": "A2",
            "label": "三重验证筛模型",
            "relation": "下游接管：定了「要模型」之后，靠它判断什么算模型"
          },
          {
            "to": "A6",
            "label": "矛盾是特征不是 bug",
            "relation": "搭配用：模型之间的张力也是表征的一部分"
          }
        ]
      },
      {
        "id": "A2",
        "title": "三重验证筛模型",
        "dimension": "领域-认知",
        "symptom": "调研文件里有一句「Stay hungry, stay foolish」（2005 斯坦福演讲），默认 agent 把它写进核心思想第一条——可这句是他引用《全球概览》封底的话，连原创都不是。随口一说、场合引用和真信念，在单条材料里长得一模一样。",
        "evidence": "作者证词",
        "contrast": {
          "without": "「他说过专注很重要」→ 直接进心智模型",
          "with": "「专注」在产品、招聘、战略三个域复现 + 能推断新立场 + 别人不这么想 → 才进"
        },
        "therefore": "给「什么算核心思想」定三条可执行的判据，不达标的降级而不是删除。",
        "mechanismQuote": "验证1: 跨域复现——出现在至少 2 个不同领域。验证2: 有生成力——可以推断此人对新问题的可能立场。验证3: 有排他性——不是所有聪明人都会这样想。……仅 1-2 重 → 降级为决策启发式；0 重 → 不纳入。",
        "mechanismNote": "三条判据分别防三种假货：孤例、死知识、普通常识。降级通道让筛选不粗暴——过一两重的仍是有用的启发式。",
        "solutionLayer": "流程解法",
        "transferability": "高",
        "useWhen": "任何要从大量候选里挑「真正核心」的提炼任务。判据可换，结构不变：多重验证 + 降级通道。",
        "tooHeavyWhen": "候选本来就只有三五个，筛选仪式比直接判断还贵。",
        "antiExample": "只数出现次数（出现 ≥3 次就算）——高频口癖会通过，那是表达 DNA 不是心智模型。",
        "seenIn": "huashu-nuwa",
        "counterScenarios": [
          {
            "when": "候选 15-30 个的人物提炼",
            "effect": "管用",
            "why": "这正是它的设计场景"
          },
          {
            "when": "材料极少的冷门人物",
            "effect": "得让一步",
            "why": "跨域复现凑不齐 2 个域，标注推测属性"
          },
          {
            "when": "提炼一个领域的方法论",
            "effect": "看情况",
            "why": "排他性要改成「流派区分度」"
          }
        ],
        "related": [
          {
            "to": "A1",
            "label": "金句不是 DNA",
            "relation": "前置：先定表征目标，再谈筛选标准"
          },
          {
            "to": "A6",
            "label": "矛盾是特征不是 bug",
            "relation": "区别于：筛的是真假，矛盾处理的是真与真打架"
          }
        ]
      },
      {
        "id": "A3",
        "title": "六维取证",
        "dimension": "领域-认知",
        "symptom": "人设张口闭口「现实扭曲力场」「改变世界」——溯源发现调研产物前三条全出自同一篇 10w+ 文章。它学会了爆款文里的词，却不知道 1997 年他回归后砍掉 70% 产品线时是怎么做决策的。",
        "evidence": "作者证词",
        "contrast": {
          "without": "搜「乔布斯 思维方式」读前 10 条结果",
          "with": "六个 agent 分头取证：著作/对话/表达/他评/决策/时间线，各有提取重点"
        },
        "therefore": "先设计「理解一个人需要哪几个观察面」，再让并行 agent 按面取证。",
        "mechanismQuote": "| 2 对话 | 被追问时的回答方式、即兴类比、改变立场的瞬间、拒绝回答的问题 | | 5 决策 | 决策背景与逻辑、事后反思、言行一致/不一致案例 |",
        "mechanismNote": "维度清单本身是被固化的方法论——「拒绝回答的问题」「言行不一致案例」这种提取重点，是作者对「怎么理解人」的认知，不是搜索技巧。并行只是执行手段。",
        "solutionLayer": "表征解法",
        "transferability": "高",
        "useWhen": "调研任何复杂对象（人、公司、技术栈）之前，先回答「理解它需要哪几个互相印证的观察面」。",
        "tooHeavyWhen": "对象简单或信息本来就少——六个 agent 翻一个只有十条公开信息的人，是仪式不是取证。",
        "antiExample": "开六个 agent 搜同一个关键词的不同页码——并行了，但没有维度。",
        "seenIn": "huashu-nuwa",
        "counterScenarios": [
          {
            "when": "公众人物深度建模",
            "effect": "管用",
            "why": "材料多且杂，维度防以偏概全"
          },
          {
            "when": "冷门人物",
            "effect": "得让一步",
            "why": "skill 自己降到 2-3 个模型 + 加大诚实边界"
          },
          {
            "when": "快速了解某人观点",
            "effect": "没必要",
            "why": "读一篇靠谱长访谈就够"
          }
        ],
        "related": [
          {
            "to": "A4",
            "label": "不存文件的调研等于没做",
            "relation": "搭配用：六路并行的产出必须各有住址"
          },
          {
            "to": "A9",
            "label": "信息源黑名单",
            "relation": "搭配用：维度保广度，黑名单保纯度"
          }
        ]
      },
      {
        "id": "A4",
        "title": "不存文件的调研等于没做",
        "dimension": "编排",
        "symptom": "提炼时我想引用 Agent 2 找到的那段 1995 年访谈原话，翻遍上下文，只剩它当时汇报的一句「已完成对话维度调研，发现若干有价值观点」——原话、出处、上下文全没了。",
        "evidence": "作者证词",
        "contrast": {
          "without": "子 agent 把调研总结返回在消息里",
          "with": "子 agent 写入 references/research/02-conversations.md，消息只报告写了什么"
        },
        "therefore": "并行任务开工前先钉死产物的文件名和位置，交接走文件不走上下文。",
        "mechanismQuote": "每个 subagent 必须把调研结果写入对应的 md 文件。不存文件的调研等于没做。",
        "mechanismNote": "配套的目录结构在 Phase 0.5 就建好（先有住址再有居民），自包含约束保证整个目录复制即用。",
        "solutionLayer": "流程解法",
        "transferability": "高",
        "useWhen": "任何多 agent 并行产出、下游还要消费的编排——文件系统是最便宜的共享内存。",
        "tooHeavyWhen": "单 agent 一口气完成的小任务，落盘是纯开销。",
        "antiExample": "让子 agent「记得保存重要发现」——没有钉死文件名的落盘要求等于没有要求。",
        "seenIn": "huashu-nuwa；book_skill 的每章独立 .typ 文件是同一招",
        "counterScenarios": [
          {
            "when": "多 agent 并行调研/写作",
            "effect": "管用",
            "why": "交接和审计都靠它"
          },
          {
            "when": "单次问答任务",
            "effect": "没必要",
            "why": "没有第二个消费者"
          },
          {
            "when": "产物是大二进制",
            "effect": "看情况",
            "why": "住址原则不变，格式要换"
          }
        ],
        "related": [
          {
            "to": "A3",
            "label": "六维取证",
            "relation": "前置：先有维度分工，才有六个住址"
          },
          {
            "to": "A5",
            "label": "便宜返工点检查点",
            "relation": "下游接管：落了盘，检查点才有东西可检"
          }
        ]
      },
      {
        "id": "A5",
        "title": "便宜返工点检查点",
        "dimension": "行为",
        "symptom": "Skill 交付，用户试了一句就回来：「这不像他，太鸡汤了。」回溯发现调研阶段搜到的就全是鸡汤文——400 行产物从地基起就是错的，整体重写。",
        "evidence": "作者证词",
        "contrast": {
          "without": "调研→提炼→构建→交付一口气跑完",
          "with": "调研后停一次（材料质量），提炼后停一次（方向），各等用户确认"
        },
        "therefore": "把检查点放在「上游产物刚成形、下游昂贵工作未开始」的位置，并给用户结构化摘要而不是原始材料。",
        "mechanismQuote": "这个检查点的意义：调研质量决定了最终 Skill 的上限。垃圾进垃圾出，在这里拦截比在 Phase 4 返工成本低得多。",
        "mechanismNote": "两个检查点位置不同分工不同：1.5 拦材料（来源数、矛盾点、不足维度），2.5 拦判断（模型对不对、缺不缺）。摘要由 merge_research.py 自动生成，降低用户的确认成本。",
        "solutionLayer": "流程解法",
        "transferability": "高",
        "useWhen": "流水线里存在「主观判断重 + 下游成本高」的环节时，在它前后各放一个。",
        "tooHeavyWhen": "全自动批处理场景——没有用户在场，检查点变成永久阻塞。",
        "antiExample": "每一步都问用户「可以继续吗」——那是把责任推给用户，不是检查点设计。",
        "seenIn": "huashu-nuwa",
        "counterScenarios": [
          {
            "when": "交互式长流水线",
            "effect": "管用",
            "why": "用户在场且返工贵"
          },
          {
            "when": "无人值守 cron 任务",
            "effect": "反而碍事",
            "why": "没人确认，流程卡死"
          },
          {
            "when": "三步以内的短任务",
            "effect": "没必要",
            "why": "返工本来就便宜"
          }
        ],
        "related": [
          {
            "to": "A4",
            "label": "不存文件的调研等于没做",
            "relation": "前置：检查点检查的就是落盘产物"
          },
          {
            "to": "A8",
            "label": "子 agent 独立验证",
            "relation": "对照：检查点靠用户把关，验证靠独立 agent 把关"
          }
        ]
      },
      {
        "id": "A6",
        "title": "矛盾是特征不是 bug",
        "dimension": "领域-认知",
        "symptom": "材料里同时有「专注就是说不」（1997）和「我们要同时做平板、手机、音乐」（2010）。默认 agent 写成「他主张在专注与多元之间取得平衡」——圆滑得不属于任何活人。Phase 4 把「观点高度一致」明确列为不通过信号：太假。",
        "evidence": "作者证词",
        "contrast": {
          "without": "「他既说过 X 也说过非 X，综合来看他认为折中」",
          "with": "「早期说 X（1997 访谈），后期转向非 X（2010 决策），张力保留」"
        },
        "therefore": "给矛盾建类型学（时间性/领域性/本质性），各有处理方式，禁止调和。",
        "mechanismQuote": "矛盾是人格的核心特征，不是需要修复的 Bug。……错误的处理方式：❌ 选一边忽略另一边 ❌ 编一个调和的解释 ❌ 假装矛盾不存在",
        "mechanismNote": "配套两条硬规则：调研侧「发现矛盾时保留矛盾，不要和稀泥」；验证侧「内在张力至少 2 对」——矛盾太少不通过。",
        "solutionLayer": "表征解法",
        "transferability": "高",
        "useWhen": "提炼对象是真实的人、组织、思想体系——任何本身就含张力的东西。",
        "tooHeavyWhen": "提炼的是规范文档或标准流程——那里的矛盾真是 bug，该修。",
        "antiExample": "罗列所有矛盾不分类——没有类型学的矛盾清单只是混乱，不是深度。",
        "seenIn": "huashu-nuwa",
        "counterScenarios": [
          {
            "when": "人物/思想建模",
            "effect": "管用",
            "why": "张力是辨识度的来源"
          },
          {
            "when": "技术规范提炼",
            "effect": "反而碍事",
            "why": "规范里的矛盾要消除不是保留"
          },
          {
            "when": "多流派主题 skill",
            "effect": "看情况",
            "why": "矛盾改叫流派分歧，处理方式类似"
          }
        ],
        "related": [
          {
            "to": "A2",
            "label": "三重验证筛模型",
            "relation": "区别于：那边筛真假，这边处理真与真的冲突"
          },
          {
            "to": "A8",
            "label": "子 agent 独立验证",
            "relation": "下游接管：「张力≥2 对」在验证站被机器检查"
          }
        ]
      },
      {
        "id": "A7",
        "title": "60 分诚实大于 90 分编造",
        "dimension": "品味",
        "symptom": "蒸馏一个只有 8 条公开信息的独立开发者，产物照样有七个心智模型——后五个是把《高效能人士的七个习惯》的通用道理换上了他的名字。看起来越完整，编造占比越高，越难发现。",
        "evidence": "作者证词",
        "contrast": {
          "without": "冷门人物照样产出 7 个模型的完整 skill",
          "with": "模型减至 2-3 个、每个标注「基于有限信息推测」、诚实边界加大篇幅"
        },
        "therefore": "把「诚实优先于完整」写成红线，并给信息不足定好降级动作。",
        "mechanismQuote": "宁可生成一个诚实标注了局限的 60 分 Skill，也不要生成一个看起来完美但实际上在编造的 90 分 Skill。",
        "mechanismNote": "不是一句口号，有配套机制：诚实边界是模板必备 section；冷门人物有专门的降级流程；验证标准要求「至少 3 条具体局限」，只写「不能替代本人」不算。",
        "solutionLayer": "流程解法",
        "transferability": "高",
        "useWhen": "任何生成式交付——把「质量不够时的降级动作」预先定义好，agent 才有编造之外的出路。",
        "tooHeavyWhen": "几乎没有。这条的成本只是篇幅变短。",
        "antiExample": "在末尾加一行「以上内容仅供参考」——免责声明不是诚实边界，具体说出哪个维度信息不足才是。",
        "seenIn": "huashu-nuwa；book_skill 的「付印前提醒人工通读」同源",
        "counterScenarios": [
          {
            "when": "信息稀疏的生成任务",
            "effect": "管用",
            "why": "编造风险最高的地方"
          },
          {
            "when": "信息充足的常规任务",
            "effect": "可以松点",
            "why": "降级动作很少触发"
          },
          {
            "when": "创意虚构写作",
            "effect": "用不上",
            "why": "编造就是任务本身"
          }
        ],
        "related": [
          {
            "to": "A3",
            "label": "六维取证",
            "relation": "前置：先尽力取证，谈不足才有底气"
          },
          {
            "to": "A5",
            "label": "便宜返工点检查点",
            "relation": "搭配用：信息不足在 1.5 检查点就向用户摊牌"
          }
        ]
      },
      {
        "id": "A8",
        "title": "子 agent 独立验证",
        "dimension": "行为",
        "symptom": "主 agent 报告：「三项测试均通过，风格高度还原。」用户上手第一个问题就穿帮——出题、答题、阅卷是同一个上下文，它考的全是自己刚写过的内容。能发现的问题，生成时就不会犯。",
        "evidence": "实测",
        "contrast": {
          "without": "主 agent 自查后报告「三项测试均通过」",
          "with": "spawn 子 agent 带着新 skill 答三类题，主 agent 对比结果"
        },
        "therefore": "验证者和生成者分离，测试题分三类各管一头（对方向、看分寸、防 AI 味）。",
        "mechanismQuote": "生成 Skill 后，用子 agent 执行 3 项测试（独立于主 agent，避免自评偏差）",
        "mechanismNote": "边缘测试的期望输出设计得很讲究——正确答案是「基于模型 X 和 Y 的推断，可能……但不确定」，斩钉截铁反而不通过。这在测试「知道自己不知道」的能力。\n2026-06 消融实测（小样本，N=1 生成者 + 2 独立评审）：同一份稀薄材料生成的人物 skill，生成者同上下文自检 6 PASS／0 FAIL；两个独立评审用同一张表一致给出 5 PASS／1 FAIL——漏掉的恰是承重项（心智模型应整体降级）。实验记录见 `ablation/`。",
        "solutionLayer": "流程解法",
        "transferability": "高",
        "useWhen": "任何 agent 生成、agent 验证的闭环——验证者必须是没参与生成的新上下文。",
        "tooHeavyWhen": "产物有机器可判的硬标准（编译、测试）时，先用机器，独立 agent 留给主观维度。",
        "antiExample": "同一个 agent「换个角度再检查一遍」——上下文没换，偏差还在。",
        "seenIn": "huashu-nuwa；本手册自己的 voice gate 独立审阅是同一招",
        "counterScenarios": [
          {
            "when": "主观质量验证（像不像、好不好）",
            "effect": "管用",
            "why": "没有机器标准，只能拼独立性"
          },
          {
            "when": "有编译器/测试套件的产物",
            "effect": "得让一步",
            "why": "机器先行，agent 补盲区"
          },
          {
            "when": "token 预算极紧",
            "effect": "看情况",
            "why": "独立验证翻倍成本，挑最贵的环节用"
          }
        ],
        "related": [
          {
            "to": "A5",
            "label": "便宜返工点检查点",
            "relation": "对照：用户把关方向，独立 agent 把关质量"
          },
          {
            "to": "A6",
            "label": "矛盾是特征不是 bug",
            "relation": "搭配用：「张力≥2」正是它检查的标准之一"
          }
        ]
      },
      {
        "id": "A9",
        "title": "信息源黑名单",
        "dimension": "平台",
        "symptom": "research/03 里赫然出现「乔布斯临终遗言曝光：财富不过是习惯了的生活」——溯源是公众号转知乎转贴吧，三手之后已无原始出处，而这条伪语录正是中文搜索的高权重结果。",
        "evidence": "作者证词",
        "contrast": {
          "without": "搜索结果按相关度照单全收",
          "with": "知乎/公众号/百度系永远排除，中文只收权威媒体白名单 + 原始音视频"
        },
        "therefore": "对失真率高的信息生态，用「永远排除」的黑名单 + 点名的白名单，不留自由裁量。",
        "mechanismQuote": "信息源黑名单（永远排除）：知乎：洗稿严重、信息失真率高，不作为任何维度的来源。微信公众号：封闭生态、无法验证……中文渠道只接受权威媒体：36氪、极客公园、晚点LatePost、财新……",
        "mechanismNote": "注意它的不对称设计：英文世界没有黑名单，中文世界黑白名单都点到具体平台名——这是对特定信息生态的精确补丁。",
        "solutionLayer": "流程解法",
        "transferability": "低",
        "lowReason": "平台伤疤——名单本身只对 2026 年前后的中文信息生态成立，平台兴衰后名单就过期。可迁移的只有「按生态失真率分级管控来源」这个抽象结构，具体名单不能搬。",
        "counterScenarios": [
          {
            "when": "中文公众人物调研",
            "effect": "管用",
            "why": "正是它的设计场景"
          },
          {
            "when": "英文人物调研",
            "effect": "用不上",
            "why": "skill 自己都没给英文设黑名单"
          },
          {
            "when": "三年后的中文调研",
            "effect": "看情况",
            "why": "名单需要重新校准"
          }
        ],
        "related": [
          {
            "to": "A3",
            "label": "六维取证",
            "relation": "搭配用：维度保广度，名单保纯度"
          }
        ]
      },
      {
        "id": "A10",
        "title": "需求诊断反推对象",
        "dimension": "需求",
        "symptom": "用户：「我总觉得自己做决定太慢，想来想去最后还是选错。」agent：「请问您想蒸馏哪位人物？」用户：「……我要是知道还问你干嘛。」对话当场冷掉。",
        "evidence": "作者证词",
        "contrast": {
          "without": "「请问你想蒸馏哪位人物？」",
          "with": "一轮追问定位场景 → 给 3 个带局限说明的候选 → 用户挑"
        },
        "therefore": "把「需求 → 对象」的反推做成对照表 + 追问轮数上限 + 固定的候选展示格式。",
        "mechanismQuote": "追问原则：最多问 2 轮，不要变成问卷调查。……推荐原则：不超过 3 个候选，选择困难比没选择更糟。……必须说清楚局限——没有万能的思维框架。",
        "mechanismNote": "十行需求维度表把开放问题变成查表；候选格式强制三栏（核心镜片/为什么适合你/局限），推荐自带反面。\n2026-06 消融实测补注：3 个基线 agent 收到同款模糊需求，没有一个干瘪反问（基线比卡面场景强了），但 3/3 走向「造通用决策工具」、0/3 想到人物蒸馏——这张对照表的现代价值是把模糊需求路由进基线到不了的解法空间。见 `ablation/`。",
        "solutionLayer": "流程解法",
        "transferability": "高",
        "useWhen": "任何入口可能收到模糊需求的 skill——把「澄清」做成有上限的结构化流程，而不是开放式反问。",
        "tooHeavyWhen": "工具型 skill 的输入本来就是结构化参数，没有模糊空间。",
        "antiExample": "连问五轮的「需求调研问卷」——澄清失控成审讯，违反它自己的轮数上限。",
        "seenIn": "huashu-nuwa",
        "counterScenarios": [
          {
            "when": "面向非专家的入口",
            "effect": "管用",
            "why": "用户说不清需求是常态"
          },
          {
            "when": "专家用户 + 明确指令",
            "effect": "不用做",
            "why": "直接路径已经覆盖"
          },
          {
            "when": "需求维度无法枚举的领域",
            "effect": "得让一步",
            "why": "对照表退化成示例集"
          }
        ],
        "related": [
          {
            "to": "A7",
            "label": "60 分诚实大于 90 分编造",
            "relation": "搭配用：候选必须写局限，是同一种诚实"
          }
        ]
      },
      {
        "id": "A11",
        "title": "字幕管线脚本化",
        "dimension": "领域-工程",
        "symptom": "agent 手工下了自动字幕、没清洗就入库——频次统计第一名是时间戳箭头「-->」，而且滚动重复让每句话出现 2-3 次，恰好污染提炼标准里「反复出现 ≥3 次＝真信念」这条核心判据。分析废了，但表面看不出来。",
        "evidence": "实测",
        "contrast": {
          "without": "agent 自己摸索 yt-dlp 参数再手工清洗",
          "with": "bash download_subtitles.sh <URL> → python3 srt_to_transcript.py，两步出干净文本"
        },
        "therefore": "把易错且重复的素材处理做成开箱即用的脚本，agent 只负责调用。",
        "mechanismQuote": "Step 1 下载字幕：bash [skill目录]/scripts/download_subtitles.sh——自动优先人工字幕 → 中文 → 英文 → 自动生成字幕。Step 2 清洗为纯文本：srt_to_transcript.py——去时间戳、序号、HTML标签、连续重复行。",
        "mechanismNote": "四个脚本各管一段机械活：下载、清洗、调研统计（merge_research.py）、质量自检（quality_check.py）。「自动优先人工字幕」这种 fallback 顺序就是踩坑后固化的经验。\n2026-06 消融实测：真实形态的滚动自动字幕直接入库，最高频 token 是「-->」（10 次）、HTML 标签混入、每句因滚动重复出现 2-3 次；经 `srt_to_transcript.py` 清洗后每句一次、无任何残留。记录见 `ablation/`。",
        "solutionLayer": "脚本解法",
        "transferability": "高",
        "useWhen": "流程里有「步骤固定、参数易错、重复执行」的环节——判断标准是你会不会想给 agent 写操作说明书，会就改成脚本。",
        "tooHeavyWhen": "只执行一次的探索性操作，写脚本比手工还贵。",
        "antiExample": "把需要判断的活也塞进脚本（比如「自动挑选最有价值的访谈」）——脚本接管机械，不接管判断。",
        "seenIn": "huashu-nuwa；book_skill 的 chroma_key.py / build_book.py 同款思路",
        "counterScenarios": [
          {
            "when": "高频重复的素材处理",
            "effect": "管用",
            "why": "错误率和成本同时降"
          },
          {
            "when": "一次性探索操作",
            "effect": "没必要",
            "why": "脚本化成本收不回"
          },
          {
            "when": "步骤需要临场判断",
            "effect": "反而碍事",
            "why": "脚本会把判断写死"
          }
        ],
        "related": [
          {
            "to": "A3",
            "label": "六维取证",
            "relation": "搭配用：脚本喂干净素材，agent 专心取证"
          }
        ]
      }
    ],
    "residue": [
      {
        "item": "Phase 5 双 Agent 精炼的两个固定视角",
        "verdict": "平台伤疤",
        "reason": "Agent A/B 分别要求「auto-skill-optimizer 视角」「skill-creator 视角」——这是对作者本地 skill 生态的依赖。换一个没有这两个 skill 概念的环境，这段指令退化成普通的「再审一遍」。独立精炼这个动作有效（见 A8），但绑定具体外部 skill 名是本项目特有。"
      },
      {
        "item": "「品味守则（速查）」小节",
        "verdict": "过度设计",
        "reason": "三条守则（长文>金句、争议>共识、变化>固定）的内容已经分散体现在六维提取重点和三重验证里，速查表与 Phase 4 通过标准表也大面积重叠。去掉后行为应当不变——未实测，置信度中等。"
      }
    ],
    "blindSpots": [
      "同名人物歧义没有处理指引：「蒸馏张伟」会发生什么，skill 没有写。",
      "信息源黑名单靠 agent 自觉遵守，调研产物没有机器校验来源合规的环节（quality_check.py 只查最终 SKILL.md）。",
      "蒸馏在世人物的争议立场（政治表态、诉讼中的指控）可能带来名誉风险，skill 没有任何处理指引。",
      "「为什么是这六个维度」缺少作者解释——少一维会怎样、能不能换一维，无从验证。"
    ]
  },
  "applyIt": {
    "h1": "换个领域，把这套招画一遍",
    "summary": "你已经看完十一张卡。现在不读了，动手——拿高可迁移的卡组装一个新 skill 的骨架。",
    "skeleton": [
      {
        "kind": "para",
        "text": "十一张卡是零件。最大的那件可迁移物，是零件的组装方式——女娲的整体形状本身就是一个流水线原型，适用于任何「从杂乱材料提炼可靠交付物」的任务："
      },
      {
        "kind": "quote",
        "text": "澄清对象 → 钉住址 → 多维取证 → 检查点 → 多重验证提炼 → 检查点 → 按模板组装 → 独立验证"
      },
      {
        "kind": "para",
        "text": "骨架有三条不变式，换领域时形可以变、这三条不能丢："
      },
      {
        "kind": "list",
        "items": [
          "站与站之间只走文件交接，每个产物在开工前就有定死的住址（A4 的全局化）；",
          "检查点钉在「主观判断最重、下游返工最贵」的接缝上，本骨架里是取证之后和提炼之后（A5 的全局化）；",
          "每一层都有诚实降级的出路——材料不足减产出、判据不达标降级、迭代到上限就标注薄弱交付（A7 的全局化）。"
        ]
      }
    ],
    "scenario": [
      {
        "kind": "para",
        "text": "你要做一个「公司尽调顾问」skill：输入一个公司名，产出一份给投资人看的判断备忘录——这家公司的护城河、风险、值不值得深入。"
      },
      {
        "kind": "para",
        "text": "和蒸馏乔布斯结构同源：对象复杂、材料杂、二手信息多、结论需要证据链、信息常常不足。但每张卡都要重新校准——公司不是人，「表达 DNA」在这里对应什么？「内在张力」呢？"
      }
    ],
    "tasks": [
      "选卡：A1-A11 里哪几张直接适用？哪几张要改造才能用？哪张明确不适用（提示：有一张平台卡）？",
      "设计取证维度：仿照 A3，写出「理解一家公司」的 5-6 个观察面，每个面给两条具体的提取重点（不许写「搜索相关信息」）。",
      "画骨架：写出阶段链（参考六站结构）、每站的中间产物文件名、两个检查点的位置和各自拦什么。",
      "写验证：仿照 A2，给「什么算这家公司的核心护城河」定三条判据；仿照 A8，给最终备忘录设计三类独立测试。"
    ],
    "referenceAnswer": [
      {
        "kind": "para",
        "text": "一种可行的组法（不是唯一解）："
      },
      {
        "kind": "para",
        "text": "直接适用的卡：A4（住址先行）、A5（检查点）、A7（诚实边界）、A8（独立验证）、A10（需求诊断——「帮我看看这家公司」往往没说看什么）、A11（财报下载解析脚本化）。"
      },
      {
        "kind": "para",
        "text": "需要改造的卡：A1 的表征问题变成「备忘录的中间产物是新闻摘要还是判断系统」——对应物是「投资论点 + 反论点」而不是新闻清单。A3 的六维可换成:财报与披露 / 创始人言行 / 客户与渠道证言 / 竞品对比 / 监管与诉讼记录 / 时间线与转折点。A6 的矛盾类型学照搬：管理层说的 vs 财报显示的，正是「言行不一致案例」。"
      },
      {
        "kind": "para",
        "text": "不适用的卡：A9 的具体名单——但「按生态失真率管控来源」的结构可以重建（比如股吧/雪球评论区进黑名单，交易所披露文件最高权重）。"
      },
      {
        "kind": "para",
        "text": "阶段链：需求澄清（看什么维度）→ 建目录（research/01-06 + sources/filings）→ 并行取证 → 检查点①（来源质量表）→ 提炼投资论点（多重验证：跨来源印证/可证伪/有反论点）→ 检查点②（论点确认）→ 组装备忘录 → 独立子 agent 测试（已知案例对方向 / 边缘问题看分寸 / 风格测试防车轱辘话）。"
      }
    ],
    "starterPrompt": "你是一个公司尽调顾问 skill 的设计者。\n要求：\n1. 先设计取证维度（参考六维取证：理解一家公司需要哪几个互相印证的观察面？）\n2. 定死中间产物的文件名和目录结构（先有住址再有居民）\n3. 找出流程里主观判断最重的一站，在它前后各放一个检查点\n4. 写出「什么算核心判断」的多重验证标准 + 降级通道\n5. 写出信息不足时的降级动作（诚实边界）\n6. 最后用独立子 agent 验证，给出三类测试题",
    "nextSteps": {
      "author": [
        "给信息源黑名单补一个机器校验环节（盲区第二条），把来源合规从自觉变成检查",
        "给同名人物歧义加一步消歧提问（盲区第一条）",
        "考虑把「品味守则」速查表合并进 Phase 4 标准，消掉重复（残渣第二条）"
      ],
      "thief": [
        "把 A4「先有住址再有居民」搬进你的多 agent 编排——这是迁移成本最低的一张卡",
        "下次写「从材料提炼知识」的 skill 时，先回答 A1 的问题：中间产物是表面特征还是生成机制？",
        "给你的生成类 skill 写一条 A7 式红线 + 信息不足时的降级动作"
      ]
    }
  },
  "glossary": [
    {
      "term": "心智模型",
      "definition": "一个人看世界的镜片，能用来推断他对没讨论过的新问题的立场。例：纳瓦尔的「杠杆」——在财富、成长、职业选择三个域复现。",
      "whereItAppears": "stage-05 提炼的核心产物，stage-06 填进模板",
      "solvedProblem": "防止人设只会复述旧观点（金句没有生成力）",
      "howToUse": "每个模型记录名称、一句话描述、≥2 个场景的来源证据、应用方式、局限",
      "commonMisread": "不是「他说过的重要的话」——必须过三重验证；高频金句往往只是表达 DNA"
    },
    {
      "term": "决策启发式",
      "definition": "此人做判断的快速规则，能写成「如果 X 则 Y」并有案例支撑。例：「如果要做市场调研，就已经输了」。",
      "whereItAppears": "stage-05（三重验证只过 1-2 重的候选降级到这里）",
      "solvedProblem": "给不够格当模型但真实存在的判断规则一个去处，避免硬塞或硬删",
      "howToUse": "5-10 条，每条带场景和案例",
      "commonMisread": "不是模型的次品——它是「具体场景的规则」，模型是「跨域的镜片」，层级不同"
    },
    {
      "term": "表达 DNA",
      "definition": "此人说话的可量化指纹：句式偏好、高频词、节奏、幽默方式、确定性表达。例：统计 20 个段落的类比密度和转折频率。",
      "whereItAppears": "Agent 3 取证（stage-03），stage-05 的 2.3 节分析，stage-06 转成风格规则",
      "solvedProblem": "防止生成的 skill 说话像通用 ChatGPT（风格测试不通过）",
      "howToUse": "转为角色扮演规则；口癖适度使用——「太多变成模仿秀」",
      "commonMisread": "表达 DNA 管「怎么说」，心智模型管「怎么想」——只有 DNA 没有模型，就是开场那个金句人设"
    },
    {
      "term": "三重验证",
      "definition": "候选论点升级为心智模型的三道筛：跨域复现（≥2 个领域出现）、有生成力（能推断新立场）、有排他性（不是人人都这么想）。",
      "whereItAppears": "stage-05，方法论住在 extraction-framework.md",
      "solvedProblem": "随口一说和真信念在单条材料里无法区分",
      "howToUse": "三重全过 = 模型；1-2 重 = 降级为启发式；0 重 = 不纳入",
      "commonMisread": "不是数出现次数——高频不等于跨域，口癖出现一百次也过不了排他性"
    },
    {
      "term": "诚实边界",
      "definition": "skill 必须明确写出的「我做不到什么」：不能预测全新问题的反应、公开表达与真实想法可能有差、信息截止日期。",
      "whereItAppears": "stage-05 的 2.6 节产出，stage-06 是模板必备 section，验证要求至少 3 条具体局限",
      "solvedProblem": "信息不足时强行写满 = 编造（60 分诚实 > 90 分编造）",
      "howToUse": "信息越少这一节越长；冷门人物每个模型标注「基于有限信息推测」",
      "commonMisread": "不是免责声明——「仅供参考」不算，「05 决策维度只找到 2 条可用来源」才算"
    },
    {
      "term": "Agentic Protocol",
      "definition": "写进生成的人物 skill 里的回答工作流：先分类问题（要事实/纯框架/混合），需要事实的必须先用工具研究再回答，研究维度从此人的心智模型推导。",
      "whereItAppears": "stage-06 构建时生成，是模板里唯一「按人定制生成」而非填空的段落",
      "solvedProblem": "人设「说得像」但遇到事实问题凭训练语料编造（开场的 Vision Pro 失败）",
      "howToUse": "芒格查激励结构、塔勒布查尾部风险——维度必须来自模型，不能是通用的「搜索相关信息」",
      "commonMisread": "不是给女娲自己用的——它是女娲写进产物里的，让生成的 skill 在运行时也先做功课"
    }
  ]
};
