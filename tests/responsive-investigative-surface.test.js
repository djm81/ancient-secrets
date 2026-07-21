import test from 'node:test';
import assert from 'node:assert/strict';
import { createInitialState, deriveContextualActions, INTERACTABLES } from '../js/game-core.js';

test('RI-001: contextual actions cap relevant actions while retaining every scene action', () => {
  const state = createInitialState();
  const casebook = deriveContextualActions(state, 'workshop');

  assert.ok(casebook.contextualActionIds.length <= 3);
  assert.deepEqual(casebook.contextualActionIds, ['mirror', 'note', 'pots']);
  assert.ok(casebook.allActionIds.length > casebook.contextualActionIds.length);
  assert.deepEqual(casebook.allActionIds, ['window', 'machine', 'easel', 'pots', 'mirror', 'note', 'candle', 'strongbox', 'rug', 'trapdoor', 'cat']);

  assert.deepEqual(deriveContextualActions(state, 'piazza').contextualActionIds, ['bread', 'lion', 'well']);
  assert.ok(deriveContextualActions(state, 'piazza').allActionIds.includes('libdoor'));
});

test('RI-001: Casebook action identifiers have parity with registered interactions', () => {
  const state = createInitialState();
  for (const scene of ['workshop', 'piazza', 'library', 'duomoentry', 'duomogallery', 'cellar']) {
    const casebook = deriveContextualActions(state, scene);
    for (const id of [...casebook.contextualActionIds, ...casebook.allActionIds]) {
      assert.ok(INTERACTABLES[id], `${scene} exposes ${id} without an interaction registry entry`);
    }
  }
});
