# TDD evidence: installable-offline-web-app

Status: **in progress** — A1 manifest and local-asset contract is implemented and evidenced; the remaining waves are pending.

For each task record: requirement IDs, test and command, dated failing evidence, implementation reference, dated passing evidence, and any justified manual-device exception.

## A1 — installable identity, direct launch, icons, and local font references

- **Requirements:** PWA-001.
- **Test and command:** `node --test tests/installable-offline-web-app.test.js`.
- **2026-07-29 failing result:** `node --test tests/installable-offline-web-app.test.js` failed 0/1 with `ENOENT` for `manifest.webmanifest`, confirming that the baseline has no installable identity asset. The contract also requires local 192px/512px maskable icons, a project-path-safe `start_url` for `maestros-secret.html`, manifest and Apple icon metadata on both entry pages, and no `fonts.googleapis.com` references.
- **Implementation reference:** `manifest.webmanifest`; `assets/icons/app-192.png`, `assets/icons/app-512.png`, and their checked-in SVG source; `assets/fonts/fonts.css` with the local Cinzel and EB Garamond files; manifest, Apple-icon, theme-color, safe-area viewport, and local-font references in `index.html` and `maestros-secret.html`.
- **2026-07-29 passing evidence:** `node --test tests/installable-offline-web-app.test.js` passed 1/1. `git diff --check` passed.
