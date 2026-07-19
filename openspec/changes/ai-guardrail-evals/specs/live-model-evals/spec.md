# Live model evaluations specification

## ADDED Requirements

### Requirement: LM-001 Live evaluations run only on manual dispatch with secrets outside the repository

The live-model evaluation workflow SHALL run only when manually dispatched, SHALL read provider credentials exclusively from CI environment secrets, and SHALL never write a secret into repository files, transcripts, or logs.

#### Scenario: Transcript artifacts contain no secrets

- **GIVEN** a completed live evaluation run
- **WHEN** its committed transcript artifacts are inspected
- **THEN** they contain request bodies, response bodies, timestamps, and the model identifier only — no headers, keys, or tokens

### Requirement: LM-002 Model swaps are gated on a passing live evaluation with committed evidence

Changing the configured model or provider for any AI capability SHALL require a live evaluation run over the adversarial corpus whose transcripts are committed as evidence, demonstrating that the guardrail contract holds with the new model before the swap is adopted. Because the model is configured at deploy time and invisible to repository review, transcripts SHALL record the deployed model identifier and the README deployment documentation SHALL name the currently evaluated model, so configuration drift is detectable.

#### Scenario: Deployed model drift is detectable

- **GIVEN** a deployment whose configured model differs from the model named in the latest committed evaluation transcripts
- **WHEN** the transcripts and deployment documentation are compared
- **THEN** the mismatch is evident from repository contents alone and triggers a new evaluation run

#### Scenario: Swap without evaluation evidence is blocked

- **GIVEN** a proposed change to the worker's configured model
- **WHEN** its validation matrix is reviewed
- **THEN** it links a dated live-evaluation transcript for the new model, and absence of that link blocks completion

### Requirement: LM-003 Live evaluations are advisory to the static-site pipeline

The live-model workflow SHALL NOT be a required check for building or deploying the static site; a provider outage or evaluation failure SHALL never block GitHub Pages deployment of the authored game.

#### Scenario: Provider outage does not block deploy

- **GIVEN** the model provider is unreachable
- **WHEN** `main` is pushed
- **THEN** the Pages workflow builds and deploys the static site unaffected
