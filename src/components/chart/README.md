# Chart

A single-series line/bar visualization for dashboard metrics (e.g. bookings or revenue over
time). Lives at `src/components/chart/chart.tsx`, exported from the package root
(`src/index.ts`) as `Chart`, along with its types `ChartProps`, `ChartMode`, `ChartPoint`.

The sixth and final Phase 1 component feature (07-12, see the epic tracker in the `gridu`
repo) — follows the same shape Button, Field/Input, Card, Table, and Navigation established:
a single `.tsx` file (scale/path generation is internal module-private logic, not a separate
exported utility), a colocated `.test.tsx`, a colocated `README.md`, and styling built
exclusively on `tokens/tokens.css` roles.

## No charting library, hand-rolled SVG

Unlike every other dependency in this package, charting libraries (`recharts`, `visx`, etc.)
were evaluated and explicitly rejected (research.md Decision 1). The chart's line/bar
geometry — one linear scale, a path generator, and a rect generator — is hand-written in
`chart.tsx`, with zero new runtime dependency added. This keeps full control over markup so
every color and text value can be verified against a documented token role (FR-003, FR-004)
and every element can be made individually accessible (FR-008) without fighting a library's
own DOM/styling conventions.

## Fixed `width`/`height`, not responsive

`Chart` requires `width` and `height` (pixels) — it does not measure its own container or
react to resize (research.md Decision 3). A dedicated mobile/responsive chart layout is
explicitly out of scope for v1; re-render the component with new dimensions if the consumer
needs to react to a layout change.

## `mode: "line" | "bar"`

One component, one binary configuration axis beyond data — mirrors Card's `layout` and
Navigation's `layout` precedent (research.md Decision 2). Both modes share identical axes,
loading/empty states, and point/bar interaction; they differ only in which shape (`<path>` +
marker vs. `<rect>`) is drawn per point.

## Color role mapping

| Element | Token role |
|---|---|
| Chart surface | `background` |
| Data line / bar fill | `brand` |
| Axis lines / gridlines / zero baseline | `border` |
| Tick/axis labels | `muted-foreground` |
| Focus ring (point/bar) | `ring` |
| Floating value label surface/border | `background` / `border` |

## Typography role mapping

| Region | Role |
|---|---|
| Chart title | `heading-subsection` |
| Axis tick labels | `caption` |
| Floating value label (hover/focus) | `body-secondary` |
| Empty-state message | `body-secondary` / `muted-foreground` |

## Spacing role mapping (FR-005)

SVG attributes take raw pixel numbers, not Tailwind utility classes, so the spacing scale is
applied as fixed pixel constants in `chart.tsx` rather than `p-*`/`gap-*` classes:

| Region | Token | Pixels |
|---|---|---|
| Chart padding (SVG edge to plot area) | `space-4` | 16 |
| Axis-label margin (tick label to axis line) | `space-2` | 8 |
| Bar gap (between adjacent bars, bar mode) | `space-1` | 4 |

## Missing data (`value: null`)

A `null` value is a distinct, explicit "no data" state — never interpolated and never
treated as a true `0`. In line mode it splits the series into separate path segments at the
gap (research.md Decision 5); in bar mode no bar is drawn for that category. Both modes
report the point as "No data" in the hidden accessible data table rather than omitting it.

## Accessibility

The root `<svg>` carries `role="img"` with `aria-label` (the chart `title`, or `"Chart"` as a
fallback) and `aria-describedby` pointing to a visually-hidden (`sr-only`) `<table>` listing
every point's label and value — with `valueAxisLabel` (when supplied) as the table's
`<caption>`, so axis meaning is determinable independent of the visual rendering (FR-008,
SC-004). Every non-null point/bar is individually focusable (`tabIndex={0}`) with the same
`ring`-token focus-visible treatment as Button/Card/Table/Navigation; pointing at or focusing
a point shows its exact value in a shared floating label (research.md Decision 4) — not an
exported `Tooltip` primitive.

## Adoption status

**Not yet adopted by `gridu-web`.** This feature defines and implements the component in
`gridu-design-system` only. Migrating any existing `gridu-web` chart implementation onto this
component is explicit future work, gated behind the epic tracker's Phase 1 checkpoint, same
as Button, Field, Card, Table, and Navigation.

## Usage

```tsx
import { Chart } from "gridu-design-system";

// Line mode — a trend over time
<Chart
  mode="line"
  points={[
    { label: "Mon", value: 12 },
    { label: "Tue", value: 18 },
    { label: "Wed", value: null }, // no data recorded this day
    { label: "Thu", value: 21 },
  ]}
  width={480}
  height={260}
  title="Bookings this week"
  valueAxisLabel="Bookings"
/>

// Bar mode — comparing discrete categories, including a negative value
<Chart
  mode="bar"
  points={[
    { label: "Haircut", value: 32 },
    { label: "Color", value: 14 },
    { label: "Refunds", value: -4 },
  ]}
  width={480}
  height={260}
  title="Bookings by service"
/>

// Loading and empty states
<Chart mode="line" points={[]} width={300} height={200} loading />
<Chart mode="bar" points={[]} width={300} height={200} emptyMessage="No bookings yet" />
```
