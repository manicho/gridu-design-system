# Quickstart: Validating the Color System deliverable

This feature has no runnable code. "Running" it means producing `color-system.md` and
checking it against the spec. Use this guide once `/speckit-implement` has produced the
document.

## Prerequisites

- The completed `specs/04-define-color-system/color-system.md`
- `specs/03-research-visual-direction/visual-direction.md` (for character-trace checks)
- `.specify/memory/constitution.md` (for Principle II exception check)
- A contrast-ratio calculator (any WCAG 2.1 AA tool works; OKLCH → sRGB conversion is
  needed for the ratio check, calculators like oklch.com or colorjs.io handle this)

## Validation Steps

1. **Role completeness check** — confirm `color-system.md` contains exactly the 15 roles
   defined in `data-model.md` (9 base + 6 status), each with a purpose statement, light
   value, dark value, character note, and accessibility note. No role listed in
   `data-model.md` may be absent; no role not in `data-model.md` may appear without a
   documented rationale. (Validates FR-001.)

2. **Single-token-per-role check** — for every UI use case listed in the purpose column,
   confirm exactly one role covers it. Specifically verify that no two roles have
   overlapping purposes (e.g., `muted-surface` and `background` must serve demonstrably
   different UI elements). (Validates FR-002.)

3. **Character-trace check** — for every role, open `visual-direction.md` and confirm the
   character note references a specific passage or characteristic from the Quiet Competence
   candidate (or directly from `identity.md`). A note that says only "fits the direction"
   without a specific trace fails this check. (Validates FR-003.)

4. **Destructive exception check** — confirm the `destructive` role's `exception_note`
   explicitly states it is the designed high-contrast exception; confirm its OKLCH chroma
   value is observably higher than every non-status base role; confirm this is stated in
   the document, not assumed by the reader. (Validates FR-004.)

5. **WCAG AA contrast check** — for every role that serves as a text color on a paired
   background role, verify the contrast ratio meets WCAG 2.1 AA (≥ 4.5:1 for normal
   text, ≥ 3:1 for large/bold text) in both light and dark modes. At minimum, check these
   pairings:
   - `foreground` on `background` (primary body text)
   - `muted-foreground` on `background` (secondary text)
   - `muted-foreground` on `muted-surface` (text on card/secondary surfaces)
   - `primary-foreground` on `primary`
   - Text on `destructive` (if destructive is used as a background)
   - Text on `warning` (if warning is used as a background)
   - Text on `success` (if success is used as a background)
   - `brand` on `background` (links, interactive elements in body text)
   (Validates FR-005.)

6. **Dark mode mechanism check** — confirm `color-system.md` contains exactly one
   statement declaring the dark-mode activation mechanism (`.dark` CSS class), and that it
   is clear which surfaces this applies to (both gridu-web and gridu-landing). (Validates
   FR-006.)

7. **OKLCH check** — confirm every `light_value` and `dark_value` in the document is
   expressed in OKLCH notation (`oklch(L C H)`). No hex codes, rgb(), hsl(), or other
   color notations may appear as token values. (Validates FR-007.)

8. **Single-source check** — confirm no new color definition or alternative token value
   was added to `gridu-web/src/index.css`, `gridu-landing/src/styles/global.css`, or any
   other file outside `gridu-design-system/specs/04-define-color-system/` as a result of
   implementing this feature. (Validates FR-008.)

## Expected Outcome

All 8 checks pass → `color-system.md` is ready as the authoritative color reference for
Features 05 (Typography System), 06 (Design Tokens), and 07-12 (Components).
