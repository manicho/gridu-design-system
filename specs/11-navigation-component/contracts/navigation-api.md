# Contract: Navigation Public API

This is the public interface `gridu-design-system` exposes for the Navigation component. Any
change to these exports that breaks an existing consumer call site is a breaking change to
this contract (relevant once the Phase 1 checkpoint makes this an installed dependency).

## Package export

```ts
// src/index.ts
export { Navigation } from "./components/navigation/navigation";
export type {
  NavigationProps,
  NavigationLayout,
  NavItemProps,
  AnchorNavItemProps,
  ButtonNavItemProps,
} from "./components/navigation/navigation";
```

## `Navigation` component signature

```ts
function Navigation(props: NavigationProps): React.ReactElement;
```

- Renders a single `<nav aria-label={label}>` containing one polymorphic `<a>`/`<button>`
  per entry in `destinations`, in array order.
- `layout="vertical"` (default) renders destinations stacked top-to-bottom; `layout="horizontal"`
  renders them in a row — same axis-only semantics as Card's `layout` prop (Feature 09).
- The destination marked `active: true` (at most one, per spec Key Entities) renders
  `aria-current="page"` plus a `border`-token accent on the layout-appropriate edge (left
  for vertical, bottom for horizontal) — never a color-only change (FR-003).
- A destination marked `disabled: true` renders `aria-disabled="true"`, is excluded from the
  Tab sequence (`tabIndex={-1}`), and does not respond to click/Enter (FR-011).

## Props contract

See `data-model.md` for the full type definitions. Summary of guarantees:

| Prop | Applies to | Required | Default | Notes |
|---|---|---|---|---|
| `label` | `Navigation` | yes | — | Rendered as `aria-label`; required so multiple `<nav>` landmarks on one page stay distinguishable (FR-010, research.md Decision 6) |
| `destinations` | `Navigation` | yes | — | `NavItemProps[]`, full ordered list; an empty array is valid (FR-013) |
| `layout` | `Navigation` | no | `"vertical"` | Axis only — FR-002 |
| `className` | `Navigation` | no | — | Merged via `tailwind-merge` onto the `<nav>` element |
| `label` (per item) | `NavItemProps` | yes | — | Visible text; also the accessible name and the `title` fallback for truncation (FR-012) |
| `leadingIcon` | `NavItemProps` | no | — | Any `ReactNode`; a failed/missing icon never blocks the label (FR-014) |
| `active` | `NavItemProps` | no | `false` | Drives `aria-current` + border accent (FR-003, FR-004) |
| `disabled` | `NavItemProps` | no | `false` | Drives `aria-disabled` + Tab/click suppression (FR-011) |
| `as` | `NavItemProps` | no | `"a"` | `"a"` requires `href`; `"button"` requires `onClick` — compile-time enforced union (research.md Decision 4) |
| `href` | `AnchorNavItemProps` | yes (when `as: "a"` or omitted) | — | Standard anchor href |
| `onClick` | `ButtonNavItemProps` | yes (when `as: "button"`) | — | Standard click handler |

`href` and `onClick` are mutually exclusive at the type level — supplying the wrong one for a
given `as` value is a compile-time error, mirroring Table's `selectable`-gated prop pattern
(Feature 10) and Card's variant-gated prop pattern (Feature 09).

## Behavioral guarantees (testable via `navigation.test.tsx`)

1. Every rendered state (rest, hover, focus, pressed, active, disabled) across both layouts
   uses only `tokens.css`-traceable utility classes (no inline styles, no hex/oklch literals)
   — FR-007, FR-008, SC-002.
2. `focus-visible` (`ring` token) applies on every enabled destination only on keyboard/
   programmatic focus, matching Button/Card/Table's existing convention — FR-006.
3. Exactly the destination with `active: true` renders `aria-current="page"`; all others
   render no `aria-current` attribute — FR-003, FR-004.
4. A destination with `disabled: true` is unreachable via Tab, does not call `onClick` (or
   navigate, for `as="a"`) on click or Enter, and renders `aria-disabled="true"` — FR-011.
5. `layout="horizontal"` produces the same active/hover/focus/disabled behavior as the
   default vertical layout, differing only in the flex axis and which edge the active accent
   attaches to — FR-002.
6. A destination whose `label` overflows its available width renders with a visible
   ellipsis, exposes the full `label` via `title`, and keeps the full `label` as its
   accessible name — FR-012.
7. `destinations={[]}` renders the `<nav aria-label={label}>` landmark with no child
   destinations and no layout-shifting fallback content — FR-013.
8. A destination rendered with a `leadingIcon` that throws, returns `null`, or otherwise
   fails to display still renders its `label` and remains focusable/activatable — FR-014.
