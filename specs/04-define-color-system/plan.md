# Implementation Plan: Define Color System

**Branch**: `04-define-color-system` | **Date**: 2026-06-29 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/04-define-color-system/spec.md`. Upstream
inputs: `specs/03-research-visual-direction/visual-direction.md` (Quiet Competence,
confirmed by owner), `specs/00-analyze-existing-product/audit.md` (existing token set,
dark-mode inconsistency), `.specify/memory/constitution.md` v1.0.0.

## Summary

Define the complete semantic color system for gridu — translating the confirmed Quiet
Competence visual direction into named token roles with OKLCH values, character
documentation, WCAG AA contrast verification, and a single declared dark-mode activation
mechanism. The deliverable is `color-system.md`, a Markdown document that becomes the
authoritative color reference for Features 05, 06, and 07-12 (typography, tokens,
components). No CSS files or build artifacts are produced in this feature (those are
Feature 06's output).

## Technical Context

**Language/Version**: OKLCH color space (perceptual, already in use on both surfaces per
audit.md). Deliverable is Markdown.

**Primary Dependencies**: None. Research uses contrast ratio math (WCAG 2.1 formula) and
the OKLCH perceptual model. No external libraries or tooling required.

**Storage**: N/A — deliverable is `specs/04-define-color-system/color-system.md`.

**Testing**: No automated tests. Validation runs quickstart.md checks (contrast ratio
verification per WCAG 2.1 formula, token completeness scan, character-trace review).

**Target Platform**: gridu-design-system repository. Consumed by gridu-web (React +
Tailwind CSS v4 + shadcn/ui) and gridu-landing (Astro + Tailwind CSS v4) in Feature 06.

**Project Type**: Design documentation — a specification document, not source code.

**Performance Goals**: N/A.

**Constraints**: WCAG 2.1 Level AA (4.5:1 normal text, 3:1 large/bold text) in both
modes. OKLCH values only. No raw hex or RGB values in the deliverable.

**Scale/Scope**: One deliverable document, ~15 semantic roles, two modes (light/dark).
Serves a single-operator product (Principle IV).

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Result | Reasoning |
|---|---|---|
| I. Default Over Configure | PASS | FR-002 mandates exactly one token per role — the color system never presents choices to a component author; the token is the default. |
| II. Fail Loud, Never Silent | PASS | FR-004 explicitly designates destructive/error as the designed high-contrast exception. The Principle II tension identified in `visual-direction.md` is resolved here by structure: errors are the ONLY high-contrast moment, making failures impossible to miss in a muted palette. |
| III. Outcome First | PASS (addressed in structure) | `color-system.md` MUST present role names and values before character rationale — the answer (what to use) precedes the explanation (why it is what it is). Structure decision below enforces this. |
| IV. Scale To One, Not A Thousand | N/A at plan level | A color system has no multi-tenant or multi-staff scope implications. The palette serves a solo-operator product by character (Quiet Competence), but Principle IV does not impose structural constraints here. |
| V. Calm Under Pressure | PASS | Quiet Competence character is inherently even-keeled. Error states stand out by contrast ratio and saturation, not by alarmed visual language — consistent with Principle V's requirement that edge-case states use the same calm visual register. |

No violations. Complexity Tracking section omitted.

## Project Structure

### Documentation (this feature)

```text
specs/04-define-color-system/
├── plan.md              # This file
├── research.md          # Phase 0 output — dark mode mechanism decision + 
│                        #   token role inventory + accent hue analysis
├── data-model.md        # Phase 1 output — Semantic Color Role + Color System entities
├── quickstart.md        # Phase 1 output — 8 validation checks against color-system.md
├── color-system.md      # PRIMARY DELIVERABLE — the full color system
└── tasks.md             # Phase 2 output (/speckit-tasks — NOT created here)
```

### Source Code (repository root)

No source code changes in this feature. The deliverable is a specification document only.
Implementation of CSS custom property files (gridu-web and gridu-landing) is deferred to
Feature 06 (Define Design Tokens).

**Structure Decision**: Single deliverable Markdown file at
`specs/04-define-color-system/color-system.md`. All tasks write to this file or to the
supporting spec artifacts above. Zero changes to `gridu-web/` or `gridu-landing/` during
Feature 04.

---

## Phase 0 Research

### Decision 1 — Dark mode activation mechanism

**Context**: `audit.md` Cross-Surface Comparison documents an inconsistency: `gridu-web`
uses a `.dark` CSS class (runtime JS-controlled toggle), while `gridu-landing` uses
`@media (prefers-color-scheme: dark)` (OS-driven only, no manual override). Both produce
identical token values but via incompatible mechanisms. FR-006 requires this to be
resolved in this feature.

**Decision**: **`.dark` class mechanism for both surfaces.**

**Rationale**:
- A class-based toggle allows the user to override the OS preference (light mode on a dark
  OS, or vice versa) — the media-query-only approach does not. For a product a business
  owner uses daily, manual control is a meaningful quality-of-life affordance.
- gridu-web already uses the class approach; adopting it on gridu-landing standardizes
  toward the mechanism that has more capability, not less.
- The `.dark` class is the canonical shadcn/ui dark mode mechanism; gridu-web's shadcn
  base (audit.md) makes this the natural standard.
- This decision means gridu-landing MUST add a dark mode toggle/script — deferred to
  Feature 06 (or the first landing feature that touches dark mode in Phase 2b). Feature 04
  documents the decision; it does not implement the toggle.

**Alternatives considered**:
- `@media prefers-color-scheme` only: Simpler but removes user agency. Rejected.
- Both mechanisms coexisting: Perpetuates the inconsistency. Rejected.
- `color-scheme` CSS property: Not yet sufficient as the sole trigger without a class or
  media query to drive it. Rejected as primary mechanism.

---

### Decision 2 — Semantic role inventory

**Context**: The existing token set (audit.md) covers: `--background`, `--foreground`,
`--primary`, `--secondary`, `--muted`, `--accent`, `--destructive`, `--border`, `--input`,
`--ring`, `--brand`, `--brand-strong`, `--brand-subtle`, `--sidebar*`. Gaps identified:
no `--warning` semantic token (replaced by a hardcoded `bg-amber-500` in `badge.tsx`), no
`--success` token, no `--disabled` token.

**Decision**: The Feature 04 color system defines **15 semantic roles** in two groups:

*Base roles (9)*: background, foreground, muted-surface, muted-foreground, border, input,
ring, primary, primary-foreground

*Status roles (6)*: brand, brand-strong, brand-subtle, destructive, warning, success

**Notes**:
- `--secondary` and `--accent` from the existing system map to `muted-surface` — they are
  near-white slate with no distinct semantic difference. Consolidating to a single
  muted-surface role eliminates the existing ambiguity between them.
- `--sidebar*` tokens are omitted: they are gridu-web surface-specific (the sidebar UI
  does not exist on gridu-landing) and are derivable from the base roles in Feature 06.
- `--disabled` is deferred: disabled states can be expressed as muted-surface +
  muted-foreground (opacity or direct value) in Feature 06 component implementation.
  Adding a standalone disabled role at this stage would violate Principle I (default over
  configure) — no evidence yet that a dedicated role is needed.
- `--warning` and `--success` are added explicitly to address the `bg-amber-500` hardcode
  gap (audit.md) and to complete the status-signal vocabulary needed for Principle II
  compliance.

**Alternatives considered**:
- Keep `--secondary` / `--accent` as separate roles: Rejected — audit showed they are
  byte-identical in both surfaces; two tokens for the same visual role violates FR-002.
- Add `--info` role (blue informational state): Rejected — no existing UI use case
  identified; would violate Principle I (speculative addition). Can be added in a later
  feature if a concrete need emerges.

---

### Decision 3 — Brand/accent hue

**Context**: Both surfaces use teal, hue ≈ 165 in OKLCH (audit.md). Quiet Competence
calls for "muted and desaturated, with a single accent color that earns attention without
demanding it." The existing `--brand: oklch(0.72 0.15 165)` has chroma 0.15 — moderate
for OKLCH (typical vibrant colors reach 0.20-0.30). The visual-direction.md confirmed
Quiet Competence; no hue change was requested.

**Decision**: **Keep hue ≈ 165 (teal family). Reduce chroma toward 0.10-0.13 for brand
(light mode) to fit Quiet Competence's "earns attention without demanding it" character.**
Brand-strong and brand-subtle adjust proportionally. Exact values determined during
implementation against WCAG AA checks.

**Rationale**: The teal hue is established across both surfaces and was implicitly
confirmed as part of the product identity (audit.md's brand-guidelines.md reference names
"Teal Gridu" as the brand color). The visual direction asks for less chroma saturation,
not a hue change. Reducing chroma from 0.15 toward ~0.11-0.13 reads as "quiet teal" rather
than "vivid teal," fitting the direction's "muted and desaturated" character while
preserving continuity.

**Alternatives considered**:
- Full hue replacement (e.g., sage green, cool gray-blue): Rejected — no identity input
  suggests a hue change, and both surfaces already ship with teal; a hue change here
  would be a scope expansion beyond Feature 03's confirmed direction.
- Keep existing chroma (0.15): Rejected — this is closer to "vivid" than "quiet" in
  OKLCH perceptual terms; contradicts the Quiet Competence character.

---

### Decision 4 — Error / warning / success color approach

**Context**: Principle II requires errors to be perceptibly louder than everything else in
a muted palette. The manageable tension from visual-direction.md says: "error states in
this direction must be the ONLY high-contrast, high-weight moment in the system."

**Decision**:
- **Destructive/error**: High-chroma red family (hue ~25-30 OKLCH), chroma ≥ 0.20. This
  is the one role where chroma is deliberately higher than the rest of the palette — the
  designed exception. Must pass WCAG AA on background.
- **Warning**: Amber family (hue ~75-85 OKLCH), chroma ~0.15-0.18. Replaces the
  `bg-amber-500` hardcode from audit.md. Lower visual urgency than destructive, but
  visually distinct from both the base palette and the brand accent. Must pass WCAG AA
  on background when used as a background with foreground text on top.
- **Success**: Green-adjacent to brand teal but lighter and higher chroma than brand
  (hue ~145-155 OKLCH), creating a clear "things went well" signal without competing with
  the brand accent. Must pass WCAG AA.

**Rationale**: Using distinct hue families for each status signal (red / amber / green-
adjacent) ensures status-role distinguishability for users with common color-vision
deficiencies (deuteranopia / protanopia) — a WCAG 1.4.1 (Use of Color) consideration.

---

## Constitution Re-Check — Post Phase 1 Design

*Required by constitution.md Development Workflow §MUST after Phase 1 design artifacts
(data-model.md, quickstart.md) are produced.*

| Principle | Result | Reasoning |
|---|---|---|
| I. Default Over Configure | PASS | 15-role data model adds no optional variants; one token per role per mode is the only path. `--disabled` deferral is itself a Principle I decision (no speculative role without concrete UI evidence). |
| II. Fail Loud, Never Silent | PASS | `exception_note` field on the destructive role, plus FR-004 requirement that its chroma be observably higher than all other roles, ensures Phase 1 design structurally enforces the high-contrast exception. |
| III. Outcome First | PASS | data-model.md field order (name → purpose → light_value → dark_value → character_note → accessibility_note) presents the actionable fact (value) before the rationale (character_note). quickstart.md leads each check with a clear pass/fail criterion. |
| IV. Scale To One, Not A Thousand | N/A | Color system serves a single-operator product; no multi-tenant or multi-staff scope in Phase 1 design. |
| V. Calm Under Pressure | PASS | No new design element introduced in Phase 1 conflicts with the even-keeled Quiet Competence palette. Error states stand out by contrast ratio, not by alarmed visual language — consistent with Principle V. |

No new violations. Phase 1 design is constitutionally compliant.
