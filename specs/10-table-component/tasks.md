# Tasks: Table Component

**Input**: Design documents from `specs/10-table-component/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/table-api.md, quickstart.md

**Tests**: plan.md and contracts/table-api.md commit to `table.test.tsx` covering the
contract's behavioral guarantees — these are included as part of each story's implementation,
not a separate TDD-first gate (spec.md does not request strict TDD).

> **Post-`/speckit-analyze` revision**: this version fixes one finding from the analysis
> pass — User Story 3's narrative implied the Table itself renders a visible selection-count
> UI, which no FR or contract delivers (selection is consumer-owned per research.md Decision
> 3); spec.md US3 now reads "the consumer reads the current selection... and renders any count
> itself," and FR-002's zebra-striping wording was tightened from "on by default" to "fixed,
> with no opt-out" to remove any implication of a configurability prop that doesn't exist.

**Organization**: Like Card (Feature 09), Table ships as a single `table.tsx` file (plan.md
Structure Decision — the row checkbox is inline, not a standalone subcomponent). Almost every
task therefore edits `table.tsx`, so most tasks are sequential by necessity (same-file edits),
matching Button/Field/Card's single-file-per-story precedent — `[P]` is reserved for tasks
that touch genuinely independent files (`table.test.tsx`, `playground/main.tsx`,
`src/index.ts`).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Different files, no dependency on an incomplete task
- **[Story]**: Which user story this task serves (US1, US2, US3, US4)
- All paths are relative to `gridu-design-system/` (repo root)

---

## Phase 1: Setup

**Purpose**: Confirm the existing Feature 07-09 tooling (no new config) is a valid baseline
before adding new component files.

- [X] T001 Run `yarn typecheck`, `yarn test`, `yarn lint` against the current tree (Button +
  Field + Card only) and confirm all three pass — verification gate before any Table file is
  added, so a pre-existing failure isn't mistaken for one introduced by this feature.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared types and skeleton file every user story builds on.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T002 Create `src/components/table/table.tsx` skeleton: `TableColumn<T>` type,
  `CommonTableProps<T>`/`NonSelectableTableProps<T>`/`SelectableTableProps<T>`/`TableProps<T>`
  discriminated union (data-model.md), a bare `Table<T>` function rendering an unstyled
  `<div><table><thead><tr>{columns}</tr></thead><tbody>{rows}</tbody></table></div>` skeleton
  with no sort/selection/loading/empty logic yet.

**Checkpoint**: Foundation ready — User Story 1 implementation can begin.

---

## Phase 3: User Story 1 - A consumer surface renders a set of records as rows and columns at rest (Priority: P1) 🎯 MVP

**Goal**: Render a header row and data rows using documented surface/border/typography roles,
with zebra striping on by default (Clarifications), correct typography role per column type
(text vs. numeric), and a documented empty-state message when `rows` is empty.

**Independent Test**: Render a Table with mixed text/numeric columns and several rows in the
playground; assert in `table.test.tsx` that every region's resolved classNames trace to
documented roles, zebra striping alternates correctly, and an empty `rows` array renders the
empty-state message instead of an empty row area.

### Implementation for User Story 1

- [X] T003 [US1] Implement base table/header styling in `table.tsx`: outer wrapper
  `overflow-x-auto` (FR-019), `<table>` surface `bg-background`, `<thead>` row
  `bg-muted-surface` with a `border-b border-border` divider beneath it, cell padding/row
  height using the spacing/sizing scale from `06-define-design-tokens` (no ad-hoc pixel
  values) (FR-002, FR-021).
- [X] T004 [US1] Implement column header rendering: one `<th>` per `columns` entry using the
  `label` typography role + `text-muted-foreground` (data-model.md Typography role mapping)
  (FR-001, FR-003).
- [X] T005 [US1] Implement data row rendering: one `<tr>` per `rows` entry, one `<td>` per
  column resolving `accessor` (or `row[key]` default) when no `render` is given, or calling
  `render(row)` when present; numeric columns (`numeric: true`) right-align and use
  `numeric-tabular`, text columns use `body-default` (FR-001, FR-003, data-model.md Typography
  role mapping).
- [X] T006 [US1] Implement zebra striping: every other data row applies `bg-muted-surface`,
  row dividers use `border-b border-border` between all rows (Clarifications, FR-002).
- [X] T007 [US1] Implement the empty-state row (research.md Decision 6): when `rows.length
  === 0`, render a single `<tr>` with one `<td colSpan={columnCount}>` showing `emptyMessage`
  (default `"No data to display"`) in `caption` + `text-muted-foreground`, in place of data
  rows (FR-004).
- [X] T008 [US1] Implement text-cell truncation (research.md Decision 5): for columns without
  a `render` function, wrap the resolved text in a `truncate` utility plus a `title` attribute
  carrying the full string value; columns with `render` are left untouched (FR-018).
- [X] T009 [US1] Create `src/index.ts` barrel export additions: `Table` and its types
  (`TableProps`, `TableColumn`, `NonSelectableTableProps`, `SelectableTableProps`), alongside
  the existing `Button`/`Field`/`Input`/`Card` exports (contracts/table-api.md).
- [X] T010 [US1] Add a Table section to `playground/main.tsx`: a mixed text/numeric-column
  table with several rows (zebra striping visible), a long-text cell demonstrating truncation,
  and an `rows={[]}` example showing the empty state.
- [X] T011 [P] [US1] Write `src/components/table/table.test.tsx`: header and row rendering
  resolve only `tokens.css`/typography-system.md-traceable classes (no inline styles, no
  hex/oklch literals); zebra striping alternates on the correct rows; numeric columns
  right-align with `numeric-tabular`; empty `rows` renders the `colSpan`-ed empty-state row;
  a long text cell truncates with a `title` attribute, a `render`-based cell does not (FR-001,
  FR-002, FR-003, FR-004, FR-018, FR-021, SC-002).

**Checkpoint**: `yarn typecheck && yarn test && yarn lint` pass; `yarn dev` shows a correctly
styled, zebra-striped, empty-state-capable table — User Story 1 is independently demoable.

---

## Phase 4: User Story 2 - A user sorts a column to reorder the records they are viewing (Priority: P2)

**Goal**: Sortable columns expose an interactive header that cycles sort direction on
activation, shows a visible indicator via `aria-sort`, and only one column is active at a
time (research.md Decision 2); non-sortable columns expose no sort affordance.

**Independent Test**: Render a Table with sortable and non-sortable columns in the
playground, click/keyboard-activate sortable headers, confirm row reordering and indicator
placement; assert the same in `table.test.tsx`.

### Implementation for User Story 2

- [X] T012 [US2] Implement internal sort state in `table.tsx` (research.md Decision 2): a
  `useState<SortState>(null)` holding `{ columnKey, direction } | null`; a `getSortedRows()`
  helper that returns `rows` unchanged when `sortState` is `null`, else sorted by the active
  column's `accessor` value and `direction`.
- [X] T013 [US2] Implement the sortable header control: for `sortable: true` columns, render
  the header label inside a `<button type="button">` (focusable, Enter/Space-activatable by
  default as a native button) instead of plain text; activating it cycles
  `none → ascending → descending → ascending` for that column and clears any other column's
  sort state (FR-006, FR-007).
- [X] T014 [US2] Implement the sort-direction indicator: set `aria-sort="ascending"` /
  `"descending"` on the active column's `<th>` (none on inactive columns) plus a visible
  ascending/descending glyph next to the header label, removed when a different column
  becomes active (FR-008, research.md Decision 2).
- [X] T015 [US2] Ensure non-sortable columns render a plain `<th>` (no button, no hover/focus
  styling, no `aria-sort`) so they are not mistaken for sortable (FR-009).
- [X] T016 [US2] Add sortable-column examples to `playground/main.tsx`: a table with one
  sortable text column and one sortable numeric column alongside a non-sortable column,
  demonstrating direction toggling and indicator movement.
- [X] T017 [P] [US2] Extend `table.test.tsx`: activating a sortable header reorders rows
  ascending, activating again reverses to descending, activating a different sortable column
  moves `aria-sort` to it and clears the first; a non-sortable header has no button role and
  no `aria-sort`; keyboard activation (Enter/Space via `@testing-library/user-event`) produces
  the same result as a pointer click (FR-006, FR-007, FR-008, FR-009).

**Checkpoint**: User Stories 1 AND 2 both independently functional — sortable Tables reorder
correctly with a visible, accessible indicator.

---

## Phase 5: User Story 3 - A user selects one or more rows to act on them in bulk (Priority: P2)

**Goal**: `selectable` Tables add a checkbox per row and a header select-all control;
selection is fully consumer-controlled via `selectedIds`/`onSelectionChange` (research.md
Decision 3); select-all derives checked/unchecked/indeterminate from currently visible rows;
selection toggles only via the checkbox (Clarifications), never by clicking elsewhere in the
row.

**Independent Test**: Render a `selectable` Table in the playground, check individual rows
and select-all via pointer and keyboard, confirm the derived select-all state and that a
nested row-level link remains independently clickable; assert the same in `table.test.tsx`.

### Implementation for User Story 3

- [X] T018 [US3] Implement the row-selection checkbox column in `table.tsx`: when
  `selectable: true`, render a leading `<th>`/`<td>` per header/row containing a native
  `<input type="checkbox">`, styled with the `ring` token focus treatment matching
  Button/Field/Card's existing convention; checking/unchecking calls `onSelectionChange` with
  `selectedIds` plus/minus that row's `id` — no other element in the row calls
  `onSelectionChange` (FR-010, FR-011, FR-014, Clarifications).
- [X] T019 [US3] Implement the header select-all checkbox (research.md Decision 4): derive
  checked/unchecked/indeterminate from `selectedIds` against the currently visible rows
  (data-model.md SelectionState derivation table); set the DOM `indeterminate` property via a
  `ref` + `useEffect` (no JSX `indeterminate` prop exists); activating it calls
  `onSelectionChange` with either every visible row's `id` added or all removed (FR-012).
- [X] T020 [US3] Implement selected-row visual distinction: a selected row's checkbox state
  itself is the primary distinguishing signal (already more than color alone); add a subtle
  `bg-muted-surface`/`border` shift on the selected row distinct from the zebra-stripe
  treatment so a selected striped row remains visually identifiable (FR-013).
- [X] T021 [US3] Verify nested-interactive-element non-interference: confirm a row-level link
  or button rendered via a column's `render` function remains independently clickable and
  that no click outside the row's own checkbox ever calls `onSelectionChange` (FR-020,
  Clarifications — trivially satisfied by T018's checkbox-only wiring, this task is a
  verification pass, not new logic).
- [X] T022 [US3] Add `selectable` Table examples to `playground/main.tsx`: a table with row
  selection enabled, a local `useState<Set<string>>` wiring `selectedIds`/
  `onSelectionChange`, a visible selected-count readout, and one row containing a nested link
  to demonstrate non-interference.
- [X] T023 [P] [US3] Extend `table.test.tsx`: checking/unchecking an individual row's
  checkbox calls `onSelectionChange` with the correct next set; the header checkbox's
  `checked`/`indeterminate` DOM properties match none/some/all-selected respectively;
  activating select-all selects/deselects every visible row; clicking a nested link inside a
  selectable row's cell does not call `onSelectionChange`; `selectable` unset renders no
  checkbox column (FR-010, FR-011, FR-012, FR-013, FR-020, User Story 3 Acceptance Scenario
  4).

**Checkpoint**: User Stories 1, 2, AND 3 all independently functional — sortable, selectable
Tables are fully wired.

---

## Phase 6: User Story 4 - A user operating only a keyboard or screen reader can read and act on the table (Priority: P2)

**Goal**: Every interactive element (sortable headers, row checkboxes, select-all) is
keyboard-operable with a visible focus indicator; cell-to-header association, sort state, and
selection state are all correctly exposed to assistive technology.

**Independent Test**: Tab through a sortable, selectable Table with a screen reader (or the
accessibility tree inspector) and confirm cell/header association, sort announcement, and
selection announcement, all without additional consumer markup.

### Implementation for User Story 4

- [X] T024 [US4] Verify native cell/header association: confirm `<th scope="col">` is set on
  every column header (including the select-all header cell) so assistive technology
  associates each `<td>` with its column header using native table semantics — a verification
  + attribute-completion task, not new structural logic (T004/T018 already render the cells)
  (FR-015).
- [X] T025 [US4] Verify sort-state and selection-state announcement: confirm `aria-sort`
  (T014) is read correctly by assistive technology when focus lands on the active sortable
  header, and that each row's checkbox `checked` state (T018) is itself the native,
  correctly-announced selection signal — no additional `aria-selected` on the `<tr>` is added,
  since the checkbox already carries correct native semantics (FR-016, FR-017).
- [X] T026 [US4] Confirm keyboard reachability and the `ring` focus indicator (already wired
  in T013/T018/T019) covers every interactive element in document order: sortable header
  buttons, then each row's checkbox, then (when present) the select-all checkbox precedes the
  per-row ones in tab order via DOM placement in `<thead>` (FR-014).
- [X] T027 [P] [US4] Extend `table.test.tsx`: every `<td>` is programmatically associated with
  its column header (Testing Library's accessible-table queries); the active sortable
  header's `aria-sort` value is queryable; a checked row checkbox's accessible state is
  queryable; every interactive element is reachable via repeated `Tab` and activatable via
  `Enter`/`Space` (`@testing-library/user-event`) (FR-014, FR-015, FR-016, FR-017, SC-003,
  SC-004).

**Checkpoint**: All four user stories independently functional — Table component is
feature-complete per spec.md.

---

## Phase 7: Polish & Cross-Cutting Concerns

- [X] T028 [US1] Implement the `loading` state (research.md Decision 6): when `loading:
  true`, render 5 skeleton `<tr>`s in `<tbody>` (each `<td>` a pulsing `bg-muted-surface`
  block at the column's normal cell height) in place of data rows or the empty-state row;
  `<thead>` stays rendered and visible (FR-005). Placed in Polish since it composes with, but
  doesn't block, US1-US4's row/sort/selection logic.
- [X] T029 [P] Write `src/components/table/README.md` per the documentation pattern
  established by `button/README.md`, `field/README.md`, and `card/README.md`: where the
  component lives, the column/row/sort/selection → `tokens.css` role mapping table
  (data-model.md), the typography-role mapping table, the `TableColumn` field reference, and
  the checkbox-only-selection / truncation-only-for-non-`render`-cells guidance (research.md
  Decisions 3, 5).
- [X] T030 Run quickstart.md's full manual playground checklist (rest rendering, empty state,
  sorting, selection + select-all, screen-reader pass, truncation, horizontal scroll, loading,
  nested interactive element) in a real browser and confirm every item passes.
- [X] T031 Run `yarn build` and confirm the library bundle exports `Table` from
  `src/index.ts` with no build errors, alongside the existing `Button`/`Field`/`Input`/`Card`
  exports (contracts/table-api.md).

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion — blocks all user stories.
- **User Stories (Phase 3-6)**: All depend on Foundational completion.
  - US1 has no dependency on US2/US3/US4.
  - US2 depends on US1's row rendering existing (T005) but not on US3/US4.
  - US3 depends on US1's row rendering existing (T005) but not on US2/US4.
  - US4 depends on US2's sort indicator (T014) and US3's checkbox wiring (T018) existing — it
    verifies and completes their accessibility wiring rather than reimplementing state logic.
  - US1-US4 all touch the same single file (`table.tsx`) — sequence them rather than run truly
    in parallel to avoid merge conflicts, same rationale as Button/Field/Card.
- **Polish (Phase 7)**: `loading` (T028) depends on US1's row-area structure (T005, T007)
  existing; README/quickstart/build (T029-T031) depend on US1-US4 all being complete.

### Within Each User Story

- Type/styling logic before composition wiring before playground wiring before tests.
- Each story's checkpoint must pass before starting the next story.

### Parallel Opportunities

- Each story's test task (T011, T017, T023, T027) is marked `[P]` relative to that story's
  playground/implementation tasks — it edits `table.test.tsx`, a different file.
- T009 (barrel export) and T029 (README) are marked `[P]`/independent-file tasks relative to
  `table.tsx` edits in their respective phases.

---

## Parallel Example: User Story 1

```bash
# Once T003-T010 land, run alongside final US1 implementation polish:
Task: "Write table.test.tsx covering header/row/zebra/empty-state/truncation behavioral guarantees"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: `yarn typecheck && yarn test && yarn lint`, then visually confirm
   header/row rendering, zebra striping, and the empty state in the playground
5. At this point a correctly styled, static (non-sortable, non-selectable) Table exists and
   is demoable, even before sorting, selection, or the deeper accessibility wiring lands

### Incremental Delivery

1. Setup + Foundational → skeleton ready
2. User Story 1 → static table, zebra striping, empty state, truncation demoable (MVP)
3. User Story 2 → sortable columns layered on top, independently verified
4. User Story 3 → selectable rows + select-all layered on top, independently verified
5. User Story 4 → cell/header association, sort/selection announcement verified and completed
6. Polish → `loading` state + documentation + final quickstart validation + build check

---

## Notes

- `[P]` tasks touch different files with no dependency on an incomplete task — most tasks in
  US1-US4 are sequential because they share `table.tsx`, expected for a single-file
  component, not a sign of missing decomposition (plan.md Structure Decision).
- `[Story]` label maps each task to spec.md's user stories for traceability.
- Stop at each checkpoint to validate that story independently before continuing.
- Migrating `gridu-web`'s existing table-like surfaces is a guardrail (spec Assumptions), not
  a task — no task in this list touches that repo.
- Typography role mapping (data-model.md): column header → `label` + `text-muted-foreground`
  (T004); text cell → `body-default` (T005); numeric cell → `numeric-tabular` (T005);
  empty-state message → `caption` + `text-muted-foreground` (T007).
- Selection is checkbox-only by design (Clarifications) — T018/T021/T023 verify no other row
  region ever calls `onSelectionChange`, not a partial implementation awaiting a future
  full-row-click mode.
