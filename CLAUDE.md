# RAG 動畫教室：製作規範

這個 repo 是一個 GitHub Pages 靜態網站，每天新增一堂 RAG 技術教學頁。
網站：https://dofliu.github.io/ragTutor/ （push 到 `main` 後由 `.github/workflows/pages.yml` 自動部署）

## 結構

```
index.html              首頁（讀 lessons/catalog.json 與 roadmap.json 自動列出課程）
assets/style.css        共用樣式（色彩 token、深淺色主題、播放器、互動範例元件）
assets/lesson.js        共用腳本：RagTutor.player（分鏡播放器）、RagTutor.rt（檢索工具箱）、小測驗、上下堂導覽
lessons/NNN-slug.html   每一堂課（單一 HTML，不需建置）
lessons/catalog.json    已上線課程（首頁與上下堂導覽用）
lessons/roadmap.json    主題路線圖（status: todo / done）
scripts/check.js        無頭瀏覽器檢查：錯誤、水平捲動、每個分鏡截圖
```

## 每日新增一堂課的流程

1. 讀 `lessons/roadmap.json`，取**第一個** `status: "todo"` 的主題（`scenario` 欄位是建議的風電運維情境）。若全部完成，自行研究一個尚未涵蓋的 RAG 技術（近期論文或業界做法），連同 `scenario` 加到清單後製作。
2. 以 `lessons/001-naive-rag.html` 為範本，新檔名為 `lessons/<三位數編號>-<slug>.html`，編號 = catalog 最後一堂 + 1。
3. 查證技術內容（原始論文、官方文件）。不確定的數字不要寫；範例資料一律標註為虛構。
4. 更新 `lessons/catalog.json`（加到陣列最後，`date` 用今天日期）與 `roadmap.json`（改 `done`、填 `file`）。
5. 執行檢查並**看截圖**：
   ```bash
   NODE_PATH=$(npm root -g) node scripts/check.js /tmp/qa
   ```
   必須全部通過；逐張檢視分鏡截圖，修正文字重疊、線條穿過文字、元素超出畫面。
6. commit（訊息：`新增第 NNN 堂：<標題>`）並 push 到 `main`。

## 每堂課必備區塊（順序固定）

1. 標籤列：`第 NNN 堂`、難度（`lv1` 入門 / `lv2` 進階 / `lv3` 高階）、預估時間
2. `<h1>` 標題 + `.lead` 一段話說明「這個技術解決什麼問題」
3. **🎬 動畫**：`.player` 內一張 inline SVG（viewBox 約 `0 0 920 430`），6–10 個分鏡
   - 用 `data-from` / `data-to` / `data-hot` / `data-dim` 控制每一步顯示什麼（見 `assets/lesson.js` 註解）
   - 第一步先呈現「沒有這個技術時的問題」，最後一步呈現「改善後的結果」
   - 每步 `text` 60–120 字，關鍵詞用 `<b>`
   - 色彩只用 CSS 變數：`--doc` 文件、`--vec` 向量/嵌入、`--query` 問題、`--llm` 模型、`--good` 正確/入選、`--bad` 錯誤、`--warn`、`--accent`
   - 流動用 `class="flow"`（虛線流動），強調用 `class="pulse"`
   - 情境取自〈範例情境：風電運維〉，例如技師拿告警代碼查手冊、工程師找維修 SOP
4. **🧩 重點整理**：`.keypoints` 4 張卡片
5. **🧪 互動範例**：瀏覽器內真的會運算的小 demo（善用 `RagTutor.rt`：`tokenize`、`buildIndex`、`searchVector`、`searchBM25`、`rrf`、`chunk`、`highlight`），讓使用者可調參數、比較「用 / 不用這個技術」的差異。語料用〈範例情境：風電運維〉的虛構風場資料（繁體中文），每堂換不同的文件類型或子系統。
6. **💻 程式範例**：Python，可直接執行的最小實作，範例文件與查詢同樣用風電運維情境；手動加上 `<span class="k|s|c|f">` 語法上色。需要 LLM 時用 `anthropic` SDK（模型 `claude-sonnet-5`）。
7. **⚖️ 比較表** `table.cmp`：與前面課程的技術比較優缺點、適用情境、成本
8. **⚠️ 常見的坑 / 何時不該用**
9. **📝 小測驗**：1–2 題 `.quiz`（`data-answer` 為正解索引，由 0 起算）
10. `<nav class="pager" data-slug="<slug>">`（自動產生上下堂連結）
11. 頁尾與 `<script>`：`RagTutor.player({...})` + demo 程式

## 範例情境：風電運維（全系列共用）

所有課程的動畫、互動範例與程式範例都以**風力發電運維（O&M, Operations & Maintenance）**為範例領域，讓讀者在同一個場景裡比較每種 RAG 技術的差異。

- **場景設定（虛構）**：「鷗灣離岸風場」，風機編號 `WTG-01`～`WTG-40`，機型「OW-8」；需要新舊機型對照時用舊款「OW-6」，需要陸域對照時用「山嵐陸域風場」。
- **子系統**：葉片、變槳系統（pitch）、偏航系統（yaw）、主軸承、齒輪箱、發電機、變流器、塔架與基礎、海纜與變電站。
- **知識庫文件類型**：SCADA 告警代碼手冊、維修手冊與標準作業程序（SOP）、維修工單、巡檢報告（葉片無人機巡檢、塔架目視）、狀態監測系統（CMS）的振動與油液分析報告、技術通報、備品料號表、工安規範（高處作業、登船、上鎖掛牌 LOTO）、天候與海象紀錄。每堂換不同的文件類型或子系統取材。
- **提問的人**：現場技師、運維工程師、遠端監控中心值班人員、備品管理人員。
- **命名慣例（虛構）**：告警代碼 `子系統縮寫-三位數`（如 `PT-203` 變槳、`GB-117` 齒輪箱、`YW-042` 偏航、`CV-310` 變流器），工單 `WO-2026-0412`，料號如 `GB-BRG-07`。
- **正確性**：
  - 元件功能、常見故障模式、維護方式等技術敘述要查證（IEC 61400 系列、原廠公開文件、學術論文），不確定就不寫。
  - 告警代碼、工單、料號、門檻值、日期、人名一律虛構；頁面用 `.callout.warn` 註明「風場、機型與數據皆為虛構，實際作業以原廠手冊與現場規範為準」。
  - 不使用真實風場名稱，也不冒用真實廠牌的機型或告警代碼。
- `lessons/roadmap.json` 每個主題的 `scenario` 是建議情境，可依教學需要調整。

## 視覺風格：簡約札記（Journal）· 火影橘

- 主色 `--accent`（火影橘）只用在重點：刊頭方塊、h2 上方短橫線、步驟編號、主要按鈕、選中狀態；連結文字用 `--accent-ink`，橘底上的文字用 `--on-accent`（不要寫死 `#fff`）。
- 紙張感：米白底、細線分隔、無陰影、小圓角（`--radius`）；標題用 `--serif`，編號／日期／英文副標用 `--mono`。
- 共用元件（`.seg`、`.chips`、`.keypoints`、`.demo`…）的樣式都在 `assets/style.css`，課程頁不要再各自加 `<style>` 覆寫。
- SVG 內的語意色（`--doc`、`--vec`、`--query`…）維持不變；`--warn` 是芥末黃，刻意和火影橘區分開。

## 規範

- 語言：繁體中文（台灣用語），技術名詞第一次出現附英文。
- 純靜態：不加外部 JS 函式庫、不加建置步驟；只引用 `../assets/style.css` 與 `../assets/lesson.js`。
- 需要新的共用功能時可以擴充 `assets/lesson.js` / `style.css`，但不得破壞既有課程（改完要跑 check 看所有頁面）。
- 手機寬度 390px 不得出現水平捲動；SVG 會自動縮放，但字級不要小於 11。
