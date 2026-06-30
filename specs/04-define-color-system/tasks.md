# Tasks: Define Color System

**Input**: Design documents from `specs/04-define-color-system/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

**Tests**: No automated tests — deliverable is a specification document. Validation is
manual via quickstart.md.

**Organization**: All tasks write to a single deliverable file
`specs/04-define-color-system/color-system.md`. Phases follow the data-model.md field
structure: skeleton → header → light values (US1) → character traces (US2) →
dark values (US3) → validation.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Different role groups in the same file — can proceed in parallel without
  file conflicts
- **[Story]**: Which user story this task serves (US1, US2, US3)
- All paths are relative to `gridu-design-system/`

---

## Phase 1: Setup

**Purpose**: Create the `color-system.md` file structure that all subsequent tasks
populate.

- [X] T001 Create `specs/04-define-color-system/color-system.md` skeleton: header block stubs (version, status, color_space, dark_mode_mechanism, source) and two role-group sections (Base: 9 empty rows; Status: 6 empty rows) with column headings (name, group, purpose, light_value, dark_value, character_note, accessibility_note); add exception_note as a row-level field within the destructive role entry only — not a column across all status rows (per data-model.md: "only for destructive")

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Populate the document-level header block. These top-level declarations are
prerequisite to every role-level task.

**⚠️ CRITICAL**: No role-level task can begin until this phase is complete.

- [X] T002 Populate color-system.md header block in `specs/04-define-color-system/color-system.md`: `version: 1.0.0`, `status: Draft`, `color_space: OKLCH`, `dark_mode_mechanism: .dark CSS class applied to both gridu-web and gridu-landing`, `source: specs/03-research-visual-direction/visual-direction.md and specs/00-analyze-existing-product/audit.md`

**Checkpoint**: Header complete — role-level phases can now proceed.

---

## Phase 3: User Story 1 — One authoritative color decision per UI role (Priority: P1) 🎯 MVP

**Goal**: All 15 semantic roles defined with purpose statements, light OKLCH values, and
WCAG AA-verified accessibility notes. Destructive role explicitly documented as the
designed high-contrast exception.

**Independent Test**: Given only `color-system.md`, a developer can assign a color to
every element of a hypothetical new component (background, text, border, interactive
state, error, warning, success) without consulting any other file and without having to
choose between two equally valid tokens for the same role.

### Implementation for User Story 1

- [X] T003 [US1] Write purpose statement and light OKLCH value for each of the 9 base roles in `specs/04-define-color-system/color-system.md`: background, foreground, muted-surface, muted-foreground, border, input, ring, primary, primary-foreground — values must express Quiet Competence character: desaturated base (chroma ≤ 0.05 for neutrals), brand hue ≈ 165 with chroma 0.10-0.13 for primary
- [X] T004 [US1] Write purpose statement and light OKLCH value for each of the 6 status roles in `specs/04-define-color-system/color-system.md`: brand (hue ≈ 165, chroma 0.10-0.13), brand-strong (higher chroma or lower lightness than brand), brand-subtle (brand-tinted surface, low chroma), destructive (hue ~25-30, chroma ≥ 0.20), warning (hue ~75-85, chroma ~0.15-0.18), success (hue ~145-155)
- [X] T005 [US1] Add exception_note to the destructive role in `specs/04-define-color-system/color-system.md` stating explicitly: (a) it is the designed high-contrast exception in the otherwise muted palette, (b) its chroma is intentionally the highest in the system, (c) this resolves the manageable Principle II tension documented in `specs/03-research-visual-direction/visual-direction.md`
- [X] T006 [US1] Verify WCAG 2.1 AA contrast ratios for all 8 light-mode pairings listed in quickstart.md (foreground/background, muted-foreground/background, muted-foreground/muted-surface, primary-foreground/primary, text-on-destructive, text-on-warning, text-on-success, brand/background); adjust any OKLCH values failing 4.5:1 (normal text) or 3:1 (large/bold); add accessibility_note to each participating role documenting confirmed ratios

**Checkpoint**: All 15 roles have purpose + light value + accessibility_note. Destructive
exception_note present. WCAG AA verified in light mode.

---

## Phase 4: User Story 2 — Color choices traceable to Quiet Competence (Priority: P2)

**Goal**: Every role has a character_note tracing its value to a specific passage in
`visual-direction.md` or `constitution.md`. No token is a bare value without rationale.

**Independent Test**: For any role in `color-system.md`, a reader can open
`visual-direction.md` and find the specific passage the character_note references. The
destructive role explicitly references the "manageable Principle II tension" passage.
A character_note that says only "fits the direction" without a traceable citation fails.

### Implementation for User Story 2

- [X] T007 [P] [US2] Add character_note to each of the 9 base roles in `specs/04-define-color-system/color-system.md`, tracing each role's hue/chroma/lightness choice to a specific quoted passage or named characteristic from `specs/03-research-visual-direction/visual-direction.md` (e.g., "muted and desaturated base palette," "earns attention without demanding it," "surfaces that recede rather than assert")
- [X] T008 [P] [US2] Add character_note to each of the 6 status roles in `specs/04-define-color-system/color-system.md`: brand roles trace to the Quiet Competence accent character in `visual-direction.md`; destructive traces to "manageable Principle II tension" and "the ONLY high-contrast, high-weight moment" passage; warning and success trace to the palette's requirement for distinguishable status hue families (research.md Decision 4)

**Checkpoint**: All 15 roles have character_note. Every note cites a specific passage or
named characteristic — no generic statements.

---

## Phase 5: User Story 3 — Dark mode resolved once (Priority: P3)

**Goal**: All 15 roles have dark OKLCH values. Dark-mode activation mechanism declared
exactly once. All 8 pairings pass WCAG AA in dark mode.

**Independent Test**: A developer building a new surface can open `color-system.md` and
find (a) the dark value for every role and (b) exactly one stated mechanism for dark mode
activation — without checking gridu-web or gridu-landing source.

### Implementation for User Story 3

- [X] T009 [US3] Add dark OKLCH value to each of the 9 base roles in `specs/04-define-color-system/color-system.md`; values must produce a Quiet Competence dark palette: background dark + low chroma, foreground light, base roles inverted in lightness while preserving the desaturated character of the light palette
- [X] T010 [US3] Add dark OKLCH value to each of the 6 status roles in `specs/04-define-color-system/color-system.md`; destructive must maintain chroma ≥ 0.20 in dark mode; brand roles adjust lightness for dark-mode legibility while preserving hue ≈ 165 and Quiet Competence chroma range
- [X] T011 [US3] Verify WCAG 2.1 AA contrast for all 8 dark-mode pairings (same pairs as T006, now using dark values); adjust any dark OKLCH values below 4.5:1; update the accessibility_note for each role to include the dark-mode contrast ratio alongside the light-mode ratio confirmed in T006

**Checkpoint**: All 15 roles have both light and dark values. Dark mechanism declared once.
WCAG AA verified in both modes. accessibility_note for each role covers both light and
dark pairings.

---

## Phase 6: Polish & Validation

**Purpose**: Run the full quickstart.md checklist and advance the document to Final.

- [X] T012 Run all 8 quickstart.md validation checks against `specs/04-define-color-system/color-system.md` and record each result (PASS/FAIL) with a brief note; if any check fails, fix the underlying issue in the document before proceeding to T013
- [X] T013 Update the `status` field in `specs/04-define-color-system/color-system.md` from `Draft` to `Final` once all 8 quickstart checks pass

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on T001
- **US1 (Phase 3)**: Depends on T002; T003 and T004 can start together; T005 depends on T004; T006 depends on T003, T004, T005
- **US2 (Phase 4)**: Depends on T006 (character notes trace finalized, WCAG-verified values); T007 and T008 are [P] — different role groups in non-overlapping table rows
- **US3 (Phase 5)**: Depends on T006 (dark values must mirror stable light values); T009 and T010 are [P] — different role groups; T011 depends on T009 and T010
- **Polish (Phase 6)**: Depends on T011; T012 before T013

### User Story Dependencies

- **US1 (P1)**: Starts after Phase 2 — no story dependencies
- **US2 (P2)**: Starts after US1 complete (character notes trace finalized values)
- **US3 (P3)**: Starts after US1 complete (dark values mirror stable light values); US2 and US3 can proceed in parallel once US1 is done since they write to different fields

### Parallel Opportunities

- T003 and T004: same file, non-overlapping sections — can run in parallel
- T007 and T008: base roles vs. status roles, non-overlapping — can run in parallel
- T009 and T010: base roles vs. status roles, non-overlapping — can run in parallel
- US2 (T007-T008) and US3 (T009-T011): different fields (character_note vs. dark_value) — can run in parallel after US1 completes

---

## Parallel Example: User Story 1

```
# After T002 (foundational complete):
Parallel group A:
  T003 — base role light values (9 rows)
  T004 — status role light values (6 rows)

Sequential after A:
  T005 — destructive exception_note
  T006 — WCAG AA verification + accessibility_note all 8 pairings
```

## Parallel Example: After US1 Complete

```
# After T006 (US1 complete):
Parallel group B:
  T007 — base role character notes
  T008 — status role character notes

Parallel group C:
  T009 — base role dark values
  T010 — status role dark values

(Groups B and C can also run in parallel with each other —
 character_note and dark_value are independent fields)

Sequential after groups B and C:
  T011 — WCAG AA dark mode verification
  T012 — quickstart.md full validation
  T013 — status → Final
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 (T001) + Phase 2 (T002)
2. Complete Phase 3 US1 (T003-T006)
3. **STOP and VALIDATE**: All 15 roles have purpose + light value + WCAG AA note
4. Document is usable as a light-only reference for Features 05-06

### Incremental Delivery

1. T001-T006 → Usable light-mode-only reference (MVP)
2. T007-T008 → Document becomes auditable / drift-proof (character traces)
3. T009-T011 → Document becomes complete two-mode reference
4. T012-T013 → Status Final; ready for Feature 05 (Typography System)

---

## Notes

- [P] tasks write to non-overlapping rows/fields of the same file — conflict-free
- [Story] label maps task to specific user story for traceability
- No code is produced in this feature — `color-system.md` is a Markdown spec document
- All OKLCH values must use `oklch(L C H)` notation — no hex, rgb, or hsl permitted
- WCAG contrast verification requires converting OKLCH to sRGB; oklch.com or colorjs.io
  handle this conversion
- Deliverable boundary: `specs/04-define-color-system/color-system.md` only — zero
  changes to `gridu-web/` or `gridu-landing/` (FR-008)
