# Feature Specification: Input Component

**Feature Branch**: `08-input-component`

**Created**: 2026-06-30

**Status**: Draft

**Input**: User description: "Input Component — Feature 08 of the Product Identity Refresh
epic, Phase 1 (Components) in gridu-design-system. Define a styled, accessible text Input
component (and related form-field primitives like label/helper/error text) built on the
design tokens and principles established in Features 04-07, consistent with the Button
component delivered in Feature 07."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - A consumer surface renders a labeled, ready-to-fill text field (Priority: P1)

A developer building a form in `gridu-web` or `gridu-landing` (e.g. login, signup, business
profile, search) needs to render a labeled text input that resolves to the design system's
documented color and typography roles at rest, hover, focus, and disabled — without
inventing new border colors, spacing, or font sizes.

**Why this priority**: Every data-entry surface in the product depends on this; it is the
second concrete component pattern after Button, and the first one to establish the
field/label/helper-text composition every later form-bearing component (Card forms, Table
inline-edit, Navigation search) will reuse.

**Independent Test**: Can be fully tested by rendering a labeled input in each of its states
(rest, hover, focus, disabled) side by side and confirming every color resolves to
`color-system.md`'s documented roles (`input` for the at-rest outline, `ring` for focus) with
no ad-hoc values, and that the label remains legibly associated with its field via Typography
System roles.

**Acceptance Scenarios**:

1. **Given** an empty text input with a label, **When** it is rendered at rest, **Then** its
   outline uses the `input` token and its label uses the documented label/caption typography
   role, with no other field on the same screen looking visually different for the same
   state.
2. **Given** a text input, **When** the user clicks or tabs into it, **Then** the outline
   switches to the `ring` focus indicator and the `input` token itself does not change,
   matching the behavior documented for `input`/`ring` in color-system.md.
3. **Given** a text input marked disabled, **When** it is rendered, **Then** it is visually
   and programmatically non-interactive (not focusable, not editable) and distinguishable at
   a glance from an enabled-but-empty field.

---

### User Story 2 - A user is shown a validation error without losing their place (Priority: P1)

A user filling out a form submits or blurs a field with invalid or missing data (e.g. an
empty required field, a malformed phone number) and needs to see, directly attached to that
field, what is wrong and how to fix it — without the page jumping or the error appearing
somewhere disconnected from the field.

**Why this priority**: This is the component's direct expression of the product's "Fail
Loud, Never Silent" principle (per `identity.md`, also invoked in Feature 07's spec) at the
most granular level of the UI — a form that silently rejects input, or shows an error the
user can't connect to its field, breaks that guarantee.

**Independent Test**: Can be fully tested by triggering a validation error on a field and
confirming an error message renders adjacent to that specific field using the `destructive`
color role, the field's outline switches to the `destructive` role, and a screen reader
announces both the error state and the error text when the field receives focus.

**Acceptance Scenarios**:

1. **Given** a required text input is left empty, **When** the form is submitted (or the
   field is blurred, per the field's configured validation timing), **Then** the field's
   outline switches to the `destructive` token and an error message appears directly below
   the field using the `destructive` token for its text.
2. **Given** a field currently showing an error, **When** the user corrects the value to a
   valid one, **Then** the error message and `destructive` outline clear and the field
   returns to its normal (or focus) appearance.
3. **Given** a field showing an error, **When** a screen reader user navigates to or is
   already on that field, **Then** the error text is announced as associated with the field,
   not merely present elsewhere on the page.

---

### User Story 3 - A user operating only a keyboard or screen reader can identify, fill, and understand a field (Priority: P1)

A user navigating by keyboard (Tab, type, Shift+Tab) or via a screen reader needs every text
input to announce its label, its current value, whether it is required, and its current
state (disabled, error, read-only) — and needs a visible focus indicator while it has focus.

**Why this priority**: Identical accessibility bar to Button (Feature 07, User Story 2);
without this, the component cannot be used to build a form that meets the product's
accessibility commitments, and every consumer would have to patch in this behavior
ad-hoc per screen.

**Independent Test**: Can be fully tested by tabbing through a form built entirely from this
component and confirming each field shows a visible focus ring meeting the color system's
documented contrast ratio, and that a screen reader announces label, required state, and
error state (when present) for each field without additional markup from the consumer.

**Acceptance Scenarios**:

1. **Given** a text input has keyboard focus, **When** the user is tabbing through the page,
   **Then** a visible focus indicator (the `ring` token) appears that meets the color
   system's documented contrast ratio against the surface behind it.
2. **Given** a required text input, **When** a screen reader user reaches it, **Then** the
   screen reader announces that the field is required, in addition to its label.
3. **Given** a text input with helper text (non-error guidance, e.g. "We'll only use this to
   confirm your account"), **When** a screen reader user reaches the field, **Then** the
   helper text is announced as associated with the field.

---

### User Story 4 - A developer composes a field with optional helper text and adornments (Priority: P2)

A developer needs to add non-error guidance text below a field (e.g. format hints, character
limits) and, for some fields, a leading or trailing icon (e.g. a search icon, a
show/hide-password toggle) without breaking the field's label association, spacing, or
states.

**Why this priority**: Common but not universal — most fields in the initial form surfaces
(login, signup) need only a label and, sometimes, helper text; icon adornments are needed for
a smaller subset (search, password) and can follow once the core field pattern (User Stories
1-3) is established.

**Independent Test**: Can be fully tested by rendering a field with helper text only, a field
with a leading icon only, a field with a trailing icon only, and confirming each composes
correctly with the field's label, padding, and all four states without misaligned text or
icon clipping.

**Acceptance Scenarios**:

1. **Given** a field with helper text and no error, **When** it is rendered, **Then** the
   helper text appears below the field using the documented caption typography role and a
   muted (non-`destructive`) color.
2. **Given** a field with both helper text and an active error, **When** the error is shown,
   **Then** the error message replaces the helper text (the two are never shown
   simultaneously for the same field).
3. **Given** a field configured with a leading or trailing icon, **When** it is rendered,
   **Then** the input's text content does not overlap the icon at any defined size.

---

### Edge Cases

- What happens when a field's label, helper text, or error message is long enough to wrap
  onto multiple lines? The field must not visually break; the label/helper/error wrap rather
  than truncate (unlike Button's text, which truncates — field guidance text is rarely
  decorative and truncating it could hide required information, which conflicts with "Fail
  Loud, Never Silent").
- What happens when a field is both `disabled` and would otherwise show an error (e.g.
  pre-filled with invalid data from a previous session)? Disabled state takes visual and
  interactive precedence; the error is not shown while the field is disabled, since the user
  cannot act on it.
- What happens when a field is `read-only` (value visible, not user-editable, distinct from
  `disabled`)? It must remain focusable and selectable (for copying) and be visually distinct
  from both the enabled and disabled states.
- How does the component behave inside a dark-mode surface? All color references resolve
  through the same token roles (`input`, `ring`, `destructive`), which already define both
  light and dark values per color-system.md — no separate dark-mode logic is needed in the
  component itself.
- What happens when autofill (browser-provided) populates a field? The field's at-rest
  styling must not be overridden by the browser's default autofill background/text color in
  a way that breaks contrast against the label or breaks the `input` token's appearance.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a text input component supporting at minimum the
  `text`, `email`, `password`, `tel`, `search`, and `number` input types.
- **FR-002**: System MUST render a visually and programmatically associated label for every
  field instance (no field may be rendered without a label or an explicit, documented
  accessible-name alternative for cases where a visible label is omitted).
- **FR-003**: System MUST support the following states, each visually distinct using only
  documented design-token roles: rest, hover, focus, disabled, read-only, and error.
- **FR-004**: System MUST support an optional helper text region below the field for
  non-error guidance, using the caption typography role and a muted color.
- **FR-005**: System MUST support an optional error text region below the field that, when
  active, replaces any helper text, uses the `destructive` token for both the field outline
  and the error text, and is announced by assistive technology as associated with the field.
- **FR-006**: System MUST support a `required` indicator that is both visually shown (on the
  label) and programmatically exposed (announced by assistive technology).
- **FR-007**: System MUST support optional leading and/or trailing icon adornments that do
  not overlap input text or the field's interactive hit area.
- **FR-008**: System MUST expose a visible keyboard focus indicator using the `ring` token,
  consistent with the focus treatment defined for Button (Feature 07).
- **FR-009**: System MUST prevent interaction (typing, focus via Tab) with a field in the
  disabled state, and MUST allow focus and text selection (but not editing) for a field in
  the read-only state.
- **FR-010**: System MUST size its hit area and padding using the spacing and sizing scale
  established in `06-define-design-tokens` (no ad-hoc pixel values).
- **FR-011**: System MUST resolve all color usage to roles documented in
  `color-system.md` (`input`, `ring`, `destructive`, plus surface/text roles as applicable) —
  no new color values may be introduced by this component.
- **FR-012**: System MUST resolve all text usage (label, value, helper, error) to roles
  documented in `typography-system.md` — no new font sizes or weights may be introduced by
  this component.

### Key Entities

- **Field**: A single labeled input instance — comprises a label, an input control, an
  optional leading/trailing icon, and an optional helper-or-error text region. States (rest,
  hover, focus, disabled, read-only, error) are mutually exclusive except where explicitly
  layered (e.g. focus + error).
- **Helper/Error text**: Guidance text bound to exactly one field; mutually exclusive at any
  given moment (error always takes precedence over helper text when both would otherwise
  apply).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A developer can render a fully labeled, accessible text field — including
  required indicator, helper text, and error state — using only this component's public API,
  with zero additional ad-hoc CSS.
- **SC-002**: 100% of the component's color usage traces to a documented `color-system.md`
  role, verifiable by inspection with no ad-hoc values present.
- **SC-003**: 100% of fields built with this component are operable via keyboard alone
  (focus, type, clear) with no mouse-only interactions.
- **SC-004**: Screen reader users can determine a field's label, required state, and current
  error (when present) without any markup beyond the component's own props, verified by
  manual screen-reader pass on each state.
- **SC-005**: A field's focus indicator and error-state outline meet the same contrast ratio
  already verified for the `ring` and `destructive` tokens in color-system.md (no new
  contrast verification needed at the component level beyond confirming correct token usage).

## Assumptions

- This feature defines a single-line text field and its label/helper/error primitives only;
  multi-line text areas, select/dropdown, checkbox, radio, switch, and date/file pickers are
  out of scope and will be separate future component specs.
- Validation logic (when to trigger an error: on blur, on submit, on change) is owned by the
  consumer (the form using this component); the component only renders the error state and
  message it is given, it does not implement validation rules itself.
- Migrating gridu-web's and gridu-landing's existing form fields onto this component is out
  of scope for this feature, consistent with the same exclusion made for Button in Feature
  07.
- The component is built for and tested against the light/dark token pairs already defined
  in color-system.md; no additional theming modes are in scope.
- Icon adornments use whatever icon set/component the consuming app already provides (no new
  icon system is introduced by this feature).
