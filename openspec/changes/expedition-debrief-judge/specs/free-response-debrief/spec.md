# Free-response debrief specification

## ADDED Requirements

### Requirement: FR-001 The multiple-choice path remains always available and mastery-equivalent

Every debrief question SHALL remain answerable by the fixed multiple-choice path at all times, and a player using only multiple-choice SHALL be able to reach every mastery outcome, rank, and completion state the free-form path can reach.

#### Scenario: Multiple-choice-only run reaches full mastery

- **GIVEN** a player who never opts into free-form answers
- **WHEN** they complete all debriefs with correct multiple-choice answers
- **THEN** their Ledger of Mastery and rank equal the maximum achievable through free-form answering

### Requirement: FR-002 Judge outcomes never block progression nor demote mastery below the multiple-choice floor

No judge verdict, failure, or unavailability SHALL prevent a debrief from completing, and a free-form answer's mastery delta SHALL never be lower than the delta of the equivalent multiple-choice outcome.

#### Scenario: All-false verdict equals a wrong multiple-choice answer

- **GIVEN** a free-form answer the judge marks false on every criterion
- **WHEN** the debrief question resolves
- **THEN** progression continues identically to a wrong multiple-choice answer and the recorded delta equals that outcome's authored delta

#### Scenario: Judge outage mid-debrief

- **GIVEN** the judge route becomes unavailable after the player submits an answer
- **WHEN** the timeout elapses
- **THEN** the question silently presents its multiple-choice options and the debrief completes normally

### Requirement: FR-003 Free-form answering requires explicit informed consent that is revocable

Before any answer text leaves the device, the player SHALL see a disclosure naming exactly what is sent, the project Worker and model-provider destination, the separately documented application, platform, and provider retention postures, and a warning not to enter personal data. Consent SHALL be per-session, never pre-checked, and revocable, with revocation hiding the free-form path without penalty and clearing unsent text from the client surface.

#### Scenario: No consent, no egress

- **GIVEN** a player who has not confirmed the disclosure
- **WHEN** any debrief question is displayed and answered
- **THEN** no request containing answer text is issued

#### Scenario: Revocation reverts to multiple-choice

- **GIVEN** a player who consented earlier in the session
- **WHEN** they revoke consent from the same surface
- **THEN** the free-form option no longer renders and subsequent questions proceed via multiple-choice
