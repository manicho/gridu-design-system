# Phase 0 Research: Component-Level Accessibility Audit

## Decision 1: Contrast verification method

**Decision**: Compute exact WCAG contrast ratios with a throwaway Node script that converts
each `tokens.css` OKLCH value to linear sRGB, then to relative luminance, then applies the
standard WCAG contrast-ratio formula `(L1 + 0.05) / (L2 + 0.05)`. The script is not shipped
as a dependency or a permanent repo script — it lives only as a one-off audit tool, with its
output (the exact ratios) captured in `findings.md`.

**Rationale**: `specs/04-define-color-system/color-system.md` already documents *approximate*
ratios for its original 8 pairings with an explicit unresolved caveat ("verify with OKLCH
calculator"). Re-deriving exact values from the same OKLCH source-of-truth `tokens.css`
already uses is the most direct way to close that gap, and costs zero new dependencies —
consistent with every prior feature's "zero new dependency unless justified" pattern (e.g.
Chart's Decision 1 rejecting a charting library). An OKLCH→sRGB conversion is a well-known,
short, pure-math formula (Björn Ottosson's reference implementation) — not enough surface
area to justify a package.

**Alternatives considered**:
- **axe-core / jest-axe**: Industry-standard automated a11y testing library, would also catch
  ARIA issues. Rejected as a new *dependency* for this feature specifically because contrast
  is the one axis this repo has an already-documented, already-scoped gap for (Feature 04's
  caveat) — solving it with hand-computed exact math is scoped and sufficient. Revisit as a
  permanent CI dependency is a separate future decision (spec Assumptions), not bundled into
  this audit.
- **Manual eyeballing / browser DevTools contrast picker**: Faster but imprecise and not
  reproducible or recordable in `findings.md` with an exact ratio — insufficient for a
  written audit trail (spec FR-005).

## Decision 2: Keyboard/focus verification method

**Decision**: Two-part verification — (a) automated: `@testing-library/react` +
`@testing-library/user-event`'s `tab()` helper drives keyboard traversal in each component's
existing `*.test.tsx`, asserting focus lands on every interactive element in DOM order and
that `toHaveFocus()` passes; (b) manual: each component's `playground/main.tsx` section is
tab-traversed in an actual browser to visually confirm the `focus-visible` ring renders and
is not clipped/hidden by a parent's `overflow` or `z-index`.

**Rationale**: jsdom (Vitest's DOM environment) executes focus/tab order correctly but does
not render CSS, so it cannot itself confirm a focus ring is *visible* — only that focus
*moved* to the right element. The two-part split matches what's actually testable in each
environment rather than pretending jsdom coverage is sufficient alone.

**Alternatives considered**:
- **Playwright/visual browser test suite**: Would make the visual check automated and
  repeatable. Rejected as out of scope — this repo has no existing browser-automation
  dependency or CI job, and introducing one is a bigger decision than this audit's scope
  (would need its own spec/plan under the constitution's "Default Over Configure").

## Decision 3: ARIA semantics verification method

**Decision**: `@testing-library/react`'s role-based queries (`getByRole` with accessible
name matching) plus `toHaveAccessibleName()`/`toHaveAttribute()` assertions in each
component's `*.test.tsx`, checked against the WAI-ARIA Authoring Practices Guide (APG)
pattern for each component's closest native role (button, textbox, group/region, table,
navigation landmark, img for Chart).

**Rationale**: Testing Library's role queries fail loudly when a role/name/state doesn't
resolve the way a screen reader would compute it (same accessibility-tree resolution logic
browsers use) — this is the same method every existing component test already uses (e.g.
`table.test.tsx` already asserts `aria-sort`), so extending it is consistent with the
existing test convention rather than introducing a second verification method.

**Alternatives considered**:
- **Live screen reader pass (VoiceOver/NVDA)**: More authoritative for final confirmation.
  Used as a spot-check per spec Assumptions ("standard combination... rather than exhaustive
  AT/browser matrix testing"), not as the primary recorded-evidence method, since it isn't
  reproducible/scriptable for the findings report.

## Decision 4: "Stories" scope (spec input's wording)

**Decision**: This repo has no Storybook; the equivalent surfaces are (a) each component's
`playground/main.tsx` section (visual/interactive permutations) and (b) each component's
`README.md` (documented usage + token mapping). The spec's FR-006/FR-008 references to
"stories" map to these two surfaces.

**Rationale**: Direct inspection of `package.json` confirms no `@storybook/*` dependency
exists; `playground/main.tsx` + per-component `README.md` are this repo's actual established
"living example" pattern (every prior feature's plan lists a playground permutation as part
of its deliverable).

## Decision 5: Findings report format

**Decision**: A single `findings.md` in this feature's spec directory, one section per
component, each with a small table: criterion | check performed | result | fix (if any).

**Rationale**: Matches FR-005 (per-component record) and FR-009 (durable, committed to the
repo) directly; a single file is easier to scan for "is component X done" than six separate
files, and keeps the audit's Phase 1 output consistent with how `data-model.md` documents the
Findings Report entity.
