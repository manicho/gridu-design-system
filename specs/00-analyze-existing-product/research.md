# Research: Analyze Existing Product

No items in Technical Context are marked `NEEDS CLARIFICATION` — this feature has no
technology choice to make (its deliverable is a Markdown document, not running code).
The decisions below are about audit method and deliverable shape, carried over from the
spec's Assumptions section and made explicit for planning.

## Decision: Deliverable format

- **Decision**: Single Markdown file, `audit.md`, structured by surface first (gridu-web,
  then gridu-landing), then a cross-surface comparison section, then gaps.
- **Rationale**: Per-surface sections let each surface's findings stand on their own (FR-001
  through FR-004 require this), while a separate comparison section is what makes
  inconsistencies (FR-005) checkable without re-reading both surface sections side by side.
- **Alternatives considered**: One interleaved "color/typography/spacing/components" document
  comparing surfaces inline per category — rejected because it would force premature
  comparison before each surface's current state is fully and independently established,
  contradicting User Story 1's requirement that the baseline be accurate per surface first.

## Decision: Audit method

- **Decision**: Direct inspection of the two codebases (Tailwind/shadcn config, CSS, Astro
  components) — no stakeholder interviews, no design tool exports.
- **Rationale**: Matches the spec's Assumptions ("derived entirely from inspecting the
  existing codebases") and FR-008's requirement that every finding cite a real source file.
- **Alternatives considered**: Visual-only inspection (screenshots, browser DevTools computed
  styles) — rejected as the sole method because it can't satisfy FR-008's file-level citation
  requirement, though it remains a useful cross-check during implementation, not a substitute.

## Decision: Staleness handling

- **Decision**: The audit is a point-in-time snapshot dated at creation; it is not re-run or
  kept in sync automatically.
- **Rationale**: Matches spec Assumptions directly. Re-auditing is cheap (re-run this same
  feature) if the baseline goes stale before Features 01-06 conclude.
- **Alternatives considered**: A generated/scripted audit (e.g. a script that extracts
  Tailwind config values automatically) — rejected as overkill for a one-time baseline used
  by a handful of downstream features in a single epic; would also miss spacing/typography
  drift that only shows up in rendered output, not config.
