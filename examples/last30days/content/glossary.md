### Resolved 情报块
**定义:** Step 0.5/0.55 的产出,把话题从自然语言映射到各平台的具体账号和社区。
**例:** `Resolved: - X: @kanyewest (+ @travisscott, @PopBase) - Reddit: r/Kanye, r/WestSubEver, r/hiphopheads - TikTok: #kanyewest, #ye, #bully`
**它在哪个 stage 出现:** stage-02 产出,stage-03 和 stage-04 读取使用
**它解决什么问题:** 搜「Peter Steinberger」只能找到提到名字的帖子,搜「@steipete」才能找到他的推文和互动圈。Resolved 块把这层转换提前做完,后续所有步骤都不用猜。
**我怎么用它:** 模型用 WebSearch 逐项解析,写成固定格式的文本块展示给用户,然后拆成 CLI 参数（--x-handle, --subreddits 等）传给引擎。
**容易误解:** 不是引擎自动生成的 - 是模型自己做的工作。引擎的 --auto-resolve 是无头模式的回退,不是首选。

### 查询计划 JSON
**定义:** Step 0.75 的产出,一份 JSON 文件,告诉引擎搜什么、在哪搜、每条搜索多重要。
**例:** `{"intent":"breaking_news", "subqueries":[{"label":"primary", "search_query":"kanye west", "sources":["reddit","x","youtube"], "weight":1.0}]}`
**它在哪个 stage 出现:** stage-03 产出,写入 tmpfile 后通过 --plan 传给 stage-04
**它解决什么问题:** 模型手头有完整的话题上下文和情报,引擎只看到话题字符串。让信息更丰富的一方来规划搜索策略。
**我怎么用它:** 模型按 schema 生成 JSON,用 heredoc 写入 tmpfile（不 inline 传 - 撇号会断 shell 引号）,然后在引擎命令里加 `--plan "$QUERY_PLAN_FILE"`。
**容易误解:** 不是引擎内部的 Gemini planner - 那是 cron 回退。在推理模型驱动的场景,模型就是 planner。LAW 7 说得明白:「you ARE the provider」。

### 证据集群
**定义:** 引擎 compact 输出中按故事/主题分组的证据块,每个集群跨越多个信号源。
**例:** `### 1. BULLY dropped and fans are split (score 85, 12 items, sources: Reddit, X, YouTube, TikTok)`
**它在哪个 stage 出现:** 引擎 stdout（stage-04 的产出）,在 EVIDENCE FOR SYNTHESIS 注释边界内
**它解决什么问题:** 传统做法是按源分组（所有 Reddit、所有 X）,看不出跨源的故事线。按故事分组后,一个集群里有 Reddit 讨论+X 评论+YouTube 评测+TikTok 反应,模型合成时一个段落就能覆盖一个完整叙事。
**我怎么用它:** 读集群标题和置信度标签（multi-source 最强,single-source 需谨慎,thin-evidence 要加限定词）,用集群内的引用和互动数据来写 What I learned 段落。这些是工作素材,不是输出 - 直接贴给用户是 LAW 6 违规。
**容易误解:** 不是最终输出格式 - 证据集群是 EVIDENCE FOR SYNTHESIS 区域里的素材,模型必须把它转化成叙事段落。两次 Hermes Agent 灾难就是直接把这些贴给了用户。

### emoji-tree 统计脚注
**定义:** 引擎 compact 输出末尾的统计信息块,以 `✅ All agents reported back!` 开头,用 emoji-tree 格式展示每个信号源的命中数和互动总量。
**例:** `├─ 🟠 Reddit: 14 threads (892 upvotes, 234 comments)`
**它在哪个 stage 出现:** 引擎 stdout 的 PASS-THROUGH FOOTER 区域（stage-04 产出）,在 stage-05 合成时直接透传
**它解决什么问题:** 引擎已经算好了每源的计数和互动总量。如果让模型重算,数字会对不上。统计脚注是引擎的可信产出,模型只需要原样复制。
**我怎么用它:** 从引擎 stdout 里找到 `<!-- PASS-THROUGH FOOTER -->` 到 `<!-- END PASS-THROUGH FOOTER -->` 之间的内容,原样贴到合成输出的 KEY PATTERNS 和 invitation 之间。不重算、不重排、不删零项（引擎已经删了）。
**容易误解:** 不是模型自己写的统计 - 是引擎写的,模型只透传。LAW 5 的全部意义就是防止模型重新计算这些数字。

### LAW
**定义:** 输出格式的硬约束规则,编号 1-8,每条覆盖一个具体的格式违规。
**例:** LAW 1 = 禁止 Sources: 尾巴；LAW 3 = 禁止 em-dash；LAW 8 = 引用必须是内联链接。
**它在哪个 stage 出现:** stage-05 合成时执行,但规则定义在 SKILL.md 顶部（OUTPUT CONTRACT 节）
**它解决什么问题:** 模型合成长文时会自动回到默认习惯（加标题、用 em-dash、贴 Sources 列表）。每条 LAW 有真实灾难日期:LAW 1 有 Peter Steinberger 三次泄漏,LAW 6 有 Hermes Agent 两次证据倾倒。日期锚定让规则不像「通用最佳实践」,而像「被烧过的疤」。
**我怎么用它:** 合成前重读 LAW 1-8,合成后逐条自检。如果某条 LAW 被违反,只允许重新生成一次。
**容易误解:** 不是通用写作规范 - 是 `/last30days` skill 内部的格式约束,只在 skill 输出中生效。skill 外的对话不受 LAW 约束。SKILL.md 明确说:「Global preferences apply OUTSIDE this skill; inside `/last30days` synthesis, the voice contract is the contract.」
