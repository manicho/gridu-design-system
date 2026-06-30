# Implementation Plan: Table Component

**Branch**: `10-table-component` | **Date**: 2026-06-30 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/10-table-component/spec.md`. Upstream inputs:
`tokens/tokens.css` (Feature 06, Final), `specs/05-define-typography-system/typography-system.md`
(`label`, `body-default`, `body-secondary`, `caption`, `numeric-tabular` roles),
`.specify/memory/constitution.md` v1.0.0, and the already-implemented
`src/components/button/button.tsx` (Feature 07, focus-ring convention),
`src/components/field/` (Feature 08, label↔control id-threading), and
`src/components/card/card.tsx` (Feature 09, nested-interactive-element precedence pattern) —
current-state code inspected directly, not assumed.

## Summary

Add the design system's fourth component: a data-driven `Table<T>` that renders a header row
from a `columns` config and a body from a `rows` array (each row requiring a stable `id`).
Two independent optional layers sit on this base: per-column `sortable` (internal,
uncontrolled sort state — client-side only, consistent with the no-pagination assumption) and
table-wide `selectable` (checkbox-only, fully controlled via `selectedIds`/`onSelectionChange`,
mirroring Card's consumer-owned `selected` state). Zebra striping is on by default
(Clarifications). Cell text truncates with a native `title` tooltip when the cell renders a
plain string; consumers using a custom `render` own their own overflow handling. Loading
renders skeleton rows under a stable header; empty renders a single full-width message row.
The table scrolls horizontally within its own `overflow-x-auto` wrapper, never the page. All
color/typography styling resolves to existing `tokens.css` roles — no new component (e.g. a
standalone Checkbox) is introduced; the row checkbox is an inline styled native
`<input type="checkbox">`, consistent with Card's "no speculative subcomponent split"
precedent. Single new file family under `src/components/table/`, no new dependencies.

## Technical Context

**Language/Version**: TypeScript ~5.7, ES2022 target, React 19 JSX — unchanged from Features
07-09.

**Primary Dependencies**: `class-variance-authority` ^0.7, `clsx`/`tailwind-merge` (via the
existing `cn()` helper in `src/lib/utils.ts`) — the same set Button, Field, and Card use, no
additions.

**Storage**: N/A.

**Testing**: Vitest + `@testing-library/react` + `@testing-library/jest-dom` +
`@testing-library/user-event` (already devDependencies) — covers header/row rendering, zebra
striping, sort toggling (asc → desc → asc) and indicator placement, select-all
checked/unchecked/indeterminate derivation, individual row selection, keyboard operability of
both sortable headers and checkboxes, nested-interactive-element non-interference (Edge
Case), truncation/title behavior, loading and empty states, and horizontal-scroll wrapper
presence.

**Target Platform**: Browser, same two consumption paths validated in Features 07-09
(`gridu-web` native React 19, `gridu-landing` via Astro + `@astrojs/preact` compat) — no new
platform surface.

**Project Type**: Component library (single existing package, fourth component added).

**Performance Goals**: N/A — presentational component over an already-loaded, unpaginated row
array (spec Assumptions); no virtualization or perf budget beyond native DOM cost.

**Constraints**: Zero new color or typography values (FR-002, FR-003, SC-002). Zero new
spacing/sizing/radius scale (FR-021, constitution Principle I, matching Features 06-09's
precedent). Zero pagination/virtualization/multi-column-sort/column-resize/inline-edit (spec
Assumptions, constitution Principle IV). Zero edits to `gridu-web` source (migration
explicitly out of scope per spec Assumptions). Selected rows never rely on color alone
(FR-013). Row selection toggles only via the checkbox, never via row-click (Clarifications).

**Scale/Scope**: 1 component family (`Table` + inline checkbox, no standalone subcomponent),
1 required base layer (header + rows) + 2 independent optional layers (sortable columns,
table-wide row selection) + 2 non-interactive states (loading, empty).

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Result | Reasoning |
|---|---|---|
| I. Default Over Configure | PASS | Zebra striping is a fixed default, not a configurable prop (Clarifications); selection is checkbox-only with no row-click configurability (Clarifications); sort is single-column only, internal state, no controlled/server-side escape hatch added speculatively. |
| II. Fail Loud, Never Silent | PASS | Overflowing cell text is never silently clipped — it gets a visible ellipsis plus a `title` tooltip exposing the full value (FR-018); loading never silently hides the table's structure (FR-005); a selected row's state is never conveyed by color alone (FR-013). |
| III. Outcome First | N/A | Governs message wording, not a data-grid primitive's visual API; no structural conflict — Table renders whatever row data the consumer supplies without altering its ordering except via an explicit user sort action. |
| IV. Scale To One, Not A Thousand | PASS | No pagination, virtualization, multi-column sort, or column resize/reorder is introduced (spec Assumptions) — Table assumes a single operator's own, already-small record set, consistent with Features 07-09's "no speculative infra" precedent. |
| V. Calm Under Pressure | PASS | Loading state uses a plain pulsing skeleton (the same muted-surface treatment as rest-state styling, no spinner/alarm motif); empty state uses a single plain-toned message row, not an exclamation-styled "No data!" callout. |

No violations. Complexity Tracking section omitted.

## Project Structure

### Documentation (this feature)

```text
specs/10-table-component/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # Phase 1 output (/speckit-plan command)
│   └── table-api.md
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)

```text
gridu-design-system/
├── tokens/
│   └── tokens.css              # EXISTING (Feature 06) — Table consumes background/
│                                #   muted-surface/border/ring/foreground/muted-foreground
│                                #   roles and label/body-default/body-secondary/caption/
│                                #   numeric-tabular typography roles, edits none
├── src/
│   ├── index.ts                  # EDIT — barrel-export Table and its types
│   └── components/
│       ├── button/                # EXISTING (Feature 07) — untouched
│       ├── field/                 # EXISTING (Feature 08) — untouched
│       ├── card/                  # EXISTING (Feature 09) — untouched
│       └── table/
│           ├── table.tsx             # NEW — root component: header + rows, sort state,
│           │                          #   selection wiring, loading/empty states
│           ├── table.test.tsx        # NEW — Vitest + Testing Library coverage
│           └── README.md             # NEW — token mapping + adoption note, mirrors
│                                      #   button/README.md, field/README.md, card/README.md
└── playground/
    └── main.tsx                  # EDIT — add a Table permutation section alongside the
                                   #   existing Button, Field, and Card playground sections
```

**Structure Decision**: Same single-package component library layout Features 07-09
established (no Option change). Table ships as a single `table.tsx` file — the row checkbox
is a small inline-rendered native input, not a separate exported subcomponent (no standalone
Checkbox component exists or is introduced by this feature), consistent with Card's
single-file precedent and the constitution's "Default Over Configure" principle (no
speculative subcomponent split ahead of a second consumer that would justify one).

## Complexity Tracking

*No violations — section intentionally left without entries.*
