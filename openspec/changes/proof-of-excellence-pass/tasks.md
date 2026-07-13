# Implementation tasks

## 1. Change foundation

- [x] Create this OpenSpec change, requirements, and evidence matrix.
- [x] Add lightweight repository governance and OpenSpec generation rules.

## 2. Tests and failing evidence

- [x] Map every `PE`, `BG`, `GC`, and `EQ` scenario in `TDD_EVIDENCE.md` to an automated test or a named manual check.
- [x] Write pure-logic tests for randomized runs, progress, save parsing, corrupted saves, guidance tiers, client response validation, and Worker HTTP 400/413/429 behavior.
- [x] Add browser-facing contract tests for the root CTA, save/resume, fallback guidance, and preference/live-region behavior; record local browser QA for visual/interactive flows.
- [x] Run the scenario tests before integration and record dated failing evidence for the original unimplemented behaviors.

## 3. Implementation

- [x] Create pure state, randomized-run, progress, save/load, and guidance-validation modules.
- [x] Migrate the game runtime to the pure modules without changing existing puzzle routes or completion conditions.

## 4. Portfolio and continuity

- [x] Replace the root redirect with an accessible portfolio landing page and a direct game CTA labelled with the target duration.
- [x] Add versioned local save/resume, explicit reset, corrupted-save recovery, and a title-screen Continue control only when a valid save exists.
- [x] Add the current chapter/objective strip and an idle-accessible guidance entry point.

## 5. Bounded AI guidance

- [x] Add three fixed guidance actions and client-side response validation/fallback.
- [x] Add the Worker endpoint, input validation, 4 KiB limit, same-action schema constraint, response word limit, and server-only provider secret usage.
- [x] Add deployment documentation for Worker secrets, allowed origin, rate limiting, and rollback.

## 6. Accessibility and quality

- [x] Make all hotspots, navigation, modal controls, inventory slots, music, guidance, and contrast controls keyboard-operable with visible focus and meaningful labels.
- [x] Add high-contrast mode, reduced-motion coverage, and a polite live region for state-changing feedback.
- [x] Add CI gates for syntax and unit/browser-facing contract checks before the Pages build; execute the evidence checklist below.

## 7. Passing evidence, documentation, and review

- [x] Record dated passing-test evidence against every implemented requirement in `TDD_EVIDENCE.md`.
- [x] Update README with architecture, threat boundaries, local/deployment setup, test commands, limits, and manual QA checklist.
- [ ] Replace all `Pending` validation entries with links, command output, or reviewer observations before merge.

## 8. Review-remediation follow-up

- [x] Add failing unit and browser coverage for refreshes during critical reward transitions and unavailable browser storage.
- [x] Commit critical puzzle state before cosmetic delayed animation; keep optional curiosities asynchronous only.
- [x] Replace isolate-local Worker limiting with the configured Cloudflare rate-limit binding; fail closed for AI-enabled misconfiguration.
- [x] Add Playwright and axe checks to CI, then update validation and evidence status from their recorded output.
