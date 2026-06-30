# Feature Specification: Navigation Component

**Feature Branch**: `11-navigation-component`

**Created**: 2026-06-30

**Status**: Draft

**Input**: User description: "Navigation Component — Feature 11 of the Product Identity
Refresh epic, Phase 1 (Components) in gridu-design-system. Define a styled, accessible
navigation component (e.g. top nav / sidebar nav for gridu-web dashboard) built on the
design tokens and principles established in Features 04-06, consistent with the Button,
Input, Card, and Table components delivered in Features 07-10."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - A dashboard owner orients themselves via a persistent sidebar (Priority: P1)

A business owner using `gridu-web` opens any dashboard page and sees a persistent vertical
list of the primary sections (e.g. Bookings, Clients, Settings) using the design system's
documented surface, border, and typography roles. The section corresponding to the page
they're currently on is visually distinguished from the rest, so they always know where
they are without reading the page content first.

**Why this priority**: This is the dashboard's primary wayfinding surface — every other
screen in `gridu-web` (Phase 2a) depends on it existing and working correctly before any
page-specific content is meaningful.

**Independent Test**: Can be fully tested by rendering the component with a list of
destinations and a designated active one, and confirming the active item is distinguishable
by more than color alone, using only documented token roles.

**Acceptance Scenarios**:

1. **Given** a sidebar with several destinations, **When** it renders with one destination
   marked active, **Then** that destination is visually distinguished from the others using
   only documented `color-system.md` and `typography-system.md` roles.
2. **Given** a sidebar destination, **When** a user hovers, focuses, or activates it via
   keyboard, **Then** the corresponding rest/hover/focus/pressed state is visible and uses
   the same `ring` focus treatment already established for Button, Input, and Card.
3. **Given** the sidebar, **When** inspected by assistive technology, **Then** it is exposed
   as a navigation landmark and the active destination is announced as the current page.

---

### User Story 2 - A destination is temporarily unavailable to the current account (Priority: P2)

A business owner on a plan that doesn't include a given feature (e.g. a premium reporting
section) sees that destination listed in the sidebar but unable to be activated, so they
know the feature exists without being misled into thinking it's broken.

**Why this priority**: Gating destinations by plan/permission is a recurring real need in
`gridu-web` (subscription management is already a live concern in this product), but it is
secondary to the base navigation experience working at all.

**Independent Test**: Can be fully tested by rendering a destination in the disabled state
and confirming it cannot be focused via Tab or activated via click/Enter, and is announced
as unavailable to assistive technology.

**Acceptance Scenarios**:

1. **Given** a disabled destination, **When** a user tabs through the sidebar, **Then**
   focus skips the disabled destination.
2. **Given** a disabled destination, **When** inspected by assistive technology, **Then** it
   is announced as disabled/unavailable.

---

### User Story 3 - The same navigation renders as a horizontal bar (Priority: P3)

A consumer surface that needs a horizontal navigation bar (e.g. a top-level header) renders
the same set of destinations and active-state behavior as a horizontal layout, built from
the same tokens and states as the vertical (sidebar) layout, rather than as a separate,
independently maintained component.

**Why this priority**: Establishes the component as a general-purpose navigation primitive
rather than a sidebar-only one, mirroring the vertical/horizontal layout split already
established for Card (Feature 09). Lower priority than P1/P2 because `gridu-web`'s
immediate, named need (epic tracker Features 13-16) is the dashboard sidebar.

**Independent Test**: Can be fully tested by rendering the same destination list in the
horizontal layout and confirming identical active/hover/focus/disabled behavior to the
vertical layout, differing only in axis.

**Acceptance Scenarios**:

1. **Given** a destination list, **When** rendered in horizontal layout, **Then** the active,
   hover, focus, and disabled states behave identically to the vertical layout.

---

### Edge Cases

- What happens when a destination's label is too long for the available width (sidebar at
  its default width, or a horizontal bar with many destinations)? The component must
  truncate the label rather than wrap it to a second line or overflow the container.
- What happens when no destination matches the current page (e.g. a 404 or a page outside
  the documented destination list)? No destination is marked active; the component does not
  guess or default to marking the first item active.
- How does the component behave when a destination list is empty? It renders the navigation
  landmark with no items rather than collapsing to nothing, so the surrounding layout
  doesn't shift.
- What happens when a destination has an associated icon but the icon fails to resolve/load?
  The label remains visible and usable; a missing icon never blocks the destination from
  being read or activated.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a Navigation component that renders an ordered list of
  destinations, each with a label and an optional leading icon.
- **FR-002**: System MUST support a vertical (sidebar) layout and a horizontal (bar) layout
  of the same destination list, differing only in axis — consistent with the layout-mode
  pattern established for Card (Feature 09).
- **FR-003**: System MUST visually distinguish the active (current-page) destination from
  inactive ones by more than color alone.
- **FR-004**: System MUST expose exactly one active destination at a time, or none, when no
  destination matches the current page; the component MUST NOT infer or default an active
  destination on its own.
- **FR-005**: System MUST support rest, hover, focus, pressed (the momentary CSS `:active`
  press state — distinct from the persistent current-page `active` state in FR-003/FR-004),
  active, and disabled states per destination, each visually distinct using only documented
  design-token roles.
- **FR-006**: System MUST expose a visible keyboard focus indicator using the `ring` token,
  consistent with the focus treatment defined for Button, Input, and Card (Features 07-09).
- **FR-007**: System MUST resolve all color usage (surface, border, active indicator, text)
  to roles documented in `color-system.md` — no new color values may be introduced by this
  component.
- **FR-008**: System MUST resolve all text usage (destination labels) to roles documented in
  `typography-system.md` — no new font sizes or weights may be introduced by this component.
- **FR-009**: System MUST size padding, spacing between destinations, and icon dimensions
  using the spacing and sizing scale established in `06-define-design-tokens` — no ad-hoc
  pixel values.
- **FR-010**: System MUST expose the component as a navigation landmark to assistive
  technology, and announce the active destination as the current page.
- **FR-011**: System MUST prevent a disabled destination from being focused via Tab or
  activated via click/Enter, and MUST announce it as disabled/unavailable to assistive
  technology.
- **FR-012**: System MUST truncate an overflowing destination label with an indicator (e.g.
  ellipsis) rather than wrapping it to a second line or overflowing the container, and MUST
  still expose the full label as the accessible name.
- **FR-013**: System MUST render correctly with zero destinations (an empty navigation
  landmark) without collapsing the surrounding layout.
- **FR-014**: System MUST continue to display and allow activation of a destination's label
  when its associated icon fails to resolve.

### Key Entities

- **Navigation**: A bounded, ordered list of destinations exposed as a navigation landmark,
  in either a vertical (sidebar) or horizontal (bar) layout.
- **Destination**: A single navigable entry — a label, an optional leading icon, and a state
  (rest, hover, focus, pressed, active, or disabled). Exactly one destination may be active
  at a time, or none.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A developer can render a fully composed navigation — destination list, active
  state, vertical or horizontal layout — using only this component's public API, with zero
  additional ad-hoc CSS.
- **SC-002**: 100% of the component's color and typography usage traces to a documented
  `color-system.md` or `typography-system.md` role, verifiable by inspection with no ad-hoc
  values present.
- **SC-003**: 100% of enabled destinations are operable via keyboard alone (focus, activate);
  100% of disabled destinations are unreachable via keyboard.
- **SC-004**: Screen reader users can determine the navigation landmark, each destination's
  accessible name, and which destination (if any) is the current page, without any markup
  beyond the component's own props, verified by manual screen-reader pass on each state.
- **SC-005**: A destination's focus indicator meets the same contrast ratio already verified
  for the `ring` token in `color-system.md` (no new contrast verification needed at the
  component level beyond confirming correct token usage).

## Assumptions

- This feature defines a single-level navigation primitive (a flat, ordered list of
  destinations). Nested/grouped navigation (section headers, expandable sub-items) is out of
  scope for v1, per the constitution's "Default Over Configure" principle — it can be added
  once a real `gridu-web` screen (Phase 2a) demonstrates the need.
- A collapsible icon-only sidebar mode (e.g. for narrow viewports) is out of scope for v1.
  The vertical layout ships at a single fixed width; collapse behavior is deferred until a
  real `gridu-web` screen demonstrates the need, consistent with "Default Over Configure."
- The horizontal layout's behavior on viewports too narrow to fit all destinations (e.g. a
  mobile overflow/hamburger pattern) is out of scope for this feature; Feature 11 defines the
  destination list and state behavior shared by both layouts, not a responsive collapse
  strategy. This mirrors the audit finding that `gridu-landing`'s existing header already
  solves mobile collapse with its own zero-JS pattern, outside this component's scope.
- Routing/active-destination determination (matching the current URL to a destination) is a
  consuming application concern; this component only renders whichever destination is passed
  to it as active.
- Migrating gridu-web's existing dashboard sidebar onto this component is out of scope for
  this feature, consistent with the same exclusion made for Button, Input, Card, and Table
  (Features 07-10).
- The component is built for and tested against the light/dark token pairs already defined
  in `color-system.md`; no additional theming modes are in scope.
