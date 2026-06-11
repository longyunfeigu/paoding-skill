# Web app visuals

Use this reference only when changing the static web template or checking the
rendered handbook. It is intentionally short: the CSS in
`assets/web-app-template/assets/styles.css` is the visual source of truth.

## Principles

- The handbook should feel like a focused reading tool, not a marketing site.
- Keep the left sidebar as navigation chrome. Main content should carry the
  page's voice and evidence.
- Prefer typography, spacing, and clear hierarchy over decorative cards,
  gradients, or shadows.
- Use one restrained accent system. Do not let each page invent its own palette.
- Code-native diagrams explain exact relationships. Generated images, if used,
  are mood or concept support only.

## Template ownership

The scaffold owns:

```text
index.html
pages/*.html
assets/site.js
assets/styles.css
assets/data.js
assets/diagrams/
```

For normal handbook runs, update only `assets/data.js` and add real SVGs under
`assets/diagrams/`.

Edit `styles.css` only when the reusable template itself needs to change. Edit
`site.js` only when the data schema or page set changes.

## Component expectations

Use the existing renderer shapes instead of writing page-specific HTML:

- Overview: opening scene, predict block, primer beats, wow comparison, before/
  after cards, running example, chapter logic.
- Walkthrough: stage index, stage sections, narrative blocks, code blocks,
  reusable move pull quote, collapsible stage quick reference, reader challenges.
- Glossary: concept cards grounded in concrete values.
- File map: file-role cards, not directory listings.
- Design choices: bad scenario, constraint, solved problem, reusable move, and
  counter-scenarios.
- Patterns: problem, therefore break, reuse conditions, cost, anti-example, and
  related patterns.

If a field does not render, fix the renderer or the data schema. Do not create
unloaded sidecar JS files.

## Checks

Before delivery:

- Sidebar is visible on every page.
- Text does not overlap at desktop or mobile widths.
- Code blocks have readable contrast.
- Diagrams render as images, not just metadata captions.
- Pattern and design-choice cards are visually scannable without becoming a wall
  of identical boxes.
- The page still works if a reader lands there directly from a link.
