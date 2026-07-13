export const SAVE_KEY = 'maestros-secret:chronicle';
export const SAVE_VERSION = 1;

export const ROUTES = Object.freeze({
  fresco: { label: 'the faded fresco in the Scriptorium', short: 'the fresco' },
  duomo: { label: 'the star chart high in Il Duomo', short: 'the Duomo' },
  monk: { label: "Brother Matteo's sleeping manuscript", short: 'the monk' }
});

export const ACTIONS = Object.freeze({
  'take-mirror': 'Take the hand mirror from the workshop wall.',
  'read-note': 'Use the hand mirror on the backwards-written note.',
  'find-brass-key': 'Search the workshop paint pots for the brass key.',
  'take-bread': 'Visit the piazza and accept the baker’s loaf.',
  'recover-gear': 'Use the loaf where the Maestro’s note directs you in the piazza.',
  'repair-machine': 'Fit the bronze gear into the flying machine.',
  'open-chest': 'Take the brass key to the iron-bound chest in the Scriptorium.',
  'take-lens': 'Take the crystal lens from the opened chest.',
  'find-cipher': 'Use the crystal lens at the Maestro’s chosen clue location.',
  'open-strongbox': 'Set the strongbox dials to the Roman-numeral clue.',
  'open-trapdoor': 'Use the ornate key on the trapdoor beneath the moved rug.',
  complete: 'Descend to the Secret Study and meet the Maestro.'
});

const FLAG_DEFAULTS = Object.freeze({
  mirrorTaken: false, noteRead: false, keyTaken: false, breadTaken: false,
  gearTaken: false, gearInstalled: false, trapdoorShown: false,
  chestOpen: false, lensTaken: false, cipherSeen: false,
  boxOpen: false, ornateTaken: false, catClicks: 0, wellUsed: false,
  duomoSolved: false, galleryVisited: false, bellSteps: []
});
const SECRET_DEFAULTS = Object.freeze({ cat: false, pigeon: false, well: false, spiral: false, redbook: false });
const SCENES = new Set(['workshop', 'piazza', 'library', 'duomoentry', 'duomogallery', 'cellar']);
const ITEMS = new Set(['mirror', 'brasskey', 'bread', 'gear', 'lens', 'ornatekey']);
const TIERS = new Set(['nudge', 'hint', 'reveal']);

export function createInitialState() {
  return { scene: 'workshop', inv: [], selected: null, flags: structuredClone(FLAG_DEFAULTS), secrets: structuredClone(SECRET_DEFAULTS) };
}

export function randomInt(max, random = Math.random) {
  return Math.floor(random() * max);
}

export function shuffled(values, random = Math.random) {
  const copy = values.slice();
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const next = randomInt(index + 1, random);
    [copy[index], copy[next]] = [copy[next], copy[index]];
  }
  return copy;
}

export function createRun(random = Math.random) {
  const route = Object.keys(ROUTES)[randomInt(Object.keys(ROUTES).length, random)];
  return {
    route,
    gearRoute: randomInt(2, random) ? 'lion' : 'well',
    code: shuffled([1, 2, 3, 4, 5, 6, 7, 8, 9], random).slice(0, 4),
    bellPattern: shuffled([0, 1, 2, 3], random).slice(0, 3)
  };
}

export function isValidRun(run) {
  return Boolean(run) && Object.hasOwn(ROUTES, run.route) && ['lion', 'well'].includes(run.gearRoute)
    && Array.isArray(run.code) && run.code.length === 4 && run.code.every(number => Number.isInteger(number) && number >= 1 && number <= 9)
    && new Set(run.code).size === 4
    && Array.isArray(run.bellPattern) && run.bellPattern.length === 3 && run.bellPattern.every(number => Number.isInteger(number) && number >= 0 && number <= 3)
    && new Set(run.bellPattern).size === 3;
}

export function isValidState(state) {
  if (!state || !SCENES.has(state.scene) || !Array.isArray(state.inv) || !state.inv.every(item => ITEMS.has(item))) return false;
  if (new Set(state.inv).size !== state.inv.length) return false;
  if (state.selected !== null && (!ITEMS.has(state.selected) || !state.inv.includes(state.selected))) return false;
  if (!state.flags || !state.secrets || !Array.isArray(state.flags.bellSteps)) return false;
  const validFlags = Object.keys(FLAG_DEFAULTS).every(key => Object.hasOwn(state.flags, key))
    && Object.entries(FLAG_DEFAULTS).every(([key, value]) => {
      if (key === 'catClicks') return Number.isInteger(state.flags[key]) && state.flags[key] >= 0 && state.flags[key] <= 3;
      if (key === 'bellSteps') return state.flags[key].every(step => Number.isInteger(step) && step >= 0 && step <= 3);
      return typeof state.flags[key] === typeof value;
    });
  return validFlags && Object.keys(SECRET_DEFAULTS).every(key => typeof state.secrets[key] === 'boolean');
}

export function collectGearReward(state) {
  if (!isValidState(state) || !state.inv.includes('bread') || state.flags.gearTaken || state.inv.includes('gear')) {
    throw new Error('Cannot collect an invalid gear reward.');
  }
  const next = structuredClone(state);
  next.inv = next.inv.filter(item => item !== 'bread');
  next.selected = next.selected === 'bread' ? null : next.selected;
  next.inv.push('gear');
  next.flags.gearTaken = true;
  return next;
}

export function installGearAndRevealTrapdoor(state) {
  if (!isValidState(state) || !state.inv.includes('gear') || state.flags.gearInstalled) {
    throw new Error('Cannot install an invalid gear.');
  }
  const next = structuredClone(state);
  next.inv = next.inv.filter(item => item !== 'gear');
  next.selected = next.selected === 'gear' ? null : next.selected;
  next.flags.gearInstalled = true;
  next.flags.trapdoorShown = true;
  return next;
}

export function createSave(state, run) {
  if (!isValidState(state) || !isValidRun(run)) throw new Error('Cannot save an invalid chronicle.');
  return { version: SAVE_VERSION, savedAt: new Date().toISOString(), state: structuredClone(state), run: structuredClone(run) };
}

export function parseSave(raw) {
  try {
    const value = typeof raw === 'string' ? JSON.parse(raw) : raw;
    if (!value || value.version !== SAVE_VERSION || !isValidState(value.state) || !isValidRun(value.run)) return null;
    return { version: value.version, savedAt: value.savedAt, state: structuredClone(value.state), run: structuredClone(value.run) };
  } catch {
    return null;
  }
}

export function nextActionFor(state) {
  const flags = state?.flags || {};
  if (!flags.mirrorTaken) return 'take-mirror';
  if (!flags.noteRead) return 'read-note';
  if (!flags.keyTaken) return 'find-brass-key';
  if (!flags.breadTaken) return 'take-bread';
  if (!flags.gearTaken) return 'recover-gear';
  if (!flags.gearInstalled) return 'repair-machine';
  if (!flags.chestOpen) return 'open-chest';
  if (!flags.lensTaken) return 'take-lens';
  if (!flags.cipherSeen) return 'find-cipher';
  if (!flags.boxOpen) return 'open-strongbox';
  return flags.ornateTaken ? 'open-trapdoor' : 'open-strongbox';
}

export function getProgress(state) {
  const action = nextActionFor(state);
  const flags = state.flags;
  let chapter = 'I · The Workshop';
  if (flags.gearInstalled || flags.chestOpen) chapter = 'II · The Scriptorium';
  if (flags.cipherSeen || flags.boxOpen) chapter = 'III · The Secret Below';
  return { chapter, action, objective: ACTIONS[action], completed: Number(Boolean(flags.noteRead)) + Number(Boolean(flags.gearInstalled)) + Number(Boolean(flags.cipherSeen)), total: 3 };
}

export function summarizeForGuidance(state) {
  if (!isValidState(state)) throw new Error('Invalid guidance state.');
  return {
    scene: state.scene,
    inventory: state.inv.slice().sort(),
    milestones: Object.fromEntries(['mirrorTaken', 'noteRead', 'keyTaken', 'breadTaken', 'gearTaken', 'gearInstalled', 'chestOpen', 'lensTaken', 'cipherSeen', 'boxOpen', 'ornateTaken'].map(key => [key, Boolean(state.flags[key])])),
    nextActionId: nextActionFor(state)
  };
}

export function fallbackGuidance(state, tier) {
  const action = nextActionFor(state);
  const validTier = TIERS.has(tier) ? tier : 'nudge';
  const text = {
    nudge: 'Look for an object in the current trail that changes how you read, open, feed, or repair. The satchel is part of every solution.',
    hint: `Your next useful move concerns this: ${ACTIONS[action]}`,
    reveal: ACTIONS[action]
  }[validTier];
  return { tier: validTier, message: text, nextActionId: action };
}

export function validateGuidance(response, state, requestedTier) {
  if (!response || response.tier !== requestedTier || !TIERS.has(response.tier)) return null;
  if (response.nextActionId !== nextActionFor(state) || typeof response.message !== 'string') return null;
  const message = response.message.trim().replace(/\s+/g, ' ');
  if (!message || message.split(' ').length > 45) return null;
  return { tier: response.tier, message, nextActionId: response.nextActionId };
}
