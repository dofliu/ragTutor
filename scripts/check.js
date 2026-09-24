// 以無頭瀏覽器檢查網站：頁面錯誤、播放器每一步、互動範例、截圖。
// 用法：NODE_PATH=$(npm root -g) node scripts/check.js [輸出資料夾]
const http = require('http'), fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const root = path.resolve(__dirname, '..'), out = path.resolve(process.argv[2] || path.join(root, '.qa'));
const types = { '.html':'text/html; charset=utf-8', '.css':'text/css', '.js':'text/javascript', '.json':'application/json', '.svg':'image/svg+xml', '.png':'image/png' };

const server = http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]); if (p.endsWith('/')) p += 'index.html';
  const f = path.join(root, p);
  if (!f.startsWith(root) || !fs.existsSync(f)) { res.writeHead(404); return res.end('404'); }
  res.writeHead(200, { 'content-type': types[path.extname(f)] || 'application/octet-stream' });
  fs.createReadStream(f).pipe(res);
});

(async () => {
  await new Promise(r => server.listen(0, r));
  const base = `http://127.0.0.1:${server.address().port}`;
  fs.mkdirSync(out, { recursive: true });
  const catalog = JSON.parse(fs.readFileSync(path.join(root, 'lessons/catalog.json'), 'utf8'));
  JSON.parse(fs.readFileSync(path.join(root, 'lessons/roadmap.json'), 'utf8'));
  const pages = ['index.html', ...catalog.lessons.map(l => l.file)];
  const browser = await chromium.launch(fs.existsSync('/opt/pw-browsers/chromium') ? {} : {});
  let failed = 0;
  for (const theme of ['light', 'dark']) {
    for (const width of [1200, 390]) {
      const page = await browser.newPage({ viewport: { width, height: 900 }, colorScheme: theme });
      for (const p of pages) {
        const errs = [];
        page.removeAllListeners('pageerror'); page.removeAllListeners('console');
        page.on('pageerror', e => errs.push(e.message));
        page.on('console', m => m.type() === 'error' && errs.push(m.text()));
        await page.goto(`${base}/${p}`, { waitUntil: 'networkidle' });
        if (!fs.existsSync(path.join(root, p))) errs.push('檔案不存在');
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1);
        if (overflow) errs.push(`寬度 ${width} 出現水平捲動`);
        const steps = await page.$$eval('.player .dots i', d => d.length);
        const name = `${path.basename(p, '.html')}_${theme}_${width}`;
        if (steps && width === 1200) {
          for (let i = 0; i < steps; i++) {
            await page.click(`.player .dots i[data-i="${i}"]`); await page.waitForTimeout(700);
            await (await page.$('.player')).screenshot({ path: path.join(out, `${name}_step${i + 1}.png`) });
          }
        }
        await page.screenshot({ path: path.join(out, `${name}_full.png`), fullPage: true });
        if (errs.length) { failed++; console.log(`✗ ${p} [${theme} ${width}]\n  ` + errs.join('\n  ')); }
        else console.log(`✓ ${p} [${theme} ${width}] 分鏡 ${steps} 步`);
      }
      await page.close();
    }
  }
  await browser.close(); server.close();
  console.log(failed ? `\n${failed} 項檢查失敗` : `\n全部通過，截圖在 ${out}`);
  process.exit(failed ? 1 : 0);
})();
