# Navigation

**Location**: `src/components/navigation/navigation.tsx`  
**Feature**: 11 — Navigation Component (Product Identity Refresh, Phase 1)

An ordered list of destinations rendered as a native `<nav>` landmark, in either a vertical (sidebar) or horizontal (bar) layout.

## Token role mapping

All color, typography, and spacing usage resolves to documented token roles — no ad-hoc values.

### Color roles

| Element | Token role | Tailwind utility |
|---|---|---|
| Navigation surface | `background` | `bg-background` |
| Destination hover | `muted-surface` | `hover:bg-muted-surface` |
| Destination pressed | `muted-surface` (70% opacity) | `active:bg-muted-surface/80` |
| Active accent (border) | `foreground` | `border-foreground` |
| Focus ring | `ring` | `focus-visible:ring-ring` |
| Disabled (opacity) | existing role | `opacity-50` via `aria-disabled:opacity-50` |

### Typography roles

| Region | Role | Tailwind utility |
|---|---|---|
| Destination label (all states) | `label` | `text-label` |
| Active destination label | `label` + foreground color | `text-label text-foreground` |
| Inactive destination label | `label` + muted foreground | `text-label text-muted-foreground` |

### Active accent: width change, not color alone (FR-003)

The active indicator changes border *width* (1px transparent → 2px foreground), not just color — the same technique Card's `selected` state uses. A 1px transparent border is applied at rest on every destination to prevent layout shift when toggling active state.

## `NavItemProps` discriminated union

```ts
type NavItemProps = AnchorNavItemProps | ButtonNavItemProps;

// as="a" (default) — href is required
{ label, leadingIcon?, active?, disabled?, as?: "a", href }

// as="button" — onClick is required
{ label, leadingIcon?, active?, disabled?, as: "button", onClick }
```

`href` and `onClick` are mutually exclusive at the type level. Passing the wrong one for a given `as` value is a compile-time error.

## Disabled destinations

Disabled destinations use `aria-disabled="true"` + `tabIndex={-1}` + `pointer-events-none` for both `as` values, rather than the native `disabled` attribute (which has no effect on `<a>` elements). This is a deliberate design choice for behavioral consistency across element types — see `specs/11-navigation-component/research.md` Decision 3.

## Multiple `<nav>` landmarks

The `label` prop is required (not optional) because a page can have more than one `<nav>` element (e.g. sidebar + header). Unlabeled `<nav>` elements are indistinguishable to screen readers navigating by landmark. Making `label` required catches this at the type level — see research.md Decision 6.

## Scope: what this component is not

- **No nested/grouped navigation** (section headers, sub-items) — flat list only.
- **No collapsible icon-only mode** — fixed width; collapse is a consuming-app concern.
- **No responsive overflow/hamburger** — layout axis only, no breakpoint switching.
- **No route-matching** — `active` is consumer-supplied; the component never reads the URL.
