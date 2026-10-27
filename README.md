# RAG 動畫教室 🧭

每天一堂，用**分鏡動畫 + 互動範例 + 程式碼**看懂一種 RAG（Retrieval-Augmented Generation，檢索增強生成）技術。

🌐 網站：https://dofliu.github.io/ragTutor/

| # | 課程 |
|---|---|
| 001 | [基礎 RAG：先查資料再回答](https://dofliu.github.io/ragTutor/lessons/001-naive-rag.html) |
| 002 | [切塊策略：固定長度、遞迴與語意切塊](https://dofliu.github.io/ragTutor/lessons/002-chunking.html) |
| 003 | [嵌入與向量檢索：餘弦相似度、ANN 與 HNSW](https://dofliu.github.io/ragTutor/lessons/003-embeddings.html) |
| 004 | [混合檢索：BM25 關鍵字 + 向量 + RRF 融合](https://dofliu.github.io/ragTutor/lessons/004-hybrid-search.html) |
| 🎯 關卡 1 | [測驗關卡 1：檢索基礎打底（第 001–004 堂）](https://dofliu.github.io/ragTutor/lessons/quiz-1-retrieval-basics.html) |
| 005 | [重排序：Bi-encoder 召回、Cross-encoder 精排](https://dofliu.github.io/ragTutor/lessons/005-reranking.html) |
| 006 | [查詢改寫與多重查詢 Multi-Query](https://dofliu.github.io/ragTutor/lessons/006-query-rewriting.html) |
| 007 | [HyDE：先生成假設答案再檢索](https://dofliu.github.io/ragTutor/lessons/007-hyde.html) |
| 008 | [父子文件檢索：小塊檢索、大塊回傳](https://dofliu.github.io/ragTutor/lessons/008-parent-document.html) |
| 🎯 關卡 2 | [測驗關卡 2：把檢索調準（第 005–008 堂）](https://dofliu.github.io/ragTutor/lessons/quiz-2-retrieval-tuning.html) |
| 009 | [情境化檢索：替每個片段加上文件脈絡](https://dofliu.github.io/ragTutor/lessons/009-contextual-retrieval.html) |
| 010 | [RAG-Fusion：多查詢 + 倒數排名融合](https://dofliu.github.io/ragTutor/lessons/010-rag-fusion.html) |
| 011 | [中繼資料過濾與自我查詢檢索](https://dofliu.github.io/ragTutor/lessons/011-metadata-filtering.html) |
| 012 | [上下文壓縮：只留下與問題有關的句子](https://dofliu.github.io/ragTutor/lessons/012-context-compression.html) |
| 🎯 關卡 3 | [測驗關卡 3：脈絡、融合與過濾（第 009–012 堂）](https://dofliu.github.io/ragTutor/lessons/quiz-3-context-and-filtering.html) |
| 013 | [Self-RAG：模型自己判斷何時檢索、是否可信](https://dofliu.github.io/ragTutor/lessons/013-self-rag.html) |
| 014 | [CRAG 修正式 RAG：檢索品質評估與網路補救](https://dofliu.github.io/ragTutor/lessons/014-crag.html) |
| 015 | [Adaptive RAG：依問題難度選擇路線](https://dofliu.github.io/ragTutor/lessons/015-adaptive-rag.html) |
| 016 | [RAPTOR：遞迴摘要樹檢索](https://dofliu.github.io/ragTutor/lessons/016-raptor.html) |
| 🎯 關卡 4 | [測驗關卡 4：自我反思、修正與路由（第 013–016 堂）](https://dofliu.github.io/ragTutor/lessons/quiz-4-self-correct-route.html) |
| 017 | [GraphRAG：知識圖譜與社群摘要](https://dofliu.github.io/ragTutor/lessons/017-graphrag.html) |
| 018 | [ColBERT 延遲互動：逐詞向量比對](https://dofliu.github.io/ragTutor/lessons/018-colbert.html) |
| 019 | [Agentic RAG：讓代理人規劃多步檢索](https://dofliu.github.io/ragTutor/lessons/019-agentic-rag.html) |
| 020 | [多模態 RAG：圖片、表格與 PDF 版面](https://dofliu.github.io/ragTutor/lessons/020-multimodal-rag.html) |
| 🎯 關卡 5 | [測驗關卡 5：圖譜、逐詞比對、代理人與多模態（第 017–020 堂）](https://dofliu.github.io/ragTutor/lessons/quiz-5-graph-agent-multimodal.html) |
| 021 | [RAG 評估：忠實度、答案相關性、檢索召回](https://dofliu.github.io/ragTutor/lessons/021-rag-evaluation.html) |
| 022 | [長上下文 vs RAG：何時該用哪個](https://dofliu.github.io/ragTutor/lessons/022-long-context-vs-rag.html) |
| 023 | [延遲切塊 Late Chunking：先嵌入整份文件，再切塊](https://dofliu.github.io/ragTutor/lessons/023-late-chunking.html) |
| 024 | [RAG 安全：知識庫投毒與間接提示注入](https://dofliu.github.io/ragTutor/lessons/024-rag-security.html) |
| 🎯 關卡 6 | [測驗關卡 6：評估、長上下文、延遲切塊與安全（第 021–024 堂）](https://dofliu.github.io/ragTutor/lessons/quiz-6-eval-context-security.html) |
| 025 | [RAG 引用與歸因：讓每一句答案都能回頭查證](https://dofliu.github.io/ragTutor/lessons/025-citation-attribution.html) |
| 026 | [語意快取：相似的問題，直接重用上次的答案](https://dofliu.github.io/ragTutor/lessons/026-semantic-caching.html) |
| 027 | [向量壓縮：Matryoshka 截斷與量化，讓索引小一個數量級](https://dofliu.github.io/ragTutor/lessons/027-vector-compression.html) |
| 028 | [充分上下文與拒答：檢索到的內容，夠回答嗎？](https://dofliu.github.io/ragTutor/lessons/028-sufficient-context.html) |
| 🎯 關卡 7 | [測驗關卡 7：引用、快取、向量壓縮與充分上下文（第 025–028 堂）](https://dofliu.github.io/ragTutor/lessons/quiz-7-cite-cache-compress-sufficient.html) |
| 029 | [SPLADE 學習式稀疏檢索：讓關鍵字檢索聽懂口語](https://dofliu.github.io/ragTutor/lessons/029-splade.html) |
| 030 | [領域嵌入微調：用合成查詢與困難負例，教嵌入模型聽懂你的領域](https://dofliu.github.io/ragTutor/lessons/030-embedding-finetuning.html) |
| 031 | [上下文排序：Lost in the Middle 與兩端排列](https://dofliu.github.io/ragTutor/lessons/031-lost-in-the-middle.html) |

完整主題路線圖見 [`lessons/roadmap.json`](lessons/roadmap.json)；製作規範見 [`CLAUDE.md`](CLAUDE.md)。

## 本機預覽

```bash
python3 -m http.server 8000   # 開啟 http://localhost:8000
```

## 授權

MIT，歡迎用於教學與推廣。
