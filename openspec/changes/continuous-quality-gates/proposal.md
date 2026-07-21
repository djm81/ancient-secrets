# Change: Continuous quality gates for every branch and pull request

## Why

The Pages deployment workflow runs verification only after a push to `main`. Feature branches and pull requests therefore have no independent, visible test result before merge.

## What Changes

- Add a GitHub Actions workflow that runs on every push, pull request, and manual dispatch.
- Run the repository's syntax, unit, Chromium browser, accessibility, and whitespace checks on Node.js 22.
- Keep the workflow read-only: no deployment credentials, repository writes, or production actions.

## Capabilities

- **continuous-quality-gates** — reproducible PR and branch validation that fails when a repository test contract fails.

## Impact

- Adds `.github/workflows/quality-gates.yml`, one workflow-contract test, and README guidance.
- Does not alter GitHub Pages deployment, game runtime, saves, or secrets.

## Constraints

- The quality workflow runs without secrets and does not deploy.
- It installs only declared Node dependencies and Chromium required by the committed Playwright suite.
- Existing Pages deployment remains responsible for publishing from `main`.

## Rollback

Delete the quality workflow and its contract test; the existing Pages workflow continues unchanged.
