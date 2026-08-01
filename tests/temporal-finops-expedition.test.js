import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, statSync } from 'node:fs';
import { readFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const file = name => readFile(new URL(name, root), 'utf8');

test('Babylon vertical slice is locally authored, has art within budget, and is reachable after the base ending', async () => {
  const html = await file('maestros-secret.html');
  const content = await file('js/era-content.js');
  const artManifest = await file('assets/eras/babylon/ART_MANIFEST.md');
  assert.match(html, /Enter the Codex Rationum/);
  assert.match(html, /class="end-actions"/);
  assert.match(html, /id="expedition"/);
  assert.match(html, /\.trial-feedback\{[^}]*color:#29190d/);
  assert.match(content, /Babylon, c\. 1750 BCE/);
  assert.match(artManifest, /open oil lamp/);
  for (const asset of ['assets/eras/babylon/temple-ledger.jpg', 'assets/eras/babylon/temple-scribe.jpg', 'assets/eras/babylon/grain-tablets.jpg']) {
    const path = new URL(asset, root);
    assert.equal(existsSync(path), true, `${asset} should be committed locally`);
    assert.ok(statSync(path).size <= 200 * 1024, `${asset} exceeds the 200 KiB per-image budget`);
  }
});
