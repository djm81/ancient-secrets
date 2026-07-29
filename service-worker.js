const CACHE_VERSION = 'maestros-secret-shell-v1';
const CORE_ASSETS = [
  './', './index.html', './maestros-secret.html', './manifest.webmanifest',
  './js/game-core.js', './js/guidance-client.js', './js/browser-storage.js', './js/runtime-config.js',
  './js/save-recovery.js', './js/era-packs.js', './js/pwa-lifecycle.js',
  './assets/fonts/fonts.css', './assets/fonts/cinzel-500.ttf', './assets/fonts/cinzel-600.ttf',
  './assets/fonts/cinzel-700.ttf', './assets/fonts/eb-garamond-400.ttf', './assets/fonts/eb-garamond-500.ttf',
  './assets/fonts/eb-garamond-italic-400.ttf', './assets/icons/app-192.png', './assets/icons/app-512.png',
  './assets/dialogue/baker-piazza.webp', './assets/dialogue/baker-piazza-compact.webp',
  './assets/dialogue/brother-matteo-scriptorium.webp', './assets/dialogue/brother-matteo-scriptorium-compact.webp',
  './assets/dialogue/maestro-secret-study.webp', './assets/dialogue/maestro-secret-study-compact.webp'
];

const cacheName = () => CACHE_VERSION;
const offlineGame = () => new URL('./maestros-secret.html', self.registration.scope).toString();
let restartClientId = null;

self.addEventListener('install', event => {
  event.waitUntil(caches.open(cacheName()).then(cache => cache.addAll(CORE_ASSETS)));
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    if (!restartClientId) return;
    const client = await self.clients.get(restartClientId);
    client?.postMessage({ type: 'UPDATE_READY' });
  })());
});

self.addEventListener('message', event => {
  if (event.data?.type !== 'SKIP_WAITING') return;
  restartClientId = event.source?.id ?? null;
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin || url.pathname.includes('/workers/') || /(?:model|ai)(?:[/-]|$)/i.test(url.pathname)) return;
  if (request.mode === 'navigate') {
    event.respondWith(caches.match(request).then(cached => cached || fetch(request)
      .then(response => response)
      .catch(() => caches.match(offlineGame()))));
    return;
  }
  event.respondWith(caches.match(request).then(cached => cached || fetch(request)));
});
