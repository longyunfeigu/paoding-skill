# Visuals and quality bar

Use this reference when planning diagrams, checking generated SVGs, or doing the
final handbook review.

## Diagram rule

Separate accurate diagrams from mood images.

Use code-native diagrams for relationships that must be correct:

- stage flow;
- data flow;
- file dependency maps;
- source-of-truth maps;
- checkpoint placement;
- generated artifact lineage.

Use SVG, Mermaid, or HTML/CSS for these. The point is correctness,
searchability, and future edits.

Use generated bitmap images only for mood, covers, or conceptual reinforcement.
Do not use generated images for exact arrows, labels, file paths, or tables.

## Visual plan

For every planned visual, record:

```markdown
### <asset name>

**Purpose:** <where it appears and what it helps the reader understand>
**Type:** SVG | Mermaid | HTML/CSS | imagegen
**Reason:** <accuracy vs mood reason>
**Content:** <nodes/rows/prompt>
**Avoid:** <text errors, fake labels, misleading decoration>
```

Good default set:

```text
1. high-level flow diagram     code-native
2. file relationship diagram   code-native
3. walkthrough trace diagram   code-native
4. optional cover/concept art   generated image
```

## Comparison rule

If the wow moment compares 2+ things, use a table or diagram. Do not make the
reader reconstruct the comparison from prose.

- Same position, multiple entities -> table or compare SVG.
- Same entity over time -> timeline.
- Before/after -> paired cards.
- One-to-many or many-to-one -> graph or map.

## Diagram completion

`diagrams[]` metadata is not a completed diagram.

Each diagram entry in `data.js` must include:

```js
image: "assets/diagrams/<name>.svg"
```

Before delivery:

- list `generation/<skill-slug>/assets/diagrams/`;
- check every referenced SVG exists;
- serve the app locally;
- curl each SVG path and confirm HTTP 200 plus non-zero bytes;
- open pages or otherwise verify images render.

Page 200 is not enough. The renderer can show a caption while the image is
missing.

## Final quality check

- Does the first page explain ordinary pain before source-skill mechanics?
- Does one concrete example carry the whole handbook?
- Does every important term get explained before heavy use?
- Does each detail page orient a direct-link reader before detailed cards?
- Does Walkthrough show input, action, output, freedom, pain caught, and handoff?
- Are file roles explained by responsibility, not just path name?
- Does every major design choice name the bad scenario it prevents?
- Does every pattern include cost and counter-case?
- Are accurate relationship diagrams code-native?
- Are generated images optional and free of critical embedded text?
- Can the reader steal at least three concrete design moves?
- For web mode, is `handbook.md` only an export?
