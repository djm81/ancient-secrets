import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {
  DIALOGUE_VALUES,
  ENDINGS,
  INTERACTABLES,
  SAVE_VERSION,
  SCENE_GRAPH,
  chooseDialogue,
  createInitialState,
  createRun,
  createSave,
  eligibleEndings,
  getNavigation,
  parseSave,
  recordFieldNote,
  selectEnding
} from '../js/game-core.js';

const gamePage = await readFile(new URL('../maestros-secret.html', import.meta.url), 'utf8');

test('NA-001: the scene graph exposes only valid currently reachable navigation', () => {
  const state = createInitialState();
  assert.equal(getNavigation(state).right.target, 'piazza');
  state.scene = 'duomoentry';
  assert.equal(getNavigation(state).left.target, 'piazza');
  assert.equal(getNavigation(state).right, null);
  state.flags.duomoSolved = true;
  assert.equal(getNavigation(state).right.target, 'duomogallery');
  state.scene = 'duomogallery';
  assert.equal(getNavigation(state).left.target, 'duomoentry');
  assert.equal(getNavigation(state).right, null);
  for (const [scene, directions] of Object.entries(SCENE_GRAPH)) {
    for (const edge of Object.values(directions)) assert.ok(!edge || SCENE_GRAPH[edge.target], `${scene} references an unknown scene`);
  }
});

test('NA-002: every declared hotspot has one non-flavour purpose registry entry', () => {
  const hotspotIds = [...gamePage.matchAll(/data-hs="([^"]+)"/g)].map(([, id]) => id).sort();
  assert.deepEqual(Object.keys(INTERACTABLES).sort(), hotspotIds);
  for (const [id, interaction] of Object.entries(INTERACTABLES)) {
    assert.ok(['puzzle', 'clue', 'curiosity', 'transition', 'dialogue'].includes(interaction.category), `${id} has an invalid category`);
    assert.ok(interaction.purpose.length > 0, `${id} has no declared purpose`);
  }
});

test('NA-002: Field Notes persist one useful observation per eligible hotspot', () => {
  let state = createInitialState();
  for (const id of ['window', 'easel', 'candle', 'candelabra', 'duomoview']) state = recordFieldNote(state, id);
  assert.deepEqual(Object.values(state.notes), [true, true, true, true, true]);
  assert.throws(() => recordFieldNote(state, 'rug'));
});

test('ID-001: dialogue values are recorded once and earn matching endings', () => {
  let state = createInitialState();
  state = chooseDialogue(state, 'baker', DIALOGUE_VALUES.compassion);
  state = chooseDialogue(state, 'matteo', DIALOGUE_VALUES.insight);
  assert.deepEqual(eligibleEndings(state), [ENDINGS.keeper, ENDINGS.light]);
  assert.throws(() => chooseDialogue(state, 'baker', DIALOGUE_VALUES.ambition));
  state = selectEnding(state, ENDINGS.light);
  assert.equal(state.dialogue.ending, ENDINGS.light);
  assert.throws(() => selectEnding(state, ENDINGS.flight));
});

test('ID-002: valid version-1 chronicles migrate and malformed dialogue is rejected', () => {
  const v1State = createInitialState();
  delete v1State.dialogue;
  delete v1State.notes;
  const v1 = { version: 1, savedAt: '2026-07-14T09:00:00+02:00', state: v1State, run: createRun(() => 0.2) };
  const migrated = parseSave(v1);
  assert.equal(migrated.version, SAVE_VERSION);
  assert.equal(migrated.state.dialogue.ending, null);
  const corrupt = createSave(createInitialState(), createRun(() => 0.2));
  corrupt.state.dialogue.choices.baker = 'cheat';
  assert.equal(parseSave(corrupt), null);
  const unearnedEnding = createSave(createInitialState(), createRun(() => 0.2));
  unearnedEnding.state.dialogue.ending = ENDINGS.flight;
  assert.equal(parseSave(unearnedEnding), null);
});
