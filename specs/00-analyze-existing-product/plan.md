# Implementation Plan: Analyze Existing Product

**Branch**: `develop` | **Date**: 2026-06-29 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/00-analyze-existing-product/spec.md`

## Summary

Produce a single Markdown audit document (`audit.md`) describing the *current* visual state
of gridu-web and gridu-landing — colors, typography, spacing, component inventory — with
every finding traced to a source file/config, followed by an explicit list of cross-surface
inconsistencies and gaps relative to having a real design system. No new design decisions; no
code changes. This is a research/documentation deliverable, not a software feature.

## Technical Context

**Language/Version**: N/A — deliverable is Markdown, not code

**Primary Dependencies**: N/A

**Storage**: N/A

**Testing**: N/A — validated against the spec's Success Criteria and the requirements
checklist, by manual review (see `quickstart.md`)

**Target Platform**: N/A

**Project Type**: Research/documentation deliverable

**Performance Goals**: N/A

**Constraints**: Every finding (FR-008) must cite a real, currently-existing file or config
path in `gridu-web` or `gridu-landing` — no finding may be asserted without a source

**Scale/Scope**: Two surfaces (`gridu-web`, `gridu-landing`); four finding categories (color,
typography, spacing, components) per surface, plus a cross-surface comparison

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

`.specify/memory/constitution.md` is still the unfilled template — this repo's constitution
will be ratified after Feature 02 (Define Design Principles) is implemented. No principles
exist yet to check against, so this gate is vacuously satisfied. Re-run this check for every
later feature once the constitution is ratified.

## Project Structure

### Documentation (this feature)

```text
specs/00-analyze-existing-product/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md         # Phase 1 output
├── quickstart.md         # Phase 1 output
└── tasks.md              # Phase 2 output (/speckit-tasks — not yet created)
```

No `contracts/` directory: this feature exposes no API, CLI, or other external interface —
it is purely an internal documentation deliverable.

### Source Code (repository root)

This feature produces no source code. Its only deliverable is the audit document itself:

```text
specs/00-analyze-existing-product/
└── audit.md              # Phase 2/implementation output — the actual audit deliverable
```

**Structure Decision**: The audit lives alongside its spec (`audit.md` in this feature's own
directory) rather than under a repo-root `docs/` folder, because it is a point-in-time,
feature-scoped artifact (per spec Assumptions) rather than living project documentation. If a
later feature needs a stable, permanent home for it (e.g. linked from the design system's
README), that's a follow-up decision for whoever consumes it — not this feature's concern.

## Complexity Tracking

*No constitution violations to justify — no constitution exists yet (see Constitution Check).*
