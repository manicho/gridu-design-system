# Feature Specification: Table Component

**Feature Branch**: `10-table-component`

**Created**: 2026-06-30

**Status**: Draft

## Clarifications

### Session 2026-06-30

- Q: Should data rows use alternating background striping (zebra rows) by default, or
  border-only dividers like Card's depth treatment? → A: Zebra striping by default —
  alternating rows use the `muted-surface` token as background, distinct from Card's
  elevation/shadow question (Feature 09); improves scannability for the dense, many-row use
  cases named in the epic tracker (transaction history, client lists).
- Q: When row selection is enabled, does clicking anywhere in the row toggle selection, or
  only the checkbox itself? → A: Checkbox-only — only the row's checkbox toggles selection;
  the rest of the row never intercepts clicks, which also avoids any conflict with nested
  interactive elements (FR-020).

**Input**: User description: "Table Component — Feature 10 of the Product Identity Refresh
epic, Phase 1 (Components) in gridu-design-system. Define a styled, accessible data table
component for tabular data (e.g. business/client lists, transaction history, appointment
lists) built on the design tokens and principles established in Features 04-09, consistent
with the Button, Input, and Card components delivered in Features 07-09."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - A consumer surface renders a set of records as rows and columns at rest (Priority: P1)

A developer building a dashboard screen in `gridu-web` (e.g. a client list, a transaction
history, a list of upcoming appointments) needs to render a labeled, scannable grid of
records using the design system's documented surface, border, and typography roles, without
inventing new column-header styling, row-divider widths, or cell spacing.

**Why this priority**: Every list-of-records surface in the product depends on this; it is
the fourth concrete component pattern after Button, Input, and Card, and the first one to
establish the dense, multi-column data layout that Navigation and Chart (Features 11-12) will
partially reuse for legend and axis labeling.

**Independent Test**: Can be fully tested by rendering a table with a header row and several
data rows side by side with other tables and confirming every color resolves to
`color-system.md`'s documented roles (`background` for the surface, `border` for row/column
dividers, `muted-surface` for the header or for alternating rows) with no ad-hoc values, and
that header and cell text resolve to documented Typography System roles (`label` for headers,
`body-default`/`body-secondary` for cells, `numeric-tabular` for numeric columns).

**Acceptance Scenarios**:

1. **Given** a table with a header row and one or more data rows, **When** it is rendered at
   rest, **Then** the header row is visually distinct from data rows using a documented role
   (`muted-surface` background and/or a `border` divider beneath it), and column headers use
   the `label` typography role.
2. **Given** a data row containing a mix of text and numeric columns, **When** it is
   rendered, **Then** text columns use `body-default` or `body-secondary` and numeric columns
   use the `numeric-tabular` role so figures align on their decimal/digit positions across
   rows.
3. **Given** two adjacent data rows, **When** they are rendered, **Then** they are visually
   separated by alternating row background (`muted-surface` on every other row, zebra
   striping) and a `border` token divider — no new color value is introduced for this
   purpose.
4. **Given** a table with no rows to display, **When** it is rendered, **Then** it shows a
   single empty-state message in place of the row area, using documented typography and
   surface roles, rather than an empty header with no content beneath it.

---

### User Story 2 - A user sorts a column to reorder the records they are viewing (Priority: P2)

A user viewing a client list or transaction history needs to reorder the visible rows by a
given column (e.g. sort transactions by date or amount) by interacting with that column's
header, and needs a clear, persistent indicator of which column is currently driving the sort
and in which direction.

**Why this priority**: Ranked P2 rather than P1 because a table is fully usable and
independently valuable as a static, pre-sorted grid (User Story 1) without this — sorting is
an enhancement layer that not every consumer table needs (e.g. a fixed-order appointment
timeline), but is common enough across the named use cases (client lists, transaction
history) to specify now rather than retrofit per consumer.

**Independent Test**: Can be fully tested by rendering a sortable table, activating a column
header via pointer or keyboard, and confirming the row order changes, a sort-direction
indicator appears on that header, and the indicator is removable/transferable when a
different column is activated.

**Acceptance Scenarios**:

1. **Given** a table with one or more sortable columns, **When** a user activates a sortable
   column header, **Then** the rows reorder by that column and a visible ascending/descending
   indicator appears on that header.
2. **Given** a column already driving the sort, **When** its header is activated again,
   **Then** the sort direction reverses and the indicator updates accordingly.
3. **Given** a column actively driving the sort, **When** a different sortable column's
   header is activated, **Then** the sort moves to the newly activated column and the
   previous column's indicator is removed.
4. **Given** a non-sortable column, **When** it is rendered, **Then** its header exposes no
   sort affordance (no hover/focus indication of interactivity) so users do not mistake it
   for sortable.

---

### User Story 3 - A user selects one or more rows to act on them in bulk (Priority: P2)

A user viewing a list of records they manage directly (e.g. clients, upcoming appointments)
needs to select one or more rows via a checkbox in each row, and select or clear all visible
rows at once, so a consumer surface can read the current selection (including how many rows
are selected) and offer a bulk action (e.g. "message selected clients", "cancel selected
appointments") without building its own selection bookkeeping. Any visible selection count is
rendered by the consumer from the exposed selection state — the table itself is the selection
mechanism, not the bulk-action UI around it.

**Why this priority**: Ranked P2 — the same reasoning as sorting (User Story 2): a table is
independently valuable without selection (e.g. a read-only transaction history), but
selection is named explicitly by the "Scale To One, Not A Thousand" principle's target user
(the owner who runs the whole show and needs to act on several of their own records at once,
not an organization-wide bulk-admin tool).

**Independent Test**: Can be fully tested by rendering a table with row selection enabled,
selecting individual rows and the select-all control via pointer and keyboard, and confirming
the selection count and the select-all control's own state (all/none/indeterminate) update
correctly.

**Acceptance Scenarios**:

1. **Given** a table with row selection enabled, **When** a user checks an individual row's
   checkbox, **Then** that row is marked selected and is visually distinguishable from
   unselected rows by more than color alone (e.g. the checkbox state itself).
2. **Given** a table with row selection enabled and some but not all rows selected, **When**
   the header's select-all control is rendered, **Then** it shows an indeterminate state
   distinct from fully-checked or fully-unchecked.
3. **Given** a table with row selection enabled, **When** a user activates the header's
   select-all control, **Then** every currently visible row becomes selected (or, if already
   all selected, becomes unselected).
4. **Given** a table without row selection enabled, **When** it is rendered, **Then** no
   checkbox column is present and rows expose no selection affordance.

---

### User Story 4 - A user operating only a keyboard or screen reader can read and act on the table (Priority: P2)

A user navigating by keyboard or via a screen reader needs the table's structure (headers,
rows, cells), sort state, and selection state to be announced correctly, and needs every
interactive element in the table (sortable headers, row checkboxes, select-all) to be
operable without a pointer.

**Why this priority**: Identical accessibility bar already set for Button, Input, and Card;
ranked P2 rather than P1 because it depends on User Stories 2 and 3 (sorting and selection)
existing first — a purely static table (User Story 1) carries native table semantics with no
additional interaction state to announce.

**Independent Test**: Can be fully tested by navigating a sortable, selectable table via
keyboard only and confirming a screen reader announces column headers in relation to their
cells, the current sort column and direction, and each row's selected state, with every
sort/select action reachable via Tab and activatable via Enter/Space.

**Acceptance Scenarios**:

1. **Given** any table, **When** a screen reader reaches it, **Then** it announces the table's
   structure such that each cell's value is associated with its column header.
2. **Given** a sortable column currently driving the sort, **When** a screen reader reaches
   its header, **Then** the current sort direction is announced.
3. **Given** a table with row selection, **When** a screen reader reaches a row, **Then** its
   selected state is announced.
4. **Given** any interactive element in the table (sortable header, row checkbox,
   select-all), **When** a user tabs to it, **Then** a visible keyboard focus indicator (the
   `ring` token) appears, and it is activatable via Enter or Space.

---

### Edge Cases

- What happens when a cell's content is too long for its column (e.g. a long business name)?
  Text truncates with an ellipsis and the full value is available via a native tooltip
  (`title` attribute or equivalent), rather than wrapping and disrupting row height
  consistency — consistent with Card's fixed-height truncation rule (Feature 09).
- What happens when the table has more columns than fit the consumer's viewport (e.g. on a
  narrow screen)? The table scrolls horizontally within its own bounded region while the
  page layout around it stays fixed, per the Clarifications session below.
- What happens when data is loading? The header renders immediately and the row area shows a
  loading placeholder (skeleton rows) rather than an empty table or a spinner replacing the
  whole component, so the table's structure stays visually stable as data arrives.
- What happens when a sortable column's data is still loading or a sort action is pending? The
  previously rendered row order is preserved (no flash to empty) until the new order is ready.
- What happens when a row is both selectable and contains its own nested interactive element
  (e.g. a row-level "view" link)? Selection is checkbox-only (per the Clarifications session),
  so the nested element's own action and the row's selection toggle never compete for the
  same click — clicking the nested element always performs its own action, and clicking
  elsewhere in the row does nothing.
- How does the component behave inside a dark-mode surface? All color references resolve
  through the same token roles (`background`/`muted-surface`, `border`, `ring`), which already
  define both light and dark values per color-system.md — no separate dark-mode logic is
  needed in the component itself.
- What happens when the table has zero columns or zero defined headers? This is treated as a
  misconfiguration by the consumer, not a state the component needs to render gracefully —
  out of scope per the Assumptions below.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a Table component rendering a header row of column labels
  and zero or more data rows beneath it.
- **FR-002**: System MUST render the table's header background, row dividers, and alternating
  data-row background (zebra striping — fixed, with no opt-out, per the "Default Over
  Configure" principle) using documented `color-system.md` roles (`background`,
  `muted-surface`, `border`) — no new color values may be introduced by this component.
- **FR-003**: System MUST resolve all text usage to roles documented in
  `typography-system.md`: `label` for column headers, `body-default` or `body-secondary` for
  text cells, and `numeric-tabular` for numeric cells — no new font sizes or weights may be
  introduced by this component.
- **FR-004**: System MUST display a documented empty-state message in place of the row area
  when there are zero rows to display, rather than rendering an empty row area beneath a
  populated header.
- **FR-005**: System MUST display a loading placeholder (skeleton rows) in the row area while
  data is loading, keeping the header visible and the table's overall structure stable.
- **FR-006**: System MUST support designating individual columns as sortable, independent of
  one another.
- **FR-007**: System MUST, for a sortable column, expose an interactive header that on
  activation (pointer or keyboard) sets that column as the active sort column and toggles its
  direction (ascending/descending) on repeated activation.
- **FR-008**: System MUST visually indicate the active sort column and its current direction
  on that column's header, and remove the indicator from a column when a different column
  becomes the active sort column.
- **FR-009**: System MUST NOT expose a hover, focus, or sort-direction affordance on a
  non-sortable column's header.
- **FR-010**: System MUST support an optional row-selection mode that adds a checkbox to each
  row and a select-all control to the header.
- **FR-011**: System MUST allow a user to toggle an individual row's selection, independent of
  other rows, exclusively via that row's checkbox — no other region of the row toggles
  selection, when row selection is enabled.
- **FR-012**: System MUST provide a select-all control in the header that selects or
  deselects every currently visible row, and reflects a checked, unchecked, or indeterminate
  state matching the current selection across visible rows.
- **FR-013**: System MUST distinguish a selected row from an unselected one by more than
  color alone.
- **FR-014**: System MUST expose a visible keyboard focus indicator on every interactive
  element within the table (sortable headers, row checkboxes, select-all control) using the
  `ring` token, consistent with the focus treatment defined for Button (Feature 07), Input
  (Feature 08), and Card (Feature 09).
- **FR-015**: System MUST associate each data cell with its column header in a way that
  assistive technology can announce them together.
- **FR-016**: System MUST announce the active sort column and its direction to assistive
  technology when sorting is in use.
- **FR-017**: System MUST announce a row's selected state to assistive technology when row
  selection is in use.
- **FR-018**: System MUST truncate overflowing cell text with an ellipsis and expose the full
  value via a native tooltip mechanism, rather than wrapping text and varying row height.
- **FR-019**: System MUST allow the table to scroll horizontally within its own bounded
  region when its columns exceed the available width, without requiring the consuming page
  layout to resize or reflow.
- **FR-020**: System MUST NOT allow any region of a selectable row other than its checkbox to
  trigger selection, so a nested interactive element (e.g. a row-level link or button)
  anywhere else in the row is never intercepted or duplicated by a selection toggle.
- **FR-021**: System MUST size cell padding, row height, and divider weight using the
  spacing and sizing scale established in `06-define-design-tokens` (no ad-hoc pixel values).

### Key Entities

- **Table**: A structured grid of a header row (column labels) and zero or more data rows.
  Configured independently for sortability (per column) and row selection (table-wide); both
  are optional layers on the same base structure.
- **Column**: A single field definition within the table — a header label, a typography role
  for its cells (text or numeric), and an independent sortable flag.
- **Row**: A single record's data across all columns. Carries an independent selected state
  when row selection is enabled.
- **Sort state**: Which column (if any) is currently driving row order, and its direction
  (ascending/descending). At most one column is active at a time.
- **Selection state**: The set of currently selected rows, and the header select-all control's
  derived state (none/some/all selected) when row selection is enabled.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A developer can render a fully composed table — header, rows, optional sorting,
  optional row selection — using only this component's public API, with zero additional
  ad-hoc CSS.
- **SC-002**: 100% of the component's color usage traces to a documented `color-system.md`
  role, verifiable by inspection with no ad-hoc values present.
- **SC-003**: 100% of the table's interactive elements (sortable headers, row checkboxes,
  select-all) are operable via keyboard alone, with no mouse-only interactions.
- **SC-004**: Screen reader users can determine each cell's associated column header, the
  active sort column and direction (when present), and each row's selected state (when
  present), verified by manual screen-reader pass.
- **SC-005**: A table with more columns than fit the viewport remains fully readable via
  horizontal scroll without breaking the surrounding page layout, verified at the narrowest
  supported viewport width.

## Assumptions

- Per the "Scale To One, Not A Thousand" principle, this component does not include built-in
  pagination, infinite scroll, or virtualization — a single operator's own record sets
  (clients, appointments, transactions) are assumed small enough to render in full, and the
  consumer is responsible for any slicing of a larger dataset before passing rows to the
  table. Revisit only if a real dataset size demonstrates otherwise.
- Multi-column sort (sorting by more than one column at once) is out of scope; only a single
  active sort column is supported, consistent with the same single-operator scale assumption.
- Column resizing and column reordering (drag-to-reorder) are out of scope for this feature;
  column definitions and order are fixed by the consumer at render time.
- Inline cell editing is out of scope; the table is a display and selection surface only, not
  a data-entry grid.
- Bulk actions themselves (e.g. the toolbar/menu triggered by a non-zero selection) are the
  consumer's responsibility to build using the selection state this component exposes; this
  feature only specifies the selection mechanism, not the actions available once rows are
  selected.
- The component is built for and tested against the light/dark token pairs already defined in
  color-system.md; no additional theming modes are in scope.
- Migrating gridu-web's existing table-like surfaces onto this component is out of scope for
  this feature, consistent with the same exclusion made for Button (Feature 07), Input
  (Feature 08), and Card (Feature 09).
