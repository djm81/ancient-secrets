import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const saveKey = 'maestros-secret:chronicle';
const run = { route: 'fresco', gearRoute: 'well', code: [1, 2, 3, 4], bellPattern: [0, 1, 2] };
const baseFlags = { mirrorTaken: false, noteRead: false, keyTaken: false, breadTaken: false, gearTaken: false, gearInstalled: false, trapdoorShown: false, chestOpen: false, lensTaken: false, cipherSeen: false, boxOpen: false, ornateTaken: false, catClicks: 0, wellUsed: false, duomoSolved: false, galleryVisited: false, bellSteps: [] };
const secrets = { cat: false, pigeon: false, well: false, spiral: false, redbook: false };

async function setChronicle(page, state, version = 1, chronicleRun = run) {
  await page.goto('/maestros-secret.html');
  await page.evaluate(({ key, value }) => localStorage.setItem(key, JSON.stringify(value)), { key: saveKey, value: { version, savedAt: '2026-07-13T23:18:02+0200', state, run: chronicleRun } });
  await page.reload();
}

async function continueChronicle(page) {
  await page.getByRole('button', { name: 'Continue Chronicle' }).click();
}

async function showCasebook(page) {
  const toggle = page.locator('#casebookbtn');
  if (await toggle.getAttribute('aria-expanded') !== 'true') await toggle.click();
  await expect(page.locator('#portrait-actions')).toBeVisible();
}

test('GC-001: refresh during a machine repair preserves the playable trapdoor state', async ({ page }) => {
  await setChronicle(page, { scene: 'workshop', inv: ['gear'], selected: 'gear', flags: { ...baseFlags, mirrorTaken: true, noteRead: true, keyTaken: true, breadTaken: true, gearTaken: true }, secrets });
  await continueChronicle(page);
  await page.locator('[data-hs="machine"]').focus();
  await page.keyboard.press('Enter');
  await page.reload();
  await page.getByRole('button', { name: 'Continue Chronicle' }).click();
  await expect(page.locator('#trapdoor')).not.toHaveClass(/hidden/);
});

test('GC-001: refresh during a bread-for-gear reward keeps the gear', async ({ page }) => {
  await setChronicle(page, { scene: 'piazza', inv: ['bread'], selected: 'bread', flags: { ...baseFlags, mirrorTaken: true, noteRead: true, breadTaken: true }, secrets });
  await continueChronicle(page);
  await page.locator('[data-hs="well"]').focus();
  await page.keyboard.press('Enter');
  await page.reload();
  await page.getByRole('button', { name: 'Continue Chronicle' }).click();
  await expect(page.getByRole('button', { name: 'Select Bronze Gear' })).toBeVisible();
});

test('GC-001: gear-to-trapdoor flow survives selection, travel, and refresh for every authored reward route', async ({ page }) => {
  for (const [gearRoute, rewardTarget] of [
    ['well', '[data-hs="well"]'],
    ['lion', '[data-hs="lion"]']
  ]) {
    await setChronicle(page, {
      scene: 'piazza',
      inv: ['bread'],
      selected: 'bread',
      flags: { ...baseFlags, mirrorTaken: true, noteRead: true, breadTaken: true },
      secrets
    }, 1, { ...run, gearRoute });
    await continueChronicle(page);
    await page.locator(rewardTarget).click();

    const gear = page.getByRole('button', { name: 'Select Bronze Gear' });
    await expect(gear).toBeVisible();
    await gear.click();
    await expect(gear).toHaveAttribute('aria-pressed', 'true');
    await page.locator('#nav-left').click();
    await expect(page.locator('#sc-workshop')).toHaveClass(/active/);
    await page.locator('[data-hs="machine"]').focus();
    await page.keyboard.press('Enter');
    await page.reload();
    await continueChronicle(page);
    await expect(page.locator('#trapdoor')).not.toHaveClass(/hidden/);
  }
});

test('EQ-001: keyboard-only opening sequence reads the note', async ({ page }) => {
  await page.goto('/maestros-secret.html');
  await page.getByRole('button', { name: 'Begin the Adventure' }).focus();
  await page.keyboard.press('Enter');
  await page.getByRole('button', { name: 'Begin Exploring' }).focus();
  await page.keyboard.press('Enter');
  await page.locator('[data-hs="mirror"]').focus();
  await page.keyboard.press('Enter');
  await page.getByRole('button', { name: 'Select Hand Mirror' }).focus();
  await page.keyboard.press('Enter');
  await page.locator('[data-hs="note"]').focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('dialog', { name: 'A Curious Note' })).toBeVisible();
  await page.getByRole('button', { name: 'Close' }).focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#noteview')).not.toHaveClass(/open/);
});

test('EQ-002: contrast persists and reduced motion removes essential animation', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/maestros-secret.html');
  await page.getByRole('button', { name: 'Begin the Adventure' }).click();
  await page.getByRole('button', { name: 'Begin Exploring' }).click();
  await page.getByRole('button', { name: 'CONTRAST' }).click();
  await page.reload();
  await expect(page.locator('body')).toHaveClass(/high-contrast/);
  await expect(page.locator('#titlescreen .vitr')).toHaveCSS('animation-name', 'none');
});

test('NA-001 and NA-002: Field Notes and every reachable Duomo arrow remain useful', async ({ page }) => {
  await page.goto('/maestros-secret.html');
  await page.getByRole('button', { name: 'Begin the Adventure' }).click();
  await page.getByRole('button', { name: 'Begin Exploring' }).click();
  await page.locator('[data-hs="window"]').click();
  await page.getByRole('button', { name: 'NOTES' }).click();
  await expect(page.getByRole('heading', { name: 'Florentine Bearings' })).toBeVisible();
  await expect(page.getByText(/dome is the surest landmark/i)).toBeVisible();
  await page.getByRole('button', { name: 'Close' }).click();

  const v2State = {
    scene: 'duomoentry', inv: [], selected: null,
    flags: { ...baseFlags, duomoSolved: true }, secrets,
    dialogue: { choices: { matteo: null, baker: null }, ending: null },
    notes: { window: false, easel: false, candle: false, candelabra: false, duomoview: false }
  };
  await setChronicle(page, v2State, 2);
  await continueChronicle(page);
  await expect(page.getByRole('button', { name: /Go left to Piazza della Signoria/ })).toBeVisible();
  await expect(page.getByRole('button', { name: /Go right to Il Duomo — Whispering Gallery/ })).toBeVisible();
  await page.getByRole('button', { name: /Go right to Il Duomo — Whispering Gallery/ }).click();
  await expect(page.locator('#sc-duomogallery')).toHaveClass(/active/);
  await page.getByRole('button', { name: /Go left to Il Duomo — Vestibule/ }).click();
  await expect(page.locator('#sc-duomoentry')).toHaveClass(/active/);
});

test('ID-001: the baker dialogue awards bread and the finale saves an earned resolution', async ({ page }) => {
  await page.goto('/maestros-secret.html');
  await page.getByRole('button', { name: 'Begin the Adventure' }).click();
  await page.getByRole('button', { name: 'Begin Exploring' }).click();
  await page.getByRole('button', { name: /Go right to Piazza della Signoria/ }).click();
  await page.locator('[data-hs="bread"]').click();
  await expect(page.getByRole('dialog', { name: 'The Baker’s Gift' })).toBeVisible();
  await page.getByRole('button', { name: 'Offer care' }).click();
  await expect(page.getByRole('button', { name: 'Select Fresh Bread' })).toBeVisible();

  const finalState = {
    scene: 'workshop', inv: ['ornatekey'], selected: 'ornatekey',
    flags: { ...baseFlags, mirrorTaken: true, noteRead: true, keyTaken: true, breadTaken: true, gearTaken: true, gearInstalled: true, trapdoorShown: true, chestOpen: true, lensTaken: true, cipherSeen: true, boxOpen: true, ornateTaken: true },
    secrets,
    dialogue: { choices: { matteo: null, baker: 'compassion' }, ending: null },
    notes: { window: false, easel: false, candle: false, candelabra: false, duomoview: false }
  };
  await setChronicle(page, finalState, 2);
  await continueChronicle(page);
  await page.locator('[data-hs="trapdoor"]').click();
  await expect(page.getByRole('dialog', { name: 'Leonardo’s Lesson' })).toBeVisible({ timeout: 5_000 });
  await expect(page.getByRole('button', { name: 'Put the designs to Florence’s service' })).toBeEnabled();
  await page.getByRole('button', { name: 'Put the designs to Florence’s service' }).click();
  await expect(page.getByRole('dialog', { name: 'Florence’s Light' })).toBeVisible();
});

test('ID-002: a migrated bread reward still permits the baker dialogue without duplicate bread', async ({ page }) => {
  const migratedBreadState = {
    scene: 'piazza', inv: [], selected: null,
    flags: { ...baseFlags, mirrorTaken: true, noteRead: true, breadTaken: true }, secrets
  };
  await setChronicle(page, migratedBreadState);
  await continueChronicle(page);
  await page.locator('[data-hs="bread"]').click();
  await expect(page.getByRole('dialog', { name: 'The Baker’s Gift' })).toBeVisible();
  await page.getByRole('button', { name: 'Offer care' }).click();
  await expect(page.getByRole('button', { name: 'Select Fresh Bread' })).toHaveCount(0);
  await expect.poll(() => page.evaluate(key => JSON.parse(localStorage.getItem(key)).state.dialogue.choices.baker, saveKey)).toBe('compassion');
});

test('ID-001: Leonardo’s terminal dialogue requires a finale choice', async ({ page }) => {
  const finalState = {
    scene: 'workshop', inv: ['ornatekey'], selected: 'ornatekey',
    flags: { ...baseFlags, mirrorTaken: true, noteRead: true, keyTaken: true, breadTaken: true, gearTaken: true, gearInstalled: true, trapdoorShown: true, chestOpen: true, lensTaken: true, cipherSeen: true, boxOpen: true, ornateTaken: true },
    secrets,
    dialogue: { choices: { matteo: 'insight', baker: 'compassion' }, ending: null },
    notes: { window: false, easel: false, candle: false, candelabra: false, duomoview: false }
  };
  await setChronicle(page, finalState, 2);
  await continueChronicle(page);
  await page.locator('[data-hs="trapdoor"]').click();
  const dialogue = page.getByRole('dialog', { name: 'Leonardo’s Lesson' });
  const light = page.getByRole('button', { name: 'Put the designs to Florence’s service' });
  const choices = dialogue.locator('button:not([disabled]):not([hidden])');
  await expect(dialogue).toBeVisible({ timeout: 5_000 });
  await expect(choices).toHaveCount(2);
  await expect(choices.first()).toBeFocused();
  await expect(page.getByRole('button', { name: 'Return to the Study' })).toHaveCount(0);
  await light.focus();
  await expect(light).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(choices.first()).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(light).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(dialogue).toBeVisible();
  await expect.poll(() => page.evaluate(key => JSON.parse(localStorage.getItem(key)).state.dialogue.ending, saveKey)).toBeNull();
});

test('ID-001: Brother Matteo keeps the monk cipher route after a dialogue choice', async ({ page }) => {
  const monkRun = { ...run, route: 'monk' };
  const monkState = {
    scene: 'library', inv: ['lens'], selected: 'lens',
    flags: { ...baseFlags, mirrorTaken: true, noteRead: true, keyTaken: true, breadTaken: true, gearTaken: true, gearInstalled: true, chestOpen: true, lensTaken: true },
    secrets,
    dialogue: { choices: { matteo: null, baker: 'insight' }, ending: null },
    notes: { window: false, easel: false, candle: false, candelabra: false, duomoview: false }
  };
  await setChronicle(page, monkState, 2, monkRun);
  await continueChronicle(page);
  await page.locator('[data-hs="monk"]').click();
  await expect(page.getByRole('dialog', { name: 'Brother Matteo' })).toBeVisible();
  await page.getByRole('button', { name: 'Seek understanding' }).click();
  await expect(page.locator('#msg')).toContainText('I · II · III · IV');
});

test('@a11y landing page and game title screen have no automated accessibility violations', async ({ page }) => {
  await page.goto('/');
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.goto('/maestros-secret.html');
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.getByRole('button', { name: 'Begin the Adventure' }).click();
  await page.getByRole('button', { name: 'Begin Exploring' }).click();
  await page.getByRole('button', { name: /Go right to Piazza della Signoria/ }).click();
  await page.locator('[data-hs="bread"]').click();
  expect((await new AxeBuilder({ page }).include('#dialogue').analyze()).violations).toEqual([]);
});

test.describe('mobile title screen', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('PE-001: the title heading remains within the narrow viewport', async ({ page }) => {
    await page.goto('/maestros-secret.html');
    expect(await page.locator('#titlescreen h1').evaluate(element => {
      const { left, right } = element.getBoundingClientRect();
      return left >= 0 && right <= window.innerWidth;
    })).toBe(true);
  });
});

test.describe('portrait-phone gameplay', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('MG-001: portrait actions mirror scene hotspots and navigation with touch-sized controls', async ({ page }) => {
    await page.goto('/maestros-secret.html');
    await page.getByRole('button', { name: 'Begin the Adventure' }).click();
    await page.getByRole('button', { name: 'Begin Exploring' }).click();
    await showCasebook(page);

    const actions = page.locator('#portrait-actions');
    await expect(actions).toBeVisible();
    const mirror = actions.getByRole('button', { name: 'Hand Mirror' });
    await expect(mirror).toBeVisible();
    expect((await mirror.boundingBox()).height).toBeGreaterThanOrEqual(44);
    await mirror.click();
    await expect(page.getByRole('button', { name: 'Select Hand Mirror' })).toBeVisible();

    await actions.getByRole('button', { name: 'Go right to Piazza della Signoria' }).click();
    await expect(page.locator('#sc-piazza')).toHaveClass(/active/);
  });

  test('MG-002: portrait dialogue has readable in-flow choices', async ({ page }) => {
    await page.goto('/maestros-secret.html');
    await page.getByRole('button', { name: 'Begin the Adventure' }).click();
    await page.getByRole('button', { name: 'Begin Exploring' }).click();
    await showCasebook(page);
    const actions = page.locator('#portrait-actions');
    await actions.getByRole('button', { name: 'Go right to Piazza della Signoria' }).click();
    await actions.getByRole('button', { name: "Baker's Stall" }).click();
    const dialogue = page.getByRole('dialog', { name: 'The Baker’s Gift' });
    await expect(dialogue).toBeVisible();
    const choice = dialogue.getByRole('button', { name: 'Offer care' });
    await expect(choice).toBeVisible();
    expect(Number.parseFloat(await choice.evaluate(element => getComputedStyle(element).fontSize))).toBeGreaterThanOrEqual(12);
  });

  test('MG-001: a delayed trapdoor reveal refreshes portrait actions', async ({ page }) => {
    const repairState = {
      scene: 'workshop', inv: ['gear'], selected: 'gear',
      flags: { ...baseFlags, mirrorTaken: true, noteRead: true, keyTaken: true, breadTaken: true, gearTaken: true },
      secrets,
      dialogue: { choices: { matteo: null, baker: null }, ending: null },
      notes: { window: false, easel: false, candle: false, candelabra: false, duomoview: false }
    };
    await setChronicle(page, repairState, 2);
    await continueChronicle(page);
    await showCasebook(page);
    const actions = page.locator('#portrait-actions');
    await actions.getByRole('button', { name: 'Flying Machine' }).click();
    await expect(actions.getByRole('button', { name: 'Trapdoor' })).toBeVisible({ timeout: 4_000 });
  });
});

test('RI-006: player-controlled Casebook starts closed and preserves the active chronicle', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/maestros-secret.html');
  await page.getByRole('button', { name: 'Begin the Adventure' }).click();
  await page.getByRole('button', { name: 'Begin Exploring' }).click();

  const toggle = page.locator('#casebookbtn');
  const surface = page.locator('#portrait-actions');
  const objective = page.locator('#objective');
  const objectiveText = () => objective.evaluate(element => element.textContent.replace(/\s+/g, ' ').trim());
  const initialObjective = await objectiveText();

  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(surface).toBeHidden();

  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await expect(surface).toBeVisible();
  await expect(surface.getByRole('button', { name: 'Hand Mirror' })).toBeVisible();

  await page.getByRole('button', { name: 'Hide Casebook' }).click();
  await expect(surface).toBeHidden();
  await expect(page.getByRole('button', { name: 'Show Casebook' })).toBeFocused();
  await expect(page.locator('#sc-workshop')).toHaveClass(/active/);
  await expect.poll(objectiveText).toBe(initialObjective);
});

test('RI-002 and RI-003: Casebook modes and item focus survive viewport changes', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/maestros-secret.html');
  await page.getByRole('button', { name: 'Begin the Adventure' }).click();
  await page.getByRole('button', { name: 'Begin Exploring' }).click();
  await showCasebook(page);
  await expect(page.locator('#stage')).toHaveAttribute('data-layout', 'phone-portrait');

  await page.locator('#portrait-actions .casebook-context [data-interaction-id="mirror"]').click();
  await page.getByRole('button', { name: 'Select Hand Mirror' }).click();
  const note = page.locator('#portrait-actions .casebook-context [data-interaction-id="note"]');
  await note.focus();

  await page.setViewportSize({ width: 844, height: 390 });
  await expect(page.locator('#stage')).toHaveAttribute('data-layout', 'phone-landscape');
  await expect(page.getByRole('button', { name: 'Select Hand Mirror' })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('#portrait-actions .casebook-context [data-interaction-id="note"]')).toBeFocused();

  for (const [viewport, layout] of [
    [{ width: 1024, height: 1365 }, 'desktop-portrait'],
    [{ width: 1280, height: 800 }, 'desktop-landscape']
  ]) {
    await page.setViewportSize(viewport);
    await expect(page.locator('#stage')).toHaveAttribute('data-layout', layout);
    const primary = page.locator('#portrait-actions .portrait-action').first();
    await expect(primary).toBeVisible();
    expect((await primary.boundingBox()).height).toBeGreaterThanOrEqual(44);
  }
});

test('RI-003: Casebook disclosure and scroll position survive rotation', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto('/maestros-secret.html');
  await page.getByRole('button', { name: 'Begin the Adventure' }).click();
  await page.getByRole('button', { name: 'Begin Exploring' }).click();
  await showCasebook(page);

  const surface = page.locator('#portrait-actions');
  await surface.locator('.casebook-all > summary').click();
  await surface.evaluate(element => { element.scrollTop = 96; });
  await expect.poll(() => surface.evaluate(element => element.scrollTop)).toBe(96);
  await surface.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));

  await page.setViewportSize({ width: 667, height: 375 });
  await expect(page.locator('#stage')).toHaveAttribute('data-layout', 'phone-landscape');
  await expect(surface.locator('.casebook-all')).toHaveAttribute('open', '');
  await expect.poll(() => surface.evaluate(element => element.scrollTop)).toBe(96);
});

test('RI-002: desktop portrait geometry follows the capped stage width', async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 1365 });
  await page.goto('/maestros-secret.html');
  await page.getByRole('button', { name: 'Begin the Adventure' }).click();
  await page.getByRole('button', { name: 'Begin Exploring' }).click();
  const geometry = await page.evaluate(() => {
    const stage = document.querySelector('#stage').getBoundingClientRect();
    const scene = document.querySelector('#sc-workshop').getBoundingClientRect();
    return { stageWidth: stage.width, sceneHeight: scene.height };
  });
  expect(geometry.sceneHeight).toBeCloseTo(geometry.stageWidth * 9 / 16, 1);
});

test('RI-003: a viewport change preserves external focus instead of restoring stale Casebook focus', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/maestros-secret.html');
  await page.getByRole('button', { name: 'Begin the Adventure' }).click();
  await page.getByRole('button', { name: 'Begin Exploring' }).click();
  await showCasebook(page);
  const inventory = page.getByRole('button', { name: 'Select Hand Mirror' });
  await page.locator('#portrait-actions .casebook-context [data-interaction-id="mirror"]').click();
  await page.locator('#portrait-actions .casebook-context [data-interaction-id="note"]').focus();
  await inventory.focus();

  await page.setViewportSize({ width: 844, height: 390 });
  await expect(inventory).toBeFocused();
});

test('RI-003 and RI-004: a Casebook action restores focus after closing its modal', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/maestros-secret.html');
  await page.getByRole('button', { name: 'Begin the Adventure' }).click();
  await page.getByRole('button', { name: 'Begin Exploring' }).click();
  await showCasebook(page);
  await page.locator('#portrait-actions').getByRole('button', { name: 'Go right to Piazza della Signoria' }).click();

  const baker = page.locator('#portrait-actions .casebook-context [data-interaction-id="bread"]');
  await baker.focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('dialog', { name: 'The Baker’s Gift' })).toBeVisible();
  await page.getByRole('button', { name: 'Step Back' }).click();

  await expect(page.locator('#portrait-actions .casebook-context [data-interaction-id="bread"]')).toBeFocused();
});

test('@a11y RI-004 and RI-005: Casebook actions support keyboard use and have no automated violations', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/maestros-secret.html');
  await page.getByRole('button', { name: 'Begin the Adventure' }).click();
  await page.getByRole('button', { name: 'Begin Exploring' }).click();
  await showCasebook(page);
  const mirror = page.locator('#portrait-actions .casebook-context [data-interaction-id="mirror"]');
  await mirror.focus();
  expect((await mirror.boundingBox()).height).toBeGreaterThanOrEqual(44);
  await page.keyboard.press('Enter');
  await expect(page.getByRole('button', { name: 'Select Hand Mirror' })).toBeVisible();
  expect((await new AxeBuilder({ page }).include('#portrait-actions').analyze()).violations).toEqual([]);
});

test('RI-004: mobile Casebook exposes a touch scroll surface', async ({ page }) => {
  await page.setViewportSize({ width: 667, height: 375 });
  await page.goto('/maestros-secret.html');
  await page.getByRole('button', { name: 'Begin the Adventure' }).click();
  await page.getByRole('button', { name: 'Begin Exploring' }).click();
  await showCasebook(page);

  const surface = page.locator('#portrait-actions');
  await surface.locator('.casebook-all > summary').click();
  const mobileSurface = await surface.evaluate(element => {
    const style = getComputedStyle(element);
    return {
      canScroll: element.scrollHeight > element.clientHeight,
      pointerEvents: style.pointerEvents,
      touchAction: style.touchAction,
      overscrollBehaviorY: style.overscrollBehaviorY
    };
  });

  expect(mobileSurface.canScroll).toBe(true);
  expect(mobileSurface.pointerEvents).toBe('auto');
  expect(mobileSurface.touchAction).toBe('pan-y');
  expect(mobileSurface.overscrollBehaviorY).toBe('contain');

  await page.setViewportSize({ width: 1280, height: 800 });
  await expect(page.locator('#stage')).toHaveAttribute('data-layout', 'desktop-landscape');
  expect(await surface.evaluate(element => getComputedStyle(element).pointerEvents)).toBe('none');
});

test('RI-004: portrait travel controls retain Casebook separation', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/maestros-secret.html');
  await page.getByRole('button', { name: 'Begin the Adventure' }).click();
  await page.getByRole('button', { name: 'Begin Exploring' }).click();
  await showCasebook(page);

  const surface = page.locator('#portrait-actions');
  const disclosure = surface.locator('.casebook-all > summary');
  const travel = surface.locator('.casebook-navigation');
  const disclosureBox = await disclosure.boundingBox();
  const travelBox = await travel.boundingBox();

  expect(disclosureBox).not.toBeNull();
  expect(travelBox).not.toBeNull();
  expect(travelBox.y - (disclosureBox.y + disclosureBox.height)).toBeGreaterThanOrEqual(8);
});

test('RI-003 and RI-004: a focused Casebook observation is revealed without native focus scrolling', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto('/maestros-secret.html');
  await page.getByRole('button', { name: 'Begin the Adventure' }).click();
  await page.getByRole('button', { name: 'Begin Exploring' }).click();
  await showCasebook(page);

  const surface = page.locator('#portrait-actions');
  await surface.locator('.casebook-all > summary').click();
  const finalObservation = surface.locator('.casebook-all-actions .portrait-action').last();
  await finalObservation.evaluate(element => element.focus({ preventScroll: true }));

  await expect.poll(() => surface.evaluate(element => element.scrollTop)).toBeGreaterThan(0);
  const geometry = await Promise.all([surface.boundingBox(), finalObservation.boundingBox()]);
  const [surfaceBox, observationBox] = geometry;
  expect(surfaceBox).not.toBeNull();
  expect(observationBox).not.toBeNull();
  expect(observationBox.y).toBeGreaterThanOrEqual(surfaceBox.y);
  expect(observationBox.y + observationBox.height).toBeLessThanOrEqual(surfaceBox.y + surfaceBox.height + 1);
});

test('RI-003 and RI-004: landscape Casebook focus scrolls the panel, not the page', async ({ page }) => {
  await page.setViewportSize({ width: 667, height: 375 });
  await page.goto('/maestros-secret.html');
  await page.getByRole('button', { name: 'Begin the Adventure' }).click();
  await page.getByRole('button', { name: 'Begin Exploring' }).click();
  await showCasebook(page);

  const surface = page.locator('#portrait-actions');
  await surface.locator('.casebook-all > summary').click();
  const finalObservation = surface.locator('.casebook-all-actions .portrait-action').last();
  await finalObservation.evaluate(element => element.focus({ preventScroll: true }));

  await expect.poll(() => surface.evaluate(element => element.scrollTop)).toBeGreaterThan(0);
  expect(await page.evaluate(() => window.scrollY)).toBe(0);
});

test('RI-003 and RI-004: stale Casebook focus callbacks cannot displace the current control', async ({ page }) => {
  await page.setViewportSize({ width: 667, height: 375 });
  await page.goto('/maestros-secret.html');
  await page.getByRole('button', { name: 'Begin the Adventure' }).click();
  await page.getByRole('button', { name: 'Begin Exploring' }).click();
  await showCasebook(page);

  const surface = page.locator('#portrait-actions');
  const disclosure = surface.locator('.casebook-all > summary');
  await disclosure.click();
  const contextualAction = surface.locator('.casebook-context .portrait-action').first();
  const observations = surface.locator('.casebook-all-actions .portrait-action');
  const finalObservation = observations.last();
  await page.evaluate(() => {
    window.casebookRevealFrames = [];
    window.casebookRevealTimers = [];
    window.requestAnimationFrame = callback => {
      window.casebookRevealFrames.push(callback);
      return window.casebookRevealFrames.length;
    };
    window.setTimeout = callback => {
      window.casebookRevealTimers.push(callback);
      return window.casebookRevealTimers.length;
    };
  });

  await finalObservation.evaluate(element => element.focus({ preventScroll: true }));
  await page.evaluate(() => {
    while (window.casebookRevealFrames.length) window.casebookRevealFrames.shift()();
    window.staleCasebookReveal = window.casebookRevealTimers.pop();
    window.casebookRevealTimers = [];
  });
  await contextualAction.evaluate(element => element.focus({ preventScroll: true }));
  await page.evaluate(() => {
    while (window.casebookRevealFrames.length) window.casebookRevealFrames.shift()();
  });
  const scrollTopForCurrentControl = await surface.evaluate(element => element.scrollTop);

  await page.evaluate(() => window.staleCasebookReveal());
  expect(await surface.evaluate(element => element.scrollTop)).toBe(scrollTopForCurrentControl);
});

test('RI-005: landscape Casebook clears the system gesture edge', async ({ page }) => {
  await page.setViewportSize({ width: 667, height: 375 });
  await page.goto('/maestros-secret.html');
  await page.getByRole('button', { name: 'Begin the Adventure' }).click();
  await page.getByRole('button', { name: 'Begin Exploring' }).click();
  await showCasebook(page);

  const panel = await page.locator('#portrait-actions').boundingBox();
  expect(panel).not.toBeNull();
  expect(375 - (panel.y + panel.height)).toBeGreaterThanOrEqual(16);
});

test('RI-005: landscape Casebook clears the top-bar controls', async ({ page }) => {
  await page.setViewportSize({ width: 667, height: 375 });
  await page.goto('/maestros-secret.html');
  await page.getByRole('button', { name: 'Begin the Adventure' }).click();
  await page.getByRole('button', { name: 'Begin Exploring' }).click();
  await showCasebook(page);

  const panel = await page.locator('#portrait-actions').boundingBox();
  const topbar = await page.locator('#topbar').boundingBox();
  expect(panel).not.toBeNull();
  expect(topbar).not.toBeNull();
  expect(panel.y - (topbar.y + topbar.height)).toBeGreaterThanOrEqual(8);
});

test('@a11y RI-002, RI-004 and RI-005: declared viewport accessibility matrix preserves the Casebook contract', async ({ page }) => {
  test.slow();
  const matrix = [
    [{ width: 320, height: 568 }, 'phone-portrait'],
    [{ width: 390, height: 844 }, 'phone-portrait'],
    [{ width: 430, height: 932 }, 'phone-portrait'],
    [{ width: 667, height: 375 }, 'phone-landscape'],
    [{ width: 844, height: 390 }, 'phone-landscape'],
    [{ width: 1024, height: 1365 }, 'desktop-portrait'],
    [{ width: 1280, height: 800 }, 'desktop-landscape'],
    [{ width: 1440, height: 900 }, 'desktop-landscape']
  ];

  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const [viewport, layout] of matrix) {
    await page.setViewportSize(viewport);
    await page.goto('/maestros-secret.html');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await page.getByRole('button', { name: 'Begin the Adventure' }).click();
    await page.getByRole('button', { name: 'Begin Exploring' }).click();
    await showCasebook(page);

    await expect(page.locator('#stage')).toHaveAttribute('data-layout', layout);
    const disclosure = page.locator('#portrait-actions .casebook-all > summary');
    await expect(disclosure).toBeVisible();
    const disclosureBounds = await disclosure.boundingBox();
    expect(disclosureBounds).not.toBeNull();
    expect(disclosureBounds?.width).toBeGreaterThanOrEqual(44);
    expect(disclosureBounds?.height).toBeGreaterThanOrEqual(44);
    const primaryControls = page.locator('#portrait-actions .portrait-action, #portrait-actions .casebook-all > summary');
    const controlCount = await primaryControls.count();
    expect(controlCount).toBeGreaterThan(0);
    for (let index = 0; index < controlCount; index++) {
      const bounds = await primaryControls.nth(index).boundingBox();
      if (!bounds?.width || !bounds.height) continue;
      expect(bounds?.width).toBeGreaterThanOrEqual(44);
      expect(bounds?.height).toBeGreaterThanOrEqual(44);
    }
    const mirror = page.locator('#portrait-actions .casebook-context [data-interaction-id="mirror"]');
    await mirror.focus();
    await page.keyboard.press('Enter');
    await expect(page.getByRole('button', { name: 'Select Hand Mirror' })).toBeVisible();
    await page.getByRole('button', { name: 'CONTRAST' }).click();
    await expect(page.locator('body')).toHaveClass(/high-contrast/);
    await expect(page.locator('#titlescreen .vitr')).toHaveCSS('animation-name', 'none');
    expect((await new AxeBuilder({ page }).include('#portrait-actions').analyze()).violations).toEqual([]);
  }
});

test('FTA-001: a new chronicle gets a skippable first-time interaction assistant', async ({ page }) => {
  await page.goto('/maestros-secret.html');
  await page.getByRole('button', { name: 'Begin the Adventure' }).click();

  const assistant = page.getByRole('dialog', { name: 'Your First Steps' });
  await expect(assistant).toBeVisible();
  await expect(assistant).toContainText('Inspect the scene');
  await expect(assistant).toContainText('satchel');
  await expect(assistant).toContainText('left and right');
  await page.getByRole('button', { name: 'Begin Exploring' }).click();
  await expect(assistant).not.toBeVisible();
  await expect.poll(() => page.evaluate(() => localStorage.getItem('maestros-secret:first-time-assistant'))).toBe('complete');
  await expect(page.locator('[data-hs="mirror"]')).toBeFocused();

  await page.reload();
  await page.getByRole('button', { name: 'Continue Chronicle' }).click();
  await expect(assistant).not.toBeVisible();
});

test('FTA-001: Escape completes the first-time assistant and returns focus to the opening interaction', async ({ page }) => {
  await page.goto('/maestros-secret.html');
  await page.getByRole('button', { name: 'Begin the Adventure' }).click();
  const assistant = page.getByRole('dialog', { name: 'Your First Steps' });
  await expect(assistant).toBeVisible();

  await page.keyboard.press('Escape');

  await expect(assistant).not.toBeVisible();
  await expect.poll(() => page.evaluate(() => localStorage.getItem('maestros-secret:first-time-assistant'))).toBe('complete');
  await expect(page.locator('[data-hs="mirror"]')).toBeFocused();
});

test.describe('short mobile dialogue', () => {
  test.use({ viewport: { width: 844, height: 390 } });

  test('MG-002: short landscape dialogue keeps actions beside the compact artwork', async ({ page }) => {
    await page.goto('/maestros-secret.html');
    await page.getByRole('button', { name: 'Begin the Adventure' }).click();
    await page.getByRole('button', { name: 'Begin Exploring' }).click();
    await page.getByRole('button', { name: 'Go right to Piazza della Signoria' }).click();
    await page.locator('[data-hs="bread"]').press('Enter');

    const dialogue = page.getByRole('dialog', { name: 'The Baker’s Gift' });
    await expect(dialogue).toBeVisible();
    const bounds = await dialogue.locator('.dialogue-scene').evaluate(scene => {
      const image = scene.querySelector('img').getBoundingClientRect();
      const copy = scene.querySelector('.dialogue-copy').getBoundingClientRect();
      const choice = scene.querySelector('.dialogue-choices .btn').getBoundingClientRect();
      const root = scene.getBoundingClientRect();
      return { imageRight: image.right, copyLeft: copy.left, choiceTop: choice.top, choiceLeft: choice.left, choiceRight: choice.right, rootLeft: root.left, rootRight: root.right };
    });
    expect(bounds.imageRight).toBeLessThanOrEqual(bounds.copyLeft);
    expect(bounds.choiceLeft).toBeGreaterThanOrEqual(bounds.rootLeft);
    expect(bounds.choiceRight).toBeLessThanOrEqual(bounds.rootRight);
  });
});

test('RI-004: dialogue hides a stale hotspot label', async ({ page }) => {
  await page.goto('/maestros-secret.html');
  await page.getByRole('button', { name: 'Begin the Adventure' }).click();
  await page.getByRole('button', { name: 'Begin Exploring' }).click();
  await page.getByRole('button', { name: 'Go right to Piazza della Signoria' }).click();
  await page.locator('#tag').evaluate(element => {
    element.textContent = 'Baker’s Stall';
    element.style.opacity = '1';
  });
  await page.locator('[data-hs="bread"]').evaluate(element => {
    element.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  });

  await expect(page.getByRole('dialog', { name: 'The Baker’s Gift' })).toBeVisible();
  expect(await page.locator('#tag').evaluate(element => element.style.opacity)).toBe('0');
});

test.describe('compact dialogue composition', () => {
  test.describe('phone portrait', () => {
    test.use({ viewport: { width: 390, height: 844 } });

    test('RI-002: compact dialogue uses placeholder-free portrait art', async ({ page }) => {
      await page.goto('/maestros-secret.html');
      await page.getByRole('button', { name: 'Begin the Adventure' }).click();
      await page.getByRole('button', { name: 'Begin Exploring' }).click();
      await showCasebook(page);
      await page.locator('#portrait-actions').getByRole('button', { name: 'Go right to Piazza della Signoria' }).click();
      await page.locator('[data-hs="bread"]').press('Enter');

      const scene = page.getByRole('dialog', { name: 'The Baker’s Gift' }).locator('.dialogue-scene');
      await expect(scene).toHaveAttribute('data-dialogue-layout', 'compact-portrait');
      expect(await scene.locator('img').getAttribute('src')).toContain('baker-piazza-compact.webp');
    });
  });

  test.describe('phone landscape', () => {
    test.use({ viewport: { width: 844, height: 390 } });

    test('RI-002: compact dialogue keeps artwork beside copy instead of cropping it into a banner', async ({ page }) => {
      await page.goto('/maestros-secret.html');
      await page.getByRole('button', { name: 'Begin the Adventure' }).click();
      await page.getByRole('button', { name: 'Begin Exploring' }).click();
      await page.getByRole('button', { name: 'Go right to Piazza della Signoria' }).click();
      await page.locator('[data-hs="bread"]').press('Enter');

      const scene = page.getByRole('dialog', { name: 'The Baker’s Gift' }).locator('.dialogue-scene');
      await expect(scene).toHaveAttribute('data-dialogue-layout', 'compact-landscape');
      expect(await scene.locator('img').getAttribute('src')).toContain('baker-piazza-compact.webp');
      const bounds = await scene.evaluate(element => {
        const art = element.querySelector('img').getBoundingClientRect();
        const copy = element.querySelector('.dialogue-copy').getBoundingClientRect();
        return { artRight: art.right, copyLeft: copy.left, artTop: art.top, copyTop: copy.top };
      });
      expect(bounds.artRight).toBeLessThanOrEqual(bounds.copyLeft);
      expect(bounds.artTop).toBeLessThanOrEqual(bounds.copyTop);
    });
  });
});

test.describe('desktop dialogue composition', () => {
  test.use({ viewport: { width: 1024, height: 600 } });

  test('MG-002: desktop baker dialogue copy uses the authored right-side parchment area', async ({ page }) => {
    await page.goto('/maestros-secret.html');
    await page.getByRole('button', { name: 'Begin the Adventure' }).click();
    await page.getByRole('button', { name: 'Begin Exploring' }).click();
    await page.getByRole('button', { name: 'Go right to Piazza della Signoria' }).click();
    await page.locator('[data-hs="bread"]').click();

    const dialogue = page.getByRole('dialog', { name: 'The Baker’s Gift' });
    await expect(dialogue).toBeVisible();
    const bounds = await dialogue.locator('.dialogue-scene').evaluate(scene => {
      const root = scene.getBoundingClientRect();
      const copy = scene.querySelector('.dialogue-copy').getBoundingClientRect();
      return { copyLeft: copy.left, copyRight: copy.right, rootLeft: root.left, rootRight: root.right, rootWidth: root.width };
    });
    expect(bounds.copyLeft).toBeGreaterThanOrEqual(bounds.rootLeft + bounds.rootWidth * 0.48);
    expect(bounds.copyRight).toBeLessThanOrEqual(bounds.rootRight);
  });
});

test('MA-001: a suspended audio context resumes while its first music sources are scheduled in the activation', async ({ page }) => {
  await page.addInitScript(() => {
    window.__audioProbe = { resumes: 0, startsBeforeResume: 0 };
    class FakeAudioContext {
      constructor() {
        this.currentTime = 0;
        this.destination = {};
        this.state = 'suspended';
      }
      resume() {
        window.__audioProbe.resumes += 1;
        return new Promise(resolve => setTimeout(() => {
          this.state = 'running';
          resolve();
        }, 0));
      }
      createOscillator() {
        const context = this;
        return {
          frequency: { value: 0 }, type: 'sine', connect() {},
          start() { if (context.state !== 'running') window.__audioProbe.startsBeforeResume += 1; },
          stop() {}
        };
      }
      createGain() {
        return { gain: { value: 0, setValueAtTime() {}, exponentialRampToValueAtTime() {}, cancelScheduledValues() {} }, connect() {} };
      }
      createBiquadFilter() {
        return { frequency: { value: 0, setTargetAtTime() {} }, connect() {}, type: 'lowpass' };
      }
    }
    window.AudioContext = FakeAudioContext;
    window.webkitAudioContext = FakeAudioContext;
  });
  await page.goto('/maestros-secret.html');
  await page.getByRole('button', { name: 'Begin the Adventure' }).click();
  await page.getByRole('button', { name: 'Begin Exploring' }).click();
  await expect.poll(() => page.evaluate(() => window.__audioProbe.resumes)).toBeGreaterThan(0);
  await expect.poll(() => page.evaluate(() => window.__audioProbe.startsBeforeResume)).toBeGreaterThan(0);
});

test('MA-001: direct-tap music sources are scheduled before an iOS resume promise settles', async ({ page }) => {
  await page.addInitScript(() => {
    window.__directTapAudio = { resumes: 0, oscillatorStarts: 0 };
    class FakeAudioContext {
      constructor() { this.currentTime = 0; this.destination = {}; this.state = 'suspended'; }
      resume() { window.__directTapAudio.resumes += 1; return new Promise(() => {}); }
      createOscillator() {
        return { frequency: { value: 0 }, type: 'sine', connect() {}, start() { window.__directTapAudio.oscillatorStarts += 1; }, stop() {} };
      }
      createGain() {
        return { gain: { value: 0, setValueAtTime() {}, exponentialRampToValueAtTime() {}, cancelScheduledValues() {} }, connect() {} };
      }
      createBiquadFilter() {
        return { frequency: { value: 0, setTargetAtTime() {} }, connect() {}, type: 'lowpass' };
      }
    }
    window.AudioContext = FakeAudioContext;
    window.webkitAudioContext = FakeAudioContext;
  });
  await page.goto('/maestros-secret.html');
  await page.getByRole('button', { name: 'Begin the Adventure' }).click();

  await expect.poll(() => page.evaluate(() => window.__directTapAudio.resumes)).toBeGreaterThan(0);
  await expect.poll(() => page.evaluate(() => window.__directTapAudio.oscillatorStarts)).toBeGreaterThan(0);
  await expect(page.getByRole('button', { name: 'Starting music' })).toBeVisible();
});

test('MA-001: a suspended context keeps one scheduler chain when its resume completes', async ({ page }) => {
  await page.addInitScript(() => {
    window.__schedulerProbe = { schedulerTimeouts: 0, completeResume: null };
    const nativeSetTimeout = window.setTimeout.bind(window);
    window.setTimeout = (callback, delay, ...args) => {
      if (delay === 400) window.__schedulerProbe.schedulerTimeouts += 1;
      return nativeSetTimeout(callback, delay, ...args);
    };
    class FakeAudioContext {
      constructor() { this.currentTime = 0; this.destination = {}; this.state = 'suspended'; }
      resume() {
        return new Promise(resolve => {
          window.__schedulerProbe.completeResume = () => { this.state = 'running'; resolve(); };
        });
      }
      createOscillator() { return { frequency: { value: 0 }, type: 'sine', connect() {}, start() {}, stop() {} }; }
      createGain() { return { gain: { value: 0, setValueAtTime() {}, exponentialRampToValueAtTime() {}, cancelScheduledValues() {} }, connect() {} }; }
      createBiquadFilter() { return { frequency: { value: 0, setTargetAtTime() {} }, connect() {}, type: 'lowpass' }; }
    }
    window.AudioContext = FakeAudioContext;
    window.webkitAudioContext = FakeAudioContext;
  });
  await page.goto('/maestros-secret.html');
  await page.getByRole('button', { name: 'Begin the Adventure' }).click();
  await expect.poll(() => page.evaluate(() => window.__schedulerProbe.schedulerTimeouts)).toBe(1);

  await page.evaluate(() => window.__schedulerProbe.completeResume());
  await expect.poll(() => page.evaluate(() => window.__schedulerProbe.schedulerTimeouts)).toBe(1);
});

test('MA-001: music scheduling resumes after a later context suspension', async ({ page }) => {
  await page.addInitScript(() => {
    window.__lifecycleAudio = { starts: 0, context: null };
    class FakeAudioContext {
      constructor() {
        this.currentTime = 0;
        this.destination = {};
        this.state = 'running';
        window.__lifecycleAudio.context = this;
      }
      resume() { this.state = 'running'; return Promise.resolve(); }
      createOscillator() {
        return { frequency: { value: 0 }, type: 'sine', connect() {}, start() { window.__lifecycleAudio.starts += 1; }, stop() {} };
      }
      createGain() {
        return { gain: { value: 0, setValueAtTime() {}, exponentialRampToValueAtTime() {}, cancelScheduledValues() {} }, connect() {} };
      }
      createBiquadFilter() {
        return { frequency: { value: 0, setTargetAtTime() {} }, connect() {}, type: 'lowpass' };
      }
    }
    window.AudioContext = FakeAudioContext;
    window.webkitAudioContext = FakeAudioContext;
  });
  await page.goto('/maestros-secret.html');
  await page.getByRole('button', { name: 'Begin the Adventure' }).click();
  await page.getByRole('button', { name: 'Begin Exploring' }).click();
  await expect.poll(() => page.evaluate(() => window.__lifecycleAudio.starts)).toBeGreaterThan(0);
  await page.waitForTimeout(150);
  const startsBeforeSuspend = await page.evaluate(() => window.__lifecycleAudio.starts);
  await page.evaluate(() => { window.__lifecycleAudio.context.state = 'suspended'; });
  await page.waitForTimeout(500);
  await page.evaluate(() => {
    window.__lifecycleAudio.context.currentTime = 3;
    window.__lifecycleAudio.context.state = 'running';
  });
  await expect.poll(() => page.evaluate(() => window.__lifecycleAudio.starts)).toBeGreaterThan(startsBeforeSuspend);
});

test('MA-001: an iOS-style resolved-but-suspended context stays muted until a later activation can run it', async ({ page }) => {
  await page.addInitScript(() => {
    window.__iosAudioProbe = { resumes: 0, starts: 0, allowResume: false };
    class FakeAudioContext {
      constructor() { this.currentTime = 0; this.destination = {}; this.state = 'suspended'; }
      resume() {
        window.__iosAudioProbe.resumes += 1;
        if (window.__iosAudioProbe.allowResume) this.state = 'running';
        return Promise.resolve();
      }
      createOscillator() {
        return { frequency: { value: 0 }, type: 'sine', connect() {}, start() { window.__iosAudioProbe.starts += 1; }, stop() {} };
      }
      createGain() {
        return { gain: { value: 0, setValueAtTime() {}, exponentialRampToValueAtTime() {}, cancelScheduledValues() {} }, connect() {} };
      }
      createBiquadFilter() { return { frequency: { value: 0, setTargetAtTime() {} }, connect() {}, type: 'lowpass' }; }
    }
    window.AudioContext = FakeAudioContext;
    window.webkitAudioContext = FakeAudioContext;
  });
  await page.goto('/maestros-secret.html');
  await page.getByRole('button', { name: 'Begin the Adventure' }).click();
  await page.getByRole('button', { name: 'Begin Exploring' }).click();
  await expect.poll(() => page.evaluate(() => window.__iosAudioProbe.resumes)).toBeGreaterThan(0);
  await expect(page.getByRole('button', { name: 'Mute music' })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Play music' })).toBeVisible();
  await expect.poll(() => page.evaluate(() => window.__iosAudioProbe.starts)).toBeGreaterThan(0);

  await page.evaluate(() => { window.__iosAudioProbe.allowResume = true; });
  await page.getByRole('button', { name: 'Play music' }).click();
  await expect(page.getByRole('button', { name: 'Mute music' })).toBeVisible();
  await expect.poll(() => page.evaluate(() => window.__iosAudioProbe.starts)).toBeGreaterThan(0);
});
