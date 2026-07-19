# Conversation safety specification

## ADDED Requirements

### Requirement: SF-001 A deterministic lexical filter guards both directions with authored deflections

A versioned, in-repo lexical filter SHALL screen player text before classification and persona output before display; any hit SHALL replace the interaction's visible result with the character's authored deflection line. The filter SHALL be deterministic and unit-tested.

#### Scenario: Filtered output deflects

- **GIVEN** a persona reply containing a filtered term
- **WHEN** the reply is processed
- **THEN** the authored deflection is displayed and the raw reply is never rendered

### Requirement: SF-002 Conversation content is excluded from every egress and persistence surface

Conversation content (player text and persona replies) SHALL be excluded from `summarizeForGuidance`, all guidance requests, the save schema, browser storage, and any diagnostic output, in every backend configuration.

#### Scenario: Guidance summary stays clean during conversation

- **GIVEN** an active conversation and a guidance request issued from the same session
- **WHEN** the guidance payload is inspected
- **THEN** it contains only the allowlisted summary fields and no conversation content

### Requirement: SF-003 The conversation surface registers a red-team corpus with the evaluation harness

This surface SHALL register with the adversarial evaluation harness (per AE-005) a corpus covering direct jailbreaks, role-play escalation, filter-evasion encodings, and malformed classifier outputs, replayed in default CI without a model.

#### Scenario: Corpus present and gating

- **GIVEN** the harness's surface registry
- **WHEN** the replay suite runs
- **THEN** the conversation surface has non-empty corpus coverage for each listed attack family and violations fail the suite
