# Continuous quality gates specification

## ADDED Requirements

### Requirement: CQ-001 Every branch and pull request receives quality validation

The repository SHALL run a GitHub Actions quality workflow on every push and pull request. The workflow SHALL run `npm run check`, `npm test`, `npm run test:browser`, `npm run test:a11y`, and `git diff --check` after installing declared dependencies and Chromium.

#### Scenario: Pull request reveals a failing browser test

- **GIVEN** a pull request contains a regression that fails `npm run test:browser`
- **WHEN** GitHub Actions runs the quality workflow
- **THEN** the quality job fails and reports the failing command before the change can be treated as validated

### Requirement: CQ-002 Quality validation is read-only and secret-free

The quality workflow SHALL use only `contents: read` permission and SHALL not deploy, publish artifacts, or require repository secrets.

#### Scenario: Fork-safe validation

- **GIVEN** GitHub Actions runs the quality workflow for a pull request
- **WHEN** the job executes its validation steps
- **THEN** it has no write permission or deployment token and runs the same declared checks

### Requirement: CQ-003 Quality validation is independent of Pages deployment

The quality workflow SHALL remain separate from the production Pages workflow, which continues to deploy only through its existing `main`-branch path.

#### Scenario: Feature branch validation does not deploy

- **GIVEN** a developer pushes a feature branch
- **WHEN** the quality workflow completes
- **THEN** it produces a validation result without initiating a Pages deployment
