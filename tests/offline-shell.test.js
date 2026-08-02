import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const worker = await readFile(new URL('../service-worker.js', import.meta.url), 'utf8');
const gamePage = await readFile(new URL('../maestros-secret.html', import.meta.url), 'utf8');
const lifecycle = await readFile(new URL('../js/pwa-lifecycle.js', import.meta.url), 'utf8');
const eraContent = await readFile(new URL('../js/era-content.js', import.meta.url), 'utf8');
const gameCore = await readFile(new URL('../js/game-core.js', import.meta.url), 'utf8');
const expeditionCore = await readFile(new URL('../js/expedition-core.js', import.meta.url), 'utf8');

test('OGS-001 and OGS-002: the service worker precaches the local shell and excludes unsafe traffic', () => {
  for (const asset of [
    './maestros-secret.html', './index.html', './js/game-core.js?rev=v14', './js/expedition-core.js?rev=v14',
    './js/era-content.js?rev=v14', './js/guidance-client.js?rev=v14', './js/browser-storage.js?rev=v14',
    './js/runtime-config.js?rev=v14', './assets/fonts/fonts.css',
    './assets/icons/app-192.png', './assets/icons/app-512.png'
  ]) assert.match(worker, new RegExp(asset.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));

  assert.match(worker, /request\.method\s*!==\s*['"]GET['"]/);
  assert.match(worker, /url\.origin\s*!==\s*self\.location\.origin/);
  assert.match(worker, /workers/);
  assert.match(worker, /caches\.open\(cacheName\(\)\)/);
  assert.match(worker, /cache\.match\(request,\{ignoreSearch:true\}\)/);
  assert.match(worker, /event\.respondWith\(caches\.match\(request\)\.then/);
  assert.match(worker, /request\.mode\s*===\s*['"]navigate['"]/);
});

test('OGS-003 and PWA-002: the game registers a waiting worker and only exposes install UI when it is actionable', () => {
  assert.match(gamePage, /startOfflineAppLifecycle\(\)/);
  assert.match(lifecycle, /register\(['"]\.\/service-worker\.js\?rev=v15['"]/);
  assert.match(lifecycle, /beforeinstallprompt/);
  assert.match(lifecycle, /SKIP_WAITING/);
  assert.match(gamePage, /id="installbtn"/);
  assert.match(gamePage, /id="updatebanner"/);
  assert.match(gamePage, /id="restartupdate"/);
});

test('OGS-001 and OGS-003: a refreshed release uses matching revisioned local assets', () => {
  assert.match(gamePage, /\.\/js\/game-core\.js\?rev=v14/);
  assert.match(gamePage, /\.\/js\/era-content\.js\?rev=v14/);
  assert.match(lifecycle, /\.\/service-worker\.js\?rev=v15/);
  assert.match(gameCore, /\.\/expedition-core\.js\?rev=v14/);
  assert.match(expeditionCore, /\.\/era-content\.js\?rev=v14/);
  assert.match(eraContent, /grain-tablets\.jpg\?rev=v8/);
  assert.match(worker, /caches\.match\(request\)\.then/);
});

test('OGS-001: offline navigation fallback uses only the active release cache', async () => {
  const handlers = new Map();
  const matches = [];
  let responseWork;
  vm.runInNewContext(worker, {
    URL,
    caches: {
      open: async name => {
        assert.equal(name, 'maestros-secret-shell-v15');
        return { match: async (request, options) => {
          matches.push({ request: String(request), options });
          return request === 'https://example.test/ancient-secrets/maestros-secret.html'
            ? new Response('active shell')
            : undefined;
        } };
      },
      match: async () => { throw new Error('global cache lookup can select an older release'); }
    },
    fetch: async () => { throw new Error('offline'); },
    self: {
      registration: { scope: 'https://example.test/ancient-secrets/' },
      location: { origin: 'https://example.test' },
      addEventListener: (type, handler) => handlers.set(type, handler)
    }
  });

  handlers.get('fetch')({
    request: { method: 'GET', mode: 'navigate', url: 'https://example.test/ancient-secrets/maestros-secret.html?release=v15' },
    respondWith: work => { responseWork = work; }
  });
  const response = await responseWork;
  assert.equal(await response.text(), 'active shell');
  assert.equal(matches.length, 2);
  assert.equal(matches[0].options.ignoreSearch, true);
  assert.equal(matches[1].request, 'https://example.test/ancient-secrets/maestros-secret.html');
  assert.equal(matches[1].options, undefined);
});

test('OGS-003: accepting an update retains other clients’ caches and only notifies the requesting client', async () => {
  const handlers = new Map();
  const notifications = [];
  const cacheDeletes = [];
  let skips = 0;
  vm.runInNewContext(worker, {
    URL,
    caches: {
      open: async () => ({ addAll: async () => {} }),
      match: async () => null,
      keys: async () => ['maestros-secret-shell-v1', 'maestros-secret-shell-v2'],
      delete: async name => { cacheDeletes.push(name); }
    },
    fetch: async () => new Response(),
    self: {
      registration: { scope: 'https://example.test/ancient-secrets/' },
      location: { origin: 'https://example.test' },
      clients: {
        get: async id => ({ postMessage: message => notifications.push({ id, message }) })
      },
      skipWaiting: async () => { skips += 1; },
      addEventListener: (type, handler) => handlers.set(type, handler)
    }
  });

  let messageWork;
  handlers.get('message')({
    data: { type: 'SKIP_WAITING' },
    source: { id: 'restarting-chronicle' },
    waitUntil: work => { messageWork = work; }
  });
  await messageWork;

  let activationWork;
  handlers.get('activate')({ waitUntil: work => { activationWork = work; } });
  await activationWork;

  assert.equal(skips, 1);
  assert.deepEqual(cacheDeletes, []);
  assert.equal(notifications.length, 1);
  assert.equal(notifications[0].id, 'restarting-chronicle');
  assert.equal(notifications[0].message.type, 'UPDATE_READY');
});
