# Feature Specification: Define Design Tokens

**Feature Branch**: `06-define-design-tokens`

**Created**: 2026-06-30

**Status**: Draft

**Input**: Feature 06 of the Product Identity Refresh epic — the final Phase 0 (Foundations)
feature. Translates the Final `color-system.md` (Feature 04) and `typography-system.md`
(Feature 05) into one canonical, implementable token source, then propagates those exact
values into the two consuming surfaces: `gridu-web` and `gridu-landing`. Upstream inputs:
`specs/04-define-color-system/color-system.md`, `specs/05-define-typography-system/typography-system.md`,
`specs/00-analyze-existing-product/audit.md`, `.specify/memory/constitution.md`.

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 — One canonical token source, not copy-pasted CSS (Priority: P1)

`audit.md` documents that `gridu-web` and `gridu-landing` today carry two independent
`:root` token blocks with byte-identical values, kept in sync only by manual
copy-paste discipline ("No design tokens shared as a package... a future edit to one is
not guaranteed to propagate to the other" — audit.md Gaps). A developer changing a token
value needs to update it once, in one place, and trust both surfaces pick it up — not
remember to hand-edit two files identically.

After this feature, `gridu-design-system` holds the single canonical token source for both
color and typography. Both surfaces consume from it; neither surface independently defines
a token value that could drift from the other.

**Why this priority**: This is the structural fix the entire epic exists to deliver — without
it, every future color or type change (including the very next change after this feature
ships) reintroduces the copy-paste drift risk the audit flagged. It must land before any
visible value change is meaningful.

**Independent Test**: Given only the canonical token source in `gridu-design-system`, a
developer can determine the exact value for any color or typography role without opening
`gridu-web` or `gridu-landing` source — and a diff of the resulting token values in both
surfaces shows zero divergence for any shared token.

**Acceptance Scenarios**:

1. **Given** a color or typography role defined in `color-system.md` or
   `typography-system.md`, **When** a developer looks for its implementable value,
   **Then** they find it in exactly one canonical source within `gridu-design-system`.
2. **Given** the canonical token source, **When** a developer compares the resulting token
   values shipped in `gridu-web` and `gridu-landing`, **Then** every shared token (every
   role both surfaces use) has an identical value on both surfaces.

---

### User Story 2 — Both surfaces render the confirmed color identity; the typography scale becomes available for adoption (Priority: P2)

`gridu-web` and `gridu-landing` currently ship the pre-refresh color palette and an
undocumented, ad hoc type scale (audit.md Color, Typography). Feature 04 and Feature 05
already defined and finalized the actual Quiet Competence color and typography systems, but
neither surface has been updated to use them yet — the new identity exists only as
documentation until this feature ships it.

After this feature, both surfaces render the colors from `color-system.md`, in both light and
dark mode. The `typography-system.md` scale becomes implementable on both surfaces — defined
as CSS custom properties and Tailwind utility classes, and applied via a `@layer base`
bare-element default for genuinely class-less elements — but FR-008 excludes editing existing
component markup in this feature, so pre-existing headings, body text, and labels that already
carry an explicit Tailwind size utility (e.g. `text-4xl`) keep rendering at that pre-existing
size: Tailwind v4's CSS cascade places `@layer utilities` after `@layer base`, so any utility
class on an element always wins over a base-element default regardless of selector
specificity. Visually migrating that existing markup onto the new scale is Features 07-12
territory, consistent with FR-008.

**Why this priority**: This is the feature that makes the previous two features (04, 05)
available to an actual user — without it, the confirmed identity remains theoretical. Lower
priority than User Story 1 only because shipping the new values on top of a copy-paste-prone
structure would just recreate the same drift risk with new values.

**Independent Test**: Loading either surface, in either light or dark mode, shows color values
matching `color-system.md`, not the pre-refresh palette. Separately, inspecting either
surface's compiled CSS shows every `typography-system.md` role present as a usable token/class
— independent of whether existing markup has adopted it yet.

**Acceptance Scenarios**:

1. **Given** a page on `gridu-web`, **When** it renders in light mode, **Then** its
   background, text, brand accent, and status colors match the light-mode values in
   `color-system.md`.
2. **Given** the same page in dark mode, **When** it renders, **Then** its colors match the
   dark-mode values in `color-system.md`.
3. **Given** either surface's compiled stylesheet, **When** a developer inspects it for a
   `typography-system.md` role (e.g. `heading-page`), **Then** the corresponding `--text-*`/
   `--tracking-*` theme custom properties exist with the correct size, weight, and
   line-height. Tailwind v4's JIT only emits a `text-{role}` utility class once some component
   actually references it — so the standalone class is not yet present in compiled output for
   any role no component uses, but the theme entry guarantees it will be generated correctly
   the moment a component adds that class name. Class-less elements get the role today,
   without waiting for JIT, via the `@layer base` default (e.g. a bare `<h1>` already resolves
   `var(--text-heading-page)`); only elements bearing a pre-existing Tailwind size utility
   (e.g. `text-4xl`) do not, since `@layer utilities` always wins over `@layer base`.

---

### User Story 3 — Visitors can control dark mode on the landing site, not just the dashboard (Priority: P3)

`audit.md`'s Cross-Surface Comparison flags an existing inconsistency: `gridu-web` already
gives a user manual control over light/dark mode (a toggle, persisted, overriding the OS
preference), while `gridu-landing` only follows the OS preference with no manual override.
`color-system.md`'s Decision 1 already resolved which mechanism is correct (the `.dark`
class, matching `gridu-web`) — this feature is where `gridu-landing` actually gets that
capability.

**Why this priority**: Lower priority than getting the values right (User Story 2) because a
visitor without manual control still sees a correct, OS-driven theme today — this closes a
capability gap, not a correctness gap. It still must ship in this feature because
`color-system.md` already declared the `.dark` class as the single mechanism for *both*
surfaces, and leaving `gridu-landing` on the old mechanism would mean the color system's own
declared decision is unimplemented on one of its two consumers.

**Independent Test**: A visitor to `gridu-landing` can switch between light and dark mode
manually, the choice is remembered on return visits, and the chosen theme is visible
immediately on page load with no visible flash of the wrong theme.

**Acceptance Scenarios**:

1. **Given** a visitor on `gridu-landing` whose OS is set to light mode, **When** they
   switch to dark mode manually, **Then** the page switches to dark mode immediately and
   stays in dark mode on subsequent page loads, regardless of OS preference.
2. **Given** a returning visitor who previously chose dark mode, **When** they load any page
   on `gridu-landing`, **Then** the page renders in dark mode from the first paint — no
   visible flash of light mode before it switches.
3. **Given** a visitor who has never set an explicit preference, **When** they load
   `gridu-landing`, **Then** the page follows their OS preference, exactly as it does today.

---

### Edge Cases

- What happens to a component that currently hardcodes a value from the *old* palette (e.g.
  the `bg-amber-500` warning-color hardcode noted in `audit.md`)? → Out of scope for this
  feature to fix at the component level (Features 07-12 territory); this feature only
  changes the underlying token values. A hardcoded value that bypasses tokens entirely will
  not automatically pick up the new palette — that drift is pre-existing and unrelated to
  this feature's token-source change.
- What happens to a `gridu-web` user who already has a manual dark/light preference stored
  from before this feature ships? → Their stored preference and the toggle mechanism are
  unchanged by this feature; only the color and typography *values* change underneath the
  mechanism they already use.
- What happens on `gridu-landing` if a visitor has JavaScript disabled? → The page must
  still render a theme — falling back to OS-preference-only behavior (today's behavior)
  without the manual toggle, rather than breaking or rendering unstyled.
- What happens to gridu-landing's zero-JS-by-default posture (audit.md notes its nav menu
  and hero chat are deliberately zero-JS)? → This feature is a deliberate, scoped exception:
  a small, pre-paint inline script is required to avoid a flash of the wrong theme, mirroring
  the same trade-off `gridu-web` already makes. No other zero-JS component is affected.
- What happens to a heading, paragraph, or label that already carries an explicit Tailwind
  size utility (e.g. `text-4xl`) once the new `typography-system.md` scale ships? → It keeps
  rendering at its pre-existing size. Tailwind v4's `@layer utilities` always wins over
  `@layer base` regardless of selector specificity, so the new scale's bare-element defaults
  only apply to genuinely class-less elements. FR-008 excludes editing that existing markup in
  this feature; visually migrating it onto the new scale is Features 07-12 territory.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: `gridu-design-system` MUST define one canonical token source reflecting every
  role in `color-system.md` and `typography-system.md`. This is the single source of truth
  for token values across the design system.

- **FR-002**: `gridu-web`'s token values MUST be updated to match `color-system.md` exactly,
  for every color role, in both light and dark mode — replacing the pre-refresh palette
  documented in `audit.md`.

- **FR-003**: `gridu-web` MUST gain the complete `typography-system.md` scale (all 8 text
  roles) as implementable values, available for component use — replacing the undocumented,
  ad hoc per-component sizing documented in `audit.md`.

- **FR-004**: `gridu-landing`'s token values MUST be updated to match `color-system.md`
  exactly, for every shared color role, in both light and dark mode, identical to
  `gridu-web`'s values for every role both surfaces use.

- **FR-005**: `gridu-landing` MUST gain the complete `typography-system.md` scale (all 8 text
  roles) as implementable values, available for component use — identical to `gridu-web`'s
  implementation.

- **FR-006**: `gridu-landing` MUST replace its OS-preference-only dark-mode trigger with the
  `.dark` class-based mechanism declared in `color-system.md` Decision 1, including a
  manual toggle a visitor can use to override the OS preference — matching the capability
  `gridu-web` already has.

- **FR-007**: `gridu-landing`'s dark-mode mechanism MUST resolve and apply the correct theme
  before first paint, so a visitor with a stored preference never sees a flash of the wrong
  theme — matching the no-flash guarantee `gridu-web` already provides.

- **FR-008**: This feature MUST NOT modify component-level styling (e.g. the `Card`/`Input`/
  `Badge` drift documented in `audit.md`'s Cross-Surface Comparison) — those changes are
  deferred to Features 07-12. This feature changes only the underlying token values and the
  dark-mode mechanism.

- **FR-009**: This feature MUST NOT introduce a new spacing, sizing, or border-radius token
  scale. Those are not yet ratified design decisions in this epic (only color and typography
  have been ratified, in Features 04 and 05) and remain out of scope here.

### Key Entities

- **Canonical Token Source**: The single, authoritative definition of every color and
  typography token value, held in `gridu-design-system`. Both `gridu-web` and
  `gridu-landing` derive their implementable token values from this source — neither surface
  independently redefines a value.

- **Token Consumer**: A surface (`gridu-web` or `gridu-landing`) that implements the
  canonical token values in its own styling layer. A consumer's implemented values must be
  identical to the canonical source for every token role it uses.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Every shared color and typography token has an identical value on `gridu-web`
  and `gridu-landing` — verifiable by comparing the rendered/implemented value for each
  shared role on both surfaces and finding zero discrepancies.

- **SC-002**: Both surfaces visually render the `color-system.md` palette, in both light and
  dark mode — verifiable by inspecting rendered color values against the reference document.
  Both surfaces' compiled stylesheets expose the complete `typography-system.md` scale as
  usable CSS custom properties and utility classes — verifiable by inspecting compiled CSS
  output, independent of whether existing component markup has adopted those classes yet
  (that adoption is Features 07-12 territory per FR-008).

- **SC-003**: A visitor on `gridu-landing` can manually switch between light and dark mode,
  with the choice remembered across page loads — verifiable by toggling the theme, reloading
  the page, and confirming the chosen theme persists.

- **SC-004**: No visible flash of the incorrect theme occurs on initial page load on either
  surface for a visitor with a stored preference — verifiable by loading the page with a
  stored dark-mode preference and confirming the page never briefly shows light mode (or
  vice versa) before settling.

---

## Assumptions

- `gridu-web` already has a complete, working dark-mode toggle mechanism (a stored
  preference, a pre-paint inline script preventing flash-of-wrong-theme, and a runtime
  toggle) — this feature does not change that mechanism, only the token *values* underneath
  it. `gridu-landing`'s new toggle is built to the same UX behavior, not by literally sharing
  code or storage with `gridu-web` (the two surfaces are separate origins; a shared
  cross-origin preference is not expected or required).
- The exact file format and structure of the "canonical token source" (e.g. a CSS custom
  properties file, a JSON token file, or another format) is an implementation decision left
  to `/speckit-plan` — this specification only requires that one canonical source exists and
  that both surfaces consume from it without redefining values independently.
- Component-level class names and markup are unchanged by this feature; only the token
  values those classes resolve to change. A component that already correctly references a
  semantic token (e.g. `bg-brand`) picks up the new value automatically; a component that
  hardcodes a raw value (e.g. the audit's `bg-amber-500` case) does not, and fixing that is
  out of scope here (FR-008).
- Radius and spacing tokens are unchanged — `audit.md` flagged the lack of a shared spacing
  scale as a gap, but no spacing/sizing design decision has been ratified in this epic
  (Features 04-05 cover only color and typography), so introducing one here would be
  speculative and is excluded (FR-009).
- Both surfaces continue to use OKLCH as the color notation and Inter as the typeface,
  consistent with `color-system.md` and `typography-system.md` — no new color space or
  typeface decision is made or revisited in this feature.
- The typography scale's `@layer base` bare-element defaults (e.g. `h1 { font-size:
  var(--text-heading-page) }`) are infrastructure, not a guarantee of visible change on
  existing pages. Because FR-008 excludes editing existing component markup, and Tailwind v4's
  cascade places utility classes after base-layer rules, every heading/paragraph/label that
  already carries an explicit size utility renders unchanged until a future feature (07-12)
  migrates that markup onto the new scale's classes.
