import test from 'node:test';
import assert from 'node:assert/strict';
import { getSafeStorage } from '../js/browser-storage.js';

test('GC-002 and EQ-002: denied browser storage does not break game state or preferences', () => {
  const denied = {
    get localStorage() { throw new DOMException('Storage denied', 'SecurityError'); }
  };
  const storage = getSafeStorage(denied);
  assert.equal(storage.getItem('chronicle'), null);
  assert.equal(storage.setItem('chronicle', 'value'), false);
  assert.equal(storage.removeItem('chronicle'), false);
});
