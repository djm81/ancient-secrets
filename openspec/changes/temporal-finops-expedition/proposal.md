# Change: The Codex Rationum — a time-travel FinOps learning expedition

## Why

The game currently ends when the player uncovers the trapdoor and meets the Maestro. That ending is a beginning we never use. Leonardo da Vinci historically collaborated with Luca Pacioli — the Franciscan friar who codified double-entry bookkeeping in *Summa de Arithmetica* (1494) and whose *Divina Proportione* Leonardo illustrated. This gives the game an authentic, unexploited bridge between Renaissance craft and the modern FinOps discipline (finops.org/framework).

No existing game teaches FinOps — the operating model of Inform, Optimize, Operate; the domains of understanding cost, quantifying value, optimizing usage, and managing the practice — by translating it back into the financial operations real civilizations actually ran: Babylonian temple ledgers, Egyptian grain forecasting, Athenian tribute allocation, Roman tax-farming commitments, Templar letters of credit, and Medici double-entry books. The expedition makes the player *practice* each discipline with the materials, arithmetic, and constraints of its era, then debrief with Leonardo, who names what the player understood, what they missed, and how the same discipline reappears in every age including ours.

## Story premise

After the current game is solved, the Maestro reveals the **Codex Rationum** — a ledger-codex he and Fra Luca Pacioli assembled, now missing seven folios, each folio bound to a civilization's way of governing money and resources. The folios are evidence in one larger question: whether clever systems serve people or merely make exploitation more efficient. Leonardo's **Occhio del Tempo** (a camera-obscura-and-perspectograph device in the workshop) lets the player step into each era, earn the folio by passing that culture's financial trial, and return. Each recovered folio causes Leonardo to uncover one of his hidden inventions in the downstairs workshop, gradually transforming the room into a gallery of secrets. A **Ledger of Mastery** tracks the player's grasp of each FinOps domain and awards a maturity rank.

## What changes

- Add a post-victory **workshop hub**: the Maestro's downstairs room becomes an explorable scene with the Codex Rationum, the Occhio del Tempo era-selection device, the Ledger of Mastery, and seven concealed invention alcoves.
- Structure the expedition as a **three-act mystery**: players choose within each act, but inventions and Codex evidence unlock the next act. The final folio resolves the apprentice's question of what they will build with the Codex's knowledge.
- Add a data-driven **era expedition engine** and seven authored eras (Babylon, Egypt, Athens, Rome, Champagne Fairs/Templars, Florence 1494, and "The Age to Come"), each with an explorable scene, an era mentor, clue artifacts, and one deterministic financial trial built from that era's real instruments.
- Add a **withdraw ("escape") path** from any trial: the player may leave unfinished, return to Leonardo, and receive an authored explanation of what was missed before retrying.
- Add the **Maestro's debrief**: after every trial (passed or withdrawn), an interactive dialogue in which Leonardo asks fixed multiple-choice questions mapping the era's practice to the general discipline, with authored explanations for every answer.
- Add an **era art direction**: every era ships a small set of realistic, painterly scene images unique to its civilization (backdrop, mentor portrait, trial tableau), generated during authoring with an image-generation skill and committed as optimized static assets. All era interaction reuses the established dialogue-panel pattern — fixed multiple-choice options rendered over the era imagery — so the expedition looks continuous with the base game.
- Add the **Ledger of Mastery**: per-domain scores across the four FinOps domains and an overall maturity rank (Garzone / Discepolo / Maestro dei Conti, mirroring Crawl / Walk / Run).
- Add **invention reveals**: each completed era permanently uncovers one Da Vinci invention in the workshop hub.
- Introduce the ordered save-migration registry with expedition progress, mastery scores, and revealed inventions; valid version 1 and version 2 saves migrate losslessly, and later additive save changes preserve the expedition block.
- Optionally extend the existing bounded guidance Worker with era-aware hint context; authored fallback hints remain the required path.

## Capabilities

- **temporal-hub** — the post-victory workshop hub, era selection through interactive dialogue, and persistent invention reveals.
- **era-expeditions** — the data-driven era engine, the seven authored eras, their trials, and the withdraw path.
- **maestro-debrief** — post-trial dialogue, fixed multiple-choice questions, authored feedback for correct and incorrect answers.
- **finops-mastery-rank** — per-domain scoring, maturity ranks, and the Ledger of Mastery surface.
- **expedition-continuity** — ordered save migration, migration of older saves, and mid-expedition resume.

## Impact

- Affected runtime: `maestros-secret.html` (new hub and era scenes), new browser modules under `js/` (`expedition-core.js`, `era-content.js` or equivalent), existing `game-core.js` (save version bump and migration), optional `workers/` guidance context extension.
- Depends on `responsive-investigative-surface` and `installable-offline-web-app`; Babylon is the first implementation vertical slice and must pass their viewport/offline evidence before additional eras are added.
- New static asset directory (e.g., `assets/eras/`) holding the authored era imagery in a modern compressed format with authored alt text, subject to the payload budget in the design.
- `openspec/project.md` must be amended: the "do not add scenes" constraint was scoped to the proof-of-excellence change and is explicitly superseded here by an authored, bounded content expansion. The other non-negotiables (static-first, no secrets or personal data in the browser, AI never required) are unchanged and binding on this change.
- Documentation: README gains the expedition overview, the FinOps-framework attribution, and the updated manual QA checklist.
- No new public network interface is required. The existing `POST /api/maestro-guide` contract may gain an optional era field; the endpoint remains optional.

## Constraints

- Static-first: every era, trial, debrief, hint, and reveal is authored content shipped with the site; the game is fully completable with the Worker absent.
- All dialogue is fixed-choice; no free-text player input anywhere, preserving the existing privacy boundary.
- Trials are deterministic given their seed (same pattern as the existing gear run), so behavior is unit-testable without a browser.
- Every era follows an authored investigate → hypothesize → test → consequence loop: 2–4 clues establish the trial, the player makes a bounded plan through click/tap controls, and the scene/mentor visibly reacts before the debrief explains the modern parallel.
- Historical framing must stay honest: era mechanics are grounded in documented instruments (Hammurabi's interest caps, nilometer-based assessment, Athenian liturgies, Roman publicani contracts, Templar letters of credit, Pacioli's double-entry method). "The Age to Come" is clearly framed as Leonardo's speculation.
- FinOps Framework terminology (phases, domains, capabilities, maturity) follows finops.org and is credited; the game teaches the discipline without cloud-specific mechanics until the final era's look-forward.
- Era imagery is produced at authoring time and shipped as static assets; no runtime image generation, no external image CDN, and the total era image payload stays within the authored budget so GitHub Pages performance is preserved.
- Keyboard operability, visible focus, reduced motion, high contrast, and announced feedback apply to every new surface, including dialogue panels rendered over imagery.

## Rollback

- The expedition is reachable only from the post-victory hub; removing the hub entry point restores the previous complete experience with no dangling references.
- The expedition save shape is additive; the ordered migration registry retains existing paths, and a save from a later schema encountered by rolled-back code is discarded safely rather than partially restored.
- The optional era field in guidance requests is additive; the Worker and fallback both function if it is never sent.

## Out of scope

- Accounts, telemetry, leaderboards beyond the local Ledger of Mastery, multiplayer, free-text chat, procedurally generated or AI-generated content in the shipped payload, monetization, and any claim of formal FinOps certification.
