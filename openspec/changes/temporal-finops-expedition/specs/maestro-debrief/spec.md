# Maestro debrief specification

## ADDED Requirements

### Requirement: MD-001 Every trial outcome leads to a debrief with Leonardo

After every trial pass and every withdrawal the game SHALL route the player into an authored debrief dialogue with Leonardo before returning to the hub. The debrief SHALL open by naming, in plain language, what the attempt demonstrated the player understood and what it showed they missed, derived from the trial's recorded outcome and failure category.

#### Scenario: Debrief after a pass

- **GIVEN** the player passes the Athens trial with an efficient allocation but a wrong cost-per-trireme figure
- **WHEN** the debrief opens
- **THEN** Leonardo credits the allocation reasoning and names unit cost as the missed idea before questioning begins

#### Scenario: Debrief after a withdrawal

- **GIVEN** the player withdraws from any trial
- **WHEN** the debrief opens
- **THEN** the missed concept is explained in era terms and the player is told the era can be retried without penalty to base progress

### Requirement: MD-002 Debrief questions are fixed multiple-choice with authored feedback for every option

Each era's debrief SHALL ask exactly three authored multiple-choice questions that map the era's practice to its timeless discipline (era-language framing, modern-language options among the answers). Every option — correct and incorrect — SHALL carry authored feedback explaining why it is right or wrong. Questions SHALL be answerable from the era just played. No free-text input SHALL exist.

#### Scenario: Incorrect answer teaches

- **GIVEN** the Rome debrief asks what the five-year farmed contract traded away
- **WHEN** the player picks the incorrect option
- **THEN** authored feedback explains the commitment-versus-flexibility trade in both era and modern terms, and the question's mastery credit reflects the miss

#### Scenario: Question bank is stable

- **GIVEN** the same era is debriefed twice
- **WHEN** the questions are presented
- **THEN** they come from that era's fixed authored bank of three, with only option order varying by seed

### Requirement: MD-003 The closing Codex dialogue bridges all eras to the modern framework

When all seven eras are complete, an authored closing dialogue SHALL walk the reconstructed Codex forward from Babylon to the present, explicitly naming the modern discipline's phases (Inform, Optimize, Operate) and four domains, crediting the FinOps Foundation framework, and stating that the game teaches concepts rather than granting certification.

#### Scenario: Closing dialogue content

- **GIVEN** all seven folios are recovered
- **WHEN** the player starts the closing dialogue
- **THEN** each era is linked to at least one named modern domain or capability and the framework attribution is shown

### Requirement: MD-004 Debrief answers feed mastery deterministically

Each debrief answer SHALL contribute a defined, authored mastery delta to the FinOps domains tagged on that question. Scoring SHALL be a pure function of (trial outcome, answer choices) with no randomness, so identical sessions yield identical Ledger of Mastery states.

#### Scenario: Reproducible scoring

- **GIVEN** two sessions with identical trial outcomes and identical debrief answers across three eras
- **WHEN** mastery is computed
- **THEN** both sessions produce identical per-domain scores and identical rank
