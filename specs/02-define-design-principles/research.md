# Research: Define Design Principles

No items in Technical Context are marked `NEEDS CLARIFICATION`. The decisions below cover
method and deliverable shape, made explicit for planning.

## Decision: One principle per identity trace, not a grid

- **Decision**: Each principle traces to one primary value or personality trait from
  `identity.md`, stated as a single line per principle, rather than building a full
  values-by-principles cross-reference matrix.
- **Rationale**: FR-002 only requires the trace to exist and be explicit, not an exhaustive
  mapping of every value to every principle. A lightweight one-line trace per principle is
  enough to satisfy SC-001/SC-002 without adding a second document structure.
- **Alternatives considered**: A matrix (values × principles, marking which principles touch
  which values) — rejected as over-structuring for 4-6 principles; useful at a much larger
  scale, not here.

## Decision: Principles drawn from identity.md's values and personality, not invented fresh

- **Decision**: Derive principle candidates by asking, for each of identity.md's four values
  (Effortless setup, Always-on reliability, Respectful brevity, Local fit) and its personality
  description, "what design/product tension does this value or trait resolve?" rather than
  brainstorming principles independently and retrofitting a trace afterward.
- **Rationale**: FR-006 (must not contradict identity.md) is much easier to satisfy by
  construction (deriving from identity.md) than to verify after the fact on independently
  invented principles.
- **Alternatives considered**: Brainstorm principles from general design-practice knowledge,
  then filter for identity alignment — rejected because it inverts the traceability
  requirement and risks producing principles that are defensible in isolation but not
  actually anchored to this product's specific identity.

## Decision: Constitution-readiness as a phrasing discipline, not a separate artifact

- **Decision**: Write each principle directly as a MUST/SHOULD statement during authoring
  (not as a descriptive paragraph later converted to normative form).
- **Rationale**: Matches FR-003 and User Story 2 directly — there is no value in drafting
  descriptively first and rephrasing later; it only risks losing the concrete example or
  identity trace in translation.
- **Alternatives considered**: Draft narratively first, add a normative "in short: MUST..."
  sentence per principle afterward — rejected as redundant; the example spec section
  (FR-004) already supplies the concrete grounding a narrative draft would have provided.
