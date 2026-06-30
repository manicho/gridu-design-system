# Data Model: Define Color System

## Entities

### Semantic Color Role

Represents one named color slot in the system. A role is the atom of the color system —
it is what component authors reference, not raw values.

| Field | Type | Required | Description |
|---|---|---|---|
| `name` | string | yes | Kebab-case token name (e.g. `muted-surface`, `destructive`) |
| `group` | enum | yes | `base` or `status` (per research.md Decision 2) |
| `purpose` | string | yes | One sentence: what UI elements use this role and why |
| `light_value` | OKLCH string | yes | Lightness Chroma Hue, e.g. `oklch(0.96 0.03 165)` |
| `dark_value` | OKLCH string | yes | OKLCH value for dark mode (`.dark` class active) |
| `character_note` | string | yes | How this value expresses the Quiet Competence direction; traceable to `visual-direction.md` or `identity.md` |
| `accessibility_note` | string | yes | Contrast pairings this role participates in; WCAG AA ratio stated |
| `exception_note` | string | only for destructive | Documents that this is the designed high-contrast exception (FR-004); required for the destructive role only |

**Complete role set** (15 roles, from research.md Decision 2):

Base group:
- `background` — page/surface backdrop
- `foreground` — primary body text
- `muted-surface` — secondary surfaces, cards, inputs at rest, hover backgrounds
- `muted-foreground` — secondary/supporting text, placeholder text, captions
- `border` — dividers, card outlines, input outlines at rest
- `input` — input field container outline at rest (distinct from `border`; when an input element receives focus, `ring` applies as the focus indicator overlay)
- `ring` — keyboard focus indicator overlay applied universally to any focused interactive element (input, button, link, etc.); never used as a layout or at-rest color
- `primary` — high-emphasis text, primary action button fill
- `primary-foreground` — text/icon color on top of `primary`

Status group:
- `brand` — brand accent; interactive elements, links, active indicators
- `brand-strong` — brand at higher contrast; hover/active state of `brand`
- `brand-subtle` — brand tint background; brand-tinted surface (e.g., selected row, badge background)
- `destructive` — error states, destructive actions, the designed high-contrast exception
- `warning` — warning states, cautionary signals (replaces `bg-amber-500` hardcode)
- `success` — positive confirmation, completed-status indicators

---

### Color System

Represents the complete color system document as a unit.

| Field | Type | Required | Description |
|---|---|---|---|
| `version` | string | yes | Semantic version of this color system (starts at `1.0.0`) |
| `status` | enum | yes | `Draft` → `Final` (2-state; no owner-confirmation gate needed — direction was confirmed in Feature 03) |
| `color_space` | string | yes | `OKLCH` — normative declaration per FR-007 |
| `dark_mode_mechanism` | string | yes | `.dark` CSS class — normative declaration per FR-006 (research.md Decision 1) |
| `roles` | Role[] | yes | The complete ordered list of Semantic Color Roles |
| `source` | string | yes | Trace to `visual-direction.md` and `audit.md` as upstream inputs |

---

## State Lifecycle

```
Draft → Final
```

Unlike Feature 03 (which required a 3-state lifecycle with owner confirmation at the
"provisional recommendation" gate), Feature 04's deliverable does not require a mid-stream
owner decision: the color direction (Quiet Competence) was already confirmed. The feature
implements that decision; it does not propose a new one.

**Draft**: `color-system.md` is being written; token values may change.
**Final**: All 15 roles defined with OKLCH values, character notes, and WCAG AA
confirmation. All quickstart.md checks pass. Status updated in the document header.
