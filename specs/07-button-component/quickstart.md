# Quickstart: Validating the Button Component

Prerequisites: Node matching `gridu-web`'s engine (no `.nvmrc` pinned here yet — use the
Node version active for the other two repos), `yarn` installed.

## Setup

```sh
cd gridu-design-system
yarn install
```

## Run the local playground (visual verification)

```sh
yarn dev
```

Opens the Vite playground (`playground/index.html`), which imports `tokens/tokens.css` and
renders every variant × size × state permutation. Use this to manually verify, in a real
browser, before calling the feature done:

- [ ] **SC-001 / User Story 1**: The 5 variants read in a clear emphasis order at a glance —
  primary heaviest, then secondary, then outline, then ghost, with destructive visually
  distinct from all of them.
- [ ] **SC-002**: Toggle the playground's light/dark switch (or OS preference) — every
  variant's text remains legible against its fill/border in both modes.
- [ ] **User Story 2 / SC-004**: Tab through the playground's button grid — every button
  shows a visible focus ring; clicking with a mouse does *not* show the same ring.
- [ ] **FR-008**: Toggle a button's `loading` state — content swaps to a spinner, the button
  cannot be clicked again, and it looks visually distinct from a `disabled` button next to
  it.
- [ ] **User Story 3 / SC-003**: Render an icon-only button at each size — confirm it stays
  square and never shrinks below the minimum target size.
- [ ] **FR-014**: Render a button with deliberately long text in a narrow container — confirm
  it truncates with an ellipsis rather than wrapping or overflowing.

## Run automated checks

```sh
yarn typecheck   # tsc -b --noEmit — confirms the icon-only/aria-label discriminated union
                  # rejects a missing aria-label at compile time (FR-010)
yarn test        # vitest run — button.test.tsx behavioral assertions (see contracts/button-api.md)
yarn lint        # eslint .
```

All three MUST pass before this feature is considered implemented, per this project's
standard "done" bar.

## Expected outcome

- `yarn build` produces a library bundle from `src/index.ts` exporting `Button`,
  `ButtonProps`, `ButtonVariant`, `ButtonSize` — confirms the package is structurally ready
  for the Phase 1 checkpoint's later "install as a dependency" step, without that step
  happening in this feature (FR-013).
- No file outside `gridu-design-system` changes as a result of this feature.
