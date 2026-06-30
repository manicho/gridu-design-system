# Quickstart: Validating the Research Visual Direction deliverable

This feature has no runnable code. "Running" it means producing `visual-direction.md` and
checking it against the spec. Use this guide once `/speckit-implement` has produced the
document.

## Prerequisites

- The completed `specs/03-research-visual-direction/visual-direction.md`.
- `specs/01-define-product-identity/identity.md` (to verify traces against).
- `.specify/memory/constitution.md` (to verify principle-alignment notes against).

## Validation steps

1. **Distinctness check** — read all candidates and confirm each is described concretely
   enough to state a real difference from the others, without seeing any image or exact
   value. (Validates FR-001, FR-002, SC-001.)
2. **No-exact-values check** — confirm no candidate or the recommendation includes a hex
   code, typeface name/size, or spacing number. (Validates FR-003, SC-003.)
3. **No-visual-assets check** — confirm the document contains no image references, mockups,
   or color swatches. (Validates FR-007.)
4. **Identity-trace check** — for every candidate, open `identity.md` and confirm the cited
   value, trait, or purpose statement actually exists there. (Validates FR-005.)
5. **Principle-alignment check** — for every candidate, confirm all 5 constitutional
   principles are addressed (aligned or in tension, stated explicitly), not just for the
   recommended candidate. (Validates FR-004, User Story 2.)
6. **Recommendation-clarity check** — confirm the recommendation states a specific rationale
   for choosing over the other candidate(s), and that it appears near the top of the
   document per Principle III (Outcome First). (Validates FR-006, SC-002.)
7. **Owner-confirmation check** — confirm `confirmation_status` is not left as
   `Provisional` in the version handed off to Features 04-06; the project owner must have
   explicitly confirmed the recommendation first (per research.md's decision).

## Expected outcome

All seven checks pass, AND the owner has explicitly confirmed the recommendation → only then
is `visual-direction.md` ready as the single direction Features 04, 05, and 06 translate
into concrete color, typography, and token values.
