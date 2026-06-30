# Phase 0 Research: Button Component

## Decision 1 — Author as a standard React 19 component, not a Preact-specific or dual build

**Decision**: Write `Button` as an ordinary React function component using standard
`react` imports and JSX — no Preact-specific code path, no dual React/Preact build.

**Rationale**: Inspecting `gridu-landing/astro.config.mjs` directly shows
`preact({ compat: true })` already configured, with an explanatory comment: "compat aliases
react/react-dom to preact/compat, so the interactive islands keep their existing hooks-based
code while shipping ~5 KB instead of React's ~58." This means `gridu-landing` already runs
React-authored components (its `ChatDemo.tsx`, `PricingPlans.tsx` islands) through this
alias today. A standard React component therefore works unmodified in both real consumers
without this feature building or maintaining a second implementation.

**Alternatives considered**: A native Preact build (rejected — `gridu-web` is React-only, so
this would require either two implementations or a runtime check; `gridu-landing`'s existing
compat alias makes this unnecessary). A framework-agnostic Web Component (rejected — neither
consumer uses Web Components today; would be the largest possible scope increase to solve a
problem the compat alias already solves).

---

## Decision 2 — Variant/size styling via `class-variance-authority` + `clsx` + `tailwind-merge`

**Decision**: Reuse the exact library combination `gridu-web/src/components/ui/button.tsx`
already uses: `cva()` for the variant/size class map, `clsx`/`cn()` for conditional
className composition, `tailwind-merge` for override-safe merging when a consumer passes a
`className` prop.

**Rationale**: This is a directly observed, already-validated pattern in production code,
not a speculative choice — `gridu-web/src/components/ui/button.tsx:1-28` shows the exact
shape (variants object, defaultVariants, `VariantProps` type export). Matching it means
zero new concepts for `gridu-web` maintainers and a near-identical adoption path when this
component eventually replaces `gridu-web`'s local one. All resulting class strings are
Tailwind v4 utility classes that resolve against the `--brand`/`--secondary`/`--destructive`/
etc. theme entries `tokens.css` and each consumer's CSS file already declare (Feature 06) —
this repo does not need to run a Tailwind build itself to produce correct output once
consumed.

**Alternatives considered**: CSS Modules or vanilla CSS (rejected — neither consumer uses
this pattern; would require inventing a new authoring convention for no benefit). CSS-in-JS
(rejected — same reasoning, plus a new runtime dependency neither consumer carries today).

---

## Decision 3 — Icons accepted as a generic `ReactNode` slot, no icon library dependency

**Decision**: `leadingIcon`, `trailingIcon` props (and the icon-only configuration's sole
icon) accept `React.ReactNode`. The component does not import or depend on any specific icon
library.

**Rationale**: `gridu-web` uses `lucide-react`; `gridu-landing`'s `package.json` has no icon
library at all today. Hard-coding a dependency on either would force one consumer into an
unnecessary install or create an inconsistency between the two. A `ReactNode` slot lets each
consumer pass whatever they already use (`<Trash2 />` from `lucide-react`, an inline SVG, or
nothing) with zero coupling — consistent with Constitution Principle IV (don't build for a
need not yet demonstrated).

**Alternatives considered**: Bundling `lucide-react` as a dependency (rejected — forces an
unused install on `gridu-landing` today). A closed icon-name enum resolved internally
(rejected — would require this repo to own and ship an icon set, a much larger scope than a
button component).

---

## Decision 4 — Introduce minimal local package tooling now; defer real distribution

**Decision**: This feature adds `package.json`, `tsconfig.json`, a Vite library-mode build
config, Vitest, and a flat ESLint config (mirroring `gridu-web`'s) to `gridu-design-system`
for the first time. It does **not** publish the package, set up a workspace/monorepo link,
or install it into `gridu-web`/`gridu-landing`.

**Rationale**: `specs/06-define-design-tokens/research.md` Decision 1 explicitly deferred
"real package distribution" to after "the component library (Features 07-12) exists" — that
checkpoint is the epic tracker's own Phase 1 completion gate ("cut a version of
`gridu-design-system` once this phase is Done"), not Feature 07 individually. But authoring
and testing a React component requires *some* local tooling (a way to compile TSX, run
tests, type-check) regardless of distribution status — that minimum is in scope now; cutting
a version and wiring it into the two consumer repos is not (FR-013).

**Alternatives considered**: Deferring all tooling until Feature 12 and hand-writing/testing
Button as a bare `.tsx` file with no build config (rejected — `/speckit-tasks` and
`/speckit-implement` need a runnable `test`/`typecheck` command per this project's standard
workflow; reviewing untyped, untested component code is not an acceptable bar for the first
of six components other features will pattern-match against). Setting up a full npm/yarn
workspace across all three repos now (rejected — exactly the speculative infrastructure
Feature 06 already declined to build before component code existed; still premature with
only one component built).

---

## Decision 5 — Local Vite "playground" instead of Storybook

**Decision**: Add a small, unpublished `playground/` Vite app (single HTML entry + one
`main.tsx`) that imports `tokens/tokens.css` and renders every variant × size × state
permutation, for manual/visual verification in a real browser during implementation.

**Rationale**: This project's standing UI-change expectation is to verify changes in a
browser before reporting them done. A 1-component library does not yet justify Storybook's
dependency footprint and configuration surface (Constitution Principle IV); a plain Vite
entry achieves the same "see it rendered for real" outcome with tooling already present
(Vite is already a dependency for the library build itself, per Decision 4).

**Alternatives considered**: Storybook (rejected — premature for one component; revisit once
Features 08-12 make a shared catalog worth the setup cost). No visual verification at all,
relying solely on unit tests and CSS class assertions (rejected — does not satisfy this
project's "test UI changes in a browser" expectation, and a contrast/visual regression in a
purely class-based test would not be caught).

---

## Decision 6 — Icon-only accessible name enforced at the TypeScript type level

**Decision**: `ButtonProps` is a discriminated union: when no visible text `children` is
provided (icon-only mode), an `aria-label` (or `aria-labelledby`) prop becomes required by
the type system. A consumer omitting it fails `tsc`/`yarn typecheck`, not just a runtime
lint or console warning.

**Rationale**: Directly implements FR-010 and the spec's Edge Case ruling ("no silent
failure, per the Fail Loud principle"). A compile-time requirement is the strongest
enforcement available in a component library with no runtime framework to inject a warning
into — it cannot ship past `yarn typecheck`, which this project's workflow already gates on
for every change.

**Alternatives considered**: A runtime `console.warn` in development mode only (rejected —
silently passes in production builds and CI type-checks, the exact "silent failure" the
principle forbids). An ESLint rule via `eslint-plugin-jsx-a11y` (rejected as the *sole*
mechanism — useful as defense in depth, but it is a lint warning a build can still pass with
fixable-but-unfixed warnings, weaker than a type error; can be added later, not required to
satisfy FR-010 now).

---

## Decision 7 — `loading` is a built-in boolean prop, not externally composed

**Decision**: `Button` accepts a `loading?: boolean` prop. When `true`, the component
internally sets `disabled` semantics, `aria-busy="true"`, swaps its visible content for a
spinner (with screen-reader-only status text), and ignores any `disabled` prop conflict by
treating loading as the more specific state (per the spec's Edge Case ruling: loading visual
takes precedence over disabled when both are set).

**Rationale**: `gridu-web`'s current `SubmitButton` composes loading externally (a wrapper
around the plain `Button` using `useFormStatus`, manually setting `disabled`/`aria-busy` and
swapping children). That pattern works for one call site but is exactly the kind of
ad-hoc-per-screen behavior Feature 06's audit flagged as a sync gap risk at the *token*
level — the same risk applies at the *component* level if every consumer re-implements
loading by hand. FR-012 requires this feature to "establish the pattern" Features 08-12
follow; a single canonical `loading` prop is that pattern. `gridu-web`'s `SubmitButton`
remains valid as a thin convenience wrapper (it still works by passing `loading` through)
but migrating it is explicitly out of scope (FR-013) — this decision only defines the
component's own API, not who calls it.

**Alternatives considered**: No built-in `loading` prop, documenting the external
composition pattern instead (rejected — does not "establish a pattern," just documents the
status quo, leaving Features 08-12 to each decide independently). A separate `<LoadingButton>`
wrapper component (rejected — adds a second public export and decision point for a
single boolean's worth of behavior; contradicts Principle I, Default Over Configure).

---

## Decision 8 — Truncation via existing Tailwind utilities, no new token

**Decision**: The button's text content is wrapped in a `<span>` with Tailwind's built-in
`truncate` utility (`overflow-hidden text-ellipsis whitespace-nowrap`) and `max-w-full`, so
it respects whatever width constraint the button or its container already has.

**Rationale**: Implements FR-014 using utilities already available in Tailwind v4 core (no
plugin, no new CSS custom property) — satisfies FR-002/FR-003's "no new token value"
constraint by construction, since `truncate` is layout-only and introduces no new color or
typography value.

**Alternatives considered**: A fixed `max-width` token (rejected — the spec's Assumptions
explicitly leave exact pixel sizing to implementation detail, and a fixed value would
conflict with the size system already controlling width via padding); CSS `line-clamp`
multi-line wrapping (rejected — the Clarifications session resolved on single-line
truncation, not wrapping).
