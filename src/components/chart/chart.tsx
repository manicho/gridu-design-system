import { useId, useState } from "react";
import { cn } from "../../lib/utils";

export type ChartMode = "line" | "bar";

export type ChartPoint = {
  label: string;
  value: number | null;
};

export type ChartProps = {
  mode: ChartMode;
  points: ChartPoint[];
  width: number;
  height: number;
  title?: string;
  valueAxisLabel?: string;
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
};

// data-model.md Spacing role mapping — Tailwind's default rem scale converted to px for SVG
// coordinate math (1rem = 16px); SVG attributes take raw numbers, not utility classes, so
// these constants are the FR-005 equivalent of `p-4`/`gap-2`/`gap-1` for this component.
const CHART_PADDING = 16; // space-4 — SVG edge to plot area
const AXIS_LABEL_MARGIN = 8; // space-2 — tick label to axis line
const BAR_GAP = 4; // space-1 — gap between adjacent bars

const TITLE_HEIGHT = 24;
const VALUE_AXIS_WIDTH = 40;
const CATEGORY_AXIS_HEIGHT = 20;

// Estimated pixel width of one tick label, used only to decide how many labels fit (FR-013).
// Not real text measurement — consistent with the fixed-dimension, no-ResizeObserver scope
// cut in research.md Decision 3.
const ESTIMATED_LABEL_WIDTH = 56;

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background";

type PlotArea = {
  left: number;
  top: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
};

function computePlotArea(width: number, height: number, hasTitle: boolean): PlotArea {
  const left = CHART_PADDING + VALUE_AXIS_WIDTH + AXIS_LABEL_MARGIN;
  const top = CHART_PADDING + (hasTitle ? TITLE_HEIGHT : 0);
  const right = width - CHART_PADDING;
  const bottom = height - CHART_PADDING - CATEGORY_AXIS_HEIGHT - AXIS_LABEL_MARGIN;
  return { left, top, right, bottom, width: right - left, height: bottom - top };
}

function indexToX(index: number, count: number, plot: PlotArea): number {
  if (count <= 1) return plot.left + plot.width / 2;
  return plot.left + (index / (count - 1)) * plot.width;
}

// FR-013 — show every Nth label rather than overlapping or wrapping.
function labelStride(count: number, plotWidth: number): number {
  if (count <= 1) return 1;
  const maxLabels = Math.max(1, Math.floor(plotWidth / ESTIMATED_LABEL_WIDTH));
  return Math.max(1, Math.ceil(count / maxLabels));
}

// A middle-anchored label at the plot's own left/right edge overflows the SVG's
// drawable area by roughly half its rendered width, regardless of the chart's
// total width (the edge position is always plot.left/plot.right). Anchoring the
// first/last *shown* label to start/end instead keeps it inside the SVG bounds.
function tickAnchor(index: number, lastShownIndex: number): "start" | "middle" | "end" {
  if (index === 0) return "start";
  if (index === lastShownIndex) return "end";
  return "middle";
}

function formatTickValue(value: number): string {
  return String(Math.round(value * 100) / 100);
}

type LineSegmentPoint = { index: number; x: number; y: number };

// research.md Decision 5 — a null value splits the series into separate path segments; a
// segment of length 1 (whether from a one-point series or an isolated point between two
// gaps) renders no path, only its marker (FR-011, FR-014).
function buildLineSegments(
  points: ChartPoint[],
  plot: PlotArea,
  valueScale: (value: number) => number,
): LineSegmentPoint[][] {
  const segments: LineSegmentPoint[][] = [];
  let current: LineSegmentPoint[] = [];
  points.forEach((point, index) => {
    if (point.value === null) {
      if (current.length > 0) segments.push(current);
      current = [];
      return;
    }
    current.push({ index, x: indexToX(index, points.length, plot), y: valueScale(point.value) });
  });
  if (current.length > 0) segments.push(current);
  return segments;
}

type BarRect = { index: number; x: number; y: number; width: number; height: number };

// FR-012 — bars are anchored at the zero baseline; a negative value draws below it.
function buildBarRects(
  points: ChartPoint[],
  plot: PlotArea,
  valueScale: (value: number) => number,
): BarRect[] {
  const slotWidth = plot.width / points.length;
  const barWidth = Math.max(slotWidth - BAR_GAP, 1);
  const zeroY = valueScale(0);
  const rects: BarRect[] = [];
  points.forEach((point, index) => {
    if (point.value === null) return;
    const valueY = valueScale(point.value);
    rects.push({
      index,
      x: plot.left + index * slotWidth + (slotWidth - barWidth) / 2,
      y: Math.min(zeroY, valueY),
      width: barWidth,
      height: Math.abs(zeroY - valueY),
    });
  });
  return rects;
}

type ActivePoint = { index: number; x: number; y: number } | null;

// research.md Decision 4 — an internal, non-exported floating label (not a reusable Tooltip
// primitive), shown on pointerenter or focus of any marker/bar.
function FloatingLabel({ active, points }: { active: ActivePoint; points: ChartPoint[] }) {
  if (!active) return null;
  const point = points[active.index]!;
  return (
    <div
      className="pointer-events-none absolute -translate-x-1/2 -translate-y-full whitespace-nowrap rounded border border-border bg-background px-2 py-1 text-body-secondary text-foreground shadow-sm"
      style={{ left: active.x, top: active.y - 8 }}
    >
      {point.label}: {point.value === null ? "No data" : point.value}
    </div>
  );
}

export function Chart({
  mode,
  points,
  width,
  height,
  title,
  valueAxisLabel,
  loading = false,
  emptyMessage = "No data to display",
  className,
}: ChartProps) {
  const descriptionId = useId();
  const [active, setActive] = useState<ActivePoint>(null);

  // research.md Decision 6 — loading takes precedence over the empty state, matching Table's
  // existing loading-over-emptyMessage precedence (FR-009, FR-010).
  if (loading) {
    return (
      <div className={cn("relative", className)} style={{ width, height }}>
        {title && (
          <div className="text-heading-subsection font-medium text-foreground">{title}</div>
        )}
        <div
          className="animate-pulse rounded bg-muted-surface"
          style={{ width, height: title ? height - TITLE_HEIGHT : height }}
        />
      </div>
    );
  }

  if (points.length === 0) {
    return (
      <div
        className={cn(
          "flex items-center justify-center rounded border border-border bg-background text-body-secondary text-muted-foreground",
          className,
        )}
        style={{ width, height }}
      >
        {emptyMessage}
      </div>
    );
  }

  const hasTitle = Boolean(title);
  const plot = computePlotArea(width, height, hasTitle);

  // research.md Decision 1 — the domain always includes zero, so magnitude differences are
  // never exaggerated by a truncated axis (Edge Cases — near-identical values, SC-005).
  const values = points
    .filter((point): point is ChartPoint & { value: number } => point.value !== null)
    .map((point) => point.value);
  const domainMin = Math.min(0, ...values);
  const domainMax = Math.max(0, ...values);
  const domainSpan = domainMax - domainMin;
  const valueScale = (value: number) =>
    domainSpan === 0 ? plot.top + plot.height / 2 : plot.bottom - ((value - domainMin) / domainSpan) * plot.height;
  const zeroY = valueScale(0);

  const stride = labelStride(points.length, plot.width);
  const lastShownIndex = Math.floor((points.length - 1) / stride) * stride;
  const lineSegments = mode === "line" ? buildLineSegments(points, plot, valueScale) : [];
  const barRects = mode === "bar" ? buildBarRects(points, plot, valueScale) : [];

  function showActive(index: number, x: number, y: number) {
    setActive({ index, x, y });
  }
  function clearActive() {
    setActive(null);
  }

  return (
    <div className={cn("relative", className)} style={{ width, height }}>
      <svg width={width} height={height} role="img" aria-label={title ?? "Chart"} aria-describedby={descriptionId}>
        {hasTitle && (
          <text
            x={CHART_PADDING}
            y={CHART_PADDING + 14}
            className="text-heading-subsection fill-foreground font-medium"
          >
            {title}
          </text>
        )}

        <line x1={plot.left} y1={plot.top} x2={plot.left} y2={plot.bottom} className="stroke-border" />
        <line x1={plot.left} y1={plot.bottom} x2={plot.right} y2={plot.bottom} className="stroke-border" />
        {mode === "bar" && zeroY !== plot.bottom && (
          <line
            x1={plot.left}
            y1={zeroY}
            x2={plot.right}
            y2={zeroY}
            strokeWidth={1.5}
            className="stroke-border"
          />
        )}

        {points.map((point, index) =>
          index % stride === 0 ? (
            <text
              key={`tick-${index}`}
              x={indexToX(index, points.length, plot)}
              y={plot.bottom + CATEGORY_AXIS_HEIGHT}
              textAnchor={tickAnchor(index, lastShownIndex)}
              className="text-caption fill-muted-foreground"
            >
              {point.label}
            </text>
          ) : null,
        )}

        {[domainMax, (domainMin + domainMax) / 2, domainMin].map((tickValue, i) => (
          <text
            key={`value-tick-${i}`}
            x={plot.left - AXIS_LABEL_MARGIN}
            y={valueScale(tickValue)}
            textAnchor="end"
            dominantBaseline="middle"
            className="text-caption fill-muted-foreground"
          >
            {formatTickValue(tickValue)}
          </text>
        ))}

        {mode === "line" &&
          lineSegments.map((segment, segmentIndex) =>
            segment.length > 1 ? (
              <path
                key={`segment-${segmentIndex}`}
                d={segment.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ")}
                fill="none"
                strokeWidth={2}
                className="stroke-brand"
              />
            ) : null,
          )}

        {mode === "line" &&
          lineSegments.flat().map((linePoint) => {
            const point = points[linePoint.index]!;
            return (
              <circle
                key={`point-${linePoint.index}`}
                cx={linePoint.x}
                cy={linePoint.y}
                r={4}
                tabIndex={0}
                className={cn("fill-brand outline-none", FOCUS_RING)}
                aria-label={`${point.label}: ${point.value}`}
                onPointerEnter={() => showActive(linePoint.index, linePoint.x, linePoint.y)}
                onPointerLeave={clearActive}
                onFocus={() => showActive(linePoint.index, linePoint.x, linePoint.y)}
                onBlur={clearActive}
              />
            );
          })}

        {mode === "bar" &&
          barRects.map((rect) => {
            const point = points[rect.index]!;
            return (
              <rect
                key={`bar-${rect.index}`}
                x={rect.x}
                y={rect.y}
                width={rect.width}
                height={rect.height}
                tabIndex={0}
                className={cn("fill-brand outline-none", FOCUS_RING)}
                aria-label={`${point.label}: ${point.value}`}
                onPointerEnter={() => showActive(rect.index, rect.x + rect.width / 2, rect.y)}
                onPointerLeave={clearActive}
                onFocus={() => showActive(rect.index, rect.x + rect.width / 2, rect.y)}
                onBlur={clearActive}
              />
            );
          })}
      </svg>

      <FloatingLabel active={active} points={points} />

      {/* FR-008, SC-004 — the complete dataset, independent of hover/focus state. */}
      <table id={descriptionId} className="sr-only">
        {valueAxisLabel && <caption>{valueAxisLabel}</caption>}
        <tbody>
          {points.map((point, index) => (
            <tr key={index}>
              <td>{point.label}</td>
              <td>{point.value === null ? "No data" : point.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
