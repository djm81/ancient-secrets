# TDD evidence — proof-of-excellence-pass

## Governance adoption note

The OpenSpec artifacts and this evidence file were added on **2026-07-13 (Europe/Berlin)** after an initial implementation scaffold had been started. That scaffold is **not** accepted as evidence for any requirement. From this point, each behavior change must follow the sequence below and link its proof here and in `validation.md`.

## Evidence template

### `<requirement or scenario id>`

- **Specification:** link to the exact scenario.
- **Test added:** test file and test name.
- **Failing evidence:** timestamp, command, result summary.
- **Implementation:** paths changed.
- **Passing evidence:** timestamp, command, result summary.
- **Manual evidence:** only when a browser, visual, audio, or assistive-technology observation is necessary.

## Current status

The original pass and the review-remediation follow-up have local evidence recorded below. Production WAF and remote-CI observations remain deployment evidence, not substitutes for the automated tests.

## Requirement-to-evidence register

| Requirement | Scenario source | Required evidence | Status |
| --- | --- | --- | --- |
| PE-001 | `portfolio-experience/spec.md` — published root URL | Browser test + desktop/mobile review | Local evidence recorded |
| PE-002 | `portfolio-experience/spec.md` — new chronicle begins | Unit test + manual state review | Local evidence recorded |
| BG-001–BG-005 | `bounded-guidance/spec.md` | Unit, Worker, client/browser tests; deployed rate-limit check | Local evidence recorded; WAF pending |
| GC-001–GC-002 | `game-continuity/spec.md` | Unit and browser save/recovery tests | Local evidence recorded |
| EQ-001–EQ-002 | `experience-quality/spec.md` | Keyboard/browser checks and assistive-technology/manual checks | Local evidence recorded |
| QA-001 | `validation.md` | Passing CI run after all relevant checks | Local evidence recorded; remote CI pending |

## Failing baseline

### PE-001, PE-002, GC-001, GC-002, EQ-001, EQ-002, BG-002

- **Specification:** the corresponding scenarios in `specs/`.
- **Tests added:** `tests/portfolio-and-game-contract.test.js`, `tests/game-core.test.js`, and `tests/worker.test.js`.
- **Failing evidence:** `2026-07-13T22:36:24+0200`, `npm test -- --test-reporter=dot` — 6 passed, 7 failed.
- **Failure summary:** the root page still redirects; the game has no objective/guide/save/accessibility contracts; duplicate inventory saves are accepted; the Worker accepts unknown scene/item IDs and a body larger than 4 KiB without a `Content-Length` header.
- **Implementation:** pending.
- **Passing evidence:** `2026-07-13T22:45:35+0200`, `npm run check && npm test -- --test-reporter=dot && openspec validate proof-of-excellence-pass --strict && git diff --check` — syntax checks passed, 16/16 tests passed, OpenSpec strict validation passed, and no whitespace errors were reported.

## Passing implementation summary

- **PE-001/PE-002:** `index.html` is now an accessible portfolio landing page; `maestros-secret.html` shows the current objective and visible Guidance entry point.
- **GC-001/GC-002:** `js/game-core.js` validates versioned chronicle state; the game persists/resumes valid runs and discards invalid saves.
- **BG-001–BG-005:** `js/guidance-client.js` and `workers/maestro-guide.js` enforce fixed tiers, whitelisted payloads, 4 KiB request limits, response validation, local fallback, and per-isolate 429 protection. Production WAF configuration remains a deployment task.
- **EQ-001/EQ-002:** the game gives all 33 hotspots button semantics, adds visible focus, high contrast, live feedback, modal accessibility state, and keeps reduced-motion support.
- **Manual browser evidence:** on 2026-07-13 (Europe/Berlin), the local landing page was inspected at desktop and 390 × 844 mobile width with no horizontal overflow; authored fallback guidance left scene/inventory unchanged; contrast toggled; and a refresh restored the acquired mirror and inventory state.

## Review-remediation failing baseline

### GC-001/GC-002, BG-005, EQ-001/EQ-002, QA-001

- **Specification:** the refresh-transition, storage-unavailable, AI safety-binding, and browser-quality scenarios added on 2026-07-13.
- **Tests to add:** atomic-state unit tests, safe-storage unit tests, Worker configuration tests, Playwright interaction tests, and axe scans.
- **Failing evidence:** `2026-07-13T23:18:02+0200`, `npm test -- --test-reporter=dot` — 11 passed, 4 failed: missing atomic reward exports and safe-storage adapter, AI-enabled Worker did not fail closed, and the platform limiter was not consulted. `npm run test:browser` then failed because the declared Playwright command was not installed.
- **Implementation:** `js/game-core.js`, `js/browser-storage.js`, `maestros-secret.html`, `workers/maestro-guide.js`, `wrangler.toml`, Playwright/axe tests, and the Pages workflow.
- **Passing evidence:** `2026-07-13T23:33:22+0200`, `npm run check`, `npm test -- --test-reporter=dot`, `npm run test:browser`, and `npm run test:a11y` — syntax checks passed; 20/20 Node tests, 6/6 browser scenarios, and the standalone axe scan passed. `openspec validate proof-of-excellence-pass --strict`, `git diff --check`, and the client-secret scan also passed.
- **Manual evidence:** desktop and 390 × 844 local screenshots were inspected on 2026-07-13 (Europe/Berlin); the title screen is readable at both sizes and no visual regression was observed.
