// オフラインでも開けるよう、アプリ本体を端末に保存します（データの同期は Firebase が担当）。
const CACHE = 'travel-app-v10';
const SHELL = ['./', 'index.html', 'app.js', 'store.js', 'icons.js', 'sheet.js', 'config.js', 'seed-singapore.js', 'manifest.webmanifest', 'icon.svg', 'icon-192.png'];
self.addEventListener('install', (e) => { e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin === location.origin) {
    // 新しい版を優先し、電波がなければ保存済みの版
    // ブラウザの一時保存を通さず、毎回いちばん新しい版を取りに行く
    e.respondWith(fetch(req, { cache: 'no-cache' }).then((res) => { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); return res; })
      .catch(() => caches.match(req, { ignoreSearch: true }).then((r) => r || caches.match('index.html'))));
  } else if (url.hostname === 'www.gstatic.com') {
    // Firebase のライブラリ（バージョン固定なので保存版を使う）
    e.respondWith(caches.match(req).then((r) => r || fetch(req).then((res) => { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); return res; })));
  }
});
