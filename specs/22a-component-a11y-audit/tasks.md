---

description: "Task list for Feature 22a: Component-Level Accessibility Audit"
---

# Tasks: Component-Level Accessibility Audit

**Input**: Design documents from `specs/22a-component-a11y-audit/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

**Tests**: Included — a11y assertions are added to each component's existing `*.test.tsx`
where a gap is found (spec FR-003, FR-004; research.md Decisions 2-3).

**Organization**: Tasks are grouped by user story (spec.md: US1 P1, US2 P2, US3 P3).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)

## Path Conventions

Single project. All paths relative to `gridu-design-system/` repo root.

---

## Phase 1: Setup

**Purpose**: No new dependencies or scaffolding are needed (research.md Decision 1) — this
phase only confirms the baseline is clean before auditing.

- [X] T001 Run `npm run typecheck && npm run test` at repo root and confirm a clean baseline
      (all six components' existing tests pass) before any audit changes are made

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Infrastructure every user story's per-component work depends on.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T002 Write a throwaway Node script (not committed as a package script) implementing
      OKLCH→linear-sRGB→relative-luminance→WCAG-contrast-ratio conversion (research.md
      Decision 1), run it against every color-role pairing in `tokens/tokens.css` that is
      actually used by the six components (text-on-background, focus ring on background,
      border/UI-boundary pairings, chart data color on background, both light and dark
      mode), and capture the exact ratios for use in Phase 3-5 findings
- [X] T003 [P] Create `specs/22a-component-a11y-audit/findings.md` skeleton per
      data-model.md's Findings Report structure — one section per component (Button, Field,
      Card, Table, Navigation, Chart), each with an empty Criterion/Check/Result/Detail table
      and a short methodology note referencing research.md Decisions 1-3

**Checkpoint**: Exact contrast ratios are known and the findings report has a place to record
every result — per-component audits (Phase 3) can now begin.

---

## Phase 3: User Story 1 - Consumer app ships an accessible component without extra work (Priority: P1) 🎯 MVP

**Goal**: Every one of the six components independently meets WCAG 2.1 AA for contrast,
keyboard focus, and ARIA semantics — fixed at the source/token level, not per-consumer.

**Independent Test**: Audit each component in isolation (playground + tests) against WCAG
2.1 AA criteria for contrast, focus, and ARIA — no consuming app needed (spec.md US1).

### Implementation for User Story 1

- [X] T004 [P] [US1] Audit Button (`src/components/button/button.tsx`,
      `button.test.tsx`) — contrast (all 5 variants × default/hover/active/disabled, using
      T002's ratios), keyboard focus (tab order, visible ring per quickstart.md step 2),
      ARIA (accessible name for text vs. icon-only mode, `aria-busy`/`aria-disabled` states);
      fix any violation directly in `button.tsx` or `tokens/tokens.css` (and
      `playground/main.tsx`/`README.md` if the fix changes public usage, e.g. a newly
      required prop); add any missing assertion to `button.test.tsx`; record every check in
      `specs/22a-component-a11y-audit/findings.md`
- [X] T005 [P] [US1] Audit Field/Input (`src/components/field/field.tsx`, `input.tsx`,
      `field-label.tsx`, `field-message.tsx`, `field.test.tsx`) — contrast, keyboard focus,
      ARIA (`aria-invalid`, `aria-describedby` wiring to error/helper text, label
      association); fix any violation in the `field/` source or `tokens/tokens.css` (and
      `playground/main.tsx`/`README.md` if the fix changes public usage); add any missing
      assertion to `field.test.tsx`; record every check in `findings.md`
- [X] T006 [P] [US1] Audit Card (`src/components/card/card.tsx`, `card.test.tsx`) —
      contrast, keyboard focus (interactive vs. static card modes), ARIA (`aria-label`/
      `aria-labelledby` resolution, `aria-pressed`/`aria-current`/`aria-disabled` states,
      nested-interactive-element handling); fix any violation in `card.tsx` or
      `tokens/tokens.css` (and `playground/main.tsx`/`README.md` if the fix changes public
      usage); add any missing assertion to `card.test.tsx`; record every check in
      `findings.md`
- [X] T007 [P] [US1] Audit Table (`src/components/table/table.tsx`, `table.test.tsx`) —
      contrast (including row hover/selected states), keyboard focus (sortable header,
      row-selection controls), ARIA (`aria-sort`, table/row/cell semantics, row-selection
      accessible names); fix any violation in `table.tsx` or `tokens/tokens.css` (and
      `playground/main.tsx`/`README.md` if the fix changes public usage); add any missing
      assertion to `table.test.tsx`; record every check in `findings.md`
- [X] T008 [P] [US1] Audit Navigation (`src/components/navigation/navigation.tsx`,
      `navigation.test.tsx`) — contrast, keyboard focus (link/item tab order, disabled items
      excluded from tab order), ARIA (navigation landmark `aria-label`, `aria-current`,
      `aria-disabled`); fix any violation in `navigation.tsx` or `tokens/tokens.css` (and
      `playground/main.tsx`/`README.md` if the fix changes public usage); add any missing
      assertion to `navigation.test.tsx`; record every check in `findings.md`
- [X] T009 [P] [US1] Audit Chart (`src/components/chart/chart.tsx`, `chart.test.tsx`) —
      contrast (data color, axis/gridline color, all against `background` in both modes,
      per Edge Cases' per-pairing check), keyboard focus (per-point/per-bar tab order and
      visible ring), ARIA (`role="img"`, computed `aria-label`/`aria-describedby`, hidden
      data-table fallback); fix any violation in `chart.tsx` or `tokens/tokens.css` (and
      `playground/main.tsx`/`README.md` if the fix changes public usage); add any missing
      assertion to `chart.test.tsx`; record every check in `findings.md`

**Checkpoint**: All six components independently pass WCAG 2.1 AA for contrast, focus, and
ARIA, or have a documented `Deferred` finding with reason (spec FR-007). MVP complete.

---

## Phase 4: User Story 2 - Design system maintainer gets a durable audit trail (Priority: P2)

**Goal**: `findings.md` is a complete, accurate, committed record a future maintainer can
trust as a baseline.

**Independent Test**: Confirm `findings.md` lists all six components with criteria checked
and pass/fixed/deferred outcome for each (spec.md US2).

### Implementation for User Story 2

- [X] T010 [US2] Review `specs/22a-component-a11y-audit/findings.md` for completeness against
      data-model.md's validation rules — every Component × Criterion cell from T004-T009 is
      present, every `Deferred` row has a non-empty reason, every `Fixed` row references the
      file changed (depends on T004-T009)

**Checkpoint**: `findings.md` is complete and ready to serve as the durable baseline spec
FR-009 requires.

---

## Phase 5: User Story 3 - No visual regression from accessibility fixes (Priority: P3)

**Goal**: Confirm the fixes applied in Phase 3 introduced no unintended visual or behavioral
change.

**Independent Test**: Pre-existing test/story suite passes before and after the audit's
fixes, with no unrelated test or documented story behavior broken (spec.md US3).

### Implementation for User Story 3

- [X] T011 [US3] Run `npm run typecheck && npm run test` at repo root and confirm all tests
      pass (including any added in T004-T009) with zero regressions against the T001
      baseline (depends on T004-T009)
- [X] T012 [US3] Run `npm run dev`, open the playground, and manually tab-traverse each of
      the six component sections in both light and dark mode per quickstart.md step 2,
      confirming no layout shift or broken interaction beyond the intended accessibility fix
      (depends on T004-T009)

**Checkpoint**: All user stories complete — audit fixed, findings recorded, no regression.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — establishes the pre-audit baseline
- **Foundational (Phase 2)**: Depends on Setup — BLOCKS all user stories (T004-T009 need
  T002's exact ratios and T003's findings.md skeleton to write into)
- **User Story 1 (Phase 3)**: Depends on Foundational
- **User Story 2 (Phase 4)**: Depends on User Story 1 (reviews the findings US1 produced)
- **User Story 3 (Phase 5)**: Depends on User Story 1 (verifies the fixes US1 made)

### Parallel Opportunities

- T004-T009 (the six component audits) touch six disjoint sets of source/test files and can
  run in parallel — but each writes its own section of the shared `findings.md`
  (T003's skeleton), so those specific edits should be applied one at a time even if the
  audit work itself happens in parallel
- T011 and T012 (Phase 5) can run in parallel — different verification methods (automated
  vs. manual), no shared file

---

## Parallel Example: User Story 1

```bash
# Launch all six component audits together (source/test file work is disjoint):
Task: "Audit Button — contrast, focus, ARIA in src/components/button/"
Task: "Audit Field/Input — contrast, focus, ARIA in src/components/field/"
Task: "Audit Card — contrast, focus, ARIA in src/components/card/"
Task: "Audit Table — contrast, focus, ARIA in src/components/table/"
Task: "Audit Navigation — contrast, focus, ARIA in src/components/navigation/"
Task: "Audit Chart — contrast, focus, ARIA in src/components/chart/"
# Then serialize each task's findings.md write to avoid clobbering concurrent edits.
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001)
2. Complete Phase 2: Foundational (T002-T003)
3. Complete Phase 3: User Story 1 (T004-T009) — all six components fixed
4. **STOP and VALIDATE**: Every component independently meets WCAG 2.1 AA
5. This alone satisfies the epic tracker's core intent for Feature 22a

### Incremental Delivery

1. Setup + Foundational → ratios known, findings.md ready
2. User Story 1 → all six components audited and fixed (MVP)
3. User Story 2 → findings.md reviewed for completeness
4. User Story 3 → regression-checked, ready to commit

---

## Notes

- [P] tasks = different files, no dependencies — except the shared `findings.md`, which
  should be edited sequentially per the Parallel Opportunities note above
- Tests are included per component (extending existing `*.test.tsx` files, not new files)
- Verify T001's baseline passes before starting T004-T009, so any later failure is
  attributable to the audit's own changes
- Commit after each component's audit (T004-T009) is complete, or after the full Phase 3 —
  per the repo's existing one-feature-per-commit-set convention (see git log)
