# Validation matrix: continuous-quality-gates

Status: **complete** — local contract and remote PR-run evidence are recorded.

| Requirement | Evidence type | Evidence | Status |
|---|---|---|---|
| CQ-001 workflow validates every push and PR | workflow contract + remote run | Local contract test passed; clean remote run [29865466167](https://github.com/djm81/ancient-secrets/actions/runs/29865466167) passed on 2026-07-21 | pass |
| CQ-002 quality checks run with read-only permissions | workflow contract | `tests/quality-gates-workflow.test.js` asserts `contents: read` and no deploy/write permissions | local pass |
| CQ-003 workflow remains independent of Pages deployment | workflow review + remote run | Contract test excludes Pages deployment actions; workflow contains no deployment job; clean remote run 29865466167 passed without deployment | pass |

Required commands: `npm run check`, `npm test`, `git diff --check`, `openspec validate continuous-quality-gates --strict`.
