# Contract: Table Public API

This is the public interface `gridu-design-system` exposes for the Table component. Any
change to these exports that breaks an existing consumer call site is a breaking change to
this contract (relevant once the Phase 1 checkpoint makes this an installed dependency).

## Package export

```ts
// src/index.ts
export { Table } from "./components/table/table";
export type {
  TableProps,
  TableColumn,
  NonSelectableTableProps,
  SelectableTableProps,
} from "./components/table/table";
```

## `Table` component signature

```ts
function Table<T extends { id: string }>(props: TableProps<T>): React.ReactElement;
```

- Renders a single `<table>` with a `<thead>` (one `<tr>` of `<th>`s built from `columns`,
  plus a leading `<th>` for select-all when `selectable`) and a `<tbody>` whose content
  depends on state precedence: `loading` → skeleton rows; else `rows.length === 0` →
  one empty-state row; else one `<tr>` per row in current sort order (research.md Decision 6).
- The whole `<table>` is wrapped in a `div` with horizontal-scroll overflow (`overflow-x-auto`)
  so the table scrolls within its own bounds rather than the page (FR-019).
- Column order in `<tr>`s always matches `columns` order; `selectable`'s checkbox column, when
  present, is always the leading column.

## Props contract

See `data-model.md` for the full type definitions. Summary of guarantees:

| Prop | Applies to | Required | Default | Notes |
|---|---|---|---|---|
| `columns` | both | yes | — | `TableColumn<T>[]`, defines header label, sortability, numeric alignment, and optional custom cell render per column (FR-001) |
| `rows` | both | yes | — | `T[]`, each requiring a stable `id: string`; the full, already-loaded row set (no pagination — spec Assumptions) |
| `loading` | both | no | `false` | Skeleton rows replace data rows; header stays visible (FR-005, research.md Decision 6) |
| `emptyMessage` | both | no | `"No data to display"` | Shown in place of rows when `rows.length === 0` and not `loading` (FR-004) |
| `selectable` | both | no | `false` | Adds a checkbox column + header select-all (FR-010) |
| `selectedIds` | `selectable: true` only | yes, compile-time enforced | — | `ReadonlySet<string>` of selected row ids, consumer-owned (research.md Decision 3) |
| `onSelectionChange` | `selectable: true` only | yes, compile-time enforced | — | Called with the next full `selectedIds` set on any checkbox or select-all activation |
| `className` | both | no | — | Merged via `tailwind-merge` onto the outer scroll wrapper, consumer overrides win on conflicting utilities |

`selectedIds` and `onSelectionChange` are absent from the non-selectable Table's type —
passing them without `selectable: true` is a compile-time error, mirroring Card's
`InformationalCardProps`/`InteractiveCardProps` split (Feature 09).

### `TableColumn<T>` fields

| Field | Required | Default | Notes |
|---|---|---|---|
| `key` | yes | — | Unique within `columns`; default accessor reads `row[key]` |
| `header` | yes | — | Rendered with the `label` typography role |
| `sortable` | no | `false` | Enables the interactive header button + `aria-sort` (FR-006-FR-009) |
| `numeric` | no | `false` | Right-aligns the column and uses `numeric-tabular` instead of `body-default` |
| `accessor` | no | `(row) => row[key]` | Used for display (when no `render`) and as the sort comparator's value source |
| `render` | no | — | Overrides display entirely; disables truncation/`title` for this column (research.md Decision 5) |

## Behavioral guarantees (testable via `table.test.tsx`)

1. Every rendered state (rest, zebra-striped rows, sortable header active/inactive, selected/
   unselected row, loading, empty) uses only `tokens.css`-traceable utility classes (no inline
   styles, no hex/oklch literals) — FR-002, FR-003, FR-021, SC-002.
2. `focus-visible` (`ring` token) applies on every interactive element (sortable header
   button, row checkbox, select-all checkbox) only on keyboard/programmatic focus, matching
   Button/Card's existing convention — FR-014.
3. Activating a sortable column header (pointer click or Enter/Space when focused) reorders
   `rows` by that column's `accessor` value, sets `aria-sort` on that `<th>`, and clears any
   other column's `aria-sort` — FR-007, FR-008, research.md Decision 2. Repeated activation
   toggles `ascending` ↔ `descending`.
4. A non-sortable column's header renders a plain `<th>` with no button, no hover/focus
   styling, and no `aria-sort` attribute — FR-009.
5. Checking an individual row's checkbox calls `onSelectionChange` with `selectedIds` plus
   that row's `id`; unchecking calls it with that `id` removed — no other click target within
   the row calls `onSelectionChange` — FR-011, FR-013, FR-020, Clarifications.
6. The header select-all checkbox's DOM `checked`/`indeterminate` properties match the
   selection-state derivation table in `data-model.md`, and activating it calls
   `onSelectionChange` with either every visible row's `id` added or all removed — FR-012.
7. A nested interactive element (e.g. a row-level link) inside a `selectable` row's cell
   remains independently clickable and never triggers `onSelectionChange` for that click —
   FR-020, Edge Cases ruling (checkbox-only selection makes this trivially true: no row-region
   click handler exists outside the checkbox itself).
8. A text cell whose rendered content overflows its column truncates with a visible ellipsis
   and exposes the full value via a `title` attribute; a `render`-based cell is left
   untouched — FR-018, research.md Decision 5.
9. `loading={true}` renders the header plus skeleton rows in `<tbody>`, never an empty
   `<tbody>` or a full-component replacement — FR-005. `rows.length === 0` with
   `loading={false}` renders the header plus a single `colSpan`-ed empty-state row — FR-004.
10. The table's outer wrapper applies horizontal `overflow-x-auto`; the `<table>` itself is
    never constrained to the wrapper's width via `table-layout: fixed` in a way that would
    clip rather than scroll — FR-019.
