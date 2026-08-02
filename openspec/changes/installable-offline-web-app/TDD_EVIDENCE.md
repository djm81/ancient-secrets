# TDD evidence: installable-offline-web-app

Status: **in progress** — automated A1–B3 evidence is recorded; optional era packs have no authored assets yet, and physical-device installation evidence remains a release follow-up.

For each task record: requirement IDs, test and command, dated failing evidence, implementation reference, dated passing evidence, and any justified manual-device exception.

## A1 — installable identity, direct launch, icons, and local font references

- **Requirements:** PWA-001.
- **Test and command:** `node --test tests/installable-offline-web-app.test.js`.
- **2026-07-29 failing result:** `node --test tests/installable-offline-web-app.test.js` failed 0/1 with `ENOENT` for `manifest.webmanifest`, confirming that the baseline has no installable identity asset. The contract also requires local 192px/512px maskable icons, a project-path-safe `start_url` for `maestros-secret.html`, manifest and Apple icon metadata on both entry pages, and no `fonts.googleapis.com` references.
- **Implementation reference:** `manifest.webmanifest`; `assets/icons/app-192.png`, `assets/icons/app-512.png`, and their checked-in SVG source; `assets/fonts/fonts.css` with the local Cinzel and EB Garamond files; manifest, Apple-icon, theme-color, safe-area viewport, and local-font references in `index.html` and `maestros-secret.html`.
- **2026-07-29 passing evidence:** `node --test tests/installable-offline-web-app.test.js` passed 1/1. `git diff --check` passed.

## A2–C1 — offline shell, lifecycle, recovery, install guidance, and future-pack contract

- **Requirements:** OGS-001, OGS-002, OGS-003, OGS-004, OGS-005, and PWA-002.
- **Test and commands:** `node --test tests/offline-shell.test.js tests/save-recovery.test.js tests/era-packs.test.js` and `npx playwright test tests/browser/offline-app.spec.js`.
- **2026-07-29 expected failing result:** the baseline has no root service worker, lifecycle module, save import/export module, install-control UI, or offline-pack state machine. The new unit and browser contracts are expected to fail until those assets and page integration exist.
- **Implementation reference:** `service-worker.js`; `js/pwa-lifecycle.js`; `js/save-recovery.js`; `js/era-packs.js`; recovery and install/update UI in `maestros-secret.html`; unit contracts under `tests/*.test.js`; and browser contracts in `tests/browser/offline-app.spec.js`.
- **2026-07-29 passing evidence:** `node --test tests/offline-shell.test.js tests/save-recovery.test.js tests/era-packs.test.js` passed 5/5. `npx playwright test tests/browser/offline-app.spec.js` passed 3/3: it records no `console.error` or uncaught page errors, the active controller, and the versioned cache inventory before it performs online-to-offline resume and authored-guidance checks. Initial full-regression checkpoint: `npm run check` passed; `npm test` passed 34/34; `npm run test:browser` passed 44/44; `npm run test:a11y` passed 3/3; `openspec validate installable-offline-web-app --strict` passed; and `git diff --check` passed.
- **2026-07-29 CI regression correction:** GitHub Actions exposed that the original visual-hotspot click could be intercepted by the responsive Casebook rail. The test now activates the equivalent accessible Casebook mirror control. `npx playwright test tests/browser/offline-app.spec.js --repeat-each=5` passed 15/15, followed by the full gate chain above.

## Review follow-up — desktop-class iPadOS install guidance

- **Requirement:** PWA-002.
- **Test and command:** `node --test tests/pwa-lifecycle.test.js`.
- **2026-07-29 expected failing result:** the initial `installGuidance(userAgent)` implementation treats an iPadOS Safari desktop-class `Macintosh` user agent as macOS, even where `platform` is `MacIntel` and `maxTouchPoints` is greater than one; the regression test must fail until that touch-capable signature receives Add to Home Screen guidance.
- **2026-07-29 passing evidence:** `node --test tests/pwa-lifecycle.test.js` passed 1/1 after `installGuidance` began accepting platform and touch-point context. The full final gate chain passed again: `npm run check`; `npm test` 35/35; `npm run test:browser` 44/44; `npm run test:a11y` 3/3; strict OpenSpec validation; and `git diff --check`.
- **2026-07-29 expected failing result — installed app guidance:** the lifecycle lacks an installed-display-mode guard, so the added `isInstalledApp` regression test must fail until iOS `navigator.standalone` and the standards-based `display-mode: standalone` media query both suppress install instructions.
- **2026-07-29 passing evidence:** `node --test tests/pwa-lifecycle.test.js` passed 2/2 after the lifecycle guarded both installed-display signatures and left install-help text hidden for an installed launch. The full gate chain passed again: `npm run check`; `npm test` 36/36; `npm run test:browser` 44/44; `npm run test:a11y` 3/3; strict OpenSpec validation; and `git diff --check`.

## CodeRabbit follow-up — installable identity contract and evidence wording

- **Requirements:** PWA-001 and delivery evidence traceability.
- **Test and command:** `node --test tests/installable-offline-web-app.test.js`.
- **2026-07-29 baseline note:** the local font and icon assets already exist, so the strengthened positive contract is expected to pass immediately; this review fix closes a test-coverage gap rather than repairing a failing runtime behavior. The test now must verify readable manifest icon files and the local stylesheet link on both entry pages. Historical test totals are labeled as checkpoints rather than final results.
- **2026-07-29 passing evidence:** `node --test tests/installable-offline-web-app.test.js` passed with readable manifest icon assets and local font stylesheet assertions on both pages; the complete final gate chain is rerun before pushing.

## Review follow-up — multi-client update continuity

- **Requirement:** OGS-003.
- **Test and command:** `node --test tests/offline-shell.test.js tests/pwa-lifecycle.test.js`.
- **2026-07-29 expected failing result:** the current activation handler deletes every prior core cache and calls `clients.claim()`, which can switch other open chronicles to the new worker mid-session. The lifecycle also reloads only after `controllerchange`, so the new contract must fail until the restart request records its source client, activation retains prior caches without claiming clients, and the requesting client reloads after its own `UPDATE_READY` message.
- **Implementation reference:** `service-worker.js` stores the `SKIP_WAITING` sender client ID, retains old versioned caches, does not claim other controlled clients, and posts `UPDATE_READY` only to that sender after activation. `js/pwa-lifecycle.js` reloads only after the accepting client receives that message; its existing `controllerchange` handler remains a compatibility fallback.
- **2026-07-29 passing evidence:** `node --test tests/offline-shell.test.js tests/pwa-lifecycle.test.js` passed 6/6. The new worker-lifecycle simulation executes the service worker in an isolated runtime and proves no old cache deletion, no global client claim, one targeted notification, and one accepted update; the lifecycle test proves that no reload occurs before the target message. Full gates then passed: `npm run check`; `npm test` 38/38; `npm run test:browser` 45/45; `npm run test:a11y` 3/3; `git diff --check`; and `openspec validate installable-offline-web-app --strict`.

## Historical regression checkpoint — refreshed shells keep matching assets (v8/v9)

- **Requirement:** OGS-001, OGS-003.
- **Test and command:** `node --test tests/offline-shell.test.js`.
- **2026-08-02 expected failing result:** the current shell references unrevisioned module and era-art URLs, so a navigation URL with a new query can combine fresh HTML with stale cache-first JavaScript and imagery.
- **Implementation reference:** historical revisioned local URLs in `maestros-secret.html` and `js/era-content.js`; this checkpoint predated the later exact-match v11 and active-cache v15 contracts.
- **2026-08-02 passing evidence:** `node --test tests/offline-shell.test.js tests/pwa-lifecycle.test.js` passed 7/7. The Babylon browser flow passed 3/3, including sequentially studying all three clues, and the offline browser suite passed 3/3 with `maestros-secret-shell-v8`. Full regression then passed: `npm run test:browser` 48/48 and `npm run test:a11y` 4/4. The completed-era replay follow-up advances the shell to v9; its focused shell check passed at 00:32 CEST.

## Historical regression checkpoint — revisioned shell assets must not match an earlier query (v11)

- **Requirements:** OGS-001, OGS-003.
- **Test and command:** `node --test tests/offline-shell.test.js`.
- **2026-08-02 failing result:** `node --test tests/offline-shell.test.js` failed 3/4 as expected: it found unrevisioned core assets, the v10 registration URL, and query-insensitive static matching.
- **Implementation reference:** `service-worker.js` precaches the exact v11 module and v8 era-art request URLs, then matches static requests exactly; internal module imports in `js/game-core.js`, `js/expedition-core.js`, `js/save-recovery.js`, and `js/guidance-client.js` use the same v11 release revision.
- **2026-08-02 passing evidence:** `node --test tests/offline-shell.test.js tests/pwa-lifecycle.test.js` passed 7/7. The focused completed-era browser replay passed: **Revisit Babylon** opened **Three seals, one doubtful tablet** under the v11 shell. This is a historical checkpoint; the current release evidence is recorded below.

## Review follow-up — active cache owns offline navigation fallback

- **Requirements:** OGS-001, OGS-003.
- **Test and command:** `node --test tests/offline-shell.test.js`.
- **Failing evidence:** 2026-08-02 20:03 CEST — the new worker-runtime regression threw `global cache lookup can select an older release`; source checks also found the v14 registration/cache contract, confirming that a retained older cache could satisfy the navigation fallback.
- **Passing evidence:** 2026-08-02 20:05 CEST — `node --test tests/expedition-core.test.js tests/offline-shell.test.js` passed 10/10. The worker opens `maestros-secret-shell-v15` and uses only that cache for the navigation request and offline-game fallback; the registration and precached lifecycle module advance to v15 together. Final regression at 20:08 CEST: `npm run test:browser` passed 52/52 and `npm run test:a11y` passed 4/4.
- **Documentation scope:** exact revision matching applies to static modules/art; `ignoreSearch` is confined to the active-cache navigation fallback. The v8/v9/v11 records above are historical checkpoints, not current-release evidence.

## Review follow-up — execute the active-cache offline-game fallback

- **Requirements:** OGS-001, OGS-003.
- **Test and command:** `node --test tests/offline-shell.test.js`.
- **Expected failing result / justified exception:** 2026-08-02 20:32 CEST — this is a test-only coverage repair. The worker already calls `cache.match(offlineGame())`; the existing mock returned the shell on its first lookup, so the fallback branch was not exercised. No production behavior is expected to fail.
- **Implementation reference:** make the first active-cache lookup miss, return the shell only for the exact `offlineGame()` URL, and assert both calls and their distinct options.
- **Passing evidence:** 2026-08-02 20:33 CEST — `node --test tests/offline-shell.test.js` passed 5/5. The simulation recorded a query-insensitive request miss, then an exact offline-game lookup without `ignoreSearch`, returning the active shell.

## Security review follow-up — propagate the Babylon DOM-XSS repair offline

- **Requirements:** OGS-001, OGS-003.
- **Test and command:** `node --test tests/offline-shell.test.js`.
- **Expected failing result:** 2026-08-02 21:12 CEST — the strengthened release contract will require cache and lifecycle revision v16. The current v15 shell would retain the prior `maestros-secret.html` while offline.
- **Implementation reference:** advance the service-worker cache and registration revision together so a standard update precaches the repaired HTML.
- **Passing evidence:** 2026-08-02 21:13 CEST — `node --test tests/offline-shell.test.js` passed 5/5. The worker opens `maestros-secret-shell-v16`, and the HTML imports and lifecycle registration both use v16. Final regression at 21:15 CEST: `npm run check` passed, `npm test` passed 47/47, and `npm run test:browser` passed 53/53.
