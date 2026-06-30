# Contract: Card Public API

This is the public interface `gridu-design-system` exposes for the Card component. Any
change to these exports that breaks an existing consumer call site is a breaking change to
this contract (relevant once the Phase 1 checkpoint makes this an installed dependency).

## Package export

```ts
// src/index.ts
export { Card } from "./components/card/card";
export type {
  CardProps,
  CardVariant,
  CardLayout,
  InformationalCardProps,
  InteractiveCardProps,
} from "./components/card/card";
```

## `Card` component signature

```ts
function Card(props: CardProps): React.ReactElement;
```

- Renders an `<article>` (or a `<div>` when used purely decoratively — see README) for
  `variant="informational"`, or the element named by `as` (`"a"` → `<a>`, `"button"` →
  `<button type="button">`, default `"button"`) for `variant="interactive"` — mirrors
  Button's polymorphic rendering (Feature 07).
- Composes up to four regions in document order matching `layout`:
  - `vertical`: `heading` → `children` (body) → `footer`, stacked top to bottom.
  - `horizontal`: `media` beside `heading` + `children` (body) + `footer`, stacked
    top to bottom within that content column.
- `heading`, `media`, and `footer` render only when provided — no reserved empty space for an
  omitted region (FR-012).
- `clampBody` (default `false`) applies a 3-line clamp with ellipsis to `children` only
  (research.md Decision 4); does not affect `heading` or `footer`.

## Props contract

See `data-model.md` for the full type definitions. Summary of guarantees:

| Prop | Applies to | Required | Default | Notes |
|---|---|---|---|---|
| `variant` | both | no | `"informational"` | Closed two-value set (FR-004/FR-005) |
| `layout` | both | no | `"vertical"` | Closed two-value set (FR-014); orthogonal to `variant` |
| `heading` | both | no | — | Rendered with the `heading-subsection` typography role |
| `media` | both | no | — | Only placed when `layout="horizontal"` |
| `footer` | both | no | — | Visually separated from body via spacing/`border` divider |
| `clampBody` | both | no | `false` | 3-line clamp with ellipsis on body only (research.md Decision 4) |
| `as` | `interactive` only | no | `"button"` | `"a"` \| `"button"` — no `div`+`role="button"` option (research.md Decision 2) |
| `href` | `interactive` + `as="a"` | yes, compile-time enforced (research.md Decision 6) | — | Standard anchor `href`; the `as="a"` prop shape (`InteractiveLinkCardProps`) makes this a type error to omit, not just a documented expectation |
| `selected` | `interactive` only | no | `false` | Maps to `aria-pressed` (`as="button"`) or `aria-current` (`as="a"`) — research.md Decision 3 |
| `disabled` | `interactive` only | no | `false` | Suppresses hover/focus/pressed/click; not Tab-reachable (FR-010) |
| `onClick` | `interactive` only | no | — | Standard click handler; not called while `disabled`, and not called for clicks resolving to a nested interactive element (research.md Decision 5) |
| `aria-label` | `interactive` only | no | — | Explicit accessible-name override (FR-008, research.md Decision 6); when omitted, the name resolves from `heading` via `aria-labelledby` |
| `className` | both | no | — | Merged via `tailwind-merge`, consumer overrides win on conflicting utilities |

`selected`, `disabled`, `as`, `href`, `onClick`, and `aria-label` are absent from
`informational` Card's type — passing them on an `informational` Card is a compile-time
error, mirroring Button's `TextButtonProps`/`IconOnlyButtonProps` split (Feature 07).

## Behavioral guarantees (testable via `card.test.tsx`)

1. Every `CardVariant` × `CardLayout` combination renders only `tokens.css`-traceable utility
   classes (no inline styles, no hex/oklch literals, no shadow/box-shadow utility) — FR-002,
   FR-003, FR-011, SC-002.
2. `focus-visible` (`ring` token) applies only on keyboard/programmatic focus on the
   interactive variant, never on `mousedown`-initiated focus, matching Button's existing
   convention — FR-006.
3. A `selected` interactive Card renders `aria-pressed="true"` (`as="button"`) or
   `aria-current="true"` (`as="a"`) and is visually distinguishable from an unselected Card
   by border weight, not color alone — FR-007, FR-009, research.md Decision 3.
4. `disabled` prevents focus via Tab and click activation on the interactive variant; an
   `informational` Card exposes no interactive affordance regardless of any prop — FR-004,
   FR-010.
5. A nested interactive element (e.g. a `Button`) inside an interactive Card's body or
   footer remains independently clickable, AND the Card's own action (anchor navigation or
   `onClick`) does not also fire for that click — Card detects the nested target via
   `event.target.closest()` in its own bubble-phase handler and suppresses its own action,
   without intercepting the nested element's handler — FR-013, research.md Decision 5, Edge
   Cases ruling.
6. `clampBody` truncates `children` to 3 lines with a visible ellipsis when the body's
   rendered height exceeds 3 lines; `heading` and `footer` are unaffected — FR-015, spec
   Clarifications.
7. An interactive Card's accessible name resolves from `heading` when no explicit
   `aria-label` is passed — FR-008, User Story 3 Acceptance Scenario 1.
