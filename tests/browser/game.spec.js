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

test('ID-001: Leonardo’s terminal dialogue retains focus and cannot be escaped', async ({ page }) => {
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
  const dialogue = page.getByRole('dialog', { name: 'Leonardo’s Lesson' });
  const light = page.getByRole('button', { name: 'Put the designs to Florence’s service' });
  await expect(dialogue).toBeVisible({ timeout: 5_000 });
  await expect(light).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(page.getByRole('button', { name: 'Return to the Study' })).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(light).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(dialogue).toBeVisible();
  await light.click();
  await expect(page.getByRole('dialog', { name: 'Florence’s Light' })).toBeVisible();
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
    const actions = page.locator('#portrait-actions');
    await actions.getByRole('button', { name: 'Flying Machine' }).click();
    await expect(actions.getByRole('button', { name: 'Trapdoor' })).toBeVisible({ timeout: 4_000 });
  });
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

test.describe('short mobile dialogue', () => {
  test.use({ viewport: { width: 844, height: 390 } });

  test('MG-002: short portrait-or-landscape dialogue actions follow the image instead of overlaying it', async ({ page }) => {
    await page.goto('/maestros-secret.html');
    await page.getByRole('button', { name: 'Begin the Adventure' }).click();
    await page.getByRole('button', { name: 'Begin Exploring' }).click();
    await page.getByRole('button', { name: 'Go right to Piazza della Signoria' }).click();
    await page.locator('[data-hs="bread"]').click();

    const dialogue = page.getByRole('dialog', { name: 'The Baker’s Gift' });
    await expect(dialogue).toBeVisible();
    const copy = dialogue.locator('.dialogue-copy');
    await expect(copy).toHaveCSS('position', 'relative');
    const bounds = await dialogue.locator('.dialogue-scene').evaluate(scene => {
      const image = scene.querySelector('img').getBoundingClientRect();
      const choice = scene.querySelector('.dialogue-choices .btn').getBoundingClientRect();
      const root = scene.getBoundingClientRect();
      return { imageBottom: image.bottom, choiceTop: choice.top, choiceLeft: choice.left, choiceRight: choice.right, rootLeft: root.left, rootRight: root.right };
    });
    expect(bounds.choiceTop).toBeGreaterThanOrEqual(bounds.imageBottom);
    expect(bounds.choiceLeft).toBeGreaterThanOrEqual(bounds.rootLeft);
    expect(bounds.choiceRight).toBeLessThanOrEqual(bounds.rootRight);
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
