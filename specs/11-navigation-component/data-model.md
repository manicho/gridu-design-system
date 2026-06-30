# Data Model: Navigation Component

A component library has no persisted data; its "data model" is the public type contract
consumers code against. This document defines that contract, derived from spec.md's Key
Entities and Functional Requirements.

## NavItemProps

```ts
type CommonNavItemProps = {
  label: string;
  leadingIcon?: React.ReactNode;          // FR-001, FR-014 (resilient to a failed icon)
  active?: boolean;                       // default: false — FR-003, FR-004, research.md Decision 2
  disabled?: boolean;                     // default: false — FR-011, research.md Decision 3
  className?: string;
};

type AnchorNavItemProps = CommonNavItemProps & {
  as?: "a";                               // default
  href: string;
};

type ButtonNavItemProps = CommonNavItemProps & {
  as: "button";
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
};

type NavItemProps = AnchorNavItemProps | ButtonNavItemProps;
```

A destination is a definition the consumer supplies, not a state the component derives
(spec Key Entities). `as` discriminates the union the same way Card's
`InformationalCardProps`/`InteractiveCardProps` split does (Feature 09) — `href` is a
compile-time error when `as="button"`, and `onClick` is a compile-time error when `as="a"`
(or omitted, the default).

## ActiveState

No dedicated type — `active` is a plain `boolean` per destination (research.md Decision 2).
Per spec Key Entities ("Exactly one destination may be active at a time, or none"),
`Navigation` does not enforce this invariant at runtime; it is a contract on the consumer's
`destinations` array, verified in `navigation.test.tsx` by asserting only the
consumer-marked-active item renders `aria-current="page"`.

## NavigationProps

```ts
type NavigationLayout = "vertical" | "horizontal";

type NavigationProps = {
  label: string;                          // required — research.md Decision 6
  destinations: NavItemProps[];
  layout?: NavigationLayout;              // default: "vertical" — FR-002
  className?: string;
};
```

## Typography role mapping

FR-008 — every text usage resolves to a `typography-system.md` role, no new font size/weight
introduced:

| Region | Role | Notes |
|---|---|---|
| Destination label (rest/hover/focus) | `label` | Matches Button's label typography role |
| Destination label (active) | `label`, `text-foreground` | Same size/weight as rest; color shift only, paired with the non-color border indicator (FR-003) |

## Color role mapping

FR-007 — no new color value introduced:

| Element | Token role | Notes |
|---|---|---|
| Navigation surface | `background` | Default surface, matches Card/Table |
| Destination hover/pressed | `muted-surface` | Same role Button's `ghost` variant and Card's interactive hover use |
| Active destination indicator | `border`/`foreground` | Side (vertical) or bottom (horizontal) accent + text color — FR-003, research.md Decision 2 |
| Focus ring | `ring` | Same convention as Button/Input/Card/Table |
| Disabled destination | existing role at reduced opacity | Same `disabled:opacity-50` convention Button and Card already use, no new disabled-specific color |

## Relationships

- `layout` is the only axis-level setting; it does not change which destinations render or
  their individual state, only the container's flex direction and which edge the active
  indicator accent attaches to (research.md Decision 2).
- `active` and `disabled` are independent per destination but mutually exclusive in practice
  — an active destination represents "where the user is now," which is never also a
  plan-gated/unavailable destination; the component does not forbid setting both, but no
  documented use case combines them.
- `as` and the active/disabled states are independent — an active or disabled destination can
  render as either `<a>` or `<button>`, with `aria-current`/`aria-disabled` applied
  identically regardless of the underlying element (research.md Decision 3, Decision 4).
- An empty `destinations` array (FR-013) is a valid input — `Navigation` renders the `<nav>`
  landmark with no items, not a conditional `null`.
