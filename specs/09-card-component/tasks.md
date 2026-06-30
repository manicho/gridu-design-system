# Tasks: Card Component

**Input**: Design documents from `specs/09-card-component/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/card-api.md, quickstart.md

**Tests**: plan.md and contracts/card-api.md commit to `card.test.tsx` covering the
contract's behavioral guarantees — these are included as part of each story's
implementation, not a separate TDD-first gate (spec.md does not request strict TDD).

> **Post-`/speckit-analyze` revision**: this version fixes three HIGH findings from the
> analysis pass — FR-013's "duplicated" half wasn't actually delivered by the original
> nested-element handling (F1, now T014/T016/T018), `aria-label` was assumed by contracts/
> tasks but missing from `CardProps` (C1, now T002/T012/T019), and spec.md's Assumptions
> section contradicted FR-014's dedicated `media` region (I1, spec.md only).

**Organization**: Unlike Field (Feature 08, a 4-file composed unit), Card ships as a single
`card.tsx` file (plan.md Structure Decision — its regions are plain content-slot props, no
ARIA id-threading complexity to justify a compound split). Almost every task therefore edits
`card.tsx`, so most tasks are sequential by necessity (same-file edits), matching Button's
(Feature 07) single-file rationale — `[P]` is reserved for tasks that touch genuinely
independent files (`card.test.tsx`, `playground/main.tsx`, `src/index.ts`).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Different files, no dependency on an incomplete task
- **[Story]**: Which user story this task serves (US1, US2, US3)
- All paths are relative to `gridu-design-system/` (repo root)

---

## Phase 1: Setup

**Purpose**: Confirm the existing Feature 07/08 tooling (no new config) is a valid baseline
before adding new component files.

- [X] T001 Run `yarn typecheck`, `yarn test`, `yarn lint` against the current tree (Button +
  Field only) and confirm all three pass — verification gate before any Card file is added,
  so a pre-existing failure isn't mistaken for one introduced by this feature.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared types and skeleton file every user story builds on.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T002 Create `src/components/card/card.tsx` skeleton: `CardVariant`, `CardLayout`
  types, the `CommonCardProps`/`InformationalCardProps`/`InteractiveCommonProps`/
  `InteractiveLinkCardProps`/`InteractiveButtonCardProps`/`InteractiveCardProps`/`CardProps`
  discriminated union (data-model.md, research.md Decision 6 — `href` required only when
  `as="a"`), a `cva()` call with variant/layout keys present but unstyled,
  `defaultVariants: { variant: "informational", layout: "vertical" }`, rendering a bare
  `<article>` wrapper with `heading`/`children`/`footer`/`media` slots placed but unstyled.

**Checkpoint**: Foundation ready — User Story 1 implementation can begin.

---

## Phase 3: User Story 1 - A consumer surface renders a labeled content group at rest (Priority: P1) 🎯 MVP

**Goal**: Render an `informational` Card in both layouts (vertical stacked, horizontal
media+content) with optional heading/body/footer/media regions, every color and text role
resolving to documented `tokens.css`/typography-system.md roles, no reserved space for
omitted regions, and a `clampBody` opt-in for fixed-height contexts.

**Independent Test**: Render Cards with every combination of present/omitted heading and
footer, in both layouts, side by side in the playground; assert in `card.test.tsx` that every
region's resolved classNames trace to documented roles and that omitted regions reserve no
space.

### Implementation for User Story 1

- [X] T003 [US1] Implement base container styling in `card.tsx`'s `cva()`: surface
  (`bg-background`), border (`border border-border`), corner radius and padding using the
  spacing/sizing scale from `06-define-design-tokens` (no ad-hoc pixel values) — shared by
  both layouts and both variants (FR-002, FR-011).
- [X] T004 [US1] Implement vertical layout composition (`layout="vertical"`, the default):
  `heading` → `children` (body) → `footer` stacked top to bottom, footer visually separated
  via spacing and a `border-t border-border` divider when present (FR-001, FR-014).
- [X] T005 [US1] Implement horizontal layout composition (`layout="horizontal"`): `media`
  region placed beside a content column containing `heading` → `children` → `footer`; `media`
  is only rendered (and only reserves space) when `layout="horizontal"` (FR-014, data-model.md
  Relationships).
- [X] T006 [US1] Apply typography roles in `card.tsx`: `heading` → `heading-subsection`,
  `children` (body) → `body-default`, `footer` → `body-secondary` (FR-003, data-model.md
  Typography role mapping).
- [X] T007 [US1] Ensure omitted regions reserve no space: `heading`, `media`, and `footer`
  each render conditionally (`{heading && (...)}` etc.) with no fallback margin/divider
  applied when absent (FR-012).
- [X] T008 [US1] Implement the `clampBody` prop in `card.tsx`: when `true` (default `false`),
  applies Tailwind's `line-clamp-3` utility to the body (`children`) wrapper only — `heading`
  and `footer` are unaffected (FR-015, research.md Decision 4).
- [X] T009 [US1] Create `src/index.ts` barrel export additions: `Card` and its types
  (`CardProps`, `CardVariant`, `CardLayout`, `InformationalCardProps`,
  `InteractiveCardProps`), alongside the existing `Button`/`Field`/`Input` exports
  (contracts/card-api.md).
- [X] T010 [US1] Add a Card section to `playground/main.tsx`: a vertical/horizontal ×
  heading/footer-present/omitted grid, plus a `clampBody` example inside a fixed-height
  container, for visual review using the playground's existing light/dark toggle.
- [X] T011 [P] [US1] Write `src/components/card/card.test.tsx`: every layout × region
  combination renders only `tokens.css`/typography-system.md-traceable classes (no inline
  styles, no shadow/box-shadow utility); `media` only renders in `layout="horizontal"`;
  omitted `heading`/`footer` reserve no space; `clampBody` applies the line-clamp class to the
  body only (FR-001, FR-002, FR-003, FR-011, FR-012, FR-014, FR-015, SC-002).

**Checkpoint**: `yarn typecheck && yarn test && yarn lint` pass; `yarn dev` shows both
layouts and all region combinations correctly styled — User Story 1 is independently
demoable.

---

## Phase 4: User Story 2 - A user interacts with a clickable or selectable card (Priority: P1)

**Goal**: An `interactive` Card renders as a native `<a>` or `<button>` (research.md Decision
2), exposes rest/hover/focus-visible/pressed/selected/disabled states using only documented
token roles, distinguishes `selected` by more than color alone, and never lets a nested
interactive element's activation be intercepted or duplicated.

**Independent Test**: Render an interactive Card, tab to it, activate it via keyboard, toggle
`selected` and `disabled` in the playground; assert in `card.test.tsx` that the correct
element/attributes render per state and that a nested button stays independently clickable.

### Implementation for User Story 2

- [X] T012 [US2] Implement polymorphic rendering for `variant="interactive"` in `card.tsx`:
  `as` prop (`"a"` | `"button"`, default `"button"`) renders `<a href>` or
  `<button type="button">` respectively, mirroring Button's (Feature 07) polymorphic pattern;
  `onClick`/`href` thread through to the rendered element, `href` required only when `as="a"`
  per the `InteractiveLinkCardProps`/`InteractiveButtonCardProps` split (research.md Decision
  2, Decision 6).
- [X] T013 [US2] Implement interactive state styling in `card.tsx`'s `cva()`: hover/pressed
  via a `border`/`muted-surface` shift (no new color value), focus-visible via the `ring`
  token overlay, matching Button's and Field's existing focus-ring convention (FR-006).
- [X] T014 [US2] Implement a single bubble-phase click handler on the interactive element
  covering `disabled` suppression and nested-element detection together (research.md
  Decision 5): if `disabled`, suppress entirely (`event.preventDefault()` when `as="a"`,
  native `disabled` attribute when `as="button"`, `aria-disabled` + `tabIndex={-1}` for
  `as="a"`, mirrors Button's `handleAnchorClick` pattern); else if
  `event.target.closest("a, button, input, select, textarea, [role='button']")` is not the
  Card's own element, suppress the Card's own action for that click
  (`event.preventDefault()` when `as="a"`, skip calling `onClick`) without touching the
  nested element's own handler; else proceed normally (`onClick` fires, navigation proceeds)
  (FR-010, FR-013).
- [X] T015 [US2] Implement `selected` handling: `aria-pressed="true"` when `as="button"`,
  `aria-current="true"` when `as="a"` (research.md Decision 3), plus an increased
  `border`-weight utility class applied whenever `selected` is true, so the distinction is
  never color-only (FR-007, FR-009).
- [X] T016 [US2] Verify nested-interactive-element handling end to end (research.md Decision
  5, FR-013): confirm the T014 handler is the only click-handling logic involved (no separate
  capturing listener), and that a nested `Button` inside an interactive Card's body/footer
  both (a) remains independently clickable and (b) does not also trigger the Card's own
  navigation/`onClick` for that same click.
- [X] T017 [US2] Add interactive Card examples to `playground/main.tsx`: an `as="a"` and an
  `as="button"` grid covering rest/hover/focus/pressed/selected/disabled, plus one example
  with a nested `Button` in the footer.
- [X] T018 [P] [US2] Extend `card.test.tsx`: `as` renders the correct element; `focus-visible`
  ring applies only on keyboard tab (via `@testing-library/user-event`'s `tab()`), never on a
  mouse click; `disabled` blocks Tab focus and click for both `as` values; `selected` sets the
  correct `aria-pressed`/`aria-current` value per `as` and applies the border-weight class; a
  nested native button inside an interactive Card remains clickable AND clicking it does not
  invoke the Card's own `onClick` or (for `as="a"`) trigger navigation (FR-006, FR-007,
  FR-009, FR-010, FR-013).

**Checkpoint**: User Stories 1 AND 2 both independently functional — interactive Cards are
fully wired with correct keyboard/state behavior.

---

## Phase 5: User Story 3 - A user operating only a keyboard or screen reader can identify and act on a card (Priority: P2)

**Goal**: An interactive Card's accessible name resolves from its `heading` (or an explicit
override), its native role (link or button) is correctly exposed, and its `selected` state
(set in US2) is confirmed present in the accessibility tree.

**Independent Test**: Tab through a list of interactive Cards with a screen reader (or the
accessibility tree inspector) and confirm each announces its role, accessible name, and
selected state without additional markup from the consumer.

### Implementation for User Story 3

- [X] T019 [US3] Implement accessible-name derivation in `card.tsx`: the `"aria-label"` field
  on `InteractiveCommonProps` (data-model.md, research.md Decision 6) is passed straight
  through to the rendered element when set; when it is *not* set, generate a stable id via
  `useId()` (mirrors Field's research.md Decision 2 pattern) for the rendered `heading`
  element and wire `aria-labelledby` on the interactive element to point at it instead
  (FR-008, User Story 3 Acceptance Scenario 1).
- [X] T020 [US3] Verify native role correctness: confirm `as="a"` exposes the link role and
  `as="button"` exposes the button role with no additional `role` override needed in
  `card.tsx` — a verification task, not new styling; the polymorphic rendering itself was
  implemented in T012 (FR-008, research.md Decision 2).
- [X] T021 [P] [US3] Extend `card.test.tsx`: an interactive Card with no explicit `aria-label`
  resolves its accessible name from `heading` via `aria-labelledby`; an explicit `aria-label`
  overrides the heading-derived name; `as="a"`/`as="button"` expose the correct implicit
  role; a `selected` Card's `aria-pressed`/`aria-current` attribute (set in T015) is queryable
  in the accessibility tree (FR-008, FR-009).

**Checkpoint**: All three user stories independently functional — Card component is
feature-complete per spec.md.

---

## Phase 6: Polish & Cross-Cutting Concerns

- [X] T022 [P] Write `src/components/card/README.md` per the documentation pattern
  established by `button/README.md` (Feature 07) and `field/README.md` (Feature 08): where
  the component lives, the variant/layout/state → `tokens.css` role mapping table
  (data-model.md), the typography-role mapping table, the `as`/`selected`/`disabled`/
  `clampBody` behavior notes, and the nested-interactive-element guidance (research.md
  Decision 5).
- [X] T023 Run quickstart.md's full manual playground checklist (both layouts, region
  presence/omission, all interactive states, `selected` distinguishability, disabled +
  selected combination, nested interactive element, `clampBody`) in a real browser and
  confirm every item passes.
- [X] T024 Run `yarn build` and confirm the library bundle exports `Card` from `src/index.ts`
  with no build errors, alongside the existing `Button`/`Field`/`Input` exports
  (contracts/card-api.md).

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion — blocks all user stories.
- **User Stories (Phase 3-5)**: All depend on Foundational completion.
  - US1 has no dependency on US2/US3.
  - US2 depends on US1's base container styling existing (T003) but not on US3.
  - US3 depends on US2's polymorphic rendering (T012) and `selected` handling (T015)
    existing — it verifies and extends them with accessible-name wiring, rather than
    reimplementing state logic.
  - US1, US2, and US3 all touch the same single file (`card.tsx`) — sequence them rather
    than run truly in parallel to avoid merge conflicts, same rationale as Button (Feature
    07) and Field (Feature 08).
- **Polish (Phase 6)**: Depends on US1-US3 all being complete.

### Within Each User Story

- Type/styling logic before composition wiring before playground wiring before tests.
- Each story's checkpoint must pass before starting the next story.

### Parallel Opportunities

- Each story's test task (T011, T018, T021) is marked `[P]` relative to that story's
  playground/implementation tasks — it edits `card.test.tsx`, a different file.
- T009 (barrel export) and T022 (README) are marked `[P]`/independent-file tasks relative to
  `card.tsx` edits in their respective phases.

---

## Parallel Example: User Story 1

```bash
# Once T003-T010 land, run alongside final US1 implementation polish:
Task: "Write card.test.tsx covering layout/region/clampBody behavioral guarantees"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: `yarn typecheck && yarn test && yarn lint`, then visually confirm
   both layouts and all region combinations in the playground
5. At this point a correctly styled, purely informational Card exists and is demoable, even
   before interactivity or the deeper accessibility wiring lands

### Incremental Delivery

1. Setup + Foundational → skeleton ready
2. User Story 1 → informational Card, both layouts, region composition, `clampBody`
   demoable (MVP)
3. User Story 2 → interactive variant (rest/hover/focus/pressed/selected/disabled, nested-
   element safety) layered on top, independently verified
4. User Story 3 → accessible-name derivation and role/selected-state verification layered on
   top, independently verified
5. Polish → documentation + final quickstart validation + build check

---

## Notes

- `[P]` tasks touch different files with no dependency on an incomplete task — most tasks in
  US1-US3 are sequential because they share `card.tsx`, expected for a single-file component,
  not a sign of missing decomposition (plan.md Structure Decision).
- `[Story]` label maps each task to spec.md's user stories for traceability.
- Stop at each checkpoint to validate that story independently before continuing.
- Migrating `gridu-web`'s existing card-like surfaces is a guardrail (spec Assumptions), not
  a task — no task in this list touches that repo.
- Typography role mapping (data-model.md): heading → `heading-subsection` (T006); body
  (children) → `body-default` (T006); footer → `body-secondary` (T006).
- `selected`'s ARIA mapping is `as`-dependent (`aria-pressed` vs. `aria-current`,
  research.md Decision 3) — implemented once in T015, verified in the accessibility tree by
  T021, not reimplemented.
