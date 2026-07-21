# Change: Browser-native on-device inference backend for the Maestro's Guidance

## Why

The Maestro's Guidance currently has two paths: authored hints (always available) and an optional Cloudflare Worker calling a hosted model. A third path — the browser-provided Prompt API where available — can deliver the same bounded, validated guidance without the application sending a guidance request or bundling model weights. This first, deliberately narrow milestone turns the privacy constraint into a demonstrated capability before the project considers third-party local-model engines. It is the prerequisite for the sibling `local-npc-conversation` change, which is only acceptable because player text never leaves the device.

## What Changes

- Introduce a **backend abstraction** behind the existing `js/guidance-client.js` seam: authored-only (default), remote worker (existing), and new local inference.
- Add a **browser-native local inference runtime** for the Prompt API only. Detection is lazy, performs no dynamic import or application-initiated asset request, and fails closed to authored hints.
- Add an **explicit opt-in flow**: before activation, the player sees what the application sends to the browser-provided runtime and that the application neither bundles nor requests model assets. Browser-managed availability or downloads are outside the application's control and are described truthfully.
- Route every local reply through the **unchanged `validateGuidance` boundary** (tier, `nextActionId`, 45-word cap) plus the canonical-identifier/spoiler validator from `ai-guardrail-evals`; any rejection serves the authored hint.
- Add a **backend preference control** in the game's settings surface, persisted in the local save, keyboard-operable and announced.

## Capabilities

- **local-inference-runtime** — backend detection, opt-in model download and eviction, bounded local generation, validation parity.
- **guidance-backend-selection** — the player-facing backend preference, its persistence, and its network-silence guarantee.

## Impact

- Affected runtime: `js/guidance-client.js` (backend abstraction), new `js/local-inference.js`, settings surface in `maestros-secret.html`; save schema gains a small preference field through the ordered migration registry introduced by `temporal-finops-expedition`, preserving its expedition state and the `adaptive-guidance` struggle block.
- `openspec/project.md` non-negotiables are **touched but not amended**:
  - *"AI may enhance guidance but must never be required"* holds — authored hints remain the default and complete path; the local backend is opt-in enhancement only.
  - *"Playable as a static GitHub Pages site"* and the compact-payload posture hold — model weights are never committed to the repository or served from the site payload, and the application does not request them. Any browser-managed availability or download is outside the application's control. The initial page payload is unchanged.
  - No secret, free text, account, or personal data is introduced anywhere.
- Depends on `responsive-investigative-surface`, `installable-offline-web-app`, `temporal-finops-expedition` (the migration registry), `ai-case-study-docs` (baseline threat model), and `ai-guardrail-evals` (guardrail contract GR-001..006 and harness registration AE-005).
- README gains a short subsection describing the three guidance backends and browser-native activation disclosure.

## Constraints

- No model asset in the repository or the deployed site payload; this change makes no application-initiated model or engine asset request. The application does not claim control over browser-managed availability or downloads.
- Local generation respects the existing guidance timeout budget (parity with the worker's 4.5 s client timeout); slow or failed generation serves the authored hint.
- The local model receives exactly the same allowlisted summary as the worker (`summarizeForGuidance` output) — never free text, saves, or identity (GR-005).
- Feature-detection failures, unsupported browsers, and runtime aborts all fail closed to authored hints (GR-004).
- All settings UI is keyboard-operable, announced, and respects reduced motion and high contrast.

## Rollback

Remove the local backend registration and settings entry; the worker and authored paths are untouched. A save containing a local-backend preference degrades safely to authored-only when the backend is absent.

## Out of scope

- Free-text input of any kind (see `local-npc-conversation`).
- Any prompt content beyond the whitelisted guidance summary.
- Bundling, mirroring, self-hosting, or downloading model weights through WebLLM, transformers.js, or any other third-party engine. Each such engine requires a separate proposal covering origin allowlisting, version/integrity pinning, licensing, cache ownership/eviction, payload budget, and compatibility evidence.
- Fine-tuning or on-device training.
