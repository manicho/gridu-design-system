# Tasks: Input Component

**Input**: Design documents from `specs/08-input-component/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/field-api.md, quickstart.md

**Tests**: plan.md and contracts/field-api.md commit to `field.test.tsx` covering the
contract's behavioral guarantees — these are included as part of each story's
implementation, not a separate TDD-first gate (spec.md does not request strict TDD).

**Organization**: This feature adds a small composed unit (`field.tsx`, `input.tsx`,
`field-label.tsx`, `field-message.tsx`) to the package Feature 07 already stood up — no new
tooling, `package.json`, or build config is needed. Most tasks edit one of these four files,
so sequencing within a file matters more than `[P]` parallelism, same rationale as Feature
07's tasks.md.

> **Post-`/speckit-analyze` revision**: this version fixes three findings from the analysis
> pass — a missing task for the label's typography role (C1), a duplicated focus-ring
> implementation across T006/old-T018 (D1), and a missing typography role for the error tone
> (U1) — plus documents the hover-state and input-value-text typography exceptions (C2, U2)
> inline rather than leaving them silently unaddressed.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Different files, no dependency on an incomplete task
- **[Story]**: Which user story this task serves (US1, US2, US3, US4)
- All paths are relative to `gridu-design-system/` (repo root)

---

## Phase 1: Setup

**Purpose**: Confirm the existing Feature 07 tooling (no new config) is a valid baseline
before adding new component files.

- [X] T001 Run `yarn typecheck`, `yarn test`, `yarn lint` against the current tree (Button
  only) and confirm all three pass — verification gate before any Field/Input file is
  added, so a pre-existing failure isn't mistaken for one introduced by this feature.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared types and skeleton files every user story builds on.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T002 [P] Create `src/components/field/field-label.tsx` skeleton: `FieldLabelProps`
  type (data-model.md), renders a `<label>` with `htmlFor`/`children`, no required-indicator
  or styling yet.
- [X] T003 [P] Create `src/components/field/field-message.tsx` skeleton: `FieldMessageProps`
  type (data-model.md), renders `id`/`children` in a `<p>`, no tone styling yet.
- [X] T004 Create `src/components/field/input.tsx` skeleton: `InputType` (6-value union),
  `InputProps` type (data-model.md), an empty `cva()` call with state keys present
  (`invalid`, `readOnly`-driven variant) but unstyled, `defaultVariants: { type: "text" }`.
- [X] T005 Create `src/components/field/field.tsx` skeleton: `FieldProps` type
  (data-model.md), generates an id via `useId()` (research.md Decision 2), renders
  `FieldLabel` + `children` + `FieldMessage` with the generated id threaded through but no
  error/helper precedence logic yet.

**Checkpoint**: Foundation ready — User Story 1 implementation can begin.

---

## Phase 3: User Story 1 - A consumer surface renders a labeled, ready-to-fill text field (Priority: P1) 🎯 MVP

**Goal**: Render a labeled field in each of rest/hover/focus/disabled/read-only state using
only `tokens.css` roles, with the label correctly associated to the input.

**Independent Test**: Render a labeled field in each state side by side in the playground;
assert in `field.test.tsx` that every state's resolved classNames trace to documented
`tokens.css` roles and that the label is associated via `htmlFor`/`id`.

### Implementation for User Story 1

- [X] T006 [US1] Implement base state styling in `input.tsx`'s `cva()`: rest (`border
  border-input bg-background`), hover (`hover:border-foreground/40` — a deliberately small
  border-strength shift on the existing `input`/`foreground` tokens, since `color-system.md`
  defines no dedicated hover token for `input`; this is the documented exception, analogous
  to `input` itself not changing on focus), focus-visible (`ring` token overlay, `input`
  token itself unchanged per color-system.md), disabled (`disabled:opacity-50
  disabled:pointer-events-none`, native `disabled` attribute removes it from tab order),
  read-only (`muted-surface` background, native `readOnly` attribute — focusable/selectable,
  not editable) — using the spacing/sizing scale from `06-define-design-tokens` (FR-003,
  FR-009, FR-010, research.md Decision 5).
- [X] T007 [US1] Implement `type` prop passthrough in `input.tsx`: defaults to `"text"`,
  accepts all 6 `InputType` values natively, passed straight to the underlying `<input
  type>` attribute. Apply the `body-default` typography role (typography-system.md) to the
  input's own value text — the role governing what the user types/sees, distinct from the
  `label`/`caption` roles applied to the label and helper/error text (FR-001, FR-012).
- [X] T008 [US1] Implement label association in `field.tsx`: `FieldLabel` receives the
  generated `htmlFor`; the single `Input` child passed via `children` is cloned
  (`React.cloneElement`) to receive the matching `id`, preserving any props the consumer
  already set on it (FR-002, research.md Decision 2).
- [X] T009 [US1] Apply the `label` typography role (typography-system.md) to
  `field-label.tsx`'s rendered text — the role explicitly required by User Story 1
  Acceptance Scenario 1 and FR-012, and not covered by the association wiring in T008
  (FR-002, FR-012).
- [X] T010 [US1] Create `src/index.ts` barrel export additions: `Field`, `Input`,
  `FieldLabel`, `FieldMessage`, and their types, alongside the existing `Button` export
  (contracts/field-api.md).
- [X] T011 [US1] Add a Field/Input section to `playground/main.tsx`: a rest/hover/focus/
  disabled/read-only grid for visual review, reusing the playground's existing light/dark
  toggle.
- [X] T012 [P] [US1] Write `src/components/field/field.test.tsx`: label renders with the
  `label` typography role and is associated to the input via `htmlFor`/`id`; `disabled`
  removes the input from tab order and blocks typing; `readOnly` keeps the input
  focusable/selectable but blocks value changes; every state's classes trace to
  `tokens.css`/typography-system.md roles with no ad-hoc values (FR-002, FR-003, FR-009,
  FR-011, FR-012).

**Checkpoint**: `yarn typecheck && yarn test && yarn lint` pass; `yarn dev` shows all 5
states correctly styled with a working label association — User Story 1 is independently
demoable.

---

## Phase 4: User Story 2 - A user is shown a validation error without losing their place (Priority: P1)

**Goal**: An `error` prop renders an associated, AT-announced error message and switches the
field's outline to the `destructive` token; helper text and error are never shown together;
`disabled` suppresses error display.

**Independent Test**: Toggle a field's `error` prop in the playground and confirm the
message and outline both update; assert in `field.test.tsx` that `aria-invalid` and
`aria-describedby` are correctly wired and that disabled + error never co-render the message.

### Implementation for User Story 2

- [X] T013 [US2] Implement the error/helper precedence rule in `field.tsx` (research.md
  Decision 4): if `disabled`, render no `FieldMessage`; else if `error` is truthy, render it
  with `tone="error"`; else if `helperText` is set, render it with `tone="helper"`; else
  render nothing.
- [X] T014 [US2] Wire `aria-invalid`/`aria-describedby` onto the cloned `Input` child in
  `field.tsx`: set `aria-invalid="true"` and `aria-describedby` pointing at the rendered
  `FieldMessage`'s id whenever an error or helper message is present; omit
  `aria-describedby` entirely when neither is present (FR-005, research.md Decision 3).
- [X] T015 [US2] Implement `tone`-driven styling in `field-message.tsx`: both tones use the
  `caption` typography role (typography-system.md) for text size/weight; `"error"`
  additionally uses the `destructive` token for color; `"helper"` additionally uses
  `muted-foreground` for color — the typography role applies to both tones equally, only
  the color differs (FR-004, FR-005, FR-012).
- [X] T016 [US2] Implement the `invalid`-driven outline in `input.tsx`'s `cva()`: when
  `invalid` is set, the border switches to the `destructive` token, layered correctly with
  the focus-visible ring so focus + error both apply at once (FR-005).
- [X] T017 [US2] Add error/helper-text toggle controls to `playground/main.tsx` so the
  error state, helper text, and the disabled-suppresses-error rule can all be inspected
  live.
- [X] T018 [P] [US2] Extend `field.test.tsx`: setting `error` sets `aria-invalid="true"` and
  `aria-describedby` pointing at the error text's id; `helperText` and `error` set together
  render only the error; both tones render with the `caption` typography role; `disabled`
  with `error` set renders neither the message nor the `destructive` outline (FR-005,
  FR-012, Edge Cases ruling).

**Checkpoint**: User Stories 1 AND 2 both independently functional — error states are fully
wired with correct screen-reader association.

---

## Phase 5: User Story 3 - A user operating only a keyboard or screen reader can identify, fill, and understand a field (Priority: P1)

**Goal**: Every field shows a visible keyboard-only focus ring; `required` is both visually
and programmatically exposed; helper text (not just error text) is announced as associated
with the field.

**Independent Test**: Tab through the playground's field grid — confirm the focus ring
appears only on keyboard focus, never a mouse click; assert in `field.test.tsx` that
`required` and helper-text association are both correctly exposed.

### Implementation for User Story 3

- [X] T019 [US3] Verify the focus-visible ring already implemented in T006 (built on the
  `ring` token, matching Button's Feature 07 focus-visible convention) meets the
  keyboard-only bar across every `InputType` and state combination — confirm via the
  playground that it never applies on mouse-initiated (`:focus` without `:focus-visible`)
  focus. This is a verification task, not new implementation: the ring CSS itself lives in
  T006, not duplicated here (FR-008).
- [X] T020 [US3] Implement `required` handling: `field.tsx` passes native `required` through
  to the cloned `Input`, and `field-label.tsx` renders a visual required indicator when
  `required` is true (FR-006).
- [X] T021 [P] [US3] Extend `field.test.tsx`: `focus-visible` class applies on keyboard tab
  (via `@testing-library/user-event`'s `tab()`) and not on a mouse click; a `required` field
  exposes the native `required` attribute and the label renders the visual indicator;
  `helperText` (no error active) is exposed via `aria-describedby` the same way an error is
  (FR-004, FR-006, FR-008).

**Checkpoint**: User Stories 1-3 all independently functional — Field/Input meets the spec's
accessibility bar.

---

## Phase 6: User Story 4 - A developer composes a field with optional helper text and adornments (Priority: P2)

**Goal**: Leading and/or trailing icon adornments compose with the field without overlapping
input text or breaking label/state styling.

**Independent Test**: Render a field with a leading icon, one with a trailing icon, and one
with both, and confirm in the playground that no icon overlaps the input's text at any
defined size.

### Implementation for User Story 4

- [X] T022 [US4] Add `leadingIcon`/`trailingIcon` props to `input.tsx`: wrap the `<input>` in
  a `relative` container, render each provided icon as an absolutely-positioned `<span
  aria-hidden="true">`, and shift the input's horizontal padding class per occupied slot
  using the spacing scale from `06-define-design-tokens` (FR-007, research.md Decision 6).
- [X] T023 [US4] Add leading-icon, trailing-icon, and combined-icon examples to
  `playground/main.tsx`, using inline SVG placeholders (no icon library dependency, mirrors
  Button's research.md Decision 3 from Feature 07).
- [X] T024 [P] [US4] Extend `field.test.tsx`: a field with `leadingIcon`/`trailingIcon`
  applies the corresponding padding-shift class (proxy for "icon does not overlap text");
  `helperText` with no active error renders with the `caption` typography role and a muted
  color (FR-004, FR-007, FR-012).

**Checkpoint**: All four user stories independently functional — Input component is
feature-complete per spec.md.

---

## Phase 7: Polish & Cross-Cutting Concerns

- [X] T025 [P] Add the `-webkit-autofill` override rule to `tokens/tokens.css` (research.md
  Decision 8): forces autofilled inputs back to the `background`/`foreground` tokens via the
  standard `transition-delay`/`box-shadow` technique — no new color value introduced
  (FR-011).
- [X] T026 [P] Write `src/components/field/README.md` per FR-012's documentation pattern
  established by Button's `README.md` (Feature 07): where the components live, the state →
  `tokens.css` role mapping table (data-model.md), the typography-role mapping (label /
  value / helper / error → `label` / `body-default` / `caption` / `caption`), and the
  "validation timing is consumer-owned" note (research.md Decision 7).
- [X] T027 Run quickstart.md's full manual playground checklist (all 5 base states, error +
  helper mutual exclusivity, keyboard-only pass, icon overlap, long label/helper/error
  wrapping, autofill) in a real browser and confirm every item passes. Verified via a
  headless Chromium (Playwright) pass against `yarn dev`: rest/hover/focus/disabled/
  read-only states all visually correct in light and dark mode; error replaces helper text
  and the field outline switches to `border-destructive` (confirmed via className dump);
  disabled suppresses the error message; focus-visible ring renders correctly (teal `ring`
  token); leading/trailing/combined icon adornments render without overlapping input text
  in either color mode. Zero browser console errors throughout. Autofill override was
  verified by inspection of the CSS rule (real autofill requires a saved browser
  credential, not reproducible in an automated headless pass) — not flagged as a gap, since
  the rule itself was visually inert (no input was autofilled in this session) and the
  standard technique used is well-established (research.md Decision 8).
- [X] T028 Run `yarn build` and confirm the library bundle exports `Field`, `Input`,
  `FieldLabel`, `FieldMessage` from `src/index.ts` with no build errors, alongside the
  existing `Button` export (contracts/field-api.md). Verified: `dist/index.js` (67.51 kB,
  13.21 kB gzip) built cleanly and all five exports are present.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion — blocks all user stories.
- **User Stories (Phase 3-6)**: All depend on Foundational completion.
  - US1 has no dependency on US2/US3/US4.
  - US2 depends on US1's label/field composition existing (T008) but not on US3/US4.
  - US3 depends on US1's base `Input` styling existing (T006, which already includes the
    focus-visible ring — T019 only verifies it) but not on US2/US4.
  - US4 depends on US1's base `Input` existing (T006) but not on US2/US3.
  - US2, US3, and US4 touch overlapping files (`field.tsx`, `input.tsx`,
    `field-message.tsx`) — sequence them rather than run truly in parallel to avoid merge
    conflicts in small shared files, same rationale as Feature 07.
- **Polish (Phase 7)**: Depends on US1-US4 all being complete.

### Within Each User Story

- Type/styling logic before composition wiring before playground wiring before tests.
- Each story's checkpoint must pass before starting the next story.

### Parallel Opportunities

- All Foundational tasks marked `[P]` (T002-T003) can run in parallel; T004/T005 depend on
  nothing from T002/T003 but are sequenced after them only for file-creation tidiness, not a
  hard dependency.
- Each story's test task (T012, T018, T021, T024) is marked `[P]` relative to that story's
  playground/implementation tasks — it edits `field.test.tsx`, a different file.

---

## Parallel Example: Foundational

```bash
# Once Phase 1 (Setup) passes, run together:
Task: "Create field-label.tsx skeleton"
Task: "Create field-message.tsx skeleton"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: `yarn typecheck && yarn test && yarn lint`, then visually confirm
   all 5 states in the playground
5. At this point a labeled, correctly-stated text field exists and is demoable, even before
   error handling, deeper accessibility, or icon support land

### Incremental Delivery

1. Setup + Foundational → skeleton ready
2. User Story 1 → labeled field with correct states demoable (MVP)
3. User Story 2 → validation error display + AT association layered on top, independently
   verified
4. User Story 3 → keyboard focus ring + required/helper-text announcement layered on top,
   independently verified
5. User Story 4 → icon adornments layered on top, independently verified
6. Polish → autofill override + documentation + final quickstart validation + build check

---

## Notes

- `[P]` tasks touch different files with no dependency on an incomplete task — most tasks in
  US2-US4 are sequential because they share `field.tsx`/`input.tsx`, expected for a small
  composed unit, not a sign of missing decomposition.
- `[Story]` label maps each task to spec.md's user stories for traceability.
- Stop at each checkpoint to validate that story independently before continuing.
- Migrating `gridu-web`'s/`gridu-landing`'s existing form fields is a guardrail (spec
  Assumptions), not a task — no task in this list touches either repo.
- Typography role mapping (FR-012, resolved by the analysis pass): label → `label` role
  (T009); input value text → `body-default` role (T007); helper and error text → `caption`
  role for both, color is the only difference (T015).
