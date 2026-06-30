# Implementation Plan: Define Typography System

**Branch**: `05-define-typography-system` | **Date**: 2026-06-30 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/05-define-typography-system/spec.md`. Upstream
inputs: `specs/03-research-visual-direction/visual-direction.md` (Quiet Competence,
confirmed by owner), `specs/04-define-color-system/color-system.md` (Final), `specs/00-analyze-existing-product/audit.md`
(existing Inter typeface, no documented type scale), `.specify/memory/constitution.md` v1.0.0.

## Summary

Define the complete semantic typography system for gridu — translating the confirmed Quiet
Competence visual direction into named text roles with family, weight, size, line-height,
and letter-spacing values, character documentation, a minimum-legibility floor, and a single
declared typeface decision. The deliverable is `typography-system.md`, a Markdown document
that becomes the authoritative type reference for Feature 06 (Design Tokens) and Features
07-21 (components, dashboard, landing). No CSS files or build artifacts are produced in this
feature (those are Feature 06's output) — mirroring the boundary Feature 04 drew for color.

## Technical Context

**Language/Version**: N/A — deliverable is Markdown. Typeface is the existing self-hosted
Inter variable font (`woff2`, weights 100-900, already in use on both surfaces per
audit.md).

**Primary Dependencies**: None. Research uses standard web-legibility guidance (WCAG 2.1
text-size guidance) and OpenType tabular-figure (`tnum`) feature availability, already
present in the existing Inter font file.

**Storage**: N/A — deliverable is `specs/05-define-typography-system/typography-system.md`.

**Testing**: No automated tests. Validation runs quickstart.md checks (role completeness,
minimum-size floor, weight-as-hierarchy review, typeface single-source check).

**Target Platform**: gridu-design-system repository. Consumed by gridu-web (React +
Tailwind CSS v4 + shadcn/ui) and gridu-landing (Astro + Tailwind CSS v4) in Feature 06.

**Project Type**: Design documentation — a specification document, not source code.

**Performance Goals**: N/A.

**Constraints**: Minimum legible size floor — no role smaller than 12px (0.75rem)
equivalent; body (default) no smaller than 14px (0.875rem) equivalent (FR-005). Single
typeface decision shared by both surfaces (FR-004).

**Scale/Scope**: One deliverable document, 8 semantic text roles, one typeface decision.
Serves a single-operator product (Principle IV) — one scale for all supported viewport
widths, no responsive variant set.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Result | Reasoning |
|---|---|---|
| I. Default Over Configure | PASS | FR-002 mandates exactly one value set per role — the typography system never presents a component author with a choice between two plausible sizes/weights for the same text use; the role is the default. |
| II. Fail Loud, Never Silent | N/A at plan level | Typography carries no failure-signaling responsibility on its own — that is the color system's role (Feature 04, `destructive`). No structural conflict; no design decision in this feature concerns failure visibility. |
| III. Outcome First | PASS (addressed in structure) | FR-008's default wrap behavior (vs. truncation) keeps information visible rather than hidden — an outcome stated in body or label text is not silently cut off. `typography-system.md` presents role name and values before character rationale, mirroring `color-system.md`'s structure. |
| IV. Scale To One, Not A Thousand | PASS | A single type scale holds across all supported viewport widths (Assumptions, spec.md) — no responsive/mobile-only override scale is introduced, avoiding a multi-scale system built for hypothetical device-specific needs before one is shown. |
| V. Calm Under Pressure | PASS | FR-006 keeps hierarchy signaling to weight and size, not color or decoration — headings and emphasis read as plain structural cues, consistent with the even, undecorated register Quiet Competence and Principle V both require. |

No violations. Complexity Tracking section omitted.

## Project Structure

### Documentation (this feature)

```text
specs/05-define-typography-system/
├── plan.md                  # This file
├── research.md               # Phase 0 output — typeface decision + role inventory +
│                              #   scale values + tabular-figure/overflow decisions
├── data-model.md              # Phase 1 output — Semantic Text Role + Typography System entities
├── quickstart.md              # Phase 1 output — validation checks against typography-system.md
├── typography-system.md       # PRIMARY DELIVERABLE — the full typography system
└── tasks.md                   # Phase 2 output (/speckit-tasks — NOT created here)
```

### Source Code (repository root)

No source code changes in this feature. The deliverable is a specification document only.
Implementation of CSS custom properties / Tailwind font tokens (gridu-web and gridu-landing)
is deferred to Feature 06 (Define Design Tokens).

**Structure Decision**: Single deliverable Markdown file at
`specs/05-define-typography-system/typography-system.md`. All tasks write to this file or to
the supporting spec artifacts above. Zero changes to `gridu-web/` or `gridu-landing/` during
Feature 05.

---

## Phase 0 Research

### Decision 1 — Typeface

**Context**: `audit.md` documents that both surfaces already self-host the identical
variable typeface "Inter" (`woff2`, weight range `100 900`), declared byte-identically on
both surfaces. No documented type scale exists in code on either surface; `gridu-landing`'s
`brand-guidelines.md` §3.2 documents a scale (H1/H2 weight 700, H3 weight 600, body weight
400) that this epic does not inherit (per `identity.md`'s scope note — written from scratch).

**Decision**: **Keep Inter** as the single design-system typeface. Fallback stack:
`Inter, ui-sans-serif, system-ui, -apple-system, sans-serif`.

**Rationale**: Inter is already proven to render identically on both surfaces with zero
migration cost. Its character — a plain, high-legibility UI typeface with no decorative
detail — matches Quiet Competence's stated typographic character word-for-word: "Plain,
high-legibility letterforms with no decorative detail... nothing in the type draws the eye
before the words do" (visual-direction.md §A Typographic character). A typeface change would
be a scope expansion beyond what Feature 03 confirmed, with no identified need.

**Alternatives considered**: A geometric/grotesque alternative (e.g., a different
high-legibility sans): rejected — no concrete shortfall in Inter was identified in the
audit, and switching typefaces is a one-way cost (re-licensing, re-hosting, re-validating
glyph coverage for Spanish diacritics) with no corresponding benefit. A serif or
display-leaning typeface for headings only: rejected — Quiet Competence's character note
explicitly states weight, not typeface family, carries hierarchy; introducing a second
family would itself be a decorative flourish the direction rules out.

---

### Decision 2 — Semantic role inventory (8 roles)

**Context**: `audit.md` shows sizes picked ad hoc per component (`text-sm`, `text-base`,
`text-xl font-semibold`, `text-4xl font-bold tabular-nums`) with no shared scale. FR-001
requires a complete role set covering every foreseeable text use.

**Decision**: 8 semantic roles:

`heading-page`, `heading-section`, `heading-subsection`, `body-default`, `body-secondary`,
`label`, `caption`, `numeric-tabular`

**Rationale**: This set covers every text use observed in the audit (card titles, body
copy, pricing displays, badges, captions) without introducing a role for a use case not yet
seen in the product (Principle I). Three heading levels match the structural depth already
implied in component naming (`CardTitle`, section headers, page titles) without assuming a
deeper hierarchy than a single-operator dashboard needs (Principle IV). `body-secondary`
covers the existing `muted-foreground` color role's text-size pairing (Feature 04) so
secondary/muted text has both a color AND a size answer. `numeric-tabular` directly answers
the audit's `tabular-nums` usage in `PricingPlans.tsx`, generalizing it into a named role
instead of a one-off utility class.

**Alternatives considered**: A 4-level heading system (H1-H4): rejected — no UI surface in
the audit shows a fourth heading depth; adding one would be speculative (Principle I).
Merging `label` and `caption` into one role: rejected — labels sit on interactive elements
(form fields, buttons) and need a heavier weight (500) for affordance, while captions are
purely informational; collapsing them would force one role to serve two distinct purposes,
violating FR-002 (exactly one role per use case).

---

### Decision 3 — Scale values (size, line-height, letter-spacing, weight)

**Context**: FR-002 requires each role to resolve to exactly one value set. FR-005 sets a
minimum-legibility floor (12px floor for all roles, 14px floor for `body-default`). FR-006
requires weight and size — not color — to carry hierarchy.

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
| `numeric-tabular` | 1rem (16px), inherits context for emphasis displays | 1.2 | 0 | 600 |

**Rationale**: Heading sizes step down by a comfortable, non-dramatic ratio (32→24→18px)
consistent with Quiet Competence's restraint — no oversized display heading competing with
content. Negative letter-spacing on the two largest headings follows standard practice for
large-size optical tightening and matches the audit's existing precedent (`CardTitle` already
uses `tracking-tight`, per audit.md Typography section) — Feature 05 generalizes an
already-validated local choice rather than inventing one. `body-default` at 16px / 1.5
line-height follows standard body-text legibility guidance for a non-technical target persona
(`identity.md` Target Persona). `body-secondary` and `label` share 14px (the FR-005 floor for
non-body text) but differ in weight (400 vs 500) and line-height (1.5 vs 1.4) — weight
distinguishes an interactive label from a passive secondary text without changing size.
`caption` sits exactly at the 12px floor with slightly open letter-spacing (0.01em) to
preserve legibility at the smallest permitted size. `numeric-tabular` defaults to
body-default's size for inline use but is commonly paired with a heavier weight (600) to
read as a distinct, glanceable value (e.g., a price or count) — Principle III (Outcome
First): a number the owner needs to act on should be the easiest thing on the screen to find.

**Alternatives considered**: A type-scale generated by a fixed mathematical ratio (e.g.,
1.25 "major third"): rejected — produces awkward in-between sizes (e.g., 17.5px) at this
small a role count; a hand-tuned scale matching existing component precedent is simpler and
just as defensible (Principle I: default over speculative system). A 4-weight headline scale
(300/400/600/700): rejected — Quiet Competence explicitly rules out weight-as-personality;
narrowing to 400/500/600/700 (no light, no black) keeps weight purely functional.

---

### Decision 4 — Tabular figures and overflow default

**Context**: Edge cases in spec.md require (a) numeric values not shifting layout as they
change, and (b) a default wrapping/truncation behavior for unpredictable-length text.

**Decision**:
- **Tabular figures**: The OpenType `tnum` (tabular figures) and `lnum` (lining figures)
  features are enabled wherever digit sequences appear in `numeric-tabular` text, via
  `font-variant-numeric: tabular-nums lining-nums` (CSS) — already available in the
  self-hosted Inter font file (audit.md). This is a feature applied within the role, not a
  second typeface.
- **Overflow default**: `body-default`, `body-secondary`, and `caption` wrap by default
  (`white-space: normal`, `overflow-wrap: break-word`) — text is never silently cut off,
  consistent with Principle III (Outcome First: the outcome must be visible, not hidden).
  `label` may truncate with an ellipsis (`text-overflow: ellipsis; white-space: nowrap;
  overflow: hidden`) only in fixed-width single-line contexts the component author chooses
  explicitly (e.g., a table column header) — never as the typography system's own default.

**Rationale**: Tabular figures resolve the audit's existing one-off `tabular-nums` utility
(`PricingPlans.tsx`) into a named, reusable rule instead of a per-component class. The
wrap-by-default rule prevents information loss as the system's default behavior, reserving
truncation for cases a component author opts into deliberately.

**Alternatives considered**: Truncating all roles by default: rejected — directly
contradicts Principle III; an owner checking a schedule must see the full client name or
service description, not a clipped version. A dedicated numeric typeface (e.g., a monospace
face for prices): rejected — introduces a second family, contradicting Decision 1's
single-typeface conclusion, when Inter's built-in tabular-figure feature already solves the
alignment problem.

---

## Constitution Re-Check — Post Phase 1 Design

*Required by constitution.md Development Workflow §MUST after Phase 1 design artifacts
(data-model.md, quickstart.md) are produced.*

| Principle | Result | Reasoning |
|---|---|---|
| I. Default Over Configure | PASS | The 8-role data model adds no optional variants — one value set per role is the only path. The narrowed 400/500/600/700 weight range (Decision 3) is itself a default-over-configure choice: no role offers a weight alternative. |
| II. Fail Loud, Never Silent | N/A | Unchanged from initial Constitution Check — typography carries no failure-signaling role in this design. |
| III. Outcome First | PASS | data-model.md field order (name → purpose → values → character_note) presents the actionable fact before rationale, mirroring `color-system.md`. The wrap-by-default overflow rule (Decision 4) is the structural enforcement of Outcome First at the text-rendering level. |
| IV. Scale To One, Not A Thousand | PASS | Phase 1 design introduces no responsive/viewport-conditional role variants — the single 8-role scale defined in Decision 3 holds at minimum supported width per spec.md's Assumptions. |
| V. Calm Under Pressure | PASS | No design element introduced in Phase 1 relies on color, animation, or decoration for hierarchy — weight and size alone carry it (Decision 3, FR-006), keeping the system visually even-keeled. |

No new violations. Phase 1 design is constitutionally compliant.
