# Feature Specification: Define Typography System

**Feature Branch**: `05-define-typography-system`

**Created**: 2026-06-30

**Status**: Draft

**Input**: Feature 05 of the Product Identity Refresh epic. Translates the Quiet Competence
visual direction (Feature 03, owner-confirmed) and the color system (Feature 04, Final) into
a complete typographic system. Upstream inputs: `specs/03-research-visual-direction/visual-direction.md`,
`specs/04-define-color-system/color-system.md`, `specs/00-analyze-existing-product/audit.md`,
`.specify/memory/constitution.md`.

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 — One authoritative type decision per text role (Priority: P1)

A developer or designer adding a new piece of text — a page heading, a card title, a body
paragraph, a form label, a caption, a price or a count — needs to look in exactly one place
and find exactly one typographic answer (family, weight, size, line-height, letter-spacing)
for that role. Today (per `audit.md`) sizes are picked ad hoc per component with no shared
scale in code, and `gridu-landing`'s old `brand-guidelines.md` documents a scale that exists
only in prose and isn't enforced anywhere.

After this feature, the typography system provides a single, complete set of semantic text
roles covering every foreseeable text use in the product. No text use is left without a
role, and no role maps to more than one set of values.

**Why this priority**: Without a complete, unambiguous set of type roles, Features 07-21 each
make their own type decisions and the scale drift documented in the audit continues. This is
the foundational blocker, same as Feature 04 was for color.

**Independent Test**: Given only the typography system document, a person implementing a new
component from scratch should be able to assign family, weight, size, line-height, and
letter-spacing to every text element in that component — heading, body, label, caption,
numeric/code value — without looking anywhere else and without choosing between two equally
plausible roles.

**Acceptance Scenarios**:

1. **Given** a piece of text that is a section heading, **When** a developer consults the
   typography system, **Then** they find exactly one semantic role for that heading level —
   no ambiguity about which of two similar roles to apply.
2. **Given** a piece of text that is body copy inside a card, **When** a developer consults
   the typography system, **Then** they find a designated body role with a defined size and
   line-height, not an ad hoc `text-sm`/`text-base` choice.
3. **Given** a numeric value such as a price, a count, or a duration, **When** a developer
   consults the typography system, **Then** they find a role suited to tabular/numeric
   display, distinct from prose body text.

---

### User Story 2 — Type choices traceable to Quiet Competence, not arbitrary (Priority: P2)

The project owner confirmed Quiet Competence as the visual direction knowing it would become
the basis for Features 04-06. Quiet Competence's typographic character is explicit: "Plain,
high-legibility letterforms with no decorative detail... Weight variation is used for
hierarchy (what to read first) not for personality (what to feel)." Each type decision in the
resulting system must be traceable back to that direction — so that if a future type choice
is questioned, the answer is "because this is what Quiet Competence means for this role," not
"because it looked good."

**Why this priority**: Traceability prevents future drift, mirroring the rationale already
established for the color system in Feature 04.

**Independent Test**: For any role in the typography system, a reader can find its stated
character and trace it to a specific passage in `visual-direction.md` or to a principle in
`.specify/memory/constitution.md`. Conversely: the system explicitly states which roles use
weight (not size or color) to carry hierarchy, consistent with the direction's stated
character.

**Acceptance Scenarios**:

1. **Given** the heading roles, **When** a reader asks "why does hierarchy come from weight
   and size, not from color or decoration?", **Then** the typography system document
   provides an answer traceable to the Quiet Competence character description in
   `visual-direction.md`.
2. **Given** the complete role set, **When** a reader checks each role's character note
   against `visual-direction.md`'s Quiet Competence description, **Then** no role
   contradicts the direction's stated character (no decorative, display, or script-style
   treatment anywhere in the system).

---

### User Story 3 — One typeface decision, resolved once (Priority: P3)

The audit found that both surfaces already self-host the same variable typeface ("Inter",
weights 100-900) with byte-identical `@font-face` declarations, but neither surface declares
a shared type scale in code, and `gridu-landing`'s `brand-guidelines.md` documents a scale
(H1/H2 weight 700, H3 weight 600, body weight 400, "avoid weights below 400 in body text")
that this epic does not inherit (per `identity.md`'s scope note: this epic is written from
scratch and does not reference or derive from that document). This feature must decide,
explicitly and from scratch, whether to keep the existing typeface or change it, and define
the complete scale that replaces the undocumented ad hoc approach.

**Why this priority**: A typeface decision is a one-time, cross-surface foundation
choice — lower priority than the role system itself (User Story 1) and its traceability
(User Story 2), but it must be resolved before Features 07-21 can use any role.

**Independent Test**: The typography system document answers "which typeface does the gridu
design system use, and why" with exactly one answer, and defines a complete numeric scale
(sizes, line-heights, letter-spacing, weights) for every role — not a partial list requiring
a follow-up decision.

**Acceptance Scenarios**:

1. **Given** the typography system document, **When** a developer sets up a new surface
   using this design system, **Then** the document specifies exactly one typeface (with
   fallback stack) to load.
2. **Given** the typography system's role set, **When** checked against the color system's
   text-on-background pairings (Feature 04), **Then** no role specifies a size below the
   minimum legible size for its stated use (e.g., body text not smaller than is readable at
   normal viewing distance on a small screen).

---

### Edge Cases

- What happens when a UI element needs a text treatment between two defined roles (e.g., a
  card title that's visually heavier than a label but lighter than a page heading)? → The
  scale must cover enough roles to leave no common UI-text gap requiring an ad hoc size or
  weight.
- How does the system handle a long, unbroken string (e.g., a business name or email address)
  inside a fixed-width container? → The typography system must state a default wrapping/
  truncation behavior so components don't each invent their own.
- How does the numeric/tabular role behave when a price or count changes value frequently
  (e.g., a live counter)? → Numeric text must use a role whose digit widths don't shift the
  surrounding layout as values change.
- What happens at the smallest supported viewport (a phone-sized WhatsApp-adjacent screen,
  per the Target Persona in `identity.md`)? → Every role must remain legible without a
  separate mobile-only scale; the system defines one scale that holds at minimum supported
  width, not a responsive set of overrides.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The typography system MUST define a complete set of semantic text roles
  covering every foreseeable text use: page-level heading, section heading, subsection
  heading, body (default), body (secondary/muted), label, caption, and numeric/tabular —
  leaving no foreseeable UI text use without a named semantic role.

- **FR-002**: Each semantic role MUST have exactly one defined set of values (font family,
  weight, size, line-height, letter-spacing) — no role may resolve to multiple plausible
  value sets, and no two roles may be interchangeable for the same text use.

- **FR-003**: Every role MUST include a character note tracing its weight/size/spacing
  tendency to the Quiet Competence direction in `visual-direction.md` or to a specific
  principle in `.specify/memory/constitution.md`.

- **FR-004**: The typography system MUST declare exactly one typeface decision (family name
  and fallback stack) for the entire design system, resolving whether the existing
  self-hosted "Inter" typeface (audit.md) is retained or replaced — both surfaces MUST use
  the same declared typeface.

- **FR-005**: Every role's defined size MUST meet a minimum legible floor: `label` and
  `caption` MUST NOT be smaller than 12px (0.75rem) equivalent; `body-default` and
  `body-secondary` MUST NOT be smaller than 14px (0.875rem) equivalent, consistent with
  standard web legibility guidance for a non-technical target persona (`identity.md`
  Target Persona).

- **FR-006**: Heading roles MUST use weight and size — not color — as the primary hierarchy
  signal, consistent with Quiet Competence's stated character ("Weight variation is used for
  hierarchy... not for personality") and Principle I (Default Over Configure): the same
  hierarchy must read correctly without relying on the brand accent color.

- **FR-007**: The numeric/tabular role MUST specify tabular (fixed-width) figure behavior so
  that changing numeric values (prices, counts, durations) do not shift surrounding layout.

- **FR-008**: The typography system MUST state a default text-overflow behavior (wrap vs.
  truncate, and truncation method if applicable) for at least the roles most likely to hold
  unpredictable-length content (body, label).

- **FR-009**: The typography system deliverable (`typography-system.md`) MUST live only in
  `gridu-design-system/specs/05-define-typography-system/` — it is the single source of
  truth. No duplicate type-scale definition or alternative value set may exist in `gridu-web`
  or `gridu-landing` as a result of this feature.

### Key Entities

- **Semantic Text Role**: The named purpose a piece of text serves in the UI (e.g., "section
  heading," "body (secondary)," "numeric/tabular"). A role has: a name, a purpose
  description, a font family reference, a weight, a size, a line-height, a letter-spacing
  value, and a character note tracing it to the visual direction or constitution.

- **Typography System**: The complete set of semantic roles, plus the declared typeface
  decision (family + fallback stack) and any system-wide rules (minimum legible size,
  tabular-figure rule, overflow default). This is the document `typography-system.md` that
  Features 06 and 07-21 consume as a source of truth.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Every semantic text role in the typography system can be matched to exactly one
  value set — a person filling a typography decision finds zero cases where two roles are
  equally valid for the same text use (testable by attempting to assign type roles to all
  components in the audit without needing to choose between two plausible same-purpose
  roles).

- **SC-002**: All defined roles meet the minimum legible size floor (FR-005) — verifiable by
  reading the size value of every role in `typography-system.md` against the stated floor,
  no special tooling required.

- **SC-003**: The typeface decision is stated in exactly one place and is consistent between
  `gridu-web` and `gridu-landing` after this feature — verifiable by reading the typeface
  declaration in `typography-system.md` and confirming it is unambiguous.

- **SC-004**: A developer can assign a complete type treatment (family, weight, size,
  line-height, letter-spacing) to any of the 7 component types audited in
  `specs/00-analyze-existing-product/audit.md` (card, button, badge, input, table, nav,
  pricing display) using only `typography-system.md`, without consulting any other
  document or guessing a value.

---

## Assumptions

- The existing self-hosted "Inter" variable typeface (weights 100-900, identical on both
  surfaces per `audit.md`) is the strong default starting point for the typeface decision —
  Inter is a widely-used, highly legible UI typeface already proven to work across both
  surfaces; a typeface change is only justified if Quiet Competence's character requires one,
  and the visual-direction document's "Plain, high-legibility letterforms with no decorative
  detail" describes Inter's existing character closely. This feature still makes the decision
  explicit and normative (FR-004) rather than assuming continuity is automatic.
- `gridu-landing/docs/brand-guidelines.md` §3.2's existing documented scale (H1/H2 weight
  700, H3 weight 600, body weight 400) is not treated as a binding input, consistent with
  `identity.md`'s scope note that this epic is written from scratch. It may be referenced for
  context but does not constrain the new scale.
- The typography system deliverable is a Markdown document (`typography-system.md`) defining
  role definitions and values — not a CSS file, a Tailwind config, or a design-tool export.
  Those implementation artifacts are produced in Feature 06 (Design Tokens) and are out of
  scope here, mirroring the same boundary the color system (Feature 04) drew for its own
  deliverable.
- WCAG 2.1 Level AA text-size and legibility guidance is the floor for minimum sizes (FR-005);
  no separate low-vision or large-text mode is in scope for this feature (deferred to Feature
  22a, the accessibility audit phase).
- A single type scale serves all viewport widths — no separate mobile-only or
  desktop-only scale is introduced, consistent with Principle IV (Scale To One, Not A
  Thousand): the system is not over-built with responsive variants before a concrete need is
  shown.
- Tabular/numeric figures (FR-007) rely on the same Inter typeface's built-in tabular-figure
  OpenType feature (`tnum`), already available in the self-hosted font — no second numeric
  typeface is introduced.
