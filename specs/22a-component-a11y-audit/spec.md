# Feature Specification: Component-Level Accessibility Audit

**Feature Branch**: `22a-component-a11y-audit`

**Created**: 2026-07-03

**Status**: Draft

**Input**: User description: "Component-level accessibility audit: review every published component (Button, Input, Card, Table, Navigation, Chart) against WCAG 2.1 AA for color contrast, keyboard focus visibility/order, and ARIA semantics. Produce a findings report per component and fix any violations found directly in the component source, tokens, or stories. This is Feature 22a (Phase 3 — QA & Accessibility) of the Product Identity Refresh epic tracked in gridu/docs/planning/epic-product-identity-refresh.md."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Consumer app ships an accessible component without extra work (Priority: P1)

A developer in `gridu-web` or `gridu-landing` drops in a design-system component (Button,
Input, Card, Table, Navigation, or Chart) and, without doing any accessibility work of their
own, the component is keyboard-operable, has visible focus states, meets WCAG 2.1 AA contrast,
and exposes correct ARIA semantics to assistive technology.

**Why this priority**: This is the entire point of a shared design system — accessibility
fixed once here means it never needs to be re-solved per consuming app. It's also the
prerequisite for Features 22b and 22c (the consuming apps' own QA passes assume the components
they render are already accessible).

**Independent Test**: Can be fully tested by auditing each of the six components in isolation
(in Storybook or equivalent) against WCAG 2.1 AA criteria for contrast, focus, and ARIA — no
consuming app needed.

**Acceptance Scenarios**:

1. **Given** a component rendered in its default state, **When** its text and interactive
   elements are measured against their background, **Then** color contrast meets or exceeds
   WCAG 2.1 AA (4.5:1 for normal text, 3:1 for large text and UI component boundaries).
2. **Given** a component with interactive elements (Button, Input, Table row actions,
   Navigation links, Chart legend/controls if interactive), **When** a user tabs through the
   page using only the keyboard, **Then** every interactive element receives focus in a
   logical order and shows a visible focus indicator meeting the 3:1 non-text contrast
   minimum.
3. **Given** a component rendered with assistive technology active (screen reader), **When**
   the AT encounters the component, **Then** it announces the component's role, name, and
   state (e.g. a disabled Button is announced as disabled; a Table is announced as tabular
   data with row/column context; Navigation is announced as a navigation landmark) using
   correct native HTML semantics or ARIA attributes.

---

### User Story 2 - Design system maintainer gets a durable audit trail (Priority: P2)

A maintainer of `gridu-design-system` wants a written record of what was checked, what was
found, and what was fixed, so that future component changes can be checked against the same
baseline instead of re-auditing from scratch.

**Why this priority**: Without a findings report, the audit's value disappears the moment the
session ends — nobody can tell later whether a given violation was checked-and-passed or
never checked at all.

**Independent Test**: Can be tested by confirming a findings report exists that lists all six
components, the criteria checked against each, and the pass/fail/fixed status of each.

**Acceptance Scenarios**:

1. **Given** the audit is complete, **When** a maintainer opens the findings report, **Then**
   they see, per component, which WCAG 2.1 AA criteria were checked and the outcome
   (pass / violation found and fixed / violation found and deferred with reason).

---

### User Story 3 - No visual regression from accessibility fixes (Priority: P3)

A consuming app that already uses these components upgrades to the patched version and sees
no unintended visual or behavioral change beyond the accessibility fix itself (e.g. a
contrast fix may shift a token's color value, but must not break the component's layout or
existing documented behavior).

**Why this priority**: Protects the two consuming apps (`gridu-web`, `gridu-landing`) from an
accessibility patch turning into a breaking visual change they didn't ask for.

**Independent Test**: Can be tested by running the existing component test/story suite before
and after the audit's fixes and confirming no unrelated snapshot or interaction test breaks.

**Acceptance Scenarios**:

1. **Given** a component's existing automated tests and stories, **When** an accessibility fix
   is applied, **Then** all pre-existing tests still pass and no story's documented visual
   intent changes except where the fix itself required it.

### Edge Cases

- What happens when a component's current design token (e.g. a brand color) cannot meet AA
  contrast at its current value? → The finding is documented with the exact required token
  adjustment; the fix is applied at the token level so all consumers of that token benefit,
  not patched per-component.
- What happens when fixing a contrast or focus issue conflicts with the Phase 0 visual
  direction (e.g. a deliberately subtle brand color)? → Accessibility compliance takes
  precedence per WCAG 2.1 AA being a hard floor, not a preference; the finding notes the
  trade-off for the maintainer's awareness.
- How does the audit handle a component with no interactive elements (e.g. Card used purely
  as a static container)? → Contrast and ARIA semantics are still checked; keyboard focus
  criteria are marked not-applicable rather than failed.
- How does the audit handle Chart, where data-driven colors (e.g. series colors) may not all
  be checkable against a single background? → Each distinct chart color-on-background pairing
  used in the component's default stories is checked individually; findings note any pairing
  that cannot reach AA and recommend a token-level palette adjustment.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The audit MUST cover all six published components: Button, Input (`field`),
  Card, Table, Navigation, and Chart.
- **FR-002**: For each component, the audit MUST check color contrast (text and non-text UI
  boundaries) against WCAG 2.1 AA thresholds (4.5:1 normal text, 3:1 large text and UI
  component boundaries) using the component's design-system tokens.
- **FR-003**: For each component with interactive elements, the audit MUST check that all
  interactive elements are reachable via keyboard alone, in a logical tab order, and MUST
  check that a visible focus indicator is present and meets the 3:1 non-text contrast
  minimum.
- **FR-004**: For each component, the audit MUST check that ARIA roles, names, and states are
  correct — preferring native HTML semantics over explicit ARIA attributes where native
  semantics suffice.
- **FR-005**: The audit MUST produce a written findings report (one entry per component)
  recording the criteria checked and the outcome for each.
- **FR-006**: Any violation found MUST be fixed directly in the component source, its design
  tokens, or its stories — the audit does not conclude with a list of unfixed defects unless
  a fix is genuinely out of scope (see FR-007).
- **FR-007**: If a violation cannot be fixed within this feature's scope (e.g. it requires a
  Phase 0 visual-direction decision outside this audit's authority), the findings report MUST
  document the violation, why it was deferred, and what decision is needed to resolve it.
- **FR-008**: Fixes MUST NOT break any pre-existing automated test or change a story's
  documented visual intent beyond what the fix itself requires.
- **FR-009**: The findings report MUST be committed to the repository (under this feature's
  spec directory) so it remains available as a durable baseline for future component changes.

### Key Entities

- **Findings Report**: Per-component record of WCAG 2.1 AA criteria checked (contrast, focus,
  ARIA) and outcome (pass / fixed / deferred-with-reason). Lives alongside this spec.
- **Component**: One of the six published design-system components (Button, Input, Card,
  Table, Navigation, Chart), each with its own source, tokens, and stories.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of the six published components have a completed findings-report entry
  covering contrast, focus, and ARIA semantics.
- **SC-002**: Zero unresolved WCAG 2.1 AA contrast violations remain across all six
  components' default states, except violations explicitly deferred with a documented reason.
- **SC-003**: 100% of interactive elements across the six components are operable via keyboard
  alone with a visible focus indicator, verified by manual keyboard-only traversal of each
  component's default story.
- **SC-004**: 100% of pre-existing component tests and stories continue to pass after fixes
  are applied.

## Assumptions

- WCAG 2.1 AA (not AAA) is the compliance bar, matching the epic tracker's Feature 22a title
  ("a11y audit (contrast, focus, ARIA)") and standard industry practice for this class of
  product.
- The audit is manual/tool-assisted (e.g. axe, browser DevTools contrast checkers) rather than
  requiring a new automated CI accessibility gate — introducing CI enforcement is a separate,
  future decision and out of scope here.
- "Published components" means the six listed in the epic tracker's Phase 1
  (`src/components/button`, `field`, `card`, `table`, `navigation`, `chart`); no new components
  are added by this feature.
- Screen reader verification is done with a standard combination (e.g. VoiceOver + Safari or
  NVDA + Chrome) rather than exhaustive AT/browser matrix testing.
- This repo has no consuming-app context, so User Story 1's acceptance is verified against the
  component in isolation (Storybook), not inside `gridu-web` or `gridu-landing` — those get
  their own integration QA in Features 22b and 22c.
