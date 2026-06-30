# Phase 0 Research: Navigation Component

## Decision 1 — One generic `Navigation` root taking a `destinations: NavItem[]` prop, not a compound `Navigation.Item` children API

**Decision**: Ship `Navigation` as a single component taking a `destinations: NavItemProps[]`
array, rendering each as an internally-generated polymorphic `<a>`/`<button>`, rather than a
compound family (`<Navigation><Navigation.Item>...</Navigation.Item></Navigation>`) the
consumer assembles via JSX children.

**Rationale**: FR-004 requires the component to enforce "exactly one active destination, or
none" — that invariant is only mechanically checkable in one place if the component owns the
full destination list, the same reasoning Table's Decision 1 applied to `columns`/`rows`. A
children-based API would let a consumer accidentally mark two `Navigation.Item`s active with
no single point to catch it. A config-driven array also matches Card's and Button's existing
flat-prop convention more closely than Table's two-array shape, since a destination has no
independent "header config vs. body data" split the way a table column does.

**Alternatives considered**: A compound children family (rejected — no single place to
enforce FR-004's single-active invariant; also the heaviest API of the five components so
far, with no use case in the spec demanding per-item composition flexibility beyond label +
icon). A render-prop/children-as-function API (rejected — adds indirection for no documented
need; the spec's destinations are described as plain label+icon+state, not custom JSX per
item).

---

## Decision 2 — Active state is consumer-supplied (`active: boolean` per destination), never inferred from a route; exposed via `aria-current="page"` plus a `border`-token indicator

**Decision**: Each destination carries an `active?: boolean` the consumer sets; `Navigation`
never reads `window.location`, a router context, or any URL. The active destination renders
`aria-current="page"` and a `border`-token side accent (vertical layout: left border; horizontal
layout: bottom border) in addition to a text/background color change — never color alone
(FR-003).

**Rationale**: FR-004's Assumptions explicitly place "matching the current URL to a
destination" outside this component's scope — routing varies by consuming app (`gridu-web`'s
router today, potentially a different one later) and baking in route-matching would couple a
design-system primitive to one routing library, against the same "consumer owns
routing/business logic" boundary already drawn for Card's `selected` state. `aria-current="page"`
is the ARIA-spec-correct attribute for "this link represents the current page" (vs. the
more generic `aria-current="true"`), and is announced natively by screen readers with no
custom live region needed — mirroring how Table's Decision 2 leaned on native `aria-sort`
instead of a custom announcement.

**Alternatives considered**: Built-in route matching (e.g. accepting a `currentPath` prop and
an internal `href === currentPath` check) (rejected — couples the component to a specific
routing/URL-matching strategy, which the spec's Assumptions section explicitly excludes).
Color-only active indication (rejected — directly violates FR-003 and the same "more than
color alone" precedent Card's Decision already established for `selected`).

---

## Decision 3 — Disabled destinations reuse Card's `aria-disabled` + pointer/focus-suppression pattern, not a separate disabled subcomponent or wrapper

**Decision**: A destination with `disabled: true` renders with `aria-disabled="true"`,
`tabIndex={-1}` (removing it from the Tab sequence per FR-011), and `pointer-events-none`
(blocking click activation) — the same attribute combination Card's interactive variant
already uses for its `disabled` state, applied here per-destination instead of to the whole
component.

**Rationale**: FR-011 requires Tab to skip a disabled destination and click/Enter to have no
effect, while still being announced to AT — `aria-disabled` (rather than the native `disabled`
attribute, which only exists on `<button>`/`<input>`/etc., not `<a>`) is the one mechanism
that works identically whether the destination renders as `<a>` or `<button>` (Decision 4).
Reusing Card's exact pattern keeps disabled-state semantics consistent across the whole
design system rather than introducing a second, subtly different "disabled" convention.

**Alternatives considered**: Native `disabled` attribute only (rejected — has no effect on an
`<a>`, which is the expected element for an enabled destination per Decision 4, so it can't be
the only mechanism). Omitting the destination from the rendered list entirely while disabled
(rejected — User Story 2 explicitly requires the destination to remain visible, just
unavailable, so the consumer knows the feature exists).

---

## Decision 4 — Each destination is a polymorphic `<a>`/`<button>` via an `as` prop, mirroring Button's existing convention exactly

**Decision**: `NavItemProps` includes `as?: "a" | "button"` (default `"a"`), the same prop
name, type, and default-reasoning as `CommonButtonProps.as` (Feature 07). `href` is required
when `as="a"`; an `onClick` handler is the activation path when `as="button"`.

**Rationale**: A navigation destination is, in the overwhelming majority of real usage, a
link to another page/route — defaulting to `<a>` gives correct browser behavior (open-in-new-
tab via modifier click, status-bar URL preview, crawlability) for free, with no extra prop
needed for the common case (Default Over Configure). The `button` escape hatch exists for the
rarer in-page-action destination (e.g. a "Log out" entry that isn't a navigation per se but
lives in the same list), exactly mirroring why Button itself supports both. Reusing the exact
prop name/shape from Feature 07 means a developer who already knows Button's API needs to
learn nothing new here.

**Alternatives considered**: `<a>`-only, with no `as` escape hatch (rejected — the spec's own
example destinations include settings/account-style entries that may legitimately need
button semantics, e.g. a "Log out" action; precluding that would push consumers toward
wrapping the component or reaching for raw markup). A render-prop letting the consumer supply
their own link component (e.g. for a framework-specific `Link`) (rejected — no named use case
in the spec demands a framework-specific link component yet; `as="a"` plus a plain `href`
covers gridu-web's and gridu-landing's actual stacks, consistent with Scale To One).

---

## Decision 5 — Long labels truncate via Tailwind's `truncate` utility plus a native `title` attribute; the accessible name stays the full label

**Decision**: Each destination's label renders inside a `truncate` (single-line ellipsis)
element; the destination's root element also carries `title={label}` so the full text is
available on hover, and the accessible name (derived from the label text itself, not the
truncated visual rendering) is always the complete string.

**Rationale**: This is exactly Table's Decision 5 truncation treatment (`truncate` + native
`title`), reused here for the same reason: a native `title` requires no extra component or
ARIA wiring, and an accessible name computed from a text node's full content is unaffected by
CSS-only visual truncation — there's nothing to "fix" for FR-012's accessible-name
requirement beyond not truncating the underlying string itself.

**Alternatives considered**: A custom tooltip component on hover/focus (rejected — adds a new
interactive overlay primitive to the design system for a problem `title` already solves
natively, the same reasoning Table's Decision 5 rejected a custom tooltip for cell content).
Hard character-limit truncation in JS (e.g. slicing to N characters) (rejected — CSS-based
truncation already adapts to the actual rendered width per layout/viewport; a fixed character
count would either truncate too early on wide layouts or overflow on narrow ones).

---

## Decision 6 — The root renders a native `<nav>` with a required `label` prop (rendered as `aria-label`), not an automatically-inferred or optional label

**Decision**: `Navigation` always renders a native `<nav>` element (free landmark semantics,
no `role="navigation"` needed) and requires a `label: string` prop rendered as
`aria-label={label}`.

**Rationale**: FR-010 requires the component to be exposed as a navigation landmark — a
native `<nav>` gives this for free. Making `label` required (not optional) reflects that a
page can legitimately have more than one `<nav>` (e.g. a sidebar and a future header), and
unlabeled multiple-`<nav>` landmarks are indistinguishable to screen reader users navigating
by landmark — an omission that's invisible in a single-nav demo but breaks the moment a
second `Navigation` instance exists on the same page, so it's caught at the type level now
rather than discovered later.

**Alternatives considered**: Optional `label` with no default (rejected — silently produces
the exact multi-landmark ambiguity above the first time a consumer adds a second
`Navigation` instance, an AT-accessibility regression that's easy to miss in visual review).
A fixed default label like `"Main navigation"` (rejected — actively wrong for any instance
that isn't the primary nav, e.g. a future secondary/breadcrumb-style usage, and silently wrong
defaults are harder to notice than a required-prop type error).
