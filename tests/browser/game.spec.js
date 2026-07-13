import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const saveKey = 'maestros-secret:chronicle';
const run = { route: 'fresco', gearRoute: 'well', code: [1, 2, 3, 4], bellPattern: [0, 1, 2] };
const baseFlags = { mirrorTaken: false, noteRead: false, keyTaken: false, breadTaken: false, gearTaken: false, gearInstalled: false, trapdoorShown: false, chestOpen: false, lensTaken: false, cipherSeen: false, boxOpen: false, ornateTaken: false, catClicks: 0, wellUsed: false, duomoSolved: false, galleryVisited: false, bellSteps: [] };
const secrets = { cat: false, pigeon: false, well: false, spiral: false, redbook: false };

async function setChronicle(page, state) {
  await page.goto('/maestros-secret.html');
  await page.evaluate(({ key, value }) => localStorage.setItem(key, JSON.stringify(value)), { key: saveKey, value: { version: 1, savedAt: '2026-07-13T23:18:02+0200', state, run } });
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
  await page.getByRole('button', { name: 'CONTRAST' }).click();
  await page.reload();
  await expect(page.locator('body')).toHaveClass(/high-contrast/);
  await expect(page.locator('#titlescreen .vitr')).toHaveCSS('animation-name', 'none');
});

test('@a11y landing page and game title screen have no automated accessibility violations', async ({ page }) => {
  await page.goto('/');
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.goto('/maestros-secret.html');
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
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
