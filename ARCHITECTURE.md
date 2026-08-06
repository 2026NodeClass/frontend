# 架構說明

本文件描述 Stellar Archive 的執行架構、資料流與各頁面/模組的職責。專案定位是「純前端原型」：沒有伺服器、沒有真正的驗證機制、沒有資料庫，所有「持久化」都只到 `localStorage` 為止，重新整理即可還原成初始示範資料（收藏與身分除外）。

## 1. 整體架構圖

```
┌─────────────────────────────────────────────────────────┐
│ main.jsx                                                  │
│   BrowserRouter                                            │
│     └─ App.jsx                                             │
│          ├─ CursorGlow (全域掛載一次，跨頁共用)              │
│          └─ Routes                                         │
│               ├─ "/"          → Home.jsx                   │
│               ├─ "/login"     → Login.jsx                  │
│               ├─ "/explore"   → Explore.jsx                │
│               ├─ "/galaxy"    → Galaxy3D.jsx                │
│               ├─ "/planet/:id"→ PlanetDetail.jsx            │
│               ├─ "/admin"     → AdminConsole.jsx            │
│               └─ "/voyage"    → VoyageMap.jsx                │
└─────────────────────────────────────────────────────────┘
                         │
          共用資料層 / 狀態層（無後端）
          ┌─────────────────────────────┐
          │ data.js      → 靜態示範資料    │
          │ useIdentity  → localStorage   │
          │ useFavorites → localStorage   │
          └─────────────────────────────┘
```

沒有全域狀態管理套件（無 Redux / Zustand / Context）。跨頁共享的狀態只有兩種，且都各自封裝成 hook，內部直接讀寫 `localStorage`：

- `useIdentity`（[src/hooks/useIdentity.js](src/hooks/useIdentity.js)）：目前登入者的暱稱與角色（`member` / `creator`）
- `useFavorites`（[src/hooks/useFavorites.js](src/hooks/useFavorites.js)）：收藏的行星 id 陣列

每個頁面各自呼叫這兩個 hook 取值，並非透過 Context 往下傳遞——因為 hook 內部用模組層變數 `STORE_KEY` 對應同一把 `localStorage` key，所以不同頁面呼叫時能讀到一致的值，但彼此不會即時同步（例如兩個分頁同時開著不會互相通知）。

## 2. 資料模型（[src/data.js](src/data.js)）

整份資料是寫死在程式碼裡的陣列，沒有 fetch、沒有非同步載入：

```js
GALAXIES: { id, name, en, color, desc }[]
PLANETS:  { id, galaxy, type, name, en, coord, difficulty, uses, summary, body }[]
```

- `galaxy` 是 `PLANETS[i].galaxy` → `GALAXIES[i].id` 的外鍵字串，沒有正規化查找表，靠 `.find()` / `.filter()` 即時查詢。
- `type` 只有兩種列舉值：`"skill" | "prompt"`。
- 輔助函式：`planetsOf(galaxyId)`、`galaxyById(id)`、`diffStars(n)`（把整數難度轉成 `★★★☆☆`）、`withAlpha(hex, alpha)`（hex 轉 rgba，供 hover 光暈與動態配色使用）。

`AdminConsole.jsx` 對這份資料的「編輯」只是把 `GALAXIES` / `PLANETS` 複製進 component state（`useState(() => GALAXIES.map(g => ({...g})))`），CRUD 操作全部發生在該 state 上，**不會寫回 `data.js` 或任何持久化層**——重新整理頁面後編輯內容會消失。這是刻意的原型限制，不是 bug。

## 3. 路由與頁面職責

| 路徑 | 元件 | 職責 |
| --- | --- | --- |
| `/` | `Home` | 品牌首頁，GSAP 進場動畫 + 三個星系導覽卡（連到 `/explore?g=<id>`） |
| `/login` | `Login` | 登入/註冊表單（無驗證），選擇角色後寫入 `useIdentity` 並導向 `/explore` 或 `/admin` |
| `/explore` | `Explore` | 主要瀏覽介面：2D 力導向圖 + 篩選側欄 + 詳情側欄 |
| `/galaxy` | `Galaxy3D` | three.js 全息銀河總覽，純視覺展示 + 星系標籤 |
| `/planet/:id` | `PlanetDetail` | 單一 skill/prompt 全文、複製內容、收藏/取消收藏、同星系推薦 |
| `/admin` | `AdminConsole` | 造物者後台，星系與行星的新增/編輯/刪除（記憶體內） |
| `/voyage` | `VoyageMap` | 使用者收藏清單，依收藏順序列出「航線」 |

路由之間沒有守衛（guard）：任何人都可以直接輸入網址進入 `/admin`，`identity.role` 只影響登入後的導向與 UI 文案，不做存取控制。

## 4. Explore 頁：自製力導向圖

[src/pages/Explore.jsx](src/pages/Explore.jsx) 是全站最複雜的元件，核心是一個純手寫的簡化力導向模擬（不依賴 d3-force 或任何圖形函式庫），畫在原生 `<canvas>` 上：

- **節點（nodes）**：每個星系一個 hub 節點，每個行星一個節點，初始位置以星系為圓心散開。
- **邊（edges）**：行星 → 所屬星系。
- **物理步進（`tick()`，每幀執行）**：
  1. 節點間互斥力（`rep = k / d²`，星系節點互斥力較強）
  2. 邊的彈簧力（拉回設定的 `rest` 靜止長度）
  3. 向中心的微弱引力（避免整體漂移出畫面）
  4. 阻尼衰減（`v *= 0.86`）
- **互動**：`onMouseDown/Move/Up` 手刻拖曳（拖節點 or 平移畫布）、`onWheel` 手刻縮放，`toWorld/toScreen` 兩個座標轉換函式處理 world↔screen 映射與縮放中心。
- **篩選**：搜尋文字、星系開關、type 開關都存在 React state，但物理迴圈本身跑在 `useEffect` 建立的 `requestAnimationFrame` 迴圈裡、不依賴 re-render；篩選條件透過 `filterRef`（一個 ref）同步進迴圈內的 `active(n)` 判斷式，避免每次 keystroke 都重建整個模擬。
- 點選行星節點會設定 `sel` state，右側詳情欄顯示該行星摘要與「登陸此行星」連結到 `/planet/:id`。

這個 canvas 迴圈在元件卸載時會清掉 `requestAnimationFrame`、移除所有事件監聽（`resize`/`mousemove`/`mouseup`/`mousedown`/`wheel`），避免記憶體洩漏。

## 5. Galaxy3D 頁：three.js 場景

[src/pages/Galaxy3D.jsx](src/pages/Galaxy3D.jsx) 在 `useEffect` 中手動建立一個完整的 three.js 場景（沒有用 react-three-fiber，是直接命令式操作 three.js API）：

- `PerspectiveCamera` + `WebGLRenderer` + `OrbitControls`（開啟 `autoRotate`、`enableDamping`）
- 三層點雲：
  - 螺旋銀河點雲（14,000 點，4 條旋臂，用極座標公式產生位置與由內而外的白→鋼灰→炭黑漸層色）
  - 銀河核心亮點（1,200 點，球狀分布）
  - 遠景星空（2,500 點，大半徑球殼）
- 三個 `Sprite` + `RingGeometry` 標記三個星系在 3D 空間中的座標（`layout` 陣列手動指定角度與半徑）
- 星系名稱標籤是**DOM 元素**（不是 three.js 文字網格）：每幀用 `Vector3.project(camera)` 把 3D 座標投影成螢幕座標，再用 CSS `left/top` 定位疊在 canvas 上方（[src/pages/Galaxy3D.jsx:157-162](src/pages/Galaxy3D.jsx#L157-L162)）。
- `animate()` 迴圈：整體點雲緩慢自轉 + `controls.update()` + 重新渲染。
- 卸載時呼叫 `controls.dispose()`、`renderer.dispose()`、移除 DOM 標籤與 canvas，避免 WebGL context 洩漏。

## 6. 共用元件

| 元件 | 用途 |
| --- | --- |
| `Starfield` | 純 CSS 漸層 + radial-gradient 星點背景，多數星際頁面共用 |
| `CornerBrackets` | HUD 風格四角括號裝飾框，靠 `corners` prop 決定顯示哪幾角 |
| `OrbViewport` | 旋轉光環 + 漂浮球體，Login / PlanetDetail 的「星球特寫」視覺 |
| `PageTopBar` | 內頁共用的 56px 頂列（返回連結 + 標題 + 右側插槽），並匯出 `ExplorerBadge` 顯示目前登入者名稱首字 |
| `CursorGlow` | 掛在 `App.jsx` 根層級、只掛載一次的游標光暈。透過模組層變數 `api` 暴露 `setGlowColor()` / `resetGlowColor()` 兩個**非 React 標準**的命令式函式，讓任何頁面用 `onMouseEnter` 直接改變全域光暈顏色（例如 hover 到某星系卡片時光暈變成該星系代表色），不需要 Context 或 props 逐層傳遞 |

`CursorGlow` 的模組層 `api` 是這個專案唯一的「全域可變狀態」模式；因為它只掛載一次且全站共用，用單例模式比引入 Context 更輕量，但也代表這個元件必須確保先掛載（`App.jsx` 中放在 `<Routes>` 之前）才能讓其他頁面呼叫 `setGlowColor` 生效。

## 7. 樣式方案

沒有 CSS Modules、Tailwind、styled-components 等方案。所有版面樣式都是 **inline style 物件**寫在 JSX 裡，並在每個檔案頂部宣告一組色票常數（`ink`、`inkDim`、`inkFaint`、`line`、`lineStrong`、`steel` 等），跨檔案沒有共享——每個頁面/元件各自重複宣告同一組顏色字串。全域 CSS（[src/index.css](src/index.css)）只負責：

- Reset（`box-sizing`、預設邊距）
- `@keyframes`（`twinkle`、`drift`、`spinSlow`/`spinRev`、`floatY`、`grainShift` 等）
- `.cursor-glow` 與 `.glx-label` 這類無法用 inline style 表達（need `::before`、CSS 變數動畫、`@property`）的樣式
- `film-grain` / `scanlines` 等 Home 頁專屬的復古質感疊層

## 8. 身分與收藏持久化

兩個 hook 都遵循相同模式：`useState(load)` 惰性初始化 → 對外暴露 setter → setter 內部同步寫回 `localStorage`，並用 `try/catch` 吞掉寫入失敗（例如無痕模式關閉 storage）。

- `stellar_identity`：`{ name, role }`，預設 `{ name: "林航", role: "member" }`
- `stellar_favorites`：`string[]`（行星 id 陣列）

沒有登出機制、沒有 session 過期、沒有多使用者隔離——`localStorage` 是瀏覽器層級全域共用，同一瀏覽器換人使用會沿用上一位的身分與收藏。

## 9. 已知的架構限制（原型階段）

- **無真正驗證**：`Login.jsx` 的 email/密碼輸入框不接任何邏輯，`submit()` 只看角色選擇。
- **無路由守衛**：`/admin` 對所有人開放。
- **AdminConsole 的編輯不持久化**：只存在 component state，reload 即消失。
- **無錯誤邊界（Error Boundary）**：三個資料查找（`PLANETS.find`、`GALAXIES.find`）在 `PlanetDetail`/`Explore` 用 `|| PLANETS[0]` 或條件判斷做防呆，但沒有全站層級的錯誤處理。
- **無測試**：目前沒有任何單元測試或 e2e 測試。

若要把這個原型推進到正式產品，優先順序建議：抽出共用色票/主題常數 → 加入路由守衛 → 把 `data.js` 換成真正的 API 層（同時讓 `AdminConsole` 的 CRUD 動作打 API）→ 補測試。
