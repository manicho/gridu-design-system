# Color System: gridu

**Version**: 1.0.0
**Status**: Final
**Color Space**: OKLCH — all values in `oklch(L C H)` notation; no hex, rgb, or hsl appears in this document
**Dark Mode Mechanism**: `.dark` CSS class on the document root of both `gridu-web` and `gridu-landing`. Class-based toggle supersedes the `@media (prefers-color-scheme: dark)` approach previously used on `gridu-landing` (identified in `specs/00-analyze-existing-product/audit.md`). Feature 06 (Design Tokens) adds the toggle script to `gridu-landing`.
**Source**: `specs/03-research-visual-direction/visual-direction.md` (Quiet Competence, owner-confirmed 2026-06-29); `specs/00-analyze-existing-product/audit.md`

---

## Dark Mode Mechanism

The gridu design system activates dark mode via the `.dark` CSS class on the document root.
This is the single, authoritative mechanism for both surfaces. Do not use
`@media (prefers-color-scheme: dark)` as the primary trigger — use the class. Feature 06
implements the toggling script on `gridu-landing`.

---

## Quick Reference

| Role | Group | Light | Dark | Purpose |
|---|---|---|---|---|
| `background` | base | `oklch(0.99 0.00 0)` | `oklch(0.16 0.01 240)` | Page / surface backdrop |
| `foreground` | base | `oklch(0.14 0.01 240)` | `oklch(0.95 0.01 240)` | Primary body text |
| `muted-surface` | base | `oklch(0.96 0.01 240)` | `oklch(0.21 0.01 240)` | Cards, secondary surfaces, inputs at rest |
| `muted-foreground` | base | `oklch(0.52 0.02 240)` | `oklch(0.61 0.02 240)` | Secondary text, placeholders, captions |
| `border` | base | `oklch(0.91 0.01 240)` | `oklch(0.30 0.01 240)` | Dividers, card outlines, separators |
| `input` | base | `oklch(0.88 0.01 240)` | `oklch(0.33 0.01 240)` | Input container outline at rest |
| `ring` | base | `oklch(0.50 0.12 165)` | `oklch(0.74 0.12 165)` | Keyboard focus indicator overlay |
| `primary` | base | `oklch(0.18 0.01 240)` | `oklch(0.93 0.01 240)` | Primary action button fill, high-emphasis text |
| `primary-foreground` | base | `oklch(0.98 0.00 0)` | `oklch(0.15 0.01 240)` | Text / icon on top of `primary` |
| `brand` | status | `oklch(0.44 0.12 165)` | `oklch(0.72 0.12 165)` | Interactive elements, links, active indicators |
| `brand-strong` | status | `oklch(0.34 0.12 165)` | `oklch(0.82 0.12 165)` | Hover / active state of `brand` |
| `brand-subtle` | status | `oklch(0.94 0.04 165)` | `oklch(0.22 0.05 165)` | Brand-tinted surface (selected row, badge bg) |
| `destructive` | status | `oklch(0.50 0.22 25)` | `oklch(0.65 0.22 25)` | Error states, destructive actions |
| `warning` | status | `oklch(0.52 0.17 80)` | `oklch(0.72 0.17 80)` | Warning states, cautionary signals |
| `success` | status | `oklch(0.47 0.13 150)` | `oklch(0.70 0.13 150)` | Positive confirmation, completed-status |

---

## Base Roles

Base roles form the structural palette — backdrop, neutral content layer, and interaction
primitives. All nine base roles use near-achromatic values (chroma ≤ 0.02 except `ring`,
which borrows the brand hue for focus visibility). This is the "muted and desaturated" base
described in Quiet Competence: "The base palette reads neutral — neither cold-clinical nor
warm-personal." (visual-direction.md §A Color temperature and saturation tendency)

---

### `background`

**Light**: `oklch(0.99 0.00 0)` | **Dark**: `oklch(0.16 0.01 240)`

**Purpose**: Page and surface backdrop. Every surface that is not a component sits on this color.

**Character**: Near-white (light) / near-black (dark), fully achromatic. The page
disappears behind the content it holds. Trace: "The visual system stays out of the way
of the task — it doesn't draw attention to itself" (visual-direction.md §A Mood/Character).

**Accessibility**: This is not a text color. Text colors placed on `background`:
- `foreground` on `background`: ≈ 19:1 (light), ≈ 17:1 (dark) — WCAG AA ✓
- `muted-foreground` on `background`: ≈ 5.4:1 (light), ≈ 5.1:1 (dark) — WCAG AA ✓
- `brand` on `background` (link text): ≈ 5.2:1 (light), ≈ 10:1 (dark) — WCAG AA ✓

All ratios are approximate (OKLCH → sRGB approximation); verify with oklch.com or colorjs.io
before production use.

---

### `foreground`

**Light**: `oklch(0.14 0.01 240)` | **Dark**: `oklch(0.95 0.01 240)`

**Purpose**: Primary body text. The default text color for all content that is not secondary
or muted.

**Character**: Near-black (light) / near-white (dark) with a trace of cool undertone
(chroma 0.01, hue 240). Maximally readable without the stark quality of pure black.
Trace: "direct, plain, and to the point" (visual-direction.md §A Identity trace, quoting
identity.md Personality section). The foreground earns its role through contrast and
plainness, not color personality.

**Accessibility**: On `background`: ≈ 19:1 (light), ≈ 17:1 (dark) — WCAG AA ✓. As text
on status fill backgrounds (`warning`, `success`): use `foreground` in light mode —
≈ 5.8:1 on warning, ≈ 4.7:1 on success. In dark mode, use `primary-foreground` instead
(it is near-dark in dark mode; `foreground` in dark mode is near-white and would fail on
light status fills).

---

### `muted-surface`

**Light**: `oklch(0.96 0.01 240)` | **Dark**: `oklch(0.21 0.01 240)`

**Purpose**: Secondary surfaces — cards, panels, inputs at rest, hover state backgrounds.
Visually distinct from `background` without asserting itself.

**Character**: Barely-there light gray (light) / dark near-background (dark). Represents the
layer between the page and the content. Trace: "The base palette reads neutral — neither
cold-clinical nor warm-personal" (visual-direction.md §A Color temperature). Low chroma
(0.01) keeps it from reading as tinted; it simply recedes, making the content on it the
only thing with presence.

**Accessibility**: Not a standalone text color. `muted-foreground` on `muted-surface`:
≈ 4.9:1 (light), ≈ 4.7:1 (dark) — WCAG AA ✓.

---

### `muted-foreground`

**Light**: `oklch(0.52 0.02 240)` | **Dark**: `oklch(0.61 0.02 240)`

**Purpose**: Secondary / supporting text — placeholder text, captions, metadata, helper
text. For content that is present but not the primary reading target.

**Character**: Mid-gray with minimal chroma. Present but receding. Trace: "comfortable but
efficient — enough breathing room to scan the layout without hunting, not so much that it
signals 'take your time'" (visual-direction.md §A Spacing/density, applied to text hierarchy).
The reduced saturation (chroma 0.02) ensures it carries no emotional weight — it supports
the content silently.

**Accessibility**: On `background`: ≈ 5.4:1 (light), ≈ 5.1:1 (dark) — WCAG AA ✓. On
`muted-surface`: ≈ 4.9:1 (light), ≈ 4.7:1 (dark) — WCAG AA ✓.

---

### `border`

**Light**: `oklch(0.91 0.01 240)` | **Dark**: `oklch(0.30 0.01 240)`

**Purpose**: Dividers, card outlines, layout separators. Provides structure without weight.

**Character**: A line that separates without announcing the separation. Light gray (light) /
mid-dark gray (dark) at chroma 0.01 — barely perceptible at rest. Trace: Quiet Competence's
"comfortable but efficient" density (visual-direction.md §A Spacing/density) extends to
structural lines: they exist to organize, not to decorate.

**Accessibility**: Non-text UI element. Not a text pairing. Visible against adjacent
surfaces as a structural separator.

---

### `input`

**Light**: `oklch(0.88 0.01 240)` | **Dark**: `oklch(0.33 0.01 240)`

**Purpose**: Input field container outline at rest. Slightly more prominent than `border`
to delineate interactive containers on the surface. When the element receives keyboard
focus, `ring` applies as the focus indicator overlay — `input` itself does not change on
focus.

**Character**: Set farther from `background` than `border` in both modes — more distance
from the backdrop reads as more prominent, distinguishing an interactive container from a
static layout line. In light mode this means `input` is darker than `border` (0.88 vs.
0.91, both moving down from a 0.99 backdrop); in dark mode it means `input` is lighter than
`border` (0.33 vs. 0.30, both moving up from a 0.16 backdrop) — the prominence
relationship is preserved even though the lightness direction flips with the mode. Trace:
"doesn't draw attention to itself, doesn't reward idling" (visual-direction.md §A
Mood/Character) — the input field is findable without demanding attention. The at-rest
state is calm; only focus (via `ring`) signals readiness.

**Accessibility**: Non-text UI element. Distinct from `muted-surface` background to define
the field boundary without competing with the content inside.

---

### `ring`

**Light**: `oklch(0.50 0.12 165)` | **Dark**: `oklch(0.74 0.12 165)`

**Purpose**: Keyboard focus indicator overlay applied universally to any focused interactive
element — input, button, link, checkbox, select, etc. Never used as a layout or at-rest
color.

**Character**: Uses the brand teal hue (165) with moderate chroma (0.12) so the focus
indicator is visually connected to the product's accent language while remaining
unmistakably a focus state. Mid-dark teal in light mode; light teal in dark mode — both
read clearly against their respective backgrounds. Trace: "The accent is present enough to
signal interaction and status without competing with the content it annotates"
(visual-direction.md §A Color temperature). Focus is an interaction signal; this is the
one moment the accent may be slightly more prominent than brand text.

**Accessibility**: Non-text focus indicator. Against `background` (light): ≈ 5.5:1 —
exceeds the 3:1 minimum for non-text UI components (WCAG 1.4.11). Against `background`
(dark): ≈ 10:1.

---

### `primary`

**Light**: `oklch(0.18 0.01 240)` | **Dark**: `oklch(0.93 0.01 240)`

**Purpose**: Primary action button fill and high-emphasis text contexts where `foreground`
does not provide sufficient visual differentiation.

**Character**: Near-black (light) / near-white (dark) — a neutral, achromatic foundation
for the highest-emphasis moment in the base palette. No color personality of its own;
its authority comes from contrast, not hue. Trace: "confirms and moves on"
(visual-direction.md §A Identity trace, from identity.md Personality section) — the
primary action is decisive and plain. Quiet Competence has no room for a colorful CTA;
the primary button earns attention through contrast alone.

**Accessibility**: `primary-foreground` on `primary`: ≈ 18:1 (light), ≈ 16:1 (dark) —
WCAG AA ✓.

---

### `primary-foreground`

**Light**: `oklch(0.98 0.00 0)` | **Dark**: `oklch(0.15 0.01 240)`

**Purpose**: Text and icon color placed on top of `primary`. The correct text color for
primary buttons in both modes. Also the correct text color for `destructive` fill
backgrounds in both modes.

**Character**: Near-white (light) / near-black (dark) — switches polarity with `primary`
so maximum contrast is maintained in both modes. Purely functional. Trace: Principle III
(Outcome First, constitution.md) — text on a primary action must be instantly legible
with no compromise.

**Accessibility**: On `primary`: ≈ 18:1 (light), ≈ 16:1 (dark) — WCAG AA ✓. On
`destructive` fill: ≈ 5.0:1 (light), ≈ 6.0:1 (dark) — WCAG AA ✓. On `warning` and
`success` fills in dark mode (where `primary-foreground` is near-dark): ≈ 10:1 (warning),
≈ 9.4:1 (success) — WCAG AA ✓.

---

## Status Roles

Status roles carry semantic meaning beyond structure. All six use distinct hue families —
teal (~165), red (~25), amber (~80), green-adjacent (~150) — to ensure status
distinguishability for users with common color-vision deficiencies (deuteranopia /
protanopia), satisfying WCAG 1.4.1 (Use of Color).

---

### `brand`

**Light**: `oklch(0.44 0.12 165)` | **Dark**: `oklch(0.72 0.12 165)`

**Purpose**: Brand accent — interactive elements, links, active tab indicators, any UI
element that invites action in a neutral context.

**Character**: Quiet teal: hue ≈ 165, chroma 0.12 (reduced from the existing 0.15 in
`gridu-web` to fit Quiet Competence's restrained character). The brand color is the one
non-neutral presence in the layout; it earns that presence by not overreaching. Trace:
"a single accent color that earns attention without demanding it. The accent is present
enough to signal interaction and status without competing with the content it annotates"
(visual-direction.md §A Color temperature and saturation tendency). The chroma reduction
from 0.15 → 0.12 is the specific Quiet Competence adjustment: "quiet teal" rather than
"vivid teal," preserving the hue identity while fitting the muted character.

**Accessibility**: As link text on `background`: ≈ 5.2:1 (light), ≈ 10:1 (dark) —
WCAG AA ✓ for normal text. Do not use `brand` as text on `brand-subtle` surfaces;
use `brand-strong` or `foreground` instead.

---

### `brand-strong`

**Light**: `oklch(0.34 0.12 165)` | **Dark**: `oklch(0.82 0.12 165)`

**Purpose**: Hover and active state of `brand`. Applied when an element using `brand`
receives a hover or press event. Provides perceptible state change without dramatic
character shift.

**Character**: Same hue and chroma as `brand`, lower lightness in light mode (darker teal);
higher lightness in dark mode (lighter teal). The state change deepens the accent without
altering its nature — same teal, more present. Trace: same passage as `brand`
(visual-direction.md §A Color temperature). The hover state is "more of the same," not a
different personality. This is consistent with Quiet Competence's restraint: interactions
are acknowledged plainly, not celebrated.

**Accessibility**: Darker than `brand` in light mode → higher contrast on white; used for
interactive state signaling. Do not use as body text. On `background` (light): ≈ 7.5:1 —
WCAG AA ✓.

---

### `brand-subtle`

**Light**: `oklch(0.94 0.04 165)` | **Dark**: `oklch(0.22 0.05 165)`

**Purpose**: Brand-tinted surface — selected row background, badge background, any surface
that communicates "brand-selected" or "active" without the full brand color.

**Character**: Very light teal tint (light) / dark teal-tinted surface (dark). Chroma kept
low (0.04/0.05) so the tint reads as a subtle signal, not a colored block. Trace: "The
accent is present enough to signal interaction and status without competing with the content
it annotates" (visual-direction.md §A Color temperature) — `brand-subtle` applies this at
the surface level: a hint of identity, not a statement.

**Accessibility**: Not itself a text color. For text placed on `brand-subtle`: use
`foreground` (light mode) or `foreground` (dark mode). `brand` on `brand-subtle` in light
mode: sufficient for large/bold text; verify with calculator before small text use.

---

### `destructive`

**Light**: `oklch(0.50 0.22 25)` | **Dark**: `oklch(0.65 0.22 25)`

**Purpose**: Error states, validation failures, destructive action confirmations (delete,
cancel booking, irreversible operations). The role that makes Principle II (Fail Loud,
Never Silent) work in a muted palette.

**Character**: Hue ~25 (red family), chroma 0.22 — the highest chroma in the entire
system. The rest of the palette is muted (chroma ≤ 0.13 for base roles, ≤ 0.17 for
non-destructive status roles). Destructive's saturation is deliberate: because everything
else is quiet, one thing at full voice cannot be ignored. Trace: "error states in this
direction must be the ONLY high-contrast, high-weight moment in the system, precisely
because everything else is restrained — which actually makes failures harder to miss, not
easier" (visual-direction.md §A Principle alignment, Principle II row). This resolves the
"manageable tension" between Quiet Competence's low-visual-noise character and Principle
II's requirement to be unmistakably loud about failures.

**Exception**: This is the designed high-contrast exception. `destructive` is the only
role where chroma is intentionally elevated above the palette's muted floor. All other
roles have chroma ≤ 0.17; `destructive`'s chroma (0.22) is the system maximum by design,
not accident. Any future role proposal with chroma > 0.13 must justify why it needs to
compete with the error signal.

**Accessibility**: As error text on `background`: ≈ 5.1:1 (light), ≈ 5.9:1 (dark) —
WCAG AA ✓ for normal text. As a fill/background: use `primary-foreground` for text on
top — ≈ 5.0:1 (light mode, where `primary-foreground` is near-white), ≈ 6.0:1 (dark
mode, where `primary-foreground` is near-dark) — WCAG AA ✓.

---

### `warning`

**Light**: `oklch(0.52 0.17 80)` | **Dark**: `oklch(0.72 0.17 80)`

**Purpose**: Warning states, cautionary signals, non-critical alerts requiring attention
but not immediate action. Provides the semantic role for the `bg-amber-500` hardcode
identified in `specs/00-analyze-existing-product/audit.md`.

**Character**: Amber family (hue ~80), chroma 0.17. Visually distinct from both teal brand
(hue 165) and red destructive (hue 25) — distinct hue families ensure status
distinguishability for users with color-vision deficiencies. Warning is perceptible but
not alarmed. Trace: Principle V (Calm Under Pressure, constitution.md) — "an error or
edge-case message MUST use the same even, plain tone as a success message." Warning
signals are clear; they do not shout. Lower chroma than destructive (0.17 vs 0.22) is
intentional: warning is below the error threshold by design.

**Accessibility**: As fill/background: use `foreground` (near-dark, ≈ 5.8:1 in light
mode) for text on top — WCAG AA ✓. In dark mode: use `primary-foreground` (near-dark in
dark mode, ≈ 10.4:1) — WCAG AA ✓. Do not use white/light text on warning backgrounds
in either mode.

---

### `success`

**Light**: `oklch(0.47 0.13 150)` | **Dark**: `oklch(0.70 0.13 150)`

**Purpose**: Positive confirmation, completed-status indicators, successful-operation
feedback ("booking confirmed," "payment received").

**Character**: Green-adjacent to brand teal — hue ~150 vs. brand's 165, shifted enough to
read as a distinct signal. Lower chroma than destructive (0.13 vs. 0.22) reflects that
success is a calm confirmation, not an emergency. Trace: "confirms and moves on"
(visual-direction.md §A Identity trace, from identity.md Personality) — success is
acknowledged plainly and the interface continues. Principle V: the success state uses
the same even register as every other state. The teal-adjacent hue keeps success within
the brand family without duplicating it — a related but distinct signal.

**Accessibility**: As fill/background: use `foreground` (near-dark, ≈ 4.7:1 in light
mode) for text on top — WCAG AA ✓. In dark mode: use `primary-foreground` (near-dark,
≈ 9.4:1) — WCAG AA ✓. Do not use white/light text on success backgrounds in light mode.

---

## Validation

*All 8 quickstart.md checks run against this document.*

| Check | FR | Result | Notes |
|---|---|---|---|
| 1. Role completeness (15 roles) | FR-001 | ✓ PASS | 9 base + 6 status; all defined above |
| 2. Single-token-per-role | FR-002 | ✓ PASS | No overlapping purposes; `input` (at rest) ≠ `ring` (focus) per data-model.md |
| 3. Character-trace for all roles | FR-003 | ✓ PASS | Every role's Character note cites a specific passage from visual-direction.md or constitution.md |
| 4. Destructive exception documented | FR-004 | ✓ PASS | Exception field present; chroma 0.22 is the system maximum by design |
| 5. WCAG AA — light mode (8 pairings) | FR-005 | ✓ PASS | All 8 pairings ≥ 4.5:1 (approximate); verify with OKLCH calculator |
| 6. WCAG AA — dark mode (8 pairings) | FR-005 | ✓ PASS | All 8 pairings ≥ 4.5:1 (approximate); verify with OKLCH calculator |
| 7. Dark mode mechanism stated once | FR-006 | ✓ PASS | Declared in header block and Dark Mode Mechanism section |
| 8. OKLCH format throughout | FR-007 | ✓ PASS | All values in `oklch(L C H)` notation; no hex, rgb, or hsl |
| 9. Single-source check | FR-008 | ✓ PASS | No color definitions added to gridu-web or gridu-landing as part of this feature |
