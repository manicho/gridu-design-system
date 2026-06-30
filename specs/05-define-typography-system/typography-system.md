# Typography System: gridu

**Version**: 1.0.0
**Status**: Final
**Typeface**: Inter (self-hosted variable font, already in use on both surfaces)
**Fallback Stack**: `Inter, ui-sans-serif, system-ui, -apple-system, sans-serif`
**Minimum Size Floor**: 12px (0.75rem) general floor for `label`/`caption`; 14px (0.875rem) floor for `body-default`/`body-secondary`
**Source**: `specs/03-research-visual-direction/visual-direction.md` (Quiet Competence, owner-confirmed 2026-06-29); `specs/04-define-color-system/color-system.md` (Final); `specs/00-analyze-existing-product/audit.md`

---

## Quick Reference

| Role | Size | Line-height | Letter-spacing | Weight | Overflow |
|---|---|---|---|---|---|
| `heading-page` | 2rem (32px) | 1.2 | -0.02em | 700 | wrap |
| `heading-section` | 1.5rem (24px) | 1.25 | -0.01em | 700 | wrap |
| `heading-subsection` | 1.125rem (18px) | 1.3 | 0 | 600 | wrap |
| `body-default` | 1rem (16px) | 1.5 | 0 | 400 | wrap |
| `body-secondary` | 0.875rem (14px) | 1.5 | 0 | 400 | wrap |
| `label` | 0.875rem (14px) | 1.4 | 0 | 500 | wrap (truncate-optional) |
| `caption` | 0.75rem (12px) | 1.4 | 0.01em | 400 | wrap |
| `numeric-tabular` | 1rem (16px), composes with context | 1.2 | 0 | 600 | wrap |

All roles use the single typeface declared above. Font family is therefore omitted from
the per-role tables below — it is never a per-role decision in this system.

---

## Headings

Heading roles step down by a comfortable, non-dramatic ratio (32→24→18px), consistent with
Quiet Competence's restraint — no oversized display heading competing with content.

### `heading-page`

**Size**: 2rem (32px) | **Line-height**: 1.2 | **Letter-spacing**: -0.02em | **Weight**: 700

**Purpose**: Page-level title — the top-level heading on a dashboard page or a primary
marketing section.

**Character**: The largest, heaviest role in the system, but restrained relative to typical
display type — no decorative treatment, no secondary color, no oversized scale jump beyond
what hierarchy requires. Trace: "Weight variation is used for hierarchy (what to read first)
not for personality (what to feel)... Nothing in the type draws the eye before the words do"
(visual-direction.md §A Typographic character). The tightened letter-spacing follows standard
optical tightening practice for large sizes and matches the existing `tracking-tight`
precedent already used on `CardTitle` (audit.md Typography section) — this role generalizes
an already-validated local choice rather than inventing a new one.

**Overflow**: `wrap` — never silently truncated; a page title is always fully visible.

---

### `heading-section`

**Size**: 1.5rem (24px) | **Line-height**: 1.25 | **Letter-spacing**: -0.01em | **Weight**: 700

**Purpose**: Section-level heading within a page — groups a distinct block of related
content under one page.

**Character**: Same weight as `heading-page` (700) but one size step down and with less
letter-space tightening — hierarchy between the two heading levels comes from size, not a
weight change, keeping the weight vocabulary narrow per Quiet Competence's "weight variation
... not for personality." Trace: same passage as `heading-page`; also the existing
`tracking-tight` precedent (audit.md).

**Overflow**: `wrap` — never silently truncated.

---

### `heading-subsection`

**Size**: 1.125rem (18px) | **Line-height**: 1.3 | **Letter-spacing**: 0 | **Weight**: 600

**Purpose**: Subsection heading, card title — the smallest heading role, used for
component-level groupings (e.g. a `CardTitle`).

**Character**: Weight steps down to 600 (from 700) and letter-spacing returns to neutral
(0) — at this size, further tightening would reduce legibility rather than add polish. This
matches the existing `CardTitle` implementation observed in the audit
(`font-semibold leading-none tracking-tight` — `font-semibold` = weight 600), so this role
formalizes existing practice rather than changing it. Trace: "Weight variation is used for
hierarchy... not for personality" (visual-direction.md §A Typographic character).

**Overflow**: `wrap` — never silently truncated.

---

## Body & Text

Body and text roles carry the bulk of reading content. None use a weight above 500 — weight
is reserved for headings and the numeric-tabular role, keeping body text plain and
unobtrusive per Quiet Competence's "Plain, high-legibility letterforms with no decorative
detail."

### `body-default`

**Size**: 1rem (16px) | **Line-height**: 1.5 | **Letter-spacing**: 0 | **Weight**: 400

**Purpose**: Primary reading text — the default body copy color/size for any content that is
not secondary or muted. Pairs with the `foreground` color role (`color-system.md`).

**Character**: Standard body-text legibility sizing (16px / 1.5 line-height) for a
non-technical target persona (`identity.md` Target Persona). No decorative detail, no
weight above regular — "nothing in the type draws the eye before the words do"
(visual-direction.md §A Typographic character).

**Floor check**: 16px ≥ 14px (0.875rem) body floor — PASS.

**Overflow**: `wrap` — text is never silently cut off. Consistent with Principle III
(Outcome First, constitution.md): an owner reading a client name or service description
must see the full text, not a clipped version, by default.

---

### `body-secondary`

**Size**: 0.875rem (14px) | **Line-height**: 1.5 | **Letter-spacing**: 0 | **Weight**: 400

**Purpose**: Secondary/supporting text — content that is present but not the primary
reading target. Pairs with the `muted-foreground` color role (`color-system.md`), giving
secondary text both a size answer (this role) and a color answer (Feature 04) instead of
one role serving both.

**Character**: Same weight and line-height as `body-default`, one size step down. The
reduced size, not a reduced weight, signals "secondary" — keeping weight reserved for
headings and numeric emphasis only. Trace: "comfortable but efficient... not so much that it
signals 'take your time'" (visual-direction.md §A Spacing/density, applied to text
hierarchy).

**Floor check**: 14px = 14px (0.875rem) body floor — PASS (at floor).

**Overflow**: `wrap` — same rationale as `body-default`.

---

### `label`

**Size**: 0.875rem (14px) | **Line-height**: 1.4 | **Letter-spacing**: 0 | **Weight**: 500

**Purpose**: Text on or naming an interactive element — form field labels, button text,
badge text. The one body-scale role with a weight above 400, used to signal interactive
affordance.

**Character**: Shares `body-secondary`'s 14px size but uses weight 500 instead of 400 — an
interactive label needs to read as "actionable" without crossing into heading territory
(600+). This is the system's only deliberate weight differentiation at body scale, kept to a
single step (400 → 500) per Quiet Competence's narrow, functional weight vocabulary.

**Floor check**: 14px ≥ 12px (0.75rem) general floor — PASS.

**Overflow**: `wrap` by default. `label` is the only role permitted optional truncation —
`text-overflow: ellipsis; white-space: nowrap; overflow: hidden` — and only in fixed-width,
single-line contexts a component author explicitly chooses (e.g. a table column header).
This is never the role's own default; it is an opt-in a component author selects
deliberately, consistent with Principle III (Outcome First) — truncation is the exception,
not the rule.

---

### `caption`

**Size**: 0.75rem (12px) | **Line-height**: 1.4 | **Letter-spacing**: 0.01em | **Weight**: 400

**Purpose**: Smallest informational text — metadata, helper text, fine print. The smallest
role in the system, sitting exactly at the general size floor.

**Character**: Slightly open letter-spacing (0.01em, the only positive tracking value in
the system) compensates for the reduced size to preserve legibility at the smallest
permitted size — a functional adjustment, not a decorative one. Trace: "Plain,
high-legibility letterforms with no decorative detail" (visual-direction.md §A Typographic
character) — the open tracking exists to keep the smallest text readable, not to add
character.

**Floor check**: 12px = 12px (0.75rem) general floor — PASS (at floor, the system minimum).

**Overflow**: `wrap` — never silently truncated, consistent with the other informational
roles.

---

## Numeric

### `numeric-tabular`

**Size**: 1rem (16px) default, composes with the size of its surrounding context for
emphasis displays | **Line-height**: 1.2 | **Letter-spacing**: 0 | **Weight**: 600

**Purpose**: Standalone numeric displays needing fixed digit widths — prices, counts,
durations. Generalizes the audit's one-off `tabular-nums` utility class
(`PricingPlans.tsx`) into a named, reusable role.

**Numeric feature**: `font-variant-numeric: tabular-nums lining-nums` — uses Inter's
existing built-in OpenType tabular-figure feature. This is a feature applied within the
existing typeface, not a second font family (see Typeface Decision below).

**Character**: Weight 600 — heavier than body text, lighter than the two largest headings —
so a number the owner must act on (a price, a count) reads as a distinct, glanceable value.
Trace: Principle III (Outcome First, constitution.md) — a number the owner needs to act on
should be the easiest thing on the screen to find, and "confirms and moves on"
(visual-direction.md §A Identity trace, from identity.md Personality) supports a plain,
immediately-legible numeric presentation rather than a decorative one.

**Floor check**: 16px (default) ≥ 14px body floor — PASS. When composed with a smaller
context size, the composing role's own floor check applies.

**Overflow**: `wrap` — a numeric value is not subject to truncation; if a numeric string
would overflow its container, the container's layout — not this role's overflow rule —
must accommodate it.

---

## Typeface Decision

**Decision**: gridu keeps **Inter** as the single design-system typeface. Fallback stack:
`Inter, ui-sans-serif, system-ui, -apple-system, sans-serif`.

**Rationale**: Both `gridu-web` and `gridu-landing` already self-host the identical Inter
variable font (`woff2`, weight range `100 900`) with byte-identical `@font-face`
declarations (audit.md Typography section) — keeping it costs zero migration effort. Its
character — a plain, high-legibility UI typeface with no decorative detail — matches Quiet
Competence's stated typographic character word-for-word: "Plain, high-legibility
letterforms with no decorative detail... nothing in the type draws the eye before the words
do" (visual-direction.md §A Typographic character). A typeface change would be a scope
expansion beyond what Feature 03 confirmed, with no identified shortfall to justify it.

**Alternatives considered**:
- A different high-legibility grotesque typeface: rejected — no concrete shortfall in Inter
  was identified in the audit, and switching typefaces is a one-way cost (re-licensing,
  re-hosting, re-validating glyph coverage for Spanish diacritics) with no corresponding
  benefit.
- A serif or display-leaning typeface for headings only: rejected — Quiet Competence's
  character note explicitly assigns hierarchy to weight, not typeface family; introducing a
  second family for headings would itself be the kind of decorative flourish the direction
  rules out.
- A dedicated monospace typeface for numeric values: rejected — Inter's built-in tabular
  figure OpenType feature (used by `numeric-tabular` above) already solves digit-width
  consistency without a second family.

This typeface decision governs the entire design system — it is not re-decided per role or
per component.

---

## Cross-Surface Consistency

`gridu-web` and `gridu-landing` MUST load the identical typeface (`Inter`) and the identical
fallback stack declared above. There is exactly one typeface declaration for the gridu
design system; no surface may declare an alternative or supplementary typeface. This
resolves any future drift before Feature 06 (Design Tokens) implements the shared token
files that both surfaces consume.

---

## Hierarchy: Weight and Size, Never Color

Across all 8 roles defined in this document, visual hierarchy is carried by **weight and
size only** — never by color. Heading roles step up in weight (600 → 700) and size
(18px → 24px → 32px) relative to body text; the numeric-tabular role steps up in weight
(600) relative to body text. No role's distinction from another role relies on a color
value.

This is consistent with Quiet Competence's stated character — "Weight variation is used for
hierarchy (what to read first) not for personality (what to feel)" (visual-direction.md §A
Typographic character) — and with Principle V (Calm Under Pressure, constitution.md): an
even, undecorated register that doesn't rely on color shifts to signal importance. Color is
the separate responsibility of `specs/04-define-color-system/color-system.md`; this document
does not assign color to any role, and no role in this document should be read as implying
one.

---

## Minimum Size Floor — Compliance Summary

| Role | Size | Applicable Floor | Result |
|---|---|---|---|
| `heading-page` | 32px | 12px general | PASS |
| `heading-section` | 24px | 12px general | PASS |
| `heading-subsection` | 18px | 12px general | PASS |
| `body-default` | 16px | 14px body | PASS |
| `body-secondary` | 14px | 14px body | PASS (at floor) |
| `label` | 14px | 12px general | PASS |
| `caption` | 12px | 12px general | PASS (at floor, system minimum) |
| `numeric-tabular` | 16px (default) | 14px body | PASS |

All 8 roles meet or exceed their applicable floor. `body-secondary` and `caption` sit
exactly at their respective floors by design — see each role's Floor check note above.

---

## Validation

*All 9 quickstart.md checks run against this document.*

| Check | FR | Result | Notes |
|---|---|---|---|
| 1. Role completeness (8 roles) | FR-001 | ✓ PASS | 3 headings + 4 body/text + 1 numeric; all defined above |
| 2. Single-value-set-per-role | FR-002 | ✓ PASS | `body-secondary` and `label` share 14px but are distinguished by weight (400 vs. 500); no two roles are interchangeable |
| 3. Character-trace for all roles | FR-003 | ✓ PASS | Every role's Character note cites a specific passage from `visual-direction.md`, `audit.md`, or `constitution.md` |
| 4. Typeface single-source | FR-004 | ✓ PASS | Exactly one typeface (Inter) and one fallback stack declared in the header and the Typeface Decision section |
| 5. Minimum-size floor | FR-005 | ✓ PASS | All 8 roles verified in the Minimum Size Floor — Compliance Summary table |
| 6. Weight-as-hierarchy | FR-006 | ✓ PASS | "Hierarchy: Weight and Size, Never Color" section states this explicitly for all 8 roles; no character note relies on color |
| 7. Tabular-figure feature | FR-007 | ✓ PASS | `numeric-tabular` specifies `font-variant-numeric: tabular-nums lining-nums`, applied within the existing Inter typeface |
| 8. Overflow default | FR-008 | ✓ PASS | `body-default`, `body-secondary`, `caption`, headings, and `numeric-tabular` wrap by default; `label` is the only role with an opt-in truncation exception |
| 9. Single-source check | FR-009 | ✓ PASS | No type-scale definition added to `gridu-web` or `gridu-landing` as part of this feature |
