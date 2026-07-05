# Implementation Plan: Component-Level Accessibility Audit

**Branch**: `22a-component-a11y-audit` | **Date**: 2026-07-03 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/22a-component-a11y-audit/spec.md`. Upstream
inputs: `tokens/tokens.css` (Feature 06, Final — color roles carry approximate contrast
ratios from `specs/04-define-color-system/color-system.md` that were never numerically
verified, only estimated "verify with OKLCH calculator"), `.specify/memory/constitution.md`
v1.0.0, and the six already-implemented components (`src/components/button`, `field`,
`card`, `table`, `navigation`, `chart`, Features 07-12) — current-state code inspected
directly, not assumed.

## Summary

Audit all six published components against WCAG 2.1 AA across three axes — color contrast,
keyboard focus, ARIA semantics — and fix any violation found. This is a verification pass
over components that were already built with accessibility intent (each carries
`focus-visible` rings, `aria-*` state attributes, and accessible-name requirements baked in
at the type level — see Button's `IconOnlyButtonProps` requiring `aria-label`). The audit's
primary value is closing the one known gap: Feature 04's color-system spec documents 8
foreground/background pairings with *approximate* contrast ratios and an explicit "verify
with OKLCH calculator" caveat that was never resolved, plus token pairings introduced in
later components (e.g. chart data color, table row hover, disabled-state opacity) that were
never checked at all. Contrast is verified precisely via the WCAG relative-luminance formula
applied to each token's OKLCH value (no new dependency — see research.md Decision 1).
Keyboard/focus and ARIA semantics are verified via `@testing-library/react` role/name/state
assertions (already a devDependency) plus manual keyboard traversal in `playground/`.
Findings and fixes are recorded in `findings.md` in this feature's spec directory.

## Technical Context

**Language/Version**: TypeScript ~5.7, ES2022 target, React 19 JSX — unchanged from
Features 07-12.

**Primary Dependencies**: No new dependency. Contrast ratios are computed with a small,
throwaway Node script implementing the standard OKLCH→linear-sRGB→relative-luminance→WCAG
contrast-ratio formula chain directly against `tokens.css` values (research.md Decision 1) —
not a published color/contrast library. ARIA/keyboard checks reuse
`@testing-library/react`, `@testing-library/jest-dom`, and `@testing-library/user-event`
(already devDependencies, already the pattern every component's `*.test.tsx` follows).

**Storage**: N/A.

**Testing**: Vitest + Testing Library, extending each component's existing `*.test.tsx` with
new assertions where a gap is found (e.g. a missing `toHaveAccessibleName` check, a missing
keyboard-traversal case) rather than a new parallel test file — keeps a11y coverage living
next to the behavior it protects, matching the existing one-test-file-per-component
convention.

**Target Platform**: Browser, same two consumption paths Features 07-12 already validate
(`gridu-web` native React 19, `gridu-landing` via Astro + `@astrojs/preact` compat) — no new
platform surface.

**Project Type**: Component library (single existing package) — audit and fix pass over all
six existing components, no new component added.

**Performance Goals**: N/A — audit produces no runtime behavior change beyond token-value
and markup fixes; no perf budget.

**Constraints**: No new runtime dependency (Decision 1). Contrast fixes, where a token value
itself must change, are made at the token level in `tokens.css` — never patched per-component
— so every consumer of that role benefits identically (spec Edge Cases). No new component
API surface is introduced solely for this audit; a fix changes an existing prop's behavior
or a token value, not the shape of the public API, unless a genuine ARIA gap requires a new
attribute pass-through.

**Scale/Scope**: 6 components × 3 criteria (contrast, focus, ARIA) = 18 audit cells, plus
token-level contrast verification for all color-role pairings actually used across the six
components' default and interactive states (a superset of Feature 04's original 8).

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Result | Reasoning |
|---|---|---|
| I. Default Over Configure | PASS | No new configuration surface is added by this audit; a contrast fix changes an existing token's default value (benefiting every consumer with zero opt-in), not a new configurable variant. |
| II. Fail Loud, Never Silent | PASS | This audit exists specifically because a Feature 04 contrast caveat ("verify with OKLCH calculator") was silently left unresolved — the audit's entire purpose is to make that gap visible and closed, matching this principle's intent for the design-system itself. |
| III. Outcome First | N/A | Governs message wording in the product, not a component-library audit process; no structural conflict. |
| IV. Scale To One, Not A Thousand | PASS | No new multi-consumer configuration (e.g. a per-app contrast override) is introduced; fixes apply uniformly at the token/component level, the same "one correct default" scope every prior feature in this repo has held to. |
| V. Calm Under Pressure | N/A | Governs product-facing message tone, not this audit's internal findings-report format. |

No violations. Complexity Tracking section omitted.

## Project Structure

### Documentation (this feature)

```text
specs/22a-component-a11y-audit/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md         # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── findings.md           # Phase 1 output — per-component audit findings report (FR-005, FR-009)
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

No `contracts/` directory — this feature audits and fixes existing components' internal
implementation; it exposes no new public interface (component prop shapes are unchanged
except where a genuine ARIA gap requires a new pass-through attribute, which is documented
in `findings.md` per component rather than as a standalone contract).

### Source Code (repository root)

```text
gridu-design-system/
├── tokens/
│   └── tokens.css                 # EDIT (conditionally) — only if a contrast finding
│                                   #   requires a token-level color-value fix
├── src/
│   └── components/
│       ├── button/
│       │   ├── button.tsx           # EDIT (conditionally) — only if a finding requires it
│       │   └── button.test.tsx      # EDIT (conditionally) — new a11y assertions where a
│       │                            #   gap is found
│       ├── field/                    # same conditional edit pattern
│       ├── card/                     # same conditional edit pattern
│       ├── table/                    # same conditional edit pattern
│       ├── navigation/               # same conditional edit pattern
│       └── chart/                    # same conditional edit pattern
└── playground/
    └── main.tsx                    # UNCHANGED — used as the manual keyboard-traversal
                                     #   surface during the audit, not edited unless a
                                     #   finding requires a new permutation to demonstrate
                                     #   a fix
```

**Structure Decision**: No new source directories. This is a verification-and-fix pass
across the six existing component files and their tests, plus a conditional edit to
`tokens.css` if — and only if — a token-level contrast violation is found. The audit's
primary new artifact is `findings.md`, the durable report FR-005/FR-009 require.

## Complexity Tracking

*No violations — section intentionally left without entries.*
