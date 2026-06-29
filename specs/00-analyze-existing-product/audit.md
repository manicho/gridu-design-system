# Product Identity Audit: Current State (gridu-web, gridu-landing)

**Created**: 2026-06-29
**Status**: Final — validated against `quickstart.md` (all 6 checks pass)
**Scope**: Visual/product identity as currently rendered in `gridu-web` (React dashboard)
and `gridu-landing` (Astro marketing site). The `gridu` API repo has no visual surface and is
out of scope. No new design decisions are proposed here — see Features 01-06 for that.

## gridu-web

**Stack**: React 19 + Vite, shadcn/ui ("new-york" style, `slate` base color), Tailwind CSS
v4, `lucide-react` icons. Styled via CSS custom properties mapped into Tailwind's `@theme` —
not a Tailwind config file (`components.json` → `tailwind.config: ""`).

*Source: `gridu-web/components.json`, `gridu-web/src/index.css`*

### Color

All color is defined as CSS variables in `gridu-web/src/index.css` (lines 7-79), split into a
`:root` (light) block and a `.dark` block, then mapped to Tailwind utilities via `@theme
inline` (lines 82-117) — e.g. `bg-background`, `text-foreground`, `bg-brand`.

Light theme (`:root`):

| Token | Value |
|---|---|
| `--background` | `oklch(1 0 0)` (white) |
| `--foreground` | `oklch(0.129 0.042 264.695)` (near-black, slight blue) |
| `--primary` | `oklch(0.208 0.042 265.755)` (dark slate-blue) |
| `--secondary` / `--muted` / `--accent` | `oklch(0.968 0.007 247.896)` (near-white slate) |
| `--destructive` | `oklch(0.577 0.245 27.325)` (red) |
| `--border` / `--input` | `oklch(0.929 0.013 255.508)` (light slate) |
| `--ring` | `oklch(0.704 0.04 256.788)` (mid slate) |
| `--brand` | `oklch(0.72 0.15 165)` (teal) |
| `--brand-strong` | `oklch(0.52 0.12 165)` (darker teal, WCAG AA for text/links per code comment at line 38) |
| `--brand-subtle` | `oklch(0.96 0.03 165)` (near-white teal tint) |
| `--sidebar*` | Same slate/primary palette, distinct from `--background`/`--card` |

Dark theme (`.dark`, lines 45-79) inverts background/foreground and shifts `--brand`/
`--brand-strong` lighter (`oklch(0.78 0.14 165)` / `oklch(0.82 0.13 165)`) so the accent stays
legible on dark surfaces — explicitly commented as a deliberate adjustment (line 74).

Component-level color usage all routes through these tokens via Tailwind utility classes
(e.g. `button.tsx` line 10: `bg-brand text-brand-foreground hover:bg-brand-strong`) — no
component hardcodes a raw color value.

*Source: `gridu-web/src/index.css` lines 7-117; `gridu-web/src/components/ui/button.tsx` line 10*

### Typography

A single typeface is used: "Inter", self-hosted as a variable font (`woff2`, weights 100-900),
declared via `@font-face` and mapped to `--font-sans` (lines 119-134). The code comment notes
it is "Shared 1:1 with gridu-landing (same brand typeface)" (line 126).

No separate type scale (heading sizes, line-heights) is declared globally — `CardTitle` uses
`font-semibold leading-none tracking-tight` with no explicit `text-*` size (inherits
ambient/parent size), and body text uses Tailwind's default `text-sm`/`text-base` utilities
ad hoc per component (e.g. `card.tsx` line 30: `text-sm`).

*Source: `gridu-web/src/index.css` lines 119-134; `gridu-web/src/components/ui/card.tsx` lines 22, 30*

### Spacing

`--radius` is the one explicit spacing-adjacent token (`0.625rem`), derived into
`--radius-sm/-md/-lg/-xl` (lines 83-86) and used consistently across components (`card.tsx`
line 8 uses the implicit `rounded-xl` Tailwind class, `button.tsx`/`input.tsx` use
`rounded-md`).

No spacing scale (padding/margin/gap) is declared as tokens — every component picks ad hoc
Tailwind spacing utilities. Observed range across `gridu-web/src/components/ui/*.tsx`:

| Property | Observed values | Where |
|---|---|---|
| Component height | `h-9` (sm), `h-10` (default), `h-11` (lg) | `button.tsx` lines 20-23; `input.tsx` line 9; `select.tsx` line 12 |
| Horizontal padding | `px-3` (sm button, input, select), `px-4` (default button, alert), `px-6` (lg button) | `button.tsx` lines 20-22; `input.tsx` line 9; `alert.tsx` line 6 |
| Card padding | `p-6` (header/content/footer), with `pt-0` override on content/footer | `card.tsx` lines 17, 34, 38 |
| Border radius | `rounded-md` (button, input, select, badge uses `rounded-full`), `rounded-xl` (card), `rounded-lg` (alert) | per-component, no shared variable beyond `--radius` |

*Source: `gridu-web/src/index.css` lines 8, 83-86; `gridu-web/src/components/ui/{button,card,input,select,alert,badge}.tsx`*

### Components

| Component | File | Variants observed |
|---|---|---|
| Button | `button.tsx` | `variant`: default, destructive, outline, secondary, ghost, link; `size`: default, sm, lg, icon |
| Card | `card.tsx` | Compound: Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter (no variant prop) |
| Badge | `badge.tsx` | `variant`: default, secondary, destructive, outline, success, warning (`warning` hardcodes `bg-amber-500` — the one color not sourced from a CSS variable) |
| Input | `input.tsx` | No variant prop; single style, `aria-invalid` state styled via `aria-[invalid=true]:border-destructive` |
| Select | `select.tsx` | Native `<select>`, no variant prop, comment: "Native, accessible select styled to match the design system" |
| Table | `table.tsx` | Compound: Table, TableHeader, TableBody, TableRow, TableHead, TableCell (no variant prop) |
| Alert | `alert.tsx` | `variant`: default, destructive |
| Skeleton | `skeleton.tsx` | No variant prop; single pulse animation |
| Spinner | `spinner.tsx` | No variant prop; optional `label` |
| Label | `label.tsx` | No variant prop |
| Textarea | `textarea.tsx` | No variant prop; mirrors Input's styling |

All variant-bearing components use `class-variance-authority` (`cva`) consistently except
`Select`, `Input`, `Table`, `Skeleton`, `Spinner`, `Label`, `Textarea`, which have no variants
at all (plain prop pass-through).

**Surface-specific**: every component in this inventory is dashboard-only — none has a
gridu-landing equivalent (gridu-landing has no data table, form input primitives, or admin
UI of any kind). See gridu-landing's Components section for that surface's own
surface-specific inventory and the duplication this causes (Input/Card styling re-implemented
by hand on gridu-landing rather than shared).

*Source: `gridu-web/src/components/ui/{button,card,badge,input,select,table,alert,skeleton,spinner,label,textarea}.tsx`*

## gridu-landing

**Stack**: Astro + Preact islands (via `@astrojs/preact` with `compat: true`, aliasing
React/React-DOM to Preact/compat) + TypeScript, Tailwind CSS v4.

*Source: `gridu-landing/astro.config.mjs`, `gridu-landing/src/styles/global.css`*

> **Finding — an existing brand guidelines document exists on this surface.**
> `gridu-landing/docs/brand-guidelines.md` (v1.0, May 2026) documents brand purpose/values/
> voice, a color palette (OKLCH tokens + hex approximations), typography scale and weight
> rules, a logo system (wordmark strategy, the "i" dot-bubble signature element, the
> deferred-to-designer standalone symbol decision), image style, and a slogan/positioning.
> Noted here for completeness as part of this surface's current state. Features 01-06 of
> this epic define the new product identity from scratch and are not scoped to adopt or
> reference this document's content.

### Color

`gridu-landing/src/styles/global.css` (lines 12-71) defines the **same token names and
values** as `gridu-web/src/index.css`'s light/dark sets (`--background`, `--foreground`,
`--primary`, `--secondary`, `--muted`, `--accent`, `--destructive`, `--border`, `--input`,
`--ring`, `--brand`, `--brand-strong`, `--brand-foreground`, `--brand-subtle`) — confirmed
byte-identical for every shared token. The file's own comment (lines 6-10) states this is
deliberate: "copied verbatim from the gridu-web dashboard... so the marketing site and the
panel feel like the same brand." `brand-guidelines.md` §3.1 names these the same way
("Teal Gridu", "Teal Fuerte", "Teal Suave") with hex approximations (`≈ #14BCA0`, `#0E7C68`,
`#E9F8F3`).

Two differences from gridu-web:
1. **No `--sidebar*` tokens** (no sidebar UI on this surface) and **no `.dark` class
   block** — see Spacing/dark-mode mechanism note below.
2. **Dark mode trigger differs**: `@media (prefers-color-scheme: dark)` (line 43) vs.
   gridu-web's `.dark` class selector (`gridu-web/src/index.css` line 45) — see Cross-Surface
   Comparison.

*Source: `gridu-landing/src/styles/global.css` lines 12-71; `gridu-landing/docs/brand-guidelines.md` §3.1*

### Typography

Same approach as gridu-web: single typeface "Inter", self-hosted variable woff2, same
`@font-face` declaration (lines 114-120, byte-identical font-weight range `100 900`).
`brand-guidelines.md` §3.2 formalizes a type scale that does **not** appear anywhere in the
component code itself: H1/H2 at weight 700, H3 at 600, body at 400, with an explicit rule
"avoid weights below 400 in body text." Components observed (e.g. `PricingPlans.tsx` line
113: `text-xl font-semibold`; line 119: `text-4xl font-bold tabular-nums`) are consistent
with that documented scale but the scale itself lives only in the brand doc, not in CSS or a
Tailwind config.

*Source: `gridu-landing/src/styles/global.css` lines 104-120; `gridu-landing/docs/brand-guidelines.md` §3.2; `gridu-landing/src/components/islands/PricingPlans.tsx` lines 113, 119*

### Spacing

No spacing tokens beyond `--radius` (line 13, same value as gridu-web: `0.625rem`). Observed
range across components:

| Property | Observed values | Where |
|---|---|---|
| Section horizontal padding | `px-4 sm:px-6` consistently | `Header.astro` line 17; `Footer.astro` line 12 |
| Max content width | `max-w-6xl` (header/footer), `max-w-3xl` (pricing grid), `max-w-sm` (hero chat) — varies by section purpose, not a single container scale | `Header.astro` line 17; `PricingPlans.tsx` line 90; `HeroChat.astro` line 9 |
| Border radius | `rounded-md` (nav links, inputs), `rounded-xl`/`rounded-2xl`/`rounded-3xl` (cards, modal, hero chat — increasing with surface size), `rounded-full` (pills, toggle) | per-component, same ad hoc pattern as gridu-web |
| Interactive element height | `h-10` (header CTA), `h-11` (pricing CTA, checkout inputs/buttons) | `Header.astro` line 61; `CheckoutModal.tsx` line 167, 325 |

This mirrors gridu-web's pattern: a shared `--radius` token but no shared spacing/height
scale — each component picks values ad hoc, with some recurring but undeclared conventions
(`h-10`/`h-11` for primary interactive elements on both surfaces).

*Source: `gridu-landing/src/styles/global.css` line 13; `gridu-landing/src/components/{Header,Footer,HeroChat}.astro`, `gridu-landing/src/components/islands/{PricingPlans,CheckoutModal}.tsx`*

### Components

| Component | File | Notes |
|---|---|---|
| Header/Nav | `Header.astro` | Sticky header, zero-JS mobile menu via native `<details>`; no equivalent in gridu-web (surface-specific — marketing nav, gridu-web has a dashboard sidebar instead) |
| Footer | `Footer.astro` | 4-column link grid; surface-specific (no gridu-web equivalent) |
| Logo | `Logo.astro` | Wordmark built in pure markup (no SVG/image asset) — the "i" dot replaced by a teal `<span>` styled as a circle with one squared corner, implementing the dot-bubble signature from `brand-guidelines.md` §3.3; surface-specific (gridu-web has no Logo component found under `src/components/ui/`) |
| HeroChat | `HeroChat.astro` | Static (zero-JS) WhatsApp-style chat mockup; surface-specific |
| ChatDemo | `islands/ChatDemo.tsx` | Animated chat demo, respects `prefers-reduced-motion`; surface-specific |
| PricingPlans | `islands/PricingPlans.tsx` | Custom card-based pricing layout with a billing-period toggle (`role="switch"`); not built on a shared Card primitive — its card styling (`rounded-xl border bg-card ... shadow-sm`, line 101) duplicates gridu-web's `Card` component styling (`card.tsx` line 8) independently rather than sharing it |
| CheckoutModal | `islands/CheckoutModal.tsx` | Native `<dialog>`-based modal with its own input styling (`inputClass`, line 167) that duplicates gridu-web's `Input` component styling (`input.tsx` line 9) independently — same `h-10`/`h-11`, `rounded-md`/`rounded-lg`, `border-input bg-background` pattern, hand-rewritten rather than shared |

No component in `gridu-landing/src/components/` has an equivalent gridu-web component it
maps to 1:1 (gridu-web has no marketing-site components; gridu-landing has no dashboard
components) — every component listed above is surface-specific. The inverse direction
(gridu-web components with no gridu-landing equivalent) is noted in the gridu-web section
above.

*Source: `gridu-landing/src/components/{Header,Footer,Logo,HeroChat}.astro`, `gridu-landing/src/components/islands/{ChatDemo,PricingPlans,CheckoutModal}.tsx`*

## Cross-Surface Comparison

| Concept | gridu-web | gridu-landing | Match? |
|---|---|---|---|
| Color tokens (names + values) | `--background`, `--primary`, `--brand`, etc. (gridu-web Color) | Same names, same OKLCH values (gridu-landing Color) | **Match** — confirmed byte-identical for every shared token |
| `--sidebar*` tokens | Present (gridu-web Color) | Absent (gridu-landing Color) | Expected divergence — no sidebar UI on the marketing site |
| Dark mode trigger mechanism | `.dark` CSS class, toggled at runtime (likely a JS theme switcher; not confirmed in this audit's scope) | `@media (prefers-color-scheme: dark)`, OS-driven only, no manual toggle possible | **Inconsistency** — a user could get a different dark-mode *experience* (manual override vs. OS-only) depending which surface they're on, even though the resulting color values are identical |
| Typeface | Inter, self-hosted woff2, `100 900` weight range (gridu-web Typography) | Identical declaration (gridu-landing Typography) | **Match** |
| Documented type scale | None — sizes picked ad hoc per component (gridu-web Typography) | Formalized in `brand-guidelines.md` §3.2 (H1 700, H2 700, H3 600, body 400) but not encoded in code on *either* surface | **Inconsistency** — the scale exists as a written rule but only gridu-landing's brand doc states it, and neither surface's code enforces it |
| `--radius` value | `0.625rem` (gridu-web Spacing) | `0.625rem` (gridu-landing Spacing) | **Match** |
| Interactive element height | `h-9`/`h-10`/`h-11` across button sizes (gridu-web Spacing) | `h-10`/`h-11` observed (gridu-landing Spacing) | **Match** on overlapping sizes — both surfaces converge on `h-10`/`h-11` for default/primary actions without a shared token declaring it |
| Card styling | `Card` component: `rounded-xl border border-border bg-card ... shadow-sm` (gridu-web Components) | `PricingPlans.tsx` article: `rounded-xl border bg-card ... shadow-sm` (gridu-landing Components) | **Match in values, inconsistency in method** — gridu-landing re-derives the identical class string by hand instead of consuming gridu-web's `Card` component |
| Input styling | `Input` component: `h-10 ... rounded-md border-input bg-background ...` (gridu-web Components) | `CheckoutModal.tsx` `inputClass`: `h-11 ... rounded-lg border border-border bg-background ...` (gridu-landing Components) | **Inconsistency** — same concept (text input), different height (`h-10` vs `h-11`) and different radius (`rounded-md` vs `rounded-lg`), hand-rewritten rather than shared |
| Badge/pill styling | `Badge` component: `rounded-full border px-2.5 py-0.5 text-xs font-medium` (gridu-web Components) | Pricing "most popular" pill: `rounded-full ... px-3 py-1 text-xs font-semibold` (gridu-landing, `PricingPlans.tsx` line 108); annual-badge pill: `px-2.5 py-1` (line 85) | **Inconsistency** — three slightly different padding/weight combinations for what is visually the same "pill" concept, none reusing gridu-web's `Badge` |
| Brand documentation | None beyond inline code comments | A `brand-guidelines.md` document exists (purpose, voice, color, type, logo, imagery, slogan) | **Asymmetry** — only gridu-landing has this document; it is not referenced from gridu-web or from this repo. Noted as current state only; out of scope for reuse in this epic |

## Gaps

- **No shared component library.** Every component is implemented once per surface, even
  when the underlying concept (card, input, badge/pill) is identical. This is why card,
  input, and badge styling drifted between surfaces (Cross-Surface Comparison: Card styling,
  Input styling, Badge/pill styling) — there is no single source to keep them in sync.
- **No design tokens shared as a package** — only as copy-pasted CSS. The two `:root` blocks
  in `gridu-web/src/index.css` and `gridu-landing/src/styles/global.css` are kept in sync by
  convention/discipline (confirmed identical today), not by any shared source — a future edit
  to one is not guaranteed to propagate to the other (Color section, both surfaces).
- **No documented spacing/sizing scale**, on either surface. `--radius` is the only spacing
  token; every padding/margin/height value is picked ad hoc per component (gridu-web
  Spacing, gridu-landing Spacing) — this is the direct cause of the Input height/radius
  inconsistency (Cross-Surface Comparison: Input styling).
- **No enforced type scale in code.** A type scale is referenced informally in
  `gridu-landing/docs/brand-guidelines.md` §3.2, but neither surface's CSS or components
  encode or enforce any type scale (Cross-Surface Comparison: Documented type scale). This
  epic's Features 01-06 define the new identity from scratch and are not scoped to adopt
  that document's content.
- **Inconsistent dark-mode activation mechanism** between surfaces (`.dark` class vs.
  `prefers-color-scheme` media query) even though the resulting token values are identical —
  a design-system-level decision on how dark mode should be triggered has never been made
  explicitly (Cross-Surface Comparison: Dark mode trigger mechanism).
- **No shared package consuming the (currently identical) token set.** Both `:root`/`.dark`
  blocks would need to be hand-edited in two places for any future token change, with no
  build-time or lint-time check that they stay in sync.
