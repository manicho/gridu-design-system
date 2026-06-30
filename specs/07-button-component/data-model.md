# Data Model: Button Component

A component library has no persisted data; its "data model" is the public type contract
consumers code against. This document defines that contract, derived from spec.md's Key
Entities and Functional Requirements.

## ButtonVariant

```ts
type ButtonVariant = "primary" | "secondary" | "destructive" | "outline" | "ghost";
```

Closed union of 5 values (FR-001, Clarifications session 2026-06-30). No 6th value, no
open `string`. Each resolves exclusively to `tokens.css` color roles (FR-002):

| Variant | Resting fill | Resting border | Text | Hover |
|---|---|---|---|---|
| `primary` | `--brand` | none | `--primary-foreground` | `--brand-strong` |
| `secondary` | `--muted-surface` | none | `--foreground` | `--muted-surface` at reduced opacity |
| `destructive` | `--destructive` | none | `--primary-foreground` (`color-system.md` ≈5.0:1 light / ≈6.0:1 dark) | `--destructive` at reduced opacity |
| `outline` | transparent | `--input` | `--foreground` | `--muted-surface` |
| `ghost` | transparent | none | `--foreground` | `--muted-surface` |

Every utility class resolves to a canonical role name directly (`bg-muted-surface`,
`text-primary-foreground`, etc.), not through `gridu-web`'s pre-existing alias names
(`secondary`, `destructive-foreground`) — those aliases exist for `gridu-web`'s/
`gridu-landing`'s own legacy component code (data-model.md of Feature 06), not for this new
canonical component. This required adding a color `@theme inline` registration block to
`tokens.css` itself (Feature 06 only registered typography as theme entries) — see
`tokens/tokens.css`'s "Color theme registration" section.

Exact opacity/darkening steps for hover are an implementation detail (tasks.md), not a new
token — they reuse the same role at a different CSS opacity modifier (e.g.
`hover:bg-brand-strong`, `hover:bg-muted-surface/80`).

## ButtonSize

```ts
type ButtonSize = "sm" | "default" | "lg";
```

Closed union of 3 values (FR-004). Each determines padding, min-height, and which
`tokens.css` typography role applies:

| Size | Min target height | Typography role |
|---|---|---|
| `sm` | meets WCAG 2.2 minimum target size (exact px defined in tasks.md T010) | smaller text role from Feature 05's scale |
| `default` | meets WCAG 2.2 minimum target size | body text role |
| `lg` | exceeds minimum, larger touch area | body/emphasis text role |

Icon-only buttons (see `IconOnlyProps` below) use the same 3 sizes with equal width/height
(square), so the minimum target size guarantee (SC-003) holds even with a single icon as
content.

## ButtonState

Not a prop — a state is either CSS-pseudo-class-driven (`hover`, `active`,
`focus-visible`) or prop-driven (`disabled`, `loading`). Listed here for completeness against
FR-005:

| State | Driven by | Notes |
|---|---|---|
| default | (resting) | No prop needed |
| hover | `:hover` | CSS pseudo-class only |
| focus-visible | `:focus-visible` | CSS pseudo-class only — never triggers on mouse-initiated focus (FR-006) |
| active | `:active` | CSS pseudo-class only |
| disabled | `disabled` prop | Native `disabled` attribute on `<button>`; `aria-disabled` + pointer-events suppression on `<a>` (anchors have no native `disabled`) |
| loading | `loading` prop | research.md Decision 7 — sets `aria-busy`, suppresses activation, takes precedence over `disabled` visually when both are set |

## ButtonProps (discriminated union)

```ts
type CommonButtonProps = {
  variant?: ButtonVariant;       // default: "primary"
  size?: ButtonSize;             // default: "default"
  disabled?: boolean;
  loading?: boolean;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  className?: string;
  as?: "button" | "a";           // FR-011 — polymorphic element
};

// Text/children mode: accessible name comes from visible children by default.
// aria-label stays a normal optional pass-through (not forbidden) — a consumer may still
// override the accessible name, e.g. when truncated text alone isn't descriptive enough.
type TextButtonProps = CommonButtonProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> &
  React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    children: React.ReactNode;
  };

// Icon-only mode: no visible children, accessible name is mandatory (FR-010,
// research.md Decision 6).
type IconOnlyButtonProps = CommonButtonProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> &
  React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    children?: never;
    icon: React.ReactNode;
    "aria-label": string; // required — compile error if omitted
  };

export type ButtonProps = TextButtonProps | IconOnlyButtonProps;
```

**Validation rules** (enforced at the type level per research.md Decision 6):

- `IconOnlyButtonProps` requires `aria-label`; TypeScript rejects an icon-only call site that
  omits it.
- `TextButtonProps` requires `children`; an empty/whitespace-only string is a runtime
  concern for `button.test.tsx`, not a type-level one (TypeScript cannot express
  "non-empty string").
- `as="a"` requires an `href` to be meaningful, but is not type-enforced (an anchor without
  `href` is valid HTML, just non-interactive) — left as a normal consumer responsibility,
  consistent with native anchor semantics.

## Relationships

- `ButtonVariant` × `ButtonSize` × `ButtonState` are fully orthogonal — every combination
  must render correctly (FR-005); none of the three constrains which values the others may
  take.
- `IconOnlyButtonProps` is mutually exclusive with `leadingIcon`/`trailingIcon` (icon-only
  uses its own `icon` field) — prevents an ambiguous "icon-only but also has a leading icon"
  state that has no defined visual meaning.
