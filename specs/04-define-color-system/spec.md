# Feature Specification: Define Color System

**Feature Branch**: `04-define-color-system`

**Created**: 2026-06-29

**Status**: Draft

**Input**: Feature 04 of the Product Identity Refresh epic. Translates the Quiet Competence
visual direction (Feature 03, confirmed by project owner) into a complete semantic color
system. Upstream inputs: `specs/03-research-visual-direction/visual-direction.md`,
`specs/00-analyze-existing-product/audit.md`, `.specify/memory/constitution.md`.

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 — One authoritative color decision per UI role (Priority: P1)

A developer or designer adding a new UI element — a status badge, a button, a warning
message, a data row — needs to look in exactly one place and find exactly one color answer
for that element's role. Today they either guess from existing components or hand-pick
values without a source of truth, causing the drift documented in the audit (the lone
`bg-amber-500` hardcode in `badge.tsx`, three different pill-padding variants, etc.).

After this feature, the color system provides a single, complete set of semantic roles
covering every foreseeable UI state. No element is left without a role, and no role maps to
more than one token.

**Why this priority**: Without a complete, unambiguous set of color roles, Features 05-12
each make their own color decisions and drift continues. This is the foundational blocker.

**Independent Test**: Given only the color system document, a person implementing a new
component from scratch should be able to assign a color to every element in that component
— background, text, border, interactive state, and any status indication — without looking
anywhere else and without choosing between two equally plausible tokens.

**Acceptance Scenarios**:

1. **Given** a UI element whose role is "primary action," **When** a developer consults the
   color system, **Then** they find exactly one semantic color for that role — no ambiguity
   about which of two similar tokens to apply.
2. **Given** a UI element that indicates an error state, **When** a developer consults the
   color system, **Then** they find a color that is explicitly designated for error and
   documented as the highest-contrast moment in the otherwise muted palette.
3. **Given** a UI element that indicates a warning, **When** a developer consults the color
   system, **Then** they find a designated warning color that does not hardcode a raw value
   inside the component — the semantic role is the reference, not a raw color literal.

---

### User Story 2 — Color choices traceable to Quiet Competence, not arbitrary (Priority: P2)

The project owner confirmed Quiet Competence as the visual direction knowing it would
become the basis for Features 04-06. Each color decision in the resulting system must be
traceable back to that direction — so that if a future color choice is questioned, the
answer is "because this is what Quiet Competence means for this role," not "because it
looked good."

Specifically: Quiet Competence requires a muted, desaturated base palette with one quiet
accent; it also requires that error/warning states be the *only* high-contrast moments in
an otherwise restrained system (the manageable Principle II tension documented in
`visual-direction.md`). Both constraints must be verifiable in the color system document.

**Why this priority**: Traceability prevents future drift. Without it, the color system is
just a list of values with no rationale — and next time a value is changed, there is
nothing to check it against.

**Independent Test**: For any token in the color system, a reader can find its stated
character and trace it to a specific passage in `visual-direction.md` or `identity.md`.
Conversely: for the error/destructive role, the system explicitly states it is the
high-contrast exception in an otherwise muted palette.

**Acceptance Scenarios**:

1. **Given** the brand accent color token, **When** a reader asks "why is this color
   relatively muted rather than vibrant?", **Then** the color system document provides an
   answer traceable to the Quiet Competence character description in `visual-direction.md`.
2. **Given** the error/destructive color token, **When** a reader reads the color system,
   **Then** the document explicitly states this is the designed high-contrast exception —
   all other tokens are restrained so that this one stands out.
3. **Given** the complete token set, **When** a reader checks each token's character note
   against `visual-direction.md`'s Quiet Competence description, **Then** no token
   contradicts the direction's stated character (no vivid or warm-leaning values in the
   base palette).

---

### User Story 3 — Dark mode resolved once, not per surface (Priority: P3)

The audit found an inconsistency: `gridu-web` triggers dark mode via a `.dark` CSS class
(runtime-controlled), while `gridu-landing` uses `@media (prefers-color-scheme: dark)`
(OS-only). The color values are identical; the mechanism is not. This feature must resolve
which mechanism is correct for the gridu design system, so Features 07-12 don't have to
re-decide it per surface.

The color system document must define both the light and dark token values for every role,
AND declare the intended dark-mode activation mechanism for both surfaces going forward.

**Why this priority**: Dark mode mechanism inconsistency is a cross-surface design-system
decision, not a per-surface implementation detail. Resolving it here means every
subsequent feature in Phase 1 and 2 works from the same assumption.

**Independent Test**: The color system document answers the question "how should a new
surface using this design system trigger dark mode?" with exactly one answer — not two
options.

**Acceptance Scenarios**:

1. **Given** the color system document, **When** a developer sets up dark mode on a new
   surface, **Then** the color system specifies exactly one activation mechanism to follow.
2. **Given** the color system's dark-mode token set, **When** checked for contrast in dark
   mode, **Then** every role that passes WCAG AA in light mode also passes in dark mode.

---

### Edge Cases

- What happens when a UI element needs a color that is between two semantic roles (e.g.,
  an informational state that isn't quite "success" or "neutral")? → The color system must
  cover enough semantic roles to leave no UI-state gaps requiring a new ad hoc value.
- How does the muted palette avoid making error states feel like "just another muted
  color"? → The destructive/error role must be explicitly differentiated by contrast and
  saturation from all non-error roles.
- Can the accent color serve double-duty as a success indicator? → The system must answer
  this explicitly: either the accent IS the success color (by role definition), or success
  is a separate role, to avoid the accent losing its meaning.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The color system MUST define a complete set of semantic color roles covering
  every foreseeable UI state: base surface (background), content (foreground text), primary
  action, brand accent, muted/secondary surface, border, interactive input, destructive/
  error, warning, and success — leaving no foreseeable UI state without a named semantic
  role. (Disabled states are expressed via a combination of `muted-surface` +
  `muted-foreground` at component level and are deferred to Feature 06; a dedicated
  `disabled` role is not added here — see plan.md Research Decision 2 and Principle I.)

- **FR-002**: Each semantic role MUST have exactly one token per mode (light, dark) — no
  role may resolve to multiple plausible tokens, and no two roles may be interchangeable
  for the same UI use case.

- **FR-003**: Every token MUST include a character note tracing its value tendency (hue
  range, relative saturation, relative lightness) to the Quiet Competence direction in
  `visual-direction.md` or to a specific principle in `.specify/memory/constitution.md`.

- **FR-004**: The destructive/error role MUST be the designed high-contrast exception:
  its contrast against the base surface MUST be perceptibly greater than any other role in
  the palette, and the color system MUST document this explicitly as resolving the
  manageable Principle II tension stated in `visual-direction.md`.

- **FR-005**: All text-on-background pairings defined in the color system MUST meet WCAG
  2.1 Level AA contrast (minimum 4.5:1 for normal text, 3:1 for large/bold text) in both
  light and dark modes. Pairings that don't satisfy AA MUST NOT be designated as a
  text-on-background role.

- **FR-006**: The color system MUST specify exactly one dark-mode activation mechanism for
  the gridu design system, resolving the inconsistency between `gridu-web` (class-based)
  and `gridu-landing` (media-query-based) identified in `audit.md`.

- **FR-007**: The color system MUST use OKLCH as the color space for all token values. The
  existing token set already uses OKLCH on both surfaces (audit.md); this feature makes
  that choice explicit and normative rather than incidental.

- **FR-008**: The color system deliverable (`color-system.md`) MUST live only in
  `gridu-design-system/specs/04-define-color-system/` — it is the single source of truth.
  No duplicate color definition or alternative value set may exist in `gridu-web` or
  `gridu-landing` as a result of this feature.

### Key Entities

- **Semantic Color Role**: The named purpose a color serves in the UI (e.g., "brand
  accent," "destructive/error," "muted surface"). A role has: a name, a purpose
  description, a light-mode OKLCH value, a dark-mode OKLCH value, a character note, and
  an accessibility note (contrast pairings it participates in).

- **Color System**: The complete set of semantic roles, plus the declared dark-mode
  activation mechanism and the stated color space. This is the document `color-system.md`
  that Features 05, 06, and 07-12 consume as a source of truth.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Every semantic role in the color system can be matched to exactly one
  token — a person filling a color decision finds zero cases where two tokens are equally
  valid for the same role (testable by attempting to assign colors to all components in the
  audit without needing to choose between two plausible same-purpose tokens).

- **SC-002**: All text-on-background pairings defined in the color system pass WCAG 2.1
  AA contrast in both light and dark modes — verifiable by running contrast checks on every
  designated pairing in `color-system.md` (no special tooling required; any contrast
  calculator suffices).

- **SC-003**: The error/destructive role is visually distinguishable from all non-error
  roles by a developer using only the OKLCH values in the color system and a contrast
  checker — no subjective judgment required to identify it as the high-contrast exception.

- **SC-004**: The dark-mode activation mechanism is stated in exactly one place (this
  document) and is consistent between `gridu-web` and `gridu-landing` after this feature —
  the audit-identified inconsistency no longer exists (verifiable by reading the mechanism
  declaration in `color-system.md` and confirming it is unambiguous).

---

## Assumptions

- The color space for all tokens is OKLCH — this follows the existing convention on both
  surfaces and is the most perceptually uniform option available; no color space decision
  is needed (FR-007 formalizes what is already in place).
- The Quiet Competence visual direction is the confirmed single input to color character
  decisions — no further owner confirmation gate is needed for individual token choices,
  since the direction itself was already confirmed in Feature 03.
- The color system deliverable is a Markdown document (`color-system.md`) defining token
  roles and values — not a CSS file, a JSON tokens file, or a design-tool export. Those
  implementation artifacts are produced in Feature 06 (Design Tokens) and are out of scope
  here.
- Dark mode is in scope: both surfaces already implement it (audit.md), and the mechanism
  inconsistency identified there is a design-system-level decision this feature resolves.
- WCAG 2.1 Level AA is the accessibility floor. WCAG AAA (7:1 contrast) is not required
  for this phase, though individual roles may exceed it incidentally.
- The existing brand hue — teal, `hue ≈ 165` in OKLCH — is the starting point for the
  accent/brand role. The feature may adjust saturation and lightness to fit the Quiet
  Competence character, but the hue family is not re-chosen in this feature (visual
  direction research in Feature 03 did not identify a hue change as needed).
