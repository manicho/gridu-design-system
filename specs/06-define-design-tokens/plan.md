# Implementation Plan: Define Design Tokens

**Branch**: `06-define-design-tokens` | **Date**: 2026-06-30 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/06-define-design-tokens/spec.md`. Upstream
inputs: `specs/04-define-color-system/color-system.md` (Final), `specs/05-define-typography-system/typography-system.md`
(Final), `specs/00-analyze-existing-product/audit.md`, `.specify/memory/constitution.md`
v1.0.0. Current-state code inspected directly (not assumed) in `gridu-web/src/index.css`,
`gridu-landing/src/styles/global.css`, `gridu-web/src/lib/theme/` (existing dark-mode
mechanism), and component usages of token classes across both repos.

## Summary

Ship the ratified color and typography systems (Features 04, 05) as real, rendered values on
both consuming surfaces, from one canonical source. Concretely: create a canonical
`tokens.css` in `gridu-design-system` containing the 15 color roles and the 8 typography
roles as CSS custom properties / Tailwind v4 theme entries; update `gridu-web/src/index.css`
and `gridu-landing/src/styles/global.css` to the same values (replacing the pre-refresh
palette and adding the previously-nonexistent type scale); give `gridu-landing` the same
`.dark`-class override mechanism `gridu-web` already implements, layered on top of (not
replacing) its existing `@media (prefers-color-scheme: dark)` fallback so OS-preference dark
mode keeps working with JavaScript disabled — including a visitor-facing toggle and a
pre-paint script preventing a flash of the wrong theme. No component `.tsx`/`.astro` files
are edited — every change lands in CSS
custom properties, Tailwind theme entries, or new theme-toggle infrastructure, so existing
component class references (`bg-card`, `text-destructive-foreground`, etc.) pick up the new
values without modification.

## Technical Context

**Language/Version**: CSS (Tailwind CSS v4 `@theme inline` token layer) on both consuming
surfaces; a small vanilla-JS pre-paint script and a Preact island for the `gridu-landing`
theme toggle (matching its existing island pattern, e.g. `ChatDemo`).

**Primary Dependencies**: None new. `gridu-web` already has Tailwind v4 + a working
React-based theme system (`src/lib/theme/theme-context.tsx`, `theme-script.ts`) to mirror.
`gridu-landing` already has Tailwind v4 + `@astrojs/preact` islands (used today for
`ChatDemo.tsx`) to mirror for its new toggle.

**Storage**: N/A for the color/typography deliverable. `gridu-landing`'s new theme
preference uses `localStorage`, mirroring `gridu-web`'s `THEME_STORAGE_KEY` pattern (separate
origins, so no cross-surface storage sharing is implied or required).

**Testing**: No automated tests for the canonical `tokens.css` (a values file). For the
`gridu-landing` toggle, mirror `gridu-web`'s existing test coverage pattern
(`theme-context.test.tsx`) at a scope appropriate to the simpler vanilla-JS/Preact
implementation — exact test scope is a Feature 06 implementation detail, not re-litigated
here.

**Target Platform**: Three repos — `gridu-design-system` (canonical source), `gridu-web`
(React 19 + Vite + Tailwind v4), `gridu-landing` (Astro + Preact islands + Tailwind v4).

**Project Type**: Cross-repo token propagation — the first feature in this epic whose
deliverable is not solely a Markdown document.

**Performance Goals**: N/A for token values. The `gridu-landing` pre-paint script must be a
small, synchronous, non-module inline `<script>` (mirroring `gridu-web`'s documented
constraint in `theme-script.ts`) so it does not block first paint or introduce a flash of
the wrong theme.

**Constraints**: Zero component-level (`.tsx`/`.astro`) file edits for the color/typography
value change itself (FR-008) — all value changes land in CSS custom properties and Tailwind
theme entries only. No new spacing/sizing/radius tokens (FR-009). `gridu-landing`'s existing
zero-JS-by-default posture (audit.md) is preserved for OS-preference dark mode — a CSS-only
`@media` fallback layer keeps that working with JavaScript disabled (research.md Decision 5,
revised after `/speckit-analyze` finding I1); JavaScript is required only for the new
*manual* toggle and explicit-preference persistence, which did not exist at all before this
feature, so nothing already zero-JS becomes JS-dependent.

**Scale/Scope**: 15 color roles × 2 modes + 19 alias tokens (11 shared
card/popover/secondary/muted/accent/destructive-foreground/brand-foreground group names + 8
`gridu-web`-only sidebar names — `muted` and `brand-foreground` were added during
`/speckit-implement` after a broader repo grep surfaced them; see research.md Decision 2's
Correction note) × 2 modes; 8 typography
roles; 1 new dark-mode toggle + pre-paint script + CSS fallback layer on `gridu-landing`.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Result | Reasoning |
|---|---|---|
| I. Default Over Configure | PASS | The canonical token source is a plain CSS file consumed by literal value-sync, not a new build/publish pipeline with configuration surface (Research Decision 1). Typography utilities reuse Tailwind's existing `font-bold`/`font-semibold` weight scale rather than inventing a parallel one (Research Decision 4). |
| II. Fail Loud, Never Silent | N/A | This feature changes token values and a theme mechanism, not booking-affecting behavior. No structural conflict. |
| III. Outcome First | PASS | The `gridu-landing` toggle is a single, direct control (on/off), not a multi-step settings flow — the visible outcome (theme changed) is immediate, consistent with how `gridu-web`'s existing toggle behaves. |
| IV. Scale To One, Not A Thousand | PASS | Research Decision 1 explicitly defers real package distribution (npm workspace, publish/version pipeline) — that infrastructure is not built speculatively here; a plain canonical CSS file is sufficient for two consumers today, per the epic's own Phase 1 checkpoint note. |
| V. Calm Under Pressure | PASS | No new alarmed or decorative treatment is introduced; the toggle is a plain, expected control mirroring `gridu-web`'s existing even-keeled implementation. |

No violations. Complexity Tracking section omitted.

## Project Structure

### Documentation (this feature)

```text
specs/06-define-design-tokens/
├── plan.md              # This file
├── research.md          # Phase 0 output — 5 decisions: canonical source format,
│                         #   gridu-web alias mapping, sidebar mapping, typography
│                         #   token/utility naming, gridu-landing dark-mode mechanism
├── data-model.md         # Phase 1 output — Canonical Token, Token Alias, Surface entities
├── quickstart.md          # Phase 1 output — validation checks across all 3 repos
└── tasks.md               # Phase 2 output (/speckit-tasks — NOT created here)
```

### Source Code (repository root and cross-repo)

```text
gridu-design-system/
└── tokens/
    └── tokens.css        # NEW — canonical source: 15 color roles (light+dark) +
                           #   8 typography roles, as CSS custom properties / Tailwind
                           #   v4 theme entries. The single source both surfaces sync from.

gridu-web/src/
└── index.css              # MODIFIED — color values updated to match tokens.css exactly;
                            #   gridu-web-specific aliases (card, popover, secondary, accent,
                            #   destructive-foreground, sidebar*) added, pointing at the
                            #   canonical roles; typography theme entries added; base-element
                            #   defaults (h1/h2/h3/body/label/small) added in @layer base.
                            #   No other gridu-web file is modified.

gridu-landing/
├── src/styles/
│   └── global.css          # MODIFIED — same color/typography sync as gridu-web (minus
│                            #   sidebar aliases, which don't apply); `.dark` class block
│                            #   ADDED alongside the existing `@media (prefers-color-scheme:
│                            #   dark)` block (gated `:not(.light)`), not a replacement —
│                            #   preserves zero-JS OS-preference dark mode (research.md
│                            #   Decision 5, revised after /speckit-analyze finding I1);
│                            #   `.tabular-nums` utility gains `lining-nums`.
├── src/lib/theme/
│   └── theme-script.ts     # NEW — pre-paint theme resolution: applies `.dark`/`.light`
│                            #   only when a stored preference exists; mirrors gridu-web's
│                            #   src/lib/theme/theme-script.ts shape (separate localStorage
│                            #   key scope; no cross-origin sharing).
├── src/components/islands/
│   └── ThemeToggle.tsx      # NEW — Preact island toggle control, mirroring gridu-web's
│                            #   theme-toggle.tsx UX, added to Header.astro.
├── src/i18n/
│   └── es-CL.ts             # MODIFIED — new `theme` entry (switchToDark/switchToLight
│                            #   strings) for the toggle's accessible label, per the
│                            #   project's i18n convention (no hardcoded UI strings).
│                            #   New theme-toggle infrastructure, not a pre-existing
│                            #   component edit — found necessary during implementation.
└── src/layouts/
    └── BaseLayout.astro    # MODIFIED — pre-paint inline <script> added to <head>,
                             #   mirroring gridu-web's index.html inline script.
                             #   LegalLayout.astro wraps BaseLayout.astro and needs no
                             #   separate edit.
```

**Structure Decision**: One new file in `gridu-design-system` (the canonical source) plus
targeted, additive modifications to existing token/theme files in `gridu-web` and
`gridu-landing`. No component (`.tsx` business-logic or `.astro` page/section) file is
modified except the two new files required to give `gridu-landing` a toggle control
(`ThemeToggle.tsx`, `theme-script.ts`) and the one-line addition wiring that toggle into the
existing `Header.astro` — required by FR-006 and explicitly distinct from the FR-008
prohibition, which targets pre-existing Card/Input/Badge styling drift, not new
theme-infrastructure files.

---

## Phase 0 Research

### Decision 1 — Canonical token source format and location

**Context**: `audit.md`'s Gaps section flags "No design tokens shared as a package — only
as copy-pasted CSS." `gridu-design-system` currently has no `package.json`, no build
tooling, and no npm-workspace relationship with `gridu-web` or `gridu-landing` — it has been
a pure Spec Kit documentation repo through Features 00-05. Setting up real package
distribution (an installable, versioned `gridu-design-system` npm package that `gridu-web`/
`gridu-landing` `import`) is a meaningfully larger infrastructure change than anything built
so far in this epic.

**Decision**: The canonical source is a plain CSS file, `gridu-design-system/tokens/tokens.css`,
containing the 15 color roles (light + dark) and the 8 typography roles as Tailwind v4
theme-compatible CSS custom properties. `gridu-web` and `gridu-landing` each copy these exact
values into their own token files (`index.css`, `global.css`) — the file is the documented,
single point of truth that both surfaces' values must match exactly, verified at `tasks.md`'s
validation step; it is not yet consumed via package import.

**Rationale**: The epic tracker's own Phase 1 checkpoint note ("cut a version of
`gridu-design-system` once this phase is `Done` — Phase 2a/2b consume it as a dependency")
places real package consumption at the Phase 0→Phase 1 boundary, after the *component*
library (Features 07-12) exists — not at Feature 06, which only carries tokens. Building
publish/version tooling now, before there is a component library to justify installing the
package for, would be speculative infrastructure ahead of a demonstrated need (Principle IV).
A canonical CSS file still resolves the actual problem `audit.md` flagged: today there is no
single documented source at all; both surfaces independently hand-author identical-looking
blocks. After this feature, there is exactly one authored source, and both surfaces'
blocks are verified against it.

**Alternatives considered**: Real npm package with a build step and workspace install:
rejected for now — correctly sequenced at the Phase 1 checkpoint per the epic tracker, not
this feature. A JSON token format (e.g. Style Dictionary input) requiring a build/transform
step on each surface: rejected — neither surface has a token-build pipeline today, and
introducing one is exactly the kind of premature tooling Principle IV warns against when a
plain CSS file already satisfies every functional requirement in spec.md.

---

### Decision 2 — Alias mapping for `gridu-web` tokens not named in `color-system.md`

**Context**: `color-system.md`'s 15-role inventory (background, foreground, muted-surface,
muted-foreground, border, input, ring, primary, primary-foreground, brand, brand-strong,
brand-subtle, destructive, warning, success) does not include several token names
`gridu-web`'s current `index.css` defines and its components actively reference: `card`,
`card-foreground` (used in `card.tsx`, `bookings-page.tsx`), `popover`/`popover-foreground`
(defined but **not referenced by any component** — confirmed by repo search), `secondary`/
`secondary-foreground` (used in `button.tsx`, `badge.tsx`), `accent`/`accent-foreground`
(used in `button.tsx`), and `destructive-foreground` (used in `button.tsx`, `badge.tsx`).
FR-008 prohibits editing component files to point at new token names, so these names must
keep resolving to a value — just the *new*, Quiet-Competence-correct value.

**Decision**: Alias each name to a canonical role's value rather than renaming it:

| Existing token | Aliases to | Rationale |
|---|---|---|
| `card` | `muted-surface` | `color-system.md` explicitly names "cards" as one of `muted-surface`'s purposes. |
| `card-foreground` | `foreground` | Card titles/primary content are primary text, not secondary/muted text. |
| `popover` | `background` | Unused by any component today (confirmed); aliased for safety/shadcn-boilerplate compatibility only. |
| `popover-foreground` | `foreground` | Same as above. |
| `secondary` | `muted-surface` | Matches `color-system.md` research.md Decision 2, which already consolidated `--secondary`/`--accent` into `muted-surface`. |
| `secondary-foreground` | `foreground` | Parallel to `card-foreground`'s reasoning. |
| `accent` | `muted-surface` | Same consolidation as `secondary` (Decision 2, Feature 04). |
| `accent-foreground` | `foreground` | Parallel to `card-foreground`'s reasoning. |
| `destructive-foreground` | `primary-foreground` | `color-system.md`'s own `destructive` role documentation states explicitly: "As a fill/background: use `primary-foreground` for text on top." |

**Rationale**: This keeps every existing component className (`bg-card`, `text-secondary-
foreground`, `bg-destructive text-destructive-foreground`, etc.) working unmodified — zero
component file edits — while every alias resolves to a value that *is* part of the ratified
15-role system. No new visual role is invented; aliases are pure value-redirection.

**Alternatives considered**: Editing component files to reference the canonical role names
directly (e.g. `bg-card` → `bg-muted-surface`): rejected — directly violates FR-008. Leaving
`card`/`secondary`/`accent`/etc. on their pre-refresh values: rejected — directly violates
FR-002 ("every color role... replacing the pre-refresh palette") since these are the same
visual surfaces color-system.md already covers under different historical names.

---

### Decision 3 — Sidebar token mapping (`gridu-web`-only)

**Context**: `color-system.md` research.md Decision 2 explicitly defers this: "`--sidebar*`
tokens are omitted: they are gridu-web surface-specific... and are derivable from the base
roles in Feature 06." `app-shell.tsx` actively uses `bg-sidebar`, `text-sidebar-foreground`,
`bg-sidebar-accent`, `text-sidebar-accent-foreground`, `border-sidebar-border`. `gridu-landing`
has no sidebar UI and needs no equivalent mapping.

**Decision**:

| Sidebar token | Aliases to |
|---|---|
| `sidebar` | `background` |
| `sidebar-foreground` | `foreground` |
| `sidebar-primary` | `primary` |
| `sidebar-primary-foreground` | `primary-foreground` |
| `sidebar-accent` | `muted-surface` |
| `sidebar-accent-foreground` | `foreground` |
| `sidebar-border` | `border` |
| `sidebar-ring` | `ring` |

**Rationale**: The sidebar is page chrome, not a distinct surface — aliasing it to
`background` rather than inventing a 16th role keeps it visually receding ("doesn't draw
attention to itself," visual-direction.md §A Mood/Character) and satisfies Principle I
(reuse an existing role; don't add a new one without demonstrated need for a visually
distinct sidebar treatment). `sidebar-accent` (the active-nav-item state) maps to
`muted-surface`, the same role used for hover/selected states elsewhere, keeping the active
nav item's visual treatment consistent with the rest of the system rather than introducing a
sidebar-specific accent color.

**Alternatives considered**: A dedicated sidebar color role (e.g. a slightly distinct
background tone): rejected — no evidence in any upstream document (identity.md,
visual-direction.md, color-system.md) calls for the sidebar to be visually distinct from the
page background; inventing one would be speculative (Principle I).

---

### Decision 4 — Typography token and utility naming; resolving the FR-008/visible-rendering tension

**Context**: FR-008 prohibits component-level file edits. FR-003/FR-005 require the
typography scale to be available "for component use," and User Story 2's Acceptance
Scenario 3 requires headings/body/label/numeric text to *visibly* render with the new
values. Unlike color, no existing component className already points at a typography token
(no type scale exists in code today, per `audit.md`) — so without *some* default wiring,
the new roles would be defined but invisible, satisfying FR-003/FR-005's letter while
failing US2's visible-rendering requirement.

**Decision**:
- Define each of the 7 sized roles (`heading-page`, `heading-section`, `heading-subsection`,
  `body-default`, `body-secondary`, `label`, `caption`) using Tailwind v4's reserved
  `--text-*` theme namespace, paired with `--text-{role}--line-height`, generating one
  `text-{role}` utility per role that sets font-size + line-height together (Tailwind v4's
  built-in mechanism for this exact pairing). The 3 roles with non-zero letter-spacing use
  the `--tracking-*` namespace (`tracking-{role}` utilities). Weight reuses Tailwind's
  existing `font-bold`/`font-semibold`/`font-medium`/`font-normal` scale — no custom weight
  theme entries, since 700/600/500/400 already map onto it exactly.
- `numeric-tabular`'s feature (`tabular-nums lining-nums`) is a fixed feature toggle, not a
  themeable scale value — defined as a small `.numeric-tabular` utility class in
  `@layer utilities`, parallel to `gridu-landing`'s existing hand-written `.tabular-nums`
  utility (which gains `lining-nums` as part of this same edit — a token/utility-layer
  change, not a component file edit, so `PricingPlans.tsx`'s existing `tabular-nums`
  className automatically benefits).
- To resolve the FR-008/visible-rendering tension without touching component files: add
  `@layer base` rules mapping the new theme variables onto bare HTML elements —
  `h1`/`h2`/`h3` → `heading-page`/`heading-section`/`heading-subsection`; `body`, `p` →
  `body-default`; `label` → `label`; `small` → `caption`. These are base-stylesheet rules
  (the same mechanism `index.css`/`global.css` already use for `body { font-family: ... }`),
  not edits to any `.tsx`/`.astro` file — so every bare heading/paragraph/label element gets
  the correct default typography immediately, with zero component file changes, while
  `body-secondary` and `numeric-tabular` (which have no single natural bare-element mapping)
  remain available as utility classes for explicit, future per-component adoption in
  Features 07-12.

**Rationale**: This reuses Tailwind v4's own built-in mechanisms instead of inventing a
parallel custom-property scheme (Principle I). The base-element default strategy delivers
real, visible typography today (satisfying US2) using only base-layer CSS, not component
files (satisfying FR-008) — the same pattern already used for `font-family` on `body` in
both surfaces' current CSS, so it is not a new technique, just a wider application of an
existing one.

**Alternatives considered**: Defining the roles as theme entries only, with no base-element
wiring: rejected — would satisfy FR-003/FR-005 literally but fail US2's visible-rendering
acceptance scenarios entirely (the values would exist but render nowhere). Editing every
component file to apply the new utility classes directly: rejected — directly violates
FR-008 and is properly the work of Features 07-12, which will deliberately review and
rebuild components against the design system rather than have this token feature touch them
piecemeal.

---

### Decision 5 — `gridu-landing` dark-mode mechanism

**Context**: `color-system.md` Decision 1 already ratified the `.dark` class mechanism for
both surfaces. `gridu-landing` currently has `@media (prefers-color-scheme: dark) { :root {
... } }` and no toggle, no stored preference, and no pre-paint script (confirmed: no `dark`-
related file exists in `gridu-landing/src`). `gridu-web` already has a complete, tested
implementation (`theme-script.ts`'s `resolveInitialTheme`, `theme-context.tsx`'s
`ThemeProvider`, a pre-paint inline `<script>` in `index.html`) to mirror — but `gridu-web`
is a React SPA with no working no-JavaScript state to protect, while `gridu-landing` renders
correctly today with zero JavaScript, including OS-preference dark mode via `@media` alone.

**Decision (revised after `/speckit-analyze` finding I1)**: **Layer** the `.dark` class
mechanism on top of `gridu-landing`'s existing `@media` block rather than replacing it — a
straight replacement would mean a visitor with JavaScript disabled always sees light mode,
breaking a scenario that works today and contradicting spec.md's own Edge Case requirement.
The `@media` block is gated `:not(.light)` so it still governs by default (zero JS) but can
be overridden by an explicit `.light` choice. `gridu-web` is left unchanged — it has no
no-JS scenario to protect, so the extra layering would be unjustified complexity there.

Add `gridu-landing/src/lib/theme/theme-script.ts`, mirroring `gridu-web`'s
`resolveInitialTheme` shape but only acting when a *stored* preference exists (the
no-preference case needs no script at all — `@media` resolves it natively, with no flash
risk, since the browser evaluates `@media` during CSSOM construction before paint). Add the
pre-paint inline `<script>` to `gridu-landing/src/layouts/BaseLayout.astro`'s `<head>`
(confirmed via direct repo inspection as the actual base layout; `LegalLayout.astro` wraps
it and needs no separate edit). Add a small Preact island,
`src/components/islands/ThemeToggle.tsx`, applying `.dark` or `.light` explicitly (never
just removing `.dark`, since the light-override case must also defeat the `@media`
fallback), wired into `Header.astro` — `gridu-landing` already uses Preact islands for
interactive elements (`ChatDemo.tsx`), so this follows an established local pattern. Full
CSS structure and rationale: research.md Decision 5.

**Rationale**: Still a direct implementation of `color-system.md` Decision 1 — the `.dark`
class remains the single declared mechanism for *explicit* visitor choices on both surfaces.
This revision only changes how the unstated-preference case degrades, adding a CSS-only
fallback that costs nothing when JS is present and preserves today's zero-JS behavior when
it isn't.

**Alternatives considered**: Straight replacement as originally planned (rejected — breaks a
currently-working zero-JS scenario, per `/speckit-analyze` finding I1). A CSS-only toggle
(e.g. a checkbox hack) avoiding JavaScript entirely: rejected — cannot persist the preference
across page loads/visits without JavaScript (`localStorage`), required for SC-003. Sharing
`gridu-web`'s exact `THEME_STORAGE_KEY` constant via cross-repo import: rejected — separate
origins mean `localStorage` never shares regardless. Applying the same `@media`-layered
fallback to `gridu-web` for consistency: rejected — `gridu-web` has no no-JS scenario to
protect, so the added complexity would have no corresponding benefit.

---

## Constitution Re-Check — Post Phase 1 Design

*Required by constitution.md Development Workflow §MUST after Phase 1 design artifacts
(data-model.md, quickstart.md) are produced.*

| Principle | Result | Reasoning |
|---|---|---|
| I. Default Over Configure | PASS | data-model.md's alias entities resolve to exactly one canonical value each — no component author chooses between alternatives. Typography utilities reuse Tailwind's built-in weight scale rather than a parallel custom one. |
| II. Fail Loud, Never Silent | N/A | Unchanged — no booking-affecting behavior in this design. |
| III. Outcome First | PASS | quickstart.md's toggle validation confirms the theme changes immediately on interaction, with the result (the new theme) visible before any explanation would be needed. |
| IV. Scale To One, Not A Thousand | PASS | Phase 1 design introduces no package/build infrastructure — the canonical source remains a single CSS file (Decision 1), consistent with the epic's own sequencing of real package distribution to the Phase 1 checkpoint. |
| V. Calm Under Pressure | PASS | No new design element introduced in Phase 1 (aliases, base-element rules, toggle) relies on alarmed or decorative treatment; the toggle UX mirrors `gridu-web`'s existing plain, even-keeled control. |

No new violations. Phase 1 design is constitutionally compliant.
