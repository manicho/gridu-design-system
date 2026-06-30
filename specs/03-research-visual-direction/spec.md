# Feature Specification: Research Visual Direction

**Feature Branch**: `develop`

**Created**: 2026-06-29

**Status**: Draft

**Input**: User description: "Feature 03 — Research Visual Direction. Produce a Visual
Direction document: 2-3 distinct candidate visual directions described in words (mood,
color temperature/saturation tendency, typographic character, spacing/density character,
imagery character), each traced to identity.md and checked against the 5 ratified
constitutional principles, plus a recommendation for which direction to proceed with. No
exact hex values, typeface names/sizes, or spacing numbers — those are Features 04-06. No
visual assets produced — descriptions only."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - A single direction for Features 04-06 to translate into tokens (Priority: P1)

Whoever defines the Color System (Feature 04), Typography System (Feature 05), and Design
Tokens (Feature 06) needs one settled visual direction to translate into concrete values,
rather than each of those three features independently guessing at mood and character and
producing values that don't cohere with each other.

**Why this priority**: Without a single chosen direction, Features 04-06 have no shared
target — Feature 04 might pick warm, saturated colors while Feature 05 picks a cold,
clinical typeface, and the result wouldn't feel like one product. This feature's whole
purpose is preventing that.

**Independent Test**: Can be tested by reading the recommended direction and confirming a
reader can describe, in their own words, what the resulting visual character should feel
like (mood, color temperature, type character, density, imagery) without yet knowing any
exact color or typeface.

**Acceptance Scenarios**:

1. **Given** the Visual Direction document, **When** a reader is asked to distinguish the
   2-3 candidates from each other, **Then** they can describe a concrete difference between
   them using only the document's prose.
2. **Given** the recommended direction, **When** Feature 04 (Color System) needs to choose a
   palette, **Then** the recommendation gives enough character guidance (temperature,
   saturation tendency, mood) to constrain that choice without dictating exact values.

---

### User Story 2 - A defensible choice, not an arbitrary aesthetic preference (Priority: P2)

Whoever reviews or revisits this decision later needs to see *why* the recommended direction
was chosen — traced to `identity.md` and checked against the constitution's 5 principles —
rather than a direction picked on taste alone.

**Why this priority**: This is a packaging/rigor requirement on top of User Story 1's
content requirement. The recommendation could be aesthetically reasonable but still
undermine trust in the process if there's no visible reasoning connecting it back to who
gridu is and what it has already committed to (the constitution).

**Independent Test**: Can be tested by checking each candidate has an explicit identity
trace and an explicit note on how it aligns with (or creates tension with) each of the 5
constitutional principles, and that the final recommendation states why it was chosen over
the other candidate(s).

**Acceptance Scenarios**:

1. **Given** a rejected candidate, **When** a reader asks why it wasn't chosen, **Then** the
   document states a specific reason tied to identity or a constitutional principle.

---

### Edge Cases

- What happens if a candidate doesn't cleanly align with all 5 principles? → The document
  states the tension explicitly rather than glossing over it; a candidate can still be
  considered (or even recommended) with an acknowledged tension, but the tension must be
  visible, not hidden.
- What happens if the recommended direction turns out to be wrong once Features 04-06 are
  underway? → Out of scope for this feature to prevent; the next feature can revisit this
  document and propose a change, the same way a constitution amendment works.
- This recommendation is a subjective, product-defining creative choice — not something this
  feature can fully resolve unilaterally. See Assumptions for how the recommendation is
  finalized.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The document MUST present 2-3 distinct candidate visual directions.
- **FR-002**: Each candidate MUST describe, in prose: overall mood/character, color
  temperature and saturation tendency, typographic character, spacing/density character, and
  imagery character.
- **FR-003**: Each candidate MUST NOT include exact hex/color values, exact typeface names
  or sizes, or exact spacing scale numbers.
- **FR-004**: Each candidate MUST be checked against each of the 5 principles in
  `.specify/memory/constitution.md`, noting alignment or tension explicitly.
- **FR-005**: Each candidate MUST trace to a specific value, personality trait, or the
  purpose statement in `identity.md`.
- **FR-006**: The document MUST recommend exactly one candidate to proceed with, stating the
  rationale for choosing it over the others.
- **FR-007**: The document MUST NOT include or reference actual visual assets (images,
  mockups, color swatches) — descriptions only.
- **FR-008**: The document MUST live in `gridu-design-system` (this repo), not duplicated
  into `gridu-web` or `gridu-landing`.

### Key Entities

- **Visual Direction Candidate**: A named, described visual direction with mood/color/type/
  spacing/imagery character, an identity trace, and a principle-alignment note.
- **Principle Alignment Note**: A statement of how a candidate aligns with, or creates
  tension with, one of the constitution's 5 principles.
- **Recommendation**: The single chosen candidate plus the rationale for choosing it.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A reader can describe a concrete difference between each candidate using only
  the document's prose, without seeing any image or exact value.
- **SC-002**: Features 04, 05, and 06 can each start from the recommended direction without
  needing to re-derive mood, temperature, or character decisions already settled here.
- **SC-003**: No candidate or the recommendation requires an exact color, typeface, or
  spacing value to be understood or evaluated.

## Assumptions

- This feature produces a recommendation, not a final, unappealable decision — because
  visual direction is a subjective, product-defining creative choice, the person running
  `/speckit-implement` for this feature should confirm the final pick with the project owner
  (e.g. via an explicit choice prompt) rather than silently finalizing it, even though
  `gridu` is otherwise a solo-operator, low-ceremony product where most decisions don't need
  this level of ceremony — a visual identity decision is exactly the kind of irreversible,
  broadly visible choice worth a deliberate confirmation rather than autonomous finalization.
- 2-3 candidates is sufficient breadth to show real contrast without overwhelming the
  decision; a 4th candidate is not required even if more are conceivable.
- "Imagery character" means the general feeling/style imagery should have (e.g. "real,
  unstaged conversation screenshots" vs. "abstract geometric illustration"), not actual
  sourced images or an illustration style guide — that level of detail is out of scope here.
