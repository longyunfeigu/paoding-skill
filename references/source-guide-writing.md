# Source guide writing

Read this file only when writing `content/source-guide.md`.

The source guide answers:

```text
我想学习这个 skill 是怎么写出来的。入口文件大致讲了什么？
哪些引用文件必须读？每个引用文件实际写了什么？
我该读到什么程度，哪里可以略过，哪里必须回到原文？
```

It is not a source-code commentary, but it must explain the source package's
actual content. Do not reduce files to "responsibility / boundary" labels.
Explain the package's reading path and enough of each load-bearing file's
contents that the reader can orient before opening the original.

Reader state: assume the reader has not read the source package and does not
know the project's private terms. Write for someone learning this skill from
the handbook, not for the original project maintainer.

## Degree of detail

Use this middle line:

- Too shallow: "`references/` contains supporting docs."
- Right level: "`content-format.md` first defines the eight handwritten files,
  then lists the exact field names each page may use. Its important idea is
  that writer, parser, and renderer share one contract; if a field name is
  absent here, `build-data.py` rejects it."
- Too detailed: "Line 37 says field names are looked up in a label table..."

Every named file must answer three questions:

- What does a first-time reader need to know before this file makes sense?
- What does this file actually say?
- Which concepts, section names, rules, or examples should the reader notice?
- What can the reader safely skip until they are editing or debugging?

## Reader bridge field

`先给读者搭桥` comes before the content tour. It is a short translation layer
for first-time readers.

It must:

- name the reader-facing problem this file helps with;
- translate source-package terms into plain task language before using them;
- state why opening this file is worth the reader's time.

Keep it to 1-3 sentences. Do not repeat the file summary. Do not assume the
reader knows the project, its examples, or its internal shorthand.

Bad:

```text
这里解释 MISSION、ZPD、workspace files 的关系。
```

Good:

```text
如果你还不知道这个 teaching skill 为什么要维护一堆状态文件，先把它当成
“课堂记忆系统”看：它要记住学生正在学什么、卡在哪里、下一步该练什么。
`MISSION` 和 `ZPD` 只是这套记忆里的两个标签，不是课程标题。
```

After this field, a first-time reader should be able to say "I know why this
file exists and what problem it helps me inspect" without knowing the source
project's private vocabulary.

## Actual-content field

`文件里实际讲了什么` is the load-bearing field. Treat it as a mini content
tour, not a label.

It must contain:

- the file's main line of thought or unfolding order;
- 2-4 real anchors from the source file: section names, concepts, rule names,
  table names, format names, script names, examples, or quoted terms;
- one key turn: what this file changes, reverses, or makes concrete compared
  with a default reading.

How to write the anchors:

- Do not compress anchors with `A + B + C`. Expand them into an action chain:
  "Phase 1 first splits six research agents, then adds an information-source
  blacklist" is better than "Phase 1 的六维 agent 任务分配表 + 信息源黑名单".
- Do not say a file "outsources" or "delegates" details to `references/`.
  Say what moves out and why the reader should care: "SKILL.md keeps only the
  phase order; the extraction criteria live in `extraction-framework.md`, so
  read that file when judging whether a model is evidence-backed."
- When naming a project-specific term, add a plain-language gloss nearby.
  "Phase 0 的入口分流表" is not enough; add what the split decides.

Length guide:

- `SKILL.md`: 150-300 Chinese characters, because it is the entry.
- Normal reference files: 100-180 Chinese characters.
- Scripts and templates: 80-150 Chinese characters.
- Large reference files: two short paragraphs are allowed, but stay under
  350 Chinese characters.

Bad:

```text
它定义教学行为，包括工作区文件、知识技能区分、最近发展区和硬要求。
```

Good:

```text
这个文件先规定 agent 必须维护哪些工作区状态文件，再把教学目标拆成知识、
技能、智慧三类。中段最关键的是“流畅度不等于储存强度”：它要求课程不能
只让学习者听懂，还要制造可恢复、可迁移的练习。后面用最近发展区和使命
盘问决定当前该教什么，避免按固定课程表推进。
```

For source guides, "high information density" is not a list of proper nouns.
It is a sequence a learner can follow: first what the file sets up, then which
anchors matter, then what those anchors make possible.

## Required frame

Open with a package frame before file cards. Group files by role, not by
directory order:

```text
入口调度层：SKILL.md
任务认知层：pain / evidence / steal scan
手册规格层：handbook spec / content format
生产流程层：web production flow / scaffold / build / check
写作质量层：stage writing / cards / voice / visuals
呈现层：web template / assets / examples
验证层：tests / check-content
```

Then draw the reference relationship as a call chain. A small text tree is
enough. The point is "who sends me where", not "what files exist".

Before the reference map, write `## 入口文件导读`: 4-8 narrative paragraphs
that walk through `SKILL.md` as an entry file. This section should name the
source skill's real phases, red lines, routing rules, output modes, and
learning model. If it could apply to any skill, it is too generic.

## File card rules

Write one card for:

- `SKILL.md`;
- every reference file explicitly routed from `SKILL.md`;
- scripts that enforce or generate handbook behavior;
- examples/tests only when they calibrate a real contract.

Do not card generated output, copied assets, images, or every example page.
Mention them in a group card if needed.

Each file card has seven fields from `references/content-format.md`:

- **文件类型:** one role label from the package frame.
- **先给读者搭桥:** 1-3 sentences for a first-time reader; translate private
  terms and explain why this file matters before summarizing it.
- **文件里实际讲了什么:** 2-5 sentences. Must follow the mini-tour rule
  above: main line, 2-4 real anchors, and one key turn.
- **读它时先抓什么:** where the reader's attention should go first.
- **它把细节交给谁:** referenced files, scripts, templates, or examples.
- **读完你应该能复述:** one concrete thing the reader can explain afterward.
- **可以先略过什么:** material that only matters for editing, debugging, or
  rare branches.

Do not write "defines the standards", "supports the workflow", or "contains
rules" unless the same sentence says which standards, workflow step, or rule.
Generic responsibility cards are a failure mode.

Do not write for maintainers. These are failures:

- unexplained project nouns in a row;
- file names used as the explanation;
- "A + B" compression;
- "outsourced to references" with no explanation of what moved and when to
  open the referenced file.

## Independent learner review

Author self-check is not enough for this page. After drafting
`content/source-guide.md`, dispatch an independent reviewer/subagent before
marking the page done.

Reviewer stance:

```text
你是第一次学习这个 source skill 的读者。你没读过源包，不知道项目私有术语。
只判断这页能不能帮你打开原文前先建立方向感。
```

Reviewer reads:

- `content/source-guide.md`;
- this file (`references/source-guide-writing.md`);
- the source package's entry `SKILL.md`;
- any source files named in the file cards when needed to verify anchors.

Reviewer scans only high-risk fields:

- `## 入口文件导读`;
- each card's `先给读者搭桥`;
- each card's `文件里实际讲了什么`;
- each card's `读完你应该能复述`.

Reviewer reports findings, not rewrites:

- location;
- reader confusion: unexplained term / file name used as explanation /
  maintainer-only shorthand / noun pile / missing "why open this file";
- quoted snippet;
- one concrete fix direction.

The author must fix or explicitly reject each finding and record the review
summary in `handbook-brief.md`. A source guide with no independent learner
review is not done, even if `build-data.py` passes.

## Reading priority

Give three to five priority groups. Use this vocabulary unless the package
needs another level:

- 必读
- web 模式必读
- 写某页时读
- 修改/调试时读
- 查阅

The point is to release the reader from "I must understand every line".
Human learning target: understand behavior contract, package structure, and
transferable design moves. Line-by-line reading is only for modifying,
copying a specific mechanism, or debugging a conflict.

## Voice check

A good source guide sounds like a senior reader walking through the package
for the first time:

- "读到这里先别跳；后面的格式都靠它。"
- "这个文件不是规范源，只是样例校准。"
- "这段可以略过，除非你正在改脚手架。"

Avoid vague labels like "supporting documentation", "core file", or
"utility script" unless the sentence immediately says what the file changes
in the agent's behavior.
