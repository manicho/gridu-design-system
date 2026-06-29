---

description: "Task list for Analyze Existing Product"
---

# Tasks: Analyze Existing Product

**Input**: Design documents from `/specs/00-analyze-existing-product/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

**Tests**: Not requested — this feature's deliverable is a Markdown document, validated by
running `quickstart.md`'s checks against it (Phase N), not by automated tests.

**Organization**: Tasks are grouped by user story. The single deliverable is
`specs/00-analyze-existing-product/audit.md`, built up section by section per story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different sections of the same file are NOT parallel-safe —
  see Parallel Opportunities below for what actually qualifies)
- **[Story]**: Which user story this task belongs to (US1, US2)

## Path Conventions

Single deliverable file: `specs/00-analyze-existing-product/audit.md`. Source material is
read-only from `gridu-web` and `gridu-landing` (siblings of this repo) — no files in those
repos are modified by this feature.

---

## Phase 1: Setup

**Purpose**: Create the audit document skeleton matching the structure decided in
research.md (per-surface sections first, then comparison, then gaps).

- [ ] T001 Create `specs/00-analyze-existing-product/audit.md` with section headers:
  `## gridu-web`, `## gridu-landing`, `## Cross-Surface Comparison`, `## Gaps`, each with
  `### Color`, `### Typography`, `### Spacing`, `### Components` subheadings under the two
  surface sections

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Locate the concrete source files each story will cite findings from. Both user
stories depend on this inventory existing before findings can be written with citations
(FR-008).

**⚠️ CRITICAL**: Both user stories require this phase complete first

- [ ] T002 [P] Inventory gridu-web styling sources: confirm and list
  `gridu-web/components.json`, `gridu-web/src/index.css` (CSS variables / design tokens),
  and every file under `gridu-web/src/components/ui/` (button.tsx, card.tsx, input.tsx,
  table.tsx, badge.tsx, alert.tsx, select.tsx, label.tsx, skeleton.tsx, spinner.tsx,
  textarea.tsx) as the source set for gridu-web findings
- [ ] T003 [P] Inventory gridu-landing styling sources: confirm and list
  `gridu-landing/src/styles/global.css`, `gridu-landing/astro.config.mjs`, and every
  component under `gridu-landing/src/components/` as the source set for gridu-landing
  findings

**Checkpoint**: Source inventories for both surfaces exist — User Story 1 can begin

---

## Phase 3: User Story 1 - Baseline reference for downstream identity decisions (Priority: P1) 🎯 MVP

**Goal**: `audit.md` fully and independently describes current color, typography, spacing,
and component state for each surface, plus an explicit, evidence-backed list of
cross-surface inconsistencies.

**Independent Test**: Read only the `## gridu-web` section and confirm it stands alone
(quickstart.md step 2); repeat for `## gridu-landing`; then check `## Cross-Surface
Comparison` per quickstart.md step 3.

### Implementation for User Story 1

- [ ] T004 [US1] Document gridu-web color findings in `audit.md` under `## gridu-web ###
  Color`: extract actual CSS variable values from `gridu-web/src/index.css` (`--background`,
  `--foreground`, `--primary`, `--secondary`, `--muted`, `--accent`, `--destructive`,
  `--border`, `--input`, `--ring`, `--sidebar*`, both light and dark blocks), each finding
  citing `gridu-web/src/index.css` with the variable name
- [ ] T005 [US1] Document gridu-web typography findings in `audit.md` under `## gridu-web
  ### Typography`: font family/sizing actually applied (check `gridu-web/src/index.css` for
  any font declarations and `gridu-web/components.json` for icon library), citing sources
- [ ] T006 [US1] Document gridu-web spacing findings in `audit.md` under `## gridu-web ###
  Spacing`: observed padding/margin/radius patterns (e.g. `--radius` in
  `gridu-web/src/index.css`) and any consistent spacing scale visible across
  `gridu-web/src/components/ui/*.tsx`, citing each source file. Where a value varies across
  components rather than being applied once, record the observed range, not a single picked
  instance.
- [ ] T007 [US1] Document gridu-web component inventory in `audit.md` under `## gridu-web
  ### Components`: one entry per file in `gridu-web/src/components/ui/` (button, card,
  input, table, badge, alert, select, label, skeleton, spinner, textarea) listing its
  variants/props as currently implemented, citing the file path. Flag any component with no
  equivalent on gridu-landing as "surface-specific" — these stay in this inventory, not
  duplicated into the comparison section.
- [ ] T008 [US1] Document gridu-landing color findings in `audit.md` under `##
  gridu-landing ### Color`: extract actual values from `gridu-landing/src/styles/global.css`,
  citing that source
- [ ] T009 [US1] Document gridu-landing typography findings in `audit.md` under `##
  gridu-landing ### Typography`: font family/sizing from
  `gridu-landing/src/styles/global.css` and any font config in
  `gridu-landing/astro.config.mjs`, citing sources
- [ ] T010 [US1] Document gridu-landing spacing findings in `audit.md` under `##
  gridu-landing ### Spacing`: observed padding/margin/container-width patterns from
  `gridu-landing/src/styles/global.css` and representative components under
  `gridu-landing/src/components/`, citing sources. Where a value varies across components
  rather than being applied once, record the observed range, not a single picked instance.
- [ ] T011 [US1] Document gridu-landing component inventory in `audit.md` under `##
  gridu-landing ### Components`: one entry per component under
  `gridu-landing/src/components/`, listing its visual variants and explicitly flagging
  components with no equivalent in `gridu-web/src/components/ui/` as "surface-specific" —
  these get listed in this inventory, not duplicated into the comparison section — citing
  the file path (depends on T007)
- [ ] T012 [US1] Write `## Cross-Surface Comparison` in `audit.md`: for each concept with
  findings on both surfaces (color tokens, type scale, spacing/radius, shared component
  concepts like buttons/inputs/cards), state whether they match or diverge, referencing the
  specific findings from T004-T011 by section (depends on T004-T011)

**Checkpoint**: User Story 1 fully delivers the baseline — independently testable per
quickstart.md steps 1-3, 5-6

---

## Phase 4: User Story 2 - Identify gaps relative to having a real design system (Priority: P2)

**Goal**: `audit.md`'s `## Gaps` section names every absence relative to a real design
system, each traceable to a finding or inconsistency from User Story 1.

**Independent Test**: Read `## Gaps` and confirm every entry cites a specific finding or
inconsistency from the sections produced in User Story 1 (quickstart.md step 4).

### Implementation for User Story 2

- [ ] T013 [US2] Write `## Gaps` in `audit.md`: derive each gap (e.g. no documented type
  scale shared by both surfaces, no shared component library, no defined spacing scale, no
  shared design tokens) directly from findings/inconsistencies in T004-T012, with an explicit
  reference to the section each gap is derived from (depends on T012)

**Checkpoint**: Both user stories complete — `audit.md` is ready for full validation

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Final validation against the spec before handing off to Features 01-06

- [ ] T014 Run all six quickstart.md validation checks against the completed `audit.md` and
  fix any failing check directly in the document
- [ ] T015 Re-run the `specs/00-analyze-existing-product/checklists/requirements.md`
  checklist against the final `audit.md` content (not just spec.md) to confirm FR-001 through
  FR-008 and SC-001 through SC-003 are met

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies
- **Foundational (Phase 2)**: Depends on Setup — BLOCKS both user stories
- **User Story 1 (Phase 3)**: Depends on Foundational
- **User Story 2 (Phase 4)**: Depends on User Story 1 (T013 needs T004-T012's findings to
  derive gaps from — gaps cannot be written before findings exist)
- **Polish (Phase 5)**: Depends on User Story 2 complete

### Within User Story 1

- T004-T007 (gridu-web) and T008-T011 (gridu-landing) can proceed in parallel as two tracks
- T011 depends on T007 (needs the gridu-web component inventory to check for equivalents)
- T012 depends on all of T004-T011

### Parallel Opportunities

- T002 and T003 (Foundational) run in parallel — different repos
- T004-T007 (gridu-web track) can run in parallel with T008-T010 (gridu-landing track,
  excluding T011 which waits on T007) — different sections of the same file, but
  independent content with no cross-references until T012

---

## Parallel Example: Foundational + early User Story 1

```bash
# Foundational, in parallel:
Task: "Inventory gridu-web styling sources"
Task: "Inventory gridu-landing styling sources"

# Once Foundational completes, two tracks in parallel:
Task: "Document gridu-web color/typography/spacing/components findings (T004-T007)"
Task: "Document gridu-landing color/typography/spacing findings (T008-T010)"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1 — at this point the baseline (color, typography, spacing,
   components, inconsistencies) is usable by Features 01-06 even without gaps documented
4. **STOP and VALIDATE**: run quickstart.md steps 1-3, 5-6 against `audit.md`

### Incremental Delivery

1. Setup + Foundational → source inventories ready
2. User Story 1 → baseline findings + comparison → usable by downstream features (MVP)
3. User Story 2 → gaps section → complete audit, full quickstart.md validation

---

## Notes

- All tasks write to the same file (`audit.md`); "[P]" above marks tasks whose *content* has
  no dependency on each other, not tasks that can be edited simultaneously without
  conflict — apply them as separate, sequential edits in practice.
- Commit after each checkpoint (end of Phase 2, Phase 3, Phase 4), not after every task.
- SC-003 ("Features 01-06 can start without re-deriving current-state facts") has no
  dedicated task — it's an emergent outcome confirmed implicitly when those features
  successfully begin without backtracking into the codebases, not something buildable now.
