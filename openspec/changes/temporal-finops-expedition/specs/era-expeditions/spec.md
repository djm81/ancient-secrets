# Era expeditions specification

## ADDED Requirements

### Requirement: EE-001 Eras are authored, data-driven, and complete offline

The game SHALL ship seven authored eras (Babylon, Egypt, Athens, Rome, Champagne Fairs, Florence 1494, The Age to Come) defined entirely in static content modules: scene graph, mentor dialogue, three clue artifacts, trial parameters, hints, and failure explanations. Every era SHALL be fully explorable and completable with no network access and no Worker deployed.

#### Scenario: Offline era completion

- **GIVEN** the site is served statically with no guidance endpoint configured
- **WHEN** the player explores an era, collects its clues, and passes its trial
- **THEN** the full loop including debrief and invention reveal completes using authored content only

### Requirement: EE-002 Each trial is deterministic, era-authentic, and solvable from in-era knowledge

Each era SHALL contain exactly one trial whose mechanics use that era's documented financial instruments (per the design mapping table), whose parameters derive from authored tables plus a per-attempt seed, and whose evaluation is a pure function reproducible in the Node test runner. Everything needed to solve a trial SHALL be learnable from its era's clues and mentor dialogue; no modern FinOps vocabulary SHALL be required to pass. Solving SHALL be possible on every generated parameter set.

#### Scenario: Deterministic trial evaluation

- **GIVEN** a fixed seed for the Babylon ledger trial
- **WHEN** the trial is generated twice and the same answers are evaluated
- **THEN** both runs produce identical parameters, identical verdicts, and identical mastery deltas

#### Scenario: Every generated trial is solvable

- **GIVEN** any seed across the tested seed range for each of the seven trials
- **WHEN** the trial is generated
- **THEN** at least one answer set exists that the evaluator accepts as a pass

#### Scenario: Era knowledge suffices

- **GIVEN** the Rome trial's clues describe farmed contracts, direct collection, and audit marks in era language
- **WHEN** a player applies only those clues
- **THEN** the trial is passable without any reference to modern terminology

### Requirement: EE-003 Withdrawing is always available and never destroys progress

Every trial SHALL offer a clearly labeled withdraw action at any point. Withdrawing SHALL preserve collected clues and era exploration state, route the player to Leonardo's debrief with an authored explanation matched to the specific failure category of the attempt, mark the era as withdrawn, and allow unlimited retries with a fresh seed. Withdrawal SHALL reduce, not zero, the mastery credit available from that era until a later pass.

#### Scenario: Withdraw and retry

- **GIVEN** a player mid-way through the Champagne routing trial
- **WHEN** they withdraw after choosing an overpriced route segment
- **THEN** the debrief explains fee-versus-risk routing specifically, the era is marked withdrawn, clues remain collected, and a retry generates a fresh seed

#### Scenario: Failure categories select explanations

- **GIVEN** two withdrawn Babylon attempts, one with an unbalanced ledger and one with an illegal interest rate
- **WHEN** each debrief runs
- **THEN** each shows the explanation authored for its failure category, not a generic message

### Requirement: EE-004 Era hints follow the bounded-guidance contract

Each era SHALL provide authored nudge, hint, and reveal tiers scoped to its trial, served through the existing fixed-tier guidance interface. When the optional Worker is configured, guidance requests MAY include the era as a validated enum; unknown or missing era values SHALL fall back to authored era hints without error. No player-entered text SHALL be introduced.

#### Scenario: Authored era hints without a Worker

- **GIVEN** no guidance endpoint is configured
- **WHEN** the player requests a hint during the Egypt trial
- **THEN** the authored Egypt hint for the current trial stage is shown at the requested tier

#### Scenario: Invalid era value at the Worker

- **GIVEN** a guidance request whose era field is not in the known era list
- **WHEN** the Worker validates the request
- **THEN** the request is handled as era-less and the client's authored fallback remains available

### Requirement: EE-005 Era scenes meet the established experience-quality standard

Every era scene, clue interaction, trial control, and withdraw action SHALL be keyboard-operable with visible focus, honor reduced motion and high contrast, and announce trial feedback (accepted step, rejected step, pass, withdraw) through the existing feedback channel.

#### Scenario: Announced trial feedback

- **GIVEN** a screen-reader user in the Florence trial
- **WHEN** they post a balancing entry that the evaluator rejects
- **THEN** the rejection and its era-language reason are announced without moving focus unexpectedly

### Requirement: EE-006 Each era presents an authored, realistic visual identity

Each era SHALL ship three authored realistic images unique to its civilization — scene backdrop, mentor portrait, and trial tableau — generated at authoring time from recorded art briefs, curated for historical accuracy, and committed as optimized static assets. All era interaction SHALL use the established dialogue-panel pattern with fixed multiple-choice options rendered over the imagery; text SHALL never be baked into images. Every image SHALL carry authored alt text. The compressed payload SHALL NOT exceed 200 KB per image and 3.0 MB across all era imagery, images SHALL lazy-load per era, and the base game's initial payload SHALL be unchanged. Dialogue panels SHALL keep required text contrast over any imagery, high-contrast mode SHALL use a solid panel background, and reduced motion SHALL disable any backdrop motion treatment.

#### Scenario: Era imagery loads offline with alt text

- **GIVEN** the site is served statically with no network beyond the page itself
- **WHEN** the player enters any era
- **THEN** the backdrop, mentor portrait, and trial tableau render from local assets and each exposes its authored alt text

#### Scenario: Dialogue stays readable over imagery

- **GIVEN** a dialogue panel with multiple-choice options over the brightest region of an era backdrop
- **WHEN** rendered in default and high-contrast modes
- **THEN** the panel meets contrast requirements in both, using a solid background in high contrast

#### Scenario: Payload budget holds

- **GIVEN** the complete set of committed era images
- **WHEN** compressed sizes are measured in the automated check
- **THEN** no image exceeds 200 KB and the total does not exceed 3.0 MB, and the base game's initial payload is unchanged
