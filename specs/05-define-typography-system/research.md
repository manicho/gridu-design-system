# Research: Define Typography System

All decisions below were made during `/speckit-plan` from the inputs listed in `plan.md`.
No external research tasks were required — all unknowns were resolvable from `audit.md`,
`visual-direction.md`, `identity.md`, `color-system.md`, and `constitution.md`.

## Decision 1 — Typeface

**Decision**: Keep **Inter** as the single design-system typeface (self-hosted variable
font already on both surfaces). Fallback stack: `Inter, ui-sans-serif, system-ui,
-apple-system, sans-serif`.

**Rationale**: Already proven across both surfaces with zero migration cost. Its character —
plain, high-legibility, no decorative detail — matches Quiet Competence's typographic
character description word-for-word. A typeface change would be unjustified scope expansion
beyond what Feature 03 confirmed.

**Alternatives considered**: A different high-legibility grotesque (rejected — no
identified shortfall in Inter); a second display typeface for headings only (rejected —
Quiet Competence assigns hierarchy to weight, not family; a second family is itself
decorative).

---

## Decision 2 — Semantic role inventory (8 roles)

**Decision**: 8 semantic roles — `heading-page`, `heading-section`, `heading-subsection`,
`body-default`, `body-secondary`, `label`, `caption`, `numeric-tabular`.

**Rationale**: Covers every text use observed in the audit without inventing a role for an
unseen use case (Principle I). Three heading levels match the structural depth already
implied by existing component naming, without assuming deeper hierarchy than a
single-operator dashboard needs (Principle IV). `body-secondary` pairs with the
`muted-foreground` color role from Feature 04. `numeric-tabular` generalizes the audit's
one-off `tabular-nums` utility class into a named role.

**Alternatives considered**: A 4-level heading system (rejected — no fourth heading depth
observed; speculative); merging `label` and `caption` into one role (rejected — labels need
heavier weight for interactive affordance, captions don't; one role can't serve both
purposes without violating FR-002).

---

## Decision 3 — Scale values

**Decision**:

| Role | Size | Line-height | Letter-spacing | Weight |
|---|---|---|---|---|
| `heading-page` | 2rem (32px) | 1.2 | -0.02em | 700 |
| `heading-section` | 1.5rem (24px) | 1.25 | -0.01em | 700 |
| `heading-subsection` | 1.125rem (18px) | 1.3 | 0 | 600 |
| `body-default` | 1rem (16px) | 1.5 | 0 | 400 |
| `body-secondary` | 0.875rem (14px) | 1.5 | 0 | 400 |
| `label` | 0.875rem (14px) | 1.4 | 0 | 500 |
| `caption` | 0.75rem (12px) | 1.4 | 0.01em | 400 |
| `numeric-tabular` | 1rem (16px), composes with the size of its context | 1.2 | 0 | 600 |

**Rationale**: Non-dramatic step-down between heading sizes (32→24→18px) matches Quiet
Competence's restraint. Negative letter-spacing on the two largest headings follows the
audit's own existing precedent (`CardTitle`'s `tracking-tight`) rather than inventing a new
choice. `body-default` at 16px/1.5 follows standard legibility guidance for a non-technical
persona. `body-secondary` and `label` share the 14px FR-005 floor but differ in weight
(400 vs. 500) so an interactive label reads distinctly from passive secondary text without a
size change. `caption` sits exactly at the 12px floor with slightly open tracking to remain
legible at the smallest permitted size. `numeric-tabular` defaults to body size but commonly
pairs with weight 600 so a number the owner must act on (a price, a count) is the most
glanceable thing on screen — Principle III.

**Alternatives considered**: A mathematically-generated modular scale (rejected — produces
awkward in-between sizes at this small a role count; a hand-tuned scale matching existing
component precedent is simpler, per Principle I); a 4-weight headline range including light
or black weights (rejected — Quiet Competence rules out weight-as-personality).

---

## Decision 4 — Tabular figures and overflow default

**Decision**:
- Tabular figures: `font-variant-numeric: tabular-nums lining-nums` applied to
  `numeric-tabular` text, using Inter's existing built-in OpenType feature — no second
  typeface.
- Overflow default: `body-default`, `body-secondary`, and `caption` wrap by default
  (never silently truncate). `label` may truncate with an ellipsis only in fixed-width,
  single-line contexts a component author explicitly chooses — never as the system default.

**Rationale**: Resolves the audit's one-off `tabular-nums` class into a named, reusable rule.
Wrap-by-default keeps Principle III (Outcome First) intact — an owner must see the full
client name or service description, not a clipped version, by default.

**Alternatives considered**: Truncating all roles by default (rejected — contradicts
Principle III); a dedicated monospace numeric typeface (rejected — reintroduces a second
family that Decision 1 already ruled out, when Inter's built-in feature already solves digit
alignment).
