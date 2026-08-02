import { test, expect } from '@playwright/test';

test('OGS-001/002: the registered shell contains the core assets and emits no console errors', async ({ page }) => {
  const consoleErrors = [];
  const pageErrors = [];
  page.on('console', message => {
    if (message.type() === 'error') consoleErrors.push(message.text());
  });
  page.on('pageerror', error => pageErrors.push(error.message));

  await page.goto('/maestros-secret.html');
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload();
  const pwaState = await page.evaluate(async () => {
    const registration = await navigator.serviceWorker.getRegistration();
    const cacheNames = await caches.keys();
    const entries = await Promise.all(cacheNames.map(async cacheName => {
      const cache = await caches.open(cacheName);
      return (await cache.keys()).map(request => new URL(request.url).pathname);
    }));
    return {
      controller: Boolean(navigator.serviceWorker.controller),
      active: registration?.active?.state,
      cacheNames,
      entries,
    };
  });

  expect(pwaState.controller).toBe(true);
  expect(pwaState.active).toBe('activated');
  expect(pwaState.cacheNames).toContain('maestros-secret-shell-v15');
  expect(pwaState.entries.flat()).toContain('/maestros-secret.html');
  expect(consoleErrors).toEqual([]);
  expect(pageErrors).toEqual([]);
});

test('OGS-001: a cached chronicle resumes and authored guidance remains available offline', async ({ page, context }) => {
  await page.goto('/maestros-secret.html');
  await page.getByRole('button', { name: 'Begin the Adventure' }).click();
  await page.getByRole('button', { name: 'Begin Exploring' }).click();
  await page.getByRole('button', { name: 'Show Casebook' }).click();
  await page.locator('#portrait-actions .casebook-context [data-interaction-id="mirror"]').click();
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload();
  await context.setOffline(true);
  await page.reload();
  await page.getByRole('button', { name: 'Continue Chronicle' }).click();
  await expect(page.getByRole('button', { name: 'Select Hand Mirror' })).toBeVisible();
  await page.getByRole('button', { name: 'GUIDANCE' }).click();
  await expect(page.getByText(/authored guidance/i)).toBeVisible();
});

test('PWA-002: a browser without an install prompt keeps the full game playable without a misleading install action', async ({ page }) => {
  await page.goto('/maestros-secret.html');
  await expect(page.locator('#installbtn')).toBeHidden();
  await page.getByRole('button', { name: 'Begin the Adventure' }).click();
  await page.getByRole('button', { name: 'Begin Exploring' }).click();
  await expect(page.locator('#objective')).toContainText('Take the hand mirror');
});
