import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateEraPackDownload, initialEraPackState, transitionEraPackState } from '../js/era-packs.js';

const pack = { id: 'future-florence', title: 'Future Florence', bytes: 120 };

test('OGS-005: an era pack needs consent, a storage estimate, and a safe failure state', () => {
  assert.equal(evaluateEraPackDownload(pack, { quota: 1_000, usage: 100 }, false).status, 'needs-consent');
  assert.equal(evaluateEraPackDownload(pack, { quota: 200, usage: 100 }, true).status, 'insufficient-storage');
  assert.equal(evaluateEraPackDownload(pack, { quota: 1_000, usage: 100 }, true).status, 'ready');
  assert.deepEqual(transitionEraPackState(initialEraPackState(pack), 'failed'), { ...initialEraPackState(pack), status: 'failed' });
});
