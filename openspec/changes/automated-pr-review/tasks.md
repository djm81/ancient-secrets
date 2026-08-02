## 1. Specification and failing evidence

- [x] 1.1 Add proposal, design, review-policy specification, and validation matrix.
- [x] 1.2 Record the missing-configuration failing contract check in `TDD_EVIDENCE.md`.

## 2. Implementation

- [x] 2.1 Add `.coderabbit.yaml`, adapted for this static game rather than copied verbatim from the source repository.
- [x] 2.2 Add README review-operating-model and local validation instructions.

## 3. Verification

- [x] 3.1 Record passing YAML/branch-policy contract evidence.
- [x] 3.2 Run `npm run check`, `npm test`, `git diff --check`, and the documented local contract check.
- [x] 3.3 Inspect the changed configuration and README diff; record the result in `validation.md`.
- [x] 3.4 Ensure the local contract and documentation cover both base branches, draft exclusion, and no incremental-review pause; review-follow-up evidence is recorded in `TDD_EVIDENCE.md`.
- [x] 3.5 Verify automatic review is enabled and every configured policy path retains its required guidance; negative-fixture coverage is recorded in `TDD_EVIDENCE.md`.
