# Design: AI case study and threat model

## 1. Document outlines

**ai-case-study.md**: 1 Why AI is optional by design; 2 Authoring-time AI (art pipeline with manifest, generate-then-verify puzzle pipeline); 3 Runtime AI (guidance worker, on-device inference, NPC conversation, debrief judge — each with its boundary diagram and fallback story); 4 The spec-driven agentic workflow (OpenSpec changes, SpecFact bundle, TDD evidence discipline); 5 The evaluation story (adversarial corpus, replay CI, live evaluations, model-swap gate); 6 Status table: implemented vs proposed, per change.

**ai-threat-model.md**: 1 Method; 2 Surface inventory; 3 Per-surface analysis; 4 Cross-cutting mitigations (the guardrail contract); 5 Accepted risks; 6 Maintenance rule.

## 2. Traceability convention

Every claim carries an inline reference: a requirement ID resolvable in `openspec/changes/*/specs/**/spec.md`, or a repo-relative path to committed evidence (validation matrix row, transcript, verdict log). A claim without a reference is a defect (CS-002).

## 3. Threat-model method

STRIDE-lite per boundary: for each surface (guidance worker, browser-native inference runtime, NPC conversation, debrief judge, authoring pipelines) enumerate attacker positions (hostile player input, compromised model output, hostile network origin, malicious save file), list threats, and map each to its mitigating requirement or an explicit accepted-risk entry with rationale. The register explicitly records that canonical-identifier validation is not a general semantic-fact checker. Surfaces at proposal stage are analyzed against their specs and marked proposed.

## 4. Maintenance hook

TM-003 makes the baseline threat model a prerequisite for AI-surface implementation and makes subsequent threat-model updates a merge condition — the same governance pattern as GR-006/AE-005, referenced from those requirements' review checklists.
