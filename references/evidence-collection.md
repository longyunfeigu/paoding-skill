# Evidence collection · 证据获取阶梯

`references/pain-dimensions.md` defines how evidence is **graded**
(实测 / 作者证词 / 结构推断 / 假设). This file defines how evidence is
**collected** — the operating procedure for moving a claim up the ladder,
and for getting the concrete artifacts (标本) that teaching-quality prose
requires.

Read this file when producing a web handbook (it is step 3.5 of
`references/web-production-flow.md`), or whenever a review needs evidence
stronger than reading the package text.

## The ladder

| 层级 | 动作 | 拿到的证据 | 成本 |
| --- | --- | --- | --- |
| 1 尸检 | 读 SKILL.md / references / scripts | 作者证词、结构推断 | 最低 |
| 2 标本采集 | 挖源包 `examples/`、README 成品图、tests/fixtures | 实物（非自产） | 极低 |
| 3 活体切片 | 真跑 skill 的一个最小切片，采集落盘产物 | 实测（产物） | 中 |
| 4 定点消融 | 去掉单条机制，复现声称的症状 | 实测（因果） | 按点选 |

Climb a level only when it pays: **证据提升 × 教学价值 ÷ 复现成本**. A
handbook that never leaves level 1 is legal but must say so (the brief's
风险/缺证据 section); a handbook that skips level 2 while the source
package ships an `examples/` directory is a collection failure, not a
budget decision. Executable artifacts are the exception to "climb only
when it pays" — they have their own mandatory rule below.

## 可执行工件必跑（mandatory, not budget-gated）

Scripts and machine gates are the one artifact class where 实测 is nearly
free and reading is structurally blind: text review cannot see runtime
behavior, and the run costs minutes. So this is a rule, not a judgment
call:

**当源包带可执行脚本、且包内存在该脚本的合法输入（examples/、fixtures、
源包自带的成品）时，逐个真跑，结果记录进 brief。**

- Run each script against the package's own shipped artifacts. The
  highest-yield single move: run the package's own checker against the
  package's own shipped example — 出厂示例跑不过出厂检查器 is a finding
  reading can never produce.
- A script with no valid in-package input (needs network, a live URL, a
  file the package doesn't ship) is recorded as 没跑 with the reason —
  do not fabricate inputs to tick the box.
- The brief's 证据采集记录 lists every shipped script as a checklist
  row: 脚本名 ／ 跑了或没跑 ／ 输入用的什么或为什么跑不了 ／ 一句结果。
  A prose paragraph that doesn't enumerate the scripts does not satisfy
  this rule.

This rule deliberately does NOT extend to LLM-behavioral claims: a single
run of a stochastic behavior is weak evidence, and a forced "≥1 实测"
quota invites token runs. Behavioral claims stay on the conditional
ladder below.

## Level 2 · 标本采集 (mine before you make)

Before synthesizing any sample, check what already exists:

- source package `examples/` — rendered outputs are the strongest possible
  wow-moment material;
- README screenshots and sample blocks;
- `tests/fixtures/` — minimal valid artifacts, often exactly the specimen
  shape a glossary card needs;
- generated output the author shipped alongside the skill.

Mined material is real but not self-produced: cite its origin
(「来源：源包 examples/」) and do not grade claims about it 实测 unless
you reproduced it.

## Level 3 · 活体切片 (slice run)

读文档是尸检——结构可见、行为不可见。A slice run observes behavior at a
fraction of full cost. Rules:

1. **跑到第一个承重工件出现为止。** The load-bearing artifact (the one the
   handbook describes most) is usually produced by an early stage. Stop
   there; the remaining stages add cost, not teaching value, unless a
   specific claim needs them.
2. **沿人工检查点切开。** Skills place checkpoints at the seams where human
   judgment matters. Do not let a subagent answer a checkpoint and roll
   through: end the slice at the checkpoint and capture **what the skill
   would present to the user there** — checkpoint prompts are themselves
   design material worth dissecting. If the dissector answers a checkpoint
   to continue a later slice, the handbook must say so
   (「确认由解剖者代答」).
3. **采集走文件系统，不走对话。** A subagent's final message is a
   self-report; its on-disk artifacts are behavior. Require the run to
   write everything to a scratch project directory, then collect with
   `ls` + reads. Ask for a separate run log (what it read, where it had to
   judge, where it deviated) — and grade the log 作者证词, the artifacts
   实测.
4. A skill whose intermediate products never touch disk is hard to observe
   live. That is itself a finding — note it as a reviewability cost in the
   review or archive.

## Level 4 · 定点消融 (targeted ablation)

Never ablate the whole skill (带/不带跑两遍全程) — too expensive and the
contrast is dirty. The ablation unit is **one mechanism**:

- remove one rule / skip one script step, run only the local slice it
  protects, and check whether the claimed symptom appears;
- every archive card's 最小对照 table is already an ablation hypothesis —
  the ablation just executes the cheapest ones;
- pick targets by **复现成本低 × 当前证据等级低 × 反直觉程度高**. A
  minutes-level image-processing claim is worth ablating; a probabilistic
  orchestration failure ("子任务偶尔不走结构化通道") is not — keep its
  original grade and say why in the brief.

An executed ablation upgrades that card's evidence to 实测 and should leave
a visible trace (e.g., a contrast screenshot pair registered as a diagram).

## 标本 (specimen) rules

A specimen is one concrete, real-valued instance of a load-bearing artifact,
annotated field by field. It is how "为什么长这样" descends from file level
to field level.

- Every artifact that earns a glossary card gets exactly **one** specimen in
  the handbook, on its dataflow artifact card. Other mentions reference it;
  do not paste it three times.
- Specimen source priority: 源包 examples/ ＞ 切片实测 ＞ 合成样本。A
  synthesized specimen must carry the label **「模拟样本」** in its
  introducing sentence — 是猜的标猜 applies to the handbook itself.
- Field-level annotation states what design decision each field encodes and
  what breaks downstream when it is written badly — not what the field
  literally contains.
