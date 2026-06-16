(function () {
  const handbook = window.handbook || {};
  const path = window.location.pathname;
  const inPages = path.includes("/pages/");
  const root = inPages ? "../" : "./";

  function escapeHtml(value = "") {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  // 行内 markdown：先转义，再渲染 `code`（先做，防止 code 内星号被加粗）和 **加粗**。
  function renderInline(value = "") {
    let s = escapeHtml(value);
    s = s.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');
    s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    return s;
  }

  function slugify(value = "") {
    return String(value)
      .toLowerCase()
      .replace(/[^a-z0-9一-龥]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60);
  }

  function buildChapters() {
    const counts = {
      stages: (handbook.walkthrough || []).length,
      artifacts: (handbook.dataflow?.artifacts || []).length,
      sourceFiles: (handbook.sourceGuide?.files || []).length,
      cards: (handbook.archive?.cards || []).length,
      glossary: (handbook.glossary || []).length,
      toolbox: (handbook.toolbox || []).length
    };
    const chapters = [
      { num: "01", label: "Overview", sub: "失败场景 · 基线 · 全景图", href: `${root}pages/overview.html`, slug: "overview" },
      { num: "02", label: "Walkthrough", sub: `运行轨迹 · ${counts.stages} 个 stage`, href: `${root}pages/walkthrough.html`, slug: "walkthrough" },
      { num: "03", label: "中间产物与数据流", sub: `跟着数据走 · ${counts.artifacts} 个产物`, href: `${root}pages/dataflow.html`, slug: "dataflow" },
      { num: "04", label: "源包导读", sub: `入口和引用文件 · ${counts.sourceFiles} 个文件`, href: `${root}pages/source-guide.html`, slug: "source-guide" },
      { num: "05", label: "难点档案", sub: `症状 · 机制 · 可迁移性 · ${counts.cards} 张卡`, href: `${root}pages/archive.html`, slug: "archive" },
      { num: "06", label: "Apply It", sub: "迁移练习 · 画你自己的骨架", href: `${root}pages/apply-it.html`, slug: "apply-it" },
      { num: counts.toolbox ? "附1" : "附", label: "Glossary", sub: `查阅用 · ${counts.glossary} 个术语`, href: `${root}pages/glossary.html`, slug: "glossary" }
    ];
    if (counts.toolbox) {
      chapters.push({ num: "附2", label: "带走工具箱", sub: `📌 正文标过的可带走点 · ${counts.toolbox} 个`, href: `${root}pages/toolbox.html`, slug: "toolbox" });
    }
    return chapters;
  }

  function skillName() {
    return handbook.meta?.skillName || handbook.meta?.shortName || "这个 skill";
  }

  function exampleName() {
    return handbook.example?.label || handbook.example?.name || "贯穿例子";
  }

  function getSubNav(page) {
    switch (page) {
      case "overview":
        return [
          { anchor: "scene", label: "先看默认会从哪里偏" },
          { anchor: "predict", label: "你先猜一遍" },
          { anchor: "primer", label: "Domain primer" },
          { anchor: "wow", label: "Wow moment" },
          { anchor: "pain-preview", label: "难点预览" },
          { anchor: "example", label: "贯穿例子" },
          { anchor: "panorama", label: "流水线全景" },
          { anchor: "shape", label: "本手册为什么这样排" }
        ];
      case "walkthrough":
        return (handbook.walkthrough || []).map((s, i) => ({
          anchor: s.id || `stage-${i + 1}`,
          label: `${String(i + 1).padStart(2, "0")} ${(s.title || "").replace(/，.*$/, "").replace(/——.*$/, "")}`
        }));
      case "dataflow":
        return (handbook.dataflow?.artifacts || []).map((f) => {
          const tail = (f.path || "").split("/").pop() || f.path;
          return { anchor: slugify(f.path), label: tail };
        });
      case "source-guide":
        return [
          { anchor: "framework", label: "总框架" },
          { anchor: "entry-guide", label: "入口文件导读" },
          { anchor: "reference-map", label: "引用关系" },
          ...((handbook.sourceGuide?.files || []).map((f) => ({
            anchor: `src-${slugify(f.path)}`,
            label: (f.path || "").split("/").pop() || f.path
          }))),
          { anchor: "priorities", label: "阅读优先级" },
          { anchor: "reading-path", label: "通读路线" }
        ];
      case "archive": {
        const cards = (handbook.archive?.cards || []).map((c) => ({
          anchor: (c.id || "").toLowerCase(),
          label: `${c.id} ${c.title}`
        }));
        if ((handbook.archive?.residue || []).length) cards.push({ anchor: "residue", label: "残渣与砍掉候选" });
        if ((handbook.archive?.blindSpots || []).length) cards.push({ anchor: "blind-spots", label: "盲区" });
        return cards;
      }
      case "apply-it":
        return [
          { anchor: "skeleton", label: "骨架模式" },
          { anchor: "scenario", label: "新场景" },
          { anchor: "tasks", label: "你的任务" },
          { anchor: "answer", label: "参考答案" },
          { anchor: "next-steps", label: "下一步" }
        ];
      case "glossary":
        return (handbook.glossary || []).map((g) => ({
          anchor: slugify(g.term),
          label: g.term
        }));
      case "toolbox":
        return (handbook.toolbox || []).map((t) => ({
          anchor: t.anchor,
          label: `${t.tier === "直接抄走" ? "抄" : "思"} · ${t.name}`
        }));
      default:
        return [];
    }
  }

  function findDiagram(id) {
    return (handbook.diagrams || []).find((d) => d.id === id);
  }

  function diagramBlock(diagram) {
    if (!diagram) return "";
    const image = diagram.image
      ? `<img class="diagram-image" src="${root}${escapeHtml(diagram.image)}" alt="${escapeHtml(diagram.title)}" />`
      : `<div class="diagram-missing">⚠ 图未画 · 期望路径 ${escapeHtml(diagram.expectedImage || "")}</div>`;
    return `
      <figure class="diagram-card">
        <figcaption class="diagram-caption">
          <span class="diagram-kicker">${escapeHtml(diagram.kicker || diagram.type || "diagram")}</span>
          <h4>${escapeHtml(diagram.title)}</h4>
          <p>${escapeHtml(diagram.description || "")}</p>
        </figcaption>
        ${image}
      </figure>
    `;
  }

  // 术语首次出现自动链到 glossary 锚点（每页一次；glossary 页自身不链）。
  const glossaryTerms = (handbook.glossary || [])
    .map((t) => t.term)
    .filter(Boolean)
    .sort((a, b) => b.length - a.length);
  const seenTerms = new Set();

  function linkTerms(escaped) {
    if ((document.body.dataset.page || "") === "glossary") return escaped;
    let out = escaped;
    for (const term of glossaryTerms) {
      if (seenTerms.has(term)) continue;
      const needle = escapeHtml(term);
      const idx = out.indexOf(needle);
      if (idx === -1) continue;
      const link = `<a class="term-link" href="${root}pages/glossary.html#${slugify(term)}" title="术语 · 点击查附录">${needle}</a>`;
      out = out.slice(0, idx) + link + out.slice(idx + needle.length);
      seenTerms.add(term);
    }
    return out;
  }

  function renderTableBlock(rows) {
    if (!Array.isArray(rows) || !rows.length) return "";
    const header = rows[0] || [];
    const body = rows.slice(1);
    const ths = header.map((c) => `<th>${renderInline(c)}</th>`).join("");
    const trs = body.map((r) => `<tr>${r.map((c) => `<td>${renderInline(c)}</td>`).join("")}</tr>`).join("");
    return `<div class="md-table-wrap"><table class="mini-table md-table"><thead><tr>${ths}</tr></thead><tbody>${trs}</tbody></table></div>`;
  }

  function renderQuoteInner(block) {
    const subs = Array.isArray(block.blocks) ? block.blocks : [];
    if (subs.length) {
      return subs.map((sub) => {
        if (sub.kind === "table") return renderTableBlock(sub.rows);
        if (sub.kind === "list") {
          const items = (sub.items || []).map((item) => `<li>${renderInline(item)}</li>`).join("");
          return `<ul class="narrative-list">${items}</ul>`;
        }
        if (sub.kind === "code") {
          return `<pre class="quote-code"><code>${escapeHtml(sub.text || "")}</code></pre>`;
        }
        return `<p>${renderInline(sub.text || "")}</p>`;
      }).join("");
    }
    return `<p>${renderInline(block.text || "")}</p>`;
  }

  function renderNarrativeBlock(block) {
    if (!block || !block.kind) return "";
    if (block.kind === "para") {
      return `<p>${linkTerms(renderInline(block.text || ""))}</p>`;
    }
    if (block.kind === "h4") {
      return `<h4 class="beat-head">${renderInline(block.text || "")}</h4>`;
    }
    if (block.kind === "list") {
      const items = (block.items || []).map((item) => `<li>${renderInline(item)}</li>`).join("");
      return `<ul class="narrative-list">${items}</ul>`;
    }
    if (block.kind === "table") {
      return renderTableBlock(block.rows);
    }
    if (block.kind === "code") {
      const lang = block.lang ? ` data-lang="${escapeHtml(block.lang)}"` : "";
      const langLabel = block.lang ? escapeHtml(block.lang.toUpperCase()) : "TEXT";
      return `<div class="code-block"><div class="code-chrome"><span class="code-dots"><i></i><i></i><i></i></span><span class="code-lang">${langLabel}</span></div><pre${lang}><code>${escapeHtml(block.text || "")}</code></pre></div>`;
    }
    if (block.kind === "quote") {
      return `<blockquote class="narrative-quote">${renderQuoteInner(block)}</blockquote>`;
    }
    if (block.kind === "diagram") {
      return diagramBlock(findDiagram(block.id));
    }
    if (block.kind === "steal") {
      const tierClass = block.tier === "直接抄走" ? "tier-copy" : "tier-idea";
      const anchor = block.anchor ? ` id="${escapeHtml(block.anchor)}"` : "";
      return `
        <aside class="steal-callout ${tierClass}"${anchor}>
          <div class="steal-head">
            <span class="steal-badge">📌 可带走</span>
            <span class="steal-name">${escapeHtml(block.name || "")}</span>
            <span class="steal-tier">${escapeHtml(block.tier || "")}</span>
          </div>
          <p class="steal-scene">用在：${escapeHtml(block.scene || "")}</p>
          <div class="steal-body">${renderQuoteInner(block)}</div>
          <a class="steal-toolbox-link" href="${root}pages/toolbox.html${block.anchor ? `#${escapeHtml(block.anchor)}` : ""}">全部可带走的点，集中在「带走工具箱」→</a>
        </aside>`;
    }
    return "";
  }

  function renderBlocks(blocks) {
    return Array.isArray(blocks) ? blocks.map(renderNarrativeBlock).join("") : "";
  }

  function evidencePill(evidence) {
    return evidence ? `<span class="evidence-pill">证据：${escapeHtml(evidence)}</span>` : "";
  }

  function layout(title, content) {
    const page = document.body.dataset.page || "";
    const chapters = buildChapters();
    const subNav = getSubNav(page);
    document.title = `${title} · ${handbook.meta?.title || "Skill Handbook"}`;
    const navHtml = chapters.map((ch) => {
      const isActive = page === ch.slug;
      const subItems = isActive && subNav.length
        ? `<ul class="subsections">${subNav.map((s) => `<li><a href="#${escapeHtml(s.anchor)}">${escapeHtml(s.label)}</a></li>`).join("")}</ul>`
        : "";
      return `
        <div class="nav-block${isActive ? " active" : ""}">
          <a class="chapter-link${isActive ? " active" : ""}" href="${ch.href}">
            <span class="num">${escapeHtml(ch.num)}</span>
            <span class="chapter-link-text">
              <span class="chapter-link-label">${escapeHtml(ch.label)}</span>
              <small>${escapeHtml(ch.sub)}</small>
            </span>
          </a>
          ${subItems}
        </div>
      `;
    }).join("");

    document.querySelector("#app").innerHTML = `
      <aside class="sidebar">
        <a class="brand" href="${root}index.html">${escapeHtml(handbook.meta?.title || "Skill Handbook")}</a>
        <span class="brand-sub">${escapeHtml(handbook.meta?.audience || "")}</span>
        <nav>${navHtml}</nav>
        <p class="source">
          <span class="source-label">来源</span>
          ${escapeHtml(handbook.meta?.sourcePath || "")}
        </p>
      </aside>
      <main>${content}</main>
    `;
  }

  // ===== Overview (章 01) =====
  function overviewPage() {
    const overview = handbook.overview || {};
    const example = handbook.example || {};

    const openingHtml = renderBlocks(overview.openingScene);

    const predictHtml = overview.predictPrompt
      ? `<aside class="predict-block">
          <span class="predict-label">写下你的猜测</span>
          <p>${renderInline(overview.predictPrompt)}</p>
        </aside>`
      : "";

    const baselineHtml = handbook.meta?.baseline
      ? `<aside class="baseline-block">
          <span class="baseline-label">本书的基线</span>
          <p>${renderInline(handbook.meta.baseline)}</p>
          <small>后面每一个"难点"，说的都是这个基线会怎么坏，不是说你会怎么坏。</small>
        </aside>`
      : "";

    const primerHtml = renderBlocks(overview.primerBeats);

    const wowSetupHtml = overview.wowSetup ? `<p class="wow-setup">${renderInline(overview.wowSetup)}</p>` : "";
    const wowDiagramHtml = overview.wowDiagramId ? diagramBlock(findDiagram(overview.wowDiagramId)) : "";
    const wowMomentHtml = overview.wowMoment ? `<p class="wow-moment">${renderInline(overview.wowMoment)}</p>` : "";

    const previewHtml = (overview.painPreview || []).map((card) => {
      const links = [];
      if (card.goDeeperStage) {
        const n = parseInt(card.goDeeperStage.replace("stage-", ""), 10);
        links.push(`<a href="walkthrough.html#${escapeHtml(card.goDeeperStage)}">运行轨迹 · 第 ${n} 站</a>`);
      }
      if (card.goDeeperCard) {
        links.push(`<a href="archive.html#${escapeHtml(card.goDeeperCard.toLowerCase())}">难点档案 · ${escapeHtml(card.goDeeperCard)}</a>`);
      }
      return `
        <article class="bad-result-card preview-card">
          <h4>${escapeHtml(card.title)}<span class="status-pill">${escapeHtml(card.dimension || "")}</span></h4>
          <div class="bad-default">
            <span class="ba-label">坑 · 你会掉进去的样子</span>
            <p>${renderInline(card.pit)}</p>
          </div>
          <div class="bad-arrow">↓</div>
          <div class="bad-intercept">
            <span class="ba-label">这个 skill 最值得学的一招</span>
            <p>${renderInline(card.hook || "")}</p>
          </div>
          <p class="preview-godeeper">深入 → ${links.join(" ／ ")}</p>
        </article>
      `;
    }).join("");

    const panoramaHtml = overview.panoramaDiagramId ? diagramBlock(findDiagram(overview.panoramaDiagramId)) : "";

    const chapterLogicHtml = (overview.chapterLogic || []).map((c) => `
      <li>
        <span class="logic-chapter">${escapeHtml(c.chapter)}</span>
        <span class="logic-why">${renderInline(c.why)}</span>
      </li>
    `).join("");

    layout("Overview", `
      <article class="page overview-page">
        <header class="ov-hero">
          <p class="eyebrow">Overview · 章 01</p>
          <h1>${escapeHtml(overview.h1 || "看见这个 skill 在做什么")}</h1>
          <p class="lede">${escapeHtml(overview.oneLiner || "")}</p>
          <span class="hero-rule"></span>
        </header>

        <section class="section opening" id="scene">
          <p class="eyebrow">先看默认会从哪里开始偏</p>
          <div class="opening-body">${openingHtml}</div>
        </section>

        <section class="section predict" id="predict">
          ${predictHtml}
          ${baselineHtml}
        </section>

        <section class="section primer" id="primer">
          <p class="eyebrow">Domain primer · 0 行业黑话先说一遍</p>
          <h2>${escapeHtml(skillName())}在做什么</h2>
          <div class="primer-body">${primerHtml}</div>
        </section>

        ${(wowSetupHtml || wowDiagramHtml || wowMomentHtml) ? `
        <section class="section wow" id="wow">
          <p class="eyebrow">Wow moment</p>
          ${wowSetupHtml}
          ${wowDiagramHtml}
          ${wowMomentHtml}
        </section>` : ""}

        <section class="section bad-results" id="pain-preview">
          <p class="eyebrow">难点预览 · 策展 3-5 个，不是全部——全部在难点档案</p>
          <h2>难在哪，值得学什么</h2>
          <div class="bad-results-grid">
            ${previewHtml}
          </div>
        </section>

        <section class="section example" id="example">
          <p class="eyebrow">引入贯穿全本的具体例子</p>
          <h2>用${escapeHtml(exampleName())}跑一遍</h2>
          <div class="example-grid">
            <article class="example-card">
              <h4>用户请求</h4>
              <p>${renderInline(example.userRequest || "")}</p>
            </article>
            <article class="example-card">
              <h4>为什么挑这个例子</h4>
              <p>${renderInline(example.whyThisExample || "")}</p>
            </article>
            <article class="example-card">
              <h4>预期产出</h4>
              <p>${renderInline(example.expectedOutput || "")}</p>
            </article>
          </div>
          <aside class="example-callout">这个例子会贯穿整本手册——后面 Walkthrough 的每一阶段都用它落地，中途不换。</aside>
        </section>

        <section class="section panorama" id="panorama">
          <p class="eyebrow">流水线全景 · 后面每一章都挂在这张图上</p>
          <h2>输入从左边进，结果从右边出</h2>
          ${panoramaHtml}
        </section>

        <section class="section shape" id="shape">
          <p class="eyebrow">Why this shape · 章节排序的依据</p>
          <h2>章节为什么这么排</h2>
          <p class="shape-reason">${renderInline(overview.shapeReason || "按读者意图排，不按源文件顺序")}</p>
          <ol class="chapter-logic">
            ${chapterLogicHtml}
          </ol>
        </section>

        <div class="end-mark">
          <span class="end-mark-glyph">❖ &nbsp; ❖ &nbsp; ❖</span>
          <span class="end-mark-text">章 01 / Overview — 完</span>
        </div>
      </article>
    `);
  }

  // ===== Walkthrough (章 02) =====
  function walkthroughPage() {
    const stages = handbook.walkthrough || [];
    const flow = findDiagram(handbook.overview?.panoramaDiagramId || "main-flow");
    const flowHtml = flow ? diagramBlock(flow) : "";

    const indexHtml = stages.length ? `
      <section class="section" id="stage-index">
        <p class="eyebrow">全 ${stages.length} 个 stage · 点击跳转</p>
        <div class="index-grid">
          ${stages.map((stage, i) => `
            <a class="index-item" href="#${escapeHtml(stage.id || `stage-${i + 1}`)}">
              <span class="index-num">${String(i + 1).padStart(2, "0")}</span>
              <span class="index-title">${escapeHtml(stage.title || "")}</span>
            </a>
          `).join("")}
        </div>
      </section>` : "";

    const previewEcho = {};
    (handbook.overview?.painPreview || []).forEach((card) => {
      if (card.goDeeperStage) {
        (previewEcho[card.goDeeperStage] = previewEcho[card.goDeeperStage] || []).push(card.title);
      }
    });

    function painRow(label, pain) {
      if (!pain) return "";
      if (pain.text === "确无") {
        return `<div class="pain-row pain-none"><span class="pain-label">${escapeHtml(label)}</span><p>确无——这一站没有这类难点。</p></div>`;
      }
      return `<div class="pain-row"><span class="pain-label">${escapeHtml(label)}</span><p>${renderInline(pain.text || "")} ${evidencePill(pain.evidence)}</p></div>`;
    }

    function part(no, label, inner) {
      if (!inner) return "";
      return `
        <div class="stage-part">
          <div class="part-label"><span class="part-no">${no}</span>${escapeHtml(label)}</div>
          ${inner}
        </div>`;
    }

    function stageBlock(stage, index) {
      const num = String(index + 1).padStart(2, "0");

      const breadcrumbHtml = stage.breadcrumb
        ? `<div class="bc-pills">${stage.breadcrumb.split("→").map((seg) => {
            const t = seg.trim();
            if (!t) return "";
            const current = t.startsWith("【");
            const text = t.replace(/[【】]/g, "");
            return `<span class="bc-pill${current ? " current" : ""}">${escapeHtml(text)}</span>`;
          }).filter(Boolean).join(`<span class="bc-sep">→</span>`)}</div>`
        : "";

      const hookOpen = stage.hookOpen ? `<p class="hook hook-open"><strong>${index === 0 ? "从这里开始：" : "接上一步："}</strong>${renderInline(stage.hookOpen)}</p>` : "";
      const hookClose = stage.hookClose ? `<p class="hook hook-close"><strong>${index === stages.length - 1 ? "这里把账结清：" : "下一步靠这个："}</strong>${renderInline(stage.hookClose)}</p>` : "";

      const sceneHtml = Array.isArray(stage.sceneBody) && stage.sceneBody.length
        ? part("Ⅰ", "场景再现", `<div class="narrative stage-scene">${renderBlocks(stage.sceneBody)}</div>`)
        : "";

      const echo = previewEcho[stage.id]
        ? `<p class="preview-echo">Overview 预告过这里的坑 → ${previewEcho[stage.id].map((t) => `『${escapeHtml(t)}』`).join("、")}，现在看它怎么解</p>`
        : "";
      const painsHtml = (stage.painDomain || stage.painBehavior)
        ? part("Ⅱ", "这一站的难点", `
        <div class="pain-block">
          ${echo}
          ${painRow("领域难点", stage.painDomain)}
          ${painRow("行为难点", stage.painBehavior)}
        </div>`)
        : "";

      const predictHtml = Array.isArray(stage.predictBody) && stage.predictBody.length
        ? part("Ⅲ", "先猜一遍 · 你来设计这条规则", `
        <aside class="pretest">
          ${renderBlocks(stage.predictBody)}
        </aside>`)
        : "";

      const mechanismHtml = Array.isArray(stage.mechanismBody) && stage.mechanismBody.length
        ? part("Ⅳ", "skill 实际怎么防 · 贴原文", `<div class="narrative stage-mechanism">${renderBlocks(stage.mechanismBody)}</div>`)
        : "";

      const outputHtml = Array.isArray(stage.outputBody) && stage.outputBody.length
        ? part("Ⅴ", "真实产出 · 这一站交出什么", `<div class="narrative stage-output">${renderBlocks(stage.outputBody)}</div>`)
        : "";

      const moveCardLink = stage.moveCard
        ? `<a class="move-card-link" href="archive.html#${escapeHtml(stage.moveCard.toLowerCase())}">什么时候用、什么时候太重 → 档案 ${escapeHtml(stage.moveCard)}</a>`
        : "";
      const moveHtml = stage.reusableMove
        ? part("Ⅵ", "这里能偷的招", `
        <div class="move">
          <span class="move-quote">"</span>
          <p>${renderInline(stage.reusableMove)}</p>
          ${moveCardLink}
        </div>`)
        : "";

      const qr = stage.quickref || {};
      const quickRefRows = [
        ["这一步收到什么", qr.receives],
        ["skill 让我读什么", qr.reads],
        ["我不能直接做什么", qr.blockedShortcut],
        ["我做什么", qr.action],
        ["我产出什么", qr.output],
        ["机制线索", qr.mechanismThread],
        ["下一步谁用它", qr.nextConsumer],
        ["自由度", qr.freedom]
      ].filter(([, v]) => v);

      const quickRefHtml = quickRefRows.length ? `
        <details class="quickref">
          <summary>阶段速查 · Stage metadata</summary>
          <div class="quickref-body">
            ${quickRefRows.map(([label, value]) => `
              <div class="qr-row">
                <span class="qr-label">${escapeHtml(label)}</span>
                <span class="qr-body">${renderInline(value)}</span>
              </div>
            `).join("")}
          </div>
        </details>` : "";

      const challengesHtml = Array.isArray(stage.challenges) && stage.challenges.length ? `
        <section class="challenges">
          <div class="challenges-rule"></div>
          <h4>你的练习</h4>
          <p class="challenges-sub">不是 AI 的内心独白——是给读这本手册的你的题。先想再读下一阶段。</p>
          <ol class="challenges-list">
            ${stage.challenges.map((c) => `<li>${renderInline(c)}</li>`).join("")}
          </ol>
        </section>` : "";

      return `
        <section class="stage" id="${escapeHtml(stage.id || `stage-${index + 1}`)}">
          <header class="stage-head">
            <div class="stage-num">${num}</div>
            <div class="stage-meta">
              <span class="stage-kicker">${escapeHtml(stage.kicker || "")}</span>
              <h3 class="stage-title">${escapeHtml(stage.title || "")}</h3>
              <p class="stage-summary">${renderInline(stage.summary || "")}</p>
            </div>
          </header>
          ${breadcrumbHtml}
          ${hookOpen}
          ${sceneHtml}
          ${painsHtml}
          ${predictHtml}
          ${mechanismHtml}
          ${outputHtml}
          ${moveHtml}
          ${quickRefHtml}
          ${hookClose}
          ${challengesHtml}
        </section>
      `;
    }

    layout("Walkthrough", `
      <article class="page walkthrough-page">
        <div class="masthead">
          <span class="masthead-left">❖ &nbsp; ${escapeHtml(skillName())} · 解剖手册</span>
          <span class="masthead-mid">章 02 / Walkthrough</span>
          <span class="masthead-right">${escapeHtml(handbook.meta?.version || "v1")}</span>
        </div>
        <header class="wt-hero">
          <p class="eyebrow">Walkthrough · 章 02</p>
          <h1>运行轨迹</h1>
          <p class="subtitle">${escapeHtml(handbook.overview?.oneLiner || "")}</p>
          <p class="lede">先看全景，再逐站下钻。下面 ${stages.length} 个 stage 展示我被这个 skill 一步步约束、暂停、检查、推进的完整路径。每个 stage 都用 <strong>${escapeHtml(exampleName())}</strong> 做落地，中途不换。</p>
          <span class="hero-rule"></span>
        </header>
        ${flowHtml ? `
        <section class="section" id="flow-overview">
          <p class="eyebrow">流水线全景 · 进任何一站之前先认全图</p>
          ${flowHtml}
        </section>` : ""}
        ${indexHtml}
        <section class="stages">
          ${stages.map(stageBlock).join("")}
        </section>
        <div class="end-mark">
          <span class="end-mark-glyph">❖ &nbsp; ❖ &nbsp; ❖</span>
          <span class="end-mark-text">章 02 / Walkthrough — 完</span>
        </div>
      </article>
    `);
  }

  // ===== 中间产物与数据流 (章 03) =====
  function dataflowPage() {
    const dataflow = handbook.dataflow || {};
    const artifacts = dataflow.artifacts || [];
    const flow = dataflow.flowDiagramId ? findDiagram(dataflow.flowDiagramId) : null;
    layout("中间产物与数据流", `
      <article class="page">
        <header class="wt-hero">
          <p class="eyebrow">中间产物与数据流 · 章 03</p>
          <h1>跟着数据走</h1>
          <p class="lede">${renderInline(dataflow.intro || "")} 这一章不按目录列文件——按数据流走：用户输入进来，每一站交出什么中间产物，最后变成交付。每个产物卡都要回答一个问题：它为什么长这样，而不是更直觉的样子。反直觉的中间产物背后，通常就是这个 skill 对任务本质的理解。</p>
          <span class="hero-rule"></span>
        </header>
        ${flow ? `<section class="section">${diagramBlock(flow)}</section>` : ""}
        <section class="section">
          <p class="eyebrow">产物卡 · 谁写 · 谁读 · 为什么长这样</p>
          <div class="card-grid artifact-list">
            ${artifacts.map((f) => `
              <article class="card filemap-card" id="${slugify(f.path)}">
                <h3>${escapeHtml(f.path)}</h3>
                <div class="card-row"><span class="label">谁写它</span><p>${renderInline(f.writtenBy || "")}</p></div>
                <div class="card-row"><span class="label">谁读它</span><p>${renderInline(f.readBy || "")}</p></div>
                <div class="card-row"><span class="label">它管什么</span><p>${renderInline(f.owns || "")}</p></div>
                <div class="card-row"><span class="label">它不管什么</span><p>${renderInline(f.doesNotOwn || "")}</p></div>
                <div class="card-row why-shape"><span class="label">为什么长这样</span><p>${renderInline(f.whyThisShape || "")}</p></div>
                <div class="card-row"><span class="label">写错会坏什么</span><p>${renderInline(f.failureIfWrong || "")}</p></div>
                ${Array.isArray(f.body) && f.body.length ? `<div class="artifact-specimen"><span class="specimen-label">标本 · 逐字段看门道</span>${renderBlocks(f.body)}</div>` : ""}
              </article>
            `).join("")}
          </div>
        </section>
      </article>
    `);
  }

  // ===== 源包导读 (章 04) =====
  function sourceGuidePage() {
    const guide = handbook.sourceGuide || {};
    const files = guide.files || [];
    const priorities = guide.priorities || [];

    const fileCards = files.map((f) => `
      <article class="card filemap-card source-file-card" id="src-${slugify(f.path)}">
        <h3>${escapeHtml(f.path)}</h3>
        <div class="card-row"><span class="label">文件类型</span><p>${renderInline(f.fileType || "")}</p></div>
        <div class="card-row why-shape"><span class="label">文件里实际讲了什么</span><p>${renderInline(f.actualContent || "")}</p></div>
        <div class="card-row"><span class="label">读它时先抓什么</span><p>${renderInline(f.readingFocus || "")}</p></div>
        <div class="card-row"><span class="label">它把细节交给谁</span><p>${renderInline(f.handoff || "")}</p></div>
        <div class="card-row"><span class="label">读完你应该能复述</span><p>${renderInline(f.takeaway || "")}</p></div>
        <div class="card-row"><span class="label">可以先略过什么</span><p>${renderInline(f.skippable || "")}</p></div>
        ${Array.isArray(f.body) && f.body.length ? `<div class="artifact-specimen">${renderBlocks(f.body)}</div>` : ""}
      </article>
    `).join("");

    const priorityCards = priorities.map((p) => `
      <article class="card apply-card">
        <h4>${escapeHtml(p.level || "")}</h4>
        <div class="card-row"><span class="label">文件</span><p>${renderInline(p.files || "")}</p></div>
        <div class="card-row"><span class="label">原因</span><p>${renderInline(p.reason || "")}</p></div>
      </article>
    `).join("");

    layout("源包导读", `
      <article class="page">
        <header class="wt-hero">
          <p class="eyebrow">源包导读 · 章 04</p>
          <h1>${escapeHtml(guide.h1 || "源包导读")}</h1>
          <p class="lede">${renderInline(guide.summary || "")} 这一章不复刻目录，也不逐行翻译源码；它先讲入口文件的大致逻辑，再解释承重文件实际写了什么、读时抓什么、哪些可以略过。</p>
          <span class="hero-rule"></span>
        </header>
        <section class="section" id="framework">
          <p class="eyebrow">总框架 · 先知道这些文件分哪几层</p>
          <div class="narrative">${renderBlocks(guide.framework)}</div>
        </section>
        <section class="section" id="entry-guide">
          <p class="eyebrow">入口文件导读 · 先读懂 SKILL.md 的主线</p>
          <div class="narrative">${renderBlocks(guide.entryGuide)}</div>
        </section>
        <section class="section" id="reference-map">
          <p class="eyebrow">引用关系 · 不是目录树，是调用链</p>
          <div class="narrative">${renderBlocks(guide.referenceMap)}</div>
        </section>
        <section class="section" id="source-files">
          <p class="eyebrow">承重文件 · 实际内容 / 抓手 / 可略过部分</p>
          <div class="card-grid artifact-list">${fileCards}</div>
        </section>
        <section class="section" id="priorities">
          <p class="eyebrow">阅读优先级 · 不需要每行都读</p>
          <div class="card-grid two">${priorityCards}</div>
        </section>
        <section class="section" id="reading-path">
          <p class="eyebrow">通读路线 · 真要学它怎么写，照这条线走</p>
          <div class="narrative">${renderBlocks(guide.readingPath)}</div>
        </section>
      </article>
    `);
  }

  // ===== 难点档案 (章 05) =====
  function archivePage() {
    const archive = handbook.archive || {};
    const cards = archive.cards || [];
    const net = archive.panoramaDiagramId ? findDiagram(archive.panoramaDiagramId) : null;

    const dims = {};
    cards.forEach((c) => {
      const d = c.dimension || "未归类";
      (dims[d] = dims[d] || []).push(c);
    });
    const dimSummaryHtml = Object.entries(dims).map(([d, list]) => `
      <div class="dim-row">
        <span class="dim-name">${escapeHtml(d)}</span>
        <span class="dim-cards">${list.map((c) => `<a href="#${escapeHtml((c.id || "").toLowerCase())}">${escapeHtml(c.id)}</a>`).join(" ")}</span>
      </div>
    `).join("");

    function cardBlock(c) {
      const contrastHtml = c.contrast ? `
        <table class="mini-table contrast-table">
          <thead><tr><th>没有这个机制</th><th>有这个机制</th></tr></thead>
          <tbody><tr>
            <td>${renderInline(c.contrast.without || "")}</td>
            <td>${renderInline(c.contrast.with || "")}</td>
          </tr></tbody>
        </table>` : "";

      const quoteHtml = c.mechanismQuote
        ? `<blockquote class="narrative-quote mech-quote">${renderQuoteInner({ text: c.mechanismQuote, blocks: c.mechanismQuoteBlocks })}</blockquote>`
        : "";

      const transferHtml = c.transferability === "高" ? `
        <div class="card-row"><span class="label">什么时候用</span><p>${renderInline(c.useWhen || "")}</p></div>
        <div class="card-row"><span class="label">什么时候太重</span><p>${renderInline(c.tooHeavyWhen || "")}</p></div>
        <div class="card-row"><span class="label">反例（看着像但不是这招）</span><p>${renderInline(c.antiExample || "")}</p></div>
        <div class="card-row"><span class="label">在哪几个 skill 里见过</span><p>${renderInline(c.seenIn || "")}</p></div>
      ` : `
        <div class="card-row"><span class="label">为什么搬不走</span><p>${renderInline(c.lowReason || "")}</p></div>
      `;

      const scenesHtml = Array.isArray(c.counterScenarios) && c.counterScenarios.length ? `
        <table class="mini-table scenes-table">
          <thead><tr><th>场景</th><th>效果</th><th>为什么</th></tr></thead>
          <tbody>
            ${c.counterScenarios.map((s) => `
              <tr data-effect="${escapeHtml(s.effect || "")}">
                <td>${renderInline(s.when || "")}</td>
                <td class="effect-cell">${escapeHtml(s.effect || "")}</td>
                <td>${renderInline(s.why || "")}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>` : "";

      const relHtml = Array.isArray(c.related) && c.related.length ? `
        <section class="related-patterns">
          <span class="related-label">和哪些卡一起读</span>
          <ul>
            ${c.related.map((rp) => `
              <li>
                <a href="#${escapeHtml((rp.to || "").toLowerCase())}">
                  <span class="rp-num">${escapeHtml(rp.to || "")}</span>
                  <span class="rp-body">
                    <span class="rp-name">${escapeHtml(rp.label || "")}</span>
                    <span class="rp-rel">${escapeHtml(rp.relation || "")}</span>
                  </span>
                </a>
              </li>
            `).join("")}
          </ul>
        </section>` : "";

      return `
        <article class="card pattern-card archive-card" id="${escapeHtml((c.id || "").toLowerCase())}">
          <h3><span class="p-num">${escapeHtml(c.id || "")}</span>${escapeHtml(c.title || "")}<span class="status-pill">${escapeHtml(c.dimension || "")}</span></h3>
          <div class="card-row pattern-problem"><span class="label">症状 · 基线会怎么坏</span><p>${renderInline(c.symptom || "")} ${evidencePill(c.evidence)}</p></div>
          ${contrastHtml}
          <div class="pattern-therefore">
            <span class="pt-divider">❖ &nbsp; ❖ &nbsp; ❖</span>
            <div class="pt-body">
              <span class="pt-label">Therefore</span>
              <p>${renderInline(c.therefore || "")}</p>
            </div>
            <span class="pt-divider">❖ &nbsp; ❖ &nbsp; ❖</span>
          </div>
          <div class="card-row"><span class="label">skill 怎么解 · 贴原文</span></div>
          ${quoteHtml}
          <div class="card-row"><p>${renderInline(c.mechanismNote || "")}</p></div>
          <div class="card-row"><span class="label">解法层次</span><p>${escapeHtml(c.solutionLayer || "")}</p></div>
          <div class="card-row"><span class="label">可迁移性</span><p>${escapeHtml(c.transferability || "")}</p></div>
          ${transferHtml}
          ${scenesHtml ? `<div class="card-row"><span class="label">不同场景下的力度对比</span></div>${scenesHtml}` : ""}
          ${relHtml}
        </article>`;
    }

    const residueHtml = (archive.residue || []).length ? `
      <section class="section" id="residue">
        <p class="eyebrow">残渣与砍掉候选 · 没过难点三问的条目</p>
        <h2>这些规则没答出"去掉会坏什么"</h2>
        <div class="card-grid">
          ${(archive.residue || []).map((r) => `
            <article class="card residue-card">
              <h3>${escapeHtml(r.item || "")}<span class="status-pill">${escapeHtml(r.verdict || "")}</span></h3>
              <div class="card-row"><span class="label">理由</span><p>${renderInline(r.reason || "")}</p></div>
            </article>
          `).join("")}
        </div>
      </section>` : "";

    const blindHtml = (archive.blindSpots || []).length ? `
      <section class="section" id="blind-spots">
        <p class="eyebrow">盲区 · 裸做想象想到了、skill 没防的</p>
        <h2>诚实账：它没覆盖的难点</h2>
        <article class="card">
          <ul class="narrative-list">
            ${(archive.blindSpots || []).map((b) => `<li>${renderInline(b)}</li>`).join("")}
          </ul>
        </article>
      </section>` : "";

    layout("难点档案", `
      <article class="page">
        <header class="wt-hero">
          <p class="eyebrow">难点档案 · 章 05</p>
          <h1>${cards.length} 张难点卡</h1>
          <p class="lede">每张卡从一个可观察的症状出发：基线会怎么坏（带证据等级）、skill 用哪几行原文防住、解法属于哪个层次、能不能搬走。卡片末尾的"力度对比"告诉你这招什么时候管用、什么时候是负担。章末是诚实账：没过三问的残渣，和它没防住的盲区。</p>
          <span class="hero-rule"></span>
        </header>
        <section class="section" id="dim-panorama">
          <p class="eyebrow">先看全景 · 按维度分组</p>
          ${net ? diagramBlock(net) : ""}
          <div class="dim-summary">${dimSummaryHtml}</div>
        </section>
        <section class="section">
          <div class="archive-list">
            ${cards.map(cardBlock).join("")}
          </div>
        </section>
        ${residueHtml}
        ${blindHtml}
        <div class="end-mark">
          <span class="end-mark-glyph">❖ &nbsp; ❖ &nbsp; ❖</span>
          <span class="end-mark-text">章 05 / 难点档案 — 完</span>
        </div>
      </article>
    `);
  }

  // ===== Apply It (章 06) =====
  function applyItPage() {
    const apply = handbook.applyIt || {};
    const scenarioHtml = renderBlocks(apply.scenario);
    const tasksHtml = (apply.tasks || []).map((t) => `<li>${renderInline(t)}</li>`).join("");
    const answerHtml = renderBlocks(apply.referenceAnswer);
    const authorHtml = (apply.nextSteps?.author || []).map((s) => `<li>${renderInline(s)}</li>`).join("");
    const thiefHtml = (apply.nextSteps?.thief || []).map((s) => `<li>${renderInline(s)}</li>`).join("");
    layout("Apply It", `
      <article class="page">
        <header class="wt-hero">
          <p class="eyebrow">Apply It · 章 06</p>
          <h1>${escapeHtml(apply.h1 || "拿这套招，自己画一个骨架")}</h1>
          <p class="lede">${renderInline(apply.summary || "")} 这一章不是总结——是练习。下面给你一个新场景，你从难点档案里选卡、组合，画出一个 mini-skill 的骨架。先做，再看参考答案。</p>
          <span class="hero-rule"></span>
        </header>
        <section class="section" id="skeleton">
          <p class="eyebrow">骨架模式 · 你要带走的最大一件东西</p>
          <div class="skeleton-block narrative">${renderBlocks(apply.skeleton)}</div>
        </section>
        <section class="section" id="scenario">
          <p class="eyebrow">新场景 · 换一个领域</p>
          <div class="narrative">${scenarioHtml}</div>
        </section>
        <section class="section" id="tasks">
          <p class="eyebrow">你的任务</p>
          <article class="card apply-card">
            <ol class="apply-checklist">${tasksHtml}</ol>
          </article>
        </section>
        <section class="section" id="answer">
          <p class="eyebrow">参考答案 · 先自己画完再展开</p>
          <details class="quickref answer-details">
            <summary>展开参考答案</summary>
            <div class="quickref-body narrative">${answerHtml}</div>
          </details>
        </section>
        ${apply.starterPrompt ? `
        <section class="section" id="starter-prompt">
          <p class="eyebrow">起手 prompt · copy-paste 直接用</p>
          <article class="card apply-card">
            <pre class="apply-prompt"><code>${escapeHtml(apply.starterPrompt)}</code></pre>
          </article>
        </section>` : ""}
        <section class="section" id="next-steps">
          <p class="eyebrow">下一步</p>
          <h2>读完之后</h2>
          <div class="card-grid two">
            <article class="card apply-card">
              <h4>如果你是这个 skill 的作者 / 维护者</h4>
              <ol>${authorHtml}</ol>
            </article>
            <article class="card apply-card">
              <h4>如果你想偷招到自己的 skill</h4>
              <ol>${thiefHtml}</ol>
            </article>
          </div>
        </section>
      </article>
    `);
  }

  // ===== Glossary (附录) =====
  function glossaryPage() {
    const terms = handbook.glossary || [];
    layout("Glossary", `
      <article class="page">
        <header class="wt-hero">
          <p class="eyebrow">Glossary · 附录</p>
          <h1>概念词典</h1>
          <p class="lede">${terms.length} 个核心术语，查阅用。正文里每个术语都已经就地解释过——这一页不在主线阅读路径上，给想系统过一遍术语的人用。每条 6 个字段：定义 / 例 / 出现场景 / 解决什么问题 / 我怎么用 / 容易误解。</p>
          <span class="hero-rule"></span>
        </header>
        <section class="section">
          <div class="card-grid">
            ${terms.map((t) => `
              <article class="card glossary-card" id="${slugify(t.term)}">
                <h3>${escapeHtml(t.term)}</h3>
                <div class="card-row"><span class="label">定义</span><p>${renderInline(t.definition || "")}</p></div>
                <div class="card-row term-example"><span class="label">例</span><p>${renderInline(t.example || "")}</p></div>
                <div class="card-row"><span class="label">它在哪个 stage 出现</span><p>${renderInline(t.whereItAppears || "")}</p></div>
                <div class="card-row"><span class="label">它解决什么问题</span><p>${renderInline(t.solvedProblem || "")}</p></div>
                <div class="card-row"><span class="label">我怎么用它</span><p>${renderInline(t.howToUse || "")}</p></div>
                <div class="card-row"><span class="label">容易误解</span><p>${renderInline(t.commonMisread || "")}</p></div>
              </article>
            `).join("")}
          </div>
        </section>
      </article>
    `);
  }

  // ===== 带走工具箱 (附录 2，构建期从正文 callout 自动聚合) =====
  function toolboxPage() {
    const items = handbook.toolbox || [];
    const pageLabel = {
      overview: "Overview",
      walkthrough: "Walkthrough",
      dataflow: "中间产物与数据流",
      "source-guide": "源包导读",
      "apply-it": "Apply It"
    };

    function itemBlock(t) {
      const tierClass = t.tier === "直接抄走" ? "tier-copy" : "tier-idea";
      const backHref = `${root}pages/${t.page}.html#${escapeHtml(t.anchor)}`;
      return `
        <article class="steal-callout toolbox-item ${tierClass}" id="${escapeHtml(t.anchor)}">
          <div class="steal-head">
            <span class="steal-badge">📌</span>
            <span class="steal-name">${escapeHtml(t.name || "")}</span>
            <span class="steal-tier">${escapeHtml(t.tier || "")}</span>
          </div>
          <p class="steal-scene">用在：${escapeHtml(t.scene || "")}</p>
          <div class="steal-body">${renderQuoteInner(t)}</div>
          <a class="steal-toolbox-link" href="${backHref}">回它的现场 → ${escapeHtml(pageLabel[t.page] || t.page)} · ${escapeHtml(t.where || "")}</a>
        </article>`;
    }

    function tierSection(tier, intro) {
      const list = items.filter((t) => t.tier === tier);
      if (!list.length) return "";
      return `
        <section class="section" id="${tier === "直接抄走" ? "tier-copy" : "tier-idea"}">
          <p class="eyebrow">${escapeHtml(tier)} · ${list.length} 个</p>
          <p class="intro-prose">${escapeHtml(intro)}</p>
          <div class="toolbox-list">${list.map(itemBlock).join("")}</div>
        </section>`;
    }

    layout("带走工具箱", `
      <article class="page">
        <header class="wt-hero">
          <p class="eyebrow">带走工具箱 · 附录 2</p>
          <h1>📌 ${items.length} 个可带走的点</h1>
          <p class="lede">这一页是机器从正文自动聚合的——每一条都在某个章节的现场标过「可带走」。和难点档案的区别：档案回答「这个 skill 为什么长这样」，这里只回答「你明天干活能拿走什么」。赶时间就从这页挑，想懂来龙去脉就点「回它的现场」。</p>
          <span class="hero-rule"></span>
        </header>
        ${tierSection("直接抄走", "清单、数值、对照表——原样复制就能用，不需要懂这个 skill 的其它部分。")}
        ${tierSection("思路带走", "原则和做法——换个领域要自己适配，但思路直接搬。")}
        <div class="end-mark">
          <span class="end-mark-glyph">❖ &nbsp; ❖ &nbsp; ❖</span>
          <span class="end-mark-text">附录 2 / 带走工具箱 — 完</span>
        </div>
      </article>
    `);
  }

  function indexPage() {
    const overview = handbook.overview || {};
    const chapters = buildChapters();
    layout("目录", `
      <article class="page">
        <header class="wt-hero">
          <p class="eyebrow">Skill 解剖手册 · 多页 HTML</p>
          <h1>${escapeHtml(handbook.meta?.title || "Skill Handbook")}</h1>
          <p class="lede">${escapeHtml(overview.oneLiner || "")}</p>
          <span class="hero-rule"></span>
        </header>
        <section class="section">
          <p class="eyebrow">章节</p>
          <h2>六章 + ${(handbook.toolbox || []).length ? "两个附录" : "一个附录"}</h2>
          <div class="chapter-grid">
            ${chapters.map((ch) => `
              <a class="chapter-card" href="${ch.href}">
                <span class="cc-num">${ch.num === "附" ? "附录" : `章 ${ch.num}`}</span>
                <span class="cc-title">${escapeHtml(ch.label)}</span>
                <small>${escapeHtml(ch.sub)}</small>
              </a>
            `).join("")}
          </div>
        </section>
        <section class="section">
          <p class="eyebrow">怎么读这本手册</p>
          <p class="intro-prose">想 10 分钟知道这个 skill 在干嘛——看 <strong>Overview</strong>。想看我怎样被它一步步带着跑——看 <strong>Walkthrough</strong>。想知道它的中间产物为什么长那样——看 <strong>中间产物与数据流</strong>。想知道源包每个承重文件怎么读——看 <strong>源包导读</strong>。想偷招——看 <strong>难点档案</strong>，然后到 <strong>Apply It</strong> 动手画一遍。每章左边 sidebar 会自动展开二级目录。</p>
        </section>
      </article>
    `);
  }

  const renderers = {
    index: indexPage,
    overview: overviewPage,
    walkthrough: walkthroughPage,
    dataflow: dataflowPage,
    "source-guide": sourceGuidePage,
    archive: archivePage,
    "apply-it": applyItPage,
    glossary: glossaryPage,
    toolbox: toolboxPage
  };

  const page = document.body.dataset.page || "index";
  (renderers[page] || renderers.index)();
})();
