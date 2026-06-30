# Research: Define Color System

All decisions below were made during `/speckit-plan` from the inputs listed in `plan.md`.
No external research tasks were required — all unknowns were resolvable from `audit.md`,
`visual-direction.md`, `identity.md`, and `constitution.md`.

## Decision 1 — Dark mode activation mechanism

**Decision**: `.dark` CSS class for both `gridu-web` and `gridu-landing`.

**Rationale**: Class-based toggle allows user-level override of OS preference; the
media-query approach does not. `gridu-web` already uses this mechanism (shadcn/ui
canonical). Standardizing toward the higher-capability mechanism, not the simpler one.
Feature 04 declares the standard; Feature 06 implements the toggle on `gridu-landing`.

**Alternatives considered**: `@media prefers-color-scheme` only (removes user agency,
rejected); both mechanisms coexisting (perpetuates inconsistency, rejected).

---

## Decision 2 — Semantic role inventory (15 roles)

**Decision**: 15 semantic roles in two groups:

*Base (9)*: `background`, `foreground`, `muted-surface`, `muted-foreground`, `border`,
`input`, `ring`, `primary`, `primary-foreground`

*Status (6)*: `brand`, `brand-strong`, `brand-subtle`, `destructive`, `warning`, `success`

**Rationale**:
- `--secondary` and `--accent` (existing system) are byte-identical in both surfaces —
  two names, one value, one visual role. Consolidated to `muted-surface` (FR-002: one
  token per role).
- `--sidebar*` tokens omitted: surface-specific to gridu-web; derivable from base roles in
  Feature 06.
- `--warning` and `--success` added to replace the `bg-amber-500` hardcode (audit.md) and
  complete the status vocabulary required for Principle II compliance.
- `--disabled` deferred: expressible as muted-surface + muted-foreground at component
  level in Feature 06. No concrete UI evidence for a standalone disabled token yet
  (Principle I: default over speculative configuration).

**Alternatives considered**: Keeping `--secondary` / `--accent` as separate roles
(identical values violate FR-002, rejected); adding `--info` role (no UI use case, Principle I
violation, rejected).

---

## Decision 3 — Brand/accent hue

**Decision**: Keep hue ≈ 165 (teal family). Reduce chroma from existing 0.15 toward
0.10-0.13 in the `brand` role to fit Quiet Competence's "earns attention without
demanding it" character. Brand-strong and brand-subtle adjust proportionally.

**Rationale**: Teal is established across both surfaces and implicitly confirmed as the
brand color. Quiet Competence asks for less saturation, not a different hue. Reducing
chroma reads as "quiet teal" while preserving product continuity.

**Alternatives considered**: Full hue replacement (scope expansion beyond confirmed
direction, rejected); keep existing chroma 0.15 (too vibrant for Quiet Competence,
rejected).

---

## Decision 4 — Error / warning / success color approach

**Decision**: Distinct hue families per status signal:
- **Destructive/error**: Red family (hue ~25-30 OKLCH), chroma ≥ 0.20 — the designed
  high-contrast exception in the muted palette (resolves Principle II tension).
- **Warning**: Amber family (hue ~75-85 OKLCH), chroma ~0.15-0.18 — replaces
  `bg-amber-500` hardcode.
- **Success**: Green-adjacent to brand (hue ~145-155 OKLCH) — visually distinct from brand
  accent (different lightness + chroma profile), clearly positive signal.

**Rationale**: Distinct hue families ensure status distinguishability for users with
common color-vision deficiencies (deuteranopia / protanopia) — WCAG 1.4.1 (Use of Color).
Error role intentionally uses the highest chroma in the system — the one designed
exception that makes Principle II work in a muted palette.

**Alternatives considered**: Reusing brand teal as success (ambiguous — brand ≠ success
signal, rejected); single high-chroma status role (insufficient vocabulary for UI states
needing warning vs. error distinction, rejected).
