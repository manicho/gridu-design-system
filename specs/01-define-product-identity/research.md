# Research: Define Product Identity

No items in Technical Context are marked `NEEDS CLARIFICATION` — this feature has no
technology choice to make. The decisions below cover method and deliverable shape, made
explicit for planning.

## Decision: Deliverable format and structure

- **Decision**: Single Markdown file, `identity.md`, with four sections in this order:
  Purpose, Values, Personality, Target Persona.
- **Rationale**: This order moves from most abstract (why gridu exists) to most concrete
  (a specific persona), so each section can be justified by the one before it — values follow
  from purpose, personality expresses the values, and the persona is who all of it is for.
- **Alternatives considered**: Leading with the persona (audience-first) — rejected because
  purpose should not be derived from a single persona's wants; gridu's purpose should hold
  even if the primary persona's specifics shift later (per spec Edge Cases, a second persona
  may be added without rewriting purpose).

## Decision: Authoring method — from scratch, no reference to the existing brand document

- **Decision**: Author `identity.md` using only general product/market knowledge already
  established in this epic (gridu is a WhatsApp scheduling assistant for Chilean service
  businesses); do not open or consult `gridu-landing/docs/brand-guidelines.md` while writing.
- **Rationale**: Direct instruction from spec FR-006 and Assumptions — this is a deliberate
  reset, not an oversight. The prior document was produced outside this epic's process and
  is explicitly being superseded, not extended.
- **Alternatives considered**: Diffing against the old document afterward to check for
  unintentional overlap — rejected as unnecessary process overhead; coincidental similarity
  (e.g. both being warm/plain-spoken) is explicitly allowed by the spec's Assumptions and
  doesn't need to be tracked or justified.

## Decision: Scope boundary on personality (no voice/tone style guide)

- **Decision**: Personality is described as character traits (formality, reaction to
  mistakes, warmth) — not as a copywriting style guide (banned words, emoji rules, example
  phrases).
- **Rationale**: Matches spec Assumptions directly: a style guide is a distinct, larger
  deliverable that would belong to its own feature if the epic needs one. Keeping this
  feature's scope to character prevents it from silently growing into a full voice-and-tone
  document.
- **Alternatives considered**: Including a handful of example phrases to illustrate
  personality — rejected even as illustration, because the spec's reasonable-defaults
  guidance favors a hard scope fence over a partial style guide that invites scope creep.
