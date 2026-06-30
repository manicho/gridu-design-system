# Quickstart: Validating the Navigation Component

Prerequisites: same Node/`yarn` setup used for Features 07-10 — no new tooling is introduced
by this feature.

## Setup

```sh
cd gridu-design-system
yarn install
```

## Run the local playground (visual verification)

```sh
yarn dev
```

Opens the Vite playground (`playground/index.html`), extended with a Navigation section
alongside the existing Button, Field, Card, and Table grids. Use this to manually verify, in
a real browser, before calling the feature done:

- [ ] **SC-001 / User Story 1**: Render a vertical Navigation with several destinations and
  one marked `active` — confirm the active destination is visually distinguished by both a
  `border`-token side accent and a text color shift (FR-003), not color alone.
- [ ] **User Story 1 Acceptance Scenario 2**: Tab through the destinations — confirm each
  shows the `ring`-token focus indicator only on keyboard focus, and hover/pressed states are
  visible on pointer interaction.
- [ ] **User Story 2 / FR-011**: Render a Navigation with one `disabled` destination — confirm
  Tab skips it, clicking/Enter does nothing, and it remains visible (not hidden or removed).
- [ ] **User Story 3 / FR-002**: Render the same destination list with `layout="horizontal"`
  — confirm active/hover/focus/disabled states behave identically to the vertical layout,
  differing only in axis and which edge carries the active accent.
- [ ] **Edge Cases — truncation (FR-012)**: Render a destination with a deliberately long
  label in a narrow sidebar — confirm it truncates with an ellipsis and the full label appears
  in a native tooltip on hover.
- [ ] **Edge Cases — empty list (FR-013)**: Render `destinations={[]}` — confirm the `<nav>`
  landmark still renders with no items and the surrounding layout doesn't shift.
- [ ] **Edge Cases — missing icon (FR-014)**: Render a destination whose `leadingIcon` fails
  to resolve (e.g. `null`) — confirm the label still renders and the destination is still
  focusable/activatable.
- [ ] **SC-004**: With a screen reader, navigate by landmark — confirm the Navigation
  announces as a navigation region with the supplied `label`, and tabbing through it announces
  each destination's full label, the active one as the current page, and the disabled one as
  unavailable.

## Run automated checks

```sh
yarn typecheck   # tsc -b --noEmit
yarn test        # vitest run — navigation.test.tsx behavioral assertions (see contracts/navigation-api.md)
yarn lint        # eslint .
```

All three MUST pass before this feature is considered implemented, per this project's
standard "done" bar.

## Expected outcome

- `yarn build` produces a library bundle from `src/index.ts` additionally exporting
  `Navigation` alongside the existing `Button`, `Field`/`Input`, `Card`, and `Table` exports.
- No file outside `gridu-design-system` changes as a result of this feature (migrating
  `gridu-web`'s existing sidebar or `gridu-landing`'s existing header stays out of scope, per
  spec Assumptions).
