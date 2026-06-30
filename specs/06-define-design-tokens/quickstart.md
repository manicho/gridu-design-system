# Quickstart: Validating the Design Tokens deliverable

This feature ships real, rendered changes across three repos. Validation has two parts:
(1) static checks against the token files, runnable without a browser; (2) visual checks
that require running each surface locally. Use this guide once `/speckit-implement` has
produced the changes.

## Prerequisites

- The completed `gridu-design-system/tokens/tokens.css`
- `specs/04-define-color-system/color-system.md` and `specs/05-define-typography-system/typography-system.md`
  (for value comparison)
- `gridu-web` running locally (`yarn dev`) and `gridu-landing` running locally (`yarn dev`)
- A browser with devtools (for computed-style inspection) and the ability to toggle
  `prefers-color-scheme` and clear `localStorage`

## Static Validation Steps

1. **Canonical completeness check** — confirm `tokens.css` contains all 15 color roles
   (light + dark) and all 8 typography roles, with values copied verbatim from
   `color-system.md` and `typography-system.md`. (Validates FR-001.)

2. **gridu-web color match check** — diff every color role's light/dark value in
   `gridu-web/src/index.css` against `tokens.css`; confirm zero discrepancies for any of the
   15 canonical roles. (Validates FR-002, SC-001.)

3. **gridu-web alias check** — confirm `gridu-web/src/index.css` still defines `card`,
   `card-foreground`, `popover`, `popover-foreground`, `secondary`, `secondary-foreground`,
   `accent`, `accent-foreground`, `destructive-foreground`, and all 8 `sidebar*` tokens, and
   that each now points at (or equals the value of) the canonical role named in
   `data-model.md`'s Token Alias table — not its pre-refresh value. (Validates Decision 2/3
   of research.md.)

4. **gridu-web typography availability check** — confirm `gridu-web/src/index.css` defines
   `--text-*`/`--tracking-*` theme entries for all 7 sized roles and a `.numeric-tabular`
   utility, and that `@layer base` rules map `h1`/`h2`/`h3`/`body`/`label`/`small` to the
   correct roles. (Validates FR-003.)

5. **gridu-landing color/typography match check** — repeat checks 2 and 4 against
   `gridu-landing/src/styles/global.css`; confirm every shared role (excluding the
   `gridu-web`-only sidebar group) is byte-identical to `gridu-web`'s implementation.
   (Validates FR-004, FR-005, SC-001.)

6. **gridu-landing `.dark` mechanism check** — confirm `gridu-landing/src/styles/global.css`
   has a `.dark { ... }` class block matching `gridu-web`'s structure, **and** still
   contains the `@media (prefers-color-scheme: dark)` block (now gated `:not(.light)`) as a
   no-JS fallback — it must be added alongside, not removed. (Validates FR-006; confirms the
   `/speckit-analyze` finding I1 fix is in place.)

7. **No-component-file-edit check** — confirm no `.tsx` file under `gridu-web/src/components/
   ui/` or `gridu-web/src/features/` and no pre-existing `.astro`/`.tsx` file under
   `gridu-landing/src/components/` (other than the single wiring addition in `Header.astro`)
   was modified as part of this feature — i.e., `git diff --stat` for both repos shows
   changes confined to `index.css`/`global.css`, the new `theme-script.ts`, the new
   `ThemeToggle.tsx`, a single wiring line in `Header.astro`, and the new `theme` entry in
   `gridu-landing/src/i18n/es-CL.ts` (required by the project's i18n convention for the new
   toggle's accessible label — new theme-toggle infrastructure, not a change to any
   pre-existing component, per FR-006; found necessary during implementation). (Validates
   FR-008.)

8. **No new spacing/radius tokens check** — confirm no `--radius-*`, `--spacing-*`, or
   similar new scale was introduced in either surface's token file. (Validates FR-009.)

## Visual Validation Steps (requires running both apps)

9. **gridu-web light/dark render check** — load `gridu-web` locally; confirm background,
   text, brand accent, and status colors match `color-system.md`'s light values; toggle to
   dark mode and confirm the dark values. (Validates User Story 2, SC-002.)

10. **gridu-web typography availability check (compiled CSS, not rendered markup)** —
    inspect `gridu-web`'s compiled stylesheet (devtools or build output) and confirm
    `--text-{role}`/`--text-{role}--line-height`/`--tracking-{role}` theme custom properties
    exist with the correct values, for all 8 roles, and that the `@layer base` `h1`/`h2`/`h3`/
    `body,p`/`label`/`small` rules reference them. A standalone `text-{role}` utility class
    will not appear in compiled output until some component actually uses that class name —
    Tailwind v4's JIT only emits classes it sees referenced in source — so its absence today is
    expected, not a defect. Do **not** expect any of this to change the rendered size of
    existing headings, body text, or labels — every one of them already carries an explicit
    Tailwind size utility (e.g. `text-4xl`), and `@layer utilities` always wins over the new
    `@layer base` role defaults regardless of specificity (see spec.md's typography Edge Case).
    Migrating existing markup onto the new classes is Features 07-12 territory. (Validates User
    Story 2, SC-002's typography clause.)

11. **gridu-landing light/dark color render check** — repeat check 9 on `gridu-landing` (color
    only — see check 10 for why typography is verified via compiled CSS, not rendered
    markup). (Validates User Story 2, SC-002's color clause.)

12. **gridu-landing toggle check** — on `gridu-landing`, manually switch to dark mode,
    reload the page, and confirm it remains in dark mode (no flash of light mode before
    settling). Clear `localStorage` and confirm the page falls back to following the OS
    preference. (Validates User Story 3, SC-003, SC-004.)

13. **Cross-surface diff check** — with both apps open side by side in the same mode
    (light or dark), confirm a shared visual concept (e.g. a card surface, a primary
    button, body text) renders with the identical color and typography on both surfaces.
    (Validates SC-001.)

14. **No-JavaScript fallback check** — disable JavaScript entirely in the browser (not just
    clear `localStorage`) and load `gridu-landing` with the OS set to dark, then to light.
    Confirm the page renders the correct theme in both cases purely from the `@media`
    fallback (check 6), with no toggle control needing to function and no broken/unstyled
    page. This is distinct from check 12, which clears `localStorage` but still relies on
    JavaScript running. (Validates the spec.md Edge Case "What happens on `gridu-landing` if
    a visitor has JavaScript disabled?"; confirms `/speckit-analyze` finding I1 is resolved,
    not just structurally present.)

## Expected Outcome

All 14 checks pass → both `gridu-web` and `gridu-landing` render the ratified Quiet
Competence color and typography systems identically, `gridu-landing` has dark-mode parity
with `gridu-web` when JavaScript is available and preserves its original zero-JS
OS-preference behavior when it isn't, and the canonical source in
`gridu-design-system/tokens/tokens.css` remains the single point of truth for the next
features (07-12, components) to build on.
