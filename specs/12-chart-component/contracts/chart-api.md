# Contract: Chart Public API

This is the public interface `gridu-design-system` exposes for the Chart component. Any
change to these exports that breaks an existing consumer call site is a breaking change to
this contract (relevant once the Phase 1 checkpoint makes this an installed dependency).

## Package export

```ts
// src/index.ts
export { Chart } from "./components/chart/chart";
export type { ChartProps, ChartMode, ChartPoint } from "./components/chart/chart";
```

## `Chart` component signature

```ts
function Chart(props: ChartProps): React.ReactElement;
```

- Renders a single `<svg role="img" aria-describedby={...}>` of the given `width`/`height`
  (research.md Decision 3), plus a visually-hidden `<table>` of every `label`/`value` pair
  that the `aria-describedby` points to (research.md Decision 4).
- `mode="line"` renders a single `<path>` (or, for a one-point series, a lone marker —
  FR-011) connecting non-null points in order, broken into separate path segments at any
  `null` value (FR-014, research.md Decision 5).
- `mode="bar"` renders one `<rect>` per non-null point, anchored at a zero baseline, with
  negative values drawn below it (FR-012); a `null` point draws no bar.
- Every non-null point/bar is individually focusable (`tabIndex={0}`) and shows a shared
  floating label with its exact `label`/`value` on `pointerenter` or `focus` (FR-006, FR-007,
  research.md Decision 4).
- `loading={true}` renders a placeholder occupying the full `width`/`height` in place of the
  plot area, keeping `title`/axis labels stable (FR-009); takes precedence over the empty
  state when both conditions are true.
- An empty `points` array (and not `loading`) renders `emptyMessage` in place of the plot
  area (FR-010).

## Props contract

See `data-model.md` for the full type definitions. Summary of guarantees:

| Prop | Required | Default | Notes |
|---|---|---|---|
| `mode` | yes | — | `"line"` or `"bar"` — research.md Decision 2 |
| `points` | yes | — | `ChartPoint[]`; an empty array is valid (FR-010) |
| `width` | yes | — | Pixel width of the SVG viewport — research.md Decision 3 |
| `height` | yes | — | Pixel height of the SVG viewport — research.md Decision 3 |
| `title` | no | — | Rendered as the chart heading and seeds the accessible name (FR-008) |
| `valueAxisLabel` | no | — | Rendered as the value-axis label (FR-002) |
| `loading` | no | `false` | Stable-dimension placeholder, takes precedence over empty state — FR-009 |
| `emptyMessage` | no | `"No data to display"` | Matches Table's exact prop contract — research.md Decision 6 |
| `className` | no | — | Merged via `tailwind-merge` onto the root element |

## Behavioral guarantees (testable via `chart.test.tsx`)

1. Every rendered element (line, bars, axes, gridlines, labels, floating value label) uses
   only `tokens.css`-traceable utility classes/SVG attributes — no inline hex/oklch literals
   — FR-003, FR-004, SC-002.
2. `focus-visible` (`ring` token) applies to each focusable point/bar only on keyboard/
   programmatic focus, matching Button/Card/Table/Navigation's existing convention — FR-007.
3. Pointing at or focusing any point/bar shows its exact `label`/`value` in the floating
   label within one interaction — FR-006, SC-003.
4. The visually-hidden data table lists every point's `label` and `value` (or "no data" for
   a `null` value), with `valueAxisLabel` (when supplied) rendered as the table's `<caption>`
   so axis meaning — not just point values — is programmatically determinable, independent
   of hover/focus state — FR-008, SC-004.
5. A `points` array of length 1 in `mode="line"` renders a single marker, no `<path>` —
   FR-011.
6. A negative `value` in `mode="bar"` renders below the zero baseline, sized proportionally
   to its magnitude — FR-012.
7. When the container is narrower than the space needed for every tick label, only every
   Nth label renders (no overlap, no wrapping) — FR-013.
8. A `null` value within an otherwise-populated `mode="line"` series breaks the line at that
   index (two separate `<path>` segments, no marker, no interpolated point) — FR-014.
9. `loading={true}` renders a placeholder matching the given `width`/`height` with no plot
   content, regardless of `points` — FR-009.
10. `points={[]}` (and `loading={false}`) renders `emptyMessage` in place of the plot area —
    FR-010.
11. Chart padding, axis-label margin, and bar/point gaps resolve to the spacing-scale
    constants in `data-model.md` Spacing role mapping — no ad-hoc pixel value outside
    scale-geometry math — FR-005.
