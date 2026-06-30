# Quickstart: Validating the Table Component

Prerequisites: same Node/`yarn` setup used for Features 07-09 — no new tooling is introduced
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

Opens the Vite playground (`playground/index.html`), extended with a Table section alongside
the existing Button, Field, and Card grids. Use this to manually verify, in a real browser,
before calling the feature done:

- [ ] **SC-001 / User Story 1**: Render a Table with a header row and several data rows —
  header uses `muted-surface`/`label`, rows use `background`/`body-default`, numeric columns
  use `numeric-tabular` and align on their digits, zebra striping alternates via
  `muted-surface` (Clarifications).
- [ ] **User Story 1 Acceptance Scenario 4**: Render a Table with `rows={[]}` — confirm an
  empty-state message renders in place of the row area, not an empty area beneath a populated
  header.
- [ ] **User Story 2 / FR-007, FR-008**: Render a Table with a `sortable` column, click its
  header — confirm rows reorder, a direction indicator appears, click again to reverse
  direction, then activate a different sortable column and confirm the indicator moves.
- [ ] **User Story 2 Acceptance Scenario 4**: Render a Table with both sortable and
  non-sortable columns — confirm the non-sortable header shows no hover/focus sort affordance.
- [ ] **User Story 3 / FR-010-FR-012**: Render a `selectable` Table, check individual rows,
  confirm the header select-all reflects checked/unchecked/indeterminate correctly, and
  confirm activating select-all selects/deselects every visible row.
- [ ] **User Story 3 Acceptance Scenario 4**: Render a Table with `selectable` unset/false —
  confirm no checkbox column appears.
- [ ] **User Story 4 / SC-004**: With a screen reader, tab through a sortable, selectable
  Table and confirm each cell announces its column header, the active sort column/direction
  is announced, and each row's selected state is announced.
- [ ] **Edge Cases — truncation (FR-018)**: Render a Table with a deliberately long text cell
  value and a narrow column — confirm it truncates with an ellipsis and the full value appears
  in a native tooltip on hover.
- [ ] **Edge Cases — horizontal scroll (FR-019)**: Render a Table with more columns than fit a
  narrow viewport — confirm the table itself scrolls horizontally while the surrounding page
  layout stays fixed.
- [ ] **Edge Cases — loading (FR-005)**: Render a Table with `loading` — confirm the header
  stays visible and skeleton rows render in place of data rows.
- [ ] **Edge Cases — nested interactive element**: Render a `selectable` Table with a
  row-level link/button in a cell — confirm clicking it performs its own action and does not
  toggle that row's selection, and confirm clicking elsewhere in the row does nothing
  (checkbox-only selection, per Clarifications).

## Run automated checks

```sh
yarn typecheck   # tsc -b --noEmit
yarn test        # vitest run — table.test.tsx behavioral assertions (see contracts/table-api.md)
yarn lint        # eslint .
```

All three MUST pass before this feature is considered implemented, per this project's
standard "done" bar.

## Expected outcome

- `yarn build` produces a library bundle from `src/index.ts` additionally exporting `Table`
  alongside the existing `Button`, `Field`/`Input`, and `Card` exports.
- No file outside `gridu-design-system` changes as a result of this feature (migrating
  `gridu-web`'s existing table-like surfaces stays out of scope, per spec Assumptions).
