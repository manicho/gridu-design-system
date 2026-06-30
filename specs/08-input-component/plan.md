# Implementation Plan: Input Component

**Branch**: `08-input-component` | **Date**: 2026-06-30 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/08-input-component/spec.md`. Upstream inputs:
`tokens/tokens.css` (Feature 06, Final), `specs/05-define-typography-system/typography-system.md`
(`label`/`caption` roles), `.specify/memory/constitution.md` v1.0.0, and the already-implemented
`src/components/button/button.tsx` (Feature 07) — current-state code inspected directly, not
assumed, for the package's tooling, `cva`/`cn` pattern, and focus-ring convention this feature
reuses.

## Summary

Add the design system's second component: a React 19 `Field` composition (`Field`,
`FieldLabel`, `FieldHelperText`/`FieldError`, and the underlying `Input` control) covering
the 6 text input types (FR-001), 6 states (rest/hover/focus/disabled/read-only/error), and
optional leading/trailing icon adornments — styled exclusively through `tokens.css`'s
existing `input`/`ring`/`destructive` color roles and the typography system's `label`/`caption`
roles, using the same `class-variance-authority` + `cn()` pattern Button already established.
No new tooling, dependencies, or build configuration — this feature reuses the package
infrastructure Feature 07 stood up.

## Technical Context

**Language/Version**: TypeScript ~5.7, ES2022 target, React 19 JSX — unchanged from Feature 07.

**Primary Dependencies**: `class-variance-authority` ^0.7, `clsx`/`tailwind-merge` (via the
existing `cn()` helper in `src/lib/utils.ts`) — the same set Button uses, no additions. No new
icon library: leading/trailing icons are accepted as a generic `ReactNode` slot (mirrors
Button's `leadingIcon`/`trailingIcon` pattern, spec Assumption "icon adornments use whatever
icon set the consuming app already provides").

**Storage**: N/A.

**Testing**: Vitest + `@testing-library/react` + `@testing-library/jest-dom` + `@testing-library/user-event`
(already devDependencies from Feature 07) — covers typing, focus, disabled/read-only
interaction blocking, and error-text accessible association (`aria-describedby`).

**Target Platform**: Browser, same two consumption paths validated in Feature 07
(`gridu-web` native React 19, `gridu-landing` via Astro + `@astrojs/preact` compat) — this
feature introduces no new platform surface.

**Project Type**: Component library (single existing package, second component added).

**Performance Goals**: N/A — presentational/form-state component; no perf budget beyond
native DOM input cost.

**Constraints**: Zero new color or typography values (FR-011, FR-012, SC-002) — every
utility class resolves to a role already in `tokens.css` or `typography-system.md`. Zero
edits to `gridu-web`/`gridu-landing` source (migration explicitly out of scope per spec
Assumptions). Validation logic stays a consumer concern — the component only renders the
error state/message it is given (spec Assumptions), it does not ship a validation library.

**Scale/Scope**: 1 composed component (`Field` + `Input` + `FieldLabel` + helper/error text),
6 input types × 6 states (some mutually exclusive per Edge Cases — e.g. disabled suppresses
error) + 2 optional icon slots.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Result | Reasoning |
|---|---|---|
| I. Default Over Configure | PASS | Input types are a closed set (FR-001's 6 types), not an open string prop; helper-vs-error is resolved automatically (error always wins, spec Edge Cases) rather than requiring the consumer to manually hide one or the other. |
| II. Fail Loud, Never Silent | PASS | This is the principle's most direct UI expression yet: FR-005/FR-006 require the error and required-state to be both visually shown and programmatically announced — a validation failure can't be silently missed by a screen reader user, matching Button's icon-only-name-as-compile-error precedent (Feature 07) but applied to runtime state rather than authoring time, since validity is inherently dynamic. |
| III. Outcome First | N/A | Governs message wording, not a form-field primitive's visual API; no structural conflict — the component renders whatever error text the consumer supplies without altering its ordering. |
| IV. Scale To One, Not A Thousand | PASS | No multi-field form orchestration (cross-field validation, wizard state, schema-driven forms) is introduced — this feature is a single field's presentation, consistent with Feature 07's "no Storybook, no speculative infra" precedent. |
| V. Calm Under Pressure | PASS | Error state uses the same `destructive` token Button's destructive variant uses — color/weight only, no shake animation, alarmed icon, or exclamation-styled copy requirement. |

No violations. Complexity Tracking section omitted.

## Project Structure

### Documentation (this feature)

```text
specs/08-input-component/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # Phase 1 output (/speckit-plan command)
│   └── field-api.md
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)

```text
gridu-design-system/
├── tokens/
│   └── tokens.css              # EXISTING (Feature 06) — Field/Input consume input/ring/
│                                #   destructive roles, edits none
├── src/
│   ├── index.ts                  # EDIT — barrel-export Field, FieldLabel, Input, and related types
│   └── components/
│       ├── button/                # EXISTING (Feature 07) — untouched
│       └── field/
│           ├── input.tsx             # NEW — bare <input> element, cva-styled, all 6 types
│           ├── field.tsx             # NEW — composition root: label + input + helper/error slot
│           ├── field-label.tsx       # NEW — label element, required-indicator rendering
│           ├── field-message.tsx     # NEW — shared helper/error text renderer (mutually exclusive)
│           ├── field.test.tsx        # NEW — Vitest + Testing Library coverage
│           └── README.md             # NEW — token mapping + adoption note, mirrors button/README.md
└── playground/
    └── main.tsx                  # EDIT — add a Field/Input permutation section alongside
                                   #   the existing Button playground
```

**Structure Decision**: Same single-package component library layout Feature 07 established
(no Option change). New components live under `src/components/field/` as a small composed
unit (4 files) rather than a single monolithic `input.tsx`, because the spec's User Story 1
(bare field) and User Story 2/3 (error + a11y association) genuinely need separable
label/message pieces to keep `aria-describedby` wiring legible — this mirrors Button's own
internal decomposition (variants object, content branch) without introducing a new package
or build target.

## Complexity Tracking

*No violations — section intentionally left without entries.*
