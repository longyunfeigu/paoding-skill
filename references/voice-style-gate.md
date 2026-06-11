# Voice style gate

Use this reference for every page-level voice gate and for the final editor
pass. The goal is simple: make the handbook sound like a careful teacher showing
real work, not an AI trying to sound important.

## Gate process

For each completed page:

1. Scan the high-exposure fields listed in `references/voice-gate-examples.md`.
2. Check the anti-jargon rules below.
3. Check the teaching-voice rules below.
4. Run the read-aloud test.
5. Fix blocking issues before marking the page done.

Do not treat this as a report-only step. If the gate finds a blocking issue,
rewrite the affected sentence or paragraph.

## Hard rules (non-negotiable)

These seven rules block delivery. Rules marked [machine] are also enforced by
`scripts/check-content.py`; the rest are checked here, by reading.

### H1. Term after instance

A term may be named only after a concrete instance has been shown. The reader
meets the failing output, the file excerpt, or the scene first; the label
comes second. Opening a section with a definition is a gate failure.

### H2. Real material, no paraphrase [machine]

When prose describes an input or output, paste the actual excerpt. "一份结构
化的需求描述" is a violation; the violation is fixed by pasting ten lines of
the actual file. Every mechanism explanation quotes the actual rule, gate
text, or script lines.

### H3. Minimal contrast per mechanism [machine]

Every mechanism gets a bad/good pair, and the pair differs in exactly one
variable. A pair that differs in three variables teaches nothing because the
reader cannot attribute the difference.

### H4. Definition chains must touch ground

Explaining a new concept with another new concept is a violation. Every
explanation chain ends at something already shown in this handbook or at
everyday experience. Feynman test: a reader who has never written a skill can
follow the paragraph.

### H5. Explain in place

The explanation sits next to the thing it explains. A load-bearing
explanation may not be deferred with "见第 X 章" or "详见 Glossary". Glossary
is a lookup appendix, not a place where understanding is parked.

### H6. One new term per paragraph [machine]

A paragraph in which two terms make their first appearance gets split and
rewritten. First appearances are expensive; spend them one at a time.

### H7. Conversational address

Speak to the reader as "你" at predict points, challenges, and turns; use "我"
for the agent's execution narrative. A page that never says 你 or 我们 has
drifted into a status report. Formal textbook register is a failure mode, not
a virtue: short sentences, natural turns, "注意，这里有个坑" is allowed and
encouraged — as long as every claim is backed by real material.

## Anti-jargon checks

### 1. Do not give ordinary moves fancy names

Bad shape:

- "Anchor-First Fan-Out"
- "Single Source of Truth at Runtime Edge"
- "Capability Graceful Degradation Pipeline"

Better shape:

- "先做透一个样板，再把其它页分出去"
- "冲突时以离运行时最近的那份为准"
- "最强的方式优先，没有就退一档"

If a new label can be replaced by five ordinary words without losing meaning,
replace it.

### 2. Do not cite thinkers to add weight

Avoid name-dropping such as "诺维格视角下", "波兰尼边缘", "Wiggins 倒着设计",
or "Christopher Alexander 模式". Say the mechanism directly.

### 3. Do not use metaphor where a fact is needed

Avoid phrases like "最锋利的一刀", "硬关卡", "灵魂深处", "信念之刃",
"祖先决策", or "守卫". Replace them with the concrete action, file, check, or
failure consequence.

### 4. Do not turn simple choices into philosophy

Bad shape:

- "决策应当下放到拥有最多决策依据的那一刻"
- "信息悬崖"
- "信息的多维度坍缩"

Better shape:

- "这个决定让谁做：手头信息最全的那个人"
- "前面不知道、后面才知道的事"
- "几件事被挤进一份文件里"

### 5. Avoid English-Chinese mashups

Translate ordinary terms unless they are source file names, source field names,
or quoted source-skill terms.

Prefer:

- "给谁看" over "audience"
- "候选" or "已确认" over "candidate"
- "反例" over "anti-example"
- "按情况退一档" over "graceful degradation"
- "不联网的机器" over "air-gapped"
- "一对多发" or "分出去" over "fan-out"

### 6. Do not explain jargon with jargon

Bad shape:

```text
Checkpoint Plan（硬节点 hard gate）——文本阶段的必经检查。
```

Better shape:

```text
Checkpoint Plan：文本都在手里、还没写代码的时候停一下，问用户 5 件事。
用户说继续，才往下做。
```

The short explanation should use a scene or plain words, not another label.

### 7. Avoid engineer shorthand as the sentence subject

Replace compressed terms when they stand in for real explanation:

- "硬节点" -> "必须停下来对齐的地方"
- "真相源" -> "冲突时以这个为准"
- "锚点" -> "拿来对齐别的东西的样板"
- "降级" -> "做不到最好就退一档"
- "信息池" -> "这一章能用的事实列表"
- "漂移" -> "悄悄变得对不上"
- "质量门" -> "必须通过的检查"
- "下游" -> "后面的步骤"
- "落盘" -> "写到文件里"

Source-skill names and file names can stay, but explain what they do in plain
language.

### 8. Avoid command-style compression

Bad shape:

```text
三重过 -> 心智模型；1-2 重 -> 启发式；0 重 -> 丢。
```

Better shape:

```text
三个标准都通过，就算心智模型。只通过一两个，就退一档变成决策启发式。
一个都没通过，就不要放进结果里。
```

If a sentence sounds like command-line output when read aloud, rewrite it.

## Teaching-voice checks

### 1. One sentence carries one job

Split a sentence if it needs more than one major pause to read aloud.

Bad shape:

```text
调研完成后，6 份素材、9 条启发式、3 个语气特征、7 组张力都进入 brief。
```

Better shape:

```text
调研结束后，brief 里多了几样东西。
第一样是素材。第二样是决策启发式。第三样是语气特征。
如果其中某一类会在后文反复出现，就在这里给一个真实例子。
```

### 2. Do not stack numbers and nouns in body prose

Dense "6 models + 9 rules + 3 voices" summaries are allowed in quick-reference
panels. In narrative prose, unpack each item or show one concrete example.

### 3. Split dash chains

More than two long dashes in one paragraph usually means the paragraph is doing
too many jobs. Turn the chain into separate sentences.

### 4. Turn toward the reader

A handbook is not a status report. Use natural turns such as:

- "我们先停一下。"
- "你可以先猜一遍。"
- "注意这里容易做错。"
- "这就解释了为什么下一步不能直接写页面。"

If a whole page never says "你" or "我们", check whether it has become a dump of
facts instead of a teaching path.

### 5. Put scene before rule

Avoid opening a section with an abstract rule when a concrete moment can carry
it. Show what the AI is about to do, what the skill stops, and what artifact is
produced next.

### 6. Keep transition words

AI-like prose often removes connective tissue to sound efficient. Teaching prose
needs phrases like "也就是说", "换句话说", "这样一来", "不过", "但是", and
"接下来" when they clarify the relationship between sentences.

### 7. Remove fake empathy

Avoid claims like "我知道你一定很困惑" or "你肯定也踩过这个坑". If addressing the
reader, name the concrete situation they are in.

Better:

```text
你现在手里只有一个 SKILL.md。最容易做的事，是直接总结它的章节。
这个 skill 不让你这么做。
```

### 8. Remove fake depth

Words like "恰恰", "反而", "真正可怕的是", "本质上", and "底层逻辑" often hide a
plain observation. Delete the phrase. If the claim becomes too thin, add a
concrete example instead of stronger rhetoric.

### 9. Remove self-praise

Avoid "这一点极其关键", "我必须认真说", "接下来彻底讲清", or "这是最重要的一刀".
Show the consequence instead.

Better:

```text
跳过这一步，第 5 章会回到默认卡片堆叠。读者只看见字段，看不见为什么这些字段要存在。
```

### 10. Remove template phrases

Watch for "一句话总结", "说白了", "归根结底", "形成闭环", "赋能", "抓手",
"底座". These usually replace the actual explanation.

### 11. Avoid slogan-like parallelism

If three consecutive sentences use the same rhythm, keep the sentence with real
information and replace the rest with a scene, table, or before/after pair.

## Read-aloud test

Read the paragraph aloud. It passes when:

- the sentence can be read without losing the subject;
- the paragraph reaches the end without needing an unnatural breath;
- a listener can restate the point in plain language;
- the paragraph sounds like a person teaching a concrete artifact, not like a
  pitch, abstract essay, or engineering status update.

If it fails, rewrite the paragraph rather than doing one-word replacements.
