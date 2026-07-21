# Validation matrix: installable-offline-web-app

Status: **pending**.

| Requirement | Evidence type | Evidence | Status |
|---|---|---|---|
| PWA-001 installable identity and direct game launch | manifest test + manual install | — | pending |
| PWA-002 progressive install guidance | browser test + platform manual | — | pending |
| OGS-001 offline core launch and authored guidance | browser offline test + manual device | — | pending |
| OGS-002 cache boundary excludes remote/AI content | service-worker unit + network inspection | — | pending |
| OGS-003 update handoff protects active chronicle | unit + browser lifecycle test | — | pending |
| OGS-004 validated local save recovery | unit + manual export/import | — | pending |
| OGS-005 optional offline era packs are consented and failure-safe | unit + manual storage test | — | pending |

Required commands: `npm run check`, `npm test`, `npm run test:browser`, `npm run test:a11y`, `git diff --check`, and `openspec validate installable-offline-web-app --strict`.
