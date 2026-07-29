import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const manifestUrl = new URL('../manifest.webmanifest', import.meta.url);
const rootPageUrl = new URL('../index.html', import.meta.url);
const gamePageUrl = new URL('../maestros-secret.html', import.meta.url);

test('PWA-001: installable identity is project-path safe and launches directly into the game', async () => {
  const manifest = JSON.parse(await readFile(manifestUrl, 'utf8'));
  const [rootPage, gamePage] = await Promise.all([
    readFile(rootPageUrl, 'utf8'),
    readFile(gamePageUrl, 'utf8'),
  ]);

  assert.equal(manifest.id, './');
  assert.equal(manifest.start_url, './maestros-secret.html');
  assert.equal(manifest.scope, './');
  assert.equal(manifest.display, 'standalone');
  assert.ok(manifest.icons.some((icon) => icon.src === './assets/icons/app-192.png' && icon.sizes === '192x192'));
  assert.ok(manifest.icons.some((icon) => icon.src === './assets/icons/app-512.png' && icon.sizes === '512x512' && icon.purpose === 'any maskable'));

  for (const page of [rootPage, gamePage]) {
    assert.match(page, /<link rel="manifest" href="\.\/manifest\.webmanifest">/);
    assert.match(page, /<link rel="apple-touch-icon" href="\.\/assets\/icons\/app-192\.png">/);
    assert.match(page, /<meta name="theme-color" content="#[0-9A-Fa-f]{6}">/);
    assert.doesNotMatch(page, /https:\/\/fonts\.googleapis\.com/i);
  }
});
