# Bounded guidance specification

## ADDED Requirements

### Requirement: BG-001 Guidance is fixed-action and cannot mutate game state

The game SHALL expose exactly three guidance tiers—Nudge, Stronger hint, and Reveal next step. It SHALL not accept player-entered text. Requesting or receiving guidance SHALL NOT alter inventory, flags, route selection, score, or scene.

#### Scenario: Player requests a guidance tier

- **GIVEN** a valid in-progress chronicle
- **WHEN** the player selects one of the three guidance tiers
- **THEN** the game displays a hint for the current next action and the gameplay state remains unchanged

### Requirement: BG-002 The endpoint accepts only a whitelisted state summary

`POST /api/maestro-guide` SHALL accept a tier and a whitelisted state summary only. It SHALL reject malformed JSON, bodies over 4 KiB, unknown tiers, unrecognized item/scene values, and a client-supplied `nextActionId` that does not match the Worker-calculated action.

#### Scenario: A client attempts to select a spoiler action

- **GIVEN** a starting-state summary
- **WHEN** the request names `open-trapdoor` as its next action
- **THEN** the endpoint returns HTTP 400 and does not invoke the model provider

#### Scenario: A client sends an oversized request

- **GIVEN** a request body larger than 4 KiB
- **WHEN** it is posted to the endpoint
- **THEN** the endpoint returns HTTP 413 and does not invoke the model provider

### Requirement: BG-003 AI output is bounded and safely replaceable

The endpoint SHALL return only `{ tier, message, nextActionId }`. It SHALL enforce the requested tier, the calculated action ID, and a 45-word message limit. The client SHALL use an authored response of the same shape if the endpoint is unavailable, returns an error, or returns an invalid response.

#### Scenario: The guide endpoint is unavailable

- **GIVEN** a player asks for a hint
- **WHEN** the request times out, fails, or returns invalid JSON
- **THEN** the player receives an authored hint and can complete the game normally

### Requirement: BG-004 Secrets and player data stay outside the client

The model provider key SHALL exist only in Worker secret configuration. The browser SHALL send no player-entered text, account data, identifier, or save history to the endpoint.

#### Scenario: Public source is inspected

- **GIVEN** a reviewer searches browser JavaScript and HTML
- **WHEN** they inspect guide integration
- **THEN** no provider secret is present and the request payload contains only the documented state summary

### Requirement: BG-005 Public guidance requests are rate limited

The production Worker deployment SHALL apply a platform-backed server-side rate limit to `POST /api/maestro-guide` before calling the model provider. An AI-enabled deployment missing its allowed-origin or rate-limit configuration SHALL fail closed. A limited request SHALL return HTTP 429 and the client SHALL display authored guidance without altering game state.

#### Scenario: The endpoint rate limit is reached

- **GIVEN** the deployment's rate-limit threshold has been reached
- **WHEN** the player requests a guidance tier
- **THEN** the endpoint returns HTTP 429 and the client presents its authored fallback

#### Scenario: An AI-enabled Worker is missing its safety binding

- **GIVEN** a Worker has a provider key but lacks its configured allowed origin or rate-limit binding
- **WHEN** a valid guidance request is posted
- **THEN** the endpoint returns a non-success response without invoking the model provider
