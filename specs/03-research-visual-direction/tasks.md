---

description: "Task list for Research Visual Direction"
---

# Tasks: Research Visual Direction

**Input**: Design documents from `/specs/03-research-visual-direction/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

**Tests**: Not requested — this feature's deliverable is a Markdown document, validated by
running `quickstart.md`'s checks against it (Phase N), not by automated tests.

**Organization**: Tasks are grouped by user story. The single deliverable is
`specs/03-research-visual-direction/visual-direction.md`, built up section by section per
story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different sections of the same file are NOT parallel-safe —
  see Parallel Opportunities below for what actually qualifies)
- **[Story]**: Which user story this task belongs to (US1, US2)

## Path Conventions

Single deliverable file: `specs/03-research-visual-direction/visual-direction.md`. Other
files read (not modified): `specs/01-define-product-identity/identity.md` (identity traces),
`.specify/memory/constitution.md` (principle checks).

---

## Phase 1: Setup

**Purpose**: Create the document skeleton with the Recommendation placed first, per
plan.md's Structure Decision (Principle III, Outcome First).

- [X] T001 Create `specs/03-research-visual-direction/visual-direction.md` with a
  `**Status**: Draft` line, a scope note (no exact colors/typefaces/spacing per FR-003; no
  visual assets per FR-007), a `## Recommendation` section placeholder near the top, and a
  `## Candidates` section to hold each candidate as a subsection

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Identify the distinct tensions in `identity.md` each candidate will push on,
per research.md's decision to derive candidates from identity.md rather than generic mood
boards.

**⚠️ CRITICAL**: Both user stories require this phase complete first

- [X] T002 Re-read `specs/01-define-product-identity/identity.md` and identify, as working
  notes (not yet in `visual-direction.md`), three distinct visual tensions worth exploring:
  (1) Personality + Respectful brevity pushed toward understated/functional, (2) Local fit +
  Target Persona pushed toward warm/human, (3) Effortless setup + Always-on reliability
  pushed toward crisp/minimal — this is the candidate pool Phase 3 drafts from

**Checkpoint**: Candidate tensions identified — User Story 1 can begin

---

## Phase 3: User Story 1 - A single direction for Features 04-06 to translate into tokens (Priority: P1) 🎯 MVP

**Goal**: `visual-direction.md` presents 3 distinct candidates and recommends exactly one,
giving Features 04-06 a single, character-level target.

**Independent Test**: Distinguish the 3 candidates using only their prose — quickstart.md
step 1; confirm the recommendation gives Feature 04 enough character guidance — quickstart
step 6.

### Implementation for User Story 1

- [X] T003 [P] [US1] Write the "Quiet Competence" candidate in `visual-direction.md` under
  `## Candidates`: mood (understated, functional, low visual noise), color tendency (muted/
  neutral with one quiet accent, low saturation), type character (plain, utilitarian, no
  decorative flourish), density (comfortable but efficient — not airy, not cramped), imagery
  (real screenshots of actual WhatsApp conversations, no illustration), identity trace
  (Personality + Respectful brevity) — no exact values (FR-001, FR-002, FR-003, FR-005)
- [X] T004 [P] [US1] Write the "Warm Local Trust" candidate in `visual-direction.md` under
  `## Candidates`: mood (warm, approachable, human), color tendency (warmer temperature,
  slightly higher accent saturation, avoids corporate-cold blue), type character (friendly/
  rounded without being playful or cute), density (comfortable with breathing room, signals
  "no rush, no clutter"), imagery (real people in their own workspaces — hairdresser,
  kinesiologist — warm light), identity trace (Local fit + Target Persona) — no exact values
  (FR-001, FR-002, FR-003, FR-005)
- [X] T005 [P] [US1] Write the "Effortless Minimal" candidate in `visual-direction.md` under
  `## Candidates`: mood (crisp, minimal, "it just works"), color tendency (cool-neutral, low
  saturation, high contrast for clarity), type character (clean, geometric, highly legible),
  density (airy/sparse, signals simplicity), imagery (abstract/iconographic, minimal
  photography), identity trace (Effortless setup + Always-on reliability) — no exact values
  (FR-001, FR-002, FR-003, FR-005)
- [X] T006 [US1] Write `## Recommendation` in `visual-direction.md`: choose one of the three
  candidates (T003-T005) and state the rationale tied to `identity.md`'s purpose statement,
  placed near the top of the document per the Outcome First structure decision (depends on
  T003-T005) (FR-006)

**Checkpoint**: User Story 1 fully delivers a single recommended direction — independently
testable per quickstart.md steps 1, 2, 6

---

## Phase 4: User Story 2 - A defensible choice, not an arbitrary aesthetic preference (Priority: P2)

**Goal**: Every candidate (including the two not recommended) has an explicit 5-principle
alignment check and a stated reason for rejection where applicable.

**Independent Test**: For a rejected candidate, find a specific reason tied to identity or a
constitutional principle — quickstart.md step 5.

### Implementation for User Story 2

- [X] T007 [US2] Add a principle-alignment note to each of the 3 candidates in
  `visual-direction.md` (T003-T005): for each of the constitution's 5 principles (Default
  Over Configure, Fail Loud Never Silent, Outcome First, Scale To One Not A Thousand, Calm
  Under Pressure), state explicitly whether the candidate aligns or creates tension, with
  reasoning — for all 3 candidates, not only the recommended one (depends on T003-T005)
  (FR-004)
- [X] T008 [US2] Add a one-line "why not chosen" reason to the two non-recommended
  candidates in `visual-direction.md`, synthesizing from their principle-alignment notes
  (T007) and identity traces why the Recommendation (T006) was chosen over them (depends on
  T006, T007)

**Checkpoint**: Both user stories complete — `visual-direction.md` is ready for full
validation and owner confirmation

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Final validation against the spec, then the owner-confirmation step this
feature uniquely requires (per data-model.md's Draft → Owner-Confirmed → Final state) before
the epic can proceed to Features 04-06.

- [X] T009 [P] Confirm `visual-direction.md` requires no duplicate copy in `gridu-web` or
  `gridu-landing` (FR-008) — no file changes needed in either of those repos for this task
  to pass
- [X] T010 Run quickstart.md validation checks 1-6 against the completed
  `visual-direction.md` and fix any failing check directly in the document
- [X] T011 Present the Recommendation (and the two alternatives with their rejection
  reasons) to the project owner for explicit confirmation — per quickstart.md step 7, this
  is a required human decision, not an automated check; on confirmation, update the
  document's `**Status**` line from `Draft` to `Owner-Confirmed`; do not mark it `Final`
  until the owner confirms or selects a different candidate
- [X] T012 Re-run the `specs/03-research-visual-direction/checklists/requirements.md`
  checklist against the final `visual-direction.md` content (not just spec.md) to confirm
  FR-001 through FR-008 and SC-001 through SC-003 are met, after owner confirmation (T011);
  update the `**Status**` line from `Owner-Confirmed` to `Final`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies
- **Foundational (Phase 2)**: Depends on Setup — BLOCKS both user stories
- **User Story 1 (Phase 3)**: Depends on Foundational
- **User Story 2 (Phase 4)**: Depends on User Story 1 (T007/T008 need T003-T006's content to
  check and to synthesize "why not chosen" against the actual Recommendation)
- **Polish (Phase 5)**: Depends on User Story 2 complete; T009 (single-location check) is
  independent of T010/T011/T012 and can run any time in this phase; T011 (owner confirmation)
  MUST happen before T012 (final checklist re-check)

### Within User Story 1

- T003, T004, T005 (the three candidates) are independent content-wise and can be drafted in
  parallel — each derives from a distinct identity tension
- T006 (Recommendation) depends on all three existing, since it chooses among them

### Parallel Opportunities

- T003, T004, T005 can be drafted in parallel with each other
- T007 (principle alignment for all 3 candidates) has no parallel split needed — it is one
  task covering all candidates, to keep the alignment reasoning consistent across them

---

## Parallel Example: User Story 1

```bash
# All three candidates drafted in parallel (independent identity tensions):
Task: "Write Quiet Competence candidate"
Task: "Write Warm Local Trust candidate"
Task: "Write Effortless Minimal candidate"

# Then, once all three exist:
Task: "Write Recommendation choosing one"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1 — at this point there is a recommended direction, though
   not yet defensible against the constitution (that's User Story 2) or owner-confirmed
4. **STOP and VALIDATE**: run quickstart.md steps 1, 2, 6 against `visual-direction.md`

### Incremental Delivery

1. Setup + Foundational → candidate tensions identified
2. User Story 1 → 3 candidates + recommendation → a direction exists (not yet defensible)
3. User Story 2 → principle alignment + rejection reasons → defensible
4. Polish → owner confirmation → only then is the direction usable by Features 04-06

---

## Notes

- All tasks write to the same file (`visual-direction.md`); "[P]" above marks tasks whose
  *content* has no dependency on each other, not tasks that can be edited simultaneously
  without conflict — apply them as separate, sequential edits in practice.
- Commit after each checkpoint (end of Phase 2, Phase 3, Phase 4), not after every task —
  and do not commit a "Final" status until T010's owner confirmation has actually happened.
- Unlike Features 00-02, this feature's "done" state requires a human decision (T010), not
  just passing automated-style checks.
