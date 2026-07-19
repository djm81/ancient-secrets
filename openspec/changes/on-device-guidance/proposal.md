# Change: On-device local inference backend for the Maestro's Guidance

## Why

The Maestro's Guidance currently has two paths: authored hints (always available) and an optional Cloudflare Worker calling a hosted model. A third path — a small language model running entirely in the player's browser — delivers the same bounded, validated guidance with nothing leaving the device: no endpoint to deploy, no request to send, no provider dependency. For a project that is explicitly a proof of responsible AI engineering, on-device inference turns the privacy constraint into a demonstrated capability, and it is the load-bearing prerequisite for the sibling `local-npc-conversation` change, which is only acceptable because player text never leaves the device.

## What Changes

- Introduce a **backend abstraction** behind the existing `js/guidance-client.js` seam: authored-only (default), remote worker (existing), and new local inference.
- Add a **local inference runtime** with a capability-detection ladder: Chrome's built-in Prompt API first (no download), then WebLLM, then transformers.js — each optional, each failing closed to authored hints.
- Add an **explicit opt-in flow**: local model assets are downloaded only after the player confirms a disclosure that states the download size; assets are cached by the browser and evictable from the same settings surface. Nothing is ever bundled into the site payload.
- Route every local reply through the **unchanged `validateGuidance` boundary** (tier, `nextActionId`, 45-word cap) plus the hallucination/spoiler validator from `ai-guardrail-evals`; any rejection serves the authored hint.
- Add a **backend preference control** in the game's settings surface, persisted in the local save, keyboard-operable and announced.

## Capabilities

- **local-inference-runtime** — backend detection, opt-in model download and eviction, bounded local generation, validation parity.
- **guidance-backend-selection** — the player-facing backend preference, its persistence, and its network-silence guarantee.

## Impact

- Affected runtime: `js/guidance-client.js` (backend abstraction), new `js/local-inference.js`, settings surface in `maestros-secret.html`; save schema gains a small preference field in the next save schema version.
- `openspec/project.md` non-negotiables are **touched but not amended**:
  - *"AI may enhance guidance but must never be required"* holds — authored hints remain the default and complete path; the local backend is opt-in enhancement only.
  - *"Playable as a static GitHub Pages site"* and the compact-payload posture hold — model weights are never committed to the repository or served from the site payload; they are fetched from the backend's own distribution (or provided by the browser itself, for the Prompt API) only after explicit opt-in, and are evictable. The initial page payload is unchanged.
  - No secret, free text, account, or personal data is introduced anywhere.
- Depends on `ai-guardrail-evals` for the guardrail contract (GR-001..006) and harness registration (AE-005).
- README gains a short subsection describing the three guidance backends and the opt-in download.

## Constraints

- No model asset in the repository or the deployed site payload; no download without explicit informed opt-in.
- Local generation respects the existing guidance timeout budget (parity with the worker's 4.5 s client timeout); slow or failed generation serves the authored hint.
- The local model receives exactly the same allowlisted summary as the worker (`summarizeForGuidance` output) — never free text, saves, or identity (GR-005).
- Feature-detection failures, unsupported browsers, and low-memory aborts all fail closed to authored hints (GR-004).
- All settings UI is keyboard-operable, announced, and respects reduced motion and high contrast.

## Rollback

Remove the local backend registration and settings entry; the worker and authored paths are untouched. A save containing a local-backend preference degrades safely to authored-only when the backend is absent.

## Out of scope

- Free-text input of any kind (see `local-npc-conversation`).
- Any prompt content beyond the whitelisted guidance summary.
- Bundling, mirroring, or self-hosting model weights.
- Fine-tuning or on-device training.
