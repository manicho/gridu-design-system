# Research: Research Visual Direction

No items in Technical Context are marked `NEEDS CLARIFICATION`. The decisions below cover
method and deliverable shape, made explicit for planning.

## Decision: Derive candidates from identity.md's tension points, not generic mood boards

- **Decision**: Generate each candidate by asking what a specific reading of `identity.md`
  (its purpose, one or more values, or its personality) would look like if pushed toward a
  particular visual character — not from generic "options" like "minimal" vs. "bold" picked
  from general design taste.
- **Rationale**: FR-005 requires every candidate to trace to identity.md. Starting from
  identity.md's content (rather than retrofitting a trace onto independently chosen moods)
  makes that traceability load-bearing instead of decorative — the same reasoning Feature 02
  used for deriving principles from identity.md rather than inventing them first.
- **Alternatives considered**: Start from common SaaS visual archetypes (e.g. "corporate
  blue," "playful gradient," "dark mode tech") and pick whichever fits best — rejected
  because it inverts the trace requirement and risks anchoring on aesthetic trends rather
  than gridu's specific identity.

## Decision: Evaluate every candidate against all 5 principles, not just the recommended one

- **Decision**: Run the constitution's 5-principle check (FR-004) against every candidate,
  including the ones not recommended, rather than only justifying the winner.
- **Rationale**: User Story 2 requires a rejected candidate's "why not" to be traceable to a
  specific reason. Checking only the winner would leave rejections looking arbitrary.
- **Alternatives considered**: Check all candidates informally, document the principle
  check only for the winner — rejected as it would fail SC-001/User Story 2's acceptance
  scenario (stating a specific reason for rejection).

## Decision: Recommendation is provisional pending explicit owner confirmation

- **Decision**: `visual-direction.md`'s implementation produces a recommendation, and the
  task sequence includes an explicit confirmation step with the project owner before the
  document is marked Final — mirroring spec Assumptions directly.
- **Rationale**: Visual direction is a subjective, highly visible, hard-to-reverse choice
  that will be customer-facing once the epic ships (gridu is launching publicly, pending
  Meta's WhatsApp Business approval) — exactly the category of decision this project's
  norm is to confirm explicitly rather than finalize autonomously, even though most other
  work in this repo doesn't need that ceremony.
- **Alternatives considered**: Finalize the recommendation autonomously and let a later
  feature revisit it if wrong — rejected because Features 04-06 would then build directly on
  top of an unconfirmed, possibly-wrong direction, compounding the cost of a bad guess.
