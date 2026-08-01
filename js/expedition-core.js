import { BABYLON_CONTENT, BABYLON_ID, FINOPS_DOMAINS } from './era-content.js?rev=v14';

export { BABYLON_ID, FINOPS_DOMAINS };

const ERA_IDS = Object.freeze([BABYLON_ID]);
const DOMAIN_KEYS = Object.freeze(Object.keys(FINOPS_DOMAINS));
const rankFor = Object.freeze([
  Object.freeze({ key: 'maestro', label: 'Maestro dei Conti', stage: 'Run', minimum: 18 }),
  Object.freeze({ key: 'discepolo', label: 'Discepolo', stage: 'Walk', minimum: 8 }),
  Object.freeze({ key: 'garzone', label: 'Garzone', stage: 'Crawl', minimum: 0 })
]);

const freshEra = status => ({ status, clues: [], attempt: null, bestCredit: 0, lastFailure: null });
const freshMastery = () => Object.fromEntries(DOMAIN_KEYS.map(key => [key, 0]));

export function createInitialExpedition() {
  return {
    eras: { [BABYLON_ID]: freshEra('available') },
    mastery: freshMastery(),
    inventions: [],
    codexComplete: false
  };
}

export function isValidExpedition(expedition) {
  if (!expedition || !expedition.eras || !expedition.mastery || !Array.isArray(expedition.inventions) || typeof expedition.codexComplete !== 'boolean') return false;
  if (!DOMAIN_KEYS.every(key => Number.isInteger(expedition.mastery[key]) && expedition.mastery[key] >= 0)) return false;
  return ERA_IDS.every(id => {
    const era = expedition.eras[id];
    return era && ['available', 'in-progress', 'withdrawn', 'complete'].includes(era.status)
      && Array.isArray(era.clues) && era.clues.every(clue => BABYLON_CONTENT.clues.some(item => item.id === clue))
      && (era.attempt === null || (Number.isInteger(era.attempt.seed) && era.attempt.seed >= 0))
      && Number.isInteger(era.bestCredit) && era.bestCredit >= 0 && era.bestCredit <= 4
      && (era.lastFailure === null || typeof era.lastFailure === 'string');
  });
}

export function createBabylonTrial(seed = 0) {
  const normalized = Math.abs(Math.trunc(seed)) % 48;
  const values = [40, 30, 20];
  const rotated = values.map((_, index) => values[(index + normalized) % values.length]);
  const total = rotated.reduce((sum, value) => sum + value, 0);
  return Object.freeze({
    seed: normalized,
    deliveries: rotated,
    total,
    offeredTotals: Object.freeze([total, total - 10, total + 10]),
    solution: Object.freeze({ delivery: String(total), silverRate: 20 })
  });
}

export function evaluateBabylonPlan(trial, plan = {}) {
  if (!trial || !trial.solution) throw new Error('A Babylon trial is required.');
  if (String(plan.delivery) !== trial.solution.delivery) return { status: 'withdrawn', failureCategory: 'unbalanced-ledger', masteryDelta: 0 };
  if (Number(plan.silverRate) !== trial.solution.silverRate) return { status: 'withdrawn', failureCategory: 'illegal-interest', masteryDelta: 0 };
  return { status: 'passed', failureCategory: null, masteryDelta: 1 };
}

export function orderBabylonDebriefOptions(question, seed = 0, questionIndex = 0) {
  if (!question || !Array.isArray(question.options) || question.options.length < 2) throw new Error('A Babylon debrief question is required.');
  const offset = (Math.abs(Math.trunc(seed)) + Math.abs(Math.trunc(questionIndex))) % question.options.length;
  return Object.freeze(question.options.map((_, index) => question.options[(index + offset) % question.options.length]));
}

export function beginEra(expedition, eraId, seed = 0) {
  if (!isValidExpedition(expedition) || eraId !== BABYLON_ID) throw new Error('That era cannot begin.');
  const next = structuredClone(expedition);
  next.eras[eraId] = { ...next.eras[eraId], status: 'in-progress', clues: [], attempt: { seed: Math.abs(Math.trunc(seed)) % 48 }, lastFailure: null };
  return next;
}

export function collectBabylonClue(expedition, clueId) {
  if (!isValidExpedition(expedition) || expedition.eras[BABYLON_ID].status !== 'in-progress' || !BABYLON_CONTENT.clues.some(clue => clue.id === clueId)) throw new Error('That clue cannot be collected.');
  const next = structuredClone(expedition);
  if (!next.eras[BABYLON_ID].clues.includes(clueId)) next.eras[BABYLON_ID].clues.push(clueId);
  return next;
}

function creditFor(outcome, correctAnswers) {
  const answers = Array.isArray(correctAnswers) ? correctAnswers.filter(Boolean).length : 0;
  return Math.min(4, (outcome === 'passed' ? 1 : 0) + answers);
}

function masteryForCredit(credit) {
  return { understand: credit, practice: credit >= 2 ? 1 : 0, value: 0, optimize: 0 };
}

export function applyDebriefAnswers(expedition, eraId, outcome, answers) {
  if (!isValidExpedition(expedition) || eraId !== BABYLON_ID || !['passed', 'withdrawn'].includes(outcome)) throw new Error('Invalid debrief outcome.');
  const next = structuredClone(expedition);
  const era = next.eras[eraId];
  const credit = Math.max(era.bestCredit, creditFor(outcome, answers));
  if (credit === era.bestCredit && era.status === 'complete') return next;
  const oldContribution = masteryForCredit(era.bestCredit);
  const newContribution = masteryForCredit(credit);
  DOMAIN_KEYS.forEach(key => { next.mastery[key] = Math.max(0, next.mastery[key] - oldContribution[key] + newContribution[key]); });
  next.eras[eraId] = { ...era, status: outcome === 'passed' ? 'complete' : 'withdrawn', bestCredit: credit, attempt: null };
  if (outcome === 'passed' && !next.inventions.includes(BABYLON_CONTENT.invention)) next.inventions.push(BABYLON_CONTENT.invention);
  return next;
}

export function withdrawFromTrial(expedition, eraId, failureCategory = 'incomplete-plan') {
  if (!isValidExpedition(expedition) || eraId !== BABYLON_ID) throw new Error('That trial cannot be withdrawn.');
  const next = structuredClone(expedition);
  const era = next.eras[eraId];
  next.eras[eraId] = { ...era, status: 'withdrawn', attempt: null, lastFailure: failureCategory, bestCredit: Math.max(1, era.bestCredit) };
  const oldContribution = masteryForCredit(era.bestCredit);
  const newContribution = masteryForCredit(next.eras[eraId].bestCredit);
  DOMAIN_KEYS.forEach(key => { next.mastery[key] = Math.max(0, next.mastery[key] - oldContribution[key] + newContribution[key]); });
  return next;
}

export function deriveRank(mastery) {
  const total = DOMAIN_KEYS.reduce((sum, key) => sum + (Number.isInteger(mastery?.[key]) ? mastery[key] : 0), 0);
  return rankFor.find(rank => total >= rank.minimum);
}

export function babylonFailureExplanation(category) {
  return BABYLON_CONTENT.failure[category] || BABYLON_CONTENT.failure['incomplete-plan'];
}
