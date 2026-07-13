# Design: bounded guidance with a static-first game

## Architecture

```text
GitHub Pages game
  ├─ pure state / save / guidance modules
  ├─ authored fallback hints (always available)
  └─ optional POST /api/maestro-guide
        └─ Cloudflare Worker → model provider (server secret only)
```

The game calculates the one valid next action from its current state before requesting guidance. The Worker independently recalculates that action from the submitted milestone summary. The model may write wording only; it cannot select another action, mutate game state, or receive free-form player content.

## Endpoint contract

### Request

```json
{
  "tier": "nudge | hint | reveal",
  "state": {
    "scene": "workshop",
    "inventory": ["mirror"],
    "milestones": { "mirrorTaken": true, "noteRead": false },
    "nextActionId": "read-note"
  }
}
```

Only known scene IDs, known item IDs, boolean milestones, and the calculated next action are accepted. Requests larger than 4 KiB, malformed JSON, unrecognized tiers, or mismatched action IDs are rejected.

### Response

```json
{ "tier": "hint", "message": "…", "nextActionId": "read-note" }
```

The response message is normalized and limited to 45 words. `tier` and `nextActionId` must equal the request's validated values. Invalid, unavailable, rate-limited, or failed AI responses resolve to an authored fallback with the same schema.

## Security and privacy decisions

- The client never receives a provider key and never calls the model provider directly.
- The client sends no free text, identity, tracking identifier, or save history—only the current whitelisted puzzle summary.
- Production deployment configures the Worker Rate Limiting binding before the provider call, keyed by the anonymous visitor's Cloudflare IP, and a Cloudflare WAF rate-limit rule as a second edge boundary. The Worker fails closed when an AI key is present but either `ALLOWED_ORIGIN` or the rate-limit binding is absent.
- The Worker does not persist request payloads. Client fallback preserves the static experience during endpoint failure or rollback.

## Rollback and operational behavior

- If the Worker, model provider, CORS policy, or rate-limit configuration fails, the browser shows the authored response for the selected tier; no retry loop or game-state mutation occurs.
- The guide endpoint URL is a deploy-time configuration. Clearing it disables remote guidance without redeploying the static game.
- A static-site rollback restores the previous root redirect. Invalid browser saves are discarded rather than migrated speculatively.

## Compatibility decisions

- Browser saves are versioned. Unknown, malformed, or obsolete saves are discarded safely and the player is offered a new chronicle. Critical puzzle rewards are committed before cosmetic delayed animation, so refresh cannot preserve an intermediate, unplayable state.
- Browser storage access is wrapped defensively. If a privacy setting denies it, the game remains playable with resume and persisted contrast disabled.
- Keyboard controls use native buttons where possible; SVG hotspots receive button semantics, visible focus, and Enter/Space activation.
- High contrast and reduced motion are preferences, not separate game modes; visual state is never conveyed by colour alone.
