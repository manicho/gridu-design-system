# Quickstart: Validating the Component-Level Accessibility Audit

## Prerequisites

- Repo dependencies installed (`yarn install` / `npm install` — whichever this repo's lockfile
  indicates).
- No new dependency is introduced by this feature (research.md Decision 1).

## 1. Automated checks (contrast, ARIA, keyboard-order)

```bash
npm run typecheck
npm run test
```

Expect: all existing component tests pass, plus any new a11y assertions added during the
audit (keyboard-traversal and `toHaveAccessibleName`/`toHaveAttribute` checks) also pass.

Contrast ratios themselves are not asserted by the test suite (jsdom doesn't render color) —
they're computed once via the audit's throwaway OKLCH→contrast-ratio script and recorded in
`findings.md` (research.md Decision 1). To re-derive a specific pairing's ratio, read the two
roles' OKLCH values from `tokens/tokens.css` and apply the WCAG relative-luminance formula
documented in `findings.md`'s methodology note.

## 2. Manual visual/keyboard check

```bash
npm run dev
```

Open the playground (Vite dev server URL printed in the terminal). For each of the six
component sections:

1. Click into the page, then press `Tab` repeatedly.
   - **Expect**: focus visits every interactive element in visual/logical order; a visible
     ring (the `ring` token color) appears around the focused element every time.
2. Where applicable, operate the component with keyboard only (e.g. activate a Button with
   `Enter`/`Space`, navigate Table's sortable header, follow a Navigation link).
   - **Expect**: every action reachable by mouse is also reachable by keyboard alone.
3. Toggle the OS/browser dark-mode preference (or the repo's `.dark` class if applied
   manually) and repeat step 1.
   - **Expect**: the same pass/fail outcome in both light and dark mode (tokens.css defines
     both).

## 3. Findings report

Read `findings.md` in this feature's directory: every one of the 6 components × 3 criteria
combinations should show `Pass` or `Fixed`; any `Deferred` row should have a clear reason.

## Expected outcome

- `npm run typecheck` and `npm run test` exit 0.
- Manual keyboard traversal in the playground confirms visible focus + full keyboard
  operability for all six components, light and dark mode.
- `findings.md` has zero unresolved (non-`Deferred`) violations.
