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
- **2026-07-29 passing evidence:** `node --test tests/offline-shell.test.js tests/save-recovery.test.js tests/era-packs.test.js` passed 5/5. `npx playwright test tests/browser/offline-app.spec.js` passed 3/3: it records no `console.error` or uncaught page errors, the active controller, and the versioned cache inventory before it performs online-to-offline resume and authored-guidance checks. Final regression: `npm run check` passed; `npm test` passed 34/34; `npm run test:browser` passed 44/44; `npm run test:a11y` passed 3/3; `openspec validate installable-offline-web-app --strict` passed; and `git diff --check` passed.
