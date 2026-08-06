// 星際探索技能資料庫 — 示範資料
// 每個星系 = 一種類別；每顆行星 = 一個 skill 或 prompt

export const GALAXIES = [
  { id: "words", name: "寫作星系", en: "NEBULA OF WORDS", color: "#b6a8d6", desc: "文案、敘事、潤稿類 prompt 的家園" },
  { id: "code", name: "程式星系", en: "CODE CLUSTER", color: "#93c3d8", desc: "除錯、重構、架構設計的技能航線" },
  { id: "market", name: "行銷星系", en: "MARKET CONSTELLATION", color: "#d8bd8f", desc: "品牌、社群、成長策略的行星群" },
];

export const PLANETS = [
  // 寫作星系
  { id: "p1", galaxy: "words", type: "prompt", name: "一句話摘要器", en: "One-Line Digest", coord: "WD-104", difficulty: 1, uses: 1280, summary: "把任意長文濃縮成一句直擊重點的話。", body: "你是一位精準的編輯。請將以下內容濃縮為一句不超過 30 字、保留核心洞見的摘要。" },
  { id: "p2", galaxy: "words", type: "skill", name: "敘事弧線建構", en: "Story Arc Builder", coord: "WD-207", difficulty: 3, uses: 640, summary: "為任何主題搭出起承轉合的敘事骨架。", body: "依據『鉤子→衝突→轉折→收束』四段式，為給定主題產出敘事大綱。" },
  { id: "p3", galaxy: "words", type: "prompt", name: "語氣調校台", en: "Tone Tuner", coord: "WD-311", difficulty: 2, uses: 910, summary: "在正式↔親切之間自由平移文字語氣。", body: "保留原意，將文字語氣調整為指定風格（例：專業、俏皮、溫暖）。" },
  { id: "p4", galaxy: "words", type: "prompt", name: "標題生成艙", en: "Headline Forge", coord: "WD-418", difficulty: 1, uses: 1520, summary: "一次產出 10 個不同角度的標題。", body: "為給定主題生成 10 個標題，涵蓋懸念、數字、對比、提問等角度。" },
  { id: "p5", galaxy: "words", type: "skill", name: "潤稿掃描儀", en: "Polish Scanner", coord: "WD-522", difficulty: 2, uses: 730, summary: "揪出冗詞、被動語態與模糊表述。", body: "逐句檢查文字，標記冗詞、被動語態、含糊用語並給修改建議。" },

  // 程式星系
  { id: "p6", galaxy: "code", type: "skill", name: "除錯羅盤", en: "Debug Compass", coord: "CD-102", difficulty: 3, uses: 1840, summary: "從錯誤訊息反推最可能的根因。", body: "根據錯誤訊息與相關程式碼，列出前三個最可能的根因與驗證步驟。" },
  { id: "p7", galaxy: "code", type: "skill", name: "重構引擎", en: "Refactor Engine", coord: "CD-216", difficulty: 4, uses: 960, summary: "在不改行為的前提下改善結構。", body: "對給定函式進行重構，保持行為不變，說明每一步改動的理由。" },
  { id: "p8", galaxy: "code", type: "prompt", name: "正則咒語書", en: "Regex Grimoire", coord: "CD-309", difficulty: 2, uses: 1210, summary: "用自然語言描述換來一條正則式。", body: "將自然語言描述轉換為正則表達式，並附上測試字串範例。" },
  { id: "p9", galaxy: "code", type: "skill", name: "架構星圖", en: "Architecture Map", coord: "CD-411", difficulty: 5, uses: 520, summary: "為需求畫出模組與資料流。", body: "依需求提出系統架構，列出主要模組、資料流與取捨。" },
  { id: "p10", galaxy: "code", type: "prompt", name: "測試孵化器", en: "Test Incubator", coord: "CD-527", difficulty: 3, uses: 880, summary: "為函式產出邊界情境測試案例。", body: "為給定函式產出單元測試，涵蓋正常、邊界與例外情境。" },

  // 行銷星系
  { id: "p11", galaxy: "market", type: "prompt", name: "口號鍛造爐", en: "Slogan Foundry", coord: "MK-101", difficulty: 2, uses: 1050, summary: "為品牌產出朗朗上口的口號。", body: "根據品牌調性與受眾，產出 8 個候選口號並標註風格。" },
  { id: "p12", galaxy: "market", type: "skill", name: "受眾雷達", en: "Audience Radar", coord: "MK-214", difficulty: 3, uses: 690, summary: "描繪目標客群的樣貌與痛點。", body: "為產品建立 3 個受眾輪廓，含動機、痛點與觸及管道。" },
  { id: "p13", galaxy: "market", type: "prompt", name: "貼文星鏈", en: "Post Chain", coord: "MK-322", difficulty: 1, uses: 1380, summary: "一個主題延展成一週社群貼文。", body: "以一個主題為核心，規劃 7 則社群貼文，各具不同切角與 CTA。" },
  { id: "p14", galaxy: "market", type: "skill", name: "成長飛輪", en: "Growth Flywheel", coord: "MK-436", difficulty: 4, uses: 410, summary: "設計自我強化的成長循環。", body: "為產品設計成長飛輪，列出各環節的槓桿與衡量指標。" },
];

export function planetsOf(galaxyId) {
  return PLANETS.filter((p) => p.galaxy === galaxyId);
}
export function galaxyById(id) {
  return GALAXIES.find((g) => g.id === id);
}
export function diffStars(n) {
  return "★".repeat(n) + "☆".repeat(5 - n);
}
export function withAlpha(hex, alpha) {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16), g = parseInt(h.slice(2, 4), 16), b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}
