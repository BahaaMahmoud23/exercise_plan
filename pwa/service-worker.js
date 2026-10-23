/* Build-time placeholders are replaced by the Vite plugin. No user data is stored here. */
const CACHE = __SHELL_CACHE__;
const ASSETS = __SHELL_ASSETS__;
const PREFIX = 'bahaa-app-shell-';
self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    // Fail the installation atomically if the new shell cannot be fully downloaded.
    await cache.addAll(ASSETS.map(url => new Request(url, { cache: 'reload' })));
  })());
  // An update waits until every old client closes or the user explicitly accepts it.
});
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key.startsWith(PREFIX) && key !== CACHE).map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});
self.addEventListener('message', event => {
  if (event.data?.type === 'ACTIVATE_UPDATE') self.skipWaiting();
});
self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  // Never intercept video, range requests, external resources or writes.
  // Videos retain native HTTP streaming/range behavior and are not cached offline.
  if (request.method !== 'GET' || url.origin !== self.location.origin || url.pathname.startsWith('/videos/') || request.headers.has('range')) return;
  if (request.mode === 'navigate') {
    event.respondWith((async () => (await (await caches.open(CACHE)).match('/index.html')) ?? fetch(request))());
  } else if (ASSETS.includes(url.pathname)) {
    event.respondWith((async () => (await (await caches.open(CACHE)).match(url.pathname)) ?? fetch(request))());
  }
});
