# Implementation Plan: Research Visual Direction

**Branch**: `develop` | **Date**: 2026-06-29 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/03-research-visual-direction/spec.md`

## Summary

Produce a single Markdown document (`visual-direction.md`) presenting 2-3 candidate visual
directions described in prose (mood, color temperature/saturation tendency, typographic
character, spacing/density character, imagery character), each traced to `identity.md` and
checked against the constitution's 5 principles, plus one recommended direction with
rationale. No exact colors, typefaces, or spacing values — those are Features 04-06. The
final pick is a recommendation pending the project owner's explicit confirmation (per spec
Assumptions), not an autonomously finalized decision.

## Technical Context

**Language/Version**: N/A — deliverable is Markdown, not code

**Primary Dependencies**: N/A

**Storage**: N/A

**Testing**: N/A — validated against the spec's Success Criteria and requirements checklist
via manual review (see `quickstart.md`)

**Target Platform**: N/A

**Project Type**: Strategic/conceptual deliverable

**Performance Goals**: N/A

**Constraints**: Must not include exact colors/typefaces/spacing values (FR-003); must not
include or reference actual visual assets (FR-007); every candidate must be checked against
all 5 constitutional principles (FR-004) and traced to `identity.md` (FR-005)

**Scale/Scope**: 2-3 visual direction candidates, each with 5 character dimensions, a
5-principle alignment check, and one final recommendation

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

This is the first feature where `.specify/memory/constitution.md` v1.0.0 is ratified and
load-bearing. Checking this feature's *planning approach* (not yet its content, which is
produced during implementation and checked again per-candidate via FR-004) against each
principle:

| Principle | Check | Result |
|---|---|---|
| I. Default Over Configure | The deliverable itself ends in one recommended default direction, not a menu left open for Features 04-06 to each independently choose from. | PASS |
| II. Fail Loud, Never Silent | FR-004 requires tensions between a candidate and a principle to be stated explicitly, not glossed over — the documentation-equivalent of failing loud rather than silently picking a flawed candidate. | PASS |
| III. Outcome First | The recommendation (the outcome) must be easy to find, not buried after lengthy candidate analysis — addressed in Structure Decision below. | PASS (addressed in structure) |
| IV. Scale To One, Not A Thousand | Not directly applicable to this feature's planning approach (no multi-user system involved); content-level fit is checked per-candidate via FR-004, not here. | N/A at plan level |
| V. Calm Under Pressure | Not directly applicable to this feature's planning approach; relevant to tone of *output copy* in later features, not this research document's own tone. | N/A at plan level |

No violations. No Complexity Tracking entries needed.

## Project Structure

### Documentation (this feature)

```text
specs/03-research-visual-direction/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md         # Phase 1 output
├── quickstart.md         # Phase 1 output
└── tasks.md              # Phase 2 output (/speckit-tasks — not yet created)
```

No `contracts/` directory: this feature exposes no API, CLI, or other external interface.

### Source Code (repository root)

This feature produces no source code. Its only deliverable is the visual direction document:

```text
specs/03-research-visual-direction/
└── visual-direction.md    # Phase 2/implementation output — the actual deliverable
```

**Structure Decision**: Same precedent as Features 00-02 — `visual-direction.md` lives
alongside its spec. To satisfy Principle III (Outcome First) at the document level, the
Recommendation is placed at the *top* of the document (immediately after the scope note),
before the candidate-by-candidate detail — a reader gets the outcome first, with supporting
detail available below for whoever wants to verify the reasoning.

## Complexity Tracking

*No constitution violations to justify — Constitution Check above passed cleanly.*
