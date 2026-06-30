# Tasks: Chart Component

**Input**: Design documents from `specs/12-chart-component/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/chart-api.md,
quickstart.md

**Tests**: plan.md and contracts/chart-api.md commit to `chart.test.tsx` covering the
contract's behavioral guarantees — these are included as part of each story's
implementation, not a separate TDD-first gate (spec.md does not request strict TDD).

**Organization**: Like Card, Table, and Navigation (Features 09-11), Chart ships as a single
`chart.tsx` file (plan.md Structure Decision — scale/path generation is internal
module-private logic, not a separate exported utility). Almost every task therefore edits
`chart.tsx`, so most tasks are sequential by necessity (same-file edits), matching the
single-file-per-story precedent — `[P]` is reserved for tasks that touch genuinely
independent files (`chart.test.tsx`, `playground/main.tsx`, `src/index.ts`, `README.md`).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Different files, no dependency on an incomplete task
- **[Story]**: Which user story this task serves (US1, US2, US3)
- All paths are relative to `gridu-design-system/` (repo root)

---

## Phase 1: Setup

**Purpose**: Confirm the existing Feature 07-11 tooling (no new config, no new dependency
per research.md Decision 1) is a valid baseline before adding new component files.

- [X] T001 Run `yarn typecheck`, `yarn test`, `yarn lint` against the current tree (Button +
  Field + Card + Table + Navigation only) and confirm all three pass — verification gate
  before any Chart file is added, so a pre-existing failure isn't mistaken for one introduced
  by this feature.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared types, the linear scale module, and a skeleton file every user story
builds on.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T002 Create `src/components/chart/chart.tsx` skeleton: `ChartMode`, `ChartPoint`,
  `ChartProps` (data-model.md), and a module-private linear scale helper (`value`/`index` →
  pixel coordinate, given `width`/`height` and the data's min/max — research.md Decision 1)
  with no rendering yet beyond a bare `<svg width={width} height={height}>`. Also define
  pixel constants for chart padding, axis-label margin, and bar gap, derived from the
  `space-4`/`space-2`/`space-1` tokens in `tokens.css` per data-model.md's Spacing role
  mapping (FR-005) — no other task introduces these constants.
- [X] T003 Implement the point-to-path/rect coordinate generator in `chart.tsx`: a pure
  function producing an ordered list of `{x, y}` (line mode) or `{x, y, height}` (bar mode,
  baseline-relative) per non-null point, consuming the Phase 2 scale helper — no SVG
  rendering wired up yet (research.md Decision 1, data-model.md Relationships).

**Checkpoint**: Foundation ready — User Story 1 implementation can begin.

---

## Phase 3: User Story 1 - A business owner reads a trend at a glance (Priority: P1) 🎯 MVP

**Goal**: Render a `mode="line"` chart from a multi-point series with axes, gridlines, and
tick labels resolving to documented token roles, exposing each point's exact value on
pointer/keyboard interaction and to assistive technology via a hidden data table.

**Independent Test**: Render a Chart with a multi-point time series in the playground;
assert in `chart.test.tsx` that the line, axes, and labels resolve only to documented token
roles, that pointing at or focusing a point shows its exact value in the floating label, and
that the hidden data table lists every point's label/value.

### Implementation for User Story 1

- [X] T004 [US1] Implement the line-mode `<path>` rendering in `chart.tsx` using T003's
  coordinate generator: one continuous `<path>` connecting all non-null points in order,
  stroked with the `brand` token color (FR-001, FR-003, research.md Decision 1, spec
  Assumptions).
- [X] T005 [US1] Implement the value axis and category/time axis: `<line>` axis lines and
  `<text>` tick labels using `border` (axis lines/gridlines) and `muted-foreground` (tick
  label color) token roles, tick label text using the `caption` typography role (FR-002,
  FR-003, FR-004, data-model.md role mapping tables).
- [X] T006 [US1] Implement the optional `title` (rendered with the `heading-subsection`
  typography role) and `valueAxisLabel` rendering (FR-002, data-model.md role mapping).
- [X] T007 [US1] Render a focusable marker (`<circle tabIndex={0}>`) at each non-null point's
  coordinates, with `focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`
  — the same convention as Button/Input/Card/Table/Navigation (FR-007).
- [X] T008 [US1] Implement the shared floating value label (research.md Decision 4): an
  internal, non-exported element styled with `background`/`border`/`body-secondary` token
  roles, shown for the active point/bar on `pointerenter` or `focus` of any marker, hidden
  otherwise; displays that point's exact `label` and `value` (FR-006, FR-007, SC-003).
- [X] T009 [US1] Implement the visually-hidden (`sr-only`) data table and wire the root
  `<svg role="img" aria-describedby={...}>` to reference it: one row per point listing
  `label`/`value`, independent of hover/focus state (FR-008, SC-004, research.md Decision 4).
  Render `valueAxisLabel` (when supplied) as the table's `<caption>` so axis meaning — not
  just point values — is also programmatically determinable (FR-008, SC-004).
- [X] T010 [US1] Create `src/index.ts` barrel export additions: `Chart` and its types
  (`ChartProps`, `ChartMode`, `ChartPoint`), alongside the existing
  `Button`/`Field`/`Input`/`Card`/`Table`/`Navigation` exports (contracts/chart-api.md).
- [X] T011 [US1] Add a Chart section to `playground/main.tsx`: a `mode="line"` example with a
  multi-point time series, a title, and a value axis label, demonstrating rest/hover/focus
  point interaction.
- [X] T012 [P] [US1] Write `src/components/chart/chart.test.tsx`: line rendering resolves
  only `tokens.css`/typography-system.md-traceable classes (no inline hex/oklch literals);
  pointing at and separately keyboard-focusing a point shows its exact label/value in the
  floating label; the hidden data table lists every point's label/value and a supplied
  `valueAxisLabel` appears as the table's caption; focus-visible ring applies only on
  keyboard focus; chart padding and axis-label margin resolve to the T002 spacing constants
  (FR-001, FR-002, FR-003, FR-004, FR-005, FR-006, FR-007, FR-008, SC-002, SC-003, SC-004).

**Checkpoint**: `yarn typecheck && yarn test && yarn lint` pass; `yarn dev` shows a correctly
styled line chart with working point interaction and a hidden a11y data table — User Story 1
is independently demoable.

---

## Phase 4: User Story 2 - A business owner compares discrete values across categories (Priority: P2)

**Goal**: `mode="bar"` renders one proportionally-sized bar per category — including
negative values below a zero baseline — using the same token roles and point-interaction
model already built for line mode in User Story 1.

**Independent Test**: Render the same Chart in `mode="bar"` with a set of labeled categories
(including a negative value) in the playground; confirm bar height/baseline-placement is
proportional to magnitude and per-bar interaction matches User Story 1's per-point behavior;
assert the same in `chart.test.tsx`.

### Implementation for User Story 2

- [X] T013 [US2] Implement the bar-mode `<rect>` rendering in `chart.tsx` using T003's
  coordinate generator: one `<rect>` per non-null point, fill `brand`, anchored at the zero
  baseline with height proportional to `|value|`, drawn below the baseline when `value < 0`,
  with the gap between adjacent bars set from the T002 bar-gap spacing constant (FR-001,
  FR-005, FR-012).
- [X] T014 [US2] Extend the zero baseline as a distinct `border`-token `<line>` (slightly
  heavier weight than the regular gridlines) so the proportional bar placement in T013 is
  visually anchored (FR-003, data-model.md role mapping).
- [X] T015 [US2] Wire each bar into the existing focus/floating-label/hidden-table machinery
  from User Story 1 (T007-T009): bars become the focusable marker element for `mode="bar"`,
  reusing the same floating label and data table with no mode-specific branching beyond which
  shape renders (FR-006, FR-007, FR-008).
- [X] T016 [US2] Add a `mode="bar"` example to `playground/main.tsx`: a category comparison
  including at least one negative value, demonstrating proportional bar height and
  below-baseline placement, alongside the existing line example.
- [X] T017 [P] [US2] Extend `chart.test.tsx`: bar mode renders one `<rect>` per category sized
  proportionally to its value; a negative value renders below the zero baseline; per-bar
  pointer/focus interaction exposes the exact label/value the same way as line-mode points
  (FR-001, FR-012, User Story 2 Acceptance Scenarios 1-2).

**Checkpoint**: User Stories 1 AND 2 both independently functional — line and bar modes share
one consistent visual and interaction model.

---

## Phase 5: User Story 3 - Data is empty, loading, or still arriving (Priority: P3)

**Goal**: `loading={true}` shows a stable-dimension placeholder and an empty `points` array
shows a documented empty-state message, each taking precedence in the correct order, rather
than a blank or broken chart area.

**Independent Test**: Render a Chart with `loading={true}` and separately with `points={[]}`
in the playground; confirm each shows its own treatment with no layout shift; assert the same
plus the loading/empty precedence in `chart.test.tsx`.

### Implementation for User Story 3

- [X] T018 [US3] Implement the loading placeholder in `chart.tsx`: when `loading={true}`,
  render a placeholder occupying the full `width`/`height` in place of the plot area, keeping
  `title`/axis labels (if provided) stable, taking precedence over the empty-state check
  (FR-009, data-model.md Relationships).
- [X] T019 [US3] Implement the empty-state message: when `points.length === 0` and
  `loading={false}`, render `emptyMessage` (default `"No data to display"`, matching Table's
  exact prop contract — research.md Decision 6) in place of the plot area (FR-010).
- [X] T020 [US3] Add loading and empty-state examples to `playground/main.tsx`: one Chart
  instance with `loading={true}`, one with `points={[]}`, alongside the line and bar examples.
- [X] T021 [P] [US3] Extend `chart.test.tsx`: `loading={true}` renders the placeholder at the
  given dimensions regardless of `points` content; `points={[]}` with `loading={false}`
  renders `emptyMessage`; `loading={true}` together with a non-empty `points` array still
  renders the loading placeholder, not the data (FR-009, FR-010, precedence per data-model.md
  Relationships).

**Checkpoint**: All three user stories independently functional — Chart component is
feature-complete per spec.md's User Scenarios.

---

## Phase 6: Polish & Cross-Cutting Concerns

- [X] T022 [US1] Implement the single-point line marker case (FR-011): when `mode="line"` and
  the non-null point count is exactly 1, render a lone marker with no `<path>`, reusing T007's
  marker rendering (no separate marker implementation).
- [X] T023 [US1] Implement the missing-value line break (FR-014, research.md Decision 5): a
  `null` value splits T004's path generation into separate `<path>` segments at that index, no
  marker rendered for the `null` point, and its row in the hidden data table (T009) reads "no
  data" instead of a numeric value.
- [X] T024 Implement tick-label thinning (FR-013): when the available `width` is too narrow to
  fit every category/time tick label without overlap, render only every Nth label (deterministic
  function of `width` and label count, per research.md Decision 3) rather than overlapping or
  wrapping labels.
- [X] T025 [P] Write `src/components/chart/README.md` per the documentation pattern
  established by `button/README.md`, `field/README.md`, `card/README.md`, `table/README.md`,
  and `navigation/README.md`: where the component lives, the element → `tokens.css` role
  mapping table (data-model.md), the typography-role mapping table, the `ChartProps`
  reference, and the "no charting library, hand-rolled SVG" + "fixed width/height, not
  responsive" notes (research.md Decisions 1 and 3).
- [X] T026 [P] Extend `chart.test.tsx`: a `mode="line"` series with exactly one point renders
  a marker and no `<path>`; a `null` value mid-series renders two separate `<path>` segments
  with a "no data" row in the hidden table for that point; a narrow `width` with many
  categories renders fewer than `points.length` tick labels with no overlap; two near-identical
  values (e.g. differing by <2%) render with heights/positions proportionally distinct per
  their actual value delta, not visually normalized or exaggerated (FR-011, FR-013, FR-014,
  Edge Cases, SC-005).
- [X] T027 Run quickstart.md's full manual playground checklist (line rendering, point
  interaction, screen-reader data table pass, bar rendering, loading state, empty state,
  single point, negative value, near-identical values, narrow-container label thinning,
  missing value) in a real browser and confirm every item passes.
- [X] T028 Run `yarn build` and confirm the library bundle exports `Chart` from `src/index.ts`
  with no build errors and no new runtime dependency added to `package.json`
  (contracts/chart-api.md, research.md Decision 1).

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion — blocks all user stories.
- **User Stories (Phase 3-5)**: All depend on Foundational completion.
  - US1 has no dependency on US2/US3.
  - US2 depends on US1's focus/floating-label/hidden-table machinery existing (T007-T009) but
    not on US3.
  - US3 depends on US1's basic rendering structure existing (root `<svg>`, T004-T006) but not
    on US2.
  - US1-US3 all touch the same single file (`chart.tsx`) — sequence them rather than run truly
    in parallel to avoid merge conflicts, same rationale as Button/Field/Card/Table/Navigation.
- **Polish (Phase 6)**: Single-point marker and missing-value break (T022-T023) depend on
  US1's line rendering (T004, T007, T009) existing; label thinning (T024) depends on US1's
  axis rendering (T005) existing; README/quickstart/build (T025, T027-T028) depend on
  US1-US3 all being complete.

### Within Each User Story

- Coordinate/rendering logic before interaction wiring before playground wiring before tests.
- Each story's checkpoint must pass before starting the next story.

### Parallel Opportunities

- Each story's test task (T012, T017, T021) is marked `[P]` relative to that story's
  playground/implementation tasks — it edits `chart.test.tsx`, a different file.
- T010 (barrel export) and T025 (README) are marked `[P]`/independent-file tasks relative to
  `chart.tsx` edits in their respective phases.

---

## Parallel Example: User Story 1

```bash
# Once T004-T011 land, run alongside final US1 implementation polish:
Task: "Write chart.test.tsx covering line rendering, point interaction, and hidden data table behavioral guarantees"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: `yarn typecheck && yarn test && yarn lint`, then visually confirm
   line rendering and point interaction in the playground
5. At this point a correctly styled, line-only Chart with working point interaction and a11y
   data table exists and is demoable, even before bar mode or loading/empty states land

### Incremental Delivery

1. Setup + Foundational → skeleton + scale/coordinate math ready
2. User Story 1 → line chart with point interaction demoable (MVP)
3. User Story 2 → bar mode layered on top, independently verified
4. User Story 3 → loading/empty states layered on top, independently verified
5. Polish → single-point marker + missing-value break + label thinning + documentation +
   final quickstart validation + build check

---

## Notes

- `[P]` tasks touch different files with no dependency on an incomplete task — most tasks in
  US1-US3 are sequential because they share `chart.tsx`, expected for a single-file
  component, not a sign of missing decomposition (plan.md Structure Decision).
- `[Story]` label maps each task to spec.md's user stories for traceability.
- Stop at each checkpoint to validate that story independently before continuing.
- No new runtime dependency is added at any point in this task list (research.md Decision 1)
  — T028's build check is also a verification that this held.
- Multi-series/categorical color support, additional chart types (pie/area/scatter), a
  dedicated mobile chart layout, and `ResizeObserver`-driven responsive sizing are explicitly
  out of scope (spec Assumptions, research.md Decision 3) — no task in this list builds any
  of them, by design, not as a partial implementation awaiting a future pass.
- Typography role mapping (data-model.md): chart title → `heading-subsection` (T006); axis
  tick labels → `caption` (T005); floating value label → `body-secondary` (T008); empty-state
  message → `body-secondary`/`muted-foreground` (T019).
