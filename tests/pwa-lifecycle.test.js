import test from 'node:test';
import assert from 'node:assert/strict';
import { installGuidance } from '../js/pwa-lifecycle.js';

test('PWA-002: desktop-class iPadOS receives Add to Home Screen guidance', () => {
  assert.equal(
    installGuidance('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15) Version/18.0 Safari/605.1.15', 'MacIntel', 5),
    'To install on iPhone or iPad, use Share, then Add to Home Screen.'
  );
});
