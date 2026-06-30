# Quickstart: Validating the Input Component

Prerequisites: same Node/`yarn` setup used for Feature 07 — no new tooling is introduced by
this feature.

## Setup

```sh
cd gridu-design-system
yarn install
```

## Run the local playground (visual verification)

```sh
yarn dev
```

Opens the Vite playground (`playground/index.html`), extended with a Field/Input section
alongside the existing Button grid. Use this to manually verify, in a real browser, before
calling the feature done:

- [ ] **SC-001 / User Story 1**: Render a labeled, empty field at rest — outline uses the
  `input` token, label uses the `label` typography role, matching every other field on the
  page.
- [ ] **User Story 1 Acceptance Scenario 2**: Click/tab into a field — outline switches to
  the `ring` focus indicator; the `input` token itself does not change.
- [ ] **User Story 1 Acceptance Scenario 3 / FR-009**: Render a `disabled` field — confirm it
  cannot be focused via Tab and is visually distinct from an enabled empty field.
- [ ] **User Story 2 / FR-005**: Trigger an error on a field — confirm the outline switches
  to `destructive`, the error text renders below the field in `destructive`, and toggle the
  value back to valid — confirm the error and outline clear.
- [ ] **User Story 2 Acceptance Scenario 2**: Render a field with both `helperText` and
  `error` set — confirm only the error renders, never both.
- [ ] **User Story 3 / SC-003**: Tab through a form built entirely from this component —
  every field shows a visible focus ring; clicking with a mouse does *not* show the same
  ring.
- [ ] **User Story 4**: Render a field with a leading icon, one with a trailing icon, and one
  with both — confirm no icon overlaps the input text at any defined size.
- [ ] **Edge Cases — long label/helper/error text**: Render a field with a deliberately long
  label, helper text, and error message — confirm each wraps onto multiple lines rather than
  truncating or overflowing.
- [ ] **Edge Cases — `readOnly`**: Render a `readOnly` field with a value — confirm it is
  focusable and the value is selectable, but typing has no effect, and it looks visually
  distinct from both the enabled and disabled states.
- [ ] **Edge Cases — autofill**: In a browser that supports autofill (e.g. Chrome with a
  saved credential), autofill an `email`/`password` pair — confirm the field's background and
  text color remain the `tokens.css` `background`/`foreground` roles, not the browser's
  default autofill color.

## Run automated checks

```sh
yarn typecheck   # tsc -b --noEmit
yarn test        # vitest run — field.test.tsx behavioral assertions (see contracts/field-api.md)
yarn lint        # eslint .
```

All three MUST pass before this feature is considered implemented, per this project's
standard "done" bar.

## Expected outcome

- `yarn build` produces a library bundle from `src/index.ts` additionally exporting `Field`,
  `Input`, `FieldLabel`, `FieldMessage` alongside the existing `Button` export.
- No file outside `gridu-design-system` changes as a result of this feature (migrating
  `gridu-web`'s/`gridu-landing`'s existing form fields stays out of scope, per spec
  Assumptions).
