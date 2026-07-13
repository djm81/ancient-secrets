import test from 'node:test';
import assert from 'node:assert/strict';
import { ACTIONS, collectGearReward, createInitialState, createRun, createSave, fallbackGuidance, getProgress, installGearAndRevealTrapdoor, isValidRun, isValidState, parseSave, summarizeForGuidance, validateGuidance } from '../js/game-core.js';

test('every deterministic run is structurally valid', () => {
  for (const random of [() => 0, () => 0.5, () => 0.999]) assert.equal(isValidRun(createRun(random)), true);
});

test('a chronicle round-trips and rejects corrupt saves', () => {
  const state = createInitialState();
  const save = createSave(state, createRun(() => 0.25));
  assert.deepEqual(parseSave(JSON.stringify(save)).state, state);
  assert.equal(parseSave('{not json'), null);
  assert.equal(parseSave(JSON.stringify({ ...save, version: 99 })), null);
});

test('the next action and objective advance without soft-locking', () => {
  const state = createInitialState();
  assert.equal(getProgress(state).action, 'take-mirror');
  Object.assign(state.flags, { mirrorTaken: true, noteRead: true, keyTaken: true, breadTaken: true, gearTaken: true, gearInstalled: true, chestOpen: true, lensTaken: true, cipherSeen: true, boxOpen: true, ornateTaken: true });
  assert.equal(getProgress(state).action, 'open-trapdoor');
  assert.equal(getProgress(state).objective, ACTIONS['open-trapdoor']);
});

test('guidance only accepts the current, tier-matched action and short messages', () => {
  const state = createInitialState();
  const guidance = fallbackGuidance(state, 'hint');
  assert.deepEqual(validateGuidance(guidance, state, 'hint'), guidance);
  assert.equal(validateGuidance({ ...guidance, nextActionId: 'open-trapdoor' }, state, 'hint'), null);
  assert.equal(validateGuidance({ ...guidance, tier: 'reveal' }, state, 'hint'), null);
  assert.equal(summarizeForGuidance(state).nextActionId, 'take-mirror');
});

test('GC-002: invalid state cannot be serialized into a resume save', () => {
  const state = createInitialState();
  state.inv = ['mirror', 'mirror'];
  assert.equal(isValidState(state), false);
  assert.throws(() => createSave(state, createRun(() => 0.25)));
});

test('GC-001: critical gear rewards are saved as complete, resumable state', () => {
  const state = createInitialState();
  state.inv = ['bread'];
  state.flags.breadTaken = true;
  const withGear = collectGearReward(state);
  assert.deepEqual(withGear.inv, ['gear']);
  assert.equal(withGear.flags.gearTaken, true);

  const repaired = installGearAndRevealTrapdoor(withGear);
  assert.equal(repaired.flags.gearInstalled, true);
  assert.equal(repaired.flags.trapdoorShown, true);
  assert.equal(repaired.inv.includes('gear'), false);
});
