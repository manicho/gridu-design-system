# Button

The canonical Button component for the gridu design system. Lives at
`src/components/button/button.tsx`, exported from the package root (`src/index.ts`) as
`Button`, along with its types `ButtonProps`, `ButtonVariant`, `ButtonSize`,
`TextButtonProps`, `IconOnlyButtonProps`.

This is the first of six Phase 1 component features (07-12, see the epic tracker in the
`gridu` repo) — later components follow the same shape: a single `.tsx` file, a colocated
`.test.tsx`, a colocated `README.md`, and a `cva()`-based variant/size system built
exclusively on `tokens/tokens.css` roles.

## Variant → token role mapping

| Variant | Fill / border | Text | tokens.css roles used |
|---|---|---|---|
| `primary` | `--brand` (hover/active: `--brand-strong`) | `--primary-foreground` | `brand`, `brand-strong`, `primary-foreground` |
| `secondary` | `--muted-surface` | `--foreground` | `muted-surface`, `foreground` |
| `destructive` | `--destructive` | `--primary-foreground` | `destructive`, `primary-foreground` |
| `outline` | transparent, `--input` border | `--foreground` | `input`, `foreground` |
| `ghost` | transparent, `--muted-surface` on hover | `--foreground` | `muted-surface`, `foreground` |

Every class uses the canonical role name directly (e.g. `bg-muted-surface`), not
`gridu-web`'s pre-existing alias names (`secondary`, `destructive-foreground`) — those
aliases are for `gridu-web`'s/`gridu-landing`'s own legacy component code, not this new
component. `tokens.css` registers all 15 canonical roles as Tailwind `@theme` color
entries (added by this feature — Feature 06 only registered typography).

Focus ring uses `--ring`. Sizes (`sm`/`default`/`lg`) reuse `gridu-web`'s existing height
scale (36px/40px/44px) — no new value introduced (FR-002, FR-003, SC-005).

## Adoption status

**Not yet adopted by `gridu-web` or `gridu-landing`.** This feature defines and implements
the component in `gridu-design-system` only (FR-013). Migrating either consuming repo's
existing buttons onto this component is explicit future work, gated behind the epic
tracker's Phase 1 checkpoint ("cut a version of `gridu-design-system` once Features 07-12
are all `Done`").

## Known gaps

- **No `ref` forwarding.** `Button` does not currently expose a `ref` to the underlying
  `<button>`/`<a>` DOM node. This is a deliberate scope cut for the initial release, not a
  silent omission (contracts/button-api.md) — add it only once a real consumer need (e.g.
  focus management from a parent) demonstrates it.

## Usage

```tsx
import { Button } from "gridu-design-system";

<Button variant="primary">Save</Button>
<Button variant="destructive" size="sm">Delete</Button>
<Button as="a" href="/pricing" variant="outline">View pricing</Button>
<Button loading>Saving…</Button>
<Button icon={<Trash2 />} aria-label="Delete" />
```
