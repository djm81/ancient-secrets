# Validation matrix: continuous-quality-gates

Status: **in progress** — local workflow-contract evidence is recorded; the remote PR run remains pending.

| Requirement | Evidence type | Evidence | Status |
|---|---|---|---|
| CQ-001 workflow validates every push and PR | workflow contract + remote run | Local contract test passed; initial remote run [29865336879](https://github.com/djm81/ancient-secrets/actions/runs/29865336879) passed on 2026-07-21 | re-run pending after action-runtime update |
| CQ-002 quality checks run with read-only permissions | workflow contract | `tests/quality-gates-workflow.test.js` asserts `contents: read` and no deploy/write permissions | local pass |
| CQ-003 workflow remains independent of Pages deployment | workflow review + remote run | Contract test excludes Pages deployment actions; workflow contains no deployment job; initial remote run 29865336879 passed without deployment | local + remote pass; clean re-run pending |

Required commands: `npm run check`, `npm test`, `git diff --check`, `openspec validate continuous-quality-gates --strict`.
