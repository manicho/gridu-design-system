---

description: "Task list for Define Design Principles"
---

# Tasks: Define Design Principles

**Input**: Design documents from `/specs/02-define-design-principles/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

**Tests**: Not requested — this feature's deliverable is a Markdown document, validated by
running `quickstart.md`'s checks against it (Phase N), not by automated tests.

**Organization**: Tasks are grouped by user story. The single deliverable is
`specs/02-define-design-principles/principles.md`, built up section by section per story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different sections of the same file are NOT parallel-safe —
  see Parallel Opportunities below for what actually qualifies)
- **[Story]**: Which user story this task belongs to (US1, US2)

## Path Conventions

Single deliverable file: `specs/02-define-design-principles/principles.md`. The only other
file read (not modified) is `specs/01-define-product-identity/identity.md`, to source and
verify identity traces.

---

## Phase 1: Setup

**Purpose**: Create the principles document skeleton.

- [X] T001 Create `specs/02-define-design-principles/principles.md` with an introductory
  scope note (no visual design content per FR-005; each principle below states its identity
  trace and an example decision) and an empty `## Principles` section to hold each named
  principle as a subsection

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish the candidate identity traces both user stories' principles will draw
from, per research.md's decision to derive principles from identity.md rather than inventing
them independently.

**⚠️ CRITICAL**: Both user stories require this phase complete first

- [X] T002 Re-read `specs/01-define-product-identity/identity.md` and list, as working notes
  (not yet in `principles.md`), the specific design/product tension each of its four values
  (Effortless setup, Always-on reliability, Respectful brevity, Local fit) and its personality
  description raises — this list is the candidate pool Phase 3 drafts principles from

**Checkpoint**: Candidate identity traces identified — User Story 1 can begin

---

## Phase 3: User Story 1 - Resolving design disagreements with a shared reference (Priority: P1) 🎯 MVP

**Goal**: `principles.md` contains 4-6 named principles, each normatively phrased, each
tracing to a specific identity.md value or trait, each with a concrete example decision —
enough for Features 03-22 to resolve real design disagreements.

**Independent Test**: Pick a hypothetical design disagreement and confirm `principles.md`,
read alone, resolves it by citing a specific principle — quickstart.md step 1; trace each
principle back to `identity.md` — quickstart.md step 2.

### Implementation for User Story 1

- [X] T003 [P] [US1] Write the "Default over configure" principle in `principles.md`: a
  MUST-phrased statement favoring a sensible default over exposing a setting, tracing to the
  Effortless setup value (FR-001, FR-002, FR-003), with an example decision (e.g. choosing a
  fixed reminder lead time instead of a per-business configurable one) (FR-004)
- [X] T004 [P] [US1] Write the "Fail loud, never silent" principle in `principles.md`: a
  MUST-phrased statement that every booking-affecting action must visibly succeed or visibly
  fail, tracing to the Always-on reliability value, with an example decision (e.g. a failed
  reminder send must surface to the owner, not just be logged) (FR-001, FR-002, FR-003,
  FR-004)
- [X] T005 [P] [US1] Write the "Outcome first" principle in `principles.md`: a MUST-phrased
  statement that messages state the result before any explanation, tracing to the Respectful
  brevity value, with an example decision (e.g. a confirmation leads with "booked" before any
  detail) (FR-001, FR-002, FR-003, FR-004)
- [X] T006 [P] [US1] Write the "Scale to one, not to a thousand" principle in
  `principles.md`: a SHOULD-phrased statement that features are designed for the solo/
  near-solo operator first, tracing to the Local fit value and the Target Persona, with an
  example decision (e.g. rejecting a multi-staff permissions system until evidence shows it's
  needed) (FR-001, FR-002, FR-003, FR-004)
- [X] T007 [P] [US1] Write the "Calm under pressure" principle in `principles.md`: a
  MUST-phrased statement that error and edge-case states use the same even tone as success
  states, tracing to the Personality description, with an example decision (e.g. a
  double-booking conflict message states the conflict and next step, without alarmed
  language) (FR-001, FR-002, FR-003, FR-004)
- [X] T008 [US1] Add the tie-breaker note to `principles.md` per spec Edge Cases: when two
  principles point in different directions for the same decision, the tie is broken by
  whichever principle more directly serves `identity.md`'s purpose statement in that specific
  case (depends on T003-T007 existing so the note can reference them by name)

**Checkpoint**: User Story 1 fully delivers the principle set — independently testable per
quickstart.md steps 1, 2, 4, 5

---

## Phase 4: User Story 2 - A document ready to become this repo's constitution (Priority: P2)

**Goal**: Every principle in `principles.md` is confirmed copy-ready for a constitution
article list, with no rewording needed, and the document is confirmed as living only in this
repo.

**Independent Test**: Take each principle and confirm it reads as a governance rule, not a
description of intent — quickstart.md step 3.

### Implementation for User Story 2

- [X] T009 [P] [US2] Verify normative phrasing: re-read each principle in `principles.md`
  (T003-T007) and confirm each is a MUST/SHOULD statement that could be copied directly into
  a constitution article with no rewording — fix any principle that reads as descriptive
  rather than normative (depends on T003-T007)
- [X] T010 [P] [US2] Confirm `principles.md` requires no duplicate copy in `gridu-web` or
  `gridu-landing` (FR-007) — no file changes needed in either of those repos for this task to
  pass

**Checkpoint**: Both user stories complete — `principles.md` is ready for full validation

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Final validation against the spec before the epic's constitution checkpoint

- [X] T011 Run all five quickstart.md validation checks against the completed
  `principles.md` and fix any failing check directly in the document
- [X] T012 Re-run the `specs/02-define-design-principles/checklists/requirements.md`
  checklist against the final `principles.md` content (not just spec.md) to confirm FR-001
  through FR-007 and SC-001 through SC-003 are met

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies
- **Foundational (Phase 2)**: Depends on Setup — BLOCKS both user stories
- **User Story 1 (Phase 3)**: Depends on Foundational
- **User Story 2 (Phase 4)**: Depends on User Story 1 (T009 re-reads T003-T007's content)
- **Polish (Phase 5)**: Depends on User Story 2 complete

### Within User Story 1

- T003-T007 (the five principles) are independent content-wise and can be drafted in
  parallel — each derives from a distinct identity trace
- T008 (tie-breaker note) depends on T003-T007 existing, since it references them by name

### Parallel Opportunities

- T004, T005, T006, T007 can be drafted in parallel with each other and with T003
- T009 and T010 (US2) are independent checks and can run in parallel

---

## Parallel Example: User Story 1

```bash
# All five principles drafted in parallel (independent identity traces):
Task: "Write Default over configure principle"
Task: "Write Fail loud, never silent principle"
Task: "Write Outcome first principle"
Task: "Write Scale to one, not to a thousand principle"
Task: "Write Calm under pressure principle"

# Then, once all five exist:
Task: "Add tie-breaker note referencing all five principles"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1 — at this point Features 03-22 already have a usable
   principle set, even before US2's packaging verification runs
4. **STOP and VALIDATE**: run quickstart.md steps 1, 2, 4, 5 against `principles.md`

### Incremental Delivery

1. Setup + Foundational → candidate identity traces identified
2. User Story 1 → 5 principles + tie-breaker note → usable by Features 03-22 (MVP)
3. User Story 2 → constitution-readiness and single-location verification → fully validated

---

## Notes

- All tasks write to the same file (`principles.md`); "[P]" above marks tasks whose
  *content* has no dependency on each other, not tasks that can be edited simultaneously
  without conflict — apply them as separate, sequential edits in practice.
- Commit after each checkpoint (end of Phase 2, Phase 3, Phase 4), not after every task.
- This feature's tasks end at producing `principles.md`. Running `/speckit-constitution` to
  populate `.specify/memory/constitution.md` is the epic's next checkpoint, not a task here.
