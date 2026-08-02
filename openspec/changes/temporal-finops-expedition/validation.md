# Validation matrix: temporal-finops-expedition

Status: **pending** — populated per wave as evidence lands (see tasks.md). No implementation task may be marked complete while its row is pending.

| Requirement | Evidence type | Evidence | Status |
|---|---|---|---|
| TH-001 hub gated on victory | unit (state gate) + manual | — | pending |
| TH-002 fixed-choice era selection & statuses | unit (status machine) + manual | — | pending |
| TH-003 persistent invention reveals; gallery completion | unit (reveal set) + manual | — | pending |
| TH-004 hub experience quality | manual (keyboard, reduced motion, announcements) | — | pending |
| TH-005 three-act mystery and value-aware resolution | unit (act gate) + manual ending | — | pending |
| EE-001 seven authored offline eras | unit (content completeness) + manual offline run | — | pending |
| EE-002 deterministic, authentic, solvable trials | unit (seeded generation, solvability sweep) | — | pending |
| EE-003 withdraw semantics & failure categories | unit + manual | — | pending |
| EE-004 era hints via bounded guidance | unit (fallback, enum validation) + manual | — | pending |
| EE-005 era experience quality | manual | — | pending |
| EE-006 era visual identity, dialogue-over-imagery, payload budget | unit (budget check, alt-text completeness) + manual (contrast, reduced motion) | — | pending |
| EE-007 investigate → hypothesize → test → consequence loop | unit (plan/consequence state) + browser/manual | — | pending |
| MD-001 debrief after every outcome | unit (routing) + manual | — | pending |
| MD-002 fixed MCQ with per-option feedback | unit (bank stability) + manual | — | pending |
| MD-003 closing Codex dialogue & attribution | manual | — | pending |
| MD-004 deterministic mastery scoring | unit | — | pending |
| FM-001 per-domain mastery attribution | unit | — | pending |
| FM-002 rank derivation; retry never demotes | unit | — | pending |
| FM-003 honest local Ledger; no score egress | manual (UI + network inspection) | — | pending |
| EC-001 ordered schema migration; mid-expedition/mid-trial resume | unit + manual refresh scenarios | — | pending |
| EC-002 lossless v1/v2 migration | unit | — | pending |
| EC-003 expedition-block degradation | unit | — | pending |

## Manual scenario notes

Recorded here with date, browser, viewport (desktop + narrow), and observed behavior when each wave's manual checks run.

### Wave A implementation checkpoint — 2026-08-01

- Automated: `npm run check`, `npm test` (43/43), and `git diff --check` passed. Babylon’s seeded reconciliation is swept over 48 seeds; v1/v2 migration and malformed-expedition recovery are covered.
- Browser: `npm run test:browser` passed 47/47. A migrated post-victory save entered the Codex, collected all three Babylon clues, selected the 90-gur reconciliation and 20-per-100 silver rate, and reached the visible storehouse consequence. `npm run test:a11y` passed 4/4, including the Codex hub.
- Asset budget: Babylon images total 393 KiB; individual assets are 108 KiB, 106 KiB, and 179 KiB. The initial game payload does not reference any era image; those assets are only requested when the Codex opens.
- Manual visual inspection: Playwright Chromium at 1280 × 800 and 390 × 844 showed an unclipped, readable Codex hero, clear Babylon call-to-action, single-column narrow cards, and no title-screen overlay after the existing fade completed. High-contrast and reduced-motion behavior have automated coverage; real device/offline confirmation remains required.
- Follow-up visual repair: 2026-08-01 — the Florence ending action row now uses a wrapping flex group with a 10 px gap, preventing the “Enter the Codex Rationum” and “Begin Another Chronicle” buttons from touching at narrow widths.
- Follow-up interaction repair: 2026-08-01 — **Return to the Study** now closes Leonardo’s terminal dialog while Escape retains the focused, safe terminal-dialogue flow. The selected ending remains unchanged until the player makes a choice.
- Follow-up historical art review: 2026-08-01 — the reconciliation tableau was visually re-reviewed after replacement. It now shows a hollow wedge-cut reed stylus and an open oil lamp; the modern-looking pen/pencil, candle, and shiny ink-like vessel are absent. The replacement is 179 KiB and remains under the per-image budget.
- Follow-up hub return repair: 2026-08-02 — Playwright resumed a completed chronicle, entered the Codex, and chose **Return to the story conclusion**. The completed-story modal returned with its Codex entry point; the terminal Maestro scene was not exposed as a dead end. The versioned offline shell check passed with `maestros-secret-shell-v6`.
- Follow-up terminal-dialogue repair: 2026-08-02 — Playwright opened Leonardo’s final dialogue and confirmed **Return to the Study** was absent, while Escape retained the focused dialogue and did not select an ending. The versioned offline shell check passed with `maestros-secret-shell-v7`.
- Follow-up completed-era replay: 2026-08-02 — a completed Babylon save opened the Codex with **Revisit Babylon** and re-entered the investigation. The saved best credit, mastery, and anemometer reveal were preserved; the versioned shell advances to `maestros-secret-shell-v9`.
- Follow-up Babylon clue acknowledgement: 2026-08-02 — each collected clue changes to **Recorded in ledger** and an accessible status announces `1 of 3`, `2 of 3`, then `3 of 3` clues recorded. The reconciliation remains unavailable until all three are recorded; the versioned shell advances to `maestros-secret-shell-v10`.
- Follow-up stale-module repair: 2026-08-02 — **Revisit Babylon** had been receiving an older cached `expedition-core.js`, which still rejected completed eras. Revisioned application modules now use exact cache matching and exact precache entries; focused Playwright replay entered the Babylon investigation under `maestros-secret-shell-v11`.
- Follow-up evidence-led Babylon audit: 2026-08-02 — the reconciliation now carries a readable evidence ledger beside each step. Players first challenge the unsupported 100-gur damp-tablet claim, then correct the grain total from sealed deliveries, then apply the stele’s 20-per-100 public rule before sealing the entry. The focused Playwright route exercises the incorrect tablet decision and its explanation before completing the route. The versioned shell advances to `maestros-secret-shell-v12`.
- Follow-up feedback contrast repair: 2026-08-02 — the pale clue/audit feedback panel had inherited pale shell text, leaving its content visually blank. It now specifies dark ink on the pale panel; source, focused Babylon, and registered-shell checks passed. The versioned shell advances to `maestros-secret-shell-v13`.
- Follow-up debrief option order: 2026-08-02 — Babylon’s authored answer options now rotate deterministically from the attempt seed and question index; correct answers are no longer always first, while the question text and option-specific teaching feedback remain unchanged. Unit, focused Babylon, and offline-shell checks passed. The versioned shell advances to `maestros-secret-shell-v14`.
- Review follow-up: 2026-08-02 — Escape from the Codex now restores the completed-story conclusion rather than leaving the player in the inert cellar. A withdrawn Babylon retry retains all recorded clues, and wrong grain/rate selections persist their specific failure category so Leonardo’s withdrawal debrief explains the actual audit mistake. The authored failure lookup rejects inherited object keys. Focused Playwright coverage passed 3/3; the service-worker release advances to v15 in the associated offline-shell change.
- Security review follow-up: 2026-08-02 — a forged Babylon `<option>` value previously became an HTML control in reconciliation feedback. The focused Playwright regression first reproduced the injected control, then passed after the handler derived its value from the authored select index. The repaired page ships through the v16 offline release cache.
- Still required before Wave A can be declared fully validated: real-device and installed-app offline confirmation, plus the broader responsive-device evidence that remains outstanding in its own change.
