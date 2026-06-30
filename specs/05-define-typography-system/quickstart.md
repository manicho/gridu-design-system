# Quickstart: Validating the Typography System deliverable

This feature has no runnable code. "Running" it means producing `typography-system.md` and
checking it against the spec. Use this guide once `/speckit-implement` has produced the
document.

## Prerequisites

- The completed `specs/05-define-typography-system/typography-system.md`
- `specs/03-research-visual-direction/visual-direction.md` (for character-trace checks)
- `specs/04-define-color-system/color-system.md` (for role-pairing checks, e.g.
  `body-secondary` ↔ `muted-foreground`)
- `.specify/memory/constitution.md` (for Principle I and VI alignment checks)
- `specs/00-analyze-existing-product/audit.md` (for typeface continuity and existing
  `tracking-tight` / `tabular-nums` precedent checks)

## Validation Steps

1. **Role completeness check** — confirm `typography-system.md` contains exactly the 8
   roles defined in `data-model.md`, each with family, weight, size, line-height,
   letter-spacing, character note, and overflow behavior. No role listed in `data-model.md`
   may be absent; no role not in `data-model.md` may appear without a documented rationale.
   (Validates FR-001.)

2. **Single-value-set-per-role check** — for every text use case, confirm exactly one role
   covers it. Specifically verify `body-secondary` and `label` (both 14px) are
   distinguishable in practice by weight (400 vs. 500), not interchangeable. (Validates
   FR-002.)

3. **Character-trace check** — for every role, open `visual-direction.md` and confirm the
   character note references a specific passage or characteristic from the Quiet Competence
   candidate (or directly from `identity.md`). A note that says only "fits the direction"
   without a specific trace fails this check. (Validates FR-003.)

4. **Typeface single-source check** — confirm `typography-system.md` declares exactly one
   typeface (`Inter`) with one fallback stack, and that this is the only typeface
   declaration relevant to gridu-web and gridu-landing going forward. (Validates FR-004.)

5. **Minimum-size floor check** — for every role, confirm the declared size is ≥ 12px
   (0.75rem) equivalent, and that `body-default` specifically is ≥ 14px (0.875rem)
   equivalent. (Validates FR-005.)

6. **Weight-as-hierarchy check** — confirm no role's character note or purpose description
   relies on color to establish hierarchy; confirm heading roles use distinct weight/size
   combinations from body and label roles. (Validates FR-006.)

7. **Tabular-figure check** — confirm the `numeric-tabular` role specifies
   `font-variant-numeric: tabular-nums lining-nums` (or equivalent), and that this is stated
   as a feature applied within the existing Inter typeface, not a second font family.
   (Validates FR-007.)

8. **Overflow-default check** — confirm `body-default`, `body-secondary`, and `caption` are
   documented as wrap-by-default (no silent truncation), and that `label` is the only role
   permitted optional truncation, explicitly scoped to component-author opt-in. (Validates
   FR-008.)

9. **Single-source check** — confirm no new type-scale definition or alternative value set
   was added to `gridu-web/src/index.css`, `gridu-landing/src/styles/global.css`, or any
   other file outside `gridu-design-system/specs/05-define-typography-system/` as a result of
   implementing this feature. (Validates FR-009.)

## Expected Outcome

All 9 checks pass → `typography-system.md` is ready as the authoritative typography
reference for Feature 06 (Design Tokens) and Features 07-21 (components, dashboard,
landing).
