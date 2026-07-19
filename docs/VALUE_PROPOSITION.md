# Value proposition — what makes this project unique (and what doesn't)

> **Positioning in one line:** a shipped, inspectable proof that AI features can be added to a product with a formally bounded blast radius — playable in your browser.

This document states the project's unique selling points honestly: what is genuinely differentiating, what is merely competent, and which claims are shipped versus proposed. Every claim here is traceable to code, specs, or evidence in this repository.

## What is *not* unique

Honesty first. As a game, this is competent genre work, not innovation:

- Point-and-click mechanics, randomized runs, optional curiosities, and a branching finale are all established patterns players have seen many times.
- A hand-crafted static web game in vanilla JS and SVG is good craft, not a rarity.

The uniqueness lies elsewhere — in what the repository demonstrates, not in what the player perceives.

## The three genuine differentiators

### 1. The inverse AI posture

Nearly every public "AI in games" demonstration makes the model load-bearing and unbounded. This project inverts that, and enforces the inversion through architecture rather than promises:

- The optional AI guide can only **reword one action the game has already computed** — the Worker independently recomputes the permitted next step and discards any reply that deviates ([`workers/maestro-guide.js`](../workers/maestro-guide.js), [`js/game-core.js`](../js/game-core.js) `validateGuidance`).
- The deployment **fails closed**: an AI key without origin pinning and rate limiting refuses service entirely.
- The game is **provably complete with no AI configured** — authored hints answer every tier.

The [planned AI roadmap](../README.md#planned-ai-roadmap) sharpens this into territory that essentially does not exist publicly: a static GitHub Pages game combining on-device inference, free-text NPC conversation behind a deterministic intent enum, and an adversarial red-team corpus replayed in CI.

### 2. An evidence chain at hobby scale

Every accepted behavior traces from an OpenSpec requirement through GIVEN/WHEN/THEN scenarios to tests and dated failing/passing evidence, machine-checkable via the [SpecFact bundle](../.specfact/projects/ancient-secrets/). Enterprise teams rarely sustain this discipline; portfolio projects almost never attempt it. The repository itself is the demonstration — a reviewer can trace any claim to a requirement ID and a test. The game is the vehicle; the evidence chain is the product.

### 3. An unoccupied content niche

No game teaches FinOps. The proposed [Codex Rationum expedition](../README.md#planned-extension-the-codex-rationum) teaches the discipline through documented historical instruments — Hammurabi's interest caps, nilometer forecasting, Athenian liturgies, publicani contracts, Templar letters of credit, Pacioli's double-entry method — for a real practitioner community, while claiming no certification.

## Shipped versus proposed — the honest status

| Claim | Status |
|---|---|
| Bounded, fail-closed AI guidance with authored fallback | **Shipped** |
| Requirement → test → evidence chain (OpenSpec + SpecFact) | **Shipped** |
| Guardrail contract + adversarial eval harness in CI | Proposed — [`ai-guardrail-evals`](../openspec/changes/ai-guardrail-evals/proposal.md) |
| On-device LLM guidance, zero egress | Proposed — [`on-device-guidance`](../openspec/changes/on-device-guidance/proposal.md) |
| Free-text NPC talk behind a deterministic intent boundary | Proposed — [`local-npc-conversation`](../openspec/changes/local-npc-conversation/proposal.md) |
| Generate-then-verify puzzle pipeline | Proposed — [`verified-puzzle-pipeline`](../openspec/changes/verified-puzzle-pipeline/proposal.md) |
| Rubric-bounded LLM judge for learning debriefs | Proposed — [`expedition-debrief-judge`](../openspec/changes/expedition-debrief-judge/proposal.md) |
| FinOps expedition (Codex Rationum) | Proposed — [`temporal-finops-expedition`](../openspec/changes/temporal-finops-expedition/proposal.md) |

The consequence is stated plainly: **most of the uniqueness currently lives in specifications, not code.** Calling the project "state of the art" today would be overreach. The claim becomes defensible once `ai-guardrail-evals` and `on-device-guidance` ship — then the differentiator is demonstrated, not planned. Until then, this document deliberately labels every aspiration as proposed.

## Who this is for

- **Hiring reviewers and technical peers** — the primary audience. The engineering judgment, guardrail architecture, and evidence discipline are the exhibit.
- **The FinOps community** — the expedition, once built, targets practitioners who have no game-shaped way to teach their discipline.
- **Players** — get a polished, accessible short mystery. They will never see the engineering, and that is the point: responsible AI done well is invisible at play time.
