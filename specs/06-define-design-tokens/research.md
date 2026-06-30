# Research: Define Design Tokens

All decisions below were made during `/speckit-plan` from the inputs listed in `plan.md`,
grounded in direct inspection of `gridu-web/src/index.css`, `gridu-landing/src/styles/global.css`,
`gridu-web/src/lib/theme/` (existing dark-mode implementation), and component-level grep
searches confirming which existing token names are actually referenced in code (not assumed).

## Decision 1 — Canonical token source format and location

**Decision**: A plain CSS file, `gridu-design-system/tokens/tokens.css`, holding the 15 color
roles (light + dark) and 8 typography roles as Tailwind v4 theme-compatible custom
properties. Both surfaces copy these exact values into their own files; real package
distribution is deferred.

**Rationale**: `gridu-design-system` has no `package.json` or build tooling today — it has
been a pure Spec Kit docs repo through Features 00-05. The epic tracker's own Phase 1
checkpoint note places real package consumption after the component library (Features
07-12) exists, not at the tokens-only stage. A canonical CSS file still resolves the actual
audit-flagged gap (no single documented source today) without building publish/version
tooling ahead of a demonstrated need (Principle IV).

**Alternatives considered**: Real npm package + workspace install (rejected — correctly
sequenced later, per the epic tracker); JSON token format requiring a build/transform step
(rejected — neither surface has a token pipeline today; premature tooling).

---

## Decision 2 — Alias mapping for `gridu-web` tokens not named in `color-system.md`

**Decision**: Keep all existing token names that components actively reference (`card`,
`card-foreground`, `popover`, `popover-foreground`, `secondary`, `secondary-foreground`,
`muted`, `accent`, `accent-foreground`, `destructive-foreground`, `brand-foreground`), but
redirect each to a canonical role's value:

| Existing token | Aliases to |
|---|---|
| `card` | `muted-surface` |
| `card-foreground` | `foreground` |
| `popover` | `background` |
| `popover-foreground` | `foreground` |
| `secondary` | `muted-surface` |
| `secondary-foreground` | `foreground` |
| `muted` | `muted-surface` |
| `accent` | `muted-surface` |
| `accent-foreground` | `foreground` |
| `destructive-foreground` | `primary-foreground` |
| `brand-foreground` | `primary-foreground` |

**Correction during `/speckit-implement`**: `muted` and `brand-foreground` were missed in
the original research pass — confirmed via a broader repo-wide grep across all color
utility prefixes (`bg-`/`text-`/`border-`/`ring-`) while authoring `tokens.css`, after the
initial targeted search had only checked the names already suspected from `index.css`'s
structure. `bg-muted` is actively used in `auth-card.tsx`, `table.tsx`, and `skeleton.tsx`;
`text-brand-foreground` is actively used in `button.tsx` and `badge.tsx`. Both are now
included above using the same resolution logic as their siblings: `muted`→`muted-surface`
(parallel to `secondary`/`accent`, all three being the same near-white slate per
`color-system.md` research.md Decision 2); `brand-foreground`→`primary-foreground` (parallel
to `destructive-foreground`, both being "text on top of a saturated fill" cases, and
`primary-foreground` is the system's designated high-contrast pairing for that purpose).

**Rationale**: Confirmed via repo search that `card`/`card-foreground` (`card.tsx`,
`bookings-page.tsx`), `secondary`/`secondary-foreground` (`button.tsx`, `badge.tsx`),
`muted` (`auth-card.tsx`, `table.tsx`, `skeleton.tsx`), `accent`/`accent-foreground`
(`button.tsx`), `destructive-foreground` (`button.tsx`, `badge.tsx`), and `brand-foreground`
(`button.tsx`, `badge.tsx`) are all actively used; `popover`/`popover-foreground` are
defined but unreferenced by any component. Aliasing (not renaming) keeps every component
className working unmodified (FR-008) while every alias resolves to a ratified role value
(FR-002). `card`/`secondary`/`muted`/`accent`→`muted-surface` all follow
`color-system.md`'s own stated purpose ("cards" explicitly named) and its research.md
Decision 2 (secondary/accent already consolidated into muted-surface; `muted` is the same
consolidation, just under its own pre-existing name). `destructive-foreground`/
`brand-foreground`→`primary-foreground` follows `color-system.md`'s own accessibility
guidance for text on a saturated fill.

**Alternatives considered**: Editing component files to reference canonical names directly
(rejected — violates FR-008); leaving these tokens on pre-refresh values (rejected —
violates FR-002, since these are the same visual surfaces under historical names).

---

## Decision 3 — Sidebar token mapping (`gridu-web`-only)

**Decision**: Alias all 8 `--sidebar*` tokens to existing canonical roles — `sidebar`→
`background`, `sidebar-foreground`→`foreground`, `sidebar-primary`→`primary`, `sidebar-
primary-foreground`→`primary-foreground`, `sidebar-accent`→`muted-surface`, `sidebar-accent-
foreground`→`foreground`, `sidebar-border`→`border`, `sidebar-ring`→`ring`.

**Rationale**: `color-system.md` research.md Decision 2 explicitly deferred this mapping to
Feature 06 ("derivable from the base roles"). Confirmed via grep that `app-shell.tsx`
actively uses `bg-sidebar`, `text-sidebar-foreground`, `bg-sidebar-accent`, `text-sidebar-
accent-foreground`, `border-sidebar-border`. Treating the sidebar as page chrome (aliased to
`background`) rather than a distinct surface keeps it visually receding, consistent with
Quiet Competence's "doesn't draw attention to itself" character, and avoids inventing a 16th
role without demonstrated need (Principle I).

**Alternatives considered**: A dedicated, visually distinct sidebar surface role (rejected —
no upstream document calls for sidebar/page visual distinction; speculative).

---

## Decision 4 — Typography token/utility naming and the FR-008/visible-rendering resolution

**Decision**: Use Tailwind v4's reserved `--text-*` + `--text-{role}--line-height` theme
namespace (generates a combined `text-{role}` utility) for the 7 sized roles; `--tracking-*`
for the 3 roles with non-zero letter-spacing; reuse Tailwind's existing `font-bold`/`font-
semibold`/`font-medium`/`font-normal` weight scale (no custom weight theme entries, since
700/600/500/400 map exactly) for component-level usage (`class="font-bold"`, etc.). The
`@layer base` bare-element rules below set `font-weight` directly via the same numeric
values (700/600/500/400), since a raw element selector cannot "apply" a utility class — it
needs the literal CSS declaration. `numeric-tabular`'s `tabular-nums lining-nums` feature is a
`@layer utilities` class, folded into `gridu-landing`'s existing `.tabular-nums` utility
definition. To make the new scale visibly render without touching component files
(FR-008), add `@layer base` rules mapping bare HTML elements to roles: `h1`/`h2`/`h3` →
`heading-page`/`heading-section`/`heading-subsection`; `body`/`p` → `body-default`; `label`
→ `label`; `small` → `caption`. `body-secondary` and `numeric-tabular` (no single natural
bare-element mapping) remain utility-class-only, for explicit adoption in Features 07-12.

**Rationale**: Reuses Tailwind v4's built-in mechanisms instead of a parallel custom scheme
(Principle I). Base-element rules are the same technique both surfaces' CSS already uses for
`body { font-family: ... }` — not a new technique, just a wider application of an existing
one — so real, visible typography ships today (User Story 2) without any component file
edit (FR-008).

**Alternatives considered**: Theme entries only, no base-element wiring (rejected — would
satisfy FR-003/FR-005 literally but leave the new scale invisible, failing User Story 2's
acceptance scenarios); editing every component file to apply new classes directly (rejected
— violates FR-008; that work belongs to Features 07-12's deliberate component rebuild).

---

## Decision 5 — `gridu-landing` dark-mode mechanism

**Context (revised after `/speckit-analyze` finding I1)**: The original draft of this
decision called for a straight *replacement* of `gridu-landing`'s `@media
(prefers-color-scheme: dark)` block with a `.dark` class block — mirroring `gridu-web`
exactly. That would have been correct for `gridu-web` (a React SPA: nothing renders at all
without JavaScript, so a JS-only dark-mode mechanism costs nothing extra) but is wrong for
`gridu-landing`, which today renders correctly with **zero JavaScript**, including following
the OS dark/light preference via `@media` alone (`CLAUDE.md`'s own stack note: "prioritize
performance, SEO, and accessibility"; `audit.md` notes its nav menu is "zero-JS"). A `.dark`
class only ever gets added by JavaScript — so a straight replacement means a visitor with
JavaScript disabled would see light mode unconditionally, even with the OS set to dark,
silently breaking a scenario that works today. This directly contradicts spec.md's own Edge
Case: "What happens on `gridu-landing` if a visitor has JavaScript disabled? → The page must
still render a theme — falling back to OS-preference-only behavior (today's behavior)
without breaking."

**Decision**: **Layer** the `.dark` class mechanism on top of the existing `@media` query
rather than replacing it — `gridu-landing` is the only surface that needs this layering;
`gridu-web` keeps its existing JS-only `.dark`-class implementation unchanged, since it has
no zero-JS scenario to protect.

```css
:root { /* light values — unconditional default */ }

/* No-JS / no-explicit-preference fallback: follow the OS preference, identical to
   today's behavior, zero JavaScript required. Gated by :not(.light) so an explicit
   light-mode choice (see below) can still override a dark OS preference. */
@media (prefers-color-scheme: dark) {
  :root:not(.light) { /* dark values */ }
}

/* JS-driven explicit override: wins regardless of OS preference, once a visitor
   has made a choice via the toggle. */
.dark { /* dark values */ }
```

A visitor's explicit choice is applied as `.dark` (force dark) or `.light` (force light,
overriding a dark OS preference via the `:not(.light)` gate) by `theme-script.ts`/
`ThemeToggle.tsx`; no class is added at all while the visitor has no stored preference,
letting the `@media` layer handle it natively. Add `src/lib/theme/theme-script.ts` mirroring
`gridu-web`'s `resolveInitialTheme` shape (stored preference wins; else no class, deferring
to the CSS `@media` fallback) — note this means the pre-paint script only needs to act when
a *stored* preference exists and differs from what `@media` would already render, since the
`@media`-only case has no flash risk by construction (the browser evaluates `@media` during
CSSOM construction, before paint, independent of JavaScript timing). The pre-paint inline
`<script>` lives in `src/layouts/BaseLayout.astro`'s `<head>` (confirmed as the actual base
layout via direct repo inspection — `LegalLayout.astro` wraps `BaseLayout.astro`, so it
needs no separate edit). Add a Preact island `ThemeToggle.tsx` wired into `Header.astro`,
toggling between adding `.dark` and `.light` (never just removing `.dark`, since the
explicit-light case must also defeat the `@media` fallback).

**Rationale**: Still a direct implementation of `color-system.md` Decision 1 (the `.dark`
class remains the single declared override mechanism for *explicit* choices on both
surfaces) — this revision only changes how the *unstated-preference* case degrades, adding a
CSS-only fallback layer that costs nothing in the JS-present case and preserves today's
zero-JS behavior in the JS-absent case. `gridu-web` is intentionally left unchanged: as a
client-rendered SPA it has no working no-JS state to protect, so adding the same layering
there would be unjustified extra complexity (Principle I) for a scenario that cannot occur.

**Alternatives considered**: Straight replacement as originally drafted (rejected per the
`/speckit-analyze` finding above — breaks a currently-working zero-JS scenario). CSS-only
toggle, e.g. a checkbox hack (rejected — cannot persist preference across visits without
`localStorage`, required for SC-003). Sharing `gridu-web`'s exact storage key via cross-repo
import (rejected — separate origins mean `localStorage` never shares regardless; a shared
constant would misleadingly imply sync that cannot occur). Applying the same `@media`-layered
fallback to `gridu-web` for consistency (rejected — `gridu-web` has no no-JS scenario to
protect; the added complexity would have no corresponding benefit there).
