# Quickstart: Validating the Card Component

Prerequisites: same Node/`yarn` setup used for Features 07-08 — no new tooling is introduced
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

Opens the Vite playground (`playground/index.html`), extended with a Card section alongside
the existing Button and Field grids. Use this to manually verify, in a real browser, before
calling the feature done:

- [ ] **SC-001 / User Story 1**: Render an `informational` Card with heading, body, and
  footer — surface uses `background`/`muted-surface`, border uses `border`, heading uses
  `heading-subsection`, body uses `body-default`, matching every other card on the page.
- [ ] **User Story 1 Acceptance Scenario 3**: Render Cards with a footer present and absent —
  confirm the footer is visually separated when present and no empty space is reserved when
  absent.
- [ ] **User Story 2 / FR-006**: Render an `interactive` Card, hover it (pointer state
  change), tab to it (visible `ring` focus indicator), and click/Enter-activate it.
- [ ] **User Story 2 Acceptance Scenario 3 / FR-007**: Render a `selected` interactive Card
  next to an unselected one — confirm the difference is visible by border weight, not color
  alone.
- [ ] **User Story 2 Acceptance Scenario 4**: Render an `informational` Card next to an
  `interactive` one — confirm only the interactive Card shows hover/focus/pressed affordance.
- [ ] **User Story 3 / SC-004**: With a screen reader, tab to an interactive Card and confirm
  its role, accessible name (from `heading`), and `selected` state (when set) are announced.
- [ ] **Layout — vertical vs. horizontal**: Render the same content as both
  `layout="vertical"` and `layout="horizontal"` — confirm `media` only appears in the
  horizontal layout and both layouts use the same padding/spacing scale.
- [ ] **Edge Cases — disabled + selected**: Render an interactive Card with both `disabled`
  and `selected` set — confirm disabled visual/interactive precedence (no hover/focus/click,
  not Tab-reachable).
- [ ] **Edge Cases — nested interactive element**: Render an interactive Card (`as="a"`)
  containing a nested `Button` in its footer — confirm the nested Button remains
  independently clickable and the Card's own navigation isn't triggered by clicking it.
- [ ] **Edge Cases — `clampBody`**: Render a Card with `clampBody` and deliberately long body
  text inside a fixed-height container — confirm it truncates to 3 lines with a visible
  ellipsis, never silently clips without the ellipsis indicator.

## Run automated checks

```sh
yarn typecheck   # tsc -b --noEmit
yarn test        # vitest run — card.test.tsx behavioral assertions (see contracts/card-api.md)
yarn lint        # eslint .
```

All three MUST pass before this feature is considered implemented, per this project's
standard "done" bar.

## Expected outcome

- `yarn build` produces a library bundle from `src/index.ts` additionally exporting `Card`
  alongside the existing `Button` and `Field`/`Input` exports.
- No file outside `gridu-design-system` changes as a result of this feature (migrating
  `gridu-web`'s existing card-like surfaces stays out of scope, per spec Assumptions).
