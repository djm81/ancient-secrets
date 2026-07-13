# Validation evidence matrix

Record concrete evidence in the **Evidence** column before merging. A command alone is not evidence unless its dated output or CI run is linked/attached.

| Requirement | Automated evidence | Manual evidence | Status | Evidence |
| --- | --- | --- | --- | --- |
| PE-001 Portfolio landing page | Static contract + Playwright narrow-viewport test | Desktop + 390 × 844 visual review | Passed locally | TDD evidence, 2026-07-13 |
| PE-002 Objective/progress strip | `game-core.test.js`, static game contract | New-chronicle objective inspected | Passed locally | TDD evidence, 2026-07-13 |
| BG-001 Fixed-action guidance | `game-core.test.js` | Fallback request leaves scene/inventory unchanged | Passed locally | TDD evidence, 2026-07-13 |
| BG-002 Endpoint input validation | `worker.test.js` covers malformed action, unknown values, extra fields, and 4 KiB body | Deployed endpoint check | Passed locally / deployment pending | TDD evidence, 2026-07-13 |
| BG-003 Fallback guidance | `guidance-client.test.js` | No-endpoint authored fallback inspected | Passed locally | TDD evidence, 2026-07-13 |
| BG-004 Secret and payload boundary | Worker/client contract tests; client secret scan is clean | Inspect deployed request | Passed locally / deployment pending | `rg` scan, 2026-07-13; README + TDD evidence |
| BG-005 Rate limit | Worker binding tests + client fallback test | Inspect deployed Cloudflare WAF response | Passed locally / WAF pending | TDD evidence, 2026-07-13 |
| GC-001 Save/resume | Unit + Playwright refresh-during-reward coverage | Refresh restored route, trapdoor, and gear reward | Passed locally | TDD evidence, 2026-07-13 |
| GC-002 Corrupted/unavailable saves | `game-core.test.js`, `browser-storage.test.js` | Browser storage denial smoke check | Passed locally | TDD evidence, 2026-07-13 |
| EQ-001 Keyboard flow | Playwright keyboard opening sequence + axe scan | 33 hotspot semantics confirmed | Passed locally | TDD evidence, 2026-07-13 |
| EQ-002 Preferences/live feedback | Playwright contrast/reduced-motion test + axe scan | Contrast persistence inspected | Passed locally | TDD evidence, 2026-07-13 |
| QA-001 CI gate | Workflow runs Node, Playwright, and axe commands before Pages build | Review successful remote workflow | Pending remote CI | `.github/workflows/jekyll-gh-pages.yml` |

## Required commands

```bash
npm run check
npm test
npm run test:browser
npm run test:a11y
```

The production WAF response and remote CI run remain merge evidence to collect after deployment.
