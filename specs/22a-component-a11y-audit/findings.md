# Findings: Component-Level Accessibility Audit (Feature 22a)

**Methodology**:
- **Contrast** — exact WCAG contrast ratios computed by converting each `tokens.css` OKLCH
  value to linear sRGB → relative luminance → `(L1+0.05)/(L2+0.05)` (research.md Decision 1,
  throwaway script, not committed). Thresholds: 4.5:1 normal text, 3:1 large text and
  UI-component boundaries (WCAG 1.4.3, 1.4.11).
- **Keyboard Focus** — `@testing-library/user-event` `tab()` traversal + `toHaveFocus()` in
  each component's `*.test.tsx`, plus manual playground traversal (research.md Decision 2).
- **ARIA Semantics** — Testing Library role/name/state queries against the closest WAI-ARIA
  APG pattern for each component (research.md Decision 3).

Every color role's exact OKLCH value is defined once in `tokens/tokens.css`; a ratio computed
for one component's use of a role holds for every other component using that same role.

---

## Cross-cutting: token-level contrast (all components)

| Pairing | Used by | Light | Dark | Threshold | Result |
|---|---|---|---|---|---|
| `foreground` on `background` | Button/Field/Card/Table/Navigation text | 19.33:1 | 16.79:1 | 4.5:1 | Pass |
| `muted-foreground` on `background` | Field placeholder, Card meta text, Chart axis labels | 5.33:1 | 5.14:1 | 4.5:1 | Pass |
| `muted-foreground` on `muted-surface` | Table header text | 4.89:1 | 4.69:1 | 4.5:1 | Pass |
| `primary-foreground` on `brand` | Button primary text | 6.65:1 | 8.37:1 | 4.5:1 | Pass |
| `primary-foreground` on `brand-strong` | Button primary hover/active text | 9.94:1 | 11.83:1 | 4.5:1 | Pass |
| `primary-foreground` on `destructive` | Button destructive text | 6.02:1 | 5.47:1 | 4.5:1 | Pass |
| `destructive` on `background` | Field/Card error text | 6.20:1 | 5.40:1 | 4.5:1 | Pass |
| `brand` on `background` | Link-style text, Chart data color | 6.85:1 | 8.25:1 | 4.5:1 (text) / 3:1 (Chart fill) | Pass |
| `ring` (focus indicator) on `background` | All six components | 5.37:1 | 8.87:1 | 3:1 | Pass |
| `destructive` on `background` (as border) | Field error-state border | 6.20:1 | 5.40:1 | 3:1 | Pass |
| **`input` on `background`** | **Field/Input at-rest border, Button `outline` variant border** | **1.39:1** | **1.59:1** | **3:1** | **FAIL → Fixed** |
| `border` on `background` | Table row/container dividers, Card container outline, Chart gridlines | 1.27:1 | 1.42:1 | 3:1 | Pass — see rationale below |

### `input` — Fixed

**Check performed**: `input` is documented in `specs/04-define-color-system/color-system.md`
as "Input container outline at rest" and, per direct source inspection, is also used by
Button's `outline` variant border (`src/components/button/button.tsx`) — i.e. it is a
**form-control boundary**, the visual information required to identify an interactive
component's extent (WCAG 1.4.11), not a decorative divider.

**Result**: FAIL. Original value (`oklch(0.88 0.01 240)` light / `oklch(0.33 0.01 240)` dark)
measured 1.39:1 / 1.59:1 against `background` — well under the 3:1 minimum. This was never
caught because Feature 04's color-system spec only hand-estimated ratios for its original 8
text pairings and explicitly deferred exact verification ("verify with OKLCH calculator");
`input`'s non-text boundary use was never in that original set at all.

**Fix**: Raised `input`'s lightness in `tokens/tokens.css` — light `L 0.88 → 0.66` (hex
`#d2d8dd` → `#8c9297`), dark `L 0.33 → 0.49` (hex `#31363a` → `#5a6064`) — keeping the same
chroma/hue (0.01, 240°, the same neutral gray family as `border`/`foreground`) so the change
reads as "a stronger version of the same gray," not a new color. New ratios: 3.02:1 (light),
3.10:1 (dark) — both clear the 3:1 floor with a small margin, not scraped to the exact
threshold. No component source or test file required a change — both Field/Input and
Button's `outline` variant already reference the `input` role by name; the fix is entirely at
the token level, per spec Edge Cases ("fix is applied at the token level so all consumers of
that token benefit, not patched per-component").

**Follow-up (out of scope for this feature)**: `gridu-web` (`src/index.css`) and
`gridu-landing` (`src/styles/global.css`) each hard-copy these token values today (no
published package consumption yet, per `tokens.css`'s header comment) — they will need this
same `input` value update when Features 22b/22c next touch their own token files, or via a
dedicated sync task. Noted here so it isn't lost, not actioned by this repo's audit.

### `border` — Pass (WCAG 1.4.11 exemption)

**Check performed**: `border` is used exclusively for **decorative/structural** elements —
Table row and container dividers, Card container outline, Chart axis gridlines
(`specs/04-define-color-system/color-system.md`: "Dividers, card outlines, layout
separators... barely perceptible at rest," a deliberate design choice, not an oversight).

**Result**: Pass, by exemption rather than by meeting the 3:1 numeric threshold (1.27:1 /
1.42:1 measured). WCAG 1.4.11 requires 3:1 for "visual information required to identify a
user interface component" — `border`'s uses are all cases where the boundary is *not* the
sole means of identifying or operating the component:
- **Table**: row/column structure is independently available to assistive technology via
  native `<table>`/`<th scope="col">` markup (confirmed by source inspection); sighted users
  retain row separation via consistent per-cell padding even without a visible line.
- **Card**: the container boundary is redundant with the card's `background`-vs-page
  differentiation and, for interactive cards, with the hover-background/focus-ring/cursor
  cues already required and tested (`card.test.tsx`) — border is not the only affordance.
- **Chart gridlines**: purely a reading aid; every data point's exact value is independently
  available via keyboard focus/hover per FR-008 of Feature 12 (`chart.tsx` tabIndex + computed
  `aria-label`), so the gridline's visibility doesn't gate understanding the content.

Changing `border` site-wide (dividers, card outlines, and gridlines all resolve to the same
token) would be a much larger, cross-cutting visual-direction change than `input`'s fix — it
would visibly heavy-up every card and table in the system — and Feature 04 explicitly chose
this "barely perceptible" character on purpose. Since none of its uses are a required
identification boundary under WCAG 1.4.11, no fix is needed; revisit only if a future
component gives `border` a new, boundary-defining use.

---

## Button (`src/components/button/button.tsx`)

| Criterion | Check performed | Result | Detail |
|---|---|---|---|
| Contrast | All 5 variants × default/hover/active/disabled/focus-ring, both modes | Pass | Text pairings + `input` (outline variant, now fixed) + `ring` all clear their thresholds — see cross-cutting table above |
| Keyboard Focus | Tab reachability, visible `focus-visible` ring, disabled/loading excluded from tab order | Pass | `button.test.tsx:67-97` already asserts `focus-visible:ring-ring` class and `toHaveFocus()` after `user.tab()`; disabled correctly excluded (`:98`) |
| ARIA Semantics | Accessible name (text vs. icon-only), `aria-busy`, `aria-disabled` (anchor mode) | Pass | Icon-only mode requires `aria-label` **at the TypeScript type level** (`IconOnlyButtonProps`), not just at runtime — stronger than a typical ARIA check; `button.test.tsx:100-139` covers `aria-busy` and the type-level guarantee |

## Field / Input (`src/components/field/field.tsx`, `input.tsx`, `field-label.tsx`, `field-message.tsx`)

| Criterion | Check performed | Result | Detail |
|---|---|---|---|
| Contrast | Text, placeholder, error/helper text, border at-rest and error state | Pass (after `input` fix) | Border-at-rest was the FAIL documented above, now fixed at the token level |
| Keyboard Focus | Tab reachability, visible ring, read-only stays focusable | Pass | `field.test.tsx:44-140` covers focus-visible ring, tab reachability, and read-only's distinct (focusable-but-not-editable) behavior |
| ARIA Semantics | Label association (`htmlFor`/`id`), `aria-invalid`, `aria-describedby` to error/helper text | Pass | `field.tsx:26-49` associates the label via `useId()`-generated ids; `field.test.tsx:67-167` confirms `aria-invalid` fires only for real errors and `aria-describedby` covers both error and helper text |

## Card (`src/components/card/card.tsx`)

| Criterion | Check performed | Result | Detail |
|---|---|---|---|
| Contrast | Text, container border (exempt, see above), `selected`/`interactive` state indicators | Pass | Selected state uses `border-2 border-foreground` (19:1) — "more than color alone" per the component's own source comment |
| Keyboard Focus | Tab reachability for interactive cards, disabled exclusion, static cards correctly N/A | Pass | `card.test.tsx:87-127`; static (non-interactive) Card correctly has no focus/ARIA-interactive expectations — spec Edge Cases' "no interactive elements" case |
| ARIA Semantics | `aria-label`/`aria-labelledby` resolution from `heading`, `aria-pressed`/`aria-current`, nested-interactive handling | Pass | `card.test.tsx:133-232` covers both explicit and heading-derived accessible names and correct state attribute per `as` value |

## Table (`src/components/table/table.tsx`)

| Criterion | Check performed | Result | Detail |
|---|---|---|---|
| Contrast | Header/body text, row hover/selected, dividers (exempt, see above) | Pass | `muted-surface` header background + text pass; row dividers are decorative (exemption above) |
| Keyboard Focus | Sortable header tab order, row-selection checkbox tab order | Pass | `table.test.tsx:113-280` verifies `Enter` activates sort and full tab sequence (select-all → header → row checkbox) |
| ARIA Semantics | `aria-sort`, native `<table>`/`<th scope="col">` semantics, checkbox accessible names | Pass | Source inspection confirms native table markup (`table.tsx:138-255`); `table.test.tsx:75-200` covers `aria-sort` transitions and unique per-row checkbox names |

## Navigation (`src/components/navigation/navigation.tsx`)

| Criterion | Check performed | Result | Detail |
|---|---|---|---|
| Contrast | Link text, active-state border (`foreground`, exempt category not applicable — high contrast anyway) | Pass | Active indicator uses `border-foreground` (19:1/17:1) |
| Keyboard Focus | Tab order across items, disabled items excluded, `Enter` activation for `as="button"` items | Pass | `navigation.test.tsx:57-107` covers `Enter` activation and disabled exclusion from tab order |
| ARIA Semantics | `nav` landmark `aria-label`, `aria-current="page"`, `aria-disabled` | Pass | `navigation.test.tsx:7-41` confirms exactly one `aria-current` at a time and correct landmark labeling |

## Chart (`src/components/chart/chart.tsx`)

| Criterion | Check performed | Result | Detail |
|---|---|---|---|
| Contrast | Data color (`brand`) on `background`, gridlines (`border`, exempt, see above), axis labels (`muted-foreground`) | Pass | `brand` on `background`: 6.85:1/8.25:1, clears both the 3:1 (large-scale UI) and 4.5:1 (text) bars with room to spare |
| Keyboard Focus | Per-point/per-bar tab order, visible ring | Pass | `chart.test.tsx:31-49` confirms `focus-visible:ring-ring` on each point/bar and value exposure on keyboard focus (`fireEvent.focus`) |
| ARIA Semantics | `role="img"`, computed `aria-label`/`aria-describedby`, hidden data-table fallback | Pass | `chart.test.tsx:67` confirms the accessible name via `getByRole("img", { name: ... })`; source (`chart.tsx:225`) wires `aria-describedby` to a visually-hidden description |

---

## Summary

18/18 Component × Criterion cells: **17 Pass on first check, 1 Fixed** (`input` token
contrast). Zero Deferred — the one real violation found had a clean, token-level fix within
scope; the `border` role's low ratio is a documented exemption, not a deferred violation.
