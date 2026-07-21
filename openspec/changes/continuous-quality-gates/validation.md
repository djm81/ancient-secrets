# Validation matrix: continuous-quality-gates

Status: **in progress** — local workflow-contract evidence is recorded; the remote PR run remains pending.

| Requirement | Evidence type | Evidence | Status |
|---|---|---|---|
| CQ-001 workflow validates every push and PR | workflow contract + remote run | `tests/quality-gates-workflow.test.js` passed on 2026-07-21 | local pass; remote run pending |
| CQ-002 quality checks run with read-only permissions | workflow contract | `tests/quality-gates-workflow.test.js` asserts `contents: read` and no deploy/write permissions | local pass |
| CQ-003 workflow remains independent of Pages deployment | workflow review + remote run | Contract test excludes Pages deployment actions; workflow contains no deployment job | local pass; remote run pending |

Required commands: `npm run check`, `npm test`, `git diff --check`, `openspec validate continuous-quality-gates --strict`.
