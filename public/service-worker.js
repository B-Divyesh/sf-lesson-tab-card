const CACHE = 'lesson-tab-card-v4';
const CORE = ['/favicon.svg', '/apple-touch-icon.png', '/assets/lesson-desk.webp'];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    const response = await fetch('/index.html', { cache: 'reload' });
    const html = await response.clone().text();
    await cache.put('/index.html', response.clone());
    await cache.put('/', response);
    const builtAssets = [...html.matchAll(/(?:src|href)="(\/assets\/[^"]+)"/g)].map((match) => match[1]);
    await Promise.all([...new Set([...CORE, ...builtAssets])].map(async (url) => {
      try {
        const asset = await fetch(url, { cache: 'reload' });
        if (asset.ok) await cache.put(url, asset);
      } catch { /* The shell still works if a nonessential asset is unavailable. */ }
    }));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names.filter((name) => name !== CACHE).map((name) => caches.delete(name)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).catch(async () => (await caches.match('/index.html')) || Response.error()));
    return;
  }
  event.respondWith((async () => {
    const cached = await caches.match(request) || await caches.match(url.pathname);
    if (cached) return cached;
    const response = await fetch(request);
    if (response.ok) (await caches.open(CACHE)).put(request, response.clone());
    return response;
  })());
});
