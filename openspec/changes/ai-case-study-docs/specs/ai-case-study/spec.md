# AI case study specification

## ADDED Requirements

### Requirement: CS-001 The case study covers the four named areas and is linked from the README

`docs/ai-case-study.md` SHALL cover the authoring-time art pipeline, the spec-driven agentic development workflow, the runtime guardrail architecture, and the evaluation evidence trail, and the README SHALL link it.

#### Scenario: Coverage check

- **GIVEN** the published case study
- **WHEN** its sections are reviewed against the four areas
- **THEN** each area has a dedicated section and the README links the document

### Requirement: CS-002 Every architectural claim is traceable

Every claim about behavior, boundaries, or guarantees in the case study SHALL cite a requirement ID from the project's specs or a repo-relative committed evidence artifact, and implementation status SHALL be labeled honestly (implemented versus proposed).

#### Scenario: Untraceable claim is a defect

- **GIVEN** a review of the case study
- **WHEN** a claim with no requirement ID or evidence reference is found
- **THEN** it is recorded as a defect and corrected before the change completes

### Requirement: CS-003 Documents are in-repo static markdown

Both documents SHALL live under `docs/`, render as plain GitHub markdown with no build tooling, and add no runtime or payload dependency.

#### Scenario: Static rendering

- **GIVEN** the repository on GitHub
- **WHEN** the documents are opened in the web UI
- **THEN** they render completely with no external tooling
