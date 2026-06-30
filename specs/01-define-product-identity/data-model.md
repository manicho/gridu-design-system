# Data Model: Define Product Identity

This feature's "entities" are the structural building blocks of `identity.md`, not runtime
data — there is no database or API behind this feature.

## Purpose Statement

| Field | Description |
|---|---|
| `statement` | A single, concrete sentence (or short paragraph) stating why gridu exists for its users |

Constraint: must describe user value, not a feature list (FR-001).

## Brand Value

| Field | Description |
|---|---|
| `name` | A short label for the value |
| `meaning` | A concrete description of what the value means in practice — not just the label restated |

Constraint: 3-5 values total (FR-002). Relationship: each `Personality Trait` should be
explicable as an expression of one or more `Brand Value` entries, though this feature does
not require an explicit cross-reference field — the link is for the author's own consistency
check, not a structural requirement.

## Personality Trait

| Field | Description |
|---|---|
| `description` | A specific, distinguishing characteristic of gridu "as a person" |

Constraint: specific enough to distinguish gridu from a generic "friendly and professional"
description (FR-003) — e.g. how it reacts to its own mistakes, how formal/casual it is.
Explicitly excludes voice/tone style-guide details (banned words, emoji rules, example
phrases) per research.md.

## Target Persona

| Field | Description |
|---|---|
| `identity` | Who this person is (role, type of business) |
| `context` | Their situation/constraints relevant to using gridu (e.g. technical comfort, daily workload) |
| `needs` | What they need from gridu |

Constraint: exactly one primary persona for this feature (FR-004, Assumptions) — multiple
personas are out of scope.

## State

Single Draft → Final artifact, finalized when `/speckit-implement` produces `identity.md`
and it passes the spec's Success Criteria (validated via `quickstart.md`).
