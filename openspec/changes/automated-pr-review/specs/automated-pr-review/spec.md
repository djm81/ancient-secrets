## ADDED Requirements

### Requirement: Repository-owned CodeRabbit review policy

The repository SHALL contain a root `.coderabbit.yaml` valid YAML configuration for CodeRabbit’s version-2 schema. It SHALL direct review feedback toward material correctness, security, privacy, accessibility, offline/cache lifecycle, deterministic game state, and OpenSpec evidence; it SHALL not prescribe rules specific to an unrelated Python/CLI project.

#### Scenario: Review guidance follows game boundaries

- **WHEN** a pull request changes browser runtime, worker, service-worker, OpenSpec, tests, workflow, or documentation files
- **THEN** CodeRabbit receives path-specific instructions appropriate to that area
- **AND THEN** the instructions reinforce the project’s static-first and evidence-led engineering constraints.

### Requirement: Automatic review covers integration pull requests

CodeRabbit SHALL automatically and incrementally review non-draft pull requests whose base branch is `dev` or `main`. The policy SHALL disable CodeRabbit’s automatic incremental-review pause so every subsequent pushed commit remains eligible.

#### Scenario: Pull request targets dev

- **WHEN** a non-draft pull request is opened against `dev`
- **THEN** CodeRabbit is eligible to start an automatic review
- **AND THEN** subsequent pushed commits are eligible for incremental review.

#### Scenario: Pull request remains draft

- **WHEN** a pull request is in draft state
- **THEN** it is not automatically reviewed solely because of this configuration.

### Requirement: Local configuration contract is documented

The README SHALL describe the CodeRabbit operating model and provide a local YAML/contract validation command that does not require a CodeRabbit credential.

#### Scenario: Contributor validates configuration locally

- **WHEN** a contributor follows the documented review-configuration command
- **THEN** malformed YAML or a missing required `dev` automatic-review target fails locally
- **AND THEN** no network call or secret is required.
