# FinOps mastery rank specification

## ADDED Requirements

### Requirement: FM-001 Mastery is tracked per FinOps domain

The game SHALL track mastery scores across the four FinOps Framework domains: Understand Usage & Cost, Quantify Business Value, Optimize Usage & Cost, and Manage the FinOps Practice. Every trial outcome and debrief answer SHALL be tagged to one or more domains, and each era SHALL contribute to at least one domain per the design mapping table.

#### Scenario: Domain attribution

- **GIVEN** the player passes the Egypt trial and answers its debrief
- **WHEN** mastery is updated
- **THEN** the Quantify Business Value domain gains the authored credit and untagged domains are unchanged

### Requirement: FM-002 Rank derives from domain mastery using the maturity model

The game SHALL derive one overall rank from the domain scores — Garzone, Discepolo, Maestro dei Conti — explicitly presented as mirroring the FinOps maturity stages Crawl, Walk, Run. Rank thresholds SHALL be authored constants; rank SHALL be a pure function of the mastery state; rank SHALL never decrease from retrying an era, because a later pass replaces (never stacks with) that era's reduced withdrawal credit at whichever value is higher.

#### Scenario: Rank promotion

- **GIVEN** domain scores just below the Discepolo thresholds
- **WHEN** an era pass and strong debrief push the tagged domains past them
- **THEN** the rank becomes Discepolo and the promotion is announced

#### Scenario: Retry never demotes

- **GIVEN** a completed era retried with worse debrief answers
- **WHEN** mastery is recomputed
- **THEN** the stored era credit and the overall rank are no lower than before

### Requirement: FM-003 The Ledger of Mastery presents scores honestly and locally

The workshop hub SHALL contain a Ledger of Mastery showing per-domain progress, the overall rank with its Crawl/Walk/Run correspondence, per-era status, and which domains each completed era exercised. All scores SHALL live only in the local save; no score SHALL leave the browser. The surface SHALL state it reflects understanding of concepts, not certification.

#### Scenario: Ledger reflects a mixed record

- **GIVEN** three eras passed, one withdrawn, three unattempted
- **WHEN** the Ledger of Mastery is opened
- **THEN** per-domain bars, the current rank, and each era's status are shown, and refresh-plus-resume shows the identical ledger

#### Scenario: Scores stay local

- **GIVEN** any expedition state
- **WHEN** network traffic is inspected during play including guidance requests
- **THEN** no mastery, rank, or per-era score data is transmitted
