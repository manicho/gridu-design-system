# Implementation Plan: Button Component

**Branch**: `07-button-component` | **Date**: 2026-06-30 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/07-button-component/spec.md`. Upstream inputs:
`specs/06-define-design-tokens/data-model.md` and `tokens/tokens.css` (Final), `.specify/memory/constitution.md`
v1.0.0. Current-state code inspected directly (not assumed) in `gridu-web/src/components/ui/button.tsx`,
`gridu-web/src/components/common/submit-button.tsx`, `gridu-web/package.json`,
`gridu-landing/astro.config.mjs`, and `gridu-landing/package.json`.

## Summary

Stand up the first real component package in `gridu-design-system`: a React 19 `Button`
component with 5 variants (primary, secondary, destructive, outline, ghost), 3 sizes, 6
states (default/hover/focus-visible/active/disabled/loading), leading/trailing/icon-only
icon slots, and anchor-element support — all styled exclusively through `tokens.css`'s
existing color and typography roles via the same `class-variance-authority` pattern
`gridu-web`'s current `button.tsx` already uses. This is also the feature that introduces
this repo's first `package.json` and component-authoring tooling (TypeScript, Vite library
build, Vitest, ESLint), scoped to authoring and testing components locally — installing the
package as a real dependency into `gridu-web`/`gridu-landing` stays deferred to the Phase 1
checkpoint (after Feature 12), per `specs/06-define-design-tokens/research.md` Decision 1
and the epic tracker.

## Technical Context

**Language/Version**: TypeScript ~5.7 (matches `gridu-web`'s pinned version, the nearer of
the two consumers' toolchains) targeting ES2022, React 19 JSX.

**Primary Dependencies**: `react` ^19 (peer dependency — not bundled), `class-variance-authority`
^0.7, `clsx` ^2, `tailwind-merge` ^2 — the exact library set `gridu-web/src/components/ui/button.tsx`
already uses, so the variant/size/state composition pattern is zero-new-concept for anyone
who touches both repos. No icon library dependency: icons are accepted as a generic
`ReactNode` slot (research.md Decision 3), so the component stays icon-library-agnostic
(`gridu-web` uses `lucide-react`; `gridu-landing` uses none today).

**Storage**: N/A.

**Testing**: Vitest + `@testing-library/react` + `@testing-library/jest-dom`, mirroring
`gridu-web`'s existing test stack exactly (same runner, same assertion library), so test
authoring conventions transfer directly once Features 08-12 follow this pattern.

**Target Platform**: Browser, via two real consumption paths confirmed by inspecting each
repo's config: `gridu-web` (React 19 + Vite, native consumption) and `gridu-landing` (Astro +
`@astrojs/preact` with `compat: true` in `astro.config.mjs` — this already aliases
`react`/`react-dom` imports to `preact/compat`, so a standard React function component needs
no Preact-specific fork or rewrite to run there; research.md Decision 1).

**Project Type**: Component library (single package, first of its kind in this repo).

**Performance Goals**: N/A — a presentational component; no perf budget beyond what its
underlying DOM/CSS naturally costs.

**Constraints**: Zero new color or typography values (FR-002, FR-003, SC-005) — every
utility class the component emits must resolve to a role `tokens.css` already declares. Zero
edits to `gridu-web` or `gridu-landing` source (FR-013) — this feature's surface is entirely
within `gridu-design-system`. No icon library dependency added (research.md Decision 3).

**Scale/Scope**: 1 component, 5 variants × 3 sizes × 6 states = 90 visual combinations (some
states are interaction-only, not independently styled — see data-model.md), 2 icon slots +
1 icon-only mode, 1 polymorphic (button | anchor) rendering mode.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Result | Reasoning |
|---|---|---|
| I. Default Over Configure | PASS | The variant and size sets are closed enums (5 variants, 3 sizes), not open string props — a consumer cannot configure a 6th variant or an arbitrary size (research.md Decision 2, data-model.md). Tooling choice mirrors `gridu-web`'s already-validated stack rather than evaluating new options speculatively. |
| II. Fail Loud, Never Silent | PASS | Icon-only buttons without an accessible name are a TypeScript compile error, not a runtime warning or silent omission (FR-010; research.md Decision 6) — the strongest "fail loud" form available in a static UI library, applied to this component's equivalent of a booking-affecting action: an unusable control shipping unnoticed. |
| III. Outcome First | N/A | This principle governs message wording (what a user reads), not a UI primitive's visual API. No structural conflict; the loading state's content swap (research.md Decision 7) still leads with the state that matters (busy), not a caveat. |
| IV. Scale To One, Not A Thousand | PASS | No Storybook, no design-token build pipeline, no npm publish/version infrastructure introduced for a 1-component library (research.md Decision 4, 5) — package tooling is the minimum needed to author and test this component locally, matching the epic's own Phase 1 checkpoint sequencing (real package distribution after Features 07-12 exist, not before). |
| V. Calm Under Pressure | PASS | The destructive variant is visually distinct through color/weight alone (an existing `tokens.css` role), with no flashing, pulsing, or alarmed micro-animation — the same even-keeled treatment every other variant gets. |

No violations. Complexity Tracking section omitted.

## Project Structure

### Documentation (this feature)

```text
specs/07-button-component/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md         # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # Phase 1 output (/speckit-plan command)
│   └── button-api.md
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)

```text
gridu-design-system/
├── package.json          # NEW this feature — first package.json in this repo
├── tsconfig.json         # NEW — single flat config (strict, react-jsx, ES2022), covers
│                         #   src/ and playground/; no project-references split (Principle IV
│                         #   — unjustified for a 1-component package)
├── vite.config.ts        # NEW — library build (src/index.ts entry) + Vitest config
├── eslint.config.js       # NEW — mirrors gridu-web's flat ESLint config
├── tokens/
│   └── tokens.css         # EXISTING (Feature 06) — Button consumes these roles, edits none
├── src/
│   ├── index.ts            # NEW — public package entry, barrel-exports Button
│   └── components/
│       └── button/
│           ├── button.tsx       # NEW — component implementation
│           ├── button.test.tsx  # NEW — Vitest + Testing Library coverage
│           └── README.md        # NEW — FR-012 documentation (location, token mapping, adoption note)
└── playground/             # NEW — local-only Vite dev app, not published, not a consumer dependency
    ├── index.html
    └── main.tsx              # renders every variant×size×state permutation against tokens.css
```

**Structure Decision**: Single-package component library layout (adapted Option 1). The
`playground/` directory exists solely so the component can be visually verified in a real
browser during implementation (per this project's UI-change testing expectation) without
adopting Storybook — it is dev-only tooling, excluded from the package's published `files`
field once real distribution begins (deferred, per Constraints).

## Complexity Tracking

*No violations — section intentionally left without entries.*
