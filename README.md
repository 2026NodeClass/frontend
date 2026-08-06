# Stellar Archive · 星際檔案館

一個以「星際航行」為主題的 skill / prompt 探索網站原型。使用者以「探索家」身分登艦，在星圖與 3D 銀河中瀏覽、篩選、收藏各種 AI skill 與 prompt，並可切換為「造物者」身分管理內容。

純前端 React 應用，資料目前為記憶體內的示範資料（[src/data.js](src/data.js)），沒有後端 API 或資料庫。

## 技術棧

| 分類 | 選用 |
| --- | --- |
| 框架 | React 19 + Vite 8 |
| 路由 | react-router-dom 7（`BrowserRouter`） |
| 3D 渲染 | three.js（`Galaxy3D` 頁面的全息銀河） |
| 動畫 | GSAP + `@gsap/react`（`Home` 頁進場動畫） |
| 圖節點視覺化 | 原生 `<canvas>` + 自製力導向模擬（`Explore` 頁星圖） |
| 樣式 | 純 inline style（JS 物件）+ 少量全域 CSS（[src/index.css](src/index.css)），未使用 CSS-in-JS 函式庫或 UI 套件 |
| Lint | oxlint |
| 持久化 | `localStorage`（身分與收藏），無真實後端 |

更完整的模組拆解與資料流說明見 [ARCHITECTURE.md](ARCHITECTURE.md)。

## 開發

```bash
npm install
npm run dev       # 啟動開發伺服器（Vite HMR）
npm run build     # 產出 dist/
npm run preview   # 預覽 build 結果
npm run lint       # oxlint 檢查
```

## 專案結構

```
src/
├─ main.jsx              # 進入點，掛載 BrowserRouter + App
├─ App.jsx                # 路由表，掛載全域 CursorGlow
├─ data.js                # 星系 / 行星示範資料 + 共用工具函式
├─ index.css              # 全域 reset、keyframes、cursor-glow 樣式
├─ hooks/
│  ├─ useIdentity.js      # 目前登入者身分（存 localStorage）
│  └─ useFavorites.js     # 收藏的行星 id 清單（存 localStorage）
├─ components/
│  ├─ Starfield.jsx       # 星空背景（漸層 + 星點 + 閃爍）
│  ├─ CornerBrackets.jsx  # HUD 風格四角括號裝飾
│  ├─ OrbViewport.jsx     # 旋轉光環 + 漂浮星球視覺
│  ├─ PageTopBar.jsx      # 內部頁共用頂列（含 ExplorerBadge）
│  └─ CursorGlow.jsx      # 跟隨游標的光暈，模組層 API 供外部變色
└─ pages/
   ├─ Home.jsx            # 首頁（含進場動畫、星系導覽卡片）
   ├─ Login.jsx           # 登入 / 註冊，可選「探索家」或「造物者」身分
   ├─ Explore.jsx         # 2D 力導向星圖（canvas），篩選 + 詳情側欄
   ├─ Galaxy3D.jsx        # three.js 全息銀河總覽
   ├─ PlanetDetail.jsx    # 單一 skill / prompt 詳情頁
   ├─ VoyageMap.jsx       # 我的收藏清單（航線地圖）
   └─ AdminConsole.jsx    # 造物者後台：星系 / 行星 CRUD（僅記憶體內）
```

## 名詞對照

專案用「星際航行」包裝內容分類，實際語意如下：

- **星系（Galaxy）** = 內容分類（例：寫作、程式、行銷）
- **行星（Planet）** = 一筆 skill 或 prompt 條目
- **探索家 / 造物者（Member / Creator）** = 一般瀏覽者 / 內容管理者角色
- **航線地圖（Voyage Map）** = 使用者收藏清單
