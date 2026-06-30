# Phase 0 Research: Card Component

## Decision 1 — Single `card.tsx` component with content-slot props, not a compound family

**Decision**: Ship one export, `Card`, taking `heading`, `media`, and `footer` as `ReactNode`
props and the body as `children` — rather than separate `CardHeading`/`CardMedia`/
`CardFooter` subcomponents (the pattern Field used for label/input/message).

**Rationale**: Field's compound split exists because its pieces need id-threaded ARIA
association (`htmlFor` ↔ `id` ↔ `aria-describedby`) that only makes sense as a coordinated
unit. Card's regions have no equivalent cross-region wiring — heading, media, and footer are
independent content slots with no shared id contract. A single component with slot props
matches Button's own precedent (`leadingIcon`/`trailingIcon` as props, not subcomponents) and
keeps the API surface smaller per the constitution's Default Over Configure principle.

**Alternatives considered**: A compound family mirroring Field (rejected — no ARIA
association need to justify the extra files/exports, would be speculative decomposition).
A children-only API with no named slots, requiring consumers to hand-assemble heading/footer
markup (rejected — defeats FR-002/FR-003's token-resolution guarantee, since a consumer's own
heading markup wouldn't be guaranteed to use the right typography role).

---

## Decision 2 — Interactive variant reuses Button's exact polymorphic set (`a`\|`button`), excluding `div`+`role="button"`

**Decision**: The interactive variant's `as` prop accepts only `"a"` or `"button"` — the
same two values Button (Feature 07) supports. A `div` with `role="button"` and manual
keydown handling is not offered.

**Rationale**: Native `<a>`/`<button>` elements get keyboard activation (Enter/Space),
focus management, and correct default ARIA semantics for free; `div`+`role="button"`
requires hand-rolling all of that, which is both more code and a well-documented
accessibility footgun (missed Space-key activation is the most common mistake). FR-008
(correct interactive role exposed) and User Story 3's accessibility bar are met more reliably
by reusing Button's already-validated pattern than by adding a third, riskier element option.

**Alternatives considered**: `div`+`role="button"` as a third option (rejected — the spec's
own Assumptions section frames this as a "consumer's actual navigation behavior" decision,
and both real navigation patterns named in the spec, a card linking to a settings page and a
selectable plan card, map cleanly to `a` and `button` respectively; no named use case needs a
non-native interactive element).

---

## Decision 3 — Selected state: `aria-pressed` for `as="button"`, `aria-current="true"` for `as="a"`

**Decision**: When `selected` is `true` on an interactive Card, the rendered element gets
`aria-pressed="true"` if `as="button"` (a toggle/selection-within-a-set pattern, e.g. a plan
card) or `aria-current="true"` if `as="a"` (a "this is the active one" pattern, e.g. the
current item in a navigable list) — never both, since `aria-pressed` is invalid on `<a>`.

**Rationale**: These are the two ARIA-spec-correct mechanisms for "this option is currently
selected/active" on a button vs. a link respectively; using the wrong one (e.g.
`aria-pressed` on an anchor) would be invalid ARIA that some screen readers ignore, silently
failing FR-009 (selected state must be announced).

**Alternatives considered**: A single custom `data-selected` attribute with no ARIA mapping
(rejected — `data-*` attributes are not announced by screen readers, directly violating
FR-009/User Story 3 Acceptance Scenario 3). `aria-selected` (rejected — that role is
reserved for elements with an explicit `option`/`tab`/`row` role inside a matching
`listbox`/`tablist`/`grid` container, which Card does not implement; using it on a bare
button or link is invalid ARIA, same failure mode as the rejected `aria-pressed`-on-anchor
case).

---

## Decision 4 — Body overflow truncation is an explicit `clampBody` opt-in, not automatic

**Decision**: A new boolean prop, `clampBody` (default `false`), applies a 3-line clamp with
ellipsis (Tailwind's `line-clamp-3` utility) to the body content. The component does not
infer this from its rendering context.

**Rationale**: The spec's clarified Edge Case only requires truncation "if a card's layout
requires a fixed height" — a fact about the *consumer's* surrounding layout (e.g. a CSS grid
with `grid-auto-rows: 1fr`), which the component itself cannot detect from inside. An
explicit prop lets the consumer state that fact once, matching how `gridu-web` would already
know it's building an equal-height grid. Defaulting to `false` means a normal, unconstrained
card never truncates content it has room to show in full.

**Alternatives considered**: Always-on clamping (rejected — would needlessly truncate body
text in cards that have no height constraint, hiding content a user could otherwise see,
which conflicts with Fail Loud, Never Silent in spirit even though the ellipsis itself is
visible). Auto-detecting overflow via `ResizeObserver`/`scrollHeight` at runtime (rejected —
adds a runtime measurement dependency and a layout-thrash risk for a presentational
component, disproportionate to the actual need; FR-015's photographed scenario, equal-height
grids, is exactly the case a simple boolean opt-in covers).

---

## Decision 5 — Nested interactive elements are detected via `event.target.closest()` in the Card's own bubble-phase click handler, suppressing the Card's own action (not a capturing listener, not consumer-managed `stopPropagation()`)

**Decision**: The interactive variant's click handler — the same bubble-phase handler T014
already needs for `disabled` click suppression, not a new or capturing listener — checks
whether `event.target`'s nearest interactive ancestor
(`event.target.closest("a, button, input, select, textarea, [role='button']")`) is the
Card's own rendered element or a nested one. If it resolves to a nested element, the Card's
own action is suppressed for that click: `event.preventDefault()` when `as="a"` (blocks
navigation) and `onClick` is not invoked. The nested element's own handler already ran during
the bubble phase before the event reached the Card, so it is never intercepted. The consumer
does not need to call `stopPropagation()` themselves.

**Rationale**: FR-013 has two halves — "not intercepted" and "not duplicated." An earlier
version of this decision satisfied only the first half (no capturing listener, so a nested
element's own click handler always fires) while leaving the second half to the consumer via
manual `stopPropagation()` — but FR-013 reads as a system guarantee ("System MUST NOT
allow... to be... duplicated"), not a documented opt-in the consumer has to remember. For an
`as="a"` Card, a nested button's click bubbles and would trigger the anchor's *native*
navigation with no JS handler required to do so, so "no Card-level click handler to conflict
with" was an incomplete read of the failure mode. The `closest()` check above is a single
bubble-phase comparison on an element the Card already attaches a click handler to — not the
capturing/`event.target`-inspection approach rejected below — so it satisfies both halves of
FR-013 without the complexity that approach would have added.

**Alternatives considered**: Leaving duplication-prevention to the consumer via documented
`stopPropagation()` (rejected — found during `/speckit-analyze`, finding F1: contradicts
FR-013's "System MUST NOT allow... duplicated" wording, and the realistic `as="a"` case isn't
actually conflict-free as originally reasoned). A capturing-phase listener with full
`event.target` tree inspection (rejected — the bubble-phase `closest()` check on the Card's
own existing click handler achieves the same outcome without an additional listener phase or
the complexity Decision 5 originally argued against). Special-casing `as="button"` containing
a nested button (still rejected — that combination is invalid HTML per the HTML spec and
React will not render it without a hydration warning, so no test case exists for it).

---

## Decision 6 — Explicit `aria-label` override, with `href` compile-time-required only when `as="a"`

**Decision**: `InteractiveCardProps` carries an explicit `"aria-label"?: string` field. When
set, it overrides the heading-derived accessible name (T019's `aria-labelledby` wiring is
skipped in favor of a direct `aria-label`). `InteractiveCardProps` is also split into
`InteractiveLinkCardProps` (`as: "a"`, `href: string` required) and
`InteractiveButtonCardProps` (`as?: "button"`, `href?: never`), mirroring Button's
`TextButtonProps`/`IconOnlyButtonProps` split (Feature 07).

**Rationale**: FR-008 explicitly requires the accessible name to come from `heading` "or an
explicit override" — found during `/speckit-analyze` (finding C1), `CardProps` had no field
for that override even though contracts/card-api.md and tasks.md both already assumed
`aria-label` existed. Declaring it explicitly (rather than via an untyped native-attribute
spread) keeps Card's prop surface closed and self-documenting, consistent with Default Over
Configure, and matches how Button types its own accessible-name-bearing props rather than
spreading arbitrary ARIA attributes. Splitting by `as` for `href` removes a runtime-only
"required when..." comment in favor of an actual compile-time guarantee, the same fix Button
already applies to `aria-label` for its icon-only mode.

**Alternatives considered**: Spreading arbitrary native HTML attributes (e.g. `Omit<
AnchorHTMLAttributes & ButtonHTMLAttributes, ...>` the way Field's `InputProps` does)
(rejected — Card's props are a closed, curated set by design [Decision 1]; an open
attribute spread would let `id`, `target`, `rel`, and other anchor/button attributes leak in
without a documented contract for any of them, which is a larger surface than this feature
needs to solve). Leaving `href` as a plain optional string with only a code comment (rejected
— exactly the gap finding C1 flagged; a comment is not a compile-time guarantee).
