# Tasks: Navigation Component

**Input**: Design documents from `specs/11-navigation-component/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/navigation-api.md,
quickstart.md

**Tests**: plan.md and contracts/navigation-api.md commit to `navigation.test.tsx` covering
the contract's behavioral guarantees — these are included as part of each story's
implementation, not a separate TDD-first gate (spec.md does not request strict TDD).

**Organization**: Like Card and Table (Features 09-10), Navigation ships as a single
`navigation.tsx` file (plan.md Structure Decision — each destination is an inline polymorphic
`<a>`/`<button>`, not a standalone subcomponent). Almost every task therefore edits
`navigation.tsx`, so most tasks are sequential by necessity (same-file edits), matching
Button/Field/Card/Table's single-file-per-story precedent — `[P]` is reserved for tasks that
touch genuinely independent files (`navigation.test.tsx`, `playground/main.tsx`,
`src/index.ts`).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Different files, no dependency on an incomplete task
- **[Story]**: Which user story this task serves (US1, US2, US3)
- All paths are relative to `gridu-design-system/` (repo root)

---

## Phase 1: Setup

**Purpose**: Confirm the existing Feature 07-10 tooling (no new config) is a valid baseline
before adding new component files.

- [X] T001 Run `yarn typecheck`, `yarn test`, `yarn lint` against the current tree (Button +
  Field + Card + Table only) and confirm all three pass — verification gate before any
  Navigation file is added, so a pre-existing failure isn't mistaken for one introduced by
  this feature.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared types and skeleton file every user story builds on.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T002 Create `src/components/navigation/navigation.tsx` skeleton: `NavigationLayout`,
  `CommonNavItemProps`/`AnchorNavItemProps`/`ButtonNavItemProps`/`NavItemProps` discriminated
  union, `NavigationProps` (data-model.md), a bare `Navigation` function rendering an
  unstyled `<nav aria-label={label}>` with one plain `<a>`/`<button>` per `destinations`
  entry, no active/disabled/layout/truncation styling yet.

**Checkpoint**: Foundation ready — User Story 1 implementation can begin.

---

## Phase 3: User Story 1 - A dashboard owner orients themselves via a persistent sidebar (Priority: P1) 🎯 MVP

**Goal**: Render a vertical destination list using documented surface/border/typography
roles, with the active destination visually distinguished by more than color alone and
exposed as a navigation landmark with the active destination announced as the current page.

**Independent Test**: Render a Navigation with several destinations and one marked active in
the playground; assert in `navigation.test.tsx` that every region's resolved classNames trace
to documented roles, the active destination carries `aria-current="page"` plus a non-color
indicator, and the root is a `<nav>` landmark with the supplied `aria-label`.

### Implementation for User Story 1

- [X] T003 [US1] Implement base vertical layout styling in `navigation.tsx`: `<nav>` surface
  `bg-background`, destinations stacked in a `flex flex-col` with spacing from the scale
  established in `06-define-design-tokens` (no ad-hoc pixel values) (FR-002, FR-009).
- [X] T004 [US1] Implement destination rendering: one polymorphic `<a>`/`<button>` per
  `destinations` entry per the `as` discriminated union (`as="a"` requires `href`, `as="button"`
  requires `onClick`), label rendered with the `label` typography role, optional `leadingIcon`
  rendered before the label (FR-001, FR-008, data-model.md Typography role mapping).
- [X] T005 [US1] Implement rest/hover/pressed states: `hover:bg-muted-surface`/
  `active:bg-muted-surface/80` on each destination, matching Button's `ghost` variant and
  Card's interactive hover convention (FR-005, FR-007).
- [X] T006 [US1] Implement the keyboard focus indicator: `focus-visible:ring-2
  focus-visible:ring-ring focus-visible:ring-offset-2`, the same convention as Button/Input/
  Card/Table (FR-006).
- [X] T007 [US1] Implement the active destination's visual treatment (research.md Decision
  2): when `active: true`, apply `aria-current="page"`, a `border-l-2 border-foreground`
  (left accent, vertical layout) plus a `text-foreground` color shift — never color alone
  (FR-003, FR-004).
- [X] T008 [US1] Create `src/index.ts` barrel export additions: `Navigation` and its types
  (`NavigationProps`, `NavigationLayout`, `NavItemProps`, `AnchorNavItemProps`,
  `ButtonNavItemProps`), alongside the existing `Button`/`Field`/`Input`/`Card`/`Table`
  exports (contracts/navigation-api.md).
- [X] T009 [US1] Add a Navigation section to `playground/main.tsx`: a vertical sidebar example
  with several destinations, one marked active, demonstrating rest/hover/focus/active states.
- [X] T010 [P] [US1] Write `src/components/navigation/navigation.test.tsx`: destination
  rendering resolves only `tokens.css`/typography-system.md-traceable classes (no inline
  styles, no hex/oklch literals); exactly the destination with `active: true` renders
  `aria-current="page"` and no others do; rendering a non-empty `destinations` list with no
  entry's `active: true` set renders `aria-current` on none of them (no first-item default —
  FR-004 negative path, `/speckit-analyze` finding C1); the root renders as `<nav>` with the
  supplied `aria-label`; focus-visible ring applies only on keyboard focus; a focused
  `as="button"` destination calls `onClick` on `{Enter}` keyboard activation, matching pointer
  click (SC-003 keyboard-activation coverage, `/speckit-analyze` finding C2) (FR-001, FR-003,
  FR-004, FR-006, FR-007, FR-008, FR-010, SC-002, SC-003).

**Checkpoint**: `yarn typecheck && yarn test && yarn lint` pass; `yarn dev` shows a correctly
styled vertical Navigation with a visually and semantically distinguished active destination
— User Story 1 is independently demoable.

---

## Phase 4: User Story 2 - A destination is temporarily unavailable to the current account (Priority: P2)

**Goal**: A `disabled` destination remains visible but is unreachable via Tab, does not
respond to click/Enter, and is announced as disabled/unavailable to assistive technology
(research.md Decision 3).

**Independent Test**: Render a Navigation with one disabled destination in the playground;
confirm Tab skips it and clicking/Enter has no effect; assert the same plus the
`aria-disabled` announcement in `navigation.test.tsx`.

### Implementation for User Story 2

- [X] T011 [US2] Implement the disabled destination treatment in `navigation.tsx`
  (research.md Decision 3): when `disabled: true`, apply `aria-disabled="true"`,
  `tabIndex={-1}`, `pointer-events-none`, and `opacity-50` (the same `disabled:opacity-50`
  convention Button and Card already use) — applied identically regardless of `as` (FR-011).
- [X] T012 [US2] Verify click/keyboard suppression: confirm a disabled `as="a"` destination's
  `href` does not navigate on click and a disabled `as="button"` destination's `onClick` is
  never called, in both cases via pointer click and keyboard Enter — a verification +
  attribute-completion task on top of T011's `pointer-events-none`/`tabIndex={-1}`, not new
  structural logic (FR-011).
- [X] T013 [US2] Add a disabled-destination example to `playground/main.tsx`: a vertical
  Navigation with one plan-gated destination marked `disabled`, remaining visible alongside
  the enabled ones.
- [X] T014 [P] [US2] Extend `navigation.test.tsx`: Tab through a Navigation containing a
  disabled destination and confirm focus skips it; confirm clicking it (pointer and
  Enter-while-focused-via-direct-focus()) does not call `onClick`/navigate; confirm it renders
  `aria-disabled="true"` (FR-011, User Story 2 Acceptance Scenarios 1-2).

**Checkpoint**: User Stories 1 AND 2 both independently functional — disabled destinations
remain visible but fully unreachable.

---

## Phase 5: User Story 3 - The same navigation renders as a horizontal bar (Priority: P3)

**Goal**: `layout="horizontal"` renders the same destination list with identical active/
hover/focus/disabled behavior to the vertical layout, differing only in flex axis and which
edge carries the active accent (research.md Decision 2).

**Independent Test**: Render the same destination list with `layout="horizontal"` in the
playground; confirm active/hover/focus/disabled states behave identically to vertical;
assert the same in `navigation.test.tsx`.

### Implementation for User Story 3

- [X] T015 [US3] Implement the horizontal layout axis in `navigation.tsx`: `layout:
  "horizontal"` switches the container to `flex flex-row` (from `flex flex-col`) with the
  same spacing-scale gap as vertical (FR-002).
- [X] T016 [US3] Implement the horizontal layout's active-destination indicator: when
  `layout: "horizontal"`, the active destination's accent border switches from
  `border-l-2 border-foreground` to `border-b-2 border-foreground` (bottom edge) — same
  `aria-current`/text-color treatment as vertical, axis-only difference (FR-002, FR-003).
- [X] T017 [US3] Add a horizontal Navigation example to `playground/main.tsx`: the same
  destination list as the vertical example (active/disabled destinations included),
  rendered with `layout="horizontal"`, side-by-side with the vertical example for visual
  comparison.
- [X] T018 [P] [US3] Extend `navigation.test.tsx`: rendering the same destination list with
  `layout="horizontal"` produces identical `aria-current`/`aria-disabled`/focus-ring behavior
  to the vertical layout, differing only in the container's flex-direction class and the
  active accent's border side (FR-002, User Story 3 Acceptance Scenario 1).

**Checkpoint**: All three user stories independently functional — Navigation component is
feature-complete per spec.md's User Scenarios.

---

## Phase 6: Polish & Cross-Cutting Concerns

- [X] T019 [US1] Implement label truncation (research.md Decision 5): wrap each
  destination's label in a `truncate` utility element and set `title={label}` on the
  destination's root element, so an overflowing label shows an ellipsis with the full text
  available on hover while the accessible name stays the complete string (FR-012).
- [X] T020 [US1] Implement empty-list rendering: `destinations={[]}` renders the `<nav
  aria-label={label}>` landmark with no child destinations and no layout-shifting fallback
  content (FR-013).
- [X] T021 [US1] Implement missing-icon resilience: confirm a destination whose `leadingIcon`
  is `null`/`undefined`/throws still renders its label and remains focusable/activatable —
  the icon slot is purely additive and never required for the label or activation path to
  work (FR-014).
- [X] T022 [P] Write `src/components/navigation/README.md` per the documentation pattern
  established by `button/README.md`, `field/README.md`, `card/README.md`, and
  `table/README.md`: where the component lives, the destination → `tokens.css` role mapping
  table (data-model.md), the typography-role mapping table, the `NavItemProps`/`as`
  discriminated-union reference, and the required-`label`-for-landmark-disambiguation
  guidance (research.md Decision 6).
- [X] T023 [P] Extend `navigation.test.tsx`: a destination with an overflowing label
  truncates with a `title` attribute carrying the full text while the accessible name stays
  the full label; `destinations={[]}` renders the `<nav>` landmark with no items; a
  destination with a failing `leadingIcon` still renders its label and remains activatable
  (FR-012, FR-013, FR-014).
- [X] T024 Run quickstart.md's full manual playground checklist (vertical active rendering,
  hover/focus states, disabled destination, horizontal layout, truncation, empty list,
  missing icon, screen-reader landmark pass) in a real browser and confirm every item passes.
- [X] T025 Run `yarn build` and confirm the library bundle exports `Navigation` from
  `src/index.ts` with no build errors, alongside the existing `Button`/`Field`/`Input`/`Card`/
  `Table` exports (contracts/navigation-api.md).

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion — blocks all user stories.
- **User Stories (Phase 3-5)**: All depend on Foundational completion.
  - US1 has no dependency on US2/US3.
  - US2 depends on US1's destination rendering existing (T004) but not on US3.
  - US3 depends on US1's destination + active-indicator rendering existing (T004, T007) but
    not on US2.
  - US1-US3 all touch the same single file (`navigation.tsx`) — sequence them rather than run
    truly in parallel to avoid merge conflicts, same rationale as Button/Field/Card/Table.
- **Polish (Phase 6)**: Truncation/empty-list/missing-icon (T019-T021) depend on US1's
  destination rendering (T004) existing; README/quickstart/build (T022-T025) depend on
  US1-US3 all being complete.

### Within Each User Story

- Styling logic before composition wiring before playground wiring before tests.
- Each story's checkpoint must pass before starting the next story.

### Parallel Opportunities

- Each story's test task (T010, T014, T018) is marked `[P]` relative to that story's
  playground/implementation tasks — it edits `navigation.test.tsx`, a different file.
- T008 (barrel export) and T022 (README) are marked `[P]`/independent-file tasks relative to
  `navigation.tsx` edits in their respective phases.

---

## Parallel Example: User Story 1

```bash
# Once T003-T009 land, run alongside final US1 implementation polish:
Task: "Write navigation.test.tsx covering destination/active-state/landmark behavioral guarantees"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: `yarn typecheck && yarn test && yarn lint`, then visually confirm
   vertical destination rendering and active-state indication in the playground
5. At this point a correctly styled, vertical-only Navigation with a working active state
   exists and is demoable, even before disabled destinations or the horizontal layout land

### Incremental Delivery

1. Setup + Foundational → skeleton ready
2. User Story 1 → vertical sidebar with active-state indication demoable (MVP)
3. User Story 2 → disabled destinations layered on top, independently verified
4. User Story 3 → horizontal layout layered on top, independently verified
5. Polish → truncation + empty-list + missing-icon resilience + documentation + final
   quickstart validation + build check

---

## Notes

- `[P]` tasks touch different files with no dependency on an incomplete task — most tasks in
  US1-US3 are sequential because they share `navigation.tsx`, expected for a single-file
  component, not a sign of missing decomposition (plan.md Structure Decision).
- `[Story]` label maps each task to spec.md's user stories for traceability.
- Stop at each checkpoint to validate that story independently before continuing.
- Migrating `gridu-web`'s existing dashboard sidebar or `gridu-landing`'s existing header is a
  guardrail (spec Assumptions), not a task — no task in this list touches either repo.
- Typography role mapping (data-model.md): destination label (rest/hover/focus) → `label`
  (T004); destination label (active) → `label` + `text-foreground` (T007).
- Nested/grouped navigation, a collapsible icon-only sidebar mode, and responsive
  overflow/hamburger handling are explicitly out of scope (spec Assumptions) — no task in
  this list builds any of them, by design, not as a partial implementation awaiting a future
  pass.
