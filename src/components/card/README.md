# Card

The canonical container component for grouped content in the gridu design system. Lives at
`src/components/card/card.tsx`, exported from the package root (`src/index.ts`) as `Card`,
along with its types `CardProps`, `CardVariant`, `CardLayout`, `InformationalCardProps`,
`InteractiveCardProps`, `InteractiveLinkCardProps`, `InteractiveButtonCardProps`.

The third of six Phase 1 component features (07-12, see the epic tracker in the `gridu`
repo) — follows the same shape Button (Feature 07) and Field/Input (Feature 08) established:
a single `.tsx` file (no compound split — Card's regions are plain content-slot props, not
ARIA-id-threaded like Field's label/input/message), a colocated `.test.tsx`, a colocated
`README.md`, and a `cva()`-based variant/state system built exclusively on `tokens/tokens.css`
roles.

## Variant × layout

Two independent closed two-value props:

- `variant`: `"informational"` (default, no interactive affordance) or `"interactive"`
  (clickable/selectable, renders as `<a>` or `<button>`).
- `layout`: `"vertical"` (default, heading/body/footer stacked) or `"horizontal"` (a leading
  `media` region beside the heading/body/footer content column).

Every combination of the two renders correctly — they're orthogonal choices.

## State → token role mapping

| State | Driven by | Roles used |
|---|---|---|
| rest | (resting) | `border` (outline), `background` (surface) |
| hover (interactive only) | `:hover` | `muted-surface` background shift, no new value |
| pressed (interactive only) | `:active` | `muted-surface/80` background shift |
| focus-visible (interactive only) | `:focus-visible` | `ring` — same convention as Button (Feature 07) and Field/Input (Feature 08) |
| selected (interactive only) | `selected` prop | Increased border weight (`border-2`) using `foreground`, never color alone (FR-007) |
| disabled (interactive only) | `disabled` prop | `disabled:opacity-50`/`aria-disabled:opacity-50` (native `disabled` for `as="button"`, `aria-disabled` + `tabIndex={-1}` for `as="a"`) |

No shadow/elevation token is used — depth comes from `border` + surface contrast only, since
none is documented in `color-system.md` or the design tokens (spec Clarifications).

## Typography role mapping

| Region | Role |
|---|---|
| `heading` | `heading-subsection` |
| body (`children`) | `body-default` |
| `footer` | `body-secondary` |

## `as`, `href`, and `aria-label`

The interactive variant's `as` prop is `"a"` or `"button"` (default `"button"`) — there is no
`div`+`role="button"` option; native elements get keyboard activation and correct ARIA
semantics for free (research.md Decision 2). `href` is required, and enforced at the type
level, only when `as="a"` (research.md Decision 6). An explicit `aria-label` overrides the
default heading-derived accessible name (`aria-labelledby` pointing at the rendered
`heading`); when neither `heading` nor `aria-label` is set, the interactive Card has no
accessible name and a consumer should supply one of the two.

`selected` maps to `aria-pressed` when `as="button"` (a toggle/selection-within-a-set
pattern) and to `aria-current` when `as="a"` (a "this is the active one" pattern) — never
both, since `aria-pressed` is invalid on an anchor (research.md Decision 3).

## Nested interactive elements

A nested interactive element (e.g. a `Button` in the `footer`) stays independently clickable,
and the Card's own action (navigation for `as="a"`, `onClick` for either) does **not** also
fire for that click. Card's own click handler checks `event.target.closest()` against its own
rendered element; when the click resolves to a nested interactive descendant, the Card
suppresses its own action for that click without ever intercepting the nested element's own
handler (research.md Decision 5). No `event.stopPropagation()` call is required from the
consumer.

## `clampBody`

`clampBody` (default `false`) applies a 3-line clamp with ellipsis to the body region only —
`heading` and `footer` are unaffected. It's an explicit opt-in because the component cannot
detect on its own whether the consumer's surrounding layout enforces a fixed height (e.g. a
grid of equal-height cards); set it only when that's actually the case (research.md Decision
4).

## Adoption status

**Not yet adopted by `gridu-web`.** This feature defines and implements the component in
`gridu-design-system` only. Migrating `gridu-web`'s existing card-like surfaces onto this
component is explicit future work, gated behind the epic tracker's Phase 1 checkpoint, same
as Button and Field.

## Usage

```tsx
import { Card, Button } from "gridu-design-system";

// Informational, vertical (default)
<Card heading="Booking summary" footer="3 appointments today">
  Today's schedule is fully booked.
</Card>

// Informational, horizontal — media beside content
<Card layout="horizontal" media={<Avatar />} heading="Acme Bookings">
  Last updated 2 hours ago.
</Card>

// Interactive, navigates on activation
<Card variant="interactive" as="a" href="/business-profile" heading="Business profile">
  Manage your business details.
</Card>

// Interactive, in-page action, selectable
<Card
  variant="interactive"
  as="button"
  heading="Pro plan"
  selected={selectedPlan === "pro"}
  onClick={() => setSelectedPlan("pro")}
>
  $29/month
</Card>

// Nested interactive element — stays independently clickable
<Card
  variant="interactive"
  as="a"
  href="/appointments/123"
  heading="Appointment with Jane"
  footer={<Button size="sm" onClick={cancelAppointment}>Cancel</Button>}
>
  Tomorrow at 2:00 PM
</Card>
```
