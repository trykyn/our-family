// 오프라인 · 빠른 시작: 저장해 둔 것을 바로 보여 주고(기다리지 않음), 뒤에서 서버에 새 것이 있는지 받아 둠.
// 앱 화면(html · js)이 바뀌었으면 화면에 알려서, 아무도 안 만질 때 조용히 새로 고침 (GitHub Pages 10분 저장 표시 때문에 cache: 'no-cache').
const CACHE = 'our-family-v98';
const OK_ORIGINS = ['https://www.gstatic.com', 'https://fonts.googleapis.com', 'https://fonts.gstatic.com'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(['./', 'index.html', 'manifest.webmanifest', 'favicon.png', 'icon-180.png', 'icon-192.png', 'firebase-config.js', 'stickers-shared.js', 'poke-room.js', 'mission-board.js', 'piggy-bank.js'].map((u) => new Request(u, { cache: 'reload' })))));
  self.skipWaiting();
});
self.addEventListener('activate', (e) => e.waitUntil((async () => {
  for (const k of await caches.keys()) if (k.startsWith('our-family-v') && k !== CACHE) await caches.delete(k); // 예전 버전 정리
  await self.clients.claim();
})()));
let told = 0;
function tellUpdated() { // 여러 파일이 한꺼번에 바뀌어도 한 번만
  if (Date.now() - told < 5000) return;
  told = Date.now();
  self.clients.matchAll({ type: 'window' }).then((cs) => cs.forEach((c) => c.postMessage('our-family-updated')));
}
self.addEventListener('fetch', (e) => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || (u.origin !== location.origin && !OK_ORIGINS.includes(u.origin))) return;
  const own = u.origin === location.origin;
  if (own && !u.pathname.startsWith(new URL('./', self.registration.scope).pathname)) return; // 다른 앱은 건드리지 않음
  const code = own && /(\/|\.html|\.js)$/.test(u.pathname); // 앱 화면 파일: 바뀌었는지 비교
  e.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const saved = await cache.match(e.request, { ignoreSearch: own });
    const before = saved && code ? saved.clone().text() : null; // 화면에 넘기기 전에 미리 읽어 둠 (넘긴 뒤엔 못 읽음)
    const net = (own ? fetch(u.href, { cache: 'no-cache' }) : fetch(e.request)).then(async (r) => {
      if (r.ok) {
        if (before) { const [a, b] = await Promise.all([before, r.clone().text()]); if (a !== b) tellUpdated(); }
        await cache.put(e.request, r.clone());
      }
      return r;
    });
    if (saved) { e.waitUntil(net.catch(() => {})); return saved; } // 저장해 둔 것 바로 (인터넷이 느려도 기다리지 않음)
    return net;
  })());
});

// 아침 7시 알림: 서버가 내용 없이 보내면 여기서 이 휴대폰의 언어로 문구를 정해 보여 줌.
// 언어는 앱이 'our-family-prefs' 저장소에 넣어 둠 (서비스 워커는 localStorage 를 못 읽음).
self.addEventListener('push', (e) => {
  e.waitUntil((async () => {
    let lang = 'ko';
    try {
      const r = await (await caches.open('our-family-prefs')).match('lang');
      if (r && (await r.text()) === 'de') lang = 'de';
    } catch {}
    const t = lang === 'de'
      ? { title: 'Unsere Familie', body: 'Schau dir den heutigen Familienplan und die Aufgaben an.' }
      : { title: '우리가족', body: '오늘의 가족 일정과 할 일을 확인하세요' };
    await self.registration.showNotification(t.title, { body: t.body, icon: 'icon-192.png', badge: 'icon-192.png', tag: 'daily', data: { url: './' } });
  })());
});
// 알림을 누르면 앱을 열거나, 이미 열려 있으면 그 화면으로
self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  e.waitUntil((async () => {
    const all = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const c of all) if ('focus' in c) { if ('navigate' in c) c.navigate('./').catch(() => {}); return c.focus(); }
    return self.clients.openWindow('./');
  })());
});
