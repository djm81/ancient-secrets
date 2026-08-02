import test from 'node:test';
import assert from 'node:assert/strict';
import {
  BABYLON_ID,
  applyDebriefAnswers,
  advanceBabylonAudit,
  babylonFailureExplanation,
  beginBabylonAudit,
  beginEra,
  createInitialExpedition,
  createBabylonTrial,
  collectBabylonClue,
  deriveRank,
  evaluateBabylonPlan,
  orderBabylonDebriefOptions,
  recordBabylonOutcome,
  withdrawFromTrial
} from '../js/expedition-core.js';
import { BABYLON_CONTENT } from '../js/era-content.js';

test('Babylon is the available first-act vertical slice and begins reproducibly', () => {
  const initial = createInitialExpedition();
  assert.equal(initial.eras[BABYLON_ID].status, 'available');
  const begun = beginEra(initial, BABYLON_ID, 17);
  assert.equal(begun.eras[BABYLON_ID].status, 'in-progress');
  assert.equal(begun.eras[BABYLON_ID].attempt.seed, 17);
  assert.deepEqual(createBabylonTrial(17), createBabylonTrial(17));
});

test('Babylon ledger plans are deterministic, solvable, and distinguish failure categories', () => {
  for (let seed = 0; seed < 48; seed += 1) {
    const trial = createBabylonTrial(seed);
    const pass = evaluateBabylonPlan(trial, trial.solution);
    assert.equal(pass.status, 'passed');
    assert.equal(pass.failureCategory, null);
  }
  const trial = createBabylonTrial(4);
  assert.equal(evaluateBabylonPlan(trial, { ...trial.solution, delivery: 'missing' }).failureCategory, 'unbalanced-ledger');
  assert.equal(evaluateBabylonPlan(trial, { ...trial.solution, silverRate: 25 }).failureCategory, 'illegal-interest');
});

test('withdraw keeps clues, grants reduced credit, and a later pass never demotes mastery', () => {
  let initial = beginEra(createInitialExpedition(), BABYLON_ID, 9);
  for (const clue of ['deliveries', 'ledger', 'law']) initial = collectBabylonClue(initial, clue);
  const withdrawn = withdrawFromTrial(initial, BABYLON_ID, 'illegal-interest');
  assert.equal(withdrawn.eras[BABYLON_ID].status, 'withdrawn');
  assert.equal(withdrawn.eras[BABYLON_ID].clues.length, 3);
  assert.equal(withdrawn.eras[BABYLON_ID].bestCredit, 1);
  const debriefedWithdrawal = applyDebriefAnswers(withdrawn, BABYLON_ID, 'withdrawn', [false, false, false]);
  const retry = beginEra(debriefedWithdrawal, BABYLON_ID, 10);
  assert.deepEqual(retry.eras[BABYLON_ID].clues, ['deliveries', 'ledger', 'law']);
  assert.equal(retry.eras[BABYLON_ID].lastFailure, null);

  assert.throws(() => applyDebriefAnswers(withdrawn, BABYLON_ID, 'passed', [true, true, true]));
  let passingAttempt = beginEra(debriefedWithdrawal, BABYLON_ID, 11);
  passingAttempt = beginBabylonAudit(passingAttempt, BABYLON_ID);
  passingAttempt = advanceBabylonAudit(passingAttempt, BABYLON_ID, 'grain');
  passingAttempt = advanceBabylonAudit(passingAttempt, BABYLON_ID, 'rate');
  passingAttempt = advanceBabylonAudit(passingAttempt, BABYLON_ID, 'seal');
  passingAttempt = recordBabylonOutcome(passingAttempt, BABYLON_ID, evaluateBabylonPlan(createBabylonTrial(11), createBabylonTrial(11).solution));
  const passed = applyDebriefAnswers(passingAttempt, BABYLON_ID, 'passed', [true, true, true]);
  assert.equal(passed.eras[BABYLON_ID].status, 'complete');
  assert.equal(passed.inventions.includes('anemometer'), true);
  assert.equal(deriveRank(passed.mastery).key, 'garzone');
  const revisited = beginEra(passed, BABYLON_ID, 12);
  assert.equal(revisited.eras[BABYLON_ID].status, 'in-progress');
  assert.equal(revisited.eras[BABYLON_ID].attempt.seed, 12);
  assert.equal(revisited.eras[BABYLON_ID].bestCredit, passed.eras[BABYLON_ID].bestCredit);
  assert.deepEqual(revisited.mastery, passed.mastery);
  assert.throws(() => applyDebriefAnswers(passed, BABYLON_ID, 'withdrawn', [false, false, false]));
});

test('Babylon audit state only permits ordered transitions and a recorded outcome before debrief', () => {
  let expedition = beginEra(createInitialExpedition(), BABYLON_ID, 4);
  assert.throws(() => beginBabylonAudit(expedition, BABYLON_ID));
  for (const clue of ['deliveries', 'ledger', 'law']) expedition = collectBabylonClue(expedition, clue);
  assert.throws(() => applyDebriefAnswers(expedition, BABYLON_ID, 'passed', [true, true, true]));
  expedition = beginBabylonAudit(expedition, BABYLON_ID);
  assert.throws(() => advanceBabylonAudit(expedition, BABYLON_ID, 'rate'));
  expedition = advanceBabylonAudit(expedition, BABYLON_ID, 'grain');
  expedition = advanceBabylonAudit(expedition, BABYLON_ID, 'rate');
  expedition = advanceBabylonAudit(expedition, BABYLON_ID, 'seal');
  assert.throws(() => withdrawFromTrial(expedition, BABYLON_ID, 'forged-category'));
  expedition = recordBabylonOutcome(expedition, BABYLON_ID, evaluateBabylonPlan(createBabylonTrial(4), createBabylonTrial(4).solution));
  assert.equal(expedition.eras[BABYLON_ID].attempt.stage, 'evaluated');
  assert.equal(expedition.eras[BABYLON_ID].attempt.outcome, 'passed');
});

test('Babylon withdrawal explanations always use authored categories', () => {
  assert.equal(babylonFailureExplanation('unbalanced-ledger'), BABYLON_CONTENT.failure['unbalanced-ledger']);
  for (const inheritedKey of ['constructor', 'toString', '__proto__']) {
    assert.equal(babylonFailureExplanation(inheritedKey), BABYLON_CONTENT.failure['incomplete-plan']);
  }
});

test('Babylon debrief options are deterministic per attempt but do not keep the correct answer in one position', () => {
  const firstRun = BABYLON_CONTENT.debrief.map((question, index) => orderBabylonDebriefOptions(question, 0, index));
  const repeatedRun = BABYLON_CONTENT.debrief.map((question, index) => orderBabylonDebriefOptions(question, 0, index));
  assert.deepEqual(firstRun, repeatedRun);
  assert.deepEqual(firstRun.map(options => options.findIndex(option => option.correct)), [0, 2, 1]);
  assert.deepEqual(orderBabylonDebriefOptions(BABYLON_CONTENT.debrief[0], 1, 0).map(option => option.text), [
    BABYLON_CONTENT.debrief[0].options[1].text,
    BABYLON_CONTENT.debrief[0].options[2].text,
    BABYLON_CONTENT.debrief[0].options[0].text
  ]);
});
