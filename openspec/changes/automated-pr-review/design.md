# Design: automated CodeRabbit review

## Scope and trust boundary

`.coderabbit.yaml` is declarative repository metadata consumed by CodeRabbit after its GitHub App is installed. It receives no project secrets and does not execute in the player’s browser, worker, or GitHub Pages deployment. The configuration only directs the reviewer’s analysis and review-trigger policy.

## Configuration choices

- `reviews.auto_review.base_branches` matches both `dev` and `main`; `dev` is explicitly included because it is the integration target for current feature work.
- `drafts: false` prevents automatic reviews of unfinished PRs. A contributor can still request a review through CodeRabbit explicitly.
- `auto_incremental_review: true` asks CodeRabbit to revisit pushed commits instead of treating its first result as permanent.
- The `chill` profile and material-risk tone favor actionable feedback: static-first progression, cache/update regressions, accessibility, privacy, game-state determinism, and evidence drift.
- Path instructions specialize feedback by the repository’s actual boundaries: vanilla JavaScript/HTML, service worker, optional bounded Worker, OpenSpec, Playwright/Node tests, GitHub workflows, and documentation.
- The tool list excludes the source repository’s Python-only `ruff` and its Semgrep configuration path. It enables only broadly relevant hosted checks.

## Failure and fallback

- If CodeRabbit is not installed or unavailable, GitHub, the static game, and all local checks behave unchanged.
- Invalid YAML is caught by the documented Ruby/Psych parse-and-contract check before merge. Schema-level behavior is additionally governed by CodeRabbit’s schema URL embedded in the file.
- A noisy or unsuitable review policy is reverted by removing the file or disabling `reviews.auto_review.enabled`; neither action affects player data.

## Security and privacy

No token, key, player data, telemetry, browser runtime behavior, or Worker interface is introduced. CodeRabbit’s access and retention remain governed by its GitHub App installation and service settings, outside the static game’s runtime trust boundary.
