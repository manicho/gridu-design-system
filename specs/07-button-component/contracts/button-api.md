# Contract: Button Public API

This is the public interface `gridu-design-system` exposes for the Button component. Any
change to these exports that breaks an existing consumer call site is a breaking change to
this contract (relevant once Phase 1's checkpoint makes this an installed dependency).

## Package export

```ts
// src/index.ts
export { Button } from "./components/button/button";
export type {
  ButtonProps,
  ButtonVariant,
  ButtonSize,
} from "./components/button/button";
```

## `Button` component signature

```ts
function Button(props: ButtonProps): React.ReactElement;
```

- Renders a native `<button type="button">` by default, or `<a>` when `as="a"` is passed
  (FR-011). `type="submit"`/`type="reset"` remain available via standard
  `ButtonHTMLAttributes` passthrough (e.g. for a future `SubmitButton`-style wrapper).
- Forwards `ref` is **not** required by this contract for the initial release — add only if
  a real consumer need (e.g. focus management from a parent) demonstrates it (Constitution
  Principle I/IV). Document this as a known gap, not a silent omission.

## Props contract

See `data-model.md` for the full `ButtonProps` discriminated union. Summary of guarantees:

| Prop | Required | Default | Notes |
|---|---|---|---|
| `variant` | no | `"primary"` | One of the 5 closed values (FR-001) |
| `size` | no | `"default"` | One of the 3 closed values (FR-004) |
| `disabled` | no | `false` | Native semantics on `<button>`; `aria-disabled` + non-interactive on `<a>` |
| `loading` | no | `false` | Implies non-activatable + `aria-busy`; visually takes precedence over `disabled` (FR-008) |
| `leadingIcon` | no | — | Mutually exclusive with icon-only `icon` |
| `trailingIcon` | no | — | Mutually exclusive with icon-only `icon` |
| `icon` | yes, in icon-only mode | — | Mutually exclusive with `children` |
| `children` | yes, in text mode | — | Mutually exclusive with `icon` |
| `aria-label` | yes, in icon-only mode (type-enforced) | — | Compile error if omitted in icon-only mode (FR-010) |
| `as` | no | `"button"` | `"button" \| "a"` (FR-011) |
| `className` | no | — | Merged via `tailwind-merge`, consumer overrides win on conflicting utilities |

## Behavioral guarantees (testable via `button.test.tsx`)

1. Every variant/size combination renders only `tokens.css`-traceable utility classes (no
   inline styles, no hex/oklch literals in the component) — FR-002, FR-003, SC-005.
2. `focus-visible` styles apply only on keyboard/programmatic focus, never on
   `mousedown`-initiated focus — FR-006.
3. `disabled` and `loading` both prevent the underlying `onClick`/navigation from firing —
   FR-007, FR-008.
4. Icon-only mode without `aria-label` fails `tsc`, not just ESLint — FR-010 (verified via a
   `// @ts-expect-error` fixture in `button.test.tsx`, not a runtime assertion).
5. Long text content is visually truncated (`truncate` utility present), never wrapped —
   FR-014.

## Non-goals (explicitly out of contract for this feature)

- No `gridu-web`/`gridu-landing` call site is migrated to this export (FR-013).
- No npm publish, no version number guarantee yet — this contract governs source-level usage
  within `gridu-design-system`'s own tests and playground only, until the Phase 1 checkpoint.
