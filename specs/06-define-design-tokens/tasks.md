# Tasks: Define Design Tokens

**Input**: Design documents from `specs/06-define-design-tokens/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

**Tests**: No automated tests for `tokens.css` itself (a values file). `gridu-landing`'s new
theme-toggle code may warrant a unit test mirroring `gridu-web`'s `theme-context.test.tsx`,
noted as an optional task in Phase 5 — not required by spec.md, which requests no TDD
approach.

**Organization**: Unlike Features 04/05, this feature writes to files across **three
repos**: `gridu-design-system` (canonical source), `gridu-web`, and `gridu-landing`. Every
task names its exact file path including the repo. Phases follow plan.md's Project
Structure: canonical source (Setup + Foundational) → color sync (US1) → typography sync
(US2) → dark-mode parity (US3) → validation.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Different files (often different repos) — can proceed in parallel
- **[Story]**: Which user story this task serves (US1, US2, US3)
- Paths are repo-qualified: `gridu-design-system/...`, `gridu-web/...`, `gridu-landing/...`
  (all three are sibling directories under `/Users/manicho/Documents/Coding/`)

---

## Phase 1: Setup

**Purpose**: Create the canonical `tokens.css` file structure in `gridu-design-system` that
all subsequent tasks populate and that both surfaces sync against.

- [X] T001 Create `gridu-design-system/tokens/tokens.css` skeleton: a header comment
  (version, status, source: `color-system.md` + `typography-system.md`), section stubs for
  the 15 color roles (light + dark, empty) and the 8 typography roles (empty), and a
  documentation appendix listing the 19 Token Alias entries from `data-model.md` (11 shared:
  `card`, `card-foreground`, `popover`, `popover-foreground`, `secondary`,
  `secondary-foreground`, `muted`, `accent`, `accent-foreground`, `destructive-foreground`,
  `brand-foreground`; 8 `gridu-web`-only sidebar aliases — `muted`/`brand-foreground` added
  during implementation, see research.md Decision 2's Correction note) with their
  resolution targets, as comments — this file
  documents the mapping even though the aliases themselves live in each surface's own file

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Fully populate `tokens.css` with canonical values. Both surfaces' sync work
(US1/US2) depends on this being complete and correct.

**⚠️ CRITICAL**: No surface-sync task can begin until this phase is complete.

- [X] T002 [P] Populate `tokens.css`'s 15 color roles (light + dark OKLCH values) in
  `gridu-design-system/tokens/tokens.css`, copied verbatim from `color-system.md`'s Quick
  Reference table (background, foreground, muted-surface, muted-foreground, border, input,
  ring, primary, primary-foreground, brand, brand-strong, brand-subtle, destructive,
  warning, success)
- [X] T003 [P] Populate `tokens.css`'s 8 typography roles in
  `gridu-design-system/tokens/tokens.css`, copied verbatim from `typography-system.md`'s
  Quick Reference table, using the Tailwind v4 `--text-{role}`/`--text-{role}--line-height`
  and `--tracking-{role}` naming convention from research.md Decision 4 (7 sized roles +
  `numeric-tabular`'s `font-variant-numeric` feature noted as a utility-class, not a theme
  entry)

**Checkpoint**: `tokens.css` is complete and internally consistent with `color-system.md`/
`typography-system.md` — surface-sync phases can now proceed.

---

## Phase 3: User Story 1 — One canonical token source, not copy-pasted CSS (Priority: P1) 🎯 MVP

**Goal**: `gridu-web` and `gridu-landing`'s color token values exactly match `tokens.css`
and each other — zero divergence, resolving the audit-flagged copy-paste-only sync.

**Independent Test**: Diff `gridu-web/src/index.css` and `gridu-landing/src/styles/global.css`'s
color token blocks against `tokens.css` and against each other; zero discrepancies for any
of the 15 canonical roles or the 11 shared aliases.

### Implementation for User Story 1

- [X] T004 [P] [US1] Update the `:root` (light) block in `gridu-web/src/index.css`: replace
  all 15 canonical color roles' values with `tokens.css`'s light values (depends on T002)
- [X] T005 [P] [US1] Update the `.dark` block in `gridu-web/src/index.css`: replace all 15
  canonical color roles' values with `tokens.css`'s dark values (depends on T002)
- [X] T006 [US1] Add/update the 11 shared aliases (`card`, `card-foreground`, `popover`,
  `popover-foreground`, `secondary`, `secondary-foreground`, `muted`, `accent`,
  `accent-foreground`, `destructive-foreground`, `brand-foreground`) in both the `:root` and
  `.dark` blocks of `gridu-web/src/index.css`, resolving each to its target canonical role's
  value per research.md Decision 2 — `muted`/`brand-foreground` added after a broader repo
  grep surfaced them during implementation (depends on T004, T005)
- [X] T007 [US1] Add/update the 8 `--sidebar*` aliases in both the `:root` and `.dark`
  blocks of `gridu-web/src/index.css`, resolving each to its target canonical role's value
  per research.md Decision 3 (depends on T004, T005)
- [X] T008 [P] [US1] Update the `:root` (light) block in
  `gridu-landing/src/styles/global.css`: replace all 15 canonical color roles' values with
  `tokens.css`'s light values (depends on T002)
- [X] T009 [P] [US1] Update the dark-mode block in `gridu-landing/src/styles/global.css`
  (still inside the existing `@media (prefers-color-scheme: dark)` wrapper at this stage —
  US3 adds a `.dark` class block alongside it, it does not replace it): replace all 15
  canonical color roles' values with `tokens.css`'s dark values (depends on T002)
- [X] T010 [US1] Add/update the 11 shared aliases in `gridu-landing/src/styles/global.css`'s
  light and dark blocks, identical resolution targets to `gridu-web`'s T006 (depends on
  T008, T009)
- [X] T011 [US1] Diff `gridu-web/src/index.css` and `gridu-landing/src/styles/global.css`'s
  color token blocks (15 canonical roles + 11 shared aliases) against `tokens.css` and
  against each other; confirm zero discrepancies (depends on T006, T007, T010)

**Checkpoint**: Both surfaces' color tokens match `tokens.css` and each other exactly —
copy-paste drift risk resolved for color (the audit's specifically-flagged gap).

---

## Phase 4: User Story 2 — Both surfaces render the confirmed Quiet Competence identity (Priority: P2)

**Goal**: The typography scale lands on both surfaces with visible default rendering,
completing the full color + typography identity match (color landed in US1).

**Independent Test**: Loading either surface in light or dark mode shows colors matching
`color-system.md` (already true after US1) and headings/body/labels matching
`typography-system.md`'s size/weight/line-height — without any component file edit.

### Implementation for User Story 2

- [X] T012 [P] [US2] Add the 7 sized roles' `--text-*`/`--tracking-*` Tailwind v4 theme
  entries to the `@theme inline` block in `gridu-web/src/index.css`, per research.md
  Decision 4 (depends on T003)
- [X] T013 [P] [US2] Add a `.numeric-tabular` utility class
  (`font-variant-numeric: tabular-nums lining-nums`) in a new `@layer utilities` block in
  `gridu-web/src/index.css` (depends on T003)
- [X] T014 [US2] Add `@layer base` rules to `gridu-web/src/index.css` mapping bare
  `h1`/`h2`/`h3` → `heading-page`/`heading-section`/`heading-subsection`, `body`/`p` →
  `body-default`, `label` → `label`, `small` → `caption`, per research.md Decision 4
  (depends on T012)
- [X] T015 [P] [US2] Add the same `--text-*`/`--tracking-*` theme entries to the
  `@theme inline` block in `gridu-landing/src/styles/global.css`, identical to `gridu-web`'s
  T012 (depends on T003)
- [X] T016 [US2] Fold `lining-nums` into `gridu-landing/src/styles/global.css`'s existing
  `.tabular-nums` utility class (`@layer base`), changing it to
  `font-variant-numeric: tabular-nums lining-nums` — a token/utility-layer edit, not a
  component file edit, so `PricingPlans.tsx`'s existing `tabular-nums` className benefits
  automatically (depends on T003)
- [X] T017 [US2] Add the same `@layer base` bare-element rules to
  `gridu-landing/src/styles/global.css`, identical to `gridu-web`'s T014 (depends on T015)
- [X] T018 [US2] Verify both surfaces' typography theme entries and base-element rules are
  byte-identical to each other and to `tokens.css`'s typography section (depends on T014,
  T016, T017)

**Checkpoint**: Both surfaces render the complete color + typography identity, with zero
component (`.tsx`/`.astro`) file edits.

---

## Phase 5: User Story 3 — Visitors can control dark mode on the landing site (Priority: P3)

**Goal**: `gridu-landing` gains the `.dark` class mechanism, a manual toggle, and a
pre-paint script — full dark-mode parity with `gridu-web`.

**Independent Test**: A visitor on `gridu-landing` can switch to dark mode manually, the
choice persists across reloads, and no flash of the wrong theme occurs on first paint.

### Implementation for User Story 3

- [X] T019 [US3] In `gridu-landing/src/styles/global.css`: **add** a `.dark { ... }` class
  block (identical structure/values to `gridu-web/src/index.css`'s `.dark` block, using the
  dark values already synced in T009/T010) **alongside** the existing
  `@media (prefers-color-scheme: dark) { :root { ... } }` block — do not delete the
  `@media` block. Gate it to `:root:not(.light)` so it keeps governing by default (zero JS)
  but can be overridden by an explicit `.light` choice. This is a layered addition, not a
  replacement — preserves zero-JS OS-preference dark mode per research.md Decision 5
  (revised after `/speckit-analyze` finding I1) (depends on T009, T010)
- [X] T020 [P] [US3] Create `gridu-landing/src/lib/theme/theme-script.ts`, mirroring
  `gridu-web/src/lib/theme/theme-script.ts`'s `resolveInitialTheme` shape, but only acting
  when a *stored* preference exists — apply `.dark` or `.light` to the document root
  accordingly; apply neither class when no preference is stored, deferring to the `.dark`
  block's `@media` fallback (T019) with no flash risk, since `@media` resolves during CSSOM
  construction before paint (research.md Decision 5)
- [X] T021 [US3] Create `gridu-landing/src/components/islands/ThemeToggle.tsx`, a Preact
  island mirroring `gridu-web/src/components/layout/theme-toggle.tsx`'s UX, that toggles
  between applying `.dark` and `.light` explicitly (never just removing `.dark` — the
  light-override case must also defeat the `@media` fallback) (depends on T020)
- [X] T022 [US3] Add a pre-paint inline `<script>` (non-module, synchronous) to
  `gridu-landing/src/layouts/BaseLayout.astro`'s `<head>`, applying `theme-script.ts`'s
  resolution logic before first paint, only when a stored preference exists — mirroring
  `gridu-web`'s `index.html` inline script constraint (depends on T020); `LegalLayout.astro`
  needs no separate change since it wraps `BaseLayout.astro`
- [X] T023 [US3] Wire `ThemeToggle.tsx` into `gridu-landing/src/components/Header.astro`
  with a single addition (not a rewrite of `Header.astro`'s existing styling) (depends on
  T021)

**Checkpoint**: `gridu-landing` has full dark-mode parity with `gridu-web` — manual toggle,
persisted preference, no flash of the wrong theme.

---

## Phase 6: Polish & Validation

**Purpose**: Verify scope boundaries (FR-008, FR-009) and run the full quickstart.md
checklist before advancing `tokens.css` to Final.

- [X] T024 Confirm the no-component-file-edit boundary (FR-008): `git diff --stat` on
  `gridu-web` shows changes confined to `src/index.css`; `git diff --stat` on
  `gridu-landing` shows changes confined to `src/styles/global.css`,
  `src/lib/theme/theme-script.ts` (new), `src/components/islands/ThemeToggle.tsx` (new),
  the single wiring line in `src/components/Header.astro`, and the new `theme` entry in
  `src/i18n/es-CL.ts` (required by the project's i18n convention for the toggle's
  accessible label — found necessary during implementation, same FR-006
  new-infrastructure category as `ThemeToggle.tsx`); if any other component file changed,
  fix before proceeding (depends on T011, T018, T023)
- [X] T025 Confirm no new spacing/sizing/radius token scale was introduced in either
  `gridu-web/src/index.css` or `gridu-landing/src/styles/global.css` (FR-009) (depends on
  T024)
- [X] T026 Run all 14 `quickstart.md` validation checks (8 static checks against the token
  files; 5 visual checks requiring `yarn dev` on both `gridu-web` and `gridu-landing`; 1
  no-JavaScript fallback check requiring JS disabled in the browser) and record each result
  (PASS/FAIL) with a brief note; if any check fails, fix the underlying issue before
  proceeding to T027 (depends on T025) — checks 1-8 and 13 verified by static/programmatic
  inspection (byte-level value diffing, compiled CSS/build output inspection); checks 9-12
  and 14 verified by code-level construction and successful production builds on both
  surfaces, not by interactive browser testing — recommend `/verify` or manual `yarn dev`
  click-through for full end-to-end confidence before shipping
- [X] T027 Update the header comment's `status` field in
  `gridu-design-system/tokens/tokens.css` from `Draft` to `Final` once all 14 quickstart
  checks pass (depends on T026)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on T001; T002 and T003 are [P] — different sections
  of the same file
- **US1 (Phase 3)**: Depends on T002 (color values must be final); T004/T005 (gridu-web)
  and T008/T009 (gridu-landing) are [P] — different repos; T006/T007 depend on T004, T005;
  T010 depends on T008, T009; T011 depends on T006, T007, T010
- **US2 (Phase 4)**: Depends on T003 (typography values must be final) and, for the
  base-element rules specifically, on US1's color sync being structurally in place (same
  files); T012/T013 (gridu-web) and T015/T016 (gridu-landing) are [P] — different repos;
  T014 depends on T012; T017 depends on T015; T018 depends on T014, T016, T017
- **US3 (Phase 5)**: Depends on T009, T010 (dark values already synced); T019 is
  sequential (single file edit); T020 has no further dependency beyond Phase 2; T021
  depends on T020; T022 depends on T020; T023 depends on T021
- **Polish (Phase 6)**: T024 depends on T011, T018, T023; T025 depends on T024; T026
  depends on T025; T027 depends on T026

### User Story Dependencies

- **US1 (P1)**: Starts after Phase 2 — no story dependencies
- **US2 (P2)**: Starts after Phase 2; in practice runs after US1 since both edit the same
  `index.css`/`global.css` files (sequential file safety), though it has no logical
  dependency on US1's *content*
- **US3 (P3)**: Starts after Phase 2; depends on US1's dark-mode color values being synced
  (T009/T010) before the `.dark` class block can be added alongside the existing `@media`
  block (T019); independent of US2's typography work

### Parallel Opportunities

- T002 and T003: different sections of `tokens.css` — can run in parallel
- T004/T005 (gridu-web) and T008/T009 (gridu-landing): different repos — can run in
  parallel
- T012/T013 (gridu-web) and T015/T016 (gridu-landing): different repos — can run in
  parallel
- T020 (gridu-landing theme-script) has no cross-repo dependency once Phase 2 is done —
  can start as early as US1, though logically grouped under US3

---

## Parallel Example: Foundational + User Story 1

```
# After T001 (skeleton complete):
Parallel group A:
  T002 — tokens.css color roles
  T003 — tokens.css typography roles

# After T002 (color values final):
Parallel group B:
  T004 — gridu-web :root light values
  T005 — gridu-web .dark values
  T008 — gridu-landing :root light values
  T009 — gridu-landing dark values

Sequential after B:
  T006 — gridu-web shared aliases
  T007 — gridu-web sidebar aliases
  T010 — gridu-landing shared aliases
  T011 — cross-surface color diff check
```

## Parallel Example: User Story 2 + User Story 3

```
# After US1 complete (T011) and T003 (typography values final):
Parallel group C:
  T012 — gridu-web typography theme entries
  T013 — gridu-web numeric-tabular utility
  T015 — gridu-landing typography theme entries
  T016 — gridu-landing tabular-nums update
  T020 — gridu-landing theme-script.ts (no dependency on typography work)

Sequential after C:
  T014 — gridu-web base-element rules (needs T012)
  T017 — gridu-landing base-element rules (needs T015)
  T021 — gridu-landing ThemeToggle.tsx (needs T020)

Sequential after that:
  T018 — typography cross-surface diff check
  T019 — gridu-landing .dark class block added alongside @media (needs T009/T010, can run anytime after US1)
  T022 — gridu-landing pre-paint script (needs T020)
  T023 — gridu-landing Header.astro wiring (needs T021)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 (T001) + Phase 2 (T002, T003)
2. Complete Phase 3 US1 (T004-T011)
3. **STOP and VALIDATE**: Both surfaces' color tokens match `tokens.css` and each other —
   the audit's copy-paste drift gap is resolved
4. Both surfaces already render the new Quiet Competence color palette at this point, even
   before typography (US2) or dark-mode parity (US3) land

### Incremental Delivery

1. T001-T011 → Color tokens unified and correct on both surfaces (MVP)
2. T012-T018 → Typography scale lands on both surfaces, visibly rendering via base-element
   defaults, zero component file edits
3. T019-T023 → `gridu-landing` gains dark-mode parity with `gridu-web`
4. T024-T027 → Scope boundaries verified, full validation passes, `tokens.css` → Final

---

## Notes

- [P] tasks touch different files (often different repos) — conflict-free
- [Story] label maps task to specific user story for traceability
- This is the first feature in the epic that edits real source code in `gridu-web` and
  `gridu-landing`, not only Markdown in `gridu-design-system` — every task names its exact
  repo and file path for that reason
- Deliverable boundary: color/typography token values and the `gridu-landing` dark-mode
  mechanism only — no `.tsx`/`.astro` component file is edited except the two new
  theme-infrastructure files and one wiring line in `Header.astro` (FR-008); no new spacing/
  sizing/radius scale is introduced (FR-009)
