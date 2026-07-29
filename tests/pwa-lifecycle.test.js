import test from 'node:test';
import assert from 'node:assert/strict';
import { installGuidance, isInstalledApp, startOfflineAppLifecycle } from '../js/pwa-lifecycle.js';

test('PWA-002: desktop-class iPadOS receives Add to Home Screen guidance', () => {
  assert.equal(
    installGuidance('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15) Version/18.0 Safari/605.1.15', 'MacIntel', 5),
    'To install on iPhone or iPad, use Share, then Add to Home Screen.'
  );
});

test('PWA-002: installed display modes suppress installation guidance', () => {
  assert.equal(isInstalledApp({ standalone: true }, { matchMedia: () => ({ matches: false }) }), true);
  assert.equal(isInstalledApp({}, { matchMedia: () => ({ matches: true }) }), true);

  const installHelp = { hidden: true, textContent: '' };
  startOfflineAppLifecycle({
    windowRef: {
      navigator: { userAgent: 'iPhone', standalone: true },
      addEventListener: () => {},
      matchMedia: () => ({ matches: false })
    },
    documentRef: { getElementById: id => id === 'installhelp' ? installHelp : null }
  });
  assert.equal(installHelp.hidden, true);
  assert.equal(installHelp.textContent, '');
});
