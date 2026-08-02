# Change: automated CodeRabbit review for `dev` pull requests

## Why

The repository has repeatable local checks and OpenSpec evidence, but no repository-owned instructions for an automated pull-request reviewer. A focused CodeRabbit configuration makes review feedback consistent with the game’s static-first, accessibility, privacy, and offline guarantees—especially on pull requests targeting the team integration branch, `dev`.

## What changes

- Add a root `.coderabbit.yaml` using CodeRabbit’s version-2 schema.
- Enable automatic, incremental review for pull requests into `dev` and `main`; drafts remain opt-in so unfinished work is not reviewed prematurely.
- Give the reviewer path-specific instructions for game runtime, service-worker cache lifecycle, bounded guidance Worker, OpenSpec evidence, tests, workflows, and documentation.
- Record the local configuration-validation command and reviewer operating model in the README.

## Capabilities

- **automated-pr-review** — deterministic repository-owned configuration directing CodeRabbit review scope and automatic review targets.

## Impact

- No player-facing runtime, save, network, or deployment behavior changes.
- Adds an external GitHub-app integration when CodeRabbit is installed for the repository; without that app, the configuration is inert.
- No credentials, tokens, or user data are added to the repository.

## Constraints

- Review instructions must reinforce, not replace, `AGENTS.md`, OpenSpec, and the existing local test gates.
- Do not copy source-repository rules that assume Python, Hatch, Pydantic, or linked module repositories.
- Automatic review must include `dev`, the target integration branch, and must not review drafts by default.

## Rollback

- Remove `.coderabbit.yaml` to return to CodeRabbit’s repository/default settings. No game data or deployed player asset requires migration.
