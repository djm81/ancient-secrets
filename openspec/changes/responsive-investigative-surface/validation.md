# Validation matrix: responsive-investigative-surface

Status: **pending**.

| Requirement | Evidence type | Evidence | Status |
|---|---|---|---|
| RI-001 contextual actions preserve complete action access | unit + browser | — | pending |
| RI-002 four explicit responsive modes | browser matrix + manual | — | pending |
| RI-003 rotation and resize preserve play state and focus | browser + manual device | — | pending |
| RI-004 input parity and no precision/hover dependency | browser + manual keyboard/touch | — | pending |
| RI-005 safe-area and target-size contract | browser geometry + manual device | — | pending |

Required commands: `npm run check`, `npm test`, `npm run test:browser`, `npm run test:a11y`, `git diff --check`, and `openspec validate responsive-investigative-surface --strict`.
