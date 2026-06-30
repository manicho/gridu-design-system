# Implementation Plan: Define Design Principles

**Branch**: `develop` | **Date**: 2026-06-29 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/02-define-design-principles/spec.md`

## Summary

Produce a single Markdown document (`principles.md`) defining 4-6 named design principles,
each phrased as a normative MUST/SHOULD statement, each tracing to a specific value or
personality trait in `identity.md`, and each illustrated with a concrete example decision.
No visual design content. This document's content is what `/speckit-constitution` converts
into `.specify/memory/constitution.md` after this feature is marked Done — that conversion
is a separate, later step, not part of this feature's scope.

## Technical Context

**Language/Version**: N/A — deliverable is Markdown, not code

**Primary Dependencies**: N/A

**Storage**: N/A

**Testing**: N/A — validated against the spec's Success Criteria and requirements checklist
via manual review (see `quickstart.md`)

**Target Platform**: N/A

**Project Type**: Strategic/conceptual deliverable

**Performance Goals**: N/A

**Constraints**: Must not include any visual design decision (FR-005); must not contradict
`identity.md` (FR-006); every principle must be normatively phrased and identity-traced
(FR-002, FR-003) so it converts cleanly into a constitution article later

**Scale/Scope**: 4-6 design principles, each with one identity trace and one example decision

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

`.specify/memory/constitution.md` is still the unfilled template. This feature is what
*produces* the content that becomes the constitution (via `/speckit-constitution`, run after
this feature is Done) — so there is nothing yet to check this plan against. This gate
remains vacuously satisfied through this feature; it becomes load-bearing starting with
Feature 03.

## Project Structure

### Documentation (this feature)

```text
specs/02-define-design-principles/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md         # Phase 1 output
├── quickstart.md         # Phase 1 output
└── tasks.md              # Phase 2 output (/speckit-tasks — not yet created)
```

No `contracts/` directory: this feature exposes no API, CLI, or other external interface.

### Source Code (repository root)

This feature produces no source code. Its only deliverable is the principles document:

```text
specs/02-define-design-principles/
└── principles.md          # Phase 2/implementation output — the actual deliverable
```

**Structure Decision**: Same precedent as Features 00-01 — `principles.md` lives alongside
its spec. Unlike those features, this document has a defined next consumer outside this
feature's own scope: `/speckit-constitution` will read it (manually, by whoever runs that
command) to populate `.specify/memory/constitution.md`. That conversion step is intentionally
left out of this feature's tasks — it belongs to the epic's own checkpoint after Feature 02
is Done, not to this feature's definition of "done."

## Complexity Tracking

*No constitution violations to justify — no constitution exists yet (see Constitution Check).*
