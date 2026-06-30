# Quickstart: Validating the Chart Component

Prerequisites: same Node/`yarn` setup used for Features 07-11 — no new tooling is introduced
by this feature.

## Setup

```sh
cd gridu-design-system
yarn install
```

## Run the local playground (visual verification)

```sh
yarn dev
```

Opens the Vite playground (`playground/index.html`), extended with a Chart section alongside
the existing Button, Field, Card, Table, and Navigation grids. Use this to manually verify,
in a real browser, before calling the feature done:

- [ ] **SC-001 / User Story 1**: Render a `mode="line"` chart with a multi-point time series
  — confirm the line, axes, and tick labels all resolve to documented token roles (FR-003,
  FR-004), with no ad-hoc colors or font sizes.
- [ ] **User Story 1 Acceptance Scenario 2**: Point at and separately keyboard-focus an
  individual data point — confirm the floating label shows its exact value both times
  (FR-006, FR-007).
- [ ] **User Story 1 Acceptance Scenario 3**: With a screen reader, inspect the chart —
  confirm the chart's purpose and every underlying value are announced via the hidden data
  table, independent of the visual rendering (FR-008).
- [ ] **User Story 2 / FR-001**: Render the same shape of data in `mode="bar"` — confirm bar
  fill, axes, and labels use the same token roles as line mode, and per-bar values are
  exposed the same way as per-point values.
- [ ] **User Story 3 / FR-009**: Render with `loading={true}` — confirm a placeholder fills
  the chart's full dimensions with no layout shift once real data replaces it.
- [ ] **User Story 3 / FR-010**: Render with `points={[]}` — confirm the documented empty
  message appears in place of the plot area.
- [ ] **Edge Cases — single point (FR-011)**: Render `mode="line"` with one point — confirm
  it renders as a lone marker, not a degenerate or missing line.
- [ ] **Edge Cases — negative value (FR-012)**: Render `mode="bar"` with a mix of positive
  and negative values — confirm negative bars draw below the zero baseline, proportional to
  magnitude.
- [ ] **Edge Cases — narrow container (FR-013)**: Render a chart with many categories at a
  narrow `width` — confirm tick labels thin out (every Nth label) rather than overlapping.
- [ ] **Edge Cases — missing value (FR-014)**: Render `mode="line"` with a `null` value
  mid-series — confirm the line shows a visible break at that point, distinguishable from a
  point with value `0`.
- [ ] **Edge Cases — near-identical values (SC-005)**: Render two bars/points with very close
  values — confirm the rendered difference matches the actual proportional delta, with no
  visual exaggeration or normalization.

## Run automated checks

```sh
yarn typecheck   # tsc -b --noEmit
yarn test        # vitest run — chart.test.tsx behavioral assertions (see contracts/chart-api.md)
yarn lint        # eslint .
```

All three MUST pass before this feature is considered implemented, per this project's
standard "done" bar.

## Expected outcome

- `yarn build` produces a library bundle from `src/index.ts` additionally exporting `Chart`
  alongside the existing `Button`, `Field`/`Input`, `Card`, `Table`, and `Navigation` exports.
- No new runtime dependency is added to `package.json` (research.md Decision 1).
- No file outside `gridu-design-system` changes as a result of this feature (any existing
  `gridu-web` chart implementation stays unmigrated, per spec Assumptions).
