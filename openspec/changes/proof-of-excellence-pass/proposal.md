# Change: Make the game a reviewable proof of AI product engineering

## Why

The game has a polished compact experience, but a reviewer cannot quickly see its engineering decisions, accessibility posture, continuity behavior, or responsible AI integration. The root page redirects directly into the game, gameplay state does not persist, and there is no bounded interface that demonstrates AI product judgment.

## What changes

- Replace the root redirect with a portfolio landing page that explains the playable experience and its engineering choices.
- Add a fixed-action Maestro's Guidance interface with nudge, hint, and reveal tiers; no free-form player input.
- Add a separately deployable Cloudflare Worker endpoint for optional AI-authored guidance, guarded by request and response validation plus an authored fallback.
- Extract deterministic game state, save/load, progress, and guidance rules into browser-safe pure modules.
- Add versioned resume support, keyboard semantics, high-contrast mode, reduced-motion support, and announced puzzle feedback.
- Add automated unit/browser checks and requirement-to-evidence mapping in this change.

## Capabilities

- **portfolio-experience** — a reviewer-facing root page and an in-game objective/progress surface.
- **bounded-guidance** — fixed-tier guidance, a validated optional endpoint, privacy boundaries, rate limiting, and authored fallback.
- **game-continuity** — versioned browser saves, resume, and corrupted-save recovery.
- **experience-quality** — keyboard operation, visible focus, high contrast, reduced motion, and announced feedback.

## Impact

- Affected runtime: `index.html`, `maestros-secret.html`, browser modules under `js/`, the Pages workflow, and an optional Worker deployment.
- New public interface: `POST /api/maestro-guide`.
- Deployment: GitHub Pages remains the static host. The optional guide endpoint is deployed separately as a Cloudflare Worker and receives its provider key only through server-side secret configuration.
- Documentation: update README with architecture, local testing, Worker configuration, data boundaries, rollback, and the manual QA checklist. The portfolio landing page becomes the public entry point.

## Constraints

- Core progression, saves, and authored guidance remain usable when no Worker is deployed.
- The browser never receives a provider secret or sends player-entered text, account data, or save history.
- This change must preserve the compact game; it is not permission to add content, accounts, telemetry, or a generic chatbot.

## Rollback

- Disable the guide endpoint or remove its configured URL; the client immediately uses authored hints and the game remains playable.
- Revert the static deployment commit to restore the previous root redirect if the portfolio entry page causes a release issue.
- Browser saves use a versioned schema, so an incompatible future save can be discarded safely instead of partially restored.

## Out of scope

- New scenes, characters, accounts, telemetry dashboards, payments, player-entered chat, or model-dependent puzzle logic.
