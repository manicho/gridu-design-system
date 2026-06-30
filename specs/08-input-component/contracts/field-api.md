# Contract: Field/Input Public API

This is the public interface `gridu-design-system` exposes for the Field/Input components.
Any change to these exports that breaks an existing consumer call site is a breaking change
to this contract (relevant once the Phase 1 checkpoint makes this an installed dependency).

## Package export

```ts
// src/index.ts
export { Field } from "./components/field/field";
export { Input } from "./components/field/input";
export { FieldLabel } from "./components/field/field-label";
export { FieldMessage } from "./components/field/field-message";
export type {
  FieldProps,
  InputProps,
  InputType,
  FieldLabelProps,
  FieldMessageProps,
} from "./components/field/field";
```

## `Field` component signature

```ts
function Field(props: FieldProps): React.ReactElement;
```

- Renders a `<div>` wrapper containing: `FieldLabel`, the single `Input` child passed via
  `children`, and a `FieldMessage` (helper or error, whichever resolves per
  research.md Decision 4).
- Generates and threads the id linking label ↔ input ↔ message (research.md Decision 2);
  the consumer's `children` `Input` element receives `id`/`aria-describedby`/`aria-invalid`
  cloned onto it — the consumer does not set these manually on the `Input` they pass in.

## `Input` component signature

```ts
function Input(props: InputProps): React.ReactElement;
```

- Renders a native `<input>` wrapped in a `relative` container when `leadingIcon`/
  `trailingIcon` are present (research.md Decision 6); renders a bare `<input>` otherwise.
- Usable standalone (outside `Field`) for a consumer building a fully custom layout — in
  that case, label association and `aria-describedby` become the consumer's own
  responsibility, same as using a native `<input>` directly.

## Props contract

See `data-model.md` for the full type definitions. Summary of guarantees:

| Prop | Component | Required | Default | Notes |
|---|---|---|---|---|
| `label` | `Field` | yes | — | FR-002 — always renders an associated label |
| `required` | `Field` | no | `false` | Visual indicator on label + native `required` on input (FR-006) |
| `helperText` | `Field` | no | — | Shown only when `error` is not active (research.md Decision 4) |
| `error` | `Field` | no | — | Truthy value activates error state; overrides `helperText` |
| `type` | `Input` | no | `"text"` | One of the 6 closed values (FR-001) |
| `disabled` | `Input` | no | `false` | Native semantics; suppresses error display via `Field` (research.md Decision 4) |
| `readOnly` | `Input` | no | `false` | Native semantics; `muted-surface` background distinguishes from rest |
| `leadingIcon` | `Input` | no | — | May combine with `trailingIcon` (research.md Decision 6) |
| `trailingIcon` | `Input` | no | — | May combine with `leadingIcon` |
| `className` | `Field` / `Input` | no | — | Merged via `tailwind-merge`, consumer overrides win on conflicting utilities |

## Behavioral guarantees (testable via `field.test.tsx`)

1. Every `InputType` × `FieldState` combination renders only `tokens.css`-traceable utility
   classes (no inline styles, no hex/oklch literals in the component) — FR-011, FR-012,
   SC-002.
2. `focus-visible` (`ring` token) applies only on keyboard/programmatic focus, never on
   `mousedown`-initiated focus, matching Button's existing convention — FR-008.
3. A field with `error` set renders `aria-invalid="true"` and `aria-describedby` pointing to
   the rendered error text's id — FR-005, SC-004.
4. A field with `required` set renders `aria-required`/native `required` and a visual
   indicator on the label — FR-006.
5. `disabled` prevents focus via Tab and prevents typing; `readOnly` allows focus and text
   selection but prevents the value from changing — FR-009.
6. A field with both `error` and `disabled` set does not render the error text or
   `destructive` outline while `disabled` is `true` — Edge Cases ruling.
7. `helperText` and `error` are never both rendered simultaneously for the same field — Edge
   Cases ruling, User Story 4 Acceptance Scenario 2.
