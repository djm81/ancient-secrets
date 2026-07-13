# AGENTS.md

This is the mandatory, lightweight governance surface for work in **The Maestro’s Secret**.

## Bootstrap

1. Read this file and `openspec/project.md`.
2. Inspect repository root, active branch, and worktree status before editing.
3. For a behavior, public-interface, or deployment change, identify an active OpenSpec change under `openspec/changes/` and read its proposal, design, tasks, relevant specs, and validation matrix.
4. State any material assumption before changing code. If the change is ambiguous, ask one focused question instead of expanding scope.

## Precedence

1. System and developer instructions
2. Explicit user direction
3. This file
4. `openspec/config.yaml`
5. Active OpenSpec change artifacts

## Delivery discipline

- Keep changes small, intentional, and traceable to a user request, an accepted OpenSpec requirement, or a verification fix.
- For changed behavior: **spec → tests → failing evidence → implementation → passing evidence**. Translate every material Given/When/Then scenario into at least one automated or explicitly recorded manual check.
- Before coding, update or create `openspec/changes/<change-id>/TDD_EVIDENCE.md`. Record the command, timestamp, expected failing result, passing result, and any justified exception.
- Do not silently broaden an active change. Update its proposal/design/specs/tasks first when scope, public interfaces, or architecture changes.
- Preserve the static-first experience: AI guidance is optional, no provider secret belongs in client code, and all core progression needs an authored fallback.
- Avoid drive-by refactors, speculative abstractions, unrelated formatting, accounts, analytics, or free-form chat unless a reviewed OpenSpec change explicitly requires them.

## Required gates

Run the relevant gates before reporting implementation complete:

```bash
npm run check
npm test
git diff --check
```

- Run the affected browser/manual scenarios from the active change’s `validation.md`; record concrete evidence there.
- Inspect changed UI at desktop and narrow/mobile widths when the change affects presentation or interaction.
- Update README and deployment notes when public behavior, setup, security boundaries, or validation commands change.

## Completion

- Mark tasks complete only with corresponding evidence.
- Do not archive an OpenSpec change until its requirements are implemented, validation evidence is complete, and the user accepts or merges the work.
- Report assumptions, tests run, known limits, and a safe rollback path.
