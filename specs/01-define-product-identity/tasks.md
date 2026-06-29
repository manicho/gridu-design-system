---

description: "Task list for Define Product Identity"
---

# Tasks: Define Product Identity

**Input**: Design documents from `/specs/01-define-product-identity/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

**Tests**: Not requested — this feature's deliverable is a Markdown document, validated by
running `quickstart.md`'s checks against it (Phase N), not by automated tests.

**Organization**: Tasks are grouped by user story. The single deliverable is
`specs/01-define-product-identity/identity.md`, built up section by section per story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different sections of the same file are NOT parallel-safe —
  see Parallel Opportunities below for what actually qualifies)
- **[Story]**: Which user story this task belongs to (US1, US2)

## Path Conventions

Single deliverable file: `specs/01-define-product-identity/identity.md`. No other repo files
are read or modified by this feature (unlike Feature 00, there is no source code to inspect —
this document is authored from existing product knowledge per research.md).

---

## Phase 1: Setup

**Purpose**: Create the identity document skeleton matching the structure decided in
research.md (Purpose → Values → Personality → Target Persona).

- [X] T001 Create `specs/01-define-product-identity/identity.md` with section headers:
  `## Purpose`, `## Values`, `## Personality`, `## Target Persona`, plus a one-line scope
  note at the top recording that no visual design content (FR-005) and no reference to
  `gridu-landing/docs/brand-guidelines.md` (FR-006) belong in this document

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Lock in the scope fences both user stories must respect before any content is
written.

**⚠️ CRITICAL**: Both user stories require this phase complete first

- [X] T002 Confirm authoring constraint before writing any section: do not open or reference
  `gridu-landing/docs/brand-guidelines.md` while drafting `identity.md` (FR-006); author
  every section from the product/market knowledge already established in this epic (gridu is
  a WhatsApp scheduling assistant for Chilean service businesses)

**Checkpoint**: Scope fences confirmed — User Story 1 can begin

---

## Phase 3: User Story 1 - Foundation for downstream design decisions (Priority: P1) 🎯 MVP

**Goal**: `identity.md` states gridu's purpose, core values, personality, and primary persona
clearly enough that Feature 02 (Design Principles) and Feature 03 (Visual Direction) can use
it to justify design decisions without asking clarifying questions.

**Independent Test**: Read `identity.md` alone and confirm you can state gridu's purpose,
what its core values mean in practice, its personality, and its primary persona — per
quickstart.md steps 1, 3, 4, 5.

### Implementation for User Story 1

- [X] T003 [US1] Write `## Purpose` in `identity.md`: a single concrete statement of why
  gridu exists for its users — describing user value (time/stress saved, missed-appointment
  reduction), not a feature list (FR-001)
- [X] T004 [P] [US1] Write `## Values` in `identity.md`: 3-5 named brand values, each with a
  concrete "what this means in practice" description distinct from the label itself (FR-002)
- [X] T005 [P] [US1] Write `## Personality` in `identity.md`: describe gridu as if it were a
  person, specific enough to distinguish it from a generic "friendly and professional"
  description — e.g. how it reacts to its own mistakes, how formal or casual it is (FR-003).
  Do not include voice/tone style-guide details (banned words, emoji rules, example phrases)
  per research.md's scope decision
- [X] T006 [US1] Write `## Target Persona` in `identity.md`: exactly one primary persona with
  identity (role, business type), context (technical comfort, daily constraints), and needs
  from gridu (FR-004)

**Checkpoint**: User Story 1 fully delivers the foundation — independently testable per
quickstart.md steps 1, 3, 4, 5

---

## Phase 4: User Story 2 - Single source of truth across the ecosystem (Priority: P2)

**Goal**: `identity.md` is confirmed as the one canonical, self-contained identity reference
for `gridu-design-system`, `gridu-web`, and `gridu-landing` — not duplicated or contradicted
elsewhere.

**Independent Test**: Confirm the document lives only in `gridu-design-system` and that
nothing in it requires reading a surface-specific file to be understood — quickstart.md
step 1, applied specifically against duplication risk this time rather than general clarity.

### Implementation for User Story 2

- [X] T007 [P] [US2] Verify `identity.md` requires no surface-specific context: re-read each
  section (T003-T006) and confirm none of them assume knowledge only available by reading
  `gridu-web` or `gridu-landing` source — fix any section that does (depends on T003-T006)
- [X] T008 [P] [US2] Confirm no duplicate or contradicting identity content needs to be created
  in `gridu-web` or `gridu-landing` — this single file is the canonical reference (FR-007);
  no file changes needed in either of those repos for this task to pass

**Checkpoint**: Both user stories complete — `identity.md` is ready for full validation

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Final validation against the spec before handing off to Feature 02

- [X] T009 Run quickstart.md's required validation checks (1-5) against the completed
  `identity.md` and fix any failing check directly in the document
- [X] T010 Re-run the `specs/01-define-product-identity/checklists/requirements.md`
  checklist against the final `identity.md` content (not just spec.md) to confirm FR-001
  through FR-007 and SC-001 through SC-003 are met

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies
- **Foundational (Phase 2)**: Depends on Setup — BLOCKS both user stories
- **User Story 1 (Phase 3)**: Depends on Foundational
- **User Story 2 (Phase 4)**: Depends on User Story 1 (T007 re-reads T003-T006's content;
  there is nothing to verify for self-containment before that content exists)
- **Polish (Phase 5)**: Depends on User Story 2 complete

### Within User Story 1

- T003 (Purpose) has no dependency on the others and can be written first
- T004 (Values) and T005 (Personality) can be drafted in parallel content-wise, though both
  benefit from T003 existing first (values/personality should support the stated purpose)
- T006 (Persona) has no hard dependency on T003-T005 but is conventionally written last per
  research.md's stated section order

### Parallel Opportunities

- T004 and T005 (Values, Personality) — independent content, can be drafted in parallel
  before being reconciled against T003's purpose statement
- T007 and T008 (US2) are independent checks and can run in parallel

---

## Parallel Example: User Story 1

```bash
# After T003 (Purpose) is written, in parallel:
Task: "Write ## Values in identity.md"
Task: "Write ## Personality in identity.md"

# Then sequentially:
Task: "Write ## Target Persona in identity.md"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1 — at this point Features 02 and 03 already have enough to
   start (the core identity content), even before US2's consolidation checks run
4. **STOP and VALIDATE**: run quickstart.md steps 1, 3, 4, 5 against `identity.md`

### Incremental Delivery

1. Setup + Foundational → scope fences locked in
2. User Story 1 → purpose, values, personality, persona → usable by Features 02-03 (MVP)
3. User Story 2 → self-containment and single-source-of-truth verification → fully validated

---

## Notes

- All tasks write to the same file (`identity.md`); "[P]" above marks tasks whose *content*
  has no dependency on each other, not tasks that can be edited simultaneously without
  conflict — apply them as separate, sequential edits in practice.
- Commit after each checkpoint (end of Phase 2, Phase 3, Phase 4), not after every task.
