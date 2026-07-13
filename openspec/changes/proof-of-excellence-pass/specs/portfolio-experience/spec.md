# Portfolio experience specification

## ADDED Requirements

### Requirement: PE-001 A reviewer can understand the project before playing

The root page SHALL present a concise portfolio landing page instead of redirecting immediately. It SHALL include a direct game CTA labelled “Play (6–8 min)”, a feature summary, and engineering notes covering architecture, AI safety, accessibility, testing, and intentional limits.

#### Scenario: Reviewer opens the published root URL

- **GIVEN** a visitor opens the GitHub Pages root URL
- **WHEN** the page finishes loading
- **THEN** the visitor can find the labelled play CTA and engineering notes without entering the game

### Requirement: PE-002 The game communicates the current objective

The game SHALL display the current chapter and one actionable objective derived from state. It SHALL provide a visible entry to guidance without requiring a puzzle failure or long wait.

#### Scenario: A new chronicle begins

- **GIVEN** the player has started a new chronicle
- **WHEN** the workshop is shown
- **THEN** the progress strip identifies the first chapter and an objective appropriate to the starting state
