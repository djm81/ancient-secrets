import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const saveKey = 'maestros-secret:chronicle';
const run = { route: 'fresco', gearRoute: 'well', code: [1, 2, 3, 4], bellPattern: [0, 1, 2] };
const flags = { mirrorTaken: true, noteRead: true, keyTaken: true, breadTaken: true, gearTaken: true, gearInstalled: true, trapdoorShown: true, chestOpen: true, lensTaken: true, cipherSeen: true, boxOpen: true, ornateTaken: true, catClicks: 0, wellUsed: false, duomoSolved: false, galleryVisited: false, bellSteps: [] };
const secrets = { cat: false, pigeon: false, well: false, spiral: false, redbook: false };
const notes = { window: false, easel: false, candle: false, candelabra: false, duomoview: false };
const completedBabylon = { eras: { babylon: { status: 'complete', clues: [], attempt: null, bestCredit: 4, lastFailure: null } }, mastery: { understand: 4, value: 0, optimize: 0, practice: 1 }, inventions: ['anemometer'], codexComplete: false };

async function openBabylonAudit(page) {
  await page.goto('/maestros-secret.html');
  await page.evaluate(({ key, value }) => localStorage.setItem(key, JSON.stringify(value)), {
    key: saveKey,
    value: { version: 2, savedAt: '2026-08-02T12:00:00+02:00', state: { scene: 'cellar', inv: [], selected: null, flags, secrets, dialogue: { choices: { matteo: null, baker: 'compassion' }, ending: 'light' }, notes }, run }
  });
  await page.reload();
  await page.getByRole('button', { name: 'Continue Chronicle' }).click();
  await page.getByRole('button', { name: 'Enter the Codex Rationum' }).click();
  await page.getByRole('button', { name: 'Set the Occhio for Babylon' }).click();
  for (let clue = 0; clue < 3; clue += 1) await page.getByRole('button', { name: 'Study this clue' }).first().click();
  await page.getByRole('button', { name: 'Prepare the reconciliation' }).click();
}

test('Wave A: a completed Florence chronicle can enter, investigate, and pass the offline Babylon vertical slice', async ({ page }) => {
  await page.goto('/maestros-secret.html');
  await page.evaluate(({ key, value }) => localStorage.setItem(key, JSON.stringify(value)), {
    key: saveKey,
    value: { version: 2, savedAt: '2026-08-01T12:00:00+02:00', state: { scene: 'cellar', inv: [], selected: null, flags, secrets, dialogue: { choices: { matteo: null, baker: 'compassion' }, ending: 'light' }, notes }, run }
  });
  await page.reload();
  await page.getByRole('button', { name: 'Continue Chronicle' }).click();
  await page.getByRole('button', { name: 'Enter the Codex Rationum' }).click();
  await expect(page.getByRole('dialog', { name: 'The Codex Rationum' })).toBeVisible();
  await page.getByRole('button', { name: 'Set the Occhio for Babylon' }).click();
  for (let clue = 1; clue <= 3; clue += 1) {
    await page.getByRole('button', { name: 'Study this clue' }).first().click();
    await expect(page.getByRole('status', { name: 'Babylon clue progress' })).toHaveText(new RegExp(`${clue} of 3 clues recorded`));
  }
  await expect(page.getByRole('button', { name: 'Recorded in ledger' })).toHaveCount(3);
  await page.getByRole('button', { name: 'Prepare the reconciliation' }).click();
  await expect(page.getByRole('heading', { name: 'Audit the doubtful tablet' })).toBeVisible();
  await expect(page.getByRole('status', { name: 'Evidence-led reconciliation' })).toContainText('sealed deliveries total 90 gur');
  await page.getByRole('button', { name: 'Accept the tablet as written' }).click();
  await expect(page.getByRole('status', { name: 'Evidence-led reconciliation' })).toContainText('The damp tablet claims 100 gur');
  await page.getByRole('button', { name: 'Mark the tablet line as doubtful' }).click();
  await expect(page.getByRole('heading', { name: 'Set the corrected grain total' })).toBeVisible();
  await page.locator('#babylon-delivery').selectOption('90');
  await page.getByRole('button', { name: 'Confirm the corrected total' }).click();
  await expect(page.getByRole('heading', { name: 'Apply the public silver rule' })).toBeVisible();
  await page.locator('#babylon-rate').selectOption('20');
  await page.getByRole('button', { name: 'Apply the lawful rate' }).click();
  await expect(page.getByRole('heading', { name: 'Your corrected entry' })).toBeVisible();
  await page.getByRole('button', { name: 'Seal the corrected entry' }).click();
  await expect(page.getByRole('button', { name: 'Return to Leonardo for a debrief' })).toBeVisible();
});

test('the Codex return restores the completed-story conclusion', async ({ page }) => {
  await page.goto('/maestros-secret.html');
  await page.evaluate(({ key, value }) => localStorage.setItem(key, JSON.stringify(value)), {
    key: saveKey,
    value: { version: 2, savedAt: '2026-08-02T12:00:00+02:00', state: { scene: 'cellar', inv: [], selected: null, flags, secrets, dialogue: { choices: { matteo: null, baker: 'compassion' }, ending: 'light' }, notes }, run }
  });
  await page.reload();
  await page.getByRole('button', { name: 'Continue Chronicle' }).click();
  await page.getByRole('button', { name: 'Enter the Codex Rationum' }).click();
  await page.getByRole('button', { name: 'Return to the story conclusion' }).click();
  await expect(page.locator('#endmodal')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Florence’s Light' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Enter the Codex Rationum' })).toBeVisible();
});

test('review follow-up: Escape from the Codex restores the completed-story conclusion', async ({ page }) => {
  await page.goto('/maestros-secret.html');
  await page.evaluate(({ key, value }) => localStorage.setItem(key, JSON.stringify(value)), {
    key: saveKey,
    value: { version: 2, savedAt: '2026-08-02T12:00:00+02:00', state: { scene: 'cellar', inv: [], selected: null, flags, secrets, dialogue: { choices: { matteo: null, baker: 'compassion' }, ending: 'light' }, notes }, run }
  });
  await page.reload();
  await page.getByRole('button', { name: 'Continue Chronicle' }).click();
  await page.getByRole('button', { name: 'Enter the Codex Rationum' }).click();
  await page.keyboard.press('Escape');
  await expect(page.locator('#endmodal')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Florence’s Light' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Enter the Codex Rationum' })).toBeVisible();
});

test('review follow-up: a rejected grain total reaches its specific withdrawal debrief', async ({ page }) => {
  await openBabylonAudit(page);
  await page.getByRole('button', { name: 'Mark the tablet line as doubtful' }).click();
  await page.locator('#babylon-delivery').selectOption('80');
  await page.getByRole('button', { name: 'Confirm the corrected total' }).click();
  await page.getByRole('button', { name: 'Withdraw to Leonardo' }).click();
  await expect(page.getByText('The seals and the tablet disagree. Before a steward can allocate grain, the record must describe what actually arrived.')).toBeVisible();
});

test('review follow-up: a rejected silver rate reaches its specific withdrawal debrief', async ({ page }) => {
  await openBabylonAudit(page);
  await page.getByRole('button', { name: 'Mark the tablet line as doubtful' }).click();
  await page.locator('#babylon-delivery').selectOption('90');
  await page.getByRole('button', { name: 'Confirm the corrected total' }).click();
  await page.locator('#babylon-rate').selectOption('25');
  await page.getByRole('button', { name: 'Apply the lawful rate' }).click();
  await page.getByRole('button', { name: 'Withdraw to Leonardo' }).click();
  await expect(page.getByText('The tablet asks more than the stele permits. A useful record is not enough when the rule that governs it is ignored.')).toBeVisible();
});

test('a completed Babylon expedition can be revisited without dead-ending the hub entry', async ({ page }) => {
  await page.goto('/maestros-secret.html');
  await page.evaluate(({ key, value }) => localStorage.setItem(key, JSON.stringify(value)), {
    key: saveKey,
    value: { version: 3, savedAt: '2026-08-02T12:00:00+02:00', state: { scene: 'cellar', inv: [], selected: null, flags, secrets, dialogue: { choices: { matteo: null, baker: 'compassion' }, ending: 'light' }, notes }, run, expedition: completedBabylon }
  });
  await page.reload();
  await page.getByRole('button', { name: 'Continue Chronicle' }).click();
  await page.getByRole('button', { name: 'Enter the Codex Rationum' }).click();
  await page.getByRole('button', { name: 'Revisit Babylon' }).click();
  await expect(page.getByRole('heading', { name: 'Three seals, one doubtful tablet' })).toBeVisible();
});

test('@a11y Wave A: the Codex hub has no automated accessibility violations', async ({ page }) => {
  await page.goto('/maestros-secret.html');
  await page.evaluate(({ key, value }) => localStorage.setItem(key, JSON.stringify(value)), {
    key: saveKey,
    value: { version: 2, savedAt: '2026-08-01T12:00:00+02:00', state: { scene: 'cellar', inv: [], selected: null, flags, secrets, dialogue: { choices: { matteo: null, baker: 'compassion' }, ending: 'light' }, notes }, run }
  });
  await page.reload();
  await page.getByRole('button', { name: 'Continue Chronicle' }).click();
  await page.getByRole('button', { name: 'Enter the Codex Rationum' }).click();
  expect((await new AxeBuilder({ page }).include('#expedition').analyze()).violations).toEqual([]);
});
