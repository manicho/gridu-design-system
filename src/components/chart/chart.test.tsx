import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { Chart, type ChartPoint } from "./chart";

const linePoints: ChartPoint[] = [
  { label: "Mon", value: 10 },
  { label: "Tue", value: 20 },
  { label: "Wed", value: 15 },
];

describe("Chart — line mode (US1)", () => {
  it("resolves all color/typography usage to tokens.css/typography-system.md roles, no inline hex/oklch literals", () => {
    const { container } = render(
      <Chart mode="line" points={linePoints} width={400} height={240} title="Bookings" />,
    );
    const path = container.querySelector("path")!;
    expect(path.getAttribute("class")).toContain("stroke-brand");
    const circle = container.querySelector("circle")!;
    expect(circle.getAttribute("class")).toContain("fill-brand");
    const html = container.innerHTML;
    expect(html).not.toMatch(/#[0-9a-fA-F]{3,8}\b/);
    expect(html).not.toMatch(/oklch\(/);
  });

  it("draws a single continuous path connecting all points", () => {
    const { container } = render(<Chart mode="line" points={linePoints} width={400} height={240} />);
    expect(container.querySelectorAll("path")).toHaveLength(1);
    expect(container.querySelectorAll("circle")).toHaveLength(3);
  });

  it("shows the exact label/value in the floating label on pointer and on keyboard focus", () => {
    const { container } = render(<Chart mode="line" points={linePoints} width={400} height={240} />);
    const circle = container.querySelectorAll("circle")[1]!; // Tue: 20

    fireEvent.pointerEnter(circle);
    expect(screen.getByText("Tue: 20")).toBeInTheDocument();
    fireEvent.pointerLeave(circle);
    expect(screen.queryByText("Tue: 20")).not.toBeInTheDocument();

    fireEvent.focus(circle);
    expect(screen.getByText("Tue: 20")).toBeInTheDocument();
    fireEvent.blur(circle);
    expect(screen.queryByText("Tue: 20")).not.toBeInTheDocument();
  });

  it("applies the focus-visible ring convention shared with Button/Card/Table/Navigation", () => {
    const { container } = render(<Chart mode="line" points={linePoints} width={400} height={240} />);
    const circle = container.querySelector("circle")!;
    expect(circle.getAttribute("class")).toContain("focus-visible:ring-ring");
    expect(circle.getAttribute("tabindex")).toBe("0");
  });

  it("exposes every point's label/value in a hidden data table, with the value axis label as its caption", () => {
    render(
      <Chart mode="line" points={linePoints} width={400} height={240} valueAxisLabel="Bookings" />,
    );
    const table = document.querySelector("table.sr-only")!;
    expect(table.querySelector("caption")?.textContent).toBe("Bookings");
    expect(table.textContent).toContain("Mon");
    expect(table.textContent).toContain("10");
    expect(table.textContent).toContain("Tue");
    expect(table.textContent).toContain("20");
  });

  it("exposes the chart as an accessible image with the title as its accessible name", () => {
    render(<Chart mode="line" points={linePoints} width={400} height={240} title="Weekly bookings" />);
    expect(screen.getByRole("img", { name: "Weekly bookings" })).toBeInTheDocument();
  });

  it("sizes chart padding and the axis-label margin from the documented spacing constants (FR-005)", () => {
    const { container } = render(<Chart mode="line" points={linePoints} width={400} height={240} />);
    const valueAxisLine = container.querySelector("line")!;
    // left = CHART_PADDING(16) + VALUE_AXIS_WIDTH(40) + AXIS_LABEL_MARGIN(8) = 64
    expect(valueAxisLine.getAttribute("x1")).toBe("64");
  });
});

describe("Chart — bar mode (US2)", () => {
  const barPoints: ChartPoint[] = [
    { label: "Haircut", value: 12 },
    { label: "Color", value: 5 },
    { label: "Refund", value: -3 },
  ];

  it("renders one bar per category, sized proportionally, using the same token roles as line mode", () => {
    const { container } = render(<Chart mode="bar" points={barPoints} width={400} height={240} />);
    const rects = container.querySelectorAll("rect");
    expect(rects).toHaveLength(3);
    rects.forEach((rect) => expect(rect.getAttribute("class")).toContain("fill-brand"));

    const heights = Array.from(rects).map((r) => Number(r.getAttribute("height")));
    // Haircut (12) is taller than Color (5).
    expect(heights[0]).toBeGreaterThan(heights[1]!);
  });

  it("draws a negative value below the zero baseline", () => {
    const { container } = render(<Chart mode="bar" points={barPoints} width={400} height={240} />);
    const rects = container.querySelectorAll("rect");
    const zeroLine = container.querySelectorAll("line")[2]; // value-axis line, bottom edge, zero baseline
    const zeroY = Number(zeroLine?.getAttribute("y1"));
    const refundBar = rects[2]!;
    const refundTop = Number(refundBar.getAttribute("y"));
    // A negative bar's top edge sits at (or below) the zero baseline, not above it.
    expect(refundTop).toBeGreaterThanOrEqual(zeroY - 1);
  });

  it("exposes per-bar value the same way as a line-mode point", () => {
    const { container } = render(<Chart mode="bar" points={barPoints} width={400} height={240} />);
    const rect = container.querySelectorAll("rect")[1]!; // Color: 5
    fireEvent.focus(rect);
    expect(screen.getByText("Color: 5")).toBeInTheDocument();
  });
});

describe("Chart — loading and empty states (US3)", () => {
  it("renders a stable-dimension placeholder while loading, regardless of points", () => {
    const { container } = render(
      <Chart mode="line" points={linePoints} width={300} height={200} loading title="Bookings" />,
    );
    expect(container.querySelector("svg")).not.toBeInTheDocument();
    expect(container.querySelector(".animate-pulse")).toBeInTheDocument();
    expect(screen.getByText("Bookings")).toBeInTheDocument();
  });

  it("renders the documented empty message in place of the plot area when points is empty", () => {
    render(<Chart mode="line" points={[]} width={300} height={200} />);
    expect(screen.getByText("No data to display")).toBeInTheDocument();
  });

  it("renders a custom emptyMessage when supplied", () => {
    render(<Chart mode="bar" points={[]} width={300} height={200} emptyMessage="No bookings yet" />);
    expect(screen.getByText("No bookings yet")).toBeInTheDocument();
  });

  it("prefers the loading placeholder over the empty state when both are true", () => {
    const { container } = render(<Chart mode="line" points={[]} width={300} height={200} loading />);
    expect(container.querySelector(".animate-pulse")).toBeInTheDocument();
    expect(screen.queryByText("No data to display")).not.toBeInTheDocument();
  });
});

describe("Chart — edge cases (Polish)", () => {
  it("renders a single-point line series as a lone marker, no path", () => {
    const { container } = render(
      <Chart mode="line" points={[{ label: "Today", value: 7 }]} width={300} height={200} />,
    );
    expect(container.querySelectorAll("path")).toHaveLength(0);
    expect(container.querySelectorAll("circle")).toHaveLength(1);
  });

  it("breaks the line into separate path segments at a null value, with no marker for the gap", () => {
    const gapPoints: ChartPoint[] = [
      { label: "Mon", value: 10 },
      { label: "Tue", value: null },
      { label: "Wed", value: 15 },
    ];
    const { container } = render(<Chart mode="line" points={gapPoints} width={400} height={240} />);
    expect(container.querySelectorAll("path")).toHaveLength(0); // each segment has only 1 point
    expect(container.querySelectorAll("circle")).toHaveLength(2);

    const table = document.querySelector("table.sr-only")!;
    expect(table.textContent).toContain("No data");
  });

  it("thins category tick labels rather than overlapping when the container is narrow", () => {
    const manyPoints: ChartPoint[] = Array.from({ length: 20 }, (_, i) => ({
      label: `Day ${i + 1}`,
      value: i,
    }));
    const { container } = render(<Chart mode="line" points={manyPoints} width={300} height={200} />);
    const tickTexts = container.querySelectorAll('text[class*="fill-muted-foreground"]');
    expect(tickTexts.length).toBeLessThan(manyPoints.length);
  });

  it("renders near-identical values with a proportionally distinct, not exaggerated, height/position", () => {
    const closePoints: ChartPoint[] = [
      { label: "A", value: 100 },
      { label: "B", value: 101 },
    ];
    const { container } = render(<Chart mode="bar" points={closePoints} width={400} height={240} />);
    const rects = container.querySelectorAll("rect");
    const heightA = Number(rects[0]!.getAttribute("height"));
    const heightB = Number(rects[1]!.getAttribute("height"));
    // Domain spans [0, 101], so a 1-unit difference is a tiny fraction of the plot height —
    // confirms the scale isn't artificially zoomed to make a small delta look large.
    expect(Math.abs(heightA - heightB)).toBeLessThan(5);
  });
});
