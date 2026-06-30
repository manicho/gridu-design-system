# Phase 0 Research: Table Component

## Decision 1 — Data-driven `columns` + `rows` props, not a compound `Table.Row`/`Table.Cell` family

**Decision**: Ship one generic export, `Table<T>`, taking a `columns: TableColumn<T>[]` config
array and a `rows: T[]` data array (each `T` requiring an `id: string`) — rather than
compound subcomponents the consumer assembles by hand (`Table.Header`, `Table.Row`,
`Table.Cell`, the JSX-children pattern native `<table>` markup itself uses).

**Rationale**: FR-006 through FR-013 require the component itself to own sort and selection
*logic* (compute the next sort direction, derive the select-all indeterminate state) — that
bookkeeping needs a single source of truth over the full row set, which a compound
children-based API would force back onto every consumer to reimplement per usage. A
config-driven API matches the spec's own framing ("the consumer is responsible for any
slicing... before passing rows to the table," spec Assumptions) and keeps sort/selection
correctness inside the component (SC-001's "zero additional ad-hoc CSS" extends naturally to
"zero additional ad-hoc state logic").

**Alternatives considered**: A compound family mirroring raw `<table>` markup (rejected — the
consumer would have to re-derive sort comparators and select-all indeterminate state per
table instance, the exact duplication FR-006/FR-012 exist to prevent). A hybrid (config for
sort/selection, children for cell content) (rejected — splits one row's definition across two
unrelated props for no behavioral gain, adds API surface against Default Over Configure).

---

## Decision 2 — Sort state is internal and uncontrolled, single active column only, exposed via native `aria-sort`

**Decision**: `Table` tracks its own `{ columnKey, direction }` sort state internally (one
`useState`, no `sortColumn`/`onSortChange` controlled-mode props). Activating a sortable
header's button cycles `none → ascending → descending → ascending...` for that column and
clears any other column's state. The active `<th>` carries `aria-sort="ascending"` /
`"descending"`; inactive sortable columns carry no `aria-sort` attribute (equivalent to
`"none"`).

**Rationale**: Nothing outside the table needs to read or drive sort state (spec Assumptions:
multi-column sort and any consumer reaction to sort order are out of scope), unlike selection,
whose result a consumer's bulk-action bar must read (Decision 3). Internal state keeps the API
surface smaller per Default Over Configure and avoids a controlled/uncontrolled dual-mode the
spec never asks for. `aria-sort` is the ARIA-spec-correct mechanism for FR-016 (announcing the
active sort column and direction) on a `<th>` — no custom `aria-live` region is needed since
`aria-sort` is announced declaratively by screen readers when focus lands on the header.

**Alternatives considered**: Controlled sort (`sortColumn`/`sortDirection`/`onSortChange`
props, consumer owns the state) (rejected — no named use case needs server-side or
cross-render-persisted sort; the no-pagination assumption means the full row set is already
client-side, so client-side sort is always sufficient). A custom `data-sort` attribute plus a
visually-hidden live region announcing "Sorted by X, ascending" on change (rejected — duplicates
what `aria-sort` already does natively, adds a second source of truth that could drift).

---

## Decision 3 — Selection state is fully controlled (`selectedIds` + `onSelectionChange`), checkbox-only activation

**Decision**: `selectable` is a boolean turning the feature on; when `true`, `Table` requires
`selectedIds: ReadonlySet<string>` and `onSelectionChange: (next: ReadonlySet<string>) => void`
— the consumer owns the actual selection state, the same way Card's interactive `selected`
prop is consumer-owned (Card Decision-adjacent precedent). Only the row's own checkbox
`<input>` and the header's select-all checkbox call `onSelectionChange`; no other DOM region
of a row has a click handler that touches selection (Clarifications: checkbox-only).

**Rationale**: The spec's own Assumptions section states bulk actions (the toolbar/menu a
non-zero selection triggers) are the consumer's responsibility — that's only possible if the
consumer can read the current selection, which requires controlled state, not an
internally-trapped one. This mirrors Card's existing convention (interactive `selected` is
consumer-supplied) rather than introducing a second, inconsistent state-ownership pattern in
the same design system.

**Alternatives considered**: Internal/uncontrolled selection with an `onSelectionChange`
notify-only callback (rejected — a consumer building a bulk-action bar would need to mirror
the table's internal state in its own `useState` just to read "how many are selected right
now," a redundant second source of truth the controlled version avoids entirely). Selection
keyed by row index instead of `id` (rejected — index-based keys break when `rows` is
re-sorted by the table's own internal sort state, Decision 2 — `id`-based selection survives
any row-order change unaffected).

---

## Decision 4 — Select-all's indeterminate state is set imperatively via a ref, not a JSX prop

**Decision**: The header checkbox's `indeterminate` property (some-but-not-all rows selected)
is set with a `useEffect` + `ref.current.indeterminate = ...` assignment, since `indeterminate`
is a DOM property with no corresponding HTML attribute or JSX prop — `<input indeterminate>`
silently does nothing.

**Rationale**: This is the only DOM-correct way to represent the indeterminate visual state
required by FR-012/User Story 3 Acceptance Scenario 2; it's a well-documented (if slightly
unusual) React pattern for this exact native-checkbox limitation, not a custom-rolled visual
substitute. The checked/unchecked states themselves still use the standard controlled
`checked` prop.

**Alternatives considered**: A custom-styled checkbox built from a `<div>` + `aria-checked`
(rejected — reimplements native checkbox semantics and keyboard handling that a real
`<input type="checkbox">` already provides correctly, the same native-element-first reasoning
Card's Decision 2 applied to interactive elements). Approximating indeterminate visually with a
CSS-only dash icon while leaving the underlying input's actual `checked` state ambiguous
(rejected — would desync the visual state from what assistive technology reports, since
screen readers read the real DOM `indeterminate` property, not an adjacent icon).

---

## Decision 5 — Truncation (FR-018) only fires for plain-string cell content; consumer `render` functions own their own overflow

**Decision**: A column without a `render` function displays the row's raw field value as text,
truncated with `truncate` (Tailwind's single-line ellipsis utility) plus a native `title`
attribute carrying the full string. A column with a `render` function (for custom cell
content — e.g. a status badge) renders exactly what `render` returns, with no truncation or
`title` wrapper applied by the table.

**Rationale**: FR-018 is only mechanically achievable for content the component itself knows
is a plain string — a `title` tooltip and single-line ellipsis both assume text content. A
`render` function can return arbitrary JSX (an icon, a badge, a nested Button) where
"truncate the text and add a title" is not a coherent universal behavior, so this is
documented as the consumer's own responsibility, consistent with the same boundary the spec
already draws around `render`-based cells.

**Alternatives considered**: Always wrapping `render` output in a truncating `<span>`
regardless of content (rejected — would clip or visually corrupt non-text cell content like a
badge or icon, a worse outcome than no truncation at all). Requiring every column to declare
a `truncate: boolean` flag explicitly (rejected — adds a config knob for behavior that already
has an unambiguous default per content type, against Default Over Configure).

---

## Decision 6 — Loading and empty states render inside the existing row area as synthetic rows, not as a separate overlay or replacement component

**Decision**: When `loading` is `true`, the row area renders a fixed number (5) of skeleton
rows — each cell a pulsing `muted-surface` block at the cell's normal height — under the real,
already-rendered header. When `rows.length === 0` and `loading` is `false`, the row area
renders one row containing a single cell, `colSpan`-ed across all columns, holding a
`caption`-styled empty-state message. Both replace only the `<tbody>` content; the `<thead>`
and the table's own structure never disappear.

**Rationale**: FR-004 and FR-005 both frame this as the row *area* changing while "the table's
overall structure stays stable" — rendering synthetic rows inside the real `<tbody>` keeps the
table a single, always-present `<table>` element (no conditional unmount/remount of the whole
component, no separate spinner/placeholder component replacing it), which is also what keeps
column widths visually stable between the loading and loaded states.

**Alternatives considered**: A full-component-replacement spinner (rejected — FR-005
explicitly requires the header to stay visible while loading, which a full replacement would
hide). A skeleton row count proportional to an expected/previous row count (rejected — adds a
prop or memoized previous-length tracking for a cosmetic detail with no functional
requirement behind it; a fixed count of 5 is a Default Over Configure-consistent constant).
