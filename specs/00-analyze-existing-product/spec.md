# Feature Specification: Analyze Existing Product

**Feature Branch**: `develop`

**Created**: 2026-06-29

**Status**: Draft

**Input**: User description: "Feature 00 — Analyze Existing Product, from the Product Identity Refresh epic. Produce a spec whose deliverable is an audit/analysis document of the CURRENT state of gridu's visual product identity across gridu-web and gridu-landing — current color usage, typography, spacing, component inventory, inconsistencies between the two surfaces, and gaps relative to having a real design system. Baseline for Features 01-06. No code changes, no opinions about the NEW direction yet."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Baseline reference for downstream identity decisions (Priority: P1)

Whoever defines the new product identity (Features 01-06: identity, principles, visual
direction, color, typography, tokens) needs an accurate, single-source description of what
gridu's two surfaces (dashboard and landing) actually look like today — not what they were
intended to look like — before proposing anything new.

**Why this priority**: Every later decision in the epic (Features 01-22) builds on this
baseline. Skipping it risks designing a new system without knowing what it is replacing,
which inconsistencies actually exist, or which gaps are most costly.

**Independent Test**: Can be fully tested by reading the audit document and confirming it
describes, with citations to specific files/components, the current color values, type
scale, spacing usage, and component inventory of both gridu-web and gridu-landing — without
needing any of Features 01-06 to exist yet.

**Acceptance Scenarios**:

1. **Given** the audit document, **When** a reader looks up "what colors does gridu-web use
   today", **Then** they find the actual color values in use (not assumed defaults) with
   pointers to where they're defined.
2. **Given** the audit document, **When** a reader compares gridu-web and gridu-landing,
   **Then** they find an explicit list of visual inconsistencies between the two surfaces
   (color, type, spacing, component styling).

---

### User Story 2 - Identify gaps relative to having a real design system (Priority: P2)

The same audience needs to know what is *missing* — e.g. no documented type scale, no shared
component library, no defined spacing scale — so Features 01-06 know which gaps they are
specifically closing.

**Why this priority**: Without an explicit gap list, later features risk re-deriving
decisions that already silently exist (e.g. shadcn's default slate palette) without
acknowledging them, or missing gaps that don't show up just from describing current state.

**Independent Test**: Can be tested by checking the audit document contains a dedicated gaps
section, each gap traceable to a concrete absence (e.g. "no shared component library between
gridu-web and gridu-landing").

**Acceptance Scenarios**:

1. **Given** the audit document, **When** a reader reviews the gaps section, **Then** each
   gap references the specific current-state finding it follows from.

---

### Edge Cases

- What happens when a visual property (e.g. a spacing value) is set inconsistently across
  many components rather than once? → Document it as a pattern/range, not a single value, and
  flag it as an inconsistency rather than silently picking one instance.
- How does the audit handle gridu-landing components that have no gridu-web equivalent (or
  vice versa)? → List them separately as "surface-specific" rather than forcing a comparison.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The audit MUST document current color usage in gridu-web and gridu-landing
  separately, including actual hex/CSS variable values and where each is sourced from
  (e.g. shadcn theme config vs. hand-authored CSS).
- **FR-002**: The audit MUST document current typography in use in both surfaces (font
  families, sizes, weights, line-heights actually rendered, not just declared defaults).
- **FR-003**: The audit MUST document current spacing/layout patterns observed in both
  surfaces (e.g. padding/margin scale in practice, grid/container widths).
- **FR-004**: The audit MUST produce a component inventory for each surface: every distinct
  UI component currently in use, its visual variants, and whether an equivalent exists on the
  other surface.
- **FR-005**: The audit MUST list concrete inconsistencies found between gridu-web and
  gridu-landing (same concept styled differently across surfaces).
- **FR-006**: The audit MUST list concrete gaps relative to having a real design system
  (e.g. no documented type scale, no shared tokens, no shared component library).
- **FR-007**: The audit MUST NOT propose a new visual direction, new colors, new components,
  or any other forward-looking design decision — it describes only what exists today.
- **FR-008**: The audit MUST cite the specific file, component, or config (e.g.
  `components.json`, a Tailwind config, a specific `.astro`/`.tsx` file) backing each finding,
  so later features can verify claims against the source.

### Key Entities

- **Surface**: One of the two current product surfaces in scope (gridu-web dashboard,
  gridu-landing marketing site). Each surface's findings are reported independently before
  being compared.
- **Finding**: A single documented fact about current state (a color value, a font size, a
  component's existing variants), each traceable to a source file/config.
- **Inconsistency**: A pairing of two findings (one per surface, or two instances within the
  same surface) that represent the same design concept styled differently.
- **Gap**: An explicitly named absence relative to having a real design system, derived from
  one or more findings.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A reader unfamiliar with gridu-web/gridu-landing's current styling can answer
  "what does this look like today and why" for color, typography, spacing, and components
  using only the audit document, without opening either codebase.
- **SC-002**: Every inconsistency and gap listed in the audit is traceable to at least one
  concrete, file-level source via the findings it references.
- **SC-003**: Features 01-06 can each start from this audit without needing to re-derive
  current-state facts already covered here.

## Assumptions

- The audit's scope is the two existing consumer-facing surfaces (gridu-web, gridu-landing)
  only — the `gridu` API repo has no visual surface and is out of scope.
- "Current state" means what actually renders today, including any drift from declared
  defaults (e.g. shadcn's slate base theme as configured vs. any overrides applied since).
- The audit is a static document (Markdown), not a tool or script; it does not need to stay
  automatically in sync with the codebase after this feature is implemented — it is a
  point-in-time baseline.
- No stakeholder interviews are required; the audit is derived entirely from inspecting the
  existing codebases.
