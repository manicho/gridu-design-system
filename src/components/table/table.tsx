import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { cn } from "../../lib/utils";

export type TableColumn<T> = {
  key: string;
  header: string;
  sortable?: boolean;
  numeric?: boolean;
  accessor?: (row: T) => string | number;
  render?: (row: T) => ReactNode;
};

type SortDirection = "ascending" | "descending";
type SortState = { columnKey: string; direction: SortDirection } | null;

type CommonTableProps<T> = {
  columns: TableColumn<T>[];
  rows: T[];
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
};

export type NonSelectableTableProps<T> = CommonTableProps<T> & {
  selectable?: false;
};

export type SelectableTableProps<T> = CommonTableProps<T> & {
  selectable: true;
  selectedIds: ReadonlySet<string>;
  onSelectionChange: (next: ReadonlySet<string>) => void;
};

export type TableProps<T> = NonSelectableTableProps<T> | SelectableTableProps<T>;

// research.md Decision 6 — a fixed constant, not a configurable/derived count, per Default
// Over Configure.
const SKELETON_ROW_COUNT = 5;

const EMPTY_SELECTION: ReadonlySet<string> = new Set();

// Focus-ring convention shared with Button (Feature 07), Field (Feature 08), and Card
// (Feature 09) — same `ring` token, same focus-visible-only application.
const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background";

const CHECKBOX_CLASS = cn(
  "h-4 w-4 shrink-0 rounded border border-border accent-foreground",
  FOCUS_RING,
);

function getCellValue<T>(column: TableColumn<T>, row: T): string | number {
  if (column.accessor) return column.accessor(row);
  return (row as Record<string, unknown>)[column.key] as string | number;
}

type HeaderCheckboxProps = {
  checked: boolean;
  indeterminate: boolean;
  onChange: () => void;
  label: string;
};

// research.md Decision 4 — `indeterminate` is a DOM property with no JSX/HTML attribute
// equivalent, so it must be set imperatively via a ref.
function HeaderCheckbox({ checked, indeterminate, onChange, label }: HeaderCheckboxProps) {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (ref.current) ref.current.indeterminate = indeterminate;
  }, [indeterminate]);

  return (
    <input
      ref={ref}
      type="checkbox"
      checked={checked}
      onChange={onChange}
      aria-label={label}
      className={CHECKBOX_CLASS}
    />
  );
}

export function Table<T extends { id: string }>(props: TableProps<T>) {
  const { columns, rows, loading = false, emptyMessage = "No data to display", className } = props;
  const [sortState, setSortState] = useState<SortState>(null);

  // research.md Decision 2 — internal, uncontrolled, single active column only.
  const sortedRows = useMemo(() => {
    if (!sortState) return rows;
    const column = columns.find((c) => c.key === sortState.columnKey);
    if (!column || !column.sortable) return rows;
    const sorted = [...rows].sort((a, b) => {
      const valueA = getCellValue(column, a);
      const valueB = getCellValue(column, b);
      if (valueA < valueB) return -1;
      if (valueA > valueB) return 1;
      return 0;
    });
    if (sortState.direction === "descending") sorted.reverse();
    return sorted;
  }, [rows, sortState, columns]);

  function toggleSort(columnKey: string) {
    setSortState((previous) => {
      if (!previous || previous.columnKey !== columnKey) return { columnKey, direction: "ascending" };
      if (previous.direction === "ascending") return { columnKey, direction: "descending" };
      return { columnKey, direction: "ascending" };
    });
  }

  // research.md Decision 3 — selection is fully consumer-controlled; `selectedIds` only
  // exists when `selectable: true` (TableProps discriminated union).
  const selectedIds = props.selectable ? props.selectedIds : EMPTY_SELECTION;
  const visibleIds = rows.map((row) => row.id);
  const selectedVisibleCount = visibleIds.filter((id) => selectedIds.has(id)).length;
  const allSelected = visibleIds.length > 0 && selectedVisibleCount === visibleIds.length;
  const someSelected = selectedVisibleCount > 0 && !allSelected;

  function toggleRow(id: string) {
    if (!props.selectable) return;
    const next = new Set(props.selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    props.onSelectionChange(next);
  }

  function toggleAll() {
    if (!props.selectable) return;
    props.onSelectionChange(allSelected ? new Set() : new Set(visibleIds));
  }

  const columnCount = columns.length + (props.selectable ? 1 : 0);

  return (
    <div className={cn("overflow-x-auto rounded-md border border-border", className)}>
      <table className="w-full border-collapse bg-background text-left">
        <thead>
          <tr className="border-b border-border bg-muted-surface">
            {props.selectable && (
              <th scope="col" className="w-10 px-4 py-3">
                <HeaderCheckbox
                  checked={allSelected}
                  indeterminate={someSelected}
                  onChange={toggleAll}
                  label="Select all rows"
                />
              </th>
            )}
            {columns.map((column) => {
              const isActive = sortState?.columnKey === column.key;
              const headerClasses = cn(
                "px-4 py-3 text-label text-muted-foreground",
                column.numeric && "text-right",
              );

              if (!column.sortable) {
                return (
                  <th key={column.key} scope="col" className={headerClasses}>
                    {column.header}
                  </th>
                );
              }

              return (
                <th
                  key={column.key}
                  scope="col"
                  aria-sort={isActive ? sortState!.direction : undefined}
                  className={headerClasses}
                >
                  <button
                    type="button"
                    onClick={() => toggleSort(column.key)}
                    className={cn(
                      "inline-flex items-center gap-1 rounded-sm",
                      column.numeric && "flex-row-reverse",
                      FOCUS_RING,
                    )}
                  >
                    {column.header}
                    <span aria-hidden="true" className="text-muted-foreground">
                      {!isActive ? "↕" : sortState!.direction === "ascending" ? "↑" : "↓"}
                    </span>
                  </button>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            Array.from({ length: SKELETON_ROW_COUNT }).map((_, rowIndex) => (
              <tr key={rowIndex} className="border-b border-border last:border-b-0">
                {Array.from({ length: columnCount }).map((__, cellIndex) => (
                  <td key={cellIndex} className="px-4 py-3">
                    <span className="block h-4 w-full animate-pulse rounded bg-muted-surface" />
                  </td>
                ))}
              </tr>
            ))
          ) : sortedRows.length === 0 ? (
            <tr>
              <td
                colSpan={columnCount}
                className="px-4 py-6 text-center text-caption text-muted-foreground"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            sortedRows.map((row, rowIndex) => {
              const isSelected = selectedIds.has(row.id);
              return (
                <tr
                  key={row.id}
                  className={cn(
                    "border-b border-border last:border-b-0",
                    rowIndex % 2 === 1 && "bg-muted-surface",
                    // FR-013 — a selected row is distinguished by more than color: a border
                    // accent, not just the (already color-only) zebra/selection background.
                    isSelected && "border-l-2 border-l-foreground",
                  )}
                >
                  {props.selectable && (
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleRow(row.id)}
                        aria-label={`Select row ${rowIndex + 1}`}
                        className={CHECKBOX_CLASS}
                      />
                    </td>
                  )}
                  {columns.map((column) => {
                    const cellClasses = cn(
                      "px-4 py-3 text-foreground",
                      column.numeric ? "text-right text-numeric-tabular" : "text-body-default",
                    );

                    if (column.render) {
                      return (
                        <td key={column.key} className={cellClasses}>
                          {column.render(row)}
                        </td>
                      );
                    }

                    // research.md Decision 5 — truncation + title only for plain-string
                    // content; a `render`-based cell (handled above) owns its own overflow.
                    const value = getCellValue(column, row);
                    return (
                      <td key={column.key} className={cellClasses}>
                        {/* max-w-xs caps the cell so `truncate` has a width to clip
                            against — table-layout: auto otherwise just widens the column
                            to fit content, and truncation never visibly triggers (FR-018). */}
                        <span className="block max-w-xs truncate" title={String(value)}>
                          {value}
                        </span>
                      </td>
                    );
                  })}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
