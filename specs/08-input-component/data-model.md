# Data Model: Input Component

A component library has no persisted data; its "data model" is the public type contract
consumers code against. This document defines that contract, derived from spec.md's Key
Entities and Functional Requirements.

## InputType

```ts
type InputType = "text" | "email" | "password" | "tel" | "search" | "number";
```

Closed union of 6 values (FR-001). Passed through to the native `<input type>` attribute
unchanged — browser-native behaviors (numeric keyboard on mobile for `tel`/`number`, masked
characters for `password`, clear button for `search`) are inherited for free, not
reimplemented.

## FieldState

Not a single prop — a composite of three independent booleans/strings, each mapping to
native HTML semantics or a `tokens.css` role (research.md Decisions 4-5):

| State | Driven by | Notes |
|---|---|---|
| rest | (resting) | `input` token outline, no prop needed |
| hover | `:hover` | `color-system.md` defines no dedicated hover token for `input`; resolved as a small `foreground`-tinted border-strength shift (`hover:border-foreground/40`) on the existing `input`/`foreground` tokens rather than a new value — a documented exception, analogous to `input` itself not changing on focus |
| focus-visible | `:focus-visible` | `ring` token overlay; `input` token itself unchanged (color-system.md) |
| disabled | `disabled` prop | Native `disabled` attribute; suppresses error display regardless of `error` prop (research.md Decision 4) |
| readOnly | `readOnly` prop | Native `readOnly` attribute; focusable/selectable, not editable; `muted-surface` background distinguishes it from rest (research.md Decision 5) |
| error | `error` prop (string, truthy) | `destructive` token outline + text; takes precedence over `helperText` (research.md Decision 4); suppressed when `disabled` |

`disabled` and `readOnly` are independent booleans, not a combined enum (research.md
Decision 5) — both may theoretically be true at once; `disabled` wins visually and
interactively when they conflict (disabled is the more restrictive native semantic).

## FieldProps (composition root)

```ts
type FieldProps = {
  label: string;
  required?: boolean;        // default: false
  helperText?: string;
  error?: string;             // presence (truthy) activates error state; overrides helperText
  className?: string;
  children: React.ReactElement; // an <Input> (or compatible) element
};
```

`Field` owns the generated id (research.md Decision 2, via `useId()`) and threads it to its
`children` (the `Input` element), the rendered `FieldLabel`, and the rendered `FieldMessage`
— a consumer does not pass or manage `id`/`aria-describedby` by hand.

## InputProps

```ts
type InputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "size"> & {
  type?: InputType;            // default: "text"
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  invalid?: boolean;            // set internally by Field when an error is active; not
                                 // typically passed directly by a consumer using Field
};
```

`leadingIcon`/`trailingIcon` are mutually permitted together (unlike Button's icon-only
mode) — a search field with both a search icon (leading) and a clear button (trailing) is a
valid, common composition (research.md Decision 6).

## FieldLabelProps / FieldMessageProps

```ts
type FieldLabelProps = {
  htmlFor: string;     // supplied by Field, not the consumer
  required?: boolean;  // renders the required indicator (FR-006)
  children: React.ReactNode;
};

type FieldMessageProps = {
  id: string;           // supplied by Field, not the consumer
  tone: "helper" | "error";
  children: React.ReactNode;
};
```

**Typography role mapping** (FR-012 — every text usage resolves to a `typography-system.md`
role, no new font size/weight introduced):

| Text | Role | Notes |
|---|---|---|
| `FieldLabel` | `label` | Matches User Story 1 Acceptance Scenario 1 |
| `Input` value text | `body-default` | The typed/displayed content itself |
| `FieldMessage` (`helper` tone) | `caption` | Color: `muted-foreground` |
| `FieldMessage` (`error` tone) | `caption` | Color: `destructive` — same role as helper, only color differs |

These two are rendered internally by `Field`; they are exported primarily so a consumer
composing a custom layout (bypassing `Field`'s default composition) can still reuse them with
the same token-correct styling, not as the primary intended call pattern.

## Relationships

- `Field` × `InputType` × `FieldState` are orthogonal — every `InputType` must support every
  `FieldState` correctly (FR-003); the type prop does not constrain which states apply.
- `error` and `helperText` are mutually exclusive in rendered output (never both shown at
  once) but not mutually exclusive as props — a consumer may pass both, and `Field` resolves
  which one renders (research.md Decision 4), so a consumer doesn't have to clear
  `helperText` themselves when an error appears and clear `error` themselves when it
  resolves.
- `disabled` suppresses `error` rendering but does not clear the `error` prop itself — if the
  consumer later sets `disabled={false}` with `error` still set, the error reappears without
  the consumer needing to re-pass it.
