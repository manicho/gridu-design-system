# Data Model: Analyze Existing Product

This feature's "entities" are the structural building blocks of the audit document, not
runtime data — there is no database or API behind this feature. Documented here so
`audit.md` has a consistent internal structure and downstream features can rely on it.

## Surface

A consumer-facing product surface in scope for this audit.

| Field | Description |
|---|---|
| `name` | One of: `gridu-web`, `gridu-landing` |
| `stack` | The rendering stack (e.g. "React 19 + Vite + shadcn/ui", "Astro") |
| `findings` | Ordered list of `Finding` entries, grouped by category |

Out of scope: the `gridu` API repo (no visual surface).

## Finding

A single documented fact about a surface's current visual state.

| Field | Description |
|---|---|
| `category` | One of: `color`, `typography`, `spacing`, `component` |
| `description` | The fact itself (e.g. "primary action buttons use `slate-900` background") |
| `value` | The concrete value observed (hex code, px/rem value, font stack, variant name) |
| `source` | File or config path the value was read from (FR-008) |
| `surface` | Which `Surface` this finding belongs to |

## Inconsistency

A pairing of findings that represent the same design concept styled differently.

| Field | Description |
|---|---|
| `concept` | The shared concept being styled (e.g. "primary button color") |
| `findings` | Two or more `Finding` references that disagree |
| `description` | Plain-language statement of the mismatch |

Relationship: every `Inconsistency` references existing `Finding` entries — it does not
introduce new values of its own.

## Gap

An explicitly named absence relative to having a real design system.

| Field | Description |
|---|---|
| `description` | The missing thing (e.g. "no documented type scale shared by both surfaces") |
| `derived_from` | One or more `Finding` or `Inconsistency` entries this gap follows from |

Relationship: every `Gap` must trace back to at least one `Finding` or `Inconsistency` (SC-002)
— gaps are not asserted from general knowledge of what design systems usually have.

## State

This document has no state transitions — it is a single Draft → Final artifact, finalized
when `/speckit-implement` produces `audit.md` and it passes the spec's Success Criteria.
