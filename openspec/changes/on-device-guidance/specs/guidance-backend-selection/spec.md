# Guidance backend selection specification

## ADDED Requirements

### Requirement: GB-001 The player controls the guidance backend with authored-only as default

The game SHALL offer an explicit backend preference — authored-only (default), remote worker (when an endpoint is configured), local inference (when supported and opted in) — and SHALL never switch backends without a player action.

#### Scenario: Default is authored-only

- **GIVEN** a fresh chronicle
- **WHEN** guidance is requested before any settings change
- **THEN** the authored hint path answers and no network or model activity occurs

### Requirement: GB-002 The local backend is network-silent after opt-in download completes

With the local backend active and its assets downloaded, guidance requests SHALL cause no network traffic of any kind; the only network activity ever attributable to the local backend SHALL be the opt-in asset download itself.

#### Scenario: Network inspection during local guidance

- **GIVEN** the local backend is active with assets cached
- **WHEN** the player requests nudge, hint, and reveal tiers while network activity is recorded
- **THEN** zero guidance-related requests appear

### Requirement: GB-003 The backend preference persists accessibly and degrades safely

The preference SHALL persist in the local save, be operable by keyboard with announced state changes, and degrade to authored-only when a persisted backend is unavailable on resume (missing endpoint, evicted assets, unsupported browser).

#### Scenario: Resume on a less capable browser

- **GIVEN** a save with the local backend preferred, resumed in a browser without local inference support
- **WHEN** the chronicle loads and guidance is requested
- **THEN** authored hints answer, the settings surface reflects the degraded state, and the save remains valid
