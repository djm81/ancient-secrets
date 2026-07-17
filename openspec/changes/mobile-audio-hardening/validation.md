# Validation matrix: mobile-audio-hardening

| Requirement | Evidence type | Evidence | Status |
| --- | --- | --- | --- |
| MG-001 Portrait scene/actions | Playwright portrait interaction + manual 390 × 844 | Initial portrait scenario passed 2026-07-15T22:06:32+02:00; delayed-trapdoor regression passed 2026-07-15T22:41:36+02:00; screenshot review at 390 × 844 | passed locally |
| MG-002 Portrait overlays | Playwright dialogue check + manual 390 × 844 | `MG-002` browser scenario passed 2026-07-15T22:06:32+02:00; baker dialogue screenshot reviewed at 390 × 844 | passed locally |
| MA-001 Suspended Web Audio | Playwright fake-context resume/order checks + manual device check | Initial suspended-context scenario passed 2026-07-15T22:06:32+02:00; lifecycle-suspension scheduler regression passed 2026-07-15T22:53:17+02:00; physical-phone audio check remains pending | automated passed; device check pending |
| MA-001 iOS non-running resume | Playwright fake-context retry check + physical iOS check | iOS-style resolved-but-suspended retry scenario passed 2026-07-17; physical iOS audio check remains release QA | automated passed; device check pending |
| MA-001 direct-tap first source and state feedback | Playwright delayed-resume control scenario + 390 × 844 review + physical iOS check | Delayed-resume direct-tap scenario passed 2026-07-17; phone HUD review shows the active music glyph. Connected iPhone output verification remains release QA. | automated passed; device check pending |
| FTA-001 First-chronicle orientation | Playwright new/start/dismiss/continue scenarios + manual keyboard check | `FTA-001` passed 2026-07-17; manual first-time assistant screenshot reviewed at 390 × 844 | passed locally |
| MG-002 Responsive dialogue controls | Playwright narrow/short landscape layout check + manual screenshot review | Short 844 × 390 dialogue scenario passed 2026-07-17; workshop interaction/dialogue screenshot reviewed at 844 × 390 | passed locally |
| MG-002 Desktop art-aware dialogue placement | Playwright baker-dialogue geometry + desktop and phone screenshot review | Targeted 1024 × 600 regression passed 2026-07-17; settled-state review confirms lower-right desktop parchment placement and unchanged 390 × 844 in-flow copy | passed locally |

## Manual scenario notes

- **2026-07-15 (Europe/Berlin):** local Chromium at 390 × 844 showed the portrait title, complete scene, 44 px action controls, mirror pickup, Piazza navigation, and readable baker dialogue. A 1440 × 900 screenshot confirmed the desktop scene layout remains intact.
- **Audio limit:** suspended-context behavior is covered with a browser fake context. Physical iOS/Android audio output has not been observed in this environment and remains release QA.
- **2026-07-17 (Europe/Berlin):** local Chromium at 390 × 844 showed the complete first-chronicle assistant and its touch-sized dismissal control. At 844 × 390, the workshop scene kept its labelled navigation, hand-mirror interaction, and note overlay within the visible stage. A 1440 × 900 screenshot reconfirmed the desktop scene layout.
