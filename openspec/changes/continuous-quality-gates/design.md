# Design: Continuous quality gates

`quality-gates.yml` is an independent GitHub Actions workflow. It triggers on all branch pushes and pull requests so branch and review feedback arrive before the Pages deployment path.

The single Ubuntu runner checks out the repository, installs Node.js 22 with npm cache support, restores dependencies with `npm ci`, installs Chromium with Playwright system dependencies, then runs the declared validation commands. The job receives only `contents: read`; it has no secrets, token writes, artifact publishing, or deployment step.

Concurrency is scoped to workflow and ref, cancelling superseded runs for the same branch or pull request. This reduces redundant browser installs while preserving an independent result for the latest commit.

Rollback is deletion of the workflow and its contract test. No application state or deployment behavior depends on this workflow.
