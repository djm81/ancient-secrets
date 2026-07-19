# AI threat model specification

## ADDED Requirements

### Requirement: TM-001 The threat model enumerates every AI surface with its trust boundaries

`docs/ai-threat-model.md` SHALL inventory every AI surface — the guidance Worker, on-device inference, NPC conversation, the debrief judge, and the authoring-time pipelines — stating for each the trust boundary, attacker positions, and data that crosses the boundary, with proposal-stage surfaces marked as proposed.

#### Scenario: Inventory completeness

- **GIVEN** the set of AI surfaces defined across accepted and proposed changes
- **WHEN** the threat model's inventory is compared against it
- **THEN** every surface appears with a boundary analysis

### Requirement: TM-002 Every identified threat maps to a mitigation or an explicit accepted risk

Each enumerated threat SHALL reference the requirement ID that mitigates it or carry an explicit accepted-risk entry with rationale; no threat may be listed unresolved.

#### Scenario: Unmapped threat is a defect

- **GIVEN** a review of the threat model
- **WHEN** a threat with neither a mitigating requirement ID nor an accepted-risk entry is found
- **THEN** it is recorded as a defect and resolved before the change completes

### Requirement: TM-003 Changes adding an AI surface update the threat model before merge

Any change that introduces or extends a model-visible input or model-produced output SHALL update the threat model in the same change, and its validation matrix SHALL include the threat-model row.

#### Scenario: New surface without threat-model update is incomplete

- **GIVEN** a proposed change adding an AI surface
- **WHEN** its validation matrix is reviewed
- **THEN** it contains a threat-model update row, and absence blocks completion
