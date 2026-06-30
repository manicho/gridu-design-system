# Data Model: Define Design Principles

This feature's "entities" are the structural building blocks of `principles.md`, not runtime
data.

## Design Principle

| Field | Description |
|---|---|
| `name` | A short, memorable label for the principle |
| `statement` | The normative MUST/SHOULD statement itself |
| `identity_trace` | Which value or personality trait in `identity.md` this derives from |
| `example` | A concrete design/product decision this principle resolves |

Constraint: 4-6 principles total (FR-001, spec Assumptions: target not hard ceiling).

## Identity Trace

| Field | Description |
|---|---|
| `source` | The specific value name or personality trait being referenced (must match `identity.md` wording) |

Relationship: every `Design Principle` has exactly one primary `Identity Trace` (FR-002). A
principle may be reinforced by more than one value, but only the primary trace is required.

## Example Decision

| Field | Description |
|---|---|
| `scenario` | A concrete hypothetical design/product choice |
| `resolution` | How the principle resolves it |

Relationship: every `Design Principle` has at least one `Example Decision` (FR-004).

## State

Single Draft → Final artifact, finalized when `/speckit-implement` produces `principles.md`
and it passes the spec's Success Criteria (validated via `quickstart.md`). A later, separate
step (`/speckit-constitution`, outside this feature's scope) reads the Final document to
populate `.specify/memory/constitution.md`.
