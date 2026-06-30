# Phase 0 Research: Input Component

## Decision 1 — Composed primitives (`Field` + `FieldLabel` + `Input` + `FieldMessage`), not one monolithic component

**Decision**: Ship four small exports — `Field` (layout/composition root), `FieldLabel`,
`Input` (the bare styled `<input>`), and `FieldMessage` (renders helper or error text) —
rather than a single `<TextField label="..." error="..." helperText="..." />` mega-prop
component.

**Rationale**: User Story 1 (bare field) and User Stories 2-3 (error state + AT association)
need the label and message pieces to be independently inspectable for `aria-describedby`
wiring to stay legible, and User Story 4 (icon adornments) only touches `Input`, not the
label or message. This mirrors how Button (Feature 07) is internally decomposed
(`buttonVariants` map, content branch) without introducing a second package or build target.
A consumer who only needs the bare input (e.g. composing their own custom layout) can still
import `Input` alone.

**Alternatives considered**: A single mega-prop component (rejected — couples label/helper/error
layout to the input's own styling logic, makes the icon-adornment slot harder to reason about
independently, and gives a consumer no way to opt out of the default layout without
duplicating the whole component). Fully separate, unrelated exports with no shared `Field`
context (rejected — would push `id`/`aria-describedby` wiring onto every consumer by hand,
violating Principle I, Default Over Configure).

---

## Decision 2 — Label/input/message association via React `useId`, not consumer-supplied `id`

**Decision**: `Field` generates a stable id internally via React 19's `useId()` and threads
it to `FieldLabel`'s `htmlFor`, `Input`'s `id`, and `FieldMessage`'s `id` (consumed by
`Input`'s `aria-describedby`). A consumer does not pass or manage any id unless they choose
to override it.

**Rationale**: FR-002 (label association) and FR-005 (error announced as associated with the
field) are both id-wiring requirements; making the consumer supply and keep three ids in
sync (`label`, `input`, `message`) is exactly the kind of per-screen ad-hoc pattern Feature
06's audit flagged as a sync-gap risk, applied at the component-API level instead of the
token level. `useId()` is the standard React 19 mechanism for this, already a peer
dependency, and produces SSR-stable ids without a new runtime dependency.

**Alternatives considered**: Requiring the consumer to pass `id` explicitly (rejected —
extra boilerplate per field instance, and a forgotten/duplicated id silently breaks the
label association with no compile- or even necessarily runtime-visible failure, conflicting
with Principle II, Fail Loud). A random-string id generator (rejected — `useId()` already
solves this correctly, including SSR hydration mismatches a custom generator would risk).

---

## Decision 3 — `aria-invalid` + `aria-describedby` drive error association, not just visual color

**Decision**: When a field has an active error, `Input` sets `aria-invalid="true"` and
`aria-describedby` pointing at the `FieldMessage` id. When no error and no helper text are
present, `aria-describedby` is omitted entirely (not set to an empty/missing id).

**Rationale**: Directly implements FR-005 and User Story 2's Acceptance Scenario 3 (a screen
reader announces the error as associated with the field, not merely present on the page).
`aria-invalid` is the standard signal screen readers use to announce "invalid entry" on
focus, independent of the destructive color treatment, which a screen reader user does not
perceive at all — this is the non-visual half of the same requirement Button's `aria-busy`
covered for loading state.

**Alternatives considered**: Relying on visual proximity (the error text simply rendered
near the input, no `aria-*` wiring) (rejected — this is precisely the "error appearing
somewhere disconnected from the field" failure mode the spec's User Story 2 motivation
calls out; passes a sighted-only review but fails AT users). A live region announcing errors
on change (rejected — over-engineered for a per-field static error; live regions are for
content that changes without user-initiated focus movement, not a field the user is actively
filling).

---

## Decision 4 — Error always wins over helper text; disabled always suppresses error (single internal precedence rule)

**Decision**: `FieldMessage` rendering follows one internal rule, not consumer-managed
conditionals: if `disabled` is true, render nothing (regardless of `error`/`helperText`); else
if `error` is set, render it in the `destructive` treatment; else if `helperText` is set,
render it in the muted treatment; else render nothing.

**Rationale**: Directly implements the spec's two Edge Case rulings (error replaces helper
text; disabled suppresses error display) as a single deterministic precedence chain inside
the component, so no consumer can accidentally show both simultaneously or show a "broken"
disabled field with an error a user has no way to act on (Constitution Principle I, Default
Over Configure — the resolution is automatic, not a setting).

**Alternatives considered**: Letting the consumer pass both `error` and `helperText` and
manually decide which to render via a third prop (rejected — reopens exactly the
configuration surface Principle I says to avoid when a single correct default exists).

---

## Decision 5 — `disabled` vs `readOnly` map directly to native HTML semantics, distinguished only by an extra visual treatment on `readOnly`

**Decision**: `disabled` passes through to the native `disabled` attribute (not focusable,
not in tab order, not in form submission). `readOnly` passes through to the native
`readOnly` attribute (focusable, selectable, in form submission, not editable). `readOnly`
additionally gets a distinct background treatment (`muted-surface`, already a `tokens.css`
role) so it doesn't look identical to an enabled-but-empty field, per the spec's Edge Case
ruling.

**Rationale**: Both states already exist as native, fully-accessible HTML input semantics —
inventing a custom "disabled-like" or "readonly-like" behavior on top would duplicate
behavior browsers and screen readers already implement correctly, and would risk diverging
from native expectations (e.g. a custom disabled implementation that's still focusable by
accident). The only gap native HTML doesn't close is the spec's visual-distinction
requirement, which is solved with an existing token, not a new one (FR-011).

**Alternatives considered**: A single `state` enum prop (`"enabled" | "disabled" | "readOnly"`)
instead of two booleans (rejected — `disabled` and `readOnly` are independent native HTML
concepts a consumer may reasonably combine during a transition, e.g. a field becoming
read-only while a save is in flight; collapsing them into one enum removes a combination
native HTML itself supports without a clear benefit).

---

## Decision 6 — Icon adornments via absolutely-positioned wrapper, input padding shifts per occupied slot

**Decision**: `Input` is wrapped in a `relative` container; a leading/trailing icon (when
provided) is rendered as an absolutely-positioned `<span aria-hidden="true">` inside that
wrapper, and the input's own horizontal padding class shifts (e.g. `pl-9` instead of `pl-3`)
based on which slot is occupied, using the spacing scale from `06-define-design-tokens` (no
ad-hoc pixel values, FR-010).

**Rationale**: This is the same icon-slot pattern Button already validated (Feature 07
Decision 3: generic `ReactNode`, no icon library dependency) applied to a text field instead
of a button — `aria-hidden` keeps the icon out of the accessible name (the field's name
still comes solely from its label), satisfying User Story 4 Acceptance Scenario 3 (icon does
not overlap input text) by construction since padding reserves the icon's footprint rather
than overlapping it.

**Alternatives considered**: A flex-based wrapper splitting icon/input into adjacent
siblings (rejected — flex children with intrinsic input width changes don't reliably keep
the input's text baseline aligned with a fixed-size icon across all sizes without extra
alignment CSS that absolute positioning avoids needing).

---

## Decision 7 — Validation is fully consumer-controlled; the component has no built-in blur/submit timing logic

**Decision**: `Field`/`Input` accept a simple `error?: string` prop. The component renders
whatever error string it's given, whenever it's given it — it does not track touched/blurred
state, does not debounce, and does not decide when validation "should" run.

**Rationale**: Directly matches the spec's Assumptions ("validation logic... is owned by the
consumer; the component only renders the error state and message it is given"). Every
consumer integration (a plain form, React Hook Form, a server-action-driven form in
`gridu-web`) has different and legitimate opinions about validation timing (on blur, on
submit, on change after first error) — baking one timing model into the component would
force every consumer to either fight it or wrap it, the same "hidden complexity for a need
not yet demonstrated" Principle IV warns against.

**Alternatives considered**: Built-in `validate` prop + internal blur tracking (rejected —
speculative; no concrete consumer need demonstrated yet, and forecloses consumers who want
submit-time-only validation without extra props to disable the built-in behavior).

---

## Decision 8 — Browser autofill styling overridden via the standard `-webkit-autofill` transition-delay technique, using existing tokens only

**Decision**: A small CSS rule targets `input:-webkit-autofill` and uses the long
`transition-delay`/`box-shadow` technique to force the autofilled input's background and
text color back to the `background`/`foreground` tokens already in `tokens.css`, rather than
the browser's default autofill yellow/blue.

**Rationale**: Directly resolves the spec's Edge Case on autofill — without this override,
Chromium-based browsers render autofilled fields with a hardcoded background color that
bypasses any `background-color` utility class, breaking the `input` token's at-rest
appearance and risking a contrast failure against the label. The transition-delay technique
is the standard, dependency-free fix (no new library) and reuses tokens already declared,
satisfying FR-011's "no new color value" constraint.

**Alternatives considered**: Ignoring autofill styling (rejected — directly contradicts the
spec's explicit Edge Case ruling and is a real, frequently-hit case for `email`/password
login and signup fields, the exact surfaces this component targets first). A JS-based
autofill-detection workaround (rejected — far more complex than the well-established CSS-only
technique for a purely cosmetic fix).
