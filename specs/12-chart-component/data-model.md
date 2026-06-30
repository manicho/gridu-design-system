# Data Model: Chart Component

A component library has no persisted data; its "data model" is the public type contract
consumers code against. This document defines that contract, derived from spec.md's Key
Entities and Functional Requirements.

## ChartPoint

```ts
type ChartPoint = {
  label: string;             // category label (bar mode) or time/x-axis label (line mode)
  value: number | null;      // null = missing data point — FR-014, research.md Decision 5
};
```

A point is a definition the consumer supplies, not a state the component derives (spec Key
Entities). `value: null` is a distinct, explicit state from `value: 0` — research.md
Decision 5.

## ChartProps

```ts
type ChartMode = "line" | "bar";

type ChartProps = {
  mode: ChartMode;                  // research.md Decision 2
  points: ChartPoint[];
  width: number;                    // required pixel width — research.md Decision 3
  height: number;                   // required pixel height — research.md Decision 3
  title?: string;                   // chart title, also seeds the accessible name — FR-008
  valueAxisLabel?: string;          // e.g. "Bookings" — FR-002
  loading?: boolean;                // default: false — FR-009, research.md Decision 6
  emptyMessage?: string;            // default: "No data to display" — FR-010, research.md Decision 6
  className?: string;
};
```

## Relationships

- `mode` is the only configuration axis beyond data, mirroring Card's/Navigation's single-
  axis `layout` precedent (research.md Decision 2): it changes how `points` render (line +
  marker vs. one bar per point) and nothing else — axes, loading, empty, and interaction
  behavior are identical in both modes.
- `points` with a single entry: line mode renders that entry as a lone marker, no line
  (FR-011); bar mode renders a single bar — no special-case type needed, the rendering logic
  naturally produces this from `points.length === 1`.
- A `null` value inside `points` (line mode) breaks the rendered line into separate path
  segments at that index, excludes the point from the focusable-point set, and reports as an
  explicit "no data" row in the hidden accessible data table (research.md Decision 5). Bar
  mode treats a `null` value the same way: no bar is drawn for that category, and it is
  reported as "no data" rather than a zero-height bar (so it is never visually
  indistinguishable from a true zero value, FR-014).
- A negative `value` (bar mode only — line mode has no baseline-fill concept) renders below
  the zero baseline rather than being clipped or hidden (FR-012).
- `loading` and an empty `points` array are independent, mutually exclusive states — when
  `loading` is `true`, the loading placeholder always takes precedence over the empty-state
  message, matching Table's existing `loading`-over-`emptyMessage` precedence (Feature 10).

## Typography role mapping

FR-004 — every text usage resolves to a `typography-system.md` role, no new font size/weight
introduced:

| Region | Role | Notes |
|---|---|---|
| Chart title | `heading-subsection` | Matches Card's heading role |
| Axis tick labels | `caption` | Smallest documented role, matches dense numeric/category labels |
| Floating value label (hover/focus) | `body-secondary` | Matches Table's secondary-text role |
| Empty-state message | `body-secondary`, `muted-foreground` | Matches Table's empty-state treatment (Feature 10) |

## Color role mapping

FR-003 — no new color value introduced:

| Element | Token role | Notes |
|---|---|---|
| Chart surface | `background` | Default surface, matches Card/Table |
| Data line / bar fill | `brand` | Single-series color — spec Assumptions, research.md Decision 1 |
| Axis lines / gridlines | `border` | Same role used for Table row dividers and Card borders |
| Tick/axis labels | `muted-foreground` | Same role used for Table secondary text |
| Zero baseline (bar mode) | `border` | Slightly heavier weight than gridlines, still the same role |
| Focus ring (point/bar) | `ring` | Same convention as Button/Input/Card/Table/Navigation |
| Floating value label surface/border | `background` / `border` | Matches Card's default surface treatment |

## Spacing role mapping

FR-005 — no ad-hoc pixel values; every spacing value derives from the scale in
`06-define-design-tokens`, converted to pixels for SVG coordinate math (research.md
Decision 1):

| Region | Token | Notes |
|---|---|---|
| Chart padding (SVG edge to plot area) | `space-4` | Matches Card's default padding token |
| Axis-label margin (tick label to axis line) | `space-2` | Matches Table's cell padding scale step |
| Bar gap (between adjacent bars, bar mode) | `space-1` | Smallest scale step — keeps bars visually grouped |
