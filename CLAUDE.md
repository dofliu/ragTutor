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

1. 讀 `lessons/roadmap.json`，取**第一個** `status: "todo"` 的主題。若全部完成，自行研究一個尚未涵蓋的 RAG 技術（近期論文或業界做法），加到清單後製作。
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
4. **🧩 重點整理**：`.keypoints` 4 張卡片
5. **🧪 互動範例**：瀏覽器內真的會運算的小 demo（善用 `RagTutor.rt`：`tokenize`、`buildIndex`、`searchVector`、`searchBM25`、`rrf`、`chunk`、`highlight`），讓使用者可調參數、比較「用 / 不用這個技術」的差異。語料用繁體中文的虛構情境（公司手冊、產品 FAQ、校規、食譜…每堂換一個）。
6. **💻 程式範例**：Python，可直接執行的最小實作；手動加上 `<span class="k|s|c|f">` 語法上色。需要 LLM 時用 `anthropic` SDK（模型 `claude-sonnet-5`）。
7. **⚖️ 比較表** `table.cmp`：與前面課程的技術比較優缺點、適用情境、成本
8. **⚠️ 常見的坑 / 何時不該用**
9. **📝 小測驗**：1–2 題 `.quiz`（`data-answer` 為正解索引，由 0 起算）
10. `<nav class="pager" data-slug="<slug>">`（自動產生上下堂連結）
11. 頁尾與 `<script>`：`RagTutor.player({...})` + demo 程式

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
