# Tasks: temporal-finops-expedition

Ordering follows the repository discipline: spec → tests → failing evidence → implementation → passing evidence → quality gates → docs. Each task targets roughly two hours; each wave leaves the site shippable.

## Wave A — vertical slice (schema, hub, engine, Babylon)

- [ ] A1. Confirm specs in this change are accepted; record any scope adjustments back into proposal/design before coding.
- [ ] A2. Write failing unit tests for save v3: `createSave` embeds expedition, `parseSave` accepts v3, migrates valid v1 and v2 saves (EC-002), degrades malformed expedition blocks (EC-003). Record failing evidence.
- [ ] A3. Implement `SAVE_VERSION = 3`, chained migration, and expedition-block validation in `game-core.js`; record passing evidence.
- [ ] A4. Write failing unit tests for `expedition-core.js`: era status machine, withdraw semantics (EE-003), mastery deltas and rank derivation purity (MD-004, FM-001, FM-002), retry-never-demotes (FM-002).
- [ ] A5. Implement `expedition-core.js`; record passing evidence.
- [ ] A6. Author `era-content.js` structure and the complete Babylon era: scene graph, mentor, three clues, ledger trial tables, failure-category explanations, three debrief questions with per-option feedback, hint tiers.
- [ ] A6b. Write the Babylon art briefs, generate and curate the three era images (backdrop, mentor portrait, trial tableau) via the image-generation skill, optimize into `assets/eras/babylon/` with alt text, and add the automated payload-budget check (EE-006).
- [ ] A7. Write failing tests for the Babylon trial: deterministic generation and evaluation, solvability across the tested seed range (EE-002), failure-category selection (EE-003).
- [ ] A8. Implement Babylon trial generation/evaluation; record passing evidence.
- [ ] A9. Build the workshop hub scene in `maestros-secret.html`: post-victory entry (TH-001), Occhio del Tempo era dialogue with statuses (TH-002), first invention alcove and reveal (TH-003), keyboard/reduced-motion/announcement behavior (TH-004).
- [ ] A10. Build the era scene/trial/debrief UI shell — dialogue panels with multiple-choice options over era imagery, scrim and high-contrast solid background, lazy loading — and wire Babylon end-to-end including withdraw and debrief (MD-001, MD-002, EE-005, EE-006).
- [ ] A11. Run gates (`npm run check`, `npm test`, `git diff --check`) plus manual scenarios for TH-001..004, EE-003, EE-005, MD-001..002 at desktop and narrow widths; record in validation.md.

## Wave B — antiquity eras

- [ ] B1. Author Egypt content (nilometer forecasting/budgeting trial) + failing trial tests → implement → passing evidence (EE-001, EE-002).
- [ ] B2. Author Athens content (tribute allocation, liturgies, cost-per-trireme) + tests → implement → evidence.
- [ ] B3. Author Rome content (farmed-contract commitment choice, publicani audit) + tests → implement → evidence.
- [ ] B4. Write art briefs and generate/curate/optimize the image sets for Egypt, Athens, and Rome with alt text; keep the payload-budget check green (EE-006).
- [ ] B5. Verify domain tagging for eras 1–4 matches the design mapping table (FM-001); update Ledger data; run gates and record manual era walkthrough evidence.

## Wave C — toward the Codex

- [ ] C1. Author Champagne Fairs content (letter-of-credit routing trial) + tests → implement → evidence.
- [ ] C2. Author Florence content (double-entry balancing, amortization, fraud entry; Pacioli as mentor) + tests → implement → evidence.
- [ ] C3. Author The Age to Come content (water-works variable-cost trial; explicit Inform/Optimize/Operate framing) + tests → implement → evidence.
- [ ] C4. Author and wire the closing Codex dialogue with framework attribution (MD-003); manual scenario evidence.
- [ ] C5. Write art briefs and generate/curate/optimize the image sets for Champagne, Florence, and The Age to Come with alt text; keep the payload-budget check green (EE-006).
- [ ] C6. Extend authored hint tiers for all eras through the existing guidance interface; if the Worker gains the optional era enum, add request-validation tests for unknown values (EE-004).

## Wave D — polish and proof

- [ ] D1. Build the Ledger of Mastery surface: per-domain progress, rank with Crawl/Walk/Run correspondence, per-era statuses, locality statement (FM-003); manual + persistence evidence.
- [ ] D2. Complete the invention gallery states, the all-seven completion state, and reduced-motion variants of reveals (TH-003, TH-004).
- [ ] D3. Verify no expedition data leaves the browser by inspecting guidance traffic during play (FM-003); record evidence.
- [ ] D3b. Final EE-006 pass: payload budget across all seven eras, alt-text completeness, dialogue contrast over imagery in default and high-contrast modes, reduced-motion backdrop behavior, unchanged base-game initial payload; record evidence.
- [ ] D4. Update README: expedition overview, era table, FinOps Foundation attribution, education-not-certification statement, updated manual QA checklist; amend `openspec/project.md` scene-constraint wording per the proposal's Impact section.
- [ ] D5. Full validation matrix pass: every requirement in the five specs mapped to automated or recorded manual evidence in validation.md; run all gates.
