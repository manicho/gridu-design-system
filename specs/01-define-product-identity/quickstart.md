# Quickstart: Validating the Define Product Identity deliverable

This feature has no runnable code. "Running" it means producing `identity.md` and checking
it against the spec. Use this guide once `/speckit-implement` has produced the document.

## Prerequisites

- The completed `specs/01-define-product-identity/identity.md`.

## Validation steps

1. **Self-containment check** — read `identity.md` without opening any other document
   (including gridu-landing's brand document) and confirm you can state gridu's purpose,
   values, personality, and primary persona using only this file. (Validates FR-006, SC-001.)
2. **No-visual-design check** — confirm the document contains no color values, typography
   choices, or component specifications. (Validates FR-005, SC-003.)
3. **Concreteness check** — for each brand value, confirm its "meaning" is a concrete
   practical description, not a restatement of the label. For the personality, confirm it
   includes at least one specific, distinguishing behavior (not just adjectives). (Validates
   FR-002, FR-003.)
4. **Persona singularity check** — confirm exactly one primary persona is defined, with
   identity, context, and needs all present. (Validates FR-004.)
5. **Usability-for-judgment check** — pick a hypothetical design decision (e.g. "should error
   messages sound apologetic or matter-of-fact?") and confirm `identity.md` gives enough to
   judge it one way or the other. (Validates SC-002.)
6. **No-old-document-overlap audit (optional, not required)** — if curious, compare against
   `gridu-landing/docs/brand-guidelines.md` only *after* `identity.md` is finalized, purely
   out of interest; this is not a pass/fail check (per spec Assumptions, coincidental overlap
   is fine and expected).

## Expected outcome

All five required checks (1-5) pass → `identity.md` is ready to be the foundation for
Feature 02 (Design Principles) and Feature 03 (Visual Direction). If any check fails, fix
`identity.md` directly — no rebuild step.
