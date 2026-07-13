# The Maestro's Secret — OpenSpec Project Context

## Product intent

The project is a compact, browser-based Renaissance point-and-click adventure. It is also a public proof of engineering judgment for hiring reviewers and technical peers.

## Non-negotiables

- The game remains playable as a static GitHub Pages site.
- AI may enhance guidance but must never be required to progress.
- No provider secret, player-entered free text, account, or personal data belongs in the browser payload.
- Preserve the compact authored experience; do not add scenes, accounts, analytics, or a generic chatbot as part of this change.

## Validation standard

Every changed requirement must link to automated evidence where practical and a concise manual scenario where browser/audio/visual behavior is material. Evidence is recorded in the change's `validation.md` before merge.

## Governance

`AGENTS.md` is the repository bootstrap and delivery contract. `openspec/config.yaml` keeps proposal, design, specification, and task artifacts concise and appropriate for this static-first project. They intentionally adopt spec-first evidence without the source project's multi-repository, module-signing, release, or issue-hierarchy machinery.
