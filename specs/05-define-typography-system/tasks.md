# Tasks: Define Typography System

**Input**: Design documents from `specs/05-define-typography-system/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

**Tests**: No automated tests — deliverable is a specification document. Validation is
manual via quickstart.md.

**Organization**: All tasks write to a single deliverable file
`specs/05-define-typography-system/typography-system.md`. Phases follow the data-model.md
field structure: skeleton → header (typeface + floor) → role values (US1) → character
traces (US2) → typeface rationale + floor compliance (US3) → validation.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Different role groups in the same file — can proceed in parallel without
  file conflicts
- **[Story]**: Which user story this task serves (US1, US2, US3)
- All paths are relative to `gridu-design-system/`

---

## Phase 1: Setup

**Purpose**: Create the `typography-system.md` file structure that all subsequent tasks
populate.

- [X] T001 Create `specs/05-define-typography-system/typography-system.md` skeleton:
  header block stubs (version, status, typeface, fallback_stack, minimum_size_floor,
  source) and three role-group sections (Headings: 3 empty rows; Body & Text: 4 empty
  rows for body-default, body-secondary, label, caption; Numeric: 1 empty row for
  numeric-tabular) with column headings (name, purpose, font_family, weight, size,
  line_height, letter_spacing, character_note, overflow_behavior); add numeric_feature as
  a row-level field within the numeric-tabular role entry only — not a column across all
  rows (per data-model.md: "only for numeric-tabular")

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Populate the document-level header block. These top-level declarations are
prerequisite to every role-level task.

**⚠️ CRITICAL**: No role-level task can begin until this phase is complete.

- [X] T002 Populate typography-system.md header block in
  `specs/05-define-typography-system/typography-system.md`: `version: 1.0.0`,
  `status: Draft`, `typeface: Inter`,
  `fallback_stack: ui-sans-serif, system-ui, -apple-system, sans-serif`,
  `minimum_size_floor: 12px (0.75rem) general / 14px (0.875rem) for body-default`,
  `source: specs/03-research-visual-direction/visual-direction.md,
  specs/04-define-color-system/color-system.md, and
  specs/00-analyze-existing-product/audit.md`

**Checkpoint**: Header complete — role-level phases can now proceed.

---

## Phase 3: User Story 1 — One authoritative type decision per text role (Priority: P1) 🎯 MVP

**Goal**: All 8 semantic roles defined with purpose statements, font family reference,
weight, size, line-height, letter-spacing, overflow behavior, and (for numeric-tabular)
the tabular-figure feature.

**Independent Test**: Given only `typography-system.md`, a developer can assign family,
weight, size, line-height, and letter-spacing to every text element of a hypothetical new
component (heading, body, label, caption, numeric value) without consulting any other
file and without having to choose between two equally valid roles.

### Implementation for User Story 1

- [X] T003 [P] [US1] Write purpose statement and full value set (font_family, weight,
  size, line_height, letter_spacing) for the 3 heading roles in
  `specs/05-define-typography-system/typography-system.md`: heading-page (2rem/700/1.2/
  -0.02em), heading-section (1.5rem/700/1.25/-0.01em), heading-subsection (1.125rem/600/
  1.3/0) — per research.md Decision 3
- [X] T004 [P] [US1] Write purpose statement and full value set for the 4 body/text roles
  in `specs/05-define-typography-system/typography-system.md`: body-default (1rem/400/
  1.5/0), body-secondary (0.875rem/400/1.5/0), label (0.875rem/500/1.4/0), caption
  (0.75rem/400/1.4/0.01em) — per research.md Decision 3
- [X] T005 [US1] Write purpose statement and full value set for the numeric-tabular role
  in `specs/05-define-typography-system/typography-system.md` (1rem default/600/1.2/0)
  and add its numeric_feature field: `font-variant-numeric: tabular-nums lining-nums` —
  per research.md Decision 4
- [X] T006 [US1] Add overflow_behavior to each of the 8 roles in
  `specs/05-define-typography-system/typography-system.md`: `wrap` for heading-page,
  heading-section, heading-subsection, body-default, body-secondary, caption,
  numeric-tabular; `wrap` (default) with a documented `truncate-optional` exception note
  for `label` scoped to component-author opt-in — per research.md Decision 4 (depends on
  T003, T004, T005)
- [X] T007 [US1] Verify the minimum-size floor for all 8 roles in
  `specs/05-define-typography-system/typography-system.md`: confirm no role is below 12px
  (0.75rem) and `body-default` is at least 14px (0.875rem); record the check inline as
  part of each role's entry (depends on T003, T004, T005)

**Checkpoint**: All 8 roles have purpose + full value set + overflow_behavior +
numeric_feature (where applicable). Minimum-size floor verified.

---

## Phase 4: User Story 2 — Type choices traceable to Quiet Competence (Priority: P2)

**Goal**: Every role has a character_note tracing its weight/size/spacing tendency to a
specific passage in `visual-direction.md` or a principle in `.specify/memory/constitution.md`.
The document explicitly states that hierarchy comes from weight and size, not color.

**Independent Test**: For any role in `typography-system.md`, a reader can open
`visual-direction.md` and find the specific passage the character_note references. A
character_note that says only "fits the direction" without a traceable citation fails.

### Implementation for User Story 2

- [X] T008 [P] [US2] Add character_note to each of the 3 heading roles in
  `specs/05-define-typography-system/typography-system.md`, tracing weight 700/600 and
  the tightened letter-spacing to the Quiet Competence "Weight variation is used for
  hierarchy... not for personality" passage in `specs/03-research-visual-direction/visual-direction.md`,
  and to the existing `tracking-tight` precedent in `specs/00-analyze-existing-product/audit.md`
- [X] T009 [P] [US2] Add character_note to each of the 4 body/text roles in
  `specs/05-define-typography-system/typography-system.md`, tracing body-default/
  body-secondary's plain, undecorated character to "Plain, high-legibility letterforms
  with no decorative detail" (visual-direction.md), and label's weight 500 to its role as
  an interactive-element affordance distinct from passive caption/body text
- [X] T010 [US2] Add character_note to the numeric-tabular role in
  `specs/05-define-typography-system/typography-system.md`, tracing its weight 600 and
  glanceable emphasis to Principle III (Outcome First, constitution.md) — a number the
  owner must act on should be the easiest thing on the screen to find (depends on T005)
- [X] T011 [US2] Add an explicit system-wide statement to
  `specs/05-define-typography-system/typography-system.md` confirming that hierarchy
  across all 8 roles is carried by weight and size only — never by color — per FR-006 and
  Principle V (Calm Under Pressure); cross-reference that color is the responsibility of
  `specs/04-define-color-system/color-system.md`, not this document (depends on T008,
  T009, T010)

**Checkpoint**: All 8 roles have character_note. Every note cites a specific passage or
named characteristic. Weight/size-as-hierarchy statement present.

---

## Phase 5: User Story 3 — One typeface decision, resolved once (Priority: P3)

**Goal**: The document states the single typeface decision (Inter + fallback stack) with
its rationale, confirms it applies identically to both `gridu-web` and `gridu-landing`,
and confirms every role's size satisfies the minimum-legibility floor as a finished,
cross-checked set (not just per-role spot checks from US1).

**Independent Test**: A developer setting up a new surface can open
`typography-system.md` and find (a) exactly one typeface to load, with fallback stack,
and (b) a confirmation that every defined role meets the legibility floor — without
checking `gridu-web` or `gridu-landing` source or any other document.

### Implementation for User Story 3

- [X] T012 [US3] Add a "Typeface Decision" section to
  `specs/05-define-typography-system/typography-system.md` documenting: the decision to
  keep Inter (research.md Decision 1), the rationale (zero migration cost, character
  match to Quiet Competence, existing identical declaration on both surfaces per
  audit.md), and the alternatives considered and rejected
- [X] T013 [US3] Add a cross-surface consistency statement to
  `specs/05-define-typography-system/typography-system.md` confirming `gridu-web` and
  `gridu-landing` MUST load the identical typeface and fallback stack declared in T002 —
  resolving any future drift before Feature 06 implements the token files (depends on
  T002)
- [X] T014 [US3] Compile a summary table in
  `specs/05-define-typography-system/typography-system.md` listing all 8 roles against
  the minimum-size floor (12px general / 14px body-default), confirming each role's
  status as PASS, as a single cross-checked view distinct from the per-role notes added
  in T007 (depends on T007)

**Checkpoint**: Typeface decision documented with rationale. Cross-surface consistency
stated once. Minimum-size floor compliance confirmed for the complete role set.

---

## Phase 6: Polish & Validation

**Purpose**: Run the full quickstart.md checklist and advance the document to Final.

- [X] T015 Run all 9 quickstart.md validation checks against
  `specs/05-define-typography-system/typography-system.md` and record each result
  (PASS/FAIL) with a brief note; if any check fails, fix the underlying issue in the
  document before proceeding to T016
- [X] T016 Update the `status` field in
  `specs/05-define-typography-system/typography-system.md` from `Draft` to `Final` once
  all 9 quickstart checks pass

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on T001
- **US1 (Phase 3)**: Depends on T002; T003 and T004 can start together; T005 can start
  alongside T003/T004 (different rows); T006 depends on T003, T004, T005; T007 depends on
  T003, T004, T005
- **US2 (Phase 4)**: Depends on T007 (role value sets finalized); T008 and T009 are [P] —
  different role groups; T010 depends on T005; T011 depends on T008, T009, T010
- **US3 (Phase 5)**: Depends on T007 (role value sets and floor spot-checks finalized);
  T012 has no further dependency beyond Phase 2; T013 depends on T002; T014 depends on
  T007
- **Polish (Phase 6)**: Depends on T011 and T014; T015 before T016

### User Story Dependencies

- **US1 (P1)**: Starts after Phase 2 — no story dependencies
- **US2 (P2)**: Starts after US1 complete (character notes trace finalized role values)
- **US3 (P3)**: Starts after US1 complete (typeface rationale and floor summary depend on
  finalized role values); US2 and US3 can proceed in parallel once US1 is done since they
  write to different fields/sections

### Parallel Opportunities

- T003, T004, T005: heading roles, body/text roles, and the numeric role write to
  non-overlapping rows — can run in parallel
- T008 and T009: heading character notes vs. body/text character notes — can run in
  parallel
- US2 (T008-T011) and US3 (T012-T014): different fields/sections (character_note vs.
  typeface rationale) — can run in parallel after US1 completes

---

## Parallel Example: User Story 1

```
# After T002 (foundational complete):
Parallel group A:
  T003 — heading role value sets (3 rows)
  T004 — body/text role value sets (4 rows)
  T005 — numeric-tabular value set + numeric_feature (1 row)

Sequential after A:
  T006 — overflow_behavior for all 8 roles
  T007 — minimum-size floor verification for all 8 roles
```

## Parallel Example: After US1 Complete

```
# After T007 (US1 complete):
Parallel group B:
  T008 — heading character notes
  T009 — body/text character notes
  T010 — numeric-tabular character note

Parallel group C:
  T012 — typeface decision section
  T013 — cross-surface consistency statement
  T014 — minimum-size floor summary table

(Groups B and C can also run in parallel with each other —
 character_note and typeface/floor sections are independent fields)

Sequential after groups B and C:
  T011 — weight/size-as-hierarchy statement
  T015 — quickstart.md full validation
  T016 — status → Final
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 (T001) + Phase 2 (T002)
2. Complete Phase 3 US1 (T003-T007)
3. **STOP and VALIDATE**: All 8 roles have purpose + full value set + overflow behavior,
   minimum-size floor verified
4. Document is usable as a value-only reference for Feature 06

### Incremental Delivery

1. T001-T007 → Usable value-only reference (MVP)
2. T008-T011 → Document becomes auditable / drift-proof (character traces + hierarchy
   statement)
3. T012-T014 → Document resolves the typeface decision and floor compliance as a
   complete, cross-checked set
4. T015-T016 → Status Final; ready for Feature 06 (Design Tokens)

---

## Notes

- [P] tasks write to non-overlapping rows/sections of the same file — conflict-free
- [Story] label maps task to specific user story for traceability
- No code is produced in this feature — `typography-system.md` is a Markdown spec
  document
- Deliverable boundary: `specs/05-define-typography-system/typography-system.md` only —
  zero changes to `gridu-web/` or `gridu-landing/` (FR-009)
