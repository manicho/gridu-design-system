# Tasks: Button Component

**Input**: Design documents from `specs/07-button-component/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/button-api.md, quickstart.md

**Tests**: plan.md and contracts/button-api.md commit to `button.test.tsx` covering the
contract's behavioral guarantees — these are included as part of each story's
implementation, not a separate TDD-first gate (spec.md does not request strict TDD).

**Organization**: This is a single-component, single-repo feature — almost every task edits
`src/components/button/button.tsx`, so most tasks are sequential by necessity (same-file
edits), not because parallelism wasn't considered. `[P]` is reserved for tasks that touch
genuinely independent files.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Different files, no dependency on an incomplete task
- **[Story]**: Which user story this task serves (US1, US2, US3)
- All paths are relative to `gridu-design-system/` (repo root)

---

## Phase 1: Setup

**Purpose**: Stand up this repo's first package — TypeScript/React/Vite/Vitest/ESLint
tooling scoped to authoring and testing components locally (research.md Decision 4).

- [X] T001 Create `package.json`: private package named `gridu-design-system`, `react` ^19
  as a peer dependency, dependencies `class-variance-authority` ^0.7, `clsx` ^2,
  `tailwind-merge` ^2 (research.md Decision 2), devDependencies for TypeScript ~5.7, Vite
  ^6, `@vitejs/plugin-react`, Vitest ^4, `@testing-library/react` ^16,
  `@testing-library/jest-dom` ^6, `@testing-library/user-event` ^14, `jsdom` ^25, ESLint ^9
  + `typescript-eslint` + `eslint-plugin-react-hooks`, `@types/react`, `@types/react-dom` —
  scripts `dev`, `build`, `test`, `test:watch`, `typecheck`, `lint` matching `gridu-web`'s
  script vocabulary.
- [X] T002 [P] Create `tsconfig.json`: strict mode, `jsx: react-jsx`, target ES2022,
  includes `src/` and `playground/`.
- [X] T003 [P] Create `vite.config.ts`: library build mode (entry `src/index.ts`, ES format,
  `react`/`react-dom` externalized) combined with Vitest config (`environment: "jsdom"`,
  `globals: true`, a setup file enabling `@testing-library/jest-dom` matchers) — mirrors
  `gridu-web/vite.config.ts`'s shape.
- [X] T004 [P] Create `eslint.config.js` mirroring `gridu-web`'s flat ESLint config
  (`typescript-eslint`, `eslint-plugin-react-hooks`).
- [X] T005 [P] Create `playground/index.html` + `playground/main.tsx` skeleton: imports
  `../tokens/tokens.css`, renders a placeholder heading, wired as the Vite dev root
  (research.md Decision 5). Include a light/dark toggle button that adds/removes the
  `.dark` class on `<html>`, so `tokens.css`'s existing dark-mode block (Feature 06) is
  reachable for manual contrast verification (SC-002; required by quickstart.md's
  checklist).
- [X] T006 Run `yarn install` and confirm `yarn dev`, `yarn typecheck`, `yarn lint` all
  succeed against the skeleton — verification gate before Foundational work begins.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared types and a small composition helper every user story builds on.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T007 [P] Create `src/lib/utils.ts` with a `cn()` helper (`clsx` + `tailwind-merge`),
  mirroring `gridu-web/src/lib/utils.ts`'s implementation exactly.
- [X] T008 Create `src/components/button/button.tsx` skeleton: `ButtonVariant` (5-value
  union), `ButtonSize` (3-value union) type aliases, `CommonButtonProps` type
  (data-model.md), and an empty `cva()` call with `variant`/`size` keys present but
  unstyled, `defaultVariants: { variant: "primary", size: "default" }`.

**Checkpoint**: Foundation ready — User Story 1 implementation can begin.

---

## Phase 3: User Story 1 - A consumer surface renders an action with the right emphasis (Priority: P1) 🎯 MVP

**Goal**: Render any of the 5 variants at any of the 3 sizes using only `tokens.css` roles,
with correctly ordered visual emphasis.

**Independent Test**: Render each variant side by side in the playground; assert in
`button.test.tsx` that every variant's resolved classNames trace to documented `tokens.css`
roles with no ad-hoc values.

### Implementation for User Story 1

- [X] T009 [US1] Implement the 5 variant class maps in `button.tsx`'s `cva()` `variant`
  key, each including a resting, `hover:`, and `active:` (pressed) class so all 5 variants
  satisfy FR-005's "active" state, not just "default"/"hover": `primary` (`bg-brand
  text-primary-foreground hover:bg-brand-strong active:bg-brand-strong`), `secondary`
  (`bg-secondary text-secondary-foreground hover:bg-secondary/80 active:bg-secondary/70`),
  `destructive` (`bg-destructive text-destructive-foreground hover:bg-destructive/90
  active:bg-destructive/80`), `outline` (`border border-input bg-transparent
  hover:bg-secondary active:bg-secondary/80`), `ghost` (`hover:bg-secondary
  active:bg-secondary/80`) — every class traces to a `tokens.css`/data-model.md role
  (FR-001, FR-002, FR-005).
- [X] T010 [US1] Implement the 3 size class maps in `cva()`'s `size` key: `sm` (`h-9 px-3
  text-sm`), `default` (`h-10 px-4 py-2 text-sm`), `lg` (`h-11 px-6 text-base`) — reuses
  `gridu-web`'s existing height scale (no new ad-hoc value) and Feature 05's typography
  roles (FR-003, FR-004).
- [X] T011 [US1] Implement the base `Button` function component in `button.tsx`: accepts
  `CommonButtonProps & { children: React.ReactNode }`, renders a native `<button
  type="button">` by default, composes classes via `cva()` + `cn()`, wraps `children` in a
  `<span className="truncate max-w-full">` (FR-014).
- [X] T012 [US1] Add `as="a"` polymorphism to `Button`: when `as === "a"`, render an `<a>`
  element with the same variant/size classes instead of `<button>` (FR-011).
- [X] T013 [US1] Create `src/index.ts` barrel export re-exporting `Button`, `ButtonProps`,
  `ButtonVariant`, `ButtonSize` from `src/components/button/button.tsx`
  (contracts/button-api.md).
- [X] T014 [US1] Add a 5×3 variant/size grid to `playground/main.tsx` for visual review.
- [X] T015 [P] [US1] Write `src/components/button/button.test.tsx`: each variant renders its
  documented `tokens.css`-traceable classes — including an `active:` class — default
  variant/size apply when props are omitted, long text content receives the `truncate`
  class (FR-001–FR-005, FR-014).

**Checkpoint**: `yarn typecheck && yarn test && yarn lint` pass; `yarn dev` shows all 15
variant×size combinations correctly styled — User Story 1 is independently demoable.

---

## Phase 4: User Story 2 - A user operating only a keyboard or screen reader can identify and use a button (Priority: P1)

**Goal**: Every button is keyboard-focusable with a visible focus ring; disabled and loading
states are visually distinguishable and correctly announced to assistive technology.

**Independent Test**: Tab through the playground's buttons — confirm the focus ring appears
only on keyboard focus, never on a mouse click; toggle `disabled`/`loading` props and confirm
correct ARIA state and that clicks don't fire.

### Implementation for User Story 2

- [X] T016 [US2] Add `focus-visible:` ring utility classes to `button.tsx`'s shared base
  class string (applies across all variants), built on the existing `--ring` role — must
  never apply on plain `:focus` (mouse-initiated) (FR-006).
- [X] T017 [US2] Add `disabled` prop handling: native `disabled` attribute (+ Tailwind
  `disabled:pointer-events-none disabled:opacity-50`) on `<button>`; `aria-disabled="true"`
  + `pointer-events-none` + `tabIndex={-1}` on `<a>` (anchors have no native `disabled`)
  (FR-007).
- [X] T018 [US2] Add `loading` prop handling: sets `aria-busy="true"`, suppresses
  `onClick`/navigation while active, replaces visible content with a spinner plus a
  `<span className="sr-only">Loading</span>` status node, and visually overrides `disabled`
  styling when both are set, per the Edge Case ruling (FR-008, research.md Decision 7).
- [X] T019 [US2] Add `disabled`/`loading` toggle controls to `playground/main.tsx` so both
  states can be inspected live against every variant.
- [X] T020 [P] [US2] Extend `button.test.tsx`: `focus-visible` class applies on keyboard tab
  and not on a mouse click (via `@testing-library/user-event`'s `tab()` vs `click()`),
  `disabled` prevents `onClick` from firing and exposes the correct ARIA state, `loading`
  sets `aria-busy`, blocks a second activation, and stays visually distinct from `disabled`
  (FR-006, FR-007, FR-008).

**Checkpoint**: User Stories 1 AND 2 both independently functional — every variant/size is
fully keyboard- and screen-reader-operable.

---

## Phase 5: User Story 3 - A developer needs a button that pairs an icon with (or replaces text with) an icon (Priority: P2)

**Goal**: Leading/trailing icon support and an icon-only mode whose accessible-name
requirement is enforced by the type system, not left to runtime discipline.

**Independent Test**: Render an icon-only button without `aria-label` and confirm it fails
`tsc`, not just a lint warning; render leading/trailing icon + text at every size and confirm
icon centering/scaling.

### Implementation for User Story 3

- [X] T021 [US3] Extend `button.tsx`'s exported prop type into the `TextButtonProps |
  IconOnlyButtonProps` discriminated union from data-model.md: `TextButtonProps` requires
  `children` (optional `leadingIcon`/`trailingIcon`, `aria-label` stays a normal optional
  pass-through, not forbidden); `IconOnlyButtonProps` requires `icon` + `aria-label`,
  forbids `children` (FR-009, FR-010, research.md Decision 6).
- [X] T022 [US3] Implement icon rendering in `Button`'s body: leading icon before the
  truncated text span, trailing icon after, icon-only mode renders only the `icon` node
  centered with no text span (FR-009).
- [X] T023 [US3] Apply equal width/height (square) sizing to icon-only buttons at each of
  the 3 sizes, preserving the minimum target size guarantee established in T010 (FR-004,
  SC-003).
- [X] T024 [US3] Add leading-icon, trailing-icon, and icon-only examples to
  `playground/main.tsx`, using inline SVG placeholders (no icon library dependency, per
  research.md Decision 3).
- [X] T025 [P] [US3] Extend `button.test.tsx`: icon-only button exposes the supplied
  `aria-label` as its accessible name; a `// @ts-expect-error` fixture confirms omitting
  `aria-label` in icon-only mode fails type-checking; leading/trailing icon renders
  alongside text without breaking variant/size classes (FR-009, FR-010).

**Checkpoint**: All three user stories independently functional — Button is feature-complete
per spec.md.

---

## Phase 6: Polish & Cross-Cutting Concerns

- [X] T026 [P] Write `src/components/button/README.md` per FR-012: where the component
  lives, the variant/size → `tokens.css` role mapping table (data-model.md), an explicit
  "not yet adopted by `gridu-web`/`gridu-landing`" note pointing at the Phase 1 checkpoint,
  and a documented known-gap note that `ref` forwarding is not yet supported
  (contracts/button-api.md).
- [X] T027 Run quickstart.md's full manual playground checklist (emphasis order, light/dark
  contrast, keyboard-only pass, loading-vs-disabled distinction, icon-only target size,
  long-text truncation) and confirm every item passes. Completed in a follow-up session
  using a headless Chromium driver (Playwright) against `yarn dev`. **This pass caught
  three real bugs invisible to typecheck/lint/jsdom-based unit tests**, all now fixed:
  1. Tailwind was never wired into this package at all (no `@tailwindcss/vite` plugin, no
     `@import "tailwindcss"`) — every utility class was inert; buttons rendered as
     unstyled native HTML. Fixed: added the plugin + a playground-only Tailwind entry
     (`playground/playground.css`) with an explicit `@source "../src"` (needed because
     Vite's dev `root: "playground"` otherwise hides component source from Tailwind's
     auto-detection).
  2. `tokens.css` registered typography but never color as `@theme` entries, and
     `button.tsx` borrowed `gridu-web`'s legacy alias class names (`bg-secondary`,
     `text-destructive-foreground`) instead of canonical role names — neither resolved to
     real CSS anywhere. Fixed: added a color `@theme inline` block to `tokens.css`
     (additive only, no value changes) and switched `button.tsx` to canonical names
     (`bg-muted-surface`, `text-primary-foreground`).
  3. The truncated text span (`truncate max-w-full`) never actually truncated: `<button>`
     is `inline-flex` with no width constraint, and flex items default to
     `min-width: auto`, which blocks shrinking below content's intrinsic width regardless
     of `max-width`. Fixed: added `min-w-0` to the span; confirmed by constraining a real
     button's width in the playground and verifying the ellipsis renders.
  Verified via screenshots + computed-style assertions: variant emphasis order, light/dark
  contrast, real Tab-key vs mouse-click focus ring (confirmed `boxShadow` differs and
  traces to the `--ring` token value), disabled-vs-loading visual distinction, icon-only
  square sizing at all 3 sizes (36/40/44px, all ≥ WCAG 24px minimum), and long-text
  ellipsis truncation. Zero browser console errors throughout.
- [X] T028 Run `yarn build` and confirm the library bundle exports `Button`, `ButtonProps`,
  `ButtonVariant`, `ButtonSize` from `src/index.ts` with no build errors (confirms
  structural readiness per contracts/button-api.md's non-goals, without installing the
  package anywhere).

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion — blocks all user stories.
- **User Stories (Phase 3-5)**: All depend on Foundational completion.
  - US1 has no dependency on US2/US3.
  - US2 depends on US1's base `Button` component existing (T011) but not on US3.
  - US3 depends on US1's base `Button` component existing (T011) but not on US2.
  - US2 and US3 touch the same file (`button.tsx`) but different concerns (states vs.
    icons) — sequence them rather than run truly in parallel to avoid merge conflicts in a
    single small file.
- **Polish (Phase 6)**: Depends on US1, US2, and US3 all being complete.

### Within Each User Story

- Variant/size/state logic before playground wiring before tests, within US1.
- Each story's checkpoint must pass before starting the next story.

### Parallel Opportunities

- All Setup tasks marked `[P]` (T002-T005) can run in parallel once T001 exists.
- T007 (`utils.ts`) can run in parallel with T008 since they're different files, but T008
  imports nothing from T007 yet — true parallelism, no ordering risk.
- Each story's test task (T015, T020, T025) is marked `[P]` relative to that story's
  playground task only — it edits a different file (`button.test.tsx` vs `main.tsx`).

---

## Parallel Example: Setup

```bash
# After T001 (package.json) exists, run together:
Task: "Create tsconfig.json"
Task: "Create vite.config.ts"
Task: "Create eslint.config.js"
Task: "Create playground/index.html + playground/main.tsx skeleton"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: `yarn typecheck && yarn test && yarn lint`, then visually confirm
   all 15 variant×size combinations in the playground
5. At this point the 5-variant, 3-size Button exists and is demoable, even before
   accessibility states or icon support land

### Incremental Delivery

1. Setup + Foundational → tooling ready
2. User Story 1 → variant/size emphasis demoable (MVP)
3. User Story 2 → keyboard/screen-reader operability layered on top, independently verified
4. User Story 3 → icon support layered on top, independently verified
5. Polish → documentation + final quickstart validation + build check

---

## Notes

- `[P]` tasks touch different files with no dependency on an incomplete task — most tasks in
  this feature are sequential because they share `button.tsx`, which is expected for a
  single small component, not a sign of missing decomposition.
- `[Story]` label maps each task to spec.md's user stories for traceability.
- Stop at each checkpoint to validate that story independently before continuing.
- FR-013 (do not modify `gridu-web`/`gridu-landing`) is a guardrail, not a task — no task in
  this list touches either repo.
