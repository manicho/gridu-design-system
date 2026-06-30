# Table

The canonical data-grid component for tabular records in the gridu design system (client
lists, transaction history, appointment lists). Lives at `src/components/table/table.tsx`,
exported from the package root (`src/index.ts`) as `Table`, along with its types
`TableProps`, `TableColumn`, `NonSelectableTableProps`, `SelectableTableProps`.

The fourth of six Phase 1 component features (07-12, see the epic tracker in the `gridu`
repo) — follows the shape Button (07), Field/Input (08), and Card (09) established: a single
`.tsx` file (no compound split — the row checkbox is an inline native input, not a standalone
Checkbox component), a colocated `.test.tsx`, a colocated `README.md`, and styling built
exclusively on `tokens/tokens.css` roles.

## Data-driven API

`Table<T>` takes `columns: TableColumn<T>[]` and `rows: T[]` (every `T` requiring a stable
`id: string`) — not a compound `Table.Row`/`Table.Cell` family. The component owns sort and
selection bookkeeping itself; the consumer supplies data and reads back results
(`data-model.md`, research.md Decision 1).

```ts
type TableColumn<T> = {
  key: string;
  header: string;
  sortable?: boolean;                       // default: false
  numeric?: boolean;                         // default: false — right-aligns, numeric-tabular
  accessor?: (row: T) => string | number;    // default: row[key]
  render?: (row: T) => React.ReactNode;      // overrides display; disables truncation
};
```

## Color and typography role mapping

| Element | Token role |
|---|---|
| Table surface | `background` |
| Header background | `muted-surface` |
| Zebra-striped row (alternating) | `muted-surface` — fixed, no opt-out (Clarifications, Default Over Configure) |
| Row/column dividers | `border` |
| Focus ring (sortable header, checkboxes) | `ring` — same convention as Button/Field/Card |
| Column header text | `label` + `muted-foreground` |
| Text cell | `body-default` |
| Numeric cell | `numeric-tabular`, right-aligned |
| Empty-state message | `caption` + `muted-foreground` |

No new color or typography value is introduced.

## Sorting

Set `sortable: true` on a column to make its header an interactive button. Activating it
cycles `none → ascending → descending → ascending`; activating a different sortable column
moves the sort there and clears the previous column. Sort state is **internal and
uncontrolled** — there is no `sortColumn`/`onSortChange` prop, since `rows` is always the
full, already-loaded set (no pagination, see Assumptions below). The active column's `<th>`
carries `aria-sort`; inactive columns carry none. Non-sortable columns render a plain header
with no interactive affordance.

## Selection

Set `selectable: true` to add a checkbox per row and a select-all checkbox in the header. When
`selectable` is `true`, `selectedIds: ReadonlySet<string>` and
`onSelectionChange: (next: ReadonlySet<string>) => void` are **required** (a compile-time
error to omit, mirroring Card's discriminated-union props) — selection is fully
consumer-owned, the same way Card's `selected` is, so a consumer can read the current
selection to build its own bulk-action UI (including any visible count) without the table
imposing one.

Selection toggles **only via the checkbox** — clicking elsewhere in a row (e.g. to read its
content, or to activate a nested link rendered by a `render` column) never toggles selection.
This is a deliberate Clarifications-session decision, not a partial implementation.

The header select-all checkbox's checked/indeterminate/unchecked state is derived from
`selectedIds` against the currently visible rows; `indeterminate` is a DOM property with no
JSX equivalent and is set via a ref (research.md Decision 4).

## Truncation

A column without `render` displays its text truncated with an ellipsis plus a native `title`
tooltip carrying the full value. A column with `render` is left untouched — truncation only
has an unambiguous meaning for plain text, not arbitrary JSX (research.md Decision 5); a
`render`-based cell with overflow risk is the consumer's own responsibility.

## Loading and empty states

`loading` renders 5 pulsing skeleton rows under the (still visible) header. With
`loading={false}` and `rows.length === 0`, a single row spans every column showing
`emptyMessage` (default `"No data to display"`). The header and the table's outer structure
never disappear in either state.

## Horizontal scroll

The table is wrapped in its own `overflow-x-auto` container — when columns exceed the
available width, the table scrolls within its own bounds; the surrounding page layout never
resizes or reflows.

## Assumptions

No pagination, virtualization, multi-column sort, column resize/reorder, or inline editing —
per the constitution's "Scale To One, Not A Thousand" principle, a single operator's own
record sets are assumed small enough to render in full. Revisit only if a real dataset size
demonstrates otherwise.

## Adoption status

**Not yet adopted by `gridu-web`.** This feature defines and implements the component in
`gridu-design-system` only. Migrating `gridu-web`'s existing table-like surfaces onto this
component is explicit future work, same as Button, Field, and Card.

## Usage

```tsx
import { Table, type TableColumn } from "gridu-design-system";

type Client = { id: string; name: string; balance: number };

const columns: TableColumn<Client>[] = [
  { key: "name", header: "Name", sortable: true },
  { key: "balance", header: "Balance (CLP)", numeric: true, sortable: true },
];

// Static
<Table columns={columns} rows={clients} />

// Loading
<Table columns={columns} rows={clients} loading />

// Selectable, with a consumer-owned bulk-action bar
function ClientList({ clients }: { clients: Client[] }) {
  const [selectedIds, setSelectedIds] = useState<ReadonlySet<string>>(new Set());
  return (
    <>
      {selectedIds.size > 0 && <BulkActionBar count={selectedIds.size} />}
      <Table
        columns={columns}
        rows={clients}
        selectable
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
      />
    </>
  );
}
```
