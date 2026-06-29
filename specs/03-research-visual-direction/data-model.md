# Data Model: Research Visual Direction

This feature's "entities" are the structural building blocks of `visual-direction.md`, not
runtime data.

## Visual Direction Candidate

| Field | Description |
|---|---|
| `name` | A short, memorable label for the candidate |
| `mood` | Overall character/feeling, in prose |
| `color_tendency` | Color temperature and saturation tendency, in prose (no hex values) |
| `type_character` | Typographic character, in prose (no typeface names/sizes) |
| `density` | Spacing/density character, in prose (no spacing scale numbers) |
| `imagery` | Imagery character, in prose |
| `identity_trace` | Which value, personality trait, or the purpose statement in
  `identity.md` this candidate expresses |

Constraint: 2-3 candidates total (FR-001).

## Principle Alignment Note

| Field | Description |
|---|---|
| `principle` | Which of the constitution's 5 principles is being checked |
| `result` | Aligned, or in tension — stated explicitly either way |
| `reasoning` | Why this candidate aligns or creates tension with this principle |

Relationship: every `Visual Direction Candidate` has exactly 5 `Principle Alignment Note`
entries — one per constitutional principle (FR-004), regardless of whether the candidate is
ultimately recommended.

## Recommendation

| Field | Description |
|---|---|
| `chosen_candidate` | Which `Visual Direction Candidate` is recommended |
| `rationale` | Why this one was chosen over the others |
| `confirmation_status` | Provisional (default) until the project owner explicitly confirms
  it, per research.md's decision |

## State

Draft → Owner-Confirmed → Final. Unlike Features 00-02 (which finalize on passing
`quickstart.md` alone), this feature adds an explicit owner-confirmation state before Final,
because the Recommendation is a subjective, customer-facing creative choice (see spec
Assumptions, research.md).
