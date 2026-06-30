import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Table, type TableColumn } from "./table";

type ClientRow = { id: string; name: string; amount: number };

const rows: ClientRow[] = [
  { id: "1", name: "Beatriz", amount: 30 },
  { id: "2", name: "Andrés", amount: 10 },
  { id: "3", name: "Carla", amount: 20 },
];

const columns: TableColumn<ClientRow>[] = [
  { key: "name", header: "Name" },
  { key: "amount", header: "Amount", numeric: true },
];

describe("Table — rows and columns at rest (US1)", () => {
  it("renders the header/row/zebra-stripe tokens and no ad-hoc values", () => {
    render(<Table columns={columns} rows={rows} />);
    const headerRow = screen.getByText("Name").closest("tr")!;
    expect(headerRow.className).toContain("bg-muted-surface");
    expect(headerRow.className).toContain("border-border");

    const dataRows = screen.getAllByRole("row").slice(1);
    expect(dataRows[1]!.className).toContain("bg-muted-surface");
    expect(dataRows[0]!.className).not.toContain("bg-muted-surface");
  });

  it("applies the label, body-default, and numeric-tabular typography roles", () => {
    render(<Table columns={columns} rows={rows} />);
    expect(screen.getByText("Name").className).toContain("text-label");
    expect(screen.getByText("Beatriz").closest("td")!.className).toContain("text-body-default");
    const amountCell = screen.getByText("30").closest("td")!;
    expect(amountCell.className).toContain("text-numeric-tabular");
    expect(amountCell.className).toContain("text-right");
  });

  it("renders an empty-state message in place of rows when rows is empty", () => {
    render(<Table columns={columns} rows={[]} />);
    expect(screen.getByText("No data to display")).toBeInTheDocument();
    expect(screen.queryByText("Beatriz")).not.toBeInTheDocument();
  });

  it("supports a custom emptyMessage", () => {
    render(<Table columns={columns} rows={[]} emptyMessage="No clients yet" />);
    expect(screen.getByText("No clients yet")).toBeInTheDocument();
  });

  it("truncates plain text cells with a title attribute, and leaves render-based cells untouched", () => {
    const longName = "A".repeat(200);
    const customColumns: TableColumn<ClientRow>[] = [
      { key: "name", header: "Name" },
      { key: "amount", header: "Amount", render: (row) => <strong>${row.amount}</strong> },
    ];
    render(<Table columns={customColumns} rows={[{ id: "1", name: longName, amount: 30 }]} />);
    const cell = screen.getByText(longName);
    expect(cell.className).toContain("truncate");
    // A width cap is required for `truncate` to ever visually trigger — table-layout:
    // auto otherwise just widens the column to fit content (caught via browser screenshot).
    expect(cell.className).toMatch(/max-w-/);
    expect(cell).toHaveAttribute("title", longName);
    expect(screen.getByText("$30").tagName).toBe("STRONG");
  });
});

describe("Table — sorting (US2)", () => {
  const sortableColumns: TableColumn<ClientRow>[] = [
    { key: "name", header: "Name", sortable: true },
    { key: "amount", header: "Amount", numeric: true, sortable: true },
  ];

  it("reorders rows ascending then descending on repeated activation, and updates aria-sort", async () => {
    const user = userEvent.setup();
    render(<Table columns={sortableColumns} rows={rows} />);
    const nameHeader = screen.getByRole("columnheader", { name: /name/i });
    const sortButton = within(nameHeader).getByRole("button");

    await user.click(sortButton);
    expect(nameHeader).toHaveAttribute("aria-sort", "ascending");
    let dataRows = screen.getAllByRole("row").slice(1);
    expect(within(dataRows[0]!).getByText("Andrés")).toBeInTheDocument();

    await user.click(sortButton);
    expect(nameHeader).toHaveAttribute("aria-sort", "descending");
    dataRows = screen.getAllByRole("row").slice(1);
    expect(within(dataRows[0]!).getByText("Carla")).toBeInTheDocument();
  });

  it("moves the active sort to a newly activated column and clears the previous one", async () => {
    const user = userEvent.setup();
    render(<Table columns={sortableColumns} rows={rows} />);
    const nameHeader = screen.getByRole("columnheader", { name: /name/i });
    const amountHeader = screen.getByRole("columnheader", { name: /amount/i });

    await user.click(within(nameHeader).getByRole("button"));
    expect(nameHeader).toHaveAttribute("aria-sort", "ascending");

    await user.click(within(amountHeader).getByRole("button"));
    expect(amountHeader).toHaveAttribute("aria-sort", "ascending");
    expect(nameHeader).not.toHaveAttribute("aria-sort");
  });

  it("renders no button or aria-sort on a non-sortable column", () => {
    render(<Table columns={columns} rows={rows} />);
    const nameHeader = screen.getByRole("columnheader", { name: "Name" });
    expect(within(nameHeader).queryByRole("button")).not.toBeInTheDocument();
    expect(nameHeader).not.toHaveAttribute("aria-sort");
  });

  it("is activatable via the keyboard", async () => {
    const user = userEvent.setup();
    render(<Table columns={sortableColumns} rows={rows} />);
    const nameHeader = screen.getByRole("columnheader", { name: /name/i });
    await user.tab();
    expect(within(nameHeader).getByRole("button")).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(nameHeader).toHaveAttribute("aria-sort", "ascending");
  });
});

function SelectableHarness({ initial = new Set<string>() }: { initial?: Set<string> }) {
  const [selectedIds, setSelectedIds] = useState<ReadonlySet<string>>(initial);
  return (
    <Table
      columns={columns}
      rows={rows}
      selectable
      selectedIds={selectedIds}
      onSelectionChange={setSelectedIds}
    />
  );
}

describe("Table — row selection (US3)", () => {
  it("calls onSelectionChange with the row added/removed when its checkbox is toggled", async () => {
    const user = userEvent.setup();
    const onSelectionChange = vi.fn();
    render(
      <Table
        columns={columns}
        rows={rows}
        selectable
        selectedIds={new Set()}
        onSelectionChange={onSelectionChange}
      />,
    );
    await user.click(screen.getByRole("checkbox", { name: "Select row 1" }));
    expect(onSelectionChange).toHaveBeenCalledWith(new Set(["1"]));
  });

  it("derives the select-all checked/indeterminate/unchecked state from the current selection", () => {
    const { rerender } = render(
      <Table columns={columns} rows={rows} selectable selectedIds={new Set()} onSelectionChange={vi.fn()} />,
    );
    let selectAll = screen.getByRole("checkbox", { name: "Select all rows" }) as HTMLInputElement;
    expect(selectAll.checked).toBe(false);
    expect(selectAll.indeterminate).toBe(false);

    rerender(
      <Table
        columns={columns}
        rows={rows}
        selectable
        selectedIds={new Set(["1"])}
        onSelectionChange={vi.fn()}
      />,
    );
    selectAll = screen.getByRole("checkbox", { name: "Select all rows" }) as HTMLInputElement;
    expect(selectAll.indeterminate).toBe(true);

    rerender(
      <Table
        columns={columns}
        rows={rows}
        selectable
        selectedIds={new Set(["1", "2", "3"])}
        onSelectionChange={vi.fn()}
      />,
    );
    selectAll = screen.getByRole("checkbox", { name: "Select all rows" }) as HTMLInputElement;
    expect(selectAll.checked).toBe(true);
    expect(selectAll.indeterminate).toBe(false);
  });

  it("select-all selects every visible row, and deselects when already all selected", async () => {
    const user = userEvent.setup();
    render(<SelectableHarness />);
    const selectAll = screen.getByRole("checkbox", { name: "Select all rows" });

    await user.click(selectAll);
    rows.forEach((_, index) => {
      expect(screen.getByRole("checkbox", { name: `Select row ${index + 1}` })).toBeChecked();
    });

    await user.click(selectAll);
    rows.forEach((_, index) => {
      expect(screen.getByRole("checkbox", { name: `Select row ${index + 1}` })).not.toBeChecked();
    });
  });

  it("does not render a checkbox column when selectable is unset", () => {
    render(<Table columns={columns} rows={rows} />);
    expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();
  });

  it("a nested interactive element inside a render cell stays clickable and never triggers selection", async () => {
    const user = userEvent.setup();
    const onLinkClick = vi.fn();
    const onSelectionChange = vi.fn();
    const linkColumns: TableColumn<ClientRow>[] = [
      {
        key: "name",
        header: "Name",
        render: (row) => (
          <button type="button" onClick={onLinkClick}>
            {row.name}
          </button>
        ),
      },
    ];
    render(
      <Table
        columns={linkColumns}
        rows={rows}
        selectable
        selectedIds={new Set()}
        onSelectionChange={onSelectionChange}
      />,
    );
    await user.click(screen.getByRole("button", { name: "Beatriz" }));
    expect(onLinkClick).toHaveBeenCalledTimes(1);
    expect(onSelectionChange).not.toHaveBeenCalled();
  });
});

describe("Table — keyboard and screen-reader access (US4)", () => {
  it("associates each cell with its column header via scope=col", () => {
    render(<Table columns={columns} rows={rows} />);
    const nameHeader = screen.getByRole("columnheader", { name: "Name" });
    expect(nameHeader).toHaveAttribute("scope", "col");
  });

  it("includes a focus-visible ring on sortable headers and checkboxes", () => {
    const sortableColumns: TableColumn<ClientRow>[] = [{ key: "name", header: "Name", sortable: true }];
    render(
      <Table
        columns={sortableColumns}
        rows={rows}
        selectable
        selectedIds={new Set()}
        onSelectionChange={vi.fn()}
      />,
    );
    expect(screen.getByRole("button", { name: /name/i }).className).toContain("focus-visible:ring-ring");
    expect(screen.getByRole("checkbox", { name: "Select all rows" }).className).toContain(
      "focus-visible:ring-ring",
    );
  });

  it("every interactive element is reachable via Tab in document order", async () => {
    const user = userEvent.setup();
    const sortableColumns: TableColumn<ClientRow>[] = [{ key: "name", header: "Name", sortable: true }];
    render(
      <Table
        columns={sortableColumns}
        rows={[rows[0]!]}
        selectable
        selectedIds={new Set()}
        onSelectionChange={vi.fn()}
      />,
    );
    await user.tab();
    expect(screen.getByRole("checkbox", { name: "Select all rows" })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole("button", { name: /name/i })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole("checkbox", { name: "Select row 1" })).toHaveFocus();
  });
});

describe("Table — loading state", () => {
  it("keeps the header visible and renders skeleton rows instead of data or empty state", () => {
    render(<Table columns={columns} rows={rows} loading />);
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.queryByText("Beatriz")).not.toBeInTheDocument();
    expect(screen.queryByText("No data to display")).not.toBeInTheDocument();
    const skeletonRows = screen.getAllByRole("row").slice(1);
    expect(skeletonRows).toHaveLength(5);
  });
});

describe("Table — horizontal scroll wrapper", () => {
  it("wraps the table in an overflow-x-auto container", () => {
    render(<Table columns={columns} rows={rows} />);
    const table = screen.getByRole("table");
    expect(table.parentElement?.className).toContain("overflow-x-auto");
  });
});
