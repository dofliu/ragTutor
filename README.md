# RAG 動畫教室 🧭

每天一堂，用**分鏡動畫 + 互動範例 + 程式碼**看懂一種 RAG（Retrieval-Augmented Generation，檢索增強生成）技術。

🌐 網站：https://dofliu.github.io/ragTutor/

| # | 課程 |
|---|---|
| 001 | [基礎 RAG：先查資料再回答](https://dofliu.github.io/ragTutor/lessons/001-naive-rag.html) |
| 002 | [切塊策略：固定長度、遞迴與語意切塊](https://dofliu.github.io/ragTutor/lessons/002-chunking.html) |
| 003 | [嵌入與向量檢索：餘弦相似度、ANN 與 HNSW](https://dofliu.github.io/ragTutor/lessons/003-embeddings.html) |
| 004 | [混合檢索：BM25 關鍵字 + 向量 + RRF 融合](https://dofliu.github.io/ragTutor/lessons/004-hybrid-search.html) |
| 005 | [重排序：Bi-encoder 召回、Cross-encoder 精排](https://dofliu.github.io/ragTutor/lessons/005-reranking.html) |
| 006 | [查詢改寫與多重查詢 Multi-Query](https://dofliu.github.io/ragTutor/lessons/006-query-rewriting.html) |
| 007 | [HyDE：先生成假設答案再檢索](https://dofliu.github.io/ragTutor/lessons/007-hyde.html) |
| 008 | [父子文件檢索：小塊檢索、大塊回傳](https://dofliu.github.io/ragTutor/lessons/008-parent-document.html) |
| 009 | [情境化檢索：替每個片段加上文件脈絡](https://dofliu.github.io/ragTutor/lessons/009-contextual-retrieval.html) |
| 010 | [RAG-Fusion：多查詢 + 倒數排名融合](https://dofliu.github.io/ragTutor/lessons/010-rag-fusion.html) |
| 011 | [中繼資料過濾與自我查詢檢索](https://dofliu.github.io/ragTutor/lessons/011-metadata-filtering.html) |
| 012 | [上下文壓縮：只留下與問題有關的句子](https://dofliu.github.io/ragTutor/lessons/012-context-compression.html) |
| 013 | [Self-RAG：模型自己判斷何時檢索、是否可信](https://dofliu.github.io/ragTutor/lessons/013-self-rag.html) |
| 014 | [CRAG 修正式 RAG：檢索品質評估與網路補救](https://dofliu.github.io/ragTutor/lessons/014-crag.html) |

完整主題路線圖見 [`lessons/roadmap.json`](lessons/roadmap.json)；製作規範見 [`CLAUDE.md`](CLAUDE.md)。

## 本機預覽

```bash
python3 -m http.server 8000   # 開啟 http://localhost:8000
```

## 授權

MIT，歡迎用於教學與推廣。
