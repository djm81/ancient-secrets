# The Maestro's Secret

A compact Renaissance point-and-click adventure set in Florence in 1503. You play Leonardo da Vinci's apprentice, following a trail of mirror writing, mechanisms, locked boxes, and hidden curiosities to find the missing Maestro. It is also a small, inspectable case study in static-first web-game and responsible AI product engineering.

[Play the game on GitHub Pages](https://djm81.github.io/ancient-secrets/)

## Highlights

- One self-contained HTML game: illustrated SVG scenes, responsive layout, inventory, dialogue, sound effects, and generative lute music. A local first-chronicle assistant introduces scene inspection, the satchel, and travel; portrait phones retain the complete scene and offer touch-sized scene-action controls. The first music notes are scheduled inside a direct player action; the music control explicitly reports starting, playing, or muted and retries safely after a temporary suspension.
- Replayable mysteries: every new chronicle randomizes the strongbox code, its Roman-numeral clue location, the Piazza gear route, and the Duomo bell sequence.
- A nested Il Duomo adventure: solve the vestibule's star-and-bell lock to reach the Whispering Gallery and its alternate clue path.
- Five optional curiosities reward close observation without blocking completion.
- Illustrated conversations with Brother Matteo, the baker, and Leonardo let players earn distinct, successful finale paths without turning the puzzle trail into a dead end.
- A reusable Field Notes folio records useful observations from every marked clue object; visible arrows always name a reachable scene.
- Versioned browser save/resume, keyboard-operable hotspots, high contrast, reduced-motion support, and announced interaction feedback.
- A bounded Maestro’s Guidance interface: fixed hint tiers with an authored fallback; optional AI wording never changes game state or blocks progression.

## Engineering choices

- **Static-first:** GitHub Pages hosts the complete game. Browser storage holds only the current chronicle; no account or analytics is required.
- **Bounded guidance:** the player chooses Nudge, Stronger Hint, or Reveal Next Step. The game sends no free text, identity, or save history. The Worker independently validates the whitelisted game summary and may only word the already-calculated next action.
- **Safe fallback:** if no Worker URL is configured—or the Worker, model provider, CORS policy, or rate limit fails—the game displays an authored hint and remains fully playable.
- **Evidence-led changes:** OpenSpec changes under [`openspec/changes/`](openspec/changes/) map requirements to tests and manual QA evidence. All accepted requirements are additionally captured as a [SpecFact requirements bundle](.specfact/projects/ancient-secrets/) (`specfact requirements validate --bundle .specfact/projects/ancient-secrets`) so evidence coverage is machine-checkable.

## Planned extension: The Codex Rationum

A proposed second act, specified in [`openspec/changes/temporal-finops-expedition/`](openspec/changes/temporal-finops-expedition/) and not yet implemented. After finding the Maestro, the player discovers the **Codex Rationum** — a ledger-codex Leonardo assembled with Fra Luca Pacioli, the father of double-entry bookkeeping (their collaboration is historical). Seven folios are missing, each bound to how one civilization ran its finances. Leonardo's **Occhio del Tempo** projects the player into each era to earn the folio back.

Each era is a self-contained expedition grounded in documented instruments of its time:

| Era | Trial | Timeless discipline |
|---|---|---|
| Babylon, ~1750 BCE | Reconcile a temple grain ledger; price loans within Hammurabi's interest caps | Cost visibility, allocation, anomaly detection |
| Egypt, ~1300 BCE | Forecast the harvest from nilometer readings; budget granaries and reserves | Planning, forecasting, budgeting |
| Athens, ~447 BCE | Allocate Delian tribute; assign liturgies; compute cost per trireme | Chargeback, unit economics, benchmarking |
| Rome, ~70 CE | Choose farmed tax contracts vs. direct collection; audit the publicani | Commitment discounts, rate optimization, governance |
| Champagne Fairs, ~1250 | Route a Templar letter of credit from Bruges to Genoa at least cost and risk | Placement, settlement, rate optimization |
| Florence, 1494 | Balance Medici books with Pacioli; expose the fraud the totals conceal | Reporting, the full Inform loop |
| The Age to Come | Operate Leonardo's metered water-works on rented capacity | The variable cost model, end to end |

Mechanics: explore each era's realistically illustrated scenes, learn from an era mentor, pass (or withdraw from and retry) a deterministic trial, then debrief with Leonardo through fixed multiple-choice dialogue that names what you understood and what you missed. Every recovered folio uncovers one of Leonardo's hidden inventions in the workshop, and a local **Ledger of Mastery** tracks understanding across the four FinOps domains toward a rank of Garzone, Discepolo, or Maestro dei Conti (mirroring the Crawl/Walk/Run maturity model).

The concept translates the [FinOps Framework](https://www.finops.org/framework/) (FinOps Foundation) into pre-cloud financial operations; it teaches the discipline's ideas and claims no certification. All content stays authored and static-first: era imagery is produced at authoring time under a strict payload budget, dialogue remains fixed-choice, and the expedition is fully playable without any AI service.

## Optional AI guidance deployment

The live guide is deliberately optional. By default, `js/runtime-config.js` contains an empty endpoint and the game uses authored guidance instantly.

1. Deploy `workers/maestro-guide.js` with Cloudflare Wrangler.
2. Add `OPENAI_API_KEY` as a Worker secret; never add it to repository files or `js/runtime-config.js`.
3. Set Worker `ALLOWED_ORIGIN` to the published GitHub Pages origin. `wrangler.toml` provisions a five-requests-per-minute Worker rate-limit binding; retain it (and use an account-unique `namespace_id`) and add a Cloudflare WAF rate-limit rule for `POST /api/maestro-guide` as a second edge boundary. The Worker fails closed if an AI key is present without its origin or rate-limit binding.
4. Set `MAESTRO_GUIDE_ENDPOINT` in `js/runtime-config.js` to the public Worker URL.

Rollback is immediate: clear that endpoint or disable the Worker. The static game and authored hints continue to work.

## Verify

Requires Node.js 22 or newer.

Install browser-test dependencies once with `npm ci`, then install the Chromium test browser with `npx playwright install chromium`.

```bash
npm run check
npm test
npm run test:browser
npm run test:a11y
openspec validate proof-of-excellence-pass --strict
```

Manual QA: open the root page at desktop and narrow/mobile widths; at 390 × 844 start a fresh chronicle, dismiss the first-chronicle assistant, then use the portrait action controls to take the mirror, navigate, and open the baker dialogue. Confirm a resumed chronicle does not show the assistant again. At a short 844 × 390 landscape viewport, confirm dialogue image and action controls stay visible and usable. Complete the mirror-to-note sequence with only Tab, Enter, and Space; enable high contrast; confirm sound after an explicit start or music-button activation (including on physical iOS release QA); and request each guidance tier with and without the Worker enabled.

## Point-and-click design

The game borrows the readable visual language of classic point-and-click adventures: hotspots identify objects worth examining, the satchel lets players select and apply items, and short contextual dialogue nudges rather than spells out solutions. Item puzzles have been adjusted for a small web game: their state is visible in the scene, wrong attempts are safe, and the main paths are compact enough for a short session.

Randomized routes add variety without making a run opaque. A player still learns the same core verbs—look, take, combine, and interpret clues—but the required order and the place that reveals the lock code can change.

### Dialogue and scene integrity

The game uses one declarative scene graph for Workshop, Piazza, Scriptorium, Duomo, Gallery, and Secret Study traversal. An arrow only appears when its destination is present and currently reachable; the Duomo’s gallery arrow appears after the bell lock opens. Every intentionally marked object is registered as a puzzle, reusable clue, curiosity, transition, or dialogue trigger. The Window, Easel, Candle, Candelabra, and Florence view add persistent Field Notes rather than one-off flavour text.

Two early conversations record one authored value—insight, compassion, or ambition. At the finale, the matching earned resolution is available. The puzzle trail never depends on the value chosen, and older valid version-1 saves migrate with empty dialogue and note data.

### AI-assisted art workflow

The three dialogue backdrops are local WebP files generated with Codex’s built-in image tool, manually reviewed, and documented in [`assets/dialogue/ART_MANIFEST.md`](assets/dialogue/ART_MANIFEST.md). Prompts prohibit imitation of named games, studios, artists, or existing compositions; the attached workshop reference influenced only warmth and lighting. This is an offline production workflow—not a runtime dependency—and the static game remains playable without AI services.

## Publish with GitHub Pages

The included workflow builds the repository with Jekyll and deploys it whenever `main` is pushed. In the repository’s **Settings → Pages**, choose **GitHub Actions** as the source once. The site root then launches the game automatically through `index.html`; no filename needs to be added to the URL.

To preview locally, open `index.html` in a browser. The root page now introduces the project before linking into the game.
