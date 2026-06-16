// 构建产物 —— 由 scripts/build-data.py 从 content/*.md 生成，禁止手写。
// 本起始文件仅保证空壳页面可渲染；跑过一次构建后会被整体覆盖。
window.handbook = {
  meta: {
    title: __HANDBOOK_TITLE_JSON__,
    skillName: __SKILL_NAME_JSON__,
    audience: "想偷招的人 / 还没用过这个 skill 的 AI",
    sourcePath: __SOURCE_PATH_JSON__,
    version: "draft",
    baseline: ""
  },

  example: {
    label: "贯穿例子",
    userRequest: "",
    whyThisExample: "",
    expectedOutput: ""
  },

  diagrams: [],

  overview: {
    h1: "看见这个 skill 在做什么",
    oneLiner: "",
    openingScene: [],
    predictPrompt: "",
    primerBeats: [],
    wowSetup: "",
    wowDiagramId: "",
    wowMoment: "",
    painPreview: [],
    panoramaDiagramId: "",
    shapeReason: "按读者意图排，不按源文件顺序",
    chapterLogic: []
  },

  walkthrough: [],

  dataflow: {
    flowDiagramId: "",
    intro: "",
    artifacts: []
  },

  sourceGuide: {
    h1: "源包导读",
    summary: "",
    framework: [],
    entryGuide: [],
    referenceMap: [],
    files: [],
    priorities: [],
    readingPath: []
  },

  archive: {
    panoramaDiagramId: "",
    cards: [],
    residue: [],
    blindSpots: []
  },

  applyIt: {
    h1: "拿这套招，自己画一个骨架",
    summary: "",
    scenario: [],
    tasks: [],
    referenceAnswer: [],
    starterPrompt: "",
    nextSteps: {
      author: [],
      thief: []
    }
  },

  glossary: []
};
