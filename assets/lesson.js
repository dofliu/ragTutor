/* RAG 動畫教室：共用腳本
 * - RagTutor.player(opts)   分鏡式動畫播放器
 * - RagTutor.rt             迷你檢索工具箱（斷詞、TF-IDF、BM25、餘弦相似度）
 * - RagTutor.quiz(el)       小測驗
 * - 自動：主題切換、課程上一堂/下一堂導覽（讀 lessons/catalog.json）
 */
(function(){
  'use strict';
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));

  /* ---------- 主題切換 ---------- */
  function initTheme(){
    try{ const t = localStorage.getItem('ragtutor-theme'); if(t) document.documentElement.dataset.theme = t; }catch(e){}
    $$('.theme-btn').forEach(b => b.addEventListener('click', () => {
      const cur = document.documentElement.dataset.theme ||
        (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      const next = cur === 'dark' ? 'light' : 'dark';
      document.documentElement.dataset.theme = next;
      try{ localStorage.setItem('ragtutor-theme', next); }catch(e){}
    }));
  }

  /* ---------- 分鏡播放器 ----------
   * HTML：
   *   <div class="player" id="p1"><div class="stage"><svg>…</svg></div></div>
   * SVG 內的元素可加：
   *   data-from="2"     從第 2 步（由 0 起算）開始顯示
   *   data-to="4"       顯示到第 4 步為止
   *   data-hot="1 3"    在第 1、3 步高亮
   *   data-dim="5"      在第 5 步變淡
   * JS：
   *   RagTutor.player({el:'#p1', steps:[{title,text}], interval:6500, onStep(i,root){}})
   */
  function player(opts){
    const root = typeof opts.el === 'string' ? $(opts.el) : opts.el;
    const steps = opts.steps || [];
    const stage = $('.stage', root);
    const interval = opts.interval || 6500;
    root.insertAdjacentHTML('beforeend',
      `<div class="bar"><b></b></div>
       <div class="caption" aria-live="polite"><div class="step-no"></div><h3></h3><p></p></div>
       <div class="controls">
         <button class="prev" aria-label="上一步">◀ 上一步</button>
         <button class="play primary">▶ 播放</button>
         <button class="next" aria-label="下一步">下一步 ▶</button>
         <div class="dots">${steps.map((_,i)=>`<i data-i="${i}" title="第 ${i+1} 步"></i>`).join('')}</div>
       </div>`);
    const bar = $('.bar b', root), playBtn = $('.play', root);
    let cur = 0, timer = null, t0 = 0, raf = 0;

    const has = (el, attr, i) => (el.getAttribute(attr) || '').split(/\s+/).includes(String(i));
    function render(i){
      cur = (i + steps.length) % steps.length;
      $$('[data-from],[data-to]', stage).forEach(el => {
        const f = +(el.getAttribute('data-from') ?? 0);
        const t = el.hasAttribute('data-to') ? +el.getAttribute('data-to') : Infinity;
        el.classList.toggle('off', !(cur >= f && cur <= t));
      });
      $$('[data-hot]', stage).forEach(el => el.classList.toggle('hot', has(el, 'data-hot', cur)));
      $$('[data-dim]', stage).forEach(el => el.classList.toggle('dim', has(el, 'data-dim', cur)));
      const s = steps[cur];
      $('.step-no', root).textContent = `STEP ${cur+1} / ${steps.length}`;
      $('.caption h3', root).textContent = s.title;
      $('.caption p', root).innerHTML = s.text;
      $$('.dots i', root).forEach((d,k) => d.classList.toggle('on', k === cur));
      if(opts.onStep) opts.onStep(cur, stage);
      t0 = performance.now();
    }
    function tick(){
      if(!timer) return;
      const p = Math.min(1, (performance.now() - t0) / interval);
      bar.style.width = (p*100) + '%';
      raf = requestAnimationFrame(tick);
    }
    function play(){
      if(timer) return stop();
      if(cur === steps.length - 1) render(0);
      playBtn.textContent = '❚❚ 暫停';
      timer = setInterval(() => {
        if(cur === steps.length - 1){ stop(); return; }
        render(cur + 1);
      }, interval);
      t0 = performance.now(); tick();
    }
    function stop(){
      clearInterval(timer); timer = null; cancelAnimationFrame(raf);
      playBtn.textContent = '▶ 播放'; bar.style.width = '0';
    }
    $('.prev', root).onclick = () => { stop(); render(cur - 1); };
    $('.next', root).onclick = () => { stop(); render(cur + 1); };
    playBtn.onclick = play;
    $$('.dots i', root).forEach(d => d.onclick = () => { stop(); render(+d.dataset.i); });
    root.tabIndex = 0;
    root.addEventListener('keydown', e => {
      if(e.key === 'ArrowRight'){ stop(); render(cur + 1); }
      if(e.key === 'ArrowLeft'){ stop(); render(cur - 1); }
      if(e.key === ' '){ e.preventDefault(); play(); }
    });
    render(0);
    return { go: render, play, stop, get index(){ return cur; } };
  }

  /* ---------- 迷你檢索工具箱 ----------
   * 中文沒有空白分詞，這裡用「英數字詞 + 中文字元二元組(bigram)」當作 token，
   * 足以在瀏覽器裡示範關鍵字/向量檢索的行為。
   */
  const rt = {
    tokenize(text){
      const out = [];
      const s = text.toLowerCase();
      (s.match(/[a-z0-9]+/g) || []).forEach(w => out.push(w));
      const han = s.match(/[一-鿿]+/g) || [];
      han.forEach(run => {
        if(run.length === 1) out.push(run);
        for(let i=0;i<run.length-1;i++) out.push(run.slice(i,i+2));
      });
      return out;
    },
    tf(tokens){ const m = new Map(); tokens.forEach(t => m.set(t,(m.get(t)||0)+1)); return m; },
    /* 建立 TF-IDF 向量索引（模擬「嵌入向量」） */
    buildIndex(docs){
      const toks = docs.map(d => rt.tokenize(d.text));
      const df = new Map();
      toks.forEach(ts => new Set(ts).forEach(t => df.set(t,(df.get(t)||0)+1)));
      const N = docs.length;
      const idf = t => Math.log((N+1)/((df.get(t)||0)+1)) + 1;
      const vec = ts => { const v = new Map(); rt.tf(ts).forEach((c,t) => v.set(t, c*idf(t))); return v; };
      const avgdl = toks.reduce((a,t)=>a+t.length,0)/Math.max(1,N);
      return { docs, toks, df, N, idf, vec, vecs: toks.map(vec), avgdl };
    },
    cosine(a,b){
      let dot=0, na=0, nb=0;
      a.forEach((v,k) => { na += v*v; if(b.has(k)) dot += v*b.get(k); });
      b.forEach(v => nb += v*v);
      return (na && nb) ? dot/Math.sqrt(na*nb) : 0;
    },
    /* 向量（TF-IDF 餘弦）檢索 */
    searchVector(index, query, k=3){
      const q = index.vec(rt.tokenize(query));
      return index.docs.map((d,i) => ({ i, doc:d, score: rt.cosine(q, index.vecs[i]) }))
        .sort((a,b) => b.score - a.score).slice(0, k);
    },
    /* BM25 關鍵字檢索 */
    searchBM25(index, query, k=3, k1=1.5, b=0.75){
      const qt = [...new Set(rt.tokenize(query))];
      return index.docs.map((d,i) => {
        const tf = rt.tf(index.toks[i]), dl = index.toks[i].length;
        let s = 0;
        qt.forEach(t => {
          const f = tf.get(t) || 0; if(!f) return;
          const n = index.df.get(t) || 0;
          const idf = Math.log(1 + (index.N - n + .5)/(n + .5));
          s += idf * (f*(k1+1)) / (f + k1*(1 - b + b*dl/index.avgdl));
        });
        return { i, doc:d, score:s };
      }).sort((a,b) => b.score - a.score).slice(0, k);
    },
    /* 倒數排名融合 RRF：lists 為多個排序結果 */
    rrf(lists, k=60){
      const m = new Map();
      lists.forEach(list => list.forEach((h,rank) => {
        const e = m.get(h.i) || { i:h.i, doc:h.doc, score:0 };
        e.score += 1/(k + rank + 1); m.set(h.i, e);
      }));
      return [...m.values()].sort((a,b) => b.score - a.score);
    },
    /* 依字數切塊，overlap 為重疊字數 */
    chunk(text, size=80, overlap=20){
      const out = []; const step = Math.max(1, size - overlap);
      for(let i=0;i<text.length;i+=step){ out.push(text.slice(i,i+size)); if(i+size>=text.length) break; }
      return out;
    },
    /* 把查詢中出現的 bigram 在文字裡標記出來 */
    highlight(text, query){
      const grams = new Set(rt.tokenize(query).filter(t => t.length >= 2));
      if(!grams.size) return escapeHtml(text);
      let html = '', i = 0;
      while(i < text.length){
        const g = text.slice(i,i+2).toLowerCase();
        if(grams.has(g)){
          let j = i + 2;
          while(j < text.length && grams.has(text.slice(j-1,j+1).toLowerCase())) j++;
          html += '<mark>' + escapeHtml(text.slice(i,j)) + '</mark>'; i = j;
        } else { html += escapeHtml(text[i]); i++; }
      }
      return html;
    }
  };
  function escapeHtml(s){ return s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

  /* ---------- 小測驗 ----------
   * <div class="quiz card" data-answer="1">
   *   <p>題目</p><button class="opt">A</button><button class="opt">B</button>
   *   <div class="why">解析</div></div>
   */
  function initQuiz(){
    $$('.quiz').forEach(q => {
      const ans = +q.dataset.answer;
      $$('.opt', q).forEach((b,i) => b.addEventListener('click', () => {
        if(q.classList.contains('done')) return;
        q.classList.add('done');
        b.classList.add(i === ans ? 'right' : 'wrong');
        $$('.opt', q)[ans].classList.add('right');
      }));
    });
  }

  /* ---------- 課程導覽（上一堂 / 下一堂） ---------- */
  async function initPager(){
    const el = $('.pager[data-slug]'); if(!el) return;
    try{
      const res = await fetch(el.dataset.catalog || 'catalog.json', {cache:'no-cache'});
      const list = (await res.json()).lessons;
      const i = list.findIndex(l => l.slug === el.dataset.slug);
      const link = (l, cls, label) => l
        ? `<a class="card ${cls}" href="${l.file.replace(/^lessons\//,'')}"><span class="muted">${label}</span><br><b>${escapeHtml(l.title)}</b></a>`
        : '<span></span>';
      el.innerHTML = link(list[i-1], 'prev', '← 上一堂') + link(list[i+1], 'next', '下一堂 →');
    }catch(e){ /* 以 file:// 開啟時 fetch 會失敗，略過導覽即可 */ }
  }

  document.addEventListener('DOMContentLoaded', () => { initTheme(); initQuiz(); initPager(); });
  window.RagTutor = { player, rt, escapeHtml };
})();
