import test from 'node:test';
import assert from 'node:assert/strict';
import { createInitialState } from '../js/game-core.js';
import { requestGuidance } from '../js/guidance-client.js';

test('BG-003 and BG-005: missing or rate-limited remote guidance uses authored fallback without mutation', async () => {
  const state = createInitialState();
  const before = JSON.stringify(state);
  const offline = await requestGuidance(state, 'nudge', '');
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => new Response('{}', { status: 429 });
  try {
    const limited = await requestGuidance(state, 'hint', 'https://guide.example/api/maestro-guide');
    assert.equal(offline.source, 'authored fallback');
    assert.equal(limited.source, 'authored fallback');
    assert.equal(JSON.stringify(state), before);
  } finally {
    globalThis.fetch = originalFetch;
  }
});
