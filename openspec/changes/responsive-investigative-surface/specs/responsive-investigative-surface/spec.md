# Responsive investigative surface specification

## ADDED Requirements

### Requirement: RI-001 Contextual actions retain complete action parity

The default Casebook SHALL show at most three relevant actions, hide completed or irrelevant actions, and provide an accessible complete-action view. Every displayed action SHALL dispatch the same interaction identifier and produce the same state transition as its scene hotspot.

#### Scenario: Hidden action remains accessible

- **GIVEN** a workshop with more than three visible hotspots
- **WHEN** the contextual Casebook shows its three relevant actions
- **THEN** the remaining visible hotspots are available through All observations and selecting either representation produces the same result

### Requirement: RI-002 Every supported viewport has an explicit gameplay layout

The game SHALL present a portrait tray, landscape rail, desktop landscape rail, or desktop/tablet portrait dock according to the declared viewport matrix; it SHALL not rely on proportional scaling of one layout.

#### Scenario: Phone landscape uses a complete gameplay surface

- **GIVEN** an 844×390 viewport
- **WHEN** a chronicle is active
- **THEN** scene, objective, inventory, contextual actions, navigation, and open modal controls are visible or reachable without clipping

### Requirement: RI-003 Resizing and rotation never reset an active chronicle

Viewport changes SHALL preserve state, selected inventory item, modal state, logical focus, and reachable scroll position; they SHALL not start a new chronicle or persist a partial state.

#### Scenario: Rotation during item use

- **GIVEN** a portrait player with the mirror selected
- **WHEN** the device rotates to landscape
- **THEN** the same scene and selected mirror remain active and focus stays on the corresponding control

### Requirement: RI-004 Essential play has touch, pointer, and keyboard parity

Every essential action SHALL be available without hover, drag, orientation lock, precision tapping, or sound, and SHALL work by touch/pointer and keyboard.

#### Scenario: Keyboard-only puzzle progress

- **GIVEN** a keyboard-only player at any supported viewport
- **WHEN** they traverse the Casebook and select a required action
- **THEN** the action completes with visible focus and announced feedback

### Requirement: RI-005 Primary controls respect safe areas and minimum target size

Primary controls SHALL be at least 44 CSS px in both dimensions and remain clear of device safe-area insets.

#### Scenario: Notched portrait phone

- **GIVEN** a portrait phone viewport with bottom and top safe-area insets
- **WHEN** the Casebook and top controls render
- **THEN** no primary control is obscured by an inset and each meets the target-size minimum
