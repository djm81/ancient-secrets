export const SAVE_KEY = 'maestros-secret:chronicle';
export const SAVE_VERSION = 2;

export const DIALOGUE_VALUES = Object.freeze({ insight: 'insight', compassion: 'compassion', ambition: 'ambition' });
export const ENDINGS = Object.freeze({ keeper: 'keeper', light: 'light', flight: 'flight' });
export const FIELD_NOTE_IDS = Object.freeze(['window', 'easel', 'candle', 'candelabra', 'duomoview']);

export const SCENE_GRAPH = Object.freeze({
  workshop: Object.freeze({ right: Object.freeze({ target: 'piazza' }) }),
  piazza: Object.freeze({ left: Object.freeze({ target: 'workshop' }), right: Object.freeze({ target: 'library' }) }),
  library: Object.freeze({ left: Object.freeze({ target: 'piazza' }) }),
  duomoentry: Object.freeze({ left: Object.freeze({ target: 'piazza' }), right: Object.freeze({ target: 'duomogallery', requires: 'duomoSolved' }) }),
  duomogallery: Object.freeze({ left: Object.freeze({ target: 'duomoentry' }) }),
  cellar: Object.freeze({})
});

const interaction = (category, purpose) => Object.freeze({ category, purpose });
export const INTERACTABLES = Object.freeze({
  window: interaction('clue', 'Adds the Florence bearings Field Note.'),
  machine: interaction('puzzle', 'Accepts the bronze gear and reveals the trapdoor.'),
  easel: interaction('clue', 'Adds the reflected-writing Field Note.'),
  pots: interaction('puzzle', 'Provides the brass key.'),
  mirror: interaction('puzzle', 'Provides the tool needed to read the note.'),
  note: interaction('clue', 'Explains the current randomized gear route.'),
  candle: interaction('clue', 'Adds the night-work Field Note.'),
  strongbox: interaction('puzzle', 'Accepts the discovered Roman-numeral code.'),
  rug: interaction('clue', 'Identifies the hidden trapdoor location.'),
  trapdoor: interaction('puzzle', 'Uses the ornate key to reach the Secret Study.'),
  cat: interaction('curiosity', 'Awards the Golden Whisker curiosity.'),
  duomo: interaction('transition', 'Enters the Duomo Vestibule.'),
  libdoor: interaction('transition', 'Enters the Old Scriptorium.'),
  lion: interaction('puzzle', 'Can yield the bronze gear on the lion route.'),
  pigeon: interaction('curiosity', 'Awards the Quill of Wings curiosity.'),
  bread: interaction('dialogue', 'Starts the baker dialogue and awards bread.'),
  well: interaction('puzzle', 'Can yield the bronze gear on the well route.'),
  spiral: interaction('curiosity', 'Awards the Spiral of Proportion curiosity.'),
  fresco: interaction('puzzle', 'Can reveal the randomized Roman clue.'),
  redbook: interaction('curiosity', 'Awards the Crimson Bookmark curiosity.'),
  monk: interaction('dialogue', 'Starts Brother Matteo dialogue and can reveal the monk clue.'),
  chest: interaction('puzzle', 'Uses the brass key and yields the crystal lens.'),
  candelabra: interaction('clue', 'Adds the scriptorium light Field Note.'),
  mosaic: interaction('clue', 'States the current bell order.'),
  bell0: interaction('puzzle', 'Enters the first bell in the Duomo lock.'),
  bell1: interaction('puzzle', 'Enters the second bell in the Duomo lock.'),
  bell2: interaction('puzzle', 'Enters the third bell in the Duomo lock.'),
  bell3: interaction('puzzle', 'Enters the fourth bell in the Duomo lock.'),
  duomogate: interaction('transition', 'Enters the Whispering Gallery after the bell lock.'),
  duomoexit: interaction('transition', 'Returns to the Piazza.'),
  starchart: interaction('puzzle', 'Can reveal the randomized Roman clue.'),
  duomoview: interaction('clue', 'Adds the Florence Below Field Note.'),
  gallerydoor: interaction('transition', 'Returns to the Duomo Vestibule.')
});

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
const SCENES = new Set(Object.keys(SCENE_GRAPH));
const ITEMS = new Set(['mirror', 'brasskey', 'bread', 'gear', 'lens', 'ornatekey']);
const TIERS = new Set(['nudge', 'hint', 'reveal']);
const VALUES = new Set(Object.values(DIALOGUE_VALUES));
const ENDING_VALUES = Object.freeze({ [ENDINGS.keeper]: DIALOGUE_VALUES.insight, [ENDINGS.light]: DIALOGUE_VALUES.compassion, [ENDINGS.flight]: DIALOGUE_VALUES.ambition });
const ENCOUNTERS = new Set(['matteo', 'baker']);

function initialDialogue() {
  return { choices: { matteo: null, baker: null }, ending: null };
}

function initialNotes() {
  return Object.fromEntries(FIELD_NOTE_IDS.map(id => [id, false]));
}

export function createInitialState() {
  return { scene: 'workshop', inv: [], selected: null, flags: structuredClone(FLAG_DEFAULTS), secrets: structuredClone(SECRET_DEFAULTS), dialogue: initialDialogue(), notes: initialNotes() };
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
  const validDialogue = state.dialogue && state.dialogue.choices
    && Object.keys(state.dialogue.choices).length === ENCOUNTERS.size
    && [...ENCOUNTERS].every(key => state.dialogue.choices[key] === null || VALUES.has(state.dialogue.choices[key]))
    && (state.dialogue.ending === null || (Object.hasOwn(ENDING_VALUES, state.dialogue.ending)
      && Object.values(state.dialogue.choices).includes(ENDING_VALUES[state.dialogue.ending])));
  const validNotes = state.notes && Object.keys(state.notes).length === FIELD_NOTE_IDS.length
    && FIELD_NOTE_IDS.every(key => typeof state.notes[key] === 'boolean');
  return validFlags && validDialogue && validNotes && Object.keys(SECRET_DEFAULTS).every(key => typeof state.secrets[key] === 'boolean');
}

export function getNavigation(state) {
  const directions = SCENE_GRAPH[state?.scene] || {};
  return Object.fromEntries(['left', 'right'].map(direction => {
    const edge = directions[direction];
    const available = edge && SCENE_GRAPH[edge.target] && (!edge.requires || state?.flags?.[edge.requires]);
    return [direction, available ? edge : null];
  }));
}

export function recordFieldNote(state, id) {
  if (!isValidState(state) || !FIELD_NOTE_IDS.includes(id)) throw new Error('Cannot record an invalid Field Note.');
  const next = structuredClone(state);
  next.notes[id] = true;
  return next;
}

export function chooseDialogue(state, encounter, value) {
  if (!isValidState(state) || !ENCOUNTERS.has(encounter) || !VALUES.has(value) || state.dialogue.choices[encounter] !== null || state.dialogue.ending !== null) {
    throw new Error('Cannot record an invalid dialogue choice.');
  }
  const next = structuredClone(state);
  next.dialogue.choices[encounter] = value;
  return next;
}

export function eligibleEndings(state) {
  if (!isValidState(state)) throw new Error('Cannot derive endings from invalid state.');
  const earned = new Set(Object.values(state.dialogue.choices).filter(Boolean));
  const endings = Object.values(ENDINGS).filter(ending => earned.has(ENDING_VALUES[ending]));
  return endings.length ? endings : [ENDINGS.keeper];
}

export function selectEnding(state, ending) {
  if (!isValidState(state) || state.dialogue.ending !== null || !eligibleEndings(state).includes(ending)) throw new Error('Cannot select an unavailable ending.');
  const next = structuredClone(state);
  next.dialogue.ending = ending;
  return next;
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
    let value = typeof raw === 'string' ? JSON.parse(raw) : raw;
    if (value?.version === 1) {
      value = { ...value, version: SAVE_VERSION, state: { ...value.state, dialogue: initialDialogue(), notes: initialNotes() } };
    }
    if (!value || value.version !== SAVE_VERSION || !isValidState(value.state) || !isValidRun(value.run)) return null;
    return { version: SAVE_VERSION, savedAt: value.savedAt, state: structuredClone(value.state), run: structuredClone(value.run) };
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
