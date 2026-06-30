# Data Model: Table Component

A component library has no persisted data; its "data model" is the public type contract
consumers code against. This document defines that contract, derived from spec.md's Key
Entities and Functional Requirements.

## TableColumn\<T\>

```ts
type TableColumn<T> = {
  key: string;                          // unique within columns; also the default accessor
  header: string;
  sortable?: boolean;                   // default: false — FR-006
  numeric?: boolean;                    // default: false — drives numeric-tabular + right-align
  accessor?: (row: T) => string | number;  // default: row[key] cast to string
  render?: (row: T) => React.ReactNode; // overrides display; disables truncation (research.md Decision 5)
};
```

A column is a field definition, not a cell instance (spec Key Entities). `accessor` is used
both for display (when no `render` is given) and as the sort comparator's value source for
`sortable` columns. `numeric` is independent of `sortable` and of `render` — a `render`-based
numeric column still right-aligns and uses `numeric-tabular`, even though truncation does not
apply to it.

## TableRow\<T\>

No dedicated wrapper type — `rows: T[]` where every `T` extends `{ id: string }`. `id` is the
selection key (research.md Decision 3) and the React list key; it must be stable and unique
across the full `rows` array, independent of current sort order.

## SortState

```ts
type SortDirection = "ascending" | "descending";
type SortState = { columnKey: string; direction: SortDirection } | null;
```

Internal only (research.md Decision 2) — not part of `TableProps`. At most one column is
active (spec Key Entities: "At most one column is active at a time"); `null` means
insertion-order rows (no sort applied).

## SelectionState

Not a dedicated type — represented as `ReadonlySet<string>` of selected row `id`s, owned by
the consumer (research.md Decision 3). The header select-all control's own checked /
unchecked / indeterminate state (spec Key Entities) is *derived*, not stored:

| Derived state | Condition |
|---|---|
| unchecked | `selectedIds` contains none of the currently visible rows' ids |
| checked | `selectedIds` contains every currently visible row's id |
| indeterminate | `selectedIds` contains some but not all currently visible rows' ids |

## TableProps\<T\>

```ts
type CommonTableProps<T> = {
  columns: TableColumn<T>[];
  rows: T[];                      // extends { id: string }
  loading?: boolean;               // default: false — FR-005, research.md Decision 6
  emptyMessage?: string;           // default: "No data to display" — FR-004
  className?: string;
};

type NonSelectableTableProps<T> = CommonTableProps<T> & {
  selectable?: false;
};

type SelectableTableProps<T> = CommonTableProps<T> & {
  selectable: true;
  selectedIds: ReadonlySet<string>;                      // research.md Decision 3
  onSelectionChange: (next: ReadonlySet<string>) => void;
};

type TableProps<T> = NonSelectableTableProps<T> | SelectableTableProps<T>;
```

`selectedIds` and `onSelectionChange` only exist (and are required) when `selectable: true` —
mirrors Card's `InformationalCardProps`/`InteractiveCardProps` discriminated-union pattern
(Feature 09), so passing `selectedIds` without `selectable: true` is a type error rather than
a silently ignored prop, and omitting it when `selectable: true` is a compile-time error
rather than a runtime gap.

## Typography role mapping

FR-003 — every text usage resolves to a `typography-system.md` role, no new font size/weight
introduced:

| Region | Role | Notes |
|---|---|---|
| Column header (`header`) | `label`, `text-muted-foreground` | De-emphasized relative to cell content, matches a header's typically secondary visual weight |
| Text cell (no `render`, `numeric: false`) | `body-default` | Standard cell text role |
| Numeric cell (no `render`, `numeric: true`) | `numeric-tabular` | Digits align across rows (User Story 1 Acceptance Scenario 2) |
| Empty-state message | `caption`, `text-muted-foreground` | De-emphasized, matches a placeholder/meta message's typical weight |

## Color role mapping

FR-002 — no new color value introduced:

| Element | Token role | Notes |
|---|---|---|
| Table surface | `background` | Default surface for the whole table |
| Header background | `muted-surface` | Distinct from data rows at rest |
| Alternating row background (zebra) | `muted-surface` | Every other data row only — Clarifications |
| Row/column dividers | `border` | Beneath header, between rows |
| Focus ring (sortable header, checkbox) | `ring` | Same convention as Button/Input/Card |
| Loading skeleton blocks | `muted-surface` (pulsing) | No new color, opacity/animation only |

## Relationships

- `sortable` (per column) and `selectable` (table-wide) are independent layers on the same
  base header+rows structure (spec Key Entities) — every combination (neither, either, both)
  must render correctly.
- `numeric` and `render` are independent per column; `render` always wins for what's
  displayed, `numeric` always controls alignment and typography role regardless of whether
  `render` or the default accessor produced the content.
- `loading` and `rows.length === 0` are mutually exclusive *display* states (research.md
  Decision 6) — when both are possible inputs, `loading` takes precedence (skeleton rows show
  instead of the empty-state row) since `loading` implies the real row count isn't known yet.
- `selectedIds` is not filtered or validated against `rows` by the component — a selected id
  no longer present in `rows` (e.g. after an external delete) is simply not rendered as
  checked; reconciling stale ids is the consumer's responsibility, consistent with selection
  being fully consumer-owned (research.md Decision 3).
