import test from 'node:test';
import assert from 'node:assert/strict';
import { createInitialState, createRun, createSave } from '../js/game-core.js';
import { exportChronicle, importChronicle } from '../js/save-recovery.js';

const validSave = createSave(createInitialState(), createRun(() => 0));

test('OGS-004: a valid save exports and imports through the normal schema validator', () => {
  const downloaded = exportChronicle(validSave);
  assert.equal(downloaded.name, 'maestros-secret-chronicle.json');
  assert.deepEqual(importChronicle(downloaded.text), validSave);
});

test('OGS-004: malformed and future imports are rejected without yielding replacement state', () => {
  assert.equal(importChronicle('{not json}'), null);
  assert.equal(importChronicle(JSON.stringify({ ...validSave, version: 99 })), null);
});
