# The Maestro's Secret

A compact Renaissance point-and-click adventure set in Florence in 1503. You play Leonardo da Vinci's apprentice, following a trail of mirror writing, mechanisms, locked boxes, and hidden curiosities to find the missing Maestro. It is also a small, inspectable case study in static-first web-game and responsible AI product engineering.

[Play the game on GitHub Pages](https://djm81.github.io/ancient-secrets/)

## Highlights

- One self-contained HTML game: illustrated SVG scenes, responsive layout, inventory, dialogue, sound effects, and generative lute music.
- Replayable mysteries: every new chronicle randomizes the strongbox code, its Roman-numeral clue location, the Piazza gear route, and the Duomo bell sequence.
- A nested Il Duomo adventure: solve the vestibule's star-and-bell lock to reach the Whispering Gallery and its alternate clue path.
- Five optional curiosities reward close observation without blocking completion.
- Versioned browser save/resume, keyboard-operable hotspots, high contrast, reduced-motion support, and announced interaction feedback.
- A bounded Maestro’s Guidance interface: fixed hint tiers with an authored fallback; optional AI wording never changes game state or blocks progression.

## Engineering choices

- **Static-first:** GitHub Pages hosts the complete game. Browser storage holds only the current chronicle; no account or analytics is required.
- **Bounded guidance:** the player chooses Nudge, Stronger Hint, or Reveal Next Step. The game sends no free text, identity, or save history. The Worker independently validates the whitelisted game summary and may only word the already-calculated next action.
- **Safe fallback:** if no Worker URL is configured—or the Worker, model provider, CORS policy, or rate limit fails—the game displays an authored hint and remains fully playable.
- **Evidence-led changes:** [the active OpenSpec change](openspec/changes/proof-of-excellence-pass/) maps requirements to tests and manual QA evidence.

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

Manual QA: open the root page at desktop and narrow/mobile widths; start and resume a chronicle after a refresh; complete the mirror-to-note sequence with only Tab, Enter, and Space; enable high contrast; and request each guidance tier with and without the Worker enabled.

## Point-and-click design

The game borrows the readable visual language of classic point-and-click adventures: hotspots identify objects worth examining, the satchel lets players select and apply items, and short contextual dialogue nudges rather than spells out solutions. Item puzzles have been adjusted for a small web game: their state is visible in the scene, wrong attempts are safe, and the main paths are compact enough for a short session.

Randomized routes add variety without making a run opaque. A player still learns the same core verbs—look, take, combine, and interpret clues—but the required order and the place that reveals the lock code can change.

## Publish with GitHub Pages

The included workflow builds the repository with Jekyll and deploys it whenever `main` is pushed. In the repository’s **Settings → Pages**, choose **GitHub Actions** as the source once. The site root then launches the game automatically through `index.html`; no filename needs to be added to the URL.

To preview locally, open `index.html` in a browser. The root page now introduces the project before linking into the game.
