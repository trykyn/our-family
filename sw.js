// 오프라인 지원: 네트워크 우선, 실패하면 캐시.
// 앱 파일은 매번 서버에 "바뀌었나요?"를 물어봄(cache: 'no-cache'). GitHub Pages가 붙이는 10분 저장 표시 때문에
// 홈 화면 앱이 예전 화면을 계속 보여 주는 일을 막음. 안 바뀌었으면 서버가 짧게 "그대로"라고만 답함.
const CACHE = 'our-family-v34';
const OK_ORIGINS = ['https://www.gstatic.com', 'https://fonts.googleapis.com', 'https://fonts.gstatic.com'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(['./', 'index.html', 'manifest.webmanifest', 'favicon.png', 'icon-180.png', 'icon-192.png', 'firebase-config.js'])));
  self.skipWaiting();
});
self.addEventListener('activate', (e) => e.waitUntil((async () => {
  for (const k of await caches.keys()) if (k.startsWith('our-family-v') && k !== CACHE) await caches.delete(k); // 예전 버전 정리
  await self.clients.claim();
})()));
self.addEventListener('fetch', (e) => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || (u.origin !== location.origin && !OK_ORIGINS.includes(u.origin))) return;
  const own = u.origin === location.origin;
  e.respondWith(
    (own ? fetch(u.href, { cache: 'no-cache' }) : fetch(e.request)).then((r) => {
      if (r.ok) { const copy = r.clone(); caches.open(CACHE).then((c) => c.put(e.request, copy)); }
      return r;
    }).catch(() => caches.match(e.request, { ignoreSearch: own }))
  );
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
