# Implementation Plan: Card Component

**Branch**: `09-card-component` | **Date**: 2026-06-30 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/09-card-component/spec.md`. Upstream inputs:
`tokens/tokens.css` (Feature 06, Final), `specs/05-define-typography-system/typography-system.md`
(`heading-subsection`, `body-default`, `body-secondary`, `caption` roles), `.specify/memory/constitution.md`
v1.0.0, and the already-implemented `src/components/button/button.tsx` (Feature 07, polymorphic
`as="button"|"a"` pattern, focus-ring convention) and `src/components/field/` (Feature 08,
multi-region composition pattern) — current-state code inspected directly, not assumed.

## Summary

Add the design system's third component: a `Card` container supporting two independent axes
— variant (`informational` | `interactive`) and layout (`vertical` | `horizontal`) — with
optional `heading`, `media` (horizontal layout only), and `footer` regions around a required
body (`children`). The interactive variant reuses Button's exact polymorphic element set
(`as="a"|"button"`, no `div`+`role="button"`) for native keyboard activation, adds a
`selected` state, and a `disabled` state that suppresses interaction. Body overflow in a
consumer-flagged fixed-height layout truncates via a 3-line clamp (clarified in spec). All
color/typography styling resolves to existing `tokens.css` roles — no shadow/elevation
primitive is introduced (clarified in spec) and no new spacing/radius scale is introduced,
consistent with Features 06-08. Single new file family under `src/components/card/`, no new
dependencies.

## Technical Context

**Language/Version**: TypeScript ~5.7, ES2022 target, React 19 JSX — unchanged from Features
07-08.

**Primary Dependencies**: `class-variance-authority` ^0.7, `clsx`/`tailwind-merge` (via the
existing `cn()` helper in `src/lib/utils.ts`) — the same set Button and Field use, no
additions. No new icon/media library: the `media` slot (a dedicated region, horizontal layout
only) accepts a generic `ReactNode`, mirroring Button's `leadingIcon`/`trailingIcon` pattern
and the spec Assumption that image-handling is the consuming app's own responsibility.

**Storage**: N/A.

**Testing**: Vitest + `@testing-library/react` + `@testing-library/jest-dom` +
`@testing-library/user-event` (already devDependencies) — covers rendering both layouts, both
variants, all interactive states (rest/hover/focus/pressed/selected/disabled), keyboard
activation, nested-interactive-element non-interference (Edge Case), and the line-clamp
opt-in.

**Target Platform**: Browser, same two consumption paths validated in Features 07-08
(`gridu-web` native React 19, `gridu-landing` via Astro + `@astrojs/preact` compat) — no new
platform surface.

**Project Type**: Component library (single existing package, third component added).

**Performance Goals**: N/A — presentational component; no perf budget beyond native DOM cost.

**Constraints**: Zero new color or typography values (FR-002, FR-003, SC-002). Zero
shadow/elevation primitive — depth conveyed by `border` only (FR-002, spec Clarifications).
Zero new spacing/sizing/radius scale (FR-011, constitution Principle I, matching Feature 06's
FR-009 precedent). Zero edits to `gridu-web` source (migration explicitly out of scope per
spec Assumptions). Selected/disabled interactive cards never rely on color alone (FR-007).

**Scale/Scope**: 1 component family (`Card` + region children), 2 variants × 2 layouts × 6
interactive states (some mutually exclusive — disabled suppresses hover/focus/pressed per
spec Edge Cases) + 3 optional regions (heading, media, footer).

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Result | Reasoning |
|---|---|---|
| I. Default Over Configure | PASS | Variant and layout are each closed two-value sets (FR-004/FR-005, FR-014), not open string props; the interactive element set is fixed to `a`\|`button` (no `div`+`role="button"` configurability); truncation is a fixed 3-line clamp (spec Clarifications), not a configurable line count. |
| II. Fail Loud, Never Silent | PASS | Overflowing body text in a fixed-height card is never silently clipped — it gets a visible ellipsis at a documented, consistent line count (FR-015); a selected card's state is never conveyed by color alone, so it can't be silently missed by a color-blind user (FR-007). |
| III. Outcome First | N/A | Governs message wording, not a container primitive's visual API; no structural conflict — Card renders whatever heading/body/footer content the consumer supplies without altering its ordering. |
| IV. Scale To One, Not A Thousand | PASS | No multi-card orchestration (grid system, virtualization, list state management) is introduced — Card is a single-item presentation primitive; the consumer owns layout of multiple cards, consistent with Features 07-08's "no speculative infra" precedent. |
| V. Calm Under Pressure | PASS | Disabled state uses the same plain opacity/border treatment Button's `disabled:opacity-50` already establishes — no alarmed styling; selected state uses border weight (plus an optional icon), not motion or exclamation-styled emphasis. |

No violations. Complexity Tracking section omitted.

## Project Structure

### Documentation (this feature)

```text
specs/09-card-component/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # Phase 1 output (/speckit-plan command)
│   └── card-api.md
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)

```text
gridu-design-system/
├── tokens/
│   └── tokens.css              # EXISTING (Feature 06) — Card consumes background/
│                                #   muted-surface/border/ring roles, edits none
├── src/
│   ├── index.ts                  # EDIT — barrel-export Card and its types
│   └── components/
│       ├── button/                # EXISTING (Feature 07) — untouched
│       ├── field/                 # EXISTING (Feature 08) — untouched
│       └── card/
│           ├── card.tsx              # NEW — root container: variant × layout, polymorphic
│           │                          #   as="a"|"button" for the interactive variant
│           ├── card.test.tsx         # NEW — Vitest + Testing Library coverage
│           └── README.md             # NEW — token mapping + adoption note, mirrors
│                                      #   button/README.md and field/README.md
└── playground/
    └── main.tsx                  # EDIT — add a Card permutation section alongside the
                                   #   existing Button and Field playground sections
```

**Structure Decision**: Same single-package component library layout Features 07-08
established (no Option change). Unlike Field (4 files: composition root + label + message +
input), Card ships as a single `card.tsx` file — its heading/media/footer regions are plain
content slots passed as props (no independent ARIA id-threading like Field's
label↔input↔message association), so a single component matches the actual complexity,
consistent with Button's own single-file precedent and the constitution's "Default Over
Configure" principle (no speculative subcomponent split).

## Complexity Tracking

*No violations — section intentionally left without entries.*
