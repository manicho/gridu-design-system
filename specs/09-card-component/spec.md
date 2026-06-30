# Feature Specification: Card Component

**Feature Branch**: `09-card-component`

**Created**: 2026-06-30

**Status**: Draft

## Clarifications

### Session 2026-06-30

- Q: Does the Card component support a horizontal (list-row) layout in addition to the
  default vertical (stacked) layout? → A: Yes — both vertical (stacked heading/body/footer)
  and horizontal (leading media/icon + content) are layout modes of the same component,
  needed for the "list items" use case named in the epic tracker (e.g. an appointment-list
  row).
- Q: Does the card surface use elevation/shadow, given no shadow token exists yet in
  color-system.md or the design tokens? → A: Border-only — no shadow/elevation. Depth is
  conveyed only by the `border` token and surface contrast, consistent with Button and Input
  (Features 07-08), which also have no shadow primitive.
- Q: What is the truncation rule for overflowing body text in a fixed-height card (vertical
  layout)? → A: 3-line clamp with ellipsis. A fixed default, per the constitution's "Default
  Over Configure" principle, rather than a per-instance configurable line count.

**Input**: User description: "Card Component — Feature 09 of the Product Identity Refresh
epic, Phase 1 (Components) in gridu-design-system. Define a styled, accessible container
component for grouped content (e.g. dashboard summaries, list items, settings panels) built
on the design tokens and principles established in Features 04-08, consistent with the
Button and Input components delivered in Features 07-08."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - A consumer surface renders a labeled content group at rest (Priority: P1)

A developer building a dashboard or settings screen in `gridu-web` (e.g. a booking summary,
a business-profile panel, a single item in a list of upcoming appointments) needs to render a
bounded container that groups related content — typically a heading, a body region, and
optionally a footer of actions — using the design system's documented surface, border, and
typography roles, without inventing new background colors, border widths, radii, or spacing.

**Why this priority**: Every grouped-content surface in the product depends on this; it is
the third concrete component pattern after Button and Input, and the first one to establish
the surface/border/content composition that later list- and panel-bearing components (Table
rows, Navigation panels) will reuse.

**Independent Test**: Can be fully tested by rendering a card with a heading, body content,
and footer side by side with other cards and confirming every color resolves to
`color-system.md`'s documented roles (`background` or `muted-surface` for the card surface,
`border` for the outline) with no ad-hoc values, and that heading/body text resolve to
documented Typography System roles.

**Acceptance Scenarios**:

1. **Given** a card with a heading and body content, **When** it is rendered at rest, **Then**
   its surface uses a documented surface token (`background` or `muted-surface`) and its
   border uses the `border` token, with no other card on the same screen looking visually
   different for the same content shape.
2. **Given** a card containing a heading and a body region, **When** it is rendered, **Then**
   the heading uses a heading/title typography role and the body uses a documented body
   typography role, distinct from each other.
3. **Given** a card with an optional footer region (e.g. for action buttons), **When** the
   footer is present, **Then** it is visually separated from the body (via spacing and/or a
   `border` token divider) without introducing a new color value.

---

### User Story 2 - A user interacts with a clickable or selectable card (Priority: P1)

A user browsing a list of cards that represent a navigable or selectable item (e.g. a
business-profile card linking to its settings, a plan card in a pricing selection) needs
clear visual and keyboard feedback that the card is interactive, can be activated, and shows
its current selected/active state.

**Why this priority**: A meaningful share of the card's real-world usage (list items,
selectable summaries) is interactive, not purely decorative; without this, every consumer
would have to patch in hover/focus/selected behavior ad-hoc per screen, repeating the same
problem Button (Feature 07) solved for standalone actions.

**Independent Test**: Can be fully tested by rendering an interactive card, tabbing to it,
activating it via keyboard, and confirming a visible focus indicator appears using the `ring`
token, a hover state is visually distinct, and a selected/active card is distinguishable from
an unselected one without relying on color alone.

**Acceptance Scenarios**:

1. **Given** an interactive card, **When** the user hovers over it with a pointer, **Then**
   its surface or border changes using only documented token roles, distinct from its rest
   state.
2. **Given** an interactive card, **When** the user tabs to it via keyboard, **Then** a
   visible focus indicator (the `ring` token) appears, matching the focus treatment already
   defined for Button (Feature 07) and Input (Feature 08).
3. **Given** an interactive card marked as selected/active, **When** it is rendered, **Then**
   it is distinguishable from an unselected card by more than color alone (e.g. border weight
   or an icon), so the distinction is not lost for color-blind users.
4. **Given** a non-interactive (purely informational) card, **When** it is rendered, **Then**
   it exposes no hover, focus, or pressed affordance, so users do not mistake it for an
   actionable element.

---

### User Story 3 - A user operating only a keyboard or screen reader can identify and act on a card (Priority: P2)

A user navigating by keyboard or via a screen reader needs every interactive card to announce
its role (e.g. link or button), its accessible name (derived from its heading or an explicit
label), and its selected state when applicable — without needing additional markup from the
consumer beyond the component's own props.

**Why this priority**: Identical accessibility bar already set for Button and Input; ranked
P2 rather than P1 because it depends on User Story 2 (interactive cards) existing first —
purely informational cards (User Story 1) carry no interaction semantics to announce beyond
standard content structure.

**Independent Test**: Can be fully tested by tabbing through a list of interactive cards and
confirming a screen reader announces each card's role, accessible name, and selected state
(when applicable) without additional markup from the consumer.

**Acceptance Scenarios**:

1. **Given** an interactive card without an explicit accessible-name override, **When** a
   screen reader reaches it, **Then** its heading text is announced as the card's accessible
   name.
2. **Given** an interactive card, **When** a screen reader reaches it, **Then** its
   interactive role (e.g. link or button) is announced, consistent with the semantics of the
   action it performs.
3. **Given** an interactive card marked as selected, **When** a screen reader reaches it,
   **Then** its selected state is announced in addition to its accessible name.

---

### Edge Cases

- What happens when a card's heading or body content is long enough to overflow its
  container? Body content wraps rather than being clipped; if a card's layout requires a
  fixed height (e.g. a grid of equal-height summary cards), overflowing body text is
  truncated to a 3-line clamp with ellipsis — it is never silently clipped without
  indication, consistent with "Fail Loud, Never Silent."
- What happens when a card is both interactive and disabled (e.g. a plan card for a
  plan the user cannot currently select)? Disabled state takes visual and interactive
  precedence — no hover/focus/pressed affordance is shown, and it is not reachable via Tab.
- What happens when a card contains another interactive element (e.g. a button inside an
  otherwise-clickable card)? The nested interactive element's own action takes precedence
  over the card's click target in that region; the card MUST NOT swallow or duplicate the
  nested element's activation.
- How does the component behave inside a dark-mode surface? All color references resolve
  through the same token roles (`background`/`muted-surface`, `border`, `ring`), which
  already define both light and dark values per color-system.md — no separate dark-mode
  logic is needed in the component itself.
- What happens when a card has no footer or no heading (minimal content card)? Both regions
  are optional; the component must not reserve empty visual space (margins/dividers) for a
  region that is absent.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a Card container component supporting an optional heading
  region, a body region, and an optional footer region.
- **FR-002**: System MUST render the card's surface and border using documented
  `color-system.md` roles (`background` or `muted-surface` for the surface, `border` for the
  outline) — no new color values may be introduced by this component. The card conveys depth
  using the `border` token and surface contrast only; it MUST NOT introduce a shadow/elevation
  primitive, since none is documented in color-system.md or the design tokens.
- **FR-003**: System MUST resolve all text usage (heading, body, footer) to roles documented
  in `typography-system.md` — no new font sizes or weights may be introduced by this
  component.
- **FR-004**: System MUST support a non-interactive (informational) variant that exposes no
  hover, focus, or pressed affordance.
- **FR-005**: System MUST support an interactive variant (clickable/selectable) that exposes
  rest, hover, focus, pressed, selected, and disabled states, each visually distinct using
  only documented design-token roles.
- **FR-006**: System MUST expose a visible keyboard focus indicator on the interactive
  variant using the `ring` token, consistent with the focus treatment defined for Button
  (Feature 07) and Input (Feature 08).
- **FR-007**: System MUST distinguish a selected/active interactive card from an unselected
  one by more than color alone.
- **FR-008**: System MUST expose the correct interactive role (e.g. link or button) and
  accessible name (derived from the heading, or an explicit override) to assistive technology
  for the interactive variant.
- **FR-009**: System MUST announce the selected state of a selected interactive card to
  assistive technology.
- **FR-010**: System MUST prevent interaction (click, focus via Tab) with a card in the
  disabled state.
- **FR-011**: System MUST size its padding, spacing between regions, and corner radius using
  the spacing and sizing scale established in `06-define-design-tokens` (no ad-hoc pixel
  values).
- **FR-012**: System MUST allow the heading and/or footer region to be omitted without
  reserving empty visual space for the omitted region.
- **FR-013**: System MUST NOT allow a nested interactive element (e.g. a button inside the
  card body or footer) to be intercepted or duplicated by the card's own click target.
- **FR-014**: System MUST support two layout modes — vertical (heading/body/footer stacked
  top to bottom) and horizontal (a leading media/icon region beside the
  heading/body/footer content) — both available in the non-interactive and interactive
  variants and both built from the same padding, spacing, and token rules as FR-002, FR-003,
  and FR-011.
- **FR-015**: When a card's layout enforces a fixed height (e.g. a grid of equal-height
  cards), the system MUST truncate overflowing body text to a 3-line clamp with ellipsis
  rather than clipping it without indication or silently changing the card's height.

### Key Entities

- **Card**: A bounded container grouping related content — comprises an optional heading, a
  body region, an optional footer region, and (in horizontal layout) a leading media/icon
  region. Exists in a non-interactive (informational) variant or an interactive
  (clickable/selectable) variant, in either a vertical or horizontal layout; variant and
  layout are independent choices.
- **Card state**: For the interactive variant — rest, hover, focus, pressed, selected, and
  disabled. Mutually exclusive except where explicitly layered (e.g. focus + selected).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A developer can render a fully composed card — heading, body, and optional
  footer, in either the informational or interactive variant — using only this component's
  public API, with zero additional ad-hoc CSS.
- **SC-002**: 100% of the component's color usage traces to a documented `color-system.md`
  role, verifiable by inspection with no ad-hoc values present.
- **SC-003**: 100% of interactive cards are operable via keyboard alone (focus, activate)
  with no mouse-only interactions.
- **SC-004**: Screen reader users can determine an interactive card's accessible name, role,
  and selected state (when present) without any markup beyond the component's own props,
  verified by manual screen-reader pass on each state.
- **SC-005**: A card's focus indicator meets the same contrast ratio already verified for the
  `ring` token in color-system.md (no new contrast verification needed at the component level
  beyond confirming correct token usage).

## Assumptions

- This feature defines a general-purpose container card (heading/body/footer composition,
  informational and interactive variants) only; specialized card-like patterns with their own
  dedicated specs (e.g. Table rows in Feature 10) are out of scope.
- The interactive variant's underlying semantics (native link vs. button vs.
  `role="button"` element) are a planning-phase decision driven by the consumer's actual
  navigation behavior; this spec only requires that the correct role is exposed, not which
  underlying element produces it.
- Migrating gridu-web's existing card-like surfaces onto this component is out of scope for
  this feature, consistent with the same exclusion made for Button (Feature 07) and Input
  (Feature 08).
- The component is built for and tested against the light/dark token pairs already defined in
  color-system.md; no additional theming modes are in scope.
- Media content within a card (images, avatars) is supported via the dedicated `media` region
  (horizontal layout only, per the Clarifications session) or embedded directly in the body
  region for vertical layout, using whatever image-handling the consuming app already
  provides; this feature does not introduce a new media-loading or aspect-ratio system.
