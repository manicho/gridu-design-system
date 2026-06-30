# Field / Input

The canonical text-field primitives for the gridu design system: `Field` (the labeled
composition root), `Input` (the bare styled `<input>`), `FieldLabel`, and `FieldMessage`.
Lives at `src/components/field/`, exported from the package root (`src/index.ts`) as
`Field`, `Input`, `FieldLabel`, `FieldMessage`.

The second of six Phase 1 component features (07-12, see the epic tracker in the `gridu`
repo) — follows the same shape Button (Feature 07) established: small `.tsx` files, a
colocated `.test.tsx`, a colocated `README.md`, all styled exclusively through
`tokens/tokens.css` roles via `class-variance-authority` + the shared `cn()` helper.

## State → token role mapping

| State | Driven by | Roles used |
|---|---|---|
| rest | (resting) | `input` (border), `background`, `foreground` |
| hover | `:hover` | No dedicated `color-system.md` hover token for `input` — resolved as a small `foreground`-tinted border shift (`hover:border-foreground/40`), a documented exception |
| focus-visible | `:focus-visible` | `ring` — `input` itself unchanged on focus, same as `color-system.md` documents |
| disabled | `disabled` prop | `disabled:opacity-50 disabled:pointer-events-none` (native semantics) |
| read-only | `readOnly` prop | `muted-surface` background (native semantics — focusable/selectable, not editable) |
| error | `error` prop on `Field` | `destructive` (border + message text) |

## Typography role mapping

| Text | Role | Notes |
|---|---|---|
| `FieldLabel` | `label` | Matches User Story 1 Acceptance Scenario 1 |
| `Input` value text | `body-default` | The typed/displayed content itself |
| `FieldMessage` (helper) | `caption` | Color: `muted-foreground` |
| `FieldMessage` (error) | `caption` | Color: `destructive` — same role as helper, only color differs |

## Validation timing is consumer-owned

`Field` accepts a plain `error?: string`. It renders whatever it's given, whenever it's
given it — it does not track touched/blurred state, debounce, or decide when validation
"should" run (research.md Decision 7). Each consumer integration (a plain form, React Hook
Form, a server-action-driven form) wires its own validation timing and passes the resulting
message in.

## Adoption status

**Not yet adopted by `gridu-web` or `gridu-landing`.** This feature defines and implements
the components in `gridu-design-system` only. Migrating either consuming repo's existing
form fields onto these components is explicit future work, gated behind the epic tracker's
Phase 1 checkpoint, same as Button.

## Known gaps

- **No `ref` forwarding** on `Input`, matching Button's same documented scope cut — add only
  once a real consumer need (e.g. focus management from a parent) demonstrates it.
- **Icon adornments are decorative only** (`aria-hidden`, non-interactive). A consumer
  needing an interactive trailing control (e.g. a show/hide-password toggle) composes their
  own layout using the bare `Input` export instead of `Field`.

## Usage

```tsx
import { Field, Input } from "gridu-design-system";

<Field label="Business name">
  <Input placeholder="Acme Bookings" />
</Field>

<Field label="Email" required>
  <Input type="email" />
</Field>

<Field label="Phone number" helperText="We'll only use this to confirm your booking" error={errors.phone}>
  <Input type="tel" disabled={isSubmitting} />
</Field>

<Field label="Search">
  <Input type="search" leadingIcon={<SearchIcon />} />
</Field>
```
