# Data Model: Define Typography System

## Entities

### Semantic Text Role

Represents one named text slot in the system. A role is the atom of the typography system —
it is what component authors reference, not raw font properties.

| Field | Type | Required | Description |
|---|---|---|---|
| `name` | string | yes | Kebab-case role name (e.g. `body-secondary`, `numeric-tabular`) |
| `purpose` | string | yes | One sentence: what text content uses this role and why |
| `font_family` | string | yes | Always `Inter` (with fallback stack) per research.md Decision 1 |
| `weight` | number | yes | 400, 500, 600, or 700 — never below 400 or above 700 (Decision 3) |
| `size` | rem value | yes | Equivalent px noted alongside; must satisfy the FR-005 floor |
| `line_height` | number | yes | Unitless ratio (e.g. `1.5`) |
| `letter_spacing` | em value | yes | `0` unless explicitly tightened (headings) or opened (caption) |
| `character_note` | string | yes | How this value expresses the Quiet Competence direction; traceable to `visual-direction.md` or `identity.md` |
| `overflow_behavior` | enum | yes | `wrap` (default) or `truncate-optional` (Decision 4); only `label` may be `truncate-optional` |
| `numeric_feature` | string | only for `numeric-tabular` | `font-variant-numeric: tabular-nums lining-nums` (Decision 4) |

**Complete role set** (8 roles, from research.md Decision 2 and Decision 3):

- `heading-page` — page-level title (e.g. dashboard page header)
- `heading-section` — section-level heading within a page
- `heading-subsection` — subsection heading, card title
- `body-default` — primary reading text, paired with the `foreground` color role (Feature 04)
- `body-secondary` — secondary/supporting text, paired with the `muted-foreground` color role
- `label` — text on or naming an interactive element (form field, button, badge)
- `caption` — smallest informational text — metadata, helper text, fine print
- `numeric-tabular` — standalone numeric displays (price, count, duration) needing fixed digit widths

---

### Typography System

Represents the complete typography system document as a unit.

| Field | Type | Required | Description |
|---|---|---|---|
| `version` | string | yes | Semantic version of this typography system (starts at `1.0.0`) |
| `status` | enum | yes | `Draft` → `Final` (2-state; no owner-confirmation gate needed — direction was confirmed in Feature 03) |
| `typeface` | string | yes | `Inter` — normative declaration per FR-004 (research.md Decision 1) |
| `fallback_stack` | string | yes | `ui-sans-serif, system-ui, -apple-system, sans-serif` |
| `minimum_size_floor` | string | yes | `12px (0.75rem)` general floor, `14px (0.875rem)` for `body-default` — normative declaration per FR-005 |
| `roles` | Role[] | yes | The complete ordered list of Semantic Text Roles |
| `source` | string | yes | Trace to `visual-direction.md`, `color-system.md`, and `audit.md` as upstream inputs |

---

## State Lifecycle

```
Draft → Final
```

Mirrors Feature 04's lifecycle: no mid-stream owner-confirmation gate is required because
the typographic direction (Quiet Competence) and the typeface continuity decision were
already groundable in confirmed upstream documents. The feature implements those decisions
into a complete scale; it does not propose a new direction.

**Draft**: `typography-system.md` is being written; role values may change.
**Final**: All 8 roles defined with family, weight, size, line-height, letter-spacing,
character notes, and overflow behavior. All quickstart.md checks pass. Status updated in
the document header.
