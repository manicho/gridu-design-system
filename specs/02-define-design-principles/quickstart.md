# Quickstart: Validating the Define Design Principles deliverable

This feature has no runnable code. "Running" it means producing `principles.md` and checking
it against the spec. Use this guide once `/speckit-implement` has produced the document.

## Prerequisites

- The completed `specs/02-define-design-principles/principles.md`.
- `specs/01-define-product-identity/identity.md` (to verify traces against).

## Validation steps

1. **Disagreement-resolution check** — pick a hypothetical design disagreement (e.g. "should
   a failed booking attempt show a generic error or a specific one?") and confirm
   `principles.md`, read alone, gives enough to resolve it by citing a specific principle.
   (Validates FR-001, FR-004, SC-001.)
2. **Identity-trace check** — for every principle, open `identity.md` and confirm the cited
   value or personality trait actually exists there with matching wording. (Validates
   FR-002, FR-006.)
3. **Normative-phrasing check** — for every principle, confirm it reads as a MUST/SHOULD
   governance rule, not a description of intent — i.e. it could be copied directly into a
   constitution article with no rewording. (Validates FR-003, SC-002.)
4. **No-visual-design check** — confirm the document contains no color values, typography
   choices, or component specifications. (Validates FR-005, SC-003.)
5. **Count check** — confirm 4-6 principles are present, and that none of them are a split
   of a single idea padding the count (per spec Assumptions).

## Expected outcome

All five checks pass → `principles.md` is ready for the epic's next checkpoint: running
`/speckit-constitution` to encode these principles into `.specify/memory/constitution.md`,
binding Features 03-22 to them. That conversion step itself is outside this feature's scope
— it happens after this feature is marked Done.
