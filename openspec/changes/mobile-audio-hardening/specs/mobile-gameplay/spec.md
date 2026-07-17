# Mobile gameplay specification

## ADDED Requirements

### Requirement: MG-001 Portrait phone play exposes reachable game actions

At a portrait viewport no wider than 620 CSS px, the game SHALL use the available visual viewport without horizontal overflow. It SHALL retain the complete 16:9 scene artwork and expose each visible active-scene hotspot and available scene navigation through native controls at least 44 CSS px high. Those controls SHALL execute the same game actions as their desktop counterparts.

#### Scenario: A player begins a portrait-phone chronicle

- **GIVEN** a player loads the game at 390 × 844
- **WHEN** they begin a chronicle
- **THEN** the scene is visible, the portrait action surface is reachable, and selecting “Take Hand Mirror” awards the same mirror inventory item as the SVG hotspot

#### Scenario: A player changes scenes on a portrait phone

- **GIVEN** a portrait-phone chronicle with a reachable navigation destination
- **WHEN** the player selects the destination from the portrait action surface
- **THEN** the declared destination becomes the active scene

#### Scenario: A delayed puzzle reveal adds its portrait action

- **GIVEN** a portrait-phone player repairs the flying machine with the bronze gear
- **WHEN** its authored transition exposes the trapdoor
- **THEN** the portrait action surface adds the Trapdoor control without requiring navigation or refresh

### Requirement: MG-002 Portrait overlays remain readable and operable

At a portrait viewport no wider than 620 CSS px, title content, inventory controls, modal panels, and dialogue choices SHALL remain within the visual viewport or provide vertical scrolling. Dialogue copy and buttons SHALL not be reduced below readable phone-scale text.

#### Scenario: A dialogue opens on a portrait phone

- **GIVEN** a player opens the baker dialogue at 390 × 844
- **WHEN** the art, copy, and choices render
- **THEN** the player can read a choice and select it without horizontal scrolling or clipped controls

#### Scenario: Dialogue choices remain anchored below a cropped image

- **GIVEN** a phone or compact landscape viewport with little vertical room opens a dialogue
- **WHEN** the dialogue image is cropped to preserve room for copy
- **THEN** every dialogue choice is in-flow with the copy, visible or reachable by vertical scrolling, and does not overlap an unrelated scene control

#### Scenario: Desktop dialogue copy uses the illustration’s parchment area

- **GIVEN** the baker dialogue opens on a desktop viewport
- **WHEN** its authored backdrop reserves the lower-right parchment area for reading
- **THEN** the dialogue copy is anchored in that lower-right area and does not cover the baker character or leave the intended parchment area empty
