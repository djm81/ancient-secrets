# Design: On-device local inference backend

## 1. Backend abstraction and detection ladder

`js/guidance-client.js` gains a backend parameter resolved from the persisted preference:

1. **authored** (default) — current `fallbackGuidance` path, zero AI.
2. **worker** — current remote path, unchanged.
3. **local** — new `js/local-inference.js`, implemented in this change with the browser-provided Prompt API only.

Detection checks the Prompt API lazily — only when the player opens the backend setting or has previously opted in — and performs neither a dynamic import nor an application-initiated asset request. Browser-managed model availability may involve behavior the application cannot inspect or control; the settings disclosure makes no promise about it. Every detection failure resolves to the authored path without error surfacing beyond the settings status line. WebLLM and transformers.js are expressly deferred to separately reviewed changes.

## 2. Opt-in and browser-managed runtime lifecycle

- Selecting the local backend shows a disclosure: the allowlisted game summary the application passes to the browser-provided runtime, that the application sends no guidance request, and that browser-managed model availability is governed by the browser rather than this site.
- Runtime initialization begins only after explicit confirmation; cancellation or failure reverts to the previous backend.
- The site payload never includes model assets; the repository never commits or requests them. Browser-level model management and eviction are outside this change and are not represented as an application control.

## 3. Prompting and reply contract

The local prompt is byte-equivalent in content to the worker's: the same whitelisted `summarizeForGuidance` output, the same single permitted action sentence, the same tier instruction and word cap. The reply contract is the same JSON shape (`{tier, message, nextActionId}`), parsed defensively. There is no conversation, no history, no free text.

## 4. Trust boundaries

The local model is untrusted in exactly the way the remote model is untrusted (GR-mapping):

- GR-001: local replies render text only; no state channel exists.
- GR-002: every local reply passes the unchanged `validateGuidance` plus the canonical-identifier/spoiler validator from `ai-guardrail-evals`; rejection serves the authored hint.
- GR-003: authored hints remain default and complete.
- GR-004: unsupported Prompt API availability, runtime errors, and aborted initialization fail closed.
- GR-005: model-visible input is the identical allowlisted summary.
- GR-006: this change registers a local-reply corpus with the adversarial harness (LI-005); replay tests exercise the validator against spoofed local replies without loading a real engine in CI.

A deliberate consequence: because validation is client-side and shared, the *same* tests prove the boundary for worker and local backends.

## 5. Performance and degradation

- Generation races the existing guidance timeout budget; on timeout the authored hint is served and the generation is abandoned.
- First-token latency and device thermals are surfaced only as a neutral "the Maestro is thinking" status with an authored-hint escape always visible.
- Prompt API calls are isolated behind the backend interface; future engine changes must independently establish worker-thread behavior and device-compatibility evidence.

## 6. Accessibility of the settings surface

Backend choice is a radio group with visible focus, described-by text for the disclosure, progress announced via the existing live region, and full keyboard operability. Reduced motion suppresses progress animation; high contrast applies to all new controls.

## 7. Rollback

Delete `js/local-inference.js`, the backend registration, and the settings entry. Preference fields in saves degrade safely (unknown backend → authored). The ordered migration registry preserves unrelated additive state during rollback and upgrade.
