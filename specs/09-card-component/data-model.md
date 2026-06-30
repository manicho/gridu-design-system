# Data Model: Card Component

A component library has no persisted data; its "data model" is the public type contract
consumers code against. This document defines that contract, derived from spec.md's Key
Entities and Functional Requirements.

## CardVariant / CardLayout

```ts
type CardVariant = "informational" | "interactive";
type CardLayout = "vertical" | "horizontal";
```

Two independent closed two-value sets (FR-004/FR-005, FR-014, research.md Decision 1's
sibling scoping) — every `CardVariant` must support every `CardLayout` (the spec's
Clarifications session treats them as independent choices). Neither is configurable beyond
these two values (constitution Principle I).

## CardState

Not a single prop — a composite of booleans/strings, applicable only when
`variant="interactive"` (FR-005); an `informational` Card exposes none of these:

| State | Driven by | Notes |
|---|---|---|
| rest | (resting) | `border` token outline, no prop needed |
| hover | `:hover` | Surface/border shift using existing `muted-surface`/`border` tokens, no new value |
| focus-visible | `:focus-visible` | `ring` token overlay, same convention as Button (Feature 07) and Input (Feature 08) |
| pressed | `:active` | Brief surface shift on activation, mirrors Button's `active:` states |
| selected | `selected` prop (boolean) | `aria-pressed` (`as="button"`) or `aria-current` (`as="a"`) — research.md Decision 3; border weight increases, never color-only (FR-007) |
| disabled | `disabled` prop (boolean) | Suppresses hover/focus/pressed/click entirely; not reachable via Tab (FR-010) |

`selected` and `disabled` are independent booleans (may theoretically both be set); per spec
Edge Cases, `disabled` takes visual and interactive precedence when both apply.

## CardProps

```ts
type CommonCardProps = {
  variant?: CardVariant;       // default: "informational"
  layout?: CardLayout;          // default: "vertical"
  heading?: React.ReactNode;
  media?: React.ReactNode;      // rendered only when layout="horizontal"
  footer?: React.ReactNode;
  clampBody?: boolean;          // default: false — research.md Decision 4
  className?: string;
  children: React.ReactNode;    // the body region
};

type InformationalCardProps = CommonCardProps & {
  variant?: "informational";
};

// Shared by both interactive shapes — split further below so `href` is required at the
// type level only when as="a" (research.md Decision 6).
type InteractiveCommonProps = CommonCardProps & {
  variant: "interactive";
  selected?: boolean;            // default: false
  disabled?: boolean;            // default: false
  onClick?: (event: React.MouseEvent) => void;
  /** Explicit accessible-name override (FR-008). When omitted, the accessible name
   *  resolves from `heading` via `aria-labelledby` (research.md Decision 6). */
  "aria-label"?: string;
};

type InteractiveLinkCardProps = InteractiveCommonProps & {
  as: "a";
  href: string;                  // required — compile-time enforced, not just commented
};

type InteractiveButtonCardProps = InteractiveCommonProps & {
  as?: "button";                 // default
  href?: never;
};

type InteractiveCardProps = InteractiveLinkCardProps | InteractiveButtonCardProps;

type CardProps = InformationalCardProps | InteractiveCardProps;
```

`selected`, `disabled`, `as`, `href`, `onClick`, and `aria-label` only exist on
`InteractiveCardProps` — mirrors Button's `TextButtonProps`/`IconOnlyButtonProps`
discriminated-union pattern (Feature 07), so passing `selected` on an `informational` Card is
a type error, not a silently ignored prop. `href` is further split by `as` (mirroring
Button's icon-only `aria-label` requirement), so omitting `href` when `as="a"` is also a
compile-time error rather than a runtime gap.

## Typography role mapping

FR-003 — every text usage resolves to a `typography-system.md` role, no new font size/weight
introduced:

| Region | Role | Notes |
|---|---|---|
| `heading` | `heading-subsection` | Smaller heading role than Button/Field use; cards are nested content, not page/section-level |
| `children` (body) | `body-default` | Standard body text role |
| `footer` | `body-secondary` | De-emphasized relative to body, matches a footer's typically secondary weight (e.g. metadata, action labels) |

## Color role mapping

FR-002 — no new color value introduced; depth from `border` only (no shadow/elevation,
spec Clarifications):

| Element | Token role | Notes |
|---|---|---|
| Surface (rest) | `background` | Default; `muted-surface` is an acceptable alternative for a card nested inside an already-`background` page region, to keep visual separation — consumer's choice via `className`, not a separate prop |
| Border (rest) | `border` | All states |
| Border (hover, interactive) | `border` (shifted opacity) | No new value |
| Focus ring (interactive) | `ring` | Same convention as Button/Input |
| Selected border (interactive) | `border` (increased weight) | Width change, not a new color |
| Disabled | existing tokens at reduced opacity | Mirrors Button's `disabled:opacity-50` |

## Relationships

- `variant` and `layout` are orthogonal (research.md, spec Clarifications) — every
  combination of the two must render correctly; layout controls region arrangement
  (vertical stack vs. leading media + content), variant controls interactivity.
- `media` is only meaningful when `layout="horizontal"`; passing it with `layout="vertical"`
  is not type-prevented (media is a generic content slot) but has no documented horizontal
  placement — README documents this as horizontal-only usage.
- `heading` and `footer` are independent optional slots — either, both, or neither may be
  omitted without the component reserving empty space for the omitted region (FR-012).
- `clampBody` only affects the body (`children`) region — `heading` and `footer` are not
  clamped, consistent with their typically short, single-line content.
