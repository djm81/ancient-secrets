# Design: The Codex Rationum

## 1. Narrative architecture

### Frame story

Solving the current game admits the player to the Maestro's workshop. Leonardo shows the **Codex Rationum**, a ledger-codex he assembled with Fra Luca Pacioli (their collaboration is historical: Pacioli's *Summa de Arithmetica* of 1494 codified double-entry bookkeeping; Leonardo illustrated Pacioli's *Divina Proportione*). Seven folios are missing. Each folio records how one civilization mastered a piece of what we now call FinOps. The **Occhio del Tempo** — a fictional workshop device combining Leonardo's real camera obscura and perspectograph studies — projects the player into each era.

Loop per era:

1. **Choose** an era through fixed-choice dialogue with Leonardo from the currently unlocked act.
2. **Investigate** the era scene, meet the era mentor, and collect two to four clue artifacts that establish a bounded plan.
3. **Hypothesize and test** — choose and execute a deterministic plan using the era's real instruments; the scene and mentor visibly react. The player may **withdraw** at any point.
4. **Return & debrief** — Leonardo reviews the attempt, asks three fixed multiple-choice questions, and explains every answer, naming the timeless discipline behind the era's practice.
5. **Reveal** — a passed trial returns a folio; Leonardo uncovers one hidden invention in the workshop; the Ledger of Mastery updates and may unlock the next act.

### Three-act pacing

- **Act I — Seeing the ledger:** Babylon, Egypt, and Athens are available after the base-game victory. Completing any two opens Act II; the third remains available.
- **Act II — Bearing the cost:** Rome, Champagne Fairs, and Florence are available after Act I. Completing any two opens the final act; the remaining folios stay available.
- **Act III — Choosing the future:** The Age to Come becomes available after Act II. The final Codex dialogue requires all seven folios and reflects the apprentice's authored values (insight, compassion, ambition) plus the evidence they recovered.

Completing all seven folios reconstructs the Codex and unlocks a closing dialogue in which Leonardo reads the Codex forward — the explicit bridge to the modern FinOps Framework, credited to finops.org.

### The seven eras

Each era maps real, documented financial operations onto FinOps Framework domains and capabilities (finops.org/framework: domains *Understand Usage & Cost*, *Quantify Business Value*, *Optimize Usage & Cost*, *Manage the FinOps Practice*; phases *Inform → Optimize → Operate*).

| # | Era & mentor | Historical instruments | Trial | FinOps capabilities taught | Invention revealed |
|---|---|---|---|---|---|
| 1 | **Babylon, ~1750 BCE** — temple scribe of Esagila | Cuneiform grain/silver ledgers; Code of Hammurabi interest caps (silver 20%, grain 33⅓%) | Reconcile a temple grain ledger: match deliveries to entries, find the anomalous entry, and price two loans within the legal caps | Data Ingestion, Allocation, Anomaly Management; Governance/Policy (law-bound rates) | Anemometer |
| 2 | **Egypt, ~1300 BCE** — overseer of granaries | Nilometer flood readings; harvest tax assessment; multi-year grain reserves | Read three nilometer seasons, forecast the harvest, budget grain across granaries and a lean-year reserve | Planning & Estimating, Forecasting, Budgeting | Aerial screw |
| 3 | **Athens, ~447 BCE** — trapezites (banker) at the Delian treasury | League tribute; liturgies (trierarchy = a citizen funds a trireme); silver owls; public accounting steles | Allocate a season's tribute across fleet, Parthenon works, and festivals to meet stated goals; assign liturgies fairly; compute cost-per-trireme | Showback/Chargeback, Unit Economics, KPIs & Benchmarking, "business value drives decisions" | Ornithopter |
| 4 | **Rome, ~70 CE** — a censor auditing the publicani | Censoria locatio (five-year farmed tax contracts); publicani syndicates; denarius debasement | Choose between a committed five-year farmed contract and year-by-year direct collection under uncertain yields; then audit a publicanus ledger for overcharges | Rate Optimization, commitment-based discounts, Anomaly Management, Governance Policy & Risk, Invoicing & Chargeback | Self-propelled cart |
| 5 | **Champagne Fairs, ~1250 CE** — a Templar treasurer | Letters of credit; fair-cycle settlement; multi-currency exchange; road risk | Route a payment from Bruges to Genoa across fair stops: pick the path minimizing total fees and loss risk given exchange spreads and escort costs | Architecting & Workload Placement (routing cost), Rate Optimization, Invoicing & Chargeback, risk management | Giant crossbow |
| 6 | **Florence, 1494 CE** — Fra Luca Pacioli himself | Double-entry method from the *Summa*; Medici branch books; venture amortization | Balance a branch ledger with paired debits/credits, amortize a galley venture across voyages, and expose the one fraudulent entry the balance conceals | Reporting & Analytics, full Inform loop, Amortization/Allocation, FinOps Education & Enablement (Pacioli literally wrote the book) | Mechanical knight |
| 7 | **The Age to Come** — Leonardo speculating | Leonardo's canal and water studies as metaphor: rented millraces vs owned wheels, water meters, sluice budgets | Operate a water-works ledger where capacity is rented by the hour: meter usage, right-size the sluices, choose lease commitments, set an overflow alert | Variable cost model, Usage Optimization, Rate Optimization, Budgeting alerts, Inform/Optimize/Operate named explicitly | Ideal city model |

Era order is free; trial difficulty is self-contained. Era 7 is recommended last and framed as speculation, not history.

### Withdraw ("escape") path

Withdrawing from a trial is always available, never punished with lost progress: the player keeps collected clues, Leonardo explains the specific rule or concept the attempt missed (authored per failure category, not generic), and the trial can be retried with a fresh seed. Mastery credit for a withdrawn trial is reduced, not zeroed — mirroring the maturity model's premise that practices grow crawl → walk → run.

## 2. FinOps fidelity

- Framework mapping uses the current finops.org structure: six principles, three phases, four domains and their capabilities, core personas, Crawl/Walk/Run maturity. Era mentors personify personas (scribe = Practitioner, censor = Procurement, trapezites = Finance, Pacioli = Education/Enablement, Leonardo = Leadership).
- Debrief questions are the explicit translation layer: each asks "what was the timeless discipline here?" with era-language and modern-language options, so the player builds the mapping themselves.
- The Ledger of Mastery aggregates per-domain scores (four domains) from trial outcomes and debrief answers, and derives an overall rank: **Garzone** (Crawl), **Discepolo** (Walk), **Maestro dei Conti** (Run).
- Attribution: README and the closing dialogue credit the FinOps Foundation framework; the game claims education, not certification.

## 3. Technical architecture

### Modules (browser-safe pure ES modules, mirroring `game-core.js` discipline)

- `js/expedition-core.js` — expedition state machine: era status (`locked`/`available`/`in-progress`/`withdrawn`/`complete`), trial evaluation, mastery scoring, rank derivation, invention reveal set. Pure functions, seed-injectable randomness (`random = Math.random` parameter pattern already used by `createRun`).
- `js/era-content.js` — frozen authored data: era definitions, scene node graphs, clue texts, trial parameter tables, debrief question banks, failure-category explanations, invention descriptions. No logic.
- `js/game-core.js` — this first planned additive save change introduces the ordered migration registry; `createSave` embeds an `expedition` block; `parseSave` runs valid v1 and v2 saves through every migration step (`expedition: createInitialExpedition()`). Later additive changes register their own ordered steps and preserve the expedition block.
- `maestros-secret.html` — hub scene, era scenes, trial and debrief UI as additional inline-SVG scenes and dialogue panels in the existing house style.

### State & data flow

```
player input (fixed choices only)
  → expedition-core transitions (pure, deterministic per seed)
    → render (SVG scene + dialogue panel + announced feedback)
    → createSave(state, run, expedition) → localStorage (existing browser-storage.js)
```

Trials are parameterized from `era-content.js` tables plus a per-attempt seed, so every trial outcome is reproducible in Node's test runner without a browser. Debrief scoring is a pure fold over (trial outcome, answer choices).

### Trust boundaries & guidance

- No new network surface. The existing guidance client may include an optional `era` identifier in `summarizeForGuidance` output; the Worker treats it as an enum, validates it against the known era list, and ignores unknown values. Authored fallback hints per era ship in `era-content.js` and are the required path.
- No player free text exists anywhere in the expedition; the privacy posture of the base game is unchanged.

### Persistence & rollback

- The expedition migration adds `expedition: { eras: {...}, mastery: {...}, inventions: [...], codexComplete: bool }`. Migration from valid v1 and v2 saves is total and lossless, reusing the existing v1→v2 dialogue/notes migration. Later migrations preserve this block; rolled-back code rejects an unrecognised later schema safely rather than partially restoring it.
- Corrupted expedition blocks degrade to a fresh expedition without touching base-game progress.

### Accessibility

Every new scene and dialogue follows the standards already specified in `experience-quality`: full keyboard operation, visible focus, reduced-motion variants of the Occhio del Tempo transition and invention reveals, high-contrast support, and `aria-live` announcements for trial feedback, mastery changes, and reveals.

## 4. Art direction and asset pipeline

### Visual identity

- Each era carries a distinct, historically grounded palette and three realistic painterly images: a **scene backdrop** (the era location), a **mentor portrait**, and a **trial tableau** (the instruments of the trial — tablets, nilometer, steles, ledgers, fair stalls, water-works). The hub keeps the existing inline-SVG house style; era imagery begins the moment the Occhio del Tempo transition ends, making the style shift itself a storytelling device ("stepping into a painting").
- All interaction inside eras uses the established dialogue-panel pattern from the base game: fixed multiple-choice options in an accessible panel rendered **over** the era imagery (scrim/gradient behind text), never text baked into images.

### Authoring pipeline (build-time, never runtime)

- Images are generated during authoring with an image-generation skill from authored art briefs (one brief per image recorded alongside `era-content.js`: composition, period-accurate details, palette, mood). Generated candidates are curated by hand; the chosen image is optimized (modern compressed format, e.g. WebP/AVIF with fallback) and committed under `assets/eras/<era>/`.
- Historical review is part of curation: no anachronistic instruments, scripts, or architecture in the selected images.

### Budgets and accessibility

- Payload budget: **≤ 200 KB per image, ≤ 3.0 MB total** across all era imagery (compressed, largest served variant). Recorded here so EE-006 validation is deterministic.
- Every image ships authored alt text describing its content and role. Dialogue panels meet contrast requirements over any imagery via scrim; high-contrast mode swaps to a solid panel background. Reduced motion disables any parallax or slow-pan treatment of backdrops. Images lazy-load per era; the base game's initial payload is unchanged.

## 5. Smallest-architecture justification

No framework, no router, no build step is added. The expedition reuses the existing scene/dialogue rendering approach, the existing save/storage modules, and the existing guidance boundary. The only structural additions are two pure modules and one schema version — the minimum that keeps seven eras of content data-driven and unit-testable.

## 6. Delivery staging (mirrors tasks.md)

- **Wave A — vertical slice:** ordered save migration + hub + engine + Babylon end-to-end (investigate, plan, consequence, withdraw, debrief, mastery, reveal). Proves every mechanic once.
- **Wave B — antiquity:** Egypt, Athens, Rome.
- **Wave C — toward the Codex:** Champagne, Florence, The Age to Come, closing dialogue.
- **Wave D — polish & proof:** Ledger of Mastery surface polish, invention gallery states, README/attribution, full validation matrix.

Each wave lands behind the previous one's evidence; the game ships playable after every wave because eras are independently reachable.
