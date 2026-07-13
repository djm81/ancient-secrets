# Experience quality specification

## ADDED Requirements

### Requirement: EQ-001 Core play is keyboard accessible

Every hotspot, navigation arrow, inventory slot, modal action, music control, guidance control, and contrast control SHALL expose a meaningful accessible name, visible focus indication, and Enter/Space activation where it is not a native button.

#### Scenario: Keyboard-only opening sequence

- **GIVEN** a player uses only Tab, Shift+Tab, Enter, and Space
- **WHEN** they begin a chronicle
- **THEN** they can take the mirror, select it, read the note, and close the note modal without a pointer

### Requirement: EQ-002 Feedback respects user preferences

The game SHALL honour `prefers-reduced-motion`, offer a persistent high-contrast preference for the current browser, and announce dialogue/puzzle feedback through a polite live region.

#### Scenario: Reduced-motion player receives a puzzle update

- **GIVEN** reduced motion is enabled by the operating system
- **WHEN** a puzzle state changes
- **THEN** the result is understandable through text and no essential animated transition is required

#### Scenario: Player enables high contrast

- **GIVEN** the player enables high contrast
- **WHEN** the page is refreshed
- **THEN** the high-contrast preference is restored and controls remain distinguishable without colour alone
