# Handbook brief · web-video-presentation

源包：`/home/guwanhua/Desktop/git/garden-skills/skills/web-video-presentation`（garden-skills 集合，manifest v1.1.3）

## 包结构地图

```text
web-video-presentation/
├── SKILL.md                 # 入口：4 Phase + 2 硬检查点 + 3 种开发模式 + 自检协议
├── manifest.json / README.md / README.zh-CN.md
├── references/
│   ├── SCRIPT-STYLE.md      # 文章→口播稿：信息保留度≥60% + 8 形式原则 + 去AI味五类 + 三层自检
│   ├── OUTLINE-FORMAT.md    # outline 字段 spec：只写节奏不写动画 + 信息池 + 自检
│   ├── CHAPTER-CRAFT.md     # 单章开发单一入口：视觉演示底线 + 逐步揭示 + token 红线 + 完工自检
│   ├── THEMES.md            # token 契约（16 必填+性格+装饰）+ 10 主题 + 创作流程
│   ├── AUDIO.md             # narrations→segments→mmx 流程 + 退化路径 + Auto 推进规则
│   ├── RECORDING.md         # ?auto=1 一镜到底 + 手动录屏备用
│   └── EXAMPLES/            # hook-chapter / list-reveal / case-tech-review（看形不照搬）
├── scripts/scaffold.sh      # 一键脚手架（npm create vite + 模板覆盖 + typecheck）
├── templates/               # Vite+React+TS 工程模板（Stage/useStepper/useAudioPlayer/extract-narrations…）
└── themes/<id>/{theme.json,tokens.css} × 10
```

## 基线声明

基线：同款模型、不带本 skill、用户一句话 prompt（「把我这篇文章做成视频网页」）的默认 agent。
领域难点另加人类基线：会写 React 但没做过录屏视频网页的合格前端工程师。

## 一句话总任务

把一篇文章变成可录屏的 16:9 点击驱动网页视频：先一次产出口播稿和开发计划，让用户一次对齐五件事，再以第一章为风格锚点逐章开发，最后可选合成音频用 `?auto=1` 一镜到底录屏。

## 贯穿例子

- **label:** 三分钟测评视频《我让 5 个 AI 工具重写我的博客》
- **用户请求:** 「这是我公众号那篇《我让 5 个 AI 工具重写我的博客》，大概 2000 字，帮我做成 B 站视频。」
- **为什么挑:** 科技测评是源包 `case-tech-review` anchor 和 midnight-press 主题 `bestFor`（AI / 工具评测）双命中的主路径题材；自带数字、对比、案例，信息池和双源原则都有真实用武之地；「5 个工具」天然演示 1 项=1 step。
- **预期产出:** `my-video/`：script.md（约 1280 字 / 约 5 分 20 秒，保留度 64%）+ outline.md（5 章 38 步 + 每章信息池 + 素材清单）+ `presentation/` Vite 工程（midnight-press）+ 38 个 mp3 + `?auto=1` 一镜到底录屏成片。
- **样本来源声明:** 源包不带成品案例（examples 只有结构 anchor），贯穿例子的 script/outline/章节代码摘录为**模拟样本**；工程类摘录（scaffold 输出、audio-segments.json、Example.tsx、tokens.css、hook 注释）全部来自 `/tmp/wvp-slice` 切片实测或源包原文。

## Ordinary-view pain scan

基线：同款模型、不带本 skill、用户一句话 prompt 的默认 agent。

| Ordinary assumption | Real friction | First visible symptom | Dimension | Evidence | Skill mechanism | Where it appears |
| --- | --- | --- | --- | --- | --- | --- |
| 网页做完配上音就行 | step 数和口播文本散落在 script/outline/章节代码/chapters.ts/音频文件 5 处，必然漂移 | Auto 录屏到中段画面和口播错位，「对不上嘴」 | 领域-认知 | 作者证词（AUDIO.md「这一改根除了…老问题」；extract 报错原文「The {text, minHoldMs} form was removed」） | narrations.ts 唯一真相源：数组长度=step 数，音频文本=数组元素；chapters.ts 不写 totalSteps | stage-06 / dataflow / A1 |
| 开发计划写得越细越好 | outline 写死动画 → 章节实现退化成翻译机 | 全片 N 章同一种入场动画，观众看出模板感 | 领域-认知 | 作者证词（SKILL.md outline 边界表：「写死动画 = chapter agent 退化为翻译机」） | outline 只写节奏/屏幕内容/信息池，动画留白给章节即时设计 | stage-01 / A2 |
| 转口播=改写得口语点 | AI 默认摘要化，先删案例、反方观点、论证中间步 | 2000 字文章变 600 字「精华」，关键案例整段消失 | 行为 | 作者证词（「不要自作主张缩到 30% 然后假装做完了」） | 信息保留度 ≥ 60% 硬下限（wc -m 可机器验证）+ 超长时上报谈判 | stage-01 / A3 |
| 短句化+第二人称=像人话 | 形式合规但腔调仍是 AI（假共情/假深刻/自我标榜/万能模板/排比） | 开头一句「我知道你最近肯定很纠结」，念出来油腻 | 品味 | 作者证词（去 AI 味五类清单 + 「口播比文字更怕 AI 味」） | 三层自检：形式 8 条 → 风骨五类 → 张嘴念出来测试 | stage-01 / A4 |
| 列表就该一屏列出来 | 默认 agent 一个 step 把 N 项 stagger 全上 | 口播讲到第二点时画面早全亮，观众跟丢 | 行为 | 作者证词（CHAPTER-CRAFT「最重要的一条」+「严禁」） | 1 项=1 step；讲 Y 时 X 灰化保留作上下文 | stage-04/05 / A5 |
| 多停几次确认更安全 | 散点确认烦用户，不确认返工成本爆炸 | 成片后用户说「主题不对」→ N 章全部重做 | 需求 | 作者证词+结构推断（SCRIPT-STYLE「流程变化提醒」：旧版两个 checkpoint 合并为一） | Checkpoint Plan 一次对齐 5 件事；主题必须明确才进 Phase 2 | stage-02 / A6 |
| 章节可以直接并行开干 | 指引盲区会在所有章节同时爆发 | 并行 4 章踩同一个坑，修复成本 ×4 | 编排 | 作者证词（「这时候有人类反馈就能修指引/调主题，早改成本最低」） | 第 1 章强制主线程完整做 + 用户硬验收，作风格锚点 | stage-04 / A7 |
| 并行就要风格完全一致 | subagent 互相看不见，机械对齐不可能 | 要么互改共享文件冲突，要么色板字体跑偏 | 编排 | 作者证词（模式 C 四条理由） | token 兜底 + 每章独立文件夹/CSS 前缀 + 不动 chapters.ts；风格差异定义为「呼吸感」 | stage-05 / A8 |
| 动画长了等一等就好 | Auto 模式严格按音频结束推进，无「等动画」兜底 | 录屏里动画演到一半被当场切断 | 领域-工程 | 作者证词+实测（useAudioPlayer 注释「intentionally no minimum hold knob」；切片工程确认 {text,minHoldMs} 已删） | 动画时长 ≤ 口播时长（字数÷4 估秒）+ 三选一：加口播/拆 step/加速 | stage-05/06 / A9 |
| 写完就能交付 | agent 写完直接报「做完了」，问题留给用户验收发现 | 用户验收才发现纯文字章节/硬编码颜色 | 行为 | 作者证词（「直接拿原始结论汇报但不修复 = 违规」） | 硬性自检协议：Teams→subagent→自检 三级降级 + 先修复再汇报 | 贯穿 / A10 |
| 指引读一遍就够 | 长会话上下文衰减，第 5 章开始走样 | 后期章节又出现纯文字堆砌 | 行为 | 作者证词（「长会话里 agent 容易遗忘原则」） | 阶段文件读取表：CHAPTER-CRAFT.md 每章必读 ×N 次 | stage-05 / A11 |
| 网页就该响应式 | 录屏需要稳定坐标系，响应式让排版随设备漂 | 不同机器录出来字号布局不一样 | 领域-认知 | 结构推断（1920×1080 + transform scale，模板无任何断点）| 16:9 固定舞台：内容写死在 1920×1080，外层整体缩放 | stage-03 |
| 口播稿就是画面文案 | 画面只打口播字幕 = PPT | 屏幕把口播打字打了一遍 | 领域-认知 | 作者证词（「那就是 PPT，不是视频」） | 双源原则：script 定节拍，article 定画面密度；信息池每条带来源标注 | stage-01/04 / A12 |
| 浏览器自动播就是播 | autoplay policy 拦截无手势播放 | `?auto=1` 打开后无声卡死 | 平台 | 作者证词+结构推断（useAutoMode 注释「browsers require a user gesture」） | AutoStartGate：按一次 Space 解锁，之后全自动 | stage-07 |
| 换主题肯定要改章节 | 章节硬编码颜色字体，换主题破版 | 切主题后某章颜色违和 | 领域-工程 | 作者证词（THEMES.md「bug 在章节里，不在主题里」） | 颜色/字体强制 token + primitive class 接性格；字号/间距/时长自由 | stage-03/05 |
| 本地缓存无害 | 改章节结构后旧 localStorage 游标越界 | 打开页面落在不存在的 step | 平台 | 作者证词+实测（SKILL.md 2.5 bump 规则；useStepper sanitize 代码） | STORAGE_KEY bump + 运行时 sanitize 双保险 | stage-05 |
| 没装 TTS 就先模拟 | agent 假装合成成功 | 用户拿到一堆不存在的 mp3 路径 | 行为 | 作者证词（「不要悄悄假装合成成功」）+实测（本机无 mmx，脚本显式报错给出三选项） | which mmx 检测 → 显式退化菜单（装/换 TTS/跳过） | stage-06 |

七维对账：领域-工程 ✓（动画≤口播、token 红线）；领域-认知 ✓（真相源、outline 留白、固定舞台、双源）；行为 ✓（保留度、逐步揭示、自检、重读、不假装）；编排 ✓（风格锚点、并行隔离）；品味 ✓（去 AI 味）；需求 ✓（一次对齐五件事）；平台 ✓（autoplay、localStorage）。无空维度。

## 全量盘点附录

### 中间产物清单（完整）

| 产物 | 谁写 | 谁读 |
| --- | --- | --- |
| `article.md` | 用户（agent 落盘保留，不删） | outline 信息池抽取、每章实现回抽细节 |
| `script.md` | stage-01 | outline 切节拍、narrations.ts 取文本、音频合成 |
| `outline.md`（含信息池+素材清单） | stage-01 | Checkpoint Plan 用户审、每章开发读对应段落 |
| `presentation/`（Vite 工程） | scaffold.sh | 后续全部阶段 |
| `.theme` | scaffold.sh | 人查「从哪个主题起步」 |
| `src/styles/tokens.css` | scaffold.sh 拷自所选主题 | 全部章节 CSS |
| `src/chapters/NN-id/{Chapter.tsx,Chapter.css}` | 每章开发 | 运行时渲染 |
| `src/chapters/NN-id/narrations.ts` | 每章开发 | useStepper（step 数）、extract-narrations、Auto 模式 |
| `src/registry/chapters.ts` | 每章注册一行 | useStepper、extract-narrations |
| `audio-segments.json` | extract-narrations.ts | 用户 review、synthesize-audio.sh |
| `public/audio/<id>/<N>.mp3` | synthesize-audio.sh | useAudioPlayer |
| localStorage 游标（STORAGE_KEY） | useStepper 运行时 | useStepper 恢复进度 |
| 录屏成片 | 用户录屏工具 | 最终交付 |

### 风险缓解（非难点，三问②答「小概率」）

- scaffold.sh 非空目标目录中止（防覆盖）
- useStepper 的 sanitize（STORAGE_KEY bump 之外的运行时兜底）
- synthesize-audio 串行调用 + 已存在跳过 + `--force`（rate limit / 断点续合）
- `data-no-advance` 防交互元素误推进 step
- 数字键 1-9 跳章、Home/End（操作便利）
- 空串 narration 跳过 TTS + 字数估时撑过（无声过场）

### 残渣与砍掉候选

- **文档漂移群（货物崇拜判定）：** SKILL.md / OUTLINE-FORMAT.md / EXAMPLES/README.md 大量引用 CHAPTER-CRAFT.md 的「Part 0 十条原则 / Part 1 开工 5 问 / Part 2 决策树 / Part 3 视觉工具箱 / Part 4 时长 / Part 8 反馈速查」分节，但出厂 CHAPTER-CRAFT.md（225 行）里**没有任何 Part 标题**，也没有五问/决策树/工具箱/速查内容；README 引用的 `PRINCIPLES.md`、`PATTERNS.md` 不存在；README 流程图还是旧版双 checkpoint（A1/A2）。证据：实测（逐文件比对）。
- **出厂示例违反出厂红线：** CHAPTER-CRAFT 原则「舞台无 chrome：没有 header/footer」+ 完工自检「禁止任何形式的页眉页脚」，但模板自带 Example.tsx 每个 step 都渲染 `masthead` 页眉（THEMES.md 还要求测试「masthead 行读起来像编辑 chrome」）。两份规范打架。证据：实测。
- **scaffold.sh 绝对路径（平台伤疤实测）：** create-vite@9 把绝对路径目标当相对路径处理（`/tmp/wvp-slice` 被建到 `./tmp/wvp-slice`），脚本在 `cd` 处中断；相对路径正常。文档示例恰好都用相对路径，所以主路径未爆。
- **`.cursor/skills/...` 硬编码示例路径：** SKILL.md/THEMES.md 的命令示例绑定 Cursor 目录布局，换宿主（claude-code 等，manifest 声明 6 种 compat）路径即失效。平台伤疤。

### 盲区（裸做想象想到了、skill 没防的）

- `narrations.length === 最大 step N+1` 是全包最关键的不变式，却**没有机器校验**：tsc 查不出、extract-narrations 只查数组存在；漏写 if 分支 = 黑屏 step，只能人眼点出来。
- 颜色/字体硬编码靠完工自检肉眼扫，没给一行 `grep -E '#[0-9a-f]{3,6}'` 类脚本。
- 一镜到底录屏对长视频脆弱：中途任何故障要整片重录，RECORDING.md 没有分章录制/拼接的 B 方案。
- 信息保留度的语义半边（关键事实逐项对照）无机器手段，只有字符数比例可验。
- article 本身质量差/事实错误：skill 不防，画面信息密度机制反而会放大错误。

## 带走候选清单（steal scan，六镜头）

| 候选 | 镜头 | 档位 | 用在哪 | 进手册的位置 |
| --- | --- | --- | --- | --- |
| 去 AI 味三层自检 | 验法+知识 | 直接抄走 | 任何写作与文案 | stage-01 机制段 |
| 信息保留度保底线（60%＋禁删清单＋上报） | 知识 | 直接抄走 | 任何改写/转写/翻译 | stage-01 机制段 |
| 口播写作成套数值（句长/钩子/平台变体表/数字翻译） | 知识 | 直接抄走 | 任何口播/演讲稿 | stage-01 机制段（痛点表漏掉，本扫描捞回） |
| 一次对齐话术骨架 | 话术 | 直接抄走 | 任何多决策协作项目 | stage-02 机制段 |
| 切主题回归测试 | 验法 | 思路带走 | 任何 token 化系统 | stage-03 机制段 |
| 主题设计数值底线（4.5:1/单 accent/一个签名/shell 更深） | 知识 | 直接抄走 | 任何视觉/UI 设计 | stage-03 机制段（痛点表漏掉，捞回） |
| 逐个揭示与灰化保留 | 知识 | 直接抄走 | 任何 PPT/演示 | stage-04 场景段 |
| 反 AI 味视觉指纹清单＋占位卡规则 | 知识 | 直接抄走 | 任何设计评审 | stage-04 机制段（捞回） |
| 每次开工必读表 | 痛点 | 思路带走 | 任何重复 N 次的长流程 | stage-05 场景段 |
| 先修复再汇报协议 | 痛点+话术 | 思路带走 | 任何带交付的 agent/团队流程 | stage-05 机制段 |
| 唯一真相源 | 痛点 | 思路带走 | 任何多消费方数据设计 | stage-06 机制段 |
| 烧钱前插一个人审中间产物 | 痛点+产物形状 | 思路带走 | 任何高成本生成 | stage-06 机制段 |
| 把绕不开的手势做成仪式 | 痛点 | 思路带走 | 任何被平台规则卡住的自动化 | stage-07 机制段 |
| 章节切分经验法则（3~8 步/30~60s/4 字每秒/换气处切） | 知识 | 直接抄走 | 任何视频/课程结构规划 | dataflow outline.md 卡（捞回） |

概念镜头的产出（「翻译机化」「呼吸感」「AI 味」）已作为词汇在正文就地解释，不单独立 callout；产物形状镜头的「信息池条目格式」由 glossary 信息池词条承载。

## 证据采集记录（可执行工件必跑清单）

| 脚本 | 跑了？ | 输入 | 一句结果 |
| --- | --- | --- | --- |
| `scripts/scaffold.sh --list-themes` | 跑了 | 包内 themes/ | 10 主题清单 + nameZh/descriptionZh 正常输出 |
| `scripts/scaffold.sh <dir>` | 跑了 | `--theme=midnight-press`，目标 `/tmp/wvp-slice` | 相对路径成功（npm create vite + 模板覆盖 + tsc 通过 + `.theme` 落盘）；**绝对路径实测失败**（create-vite@9 当相对路径，cd 中断） |
| `templates/scripts/extract-narrations.ts` | 跑了 | 切片工程自带 01-example 章节 | `✓ extracted 3 segments from 1 chapters`，audio-segments.json 三条与 narrations.ts 逐字一致 |
| `templates/scripts/synthesize-audio.sh` | 跑了 | 上一步 audio-segments.json；本机无 mmx | 显式报错 + 给出装 mmx/换 TTS 指引，未假装合成 |
| 切片工程 `npx tsc --noEmit` | 跑了 | 脚手架产物 | 通过 |

切片止于第一个承重工件链（脚手架工程 + audio-segments.json）；音频合成需 mmx 账号，按检查点切开，未代答。

## Stage IDs

| ID | 一句话 |
| --- | --- |
| stage-01 | 一次产出：article 落盘不删 → script.md（三层自检）+ outline.md（信息池）同批完成 |
| stage-02 | Checkpoint Plan：动态读 themes 出推荐，用户一次对齐稿子/outline/主题/素材/模式五件事 |
| stage-03 | 脚手架：scaffold.sh 建工程 + 主题 tokens 落位 + 删 example 章 |
| stage-04 | 第 1 章：主线程完整做出可验收样板，用户硬验收，成为风格锚点 |
| stage-05 | 第 2~N 章：按 A 逐章 / B 顺序 / C 并行模式开发，每章重读 CHAPTER-CRAFT + 完工自检 |
| stage-06 | Checkpoint Audio + 音频合成：narrations.ts → audio-segments.json（用户扫一眼）→ 串行 mmx → 时长校验 |
| stage-07 | 录屏：`?auto=1` + Space 一镜到底；没音频走手动路径 |

## 跨阶段机制线索

- **T1 真相源链：** script `---` 节拍 → outline step → narrations.ts → audio-segments.json → mp3 → Auto 推进（01→05→06→07）
- **T2 自检协议链：** script 三层自检 / outline 自检 / 每章完工自检，同一个 Teams→subagent→自检 降级协议 + 先修复再汇报（01、04、05）
- **T3 双源链：** article.md 不删 → 信息池带来源 → 章节实现回原文抽细节（01、04、05）
- **T4 主题 token 链：** Checkpoint 选主题 → tokens.css 落位 → 章节只用 token/primitive class → 换主题=覆盖一个文件（02、03、04、05）

## Archive 卡片 IDs

| ID | 名字 | 维度 | 证据 | 可迁移性预判 |
| --- | --- | --- | --- | --- |
| A1 | narrations.ts 唯一真相源 | 领域-认知 | 作者证词+实测 | 高 |
| A2 | outline 不写动画：计划留白防翻译机 | 领域-认知 | 作者证词 | 高 |
| A3 | 信息保留度 ≥ 60% 硬下限 | 行为 | 作者证词 | 高 |
| A4 | 去 AI 味三层自检（形式/风骨/念出来） | 品味 | 作者证词 | 高 |
| A5 | 1 项 = 1 step 逐步揭示 | 行为 | 作者证词 | 高 |
| A6 | Checkpoint Plan：5 件事一次对齐 | 需求 | 作者证词+结构推断 | 高 |
| A7 | 第 1 章风格锚点 + 硬验收 | 编排 | 作者证词 | 高 |
| A8 | token 兜底的并行隔离 | 编排 | 作者证词 | 高 |
| A9 | 删掉 minHoldMs：动画 ≤ 口播 | 领域-工程 | 实测+作者证词 | 高 |
| A10 | 自检协议：先修复再汇报 | 行为 | 作者证词 | 高 |
| A11 | 每章重读指引：抗上下文遗忘 | 行为 | 作者证词 | 高 |
| A12 | 双源原则 + 信息池 | 领域-认知 | 作者证词 | 高 |

（实际写卡时按 references/cards-patterns.md 重判可迁移性，至少 2 张应降为低或写满反例。）

## 术语 IDs（glossary 候选，3-8 个）

step（节拍）、narrations.ts、信息池、主题 token、双源原则、Auto 模式

## 图表计划

| ID | 内容 | 出现处 |
| --- | --- | --- |
| main-flow | 全流程 panorama：文章 → Phase1 → CP Plan → 脚手架 → 第1章+验收 → 2~N章 → CP Audio → 音频 → 录屏 | overview 末尾 + walkthrough 开头复用 |
| data-flow | 产物流：article/script/outline → narrations.ts/chapters.ts → segments → mp3 → 成片 | dataflow 开头 |
| truth-source | narrations.ts 为枢纽的五处对齐（script/outline/章节代码/chapters.ts/音频） | dataflow A1 区 / walkthrough stage-06 |
| wow-compare | 默认 agent 产出 vs skill 产出对比（滚动长页 PPT 味 vs 16:9 步进舞台） | overview wow |

## Voice gate 留痕（口语档全量重写，第二轮）

第一轮 voice gate 跑成了违禁词 grep，被用户当场抓出三句看不懂的正文——定性为四种病：压缩癖、自造隐喻当指代链（「闸」）、解剖黑话泄漏（「防坑/手艺」）、加号公式。处置：walkthrough 叙述层全量重写为口语档（材料块不动），archive 13 条机制说明同步口语化；三个 bad case 进了 voice-gate-examples.md 类 8/9/10。

念出来抽查样本（重写后）：stage-01 检查二开头段（过）、stage-02 机制「用户甩来一句」段（过）、stage-04 难点领域段（过）、stage-06 砍掉的旋钮「翻译一下」段（过）、stage-07 收尾 hook（重写一次：原句四短语排比，拆成因果句）。

## 风险 / 缺证据 / 假设

- 贯穿例子的 script/outline/章节摘录为模拟样本（源包无成品案例），逐处标注。
- 「散点确认烦用户」的需求维痛属结构推断（由 checkpoint 合并的流程变化反推），未实测。
- LLM 行为类断言（摘要化、stagger 全上、假装完成）均为作者证词级，未做消融——按 evidence-collection 规则，随机性行为不做单次实测充数。
- 音频合成与真实录屏未跑（无 mmx 账号），stage-06/07 的真实产出用源包文档示例 + 切片 segments 标本支撑。
