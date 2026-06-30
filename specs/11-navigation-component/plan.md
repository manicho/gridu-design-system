# Implementation Plan: Navigation Component

**Branch**: `11-navigation-component` | **Date**: 2026-06-30 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/11-navigation-component/spec.md`. Upstream
inputs: `tokens/tokens.css` (Feature 06, Final), `specs/05-define-typography-system/typography-system.md`,
`.specify/memory/constitution.md` v1.0.0, and the already-implemented
`src/components/button/button.tsx` (Feature 07, polymorphic `as: "button" | "a"` and
focus-ring convention), `src/components/field/` (Feature 08, id-threading pattern), and
`src/components/card/card.tsx` (Feature 09, `aria-disabled` + interactive-variant precedent)
— current-state code inspected directly, not assumed.

## Summary

Add the design system's fifth component: a `Navigation` primitive rendering an ordered list
of `NavItem` destinations (label + optional leading icon), each a polymorphic `<a>`/`<button>`
following Button's `as` convention. Exactly one destination may carry `active` (consumer-
supplied, never inferred — FR-004), rendered with `aria-current="page"` plus a non-color
indicator (a `border`-token side/under-line, consistent with Card's "more than color alone"
precedent for `selected`). A `disabled` destination uses the same `aria-disabled` +
pointer/focus-suppression pattern Card already established, not a separate exported state
component. `layout: "vertical" | "horizontal"` controls axis only — same prop name and
binary shape as Card's `layout`, no third value. Labels truncate via `truncate` (Tailwind) +
a `title` attribute carrying the full label, mirroring Table's cell-truncation precedent
(FR-012). The root renders a native `<nav>` so the landmark and AT semantics are free, no
extra `role` plumbing needed. Single new file family under `src/components/navigation/`, no
new dependencies.

## Technical Context

**Language/Version**: TypeScript ~5.7, ES2022 target, React 19 JSX — unchanged from Features
07-10.

**Primary Dependencies**: `class-variance-authority` ^0.7, `clsx`/`tailwind-merge` (via the
existing `cn()` helper in `src/lib/utils.ts`) — the same set Button, Field, Card, and Table
use, no additions.

**Storage**: N/A.

**Testing**: Vitest + `@testing-library/react` + `@testing-library/jest-dom` +
`@testing-library/user-event` (already devDependencies) — covers vertical/horizontal layout
rendering, active-item indication (`aria-current` + non-color visual), zero-or-one active
enforcement at the consumer-prop level, disabled-item focus/activation suppression and
`aria-disabled` announcement, keyboard operability (Tab order skips disabled items, Enter/
click activates enabled ones), label truncation + `title` fallback, missing-icon resilience
(FR-014), and empty-list rendering (FR-013).

**Target Platform**: Browser, same two consumption paths validated in Features 07-10
(`gridu-web` native React 19, `gridu-landing` via Astro + `@astrojs/preact` compat) — no new
platform surface.

**Project Type**: Component library (single existing package, fifth component added).

**Performance Goals**: N/A — presentational component over a small, consumer-supplied
destination list (spec Assumptions: single-level, no nesting); no virtualization or perf
budget beyond native DOM cost.

**Constraints**: Zero new color or typography values (FR-007, FR-008, SC-002). Zero new
spacing/sizing scale (FR-009, constitution Principle I, matching Features 06-10's
precedent). Zero nested/grouped navigation, zero collapsible icon-only mode, zero responsive
overflow/hamburger handling (spec Assumptions, constitution Principles I and IV). Zero edits
to `gridu-web`'s existing sidebar or `gridu-landing`'s existing header (migration explicitly
out of scope per spec Assumptions). Active-destination determination stays a consuming-app
concern — the component never reads the URL/router itself (spec Assumptions).

**Scale/Scope**: 1 component family (`Navigation` root + `NavItem`, no standalone Icon
subcomponent), 1 required base layer (ordered destination list) + 1 layout axis switch
(vertical/horizontal) + 2 per-item state layers (active, disabled).

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Result | Reasoning |
|---|---|---|
| I. Default Over Configure | PASS | Nested/grouped items, icon-only collapse, and responsive overflow are each excluded rather than built as speculative configuration (spec Assumptions); layout is a fixed binary switch (vertical/horizontal), not an open-ended axis/breakpoint config. |
| II. Fail Loud, Never Silent | PASS | A missing/failed icon never hides or blocks the label (FR-014); a disabled destination is always announced as such to AT (FR-011), never silently unreachable with no explanation; truncated labels keep the full text available via `title` (FR-012). |
| III. Outcome First | N/A | Governs message wording, not a navigation primitive's visual API; no structural conflict. |
| IV. Scale To One, Not A Thousand | PASS | No multi-level/grouped nav, no per-destination permission engine beyond a binary disabled flag, no responsive collapse system — all deferred until a real `gridu-web` screen (Phase 2a) demonstrates the need (spec Assumptions). |
| V. Calm Under Pressure | PASS | The active indicator and disabled treatment both use the same even, plain token-based styling as Button/Card's existing states — no alarm-styled or attention-grabbing treatment for either. |

No violations. Complexity Tracking section omitted.

## Project Structure

### Documentation (this feature)

```text
specs/11-navigation-component/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # Phase 1 output (/speckit-plan command)
│   └── navigation-api.md
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)

```text
gridu-design-system/
├── tokens/
│   └── tokens.css              # EXISTING (Feature 06) — Navigation consumes background/
│                                #   muted-surface/border/ring/foreground/muted-foreground
│                                #   roles and label/body-default typography roles, edits none
├── src/
│   ├── index.ts                  # EDIT — barrel-export Navigation, NavItem, and their types
│   └── components/
│       ├── button/                # EXISTING (Feature 07) — untouched
│       ├── field/                 # EXISTING (Feature 08) — untouched
│       ├── card/                  # EXISTING (Feature 09) — untouched
│       ├── table/                 # EXISTING (Feature 10) — untouched
│       └── navigation/
│           ├── navigation.tsx        # NEW — root `<nav>` + ordered NavItem list, layout
│           │                          #   axis switch
│           ├── navigation.test.tsx   # NEW — Vitest + Testing Library coverage
│           └── README.md             # NEW — token mapping + adoption note, mirrors
│                                      #   button/, field/, card/, table/ READMEs
└── playground/
    └── main.tsx                  # EDIT — add a Navigation permutation section alongside the
                                   #   existing Button, Field, Card, and Table sections
```

**Structure Decision**: Same single-package component library layout Features 07-10
established (no Option change). Navigation ships as a single `navigation.tsx` file — each
destination (`NavItem`) is an inline-rendered polymorphic `<a>`/`<button>`, not a separate
exported subcomponent file, consistent with Card's and Table's single-file precedent and the
constitution's "Default Over Configure" principle.

## Complexity Tracking

*No violations — section intentionally left without entries.*
