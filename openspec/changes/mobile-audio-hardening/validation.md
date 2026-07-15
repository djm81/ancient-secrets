# Validation matrix: mobile-audio-hardening

| Requirement | Evidence type | Evidence | Status |
| --- | --- | --- | --- |
| MG-001 Portrait scene/actions | Playwright portrait interaction + manual 390 × 844 | Initial portrait scenario passed 2026-07-15T22:06:32+02:00; delayed-trapdoor regression passed 2026-07-15T22:41:36+02:00; screenshot review at 390 × 844 | passed locally |
| MG-002 Portrait overlays | Playwright dialogue check + manual 390 × 844 | `MG-002` browser scenario passed 2026-07-15T22:06:32+02:00; baker dialogue screenshot reviewed at 390 × 844 | passed locally |
| MA-001 Suspended Web Audio | Playwright fake-context resume/order checks + manual device check | Initial suspended-context scenario passed 2026-07-15T22:06:32+02:00; lifecycle-suspension scheduler regression passed 2026-07-15T22:53:17+02:00; physical-phone audio check remains pending | automated passed; device check pending |

## Manual scenario notes

- **2026-07-15 (Europe/Berlin):** local Chromium at 390 × 844 showed the portrait title, complete scene, 44 px action controls, mirror pickup, Piazza navigation, and readable baker dialogue. A 1440 × 900 screenshot confirmed the desktop scene layout remains intact.
- **Audio limit:** suspended-context behavior is covered with a browser fake context. Physical iOS/Android audio output has not been observed in this environment and remains release QA.
