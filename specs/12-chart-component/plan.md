# Implementation Plan: Chart Component

**Branch**: `12-chart-component` | **Date**: 2026-06-30 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/12-chart-component/spec.md`. Upstream inputs:
`tokens/tokens.css` (Feature 06, Final), `specs/05-define-typography-system/typography-system.md`,
`.specify/memory/constitution.md` v1.0.0, and the already-implemented
`src/components/table/table.tsx` (Feature 10, `loading`/`emptyMessage` skeleton precedent
and focus-ring constant) and `src/components/card/card.tsx` (Feature 09, "more than color
alone" state-indication precedent) — current-state code inspected directly, not assumed.

## Summary

Add the design system's sixth component: a `Chart` primitive rendering one labeled data
series as either a line (continuous, ordered axis) or a bar (discrete categories), drawn as
hand-rolled SVG — no charting library dependency. A linear scale maps each point's value and
position to SVG coordinates; the line mode renders a single `<path>` (or a single `<circle>`
marker for a one-point series, FR-011), the bar mode renders one `<rect>` per category,
anchored at a zero baseline so negative values draw below it (FR-012). Axis ticks and
gridlines are plain SVG `<line>`/`<text>` elements resolving to `border`/`muted-foreground`
tokens; the single data color is the existing `brand` token (spec Assumptions — no new
color values, FR-003). `loading`/`emptyMessage` follow Table's exact prop shape and skeleton
convention (Feature 10). Every data point/bar is an individually focusable element exposing
its value via an accessible name and a visible tooltip on hover/focus (FR-006, FR-007),
and the root carries `role="img"` with a computed accessible description plus a visually-
hidden data table fallback so the underlying values are programmatically determinable
(FR-008, SC-004) without depending on SVG-internals AT support. Single new file family under
`src/components/chart/`, no new runtime dependencies.

## Technical Context

**Language/Version**: TypeScript ~5.7, ES2022 target, React 19 JSX — unchanged from Features
07-11.

**Primary Dependencies**: `class-variance-authority` ^0.7, `clsx`/`tailwind-merge` (via the
existing `cn()` helper in `src/lib/utils.ts`) — the same set Button, Field, Card, Table, and
Navigation use, no additions. Chart geometry (linear scale, path/rect generation, label
thinning) is hand-written, not delegated to a charting library — see `research.md` Decision
1 for the rejected alternatives (visx, recharts) and rationale.

**Storage**: N/A.

**Testing**: Vitest + `@testing-library/react` + `@testing-library/jest-dom` +
`@testing-library/user-event` (already devDependencies) — covers line/bar mode rendering,
per-point/per-bar value exposure on hover/focus, keyboard focus traversal and the `ring`
indicator, loading/empty states, single-point marker rendering (FR-011), negative-value
baseline placement (FR-012), label thinning under a narrow container width (FR-013), and a
missing-value gap in an otherwise populated line series (FR-014).

**Target Platform**: Browser, same two consumption paths validated in Features 07-11
(`gridu-web` native React 19, `gridu-landing` via Astro + `@astrojs/preact` compat) — no new
platform surface; plain SVG has no additional platform requirement beyond what Features 07-11
already validate.

**Project Type**: Component library (single existing package, sixth component added).

**Performance Goals**: N/A — presentational component over a small, consumer-supplied series
(spec Assumptions: single-series only); no virtualization, animation, or perf budget beyond
native SVG rendering cost for a typical dashboard-scale series (tens to low hundreds of
points).

**Constraints**: Zero new color or typography values (FR-003, FR-004, SC-002) — the single
data color is the existing `brand` role (spec Assumptions). Zero new spacing/sizing scale
(FR-005, constitution Principle I, matching Features 06-11's precedent). Zero new runtime
dependency (this plan's resolved Technical Context decision, `research.md` Decision 1).
Zero multi-series/categorical support (spec Assumptions — deferred, no categorical color set
exists yet). Zero chart types beyond line/bar (spec Assumptions). Zero data-fetching/polling
logic — the component only renders whatever series and loading/empty flags it's given (spec
Assumptions).

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Result | Reasoning |
|---|---|---|
| I. Default Over Configure | PASS | Multi-series/categorical color support, additional chart types (pie/area/scatter), and a dedicated mobile chart layout are each excluded rather than built speculatively (spec Assumptions); the component exposes exactly one configuration axis beyond data — `mode: "line" \| "bar"` — mirroring Card's and Navigation's single-axis `layout`/`mode` precedent. |
| II. Fail Loud, Never Silent | PASS | A missing value renders as a visible line break, never silently interpolated or shown as a false zero (FR-014); loading and empty states each get their own explicit treatment rather than a blank chart area (FR-009, FR-010); every data point's true value is always exposed on interaction, never only implied by pixel position (FR-006). |
| III. Outcome First | N/A | Governs message wording, not a data-visualization primitive's visual API; no structural conflict. |
| IV. Scale To One, Not A Thousand | PASS | Single-series only — no multi-metric comparison engine, no dashboard-layout/grid system, no per-series configuration — deferred until a real `gridu-web` screen (Phase 2a, Feature 14) demonstrates the need (spec Assumptions). |
| V. Calm Under Pressure | PASS | Negative values, missing data, and near-identical values are all rendered plainly and proportionally with no exaggeration, warning color, or alarm styling (FR-012, Edge Cases) — same even treatment as a normal data point. |

No violations. Complexity Tracking section omitted.

## Project Structure

### Documentation (this feature)

```text
specs/12-chart-component/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # Phase 1 output (/speckit-plan command)
│   └── chart-api.md
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)

```text
gridu-design-system/
├── tokens/
│   └── tokens.css              # EXISTING (Feature 06) — Chart consumes brand/border/
│                                #   muted-foreground/background/foreground/ring roles and
│                                #   label/caption/body-secondary typography roles, edits none
├── src/
│   ├── index.ts                  # EDIT — barrel-export Chart and its types
│   └── components/
│       ├── button/                # EXISTING (Feature 07) — untouched
│       ├── field/                 # EXISTING (Feature 08) — untouched
│       ├── card/                  # EXISTING (Feature 09) — untouched
│       ├── table/                 # EXISTING (Feature 10) — untouched
│       ├── navigation/             # EXISTING (Feature 11) — untouched
│       └── chart/
│           ├── chart.tsx             # NEW — root SVG chart: scale math, line/bar rendering,
│           │                          #   axes, loading/empty states, per-point interaction
│           ├── chart.test.tsx        # NEW — Vitest + Testing Library coverage
│           └── README.md             # NEW — token mapping + adoption note, mirrors
│                                      #   button/, field/, card/, table/, navigation/ READMEs
└── playground/
    └── main.tsx                  # EDIT — add a Chart permutation section (line, bar,
                                   #   loading, empty, edge cases) alongside the existing
                                   #   Button, Field, Card, Table, and Navigation sections
```

**Structure Decision**: Same single-package component library layout Features 07-11
established (no Option change). Chart ships as a single `chart.tsx` file — scale/path
generation is internal module-private logic, not a separate exported utility, consistent
with the constitution's "Default Over Configure" principle and Card's/Table's/Navigation's
single-file precedent.

## Complexity Tracking

*No violations — section intentionally left without entries.*
