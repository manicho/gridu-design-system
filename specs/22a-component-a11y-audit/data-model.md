# Phase 1 Data Model: Component-Level Accessibility Audit

This feature has no runtime/persisted data model — it audits UI components, not application
state. The two "entities" below are documentation artifacts, not code.

## Findings Report

One `findings.md` file in this feature's spec directory. Structure: one section per
Component (see below), each containing one row per criterion checked.

| Field | Type | Description |
|---|---|---|
| Component | enum | One of: Button, Field (Input), Card, Table, Navigation, Chart |
| Criterion | enum | One of: Contrast, Keyboard Focus, ARIA Semantics |
| Check performed | text | What was measured/tested and how (references research.md's method per criterion) |
| Result | enum | Pass / Fixed / Deferred |
| Detail | text | Exact measurement (e.g. computed contrast ratio) or fix description; if Deferred, the reason and what decision would resolve it (spec FR-007) |

**Validation rules**:
- Every Component × Criterion combination MUST have exactly one row (FR-001-FR-004: 6
  components × 3 criteria = 18 rows minimum; a component may need more than one row per
  criterion if it has multiple distinct interactive states, e.g. Button's icon-only vs.
  text mode).
- `Result: Deferred` MUST have a non-empty reason in `Detail` (FR-007).
- `Result: Fixed` SHOULD reference the file changed (component source, `tokens.css`, or
  test) so the fix is traceable from the report.

## Component (audit subject, not a new entity — existing code)

| Field | Description |
|---|---|
| Name | One of the six published components (matches `src/components/<name>/`) |
| Source file | e.g. `src/components/button/button.tsx` |
| Test file | e.g. `src/components/button/button.test.tsx` |
| Token roles used | The `tokens.css` color/typography roles the component's classes resolve to (used to scope which token pairings need contrast verification) |

No state transitions, no persistence, no relationships beyond "Findings Report has many rows,
each referencing one Component."
