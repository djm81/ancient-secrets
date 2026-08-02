# TDD evidence: temporal-finops-expedition

Discipline: spec → tests → **failing evidence** → implementation → **passing evidence**. Every entry records command, timestamp, expected failing result, and passing result. Justified exceptions (e.g., purely visual behavior) are noted explicitly and covered in validation.md manual scenarios instead.

Status: **Wave A in progress** — Babylon is the first vertical slice. Assumption recorded on 2026-08-01: this wave implements Babylon and the shared foundations it needs, while the remaining six eras stay unavailable until their later accepted waves.

## Entry template

```
### <task id> — <short description>
- Spec refs: <requirement ids>
- Test: <file / test name>
- Command: npm test [-- filter]
- Failing evidence: <timestamp> — <observed failure>
- Passing evidence: <timestamp> — <observed pass>
- Notes / exceptions: <if any>
```

## Entries

### Security review follow-up — never render Babylon select values as markup
- Spec refs: EE-002, EE-005, EE-007.
- Test: `tests/browser/expedition.spec.js` — hostile Babylon selection stays text.
- Command: `npm run test:browser -- tests/browser/expedition.spec.js --grep "hostile Babylon selection"`.
- Expected failing result: 2026-08-02 21:11 CEST — the new regression will add a forged `<button>` option to the grain select. The current handler reads its DOM `.value` and interpolates it into `trialFeedback`, so a same-ID control is created when the trial rerenders.
- Implementation reference: derive selections from the authored option index and only render the corresponding static values.
- Passing evidence: 2026-08-02 21:12 CEST — the focused Playwright regression passed 1/1. The forged option produced no `#injected-control`; the reconciliation uses only the authored option at the selected index. Final regression at 21:15 CEST: `npm run test:browser` passed 53/53 and `npm run test:a11y` passed 4/4.

### Review follow-up — prove the completed conclusion survives every Codex exit
- Spec refs: TH-001, TH-004.
- Tests: `tests/browser/expedition.spec.js` — explicit return and Escape from the Codex.
- Command: `npm run test:browser -- tests/browser/expedition.spec.js --grep "completed-story conclusion"`.
- Expected failing result / justified exception: 2026-08-02 20:32 CEST — this is a coverage-only review follow-up: the production route already restores the ending modal, so no production behavior is expected to fail. The prior tests were insufficient because they asserted only modal/button visibility, not the selected ending’s content.
- Implementation reference: strengthen both flows to assert the stable `Florence’s Light` ending title after returning from the Codex.
- Passing evidence: 2026-08-02 20:33 CEST — the focused Playwright regression passed 2/2; explicit return and Escape both restored the visible `Florence’s Light` conclusion before exposing the Codex entry.

### Review follow-up — recoverable Codex exit and truthful Babylon withdrawal
- Spec refs: TH-001, EE-003, EE-007, MD-001, MD-002.
- Tests: `tests/browser/expedition.spec.js` and `tests/expedition-core.test.js`.
- Commands: `npm run test:browser -- tests/browser/expedition.spec.js --grep "review follow-up"` and `node --test tests/expedition-core.test.js`.
- Failing evidence: 2026-08-02 20:03 CEST — `node --test tests/expedition-core.test.js tests/offline-shell.test.js` failed because a withdrawn retry had `[]` clues and `constructor` returned an inherited function; focused Playwright failed 3/3 because Escape exposed no Codex entry and grain/rate withdrawals showed no category-specific debrief.
- Passing evidence: 2026-08-02 20:05 CEST — the focused browser regressions passed 3/3. The unit/offline suite passed 10/10: Escape restores the completed-story modal, the two rejected choices reach their authored debriefs, withdrawn clues survive retry, and inherited keys fall back to authored copy. Final regression at 20:08 CEST: `npm run test:browser` passed 52/52 and `npm run test:a11y` passed 4/4.
- Notes / exceptions: The route repair must preserve the existing completed-story modal rather than expose the terminal Maestro scene or discard the current expedition state.

### A2–A5 — migration registry and pure expedition state
- Spec refs: EC-001, EC-002, EC-003, EE-002, EE-003, FM-001, FM-002, MD-004
- Test: `tests/expedition-core.test.js`, `tests/game-core.test.js`
- Command: `node --test tests/expedition-core.test.js tests/game-core.test.js`
- Failing evidence: 2026-08-01 — `node --test tests/expedition-core.test.js tests/game-core.test.js` failed 1/7 because `js/expedition-core.js` did not exist; the six pre-existing game-core tests remained green.
- Passing evidence: 2026-08-01 — `node --test tests/expedition-core.test.js tests/game-core.test.js` passed 10/10 after the pure modules and v3 migration were added.
- Notes / exceptions: Babylon is the only authored era in Wave A; its deterministic trial is swept across a bounded seed range.

### A6–A10 — Babylon authored loop and local art
- Spec refs: TH-001, TH-002, TH-003, TH-004, EE-001, EE-005, EE-006, EE-007, MD-001, MD-002
- Test: `tests/temporal-finops-expedition.test.js`, `tests/browser/game.spec.js`
- Command: `node --test tests/temporal-finops-expedition.test.js` (then browser/manual evidence)
- Failing evidence: 2026-08-01 — `node --test tests/temporal-finops-expedition.test.js` failed because the Codex entry and expedition modal did not exist. The first browser run then exposed a clue-action parsing error that prevented the trial from unlocking.
- Passing evidence: 2026-08-01 — `node --test tests/temporal-finops-expedition.test.js` passed 1/1; the focused browser flow passed after the clue-action fix. Final regression: `npm run test:browser` 47/47 and `npm run test:a11y` 4/4.
- Notes / exceptions: Visual quality, contrast, reduced motion, and live-region behavior require recorded browser/manual evidence in `validation.md`.

### A6–A10 follow-up — separate ending actions
- Spec refs: TH-004, EE-005
- Test: `tests/temporal-finops-expedition.test.js`
- Command: `node --test tests/temporal-finops-expedition.test.js`
- Failing evidence: 2026-08-01 23:48 CEST — the test failed because the ending modal had no `end-actions` group; rendered buttons were contiguous (0 px vertical separation).
- Passing evidence: 2026-08-01 23:48 CEST — the test passed after the two ending actions were grouped in a flex container with a 10 px gap.
- Notes / exceptions: The shell cache was also advanced from v2 to v3 so an already-open offline client receives the repaired HTML after accepting the standard update prompt. The focused browser check initially failed with v2 present, then passed with v3.

### ID-001 follow-up — leave Leonardo's terminal dialogue
- Spec refs: `interactive-dialogue` ID-001, TH-004
- Test: `tests/browser/game.spec.js` — `ID-001: Leonardo’s terminal dialogue retains focus on Escape and can return to the study`
- Command: `npm run test:browser -- tests/browser/game.spec.js --grep "terminal dialogue retains"`
- Failing evidence: 2026-08-01 23:52 CEST — clicking **Return to the Study** left Leonardo's terminal dialogue visible; the authored hint was rendered behind it.
- Passing evidence: 2026-08-01 23:53 CEST — the dialog closes, Escape still retains the safe focus-trapped dialog, and the unchosen ending state remains unchanged.
- Notes / exceptions: The service-worker cache advances from v3 to v4 so open/offline clients can receive this UI repair through the standard update flow.

### A6b follow-up — historical reconciliation tableau
- Spec refs: EE-006
- Test: `tests/temporal-finops-expedition.test.js` plus visual asset review
- Command: `node --test tests/temporal-finops-expedition.test.js`
- Failing evidence: 2026-08-01 23:58 CEST — the manifest did not document the required open oil lamp, while visual review found a modern-looking pen/pencil and candle in the original tableau.
- Passing evidence: 2026-08-01 23:58 CEST — the test passed after the replacement tableau and manifest documented a cut-reed stylus and open oil lamp; the final JPEG is 179 KiB (under the 200 KiB budget).
- Notes / exceptions: This is a visual/historical curation repair. The British Museum documents both a cut reed for cuneiform and an Akkadian oil lamp with a wick, cited in the art manifest. The service-worker cache advances from v4 to v5 to deliver the corrected static asset.

### A10 follow-up — leave the workshop hub safely
- Spec refs: TH-001
- Test: `tests/browser/expedition.spec.js` — `the Codex return restores the completed-story conclusion`
- Command: `npm run test:browser -- tests/browser/expedition.spec.js --grep "Codex return restores"`
- Failing evidence: 2026-08-02 00:08 CEST — the focused browser test failed while the old `Return to Florence` action closed the Codex modal and exposed the terminal Maestro scene; the completed-story modal was not present.
- Passing evidence: 2026-08-02 00:10 CEST — focused browser regression passed; the repaired action restores the completed-story modal and its Codex entry point. Full regression at 00:11 CEST: `npm run test:browser` passed 48/48 and `npm run test:a11y` passed 4/4.
- Notes / exceptions: The fix restores the existing ending modal rather than inventing post-ending scene navigation. The service-worker cache advances from v5 to v6 so open/offline clients receive the repaired HTML through the standard update flow; its focused shell-cache check also passed at 00:10 CEST.

### FM-002 follow-up — revisit a completed era
- Spec refs: FM-002, TH-002
- Test: `tests/expedition-core.test.js` and `tests/browser/expedition.spec.js` — completed Babylon can be revisited
- Command: `node --test tests/expedition-core.test.js` (then focused browser evidence)
- Failing evidence: 2026-08-02 00:31 CEST — `node --test tests/expedition-core.test.js` failed because `beginEra` threw `That era cannot begin.` for a completed Babylon state while the hub offered an active entry control.
- Passing evidence: 2026-08-02 00:32 CEST — unit regression passed 3/3 and focused browser regression passed: a completed save presented **Revisit Babylon** and entered the investigation view.
- Notes / exceptions: Revisiting resets only the current attempt and clues; the highest recorded credit, mastery, and invention stay intact. The service-worker cache advances from v8 to v9 so open/offline clients receive the repaired HTML through the standard update flow.

### EE-007 follow-up — acknowledge every Babylon clue
- Spec refs: EE-005, EE-007
- Test: `tests/browser/expedition.spec.js` — Babylon vertical-slice investigation
- Command: `npm run test:browser -- tests/browser/expedition.spec.js --grep "vertical slice"`
- Failing evidence: 2026-08-02 00:35 CEST — failed as expected: the test could not locate the named Babylon clue-progress status after the first selection.
- Passing evidence: 2026-08-02 00:38 CEST — focused Playwright regression passed: each selection announced `1 of 3`, `2 of 3`, then `3 of 3` clues recorded; all three cards became **Recorded in ledger** before the reconciliation became available.
- Notes / exceptions: The trial remains locked until all three clues are recorded; this repair makes that existing state legible rather than changing the solution. The versioned shell advances from v9 to v10 so existing clients load the new feedback after the standard update flow.

### Historical cache checkpoint reconciliation — v7→v8 and v10→v11
- Scope: release-cache propagation only; the related gameplay fixes are covered by their own entries and tests.
- Historical record: v7→v8 delivered the era-selection repair preceding the v8→v9 completed-era replay entry. v10→v11 delivered exact revisioned module matching before the v11→v12 audit-flow entry.
- Evidence exception: neither transition retained a standalone pre-commit failing/passing command in this iterative local session. To avoid inventing evidence, these are explicitly historical release checkpoints rather than completed TDD entries.
- Current authoritative evidence: `openspec/changes/installable-offline-web-app/TDD_EVIDENCE.md` records the exact-match v11 checkpoint and the 2026-08-02 20:05 CEST v15 active-cache regression (10/10 combined unit/offline tests). New cache work must be evidenced there before implementation.

### EE-007 follow-up — teach the reconciliation as an audit
- Spec refs: EE-007
- Test: `tests/browser/expedition.spec.js` — Babylon vertical-slice investigation
- Command: `npm run test:browser -- tests/browser/expedition.spec.js --grep "vertical slice"`
- Failing evidence: 2026-08-02 00:49 CEST — failed as expected because the initial dropdown-only trial had no **Audit the doubtful tablet** stage.
- Passing evidence: 2026-08-02 00:52 CEST — focused Playwright flow passed: it displayed the evidence ledger, explained why accepting the 100-gur tablet was unsupported, then required the player to flag the anomaly, select 90 gur from the seals, apply 20 shekels per 100 from the stele, and explicitly seal the corrected entry.
- Notes / exceptions: The trial stays deterministic and uses the existing historical instruments; this is a learning-flow repair, not a new progression branch. The versioned shell advances from v11 to v12 so open clients receive the new UI after the standard update flow.

### EE-005 follow-up — readable expedition feedback
- Spec refs: EE-005
- Test: `tests/temporal-finops-expedition.test.js`
- Command: `node --test tests/temporal-finops-expedition.test.js`
- Failing evidence: 2026-08-02 00:55 CEST — failed as expected: no explicit dark text color was applied to the pale `trial-feedback` surface.
- Passing evidence: 2026-08-02 00:56 CEST — source contrast contract, focused Babylon flow, and registered-shell browser checks passed. Feedback now renders in dark ink (`#29190d`) on the pale panel.
- Notes / exceptions: This is a color-contrast repair; feedback wording and interaction behavior remain unchanged. The versioned shell advances from v12 to v13 so an open client receives the CSS repair through the standard update flow.

### MD-002 follow-up — non-patterned Babylon debrief choices
- Spec refs: MD-002, MD-004
- Test: `tests/expedition-core.test.js`
- Command: `node --test tests/expedition-core.test.js`
- Failing evidence: 2026-08-02 00:58 CEST — failed as expected because `orderBabylonDebriefOptions` did not exist and the source-order UI put Babylon’s correct answer first every time.
- Passing evidence: 2026-08-02 00:59 CEST — unit regression passed: a seed-0 Babylon debrief positions correct answers at indices 0, 2, and 1, repeats the same order for the same attempt, and changes predictably for another seed. The focused Babylon browser route and offline shell checks also passed.
- Notes / exceptions: Options remain authored fixed choices and their feedback remains attached; only presentation order varies deterministically by attempt seed and question index. The versioned shell advances from v13 to v14 so open clients receive the repair through the standard update flow.

### ID-001 follow-up — remove the terminal dead-end exit
- Spec refs: `interactive-dialogue` ID-001
- Test: `tests/browser/game.spec.js` — `ID-001: Leonardo’s terminal dialogue requires a finale choice`
- Command: `npm run test:browser -- tests/browser/game.spec.js --grep "requires a finale choice"`
- Failing evidence: 2026-08-02 00:18 CEST — focused browser regression failed because **Return to the Study** was rendered inside Leonardo’s terminal dialogue.
- Passing evidence: 2026-08-02 00:19 CEST — focused browser regression passed after the terminal control was hidden; Escape retained the dialogue and the unchosen ending state.
- Notes / exceptions: This is a terminal-flow repair: the existing Escape behavior still retains focus in the dialogue, while a completed ending continues to open the Codex entry point. The service-worker cache advances from v6 to v7 so open/offline clients receive the repaired HTML through the standard update flow.
