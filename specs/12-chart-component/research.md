# Phase 0 Research: Chart Component

## Decision 1 — Hand-rolled SVG geometry (linear scale + path/rect generation written in-repo), no charting library dependency

**Decision**: `Chart` computes its own linear scale (value → y pixel, index → x pixel) and
generates plain SVG `<path>` (line mode) / `<rect>` (bar mode) elements directly, rather than
depending on a charting library (`visx`, `recharts`, or similar).

**Rationale**: Confirmed directly with the project owner (see plan.md Input) — the spec's own
scope cut (single series, line/bar only, FR-001/Assumptions) keeps the required geometry to
one linear scale and two element types, simple enough to hand-write and unit-test like any
other internal module. This also preserves the zero-new-runtime-dependency precedent every
prior component (Features 07-11) held, and keeps full control over markup so 100% of color/
typography usage can be verified against token roles (FR-003, FR-004, SC-002) and every
element can be made individually accessible (FR-008) without fighting a library's own DOM/
styling conventions.

**Alternatives considered**: `@visx/scale` + `@visx/shape` (rejected — would be the first new
runtime dependency in the design system; the scale/path math it saves is small for a
single-series linear chart, not enough to outweigh starting a new-dependency precedent for a
six-component library). `recharts` (rejected — opinionated internal SVG structure and its own
styling/tooltip system would actively fight FR-003/FR-004's "every color and text value
traces to a token role" requirement and FR-008's accessibility requirements, the heaviest
dependency of the options considered for the least control).

---

## Decision 2 — One `Chart` component with a `mode: "line" | "bar"` prop, not separate `LineChart`/`BarChart` exports

**Decision**: Ship a single `Chart` component taking `mode: "line" | "bar"` plus a shared
`points: ChartPoint[]` prop, rather than two independently-exported components.

**Rationale**: Mirrors Card's `layout` and Navigation's `layout` precedent — one binary
configuration axis on an otherwise-identical component, not two parallel implementations
that could drift in their token usage, loading/empty treatment, or accessibility wiring.
FR-001 explicitly requires the two modes to "share one consistent visual and interaction
model," which is easiest to guarantee when they're literally the same component branching on
one prop rather than two components independently re-implementing axes, loading, and a11y.

**Alternatives considered**: Separate `LineChart` and `BarChart` components (rejected — no
shared-logic enforcement beyond developer discipline; the two would need to be kept in sync
by hand for every future token/a11y change, the same risk Decision 1 in Navigation's
research.md rejected a compound-children API to avoid).

---

## Decision 3 — Explicit, consumer-supplied `width`/`height` (required), not an internally-responsive/auto-sizing chart

**Decision**: `Chart` requires `width: number` and `height: number` props (pixel dimensions
of the SVG viewport) rather than measuring its own container (e.g. via `ResizeObserver`) and
re-rendering responsively.

**Rationale**: Spec Assumptions explicitly place "a dedicated mobile-specific chart layout"
out of scope for v1, and FR-013's label-thinning requirement only needs to react to *a*
known width, not a continuously changing one — fixed dimensions make the thinning
calculation a pure, easily-unit-tested function of `width` and tick count, with no observer/
effect/resize-debounce logic to write or test. This is the same "scope the simplest version
that satisfies the spec's literal requirements" reasoning Navigation's Decision 6 applied to
making `label` required: push the harder, unscoped problem (true responsive resizing) to
whichever future feature (Phase 2a, Feature 14) actually demonstrates the need.

**Alternatives considered**: `ResizeObserver`-driven auto-sizing (rejected — spec Assumptions
explicitly exclude a dedicated responsive layout for v1; building the observer/recalculation
machinery now would be speculative per the constitution's Default Over Configure principle).
A `className`/CSS-percentage-based fluid SVG (`viewBox` scaling without fixed pixel props)
(rejected — `viewBox` scaling alone doesn't solve FR-013's label-thinning requirement, which
needs to know an actual pixel width to decide how many labels fit).

---

## Decision 4 — Each point/bar is an individually focusable SVG element; its value is exposed via a shared floating label shown on hover *or* focus, plus a visually-hidden data table for the accessible description

**Decision**: Every data point (line mode: `<circle>` marker at each coordinate) or bar (bar
mode: `<rect>`) is rendered with `tabIndex={0}` and `role="button"`-less plain focusability
(a focusable graphics element, not an interactive control — see Decision 5 for why). A single
shared floating label (a small `absolute`-positioned element styled with `background`/
`border`/`body-secondary` token roles, internal to `chart.tsx`, not an exported `Tooltip`
primitive) shows the active point's label and value on `pointerenter`/`focus` of any point or
bar. Separately, the root SVG carries `role="img"` with `aria-describedby` pointing to a
visually-hidden (`sr-only`) `<table>` listing every label/value pair, so the complete dataset
is always available to assistive technology independent of pointer/focus interaction.

**Rationale**: FR-006 requires per-point value exposure on "point, hover, or focus" — a
native SVG `<title>` child only shows on mouse hover, not keyboard focus, so it alone can't
satisfy FR-006 or FR-007's keyboard-focus requirement; a shared floating label driven by
both `pointerenter` and `focus` covers both input methods with one implementation. The
visually-hidden data table satisfies FR-008/SC-004 independent of the floating label's
interaction model entirely — a screen reader user gets the complete dataset from the table
fallback without needing to hover/focus each point one at a time, the most direct way to make
"underlying data... programmatically determinable" (FR-008) true. This two-part approach (a
sighted-interaction affordance + an independent AT-native fallback) mirrors why Table's
Decision 2 leaned on native `aria-sort` rather than a custom live-region announcement:
prefer the mechanism that's correct for each audience over one mechanism stretched to cover
both.

**Alternatives considered**: Native SVG `<title>` per point only (rejected — doesn't fire on
keyboard focus, failing FR-007/SC-003's keyboard requirement). A single shared tooltip with no
hidden-table fallback (rejected — would require a screen reader user to tab through every
point individually to reconstruct the full dataset, materially worse than Table's existing
"row of cells" reading model for the same kind of tabular data). `aria-label` directly on each
point with no visible floating label (rejected — satisfies AT but not FR-006's plain
"exposed... via tooltip or accessible description" requirement for sighted hover/keyboard
users, who need to *see* the value, not just have it announced).

---

## Decision 5 — A missing value (`null`) splits the line into separate `<path>` segments at the gap, rather than one continuous path with an interpolated or skipped point

**Decision**: `ChartPoint.value` is typed `number | null`. In line mode, the point-to-path
generator breaks the series into separate path segments at every `null`, rendering each
contiguous run of non-null points as its own `<path>`, with no line drawn across the gap. A
`null` point renders no marker and is excluded from the focusable-point set (Decision 4) and
the hidden data table reports it as an explicit "no data" cell rather than omitting the row.

**Rationale**: Directly implements FR-014 and the corresponding Edge Case — a `null` must be
visually distinguishable from a true `0`, which rules out both interpolating across the gap
(implies a value that wasn't recorded) and silently treating it as zero (the exact ambiguity
FR-014 calls out). Reporting it explicitly as "no data" in the hidden table (rather than
omitting the row) keeps the visual and AT-facing representations consistent — a sighted user
sees a gap, a screen reader user hears "no data," neither silently drops the period from the
record (constitution Principle II, Fail Loud).

**Alternatives considered**: Linear interpolation across gaps (rejected — directly
contradicts FR-014, which requires a true zero to never be visually indistinguishable from
missing data; interpolation produces a plausible-looking but fabricated value). Omitting
`null` points from the data structure entirely, leaving gap detection to the consumer
(rejected — pushes a requirement the spec assigns to the component, FR-014, onto every
consumer to reimplement correctly).

---

## Decision 6 — `loading`/`emptyMessage` reuse Table's exact prop names, types, and default value, not a new naming convention

**Decision**: `Chart` accepts `loading?: boolean` and `emptyMessage?: string` (default
`"No data to display"`) — identical prop names, types, and default string to Table's
existing `CommonTableProps` (Feature 10).

**Rationale**: FR-009 and FR-010 are functionally the same requirement Table already solved
(a stable-dimension loading placeholder, a documented empty-state message in place of
content) — reusing the exact prop contract means a developer who has already used Table
needs to learn nothing new for Chart's loading/empty behavior, and keeps the two components'
public APIs consistent rather than introducing a second loading/empty naming convention into
the library.

**Alternatives considered**: A `status: "loading" | "empty" | "ready"` enum prop (rejected —
more expressive in the abstract, but no requirement in the spec needs a three-state enum
over two independent booleans/string, and it would be the only component in the library using
that convention instead of Table's already-established one).
