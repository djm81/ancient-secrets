# Change: AI engineering case study and AI-surface threat model

## Why

The repository is explicitly a public proof of engineering judgment, yet its most differentiating quality — a growing AI surface built entirely inside verifiable guardrails — is legible only by reading code and scattered specs. A reviewer, community reader, or security auditor should be able to understand the whole architecture, its threat model, and its evidence trail from two documents. Writing them also imposes a useful discipline: every claim must trace to a requirement ID or committed evidence, and every AI surface must have an enumerated threat analysis.

## What Changes

- Add **`docs/ai-case-study.md`**: how AI is used across the project — the authoring-time art pipeline (extending `assets/dialogue/ART_MANIFEST.md`), the spec-driven agentic development workflow (OpenSpec + SpecFact + TDD evidence), the runtime guardrail architecture (guidance worker, local inference, NPC conversation, debrief judge), and the evaluation evidence trail.
- Add **`docs/ai-threat-model.md`**: an enumeration of every AI surface with its trust boundaries, attacker capabilities, enumerated threats, and the mitigating requirement each threat maps to (or an explicit accepted-risk entry).
- Link both documents from the README and establish the governance rule that new AI surfaces update the threat model before merge.

## Capabilities

- **ai-case-study** — the case-study document, its coverage, and its traceability convention.
- **ai-threat-model** — the threat-model document, its surface enumeration, mitigation mapping, and maintenance rule.

## Impact

- New files under `docs/` plus README links; no runtime, test, or payload change beyond negligible static markdown.
- **No `openspec/project.md` non-negotiable is touched.**
- Documents may describe sibling changes at proposal stage, clearly labeled as proposed versus implemented.

## Constraints

- Every architectural claim cites a requirement ID (GR-, AE-, LM-, LI-, GB-, NC-, IB-, SF-, AG-, VP-, FR-, DJ-) or a committed evidence artifact; no unevidenced claims.
- Plain static markdown rendered by GitHub; no documentation tooling or build step.
- Honest labeling: proposed capabilities are marked proposed; nothing implies implementation that has not happened.

## Rollback

Delete the two documents and their README links; nothing depends on them.

## Out of scope

- Marketing copy, blog syndication, generated documentation tooling, certification or compliance claims.
