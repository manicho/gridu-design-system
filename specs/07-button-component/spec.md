# Feature Specification: Button Component

**Feature Branch**: `07-button-component`

**Created**: 2026-06-30

**Status**: Draft

## Clarifications

### Session 2026-06-30

- Q: What is the closed variant set? → A: 5 variants — primary, secondary, destructive,
  outline, ghost. "Link" (text-only, underline, navigational) is explicitly excluded from
  this component; it is deferred as a separate future pattern, not collapsed into another
  variant.
- Q: What is the defined behavior when button text overflows its container? → A: Truncate
  with ellipsis at a maximum width. This is a safety net, not an expected case — button copy
  is short by product convention ("Respectful brevity").

**Input**: User description: "Feature 07 — Button Component. Define the canonical Button
component for the gridu design system, the first of the Phase 1 component features. Define
variants, sizes, and states built on the color/typography roles from tokens.css (Features
04-06), not new ad-hoc values. Cover accessibility (keyboard focus, disabled vs loading,
minimum hit target, contrast), icon support (leading/trailing, icon-only), and establish the
pattern later component specs (08-12) will follow. Out of scope: migrating gridu-web's and
gridu-landing's existing buttons onto the new component."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - A consumer surface renders an action with the right emphasis (Priority: P1)

A developer building a screen in `gridu-web` or `gridu-landing` needs to render an action
(e.g. "Save", "Cancel", "Delete account", "View pricing") with visual emphasis that matches
how important that action is relative to other actions on the same screen — without
inventing new colors or guessing at spacing.

**Why this priority**: Every other component depends on a button existing; without this,
nothing else in Phase 1 has a concrete pattern to follow, and every screen with an action
keeps inventing its own button styling, which is the exact "copy-paste-sync gap" Feature 06
flagged.

**Independent Test**: Can be fully tested by rendering each of the 5 defined variants side
by side and confirming each one resolves to color-system.md's documented roles with no
ad-hoc color values, and that the visual emphasis ordering (primary > secondary > outline >
ghost, with destructive distinct from all of them) is unambiguous to a reader scanning the
screen.

**Acceptance Scenarios**:

1. **Given** a screen with one primary action and one secondary action, **When** both are
   rendered using the component's primary and secondary variants, **Then** the primary
   action is visually heavier (fill vs outline/text) and unambiguously the one to take first.
2. **Given** a destructive action (e.g. "Delete account"), **When** it is rendered using the
   destructive variant, **Then** it is visually distinct from primary/secondary so a user
   does not confuse it with a routine action.

---

### User Story 2 - A user operating only a keyboard or screen reader can identify and use a button (Priority: P1)

A user navigating by keyboard (Tab/Enter/Space) or via a screen reader needs every button —
regardless of variant — to announce itself as a button, show an unambiguous focus indicator,
and never be silently actionable while visually disabled.

**Why this priority**: gridu's target persona (a non-technical solo operator, per
`identity.md`) and the product's "Always-on reliability" / "Fail Loud, Never Silent"
principle both require that an action either visibly succeeds or visibly fails — a button a
user can't tell is disabled, or can't reach by keyboard, breaks that guarantee at the lowest
level of the UI.

**Independent Test**: Can be fully tested by tabbing through a row of buttons in every
variant and size and confirming each shows a visible focus ring, and by toggling the
disabled and loading states and confirming a screen reader announces the correct state.

**Acceptance Scenarios**:

1. **Given** a button has keyboard focus, **When** the user is tabbing through the page,
   **Then** a visible focus indicator appears that meets the color system's documented
   contrast ratio against the surface behind it.
2. **Given** a button is disabled, **When** a user attempts to activate it via mouse,
   keyboard, or screen reader, **Then** the action does not fire and assistive technology
   announces the button as disabled.
3. **Given** a button is in a loading state, **When** a screen reader user encounters it,
   **Then** it is announced as busy/unavailable rather than as a normal actionable button,
   and it cannot be activated a second time while loading.

---

### User Story 3 - A developer needs a button that pairs an icon with (or replaces text with) an icon (Priority: P2)

A developer needs to render an action that is icon-only (e.g. a toolbar close/settings
button) or that pairs a leading or trailing icon with text (e.g. "Save" with a checkmark, an
external link with a trailing arrow), using the same variant/size/state system as a
text-only button.

**Why this priority**: Both `gridu-web` (icon-only buttons in its settings and navigation
surfaces) and `gridu-landing` (icon-paired CTAs) already need this; it is real, observed
usage, not speculative.

**Independent Test**: Can be fully tested by rendering an icon-only button and confirming it
exposes an accessible name even though it has no visible text, and by rendering a text
button with a leading and a trailing icon and confirming icon and text spacing stays
consistent across sizes.

**Acceptance Scenarios**:

1. **Given** an icon-only button, **When** it is rendered without a text label, **Then** it
   still exposes a non-empty accessible name to assistive technology.
2. **Given** a button with a leading or trailing icon and visible text, **When** rendered at
   any defined size, **Then** the icon scales with the size and remains vertically centered
   with the text.

---

### Edge Cases

- What happens when a button is both `disabled` and `loading` at the same time? The button
  MUST behave as non-activatable in both states; the loading visual takes precedence so the
  user sees a reason ("something is happening") rather than an unexplained disabled control.
- What happens when an icon-only button has no accessible name provided? The component MUST
  make an explicit accessible-name input required for the icon-only configuration so this
  state cannot silently ship without one (no silent failure, per the "Fail Loud" principle).
- What happens when button text is long enough to overflow its container? The component
  MUST truncate the text with an ellipsis at a maximum width rather than wrapping or
  silently overflowing — this is a safety net; standard button copy stays short by product
  convention.
- What happens when a button needs to navigate (act as a link) rather than perform an
  in-page action? The component's visual system (variants/sizes/states) MUST be usable on a
  link-like element, since `gridu-landing` renders most of its CTAs as anchors, not buttons.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The component MUST define exactly 5 variants, ordered by visual emphasis:
  primary (filled, highest emphasis), secondary (lower-emphasis fill), destructive
  (irreversible/dangerous action), outline (bordered, no fill at rest), and ghost (no border
  or fill at rest, background appears on hover) — derived from variants already in active
  use in `gridu-web` today. A text-only/underline "link" treatment is explicitly out of
  scope for this component (see Assumptions).
- **FR-002**: Every variant MUST resolve exclusively to color roles already defined in
  `tokens.css` (Features 04-06). The component MUST NOT introduce a new color value that
  does not trace back to an existing role.
- **FR-003**: Every variant's text MUST use a typography role already defined in
  `tokens.css` (Feature 05/06). The component MUST NOT introduce a new font size, weight, or
  line-height value.
- **FR-004**: The component MUST define a small, closed set of sizes (at minimum: a default,
  a compact/small, and a large size), each with a minimum touch/click target that meets
  standard accessibility guidance regardless of how little content (e.g. a single icon) the
  button contains.
- **FR-005**: The component MUST define a visual treatment for each of the following states:
  default (resting), hover, focus-visible (keyboard focus), active (pressed), disabled, and
  loading — for every variant and size combination.
- **FR-006**: The focus-visible state MUST produce a focus indicator whose contrast against
  the adjacent surface meets the ratio documented in `color-system.md`, and MUST only appear
  for keyboard/assistive-technology focus, not for mouse-initiated focus.
- **FR-007**: The disabled state MUST prevent the button's action from firing via any input
  method (mouse, keyboard, touch) and MUST be announced as disabled to assistive technology.
- **FR-008**: The loading state MUST prevent the button's action from firing a second time
  while loading, MUST communicate "busy" to assistive technology, and MUST remain visually
  distinguishable from the disabled state so a user understands something is in progress
  rather than unavailable.
- **FR-009**: The component MUST support an optional leading icon, an optional trailing
  icon, and an icon-only configuration, all without changing the variant/size/state system
  already defined.
- **FR-010**: The icon-only configuration MUST require an accessible name to be supplied; a
  consumer MUST NOT be able to render an icon-only button without one.
- **FR-011**: The component's visual system (variants, sizes, states) MUST be applicable to
  a link-like (anchor) element in addition to a native button element, so it can represent a
  navigating action as well as an in-page action.
- **FR-012**: The component's documentation MUST state where it lives in this repository,
  how its variants/sizes/states map to `tokens.css` roles, and how a consuming repo
  (`gridu-web`, `gridu-landing`) is expected to eventually adopt it — establishing the
  pattern Features 08-12 will each follow for their own component.
- **FR-013**: The specification and its implementation MUST NOT modify any existing button
  usage in `gridu-web` or `gridu-landing`; this feature defines and implements the component
  in `gridu-design-system` only.
- **FR-014**: Text content that exceeds the button's maximum width MUST be truncated with an
  ellipsis rather than wrapped to multiple lines or allowed to silently overflow.

### Key Entities

- **Button Variant**: One of the 5 closed visual-emphasis levels — primary, secondary,
  destructive, outline, ghost. Determines which `tokens.css` color roles a button resolves
  to.
- **Button Size**: One of the closed set of dimensional presets (e.g. small, default,
  large). Determines padding, height/minimum target size, and which typography role applies.
- **Button State**: One of default, hover, focus-visible, active, disabled, or loading.
  Orthogonal to variant and size — every state must be defined for every variant/size pair.
- **Icon Slot**: An optional leading, trailing, or sole (icon-only) icon position within the
  button, which does not alter variant/size/state behavior.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A developer can identify which variant to use for a given action's importance
  (primary/secondary/destructive/low-emphasis) without consulting anyone else, based on the
  component's documentation alone.
- **SC-002**: 100% of the component's variant/state color combinations meet the contrast
  ratio documented in `color-system.md` for both light and dark mode.
- **SC-003**: Every button rendered by the component, in every size, meets the minimum
  touch/click target size regardless of content (text-only, icon+text, or icon-only).
- **SC-004**: A keyboard-only or screen-reader-only user can identify, focus, and activate
  any button rendered by the component, and can correctly distinguish a disabled button from
  a loading button, without sighted assistance.
- **SC-005**: Zero new color or typography values are introduced outside of `tokens.css`'s
  existing roles — every value the component uses traces back to Features 04-06.

## Assumptions

- The variant set is `gridu-web`'s current button usage (`default`/primary, `secondary`,
  `destructive`, `outline`, `ghost`) minus `link`, per the Clarifications session — `link`'s
  text-only/underline treatment is deferred as a future, separate pattern rather than folded
  into this component. Exact variant naming (e.g. `default` vs `primary`) is a planning
  decision, not a spec decision.
- `gridu-landing` currently has no shared button component of its own (its CTAs are
  hand-styled anchors/buttons per page); this feature does not need to reconcile against an
  existing landing-side component, only against the canonical tokens both surfaces already
  share.
- "Loading" is a visual/ARIA state the component must support, not necessarily a built-in
  boolean prop — `gridu-web` today composes loading behavior externally (disabling the
  button and swapping its content) via a wrapper around a plain button; how the component
  exposes loading is a planning decision.
- This feature's implementation lives entirely in `gridu-design-system` (component source +
  documentation); adopting it inside `gridu-web` or `gridu-landing` is explicitly deferred,
  matching how Feature 06 deferred full typography-class migration.
- "Standard accessibility guidance" for minimum touch/click target follows WCAG 2.2's
  documented target-size guidance; the exact pixel value is a planning decision.
