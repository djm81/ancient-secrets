import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const worker = await readFile(new URL('../service-worker.js', import.meta.url), 'utf8');
const gamePage = await readFile(new URL('../maestros-secret.html', import.meta.url), 'utf8');
const lifecycle = await readFile(new URL('../js/pwa-lifecycle.js', import.meta.url), 'utf8');

test('OGS-001 and OGS-002: the service worker precaches the local shell and excludes unsafe traffic', () => {
  for (const asset of [
    './maestros-secret.html', './index.html', './js/game-core.js', './js/guidance-client.js',
    './js/browser-storage.js', './js/runtime-config.js', './assets/fonts/fonts.css',
    './assets/icons/app-192.png', './assets/icons/app-512.png'
  ]) assert.match(worker, new RegExp(asset.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));

  assert.match(worker, /request\.method\s*!==\s*['"]GET['"]/);
  assert.match(worker, /url\.origin\s*!==\s*self\.location\.origin/);
  assert.match(worker, /workers/);
  assert.match(worker, /caches\.match\(request\)/);
  assert.match(worker, /request\.mode\s*===\s*['"]navigate['"]/);
});

test('OGS-003 and PWA-002: the game registers a waiting worker and only exposes install UI when it is actionable', () => {
  assert.match(gamePage, /startOfflineAppLifecycle\(\)/);
  assert.match(lifecycle, /register\(['"]\.\/service-worker\.js['"]/);
  assert.match(lifecycle, /beforeinstallprompt/);
  assert.match(lifecycle, /SKIP_WAITING/);
  assert.match(gamePage, /id="installbtn"/);
  assert.match(gamePage, /id="updatebanner"/);
  assert.match(gamePage, /id="restartupdate"/);
});
