# Installable web app specification

## ADDED Requirements

### Requirement: PWA-001 The game has a stable installable identity and launches directly into play

The site SHALL provide a project-path-safe manifest with stable identity, local icons, standalone display, and a start route that opens the game rather than a portfolio page. Manifest links and Apple-compatible icon metadata SHALL be present on relevant entry pages.

#### Scenario: Installed launch reaches the chronicle

- **GIVEN** a supported browser that installs the web app
- **WHEN** the player launches its installed icon
- **THEN** the game opens directly and offers the saved chronicle or a new chronicle without a browser-style landing detour

### Requirement: PWA-002 Installation is progressive and never required

The game SHALL expose a custom install action only when the browser offers a usable installation prompt; other platforms SHALL receive truthful platform guidance or no affordance. Declining or lacking installation SHALL not change game availability.

#### Scenario: Unsupported installation prompt

- **GIVEN** a browser without a usable custom install prompt
- **WHEN** a player opens the game
- **THEN** the full game remains playable and no failing or misleading install control is shown
