# Data Model: Define Design Tokens

## Entities

### Canonical Token

A single color or typography role value, authored once in
`gridu-design-system/tokens/tokens.css` and matched exactly by every consuming surface.

| Field | Type | Required | Description |
|---|---|---|---|
| `name` | string | yes | The role name from `color-system.md` or `typography-system.md` (e.g. `muted-surface`, `heading-page`) |
| `kind` | enum | yes | `color` or `typography` |
| `light_value` / `dark_value` | string | color only | OKLCH value, copied verbatim from `color-system.md` |
| `size` / `line_height` / `letter_spacing` | string | typography only | Copied verbatim from `typography-system.md` |
| `tailwind_namespace` | enum | typography only | `--text-*`, `--tracking-*`, or `utility-class` (for `numeric-tabular`) — per research.md Decision 4 |
| `source` | string | yes | `color-system.md` or `typography-system.md`, the upstream document this value is copied from |

**Complete set**: 15 color roles (research.md Decision 1, sourced from `color-system.md`'s
Quick Reference) + 8 typography roles (sourced from `typography-system.md`'s Quick
Reference).

---

### Token Alias

A pre-existing token name, actively referenced by `gridu-web` component code, that does not
appear in the canonical 15-role color inventory. An alias redirects an existing name to a
Canonical Token's value without renaming it — preserving every component className
unmodified (FR-008).

| Field | Type | Required | Description |
|---|---|---|---|
| `existing_name` | string | yes | The pre-existing CSS custom property name (e.g. `card`, `sidebar-accent`) |
| `resolves_to` | string | yes | The Canonical Token `name` this alias points to (e.g. `muted-surface`) |
| `surface` | enum | yes | `gridu-web-only` (sidebar group) or `gridu-web-and-landing` (card/popover/secondary/muted/accent/destructive-foreground/brand-foreground group — `gridu-landing` defines these same names too, even though only `gridu-web`'s sidebar group is unique to it) |
| `confirmed_usage` | string | yes | The component file(s) confirmed (via repo search) to reference this name, or `unreferenced` (e.g. `popover`) |

**Complete set** (research.md Decisions 2 and 3, corrected during `/speckit-implement` to
add `muted` and `brand-foreground`, both missed in the original research pass — see
research.md Decision 2's "Correction" note): `card`, `card-foreground`, `popover`,
`popover-foreground`, `secondary`, `secondary-foreground`, `muted`, `accent`,
`accent-foreground`, `destructive-foreground`, `brand-foreground` (11 aliases, both
surfaces), plus `sidebar`, `sidebar-foreground`, `sidebar-primary`,
`sidebar-primary-foreground`, `sidebar-accent`, `sidebar-accent-foreground`,
`sidebar-border`, `sidebar-ring` (8 aliases, `gridu-web`-only) — 19 total.

---

### Token Consumer (Surface)

A repo that implements Canonical Token and Token Alias values in its own styling layer.

| Field | Type | Required | Description |
|---|---|---|---|
| `repo` | enum | yes | `gridu-web` or `gridu-landing` |
| `token_file` | string | yes | `src/index.css` (gridu-web) or `src/styles/global.css` (gridu-landing) |
| `dark_mode_mechanism` | enum | yes | `.dark` class (both, after this feature — `gridu-landing` previously used `@media`) |
| `has_toggle` | boolean | yes | `gridu-web`: already true. `gridu-landing`: false → true as a result of this feature |
| `base_element_rules` | boolean | yes | Whether `@layer base` rules map bare HTML elements to typography roles (research.md Decision 4) — true for both surfaces after this feature |

---

### Theme Toggle (gridu-landing only)

The new dark-mode control infrastructure being added to `gridu-landing`. Its JS-driven
explicit-override behavior mirrors `gridu-web`'s existing implementation; its no-JS
fallback layer (a `gridu-landing`-only addition — see research.md Decision 5) does not
apply to `gridu-web`, which has no working no-JS state to protect.

| Field | Type | Required | Description |
|---|---|---|---|
| `storage_key` | string | yes | A `localStorage` key, structurally mirroring `gridu-web`'s `THEME_STORAGE_KEY` pattern (not shared cross-origin — see research.md Decision 5) |
| `resolution_script` | string | yes | Path to the pre-paint resolution logic (`src/lib/theme/theme-script.ts`); only needs to act when a stored preference exists, since the no-preference case is handled by the CSS `@media` fallback with no JS involvement |
| `toggle_component` | string | yes | Path to the visitor-facing control (`src/components/islands/ThemeToggle.tsx`); applies `.dark` or `.light` explicitly, never just removes `.dark` |
| `resolution_order` | string | yes | Explicit stored preference (`.dark`/`.light` class) wins; otherwise no class is applied and the `@media (prefers-color-scheme: dark)` CSS fallback governs natively — works with or without JavaScript |
| `no_js_fallback` | boolean | yes | `true` — `gridu-landing`'s `@media` block remains live (gated by `:not(.light)`) so OS-preference dark mode still works with JavaScript disabled, preserving today's behavior (resolves `/speckit-analyze` finding I1) |

---

## Relationships

```
Canonical Token (tokens.css)
  ├── consumed directly by → Token Consumer (gridu-web, gridu-landing)
  └── pointed at by → Token Alias (existing names with no canonical equivalent)
                          └── consumed by → Token Consumer (component classNames unchanged)

Token Consumer (gridu-landing)
  └── gains → Theme Toggle (new dark-mode infrastructure)
```

## State Lifecycle

```
Draft → Final
```

Mirrors Features 04/05: no mid-stream owner-confirmation gate is required — the color and
typography directions were already confirmed in their respective features. This feature
implements those ratified decisions; it does not propose new ones (aside from the necessary
implementation-level decisions in research.md, which are derivable defaults, not new brand
direction).

**Draft**: `tokens.css` is being written; surface files are being updated.
**Final**: `tokens.css` contains all 15 color + 8 typography roles; both surfaces' token
files match it exactly for every shared role; all aliases resolve correctly;
`gridu-landing`'s `.dark` mechanism and toggle are implemented; all quickstart.md checks
pass.
