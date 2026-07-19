# Adaptive guidance specification

## ADDED Requirements

### Requirement: AG-001 The struggle score is a pure deterministic function of local signals

Tier suggestion SHALL be computed by a pure function of the recorded signals with authored thresholds and no randomness or hidden clock reads, so identical signal inputs always yield identical suggestions.

#### Scenario: Reproducible suggestion

- **GIVEN** two states with identical struggle signals
- **WHEN** `suggestTier` is evaluated for each
- **THEN** both return the same suggestion

### Requirement: AG-002 Signals live only in the local save with zero egress

Struggle signals SHALL be stored only within the local save, SHALL be excluded from `summarizeForGuidance` and every network request, and SHALL contain only gameplay counters — never text, identity, or timestamps beyond elapsed durations.

#### Scenario: Network inspection during suggested guidance

- **GIVEN** an active session with accumulated signals and the worker backend configured
- **WHEN** a suggested hint is requested and traffic is inspected
- **THEN** the request contains only the allowlisted guidance summary and no signal data

### Requirement: AG-003 Suggestions are dismissible and never auto-reveal hint content

The suggestion surface SHALL only invite the player toward a tier; it SHALL NOT render hint text itself, SHALL be dismissible by pointer and keyboard, and SHALL NOT re-prompt for the same objective after dismissal.

#### Scenario: Dismissal is respected

- **GIVEN** a suggestion shown for the current objective
- **WHEN** the player dismisses it and continues playing the same objective
- **THEN** no hint text was rendered and the suggestion does not reappear for that objective

### Requirement: AG-004 The feature is fully functional with all AI backends absent

Signal accumulation, suggestion computation, and the suggestion surface SHALL work identically with no worker endpoint, no local model, and no AI configuration of any kind.

#### Scenario: AI-free suggestion flow

- **GIVEN** a session with no AI backend configured
- **WHEN** thresholds are crossed and the player accepts the suggestion
- **THEN** the authored hint for the suggested tier is shown

### Requirement: AG-005 Opt-out disables collection and clears stored signals

An accessible opt-out SHALL stop signal accumulation and clear any stored signals from the save, and the game SHALL behave identically to the pre-change release while opted out.

#### Scenario: Opt-out clears and silences

- **GIVEN** a save with accumulated signals
- **WHEN** the player opts out
- **THEN** stored signals are cleared, no further accumulation occurs, and no suggestion ever appears
