# Quickstart: Validating the Analyze Existing Product audit

This feature has no runnable code. "Running" it means producing `audit.md` and checking it
against the spec. Use this guide once `/speckit-implement` has produced the audit.

## Prerequisites

- Read access to `gridu-web` and `gridu-landing` (both already cloned locally per the
  workspace).
- The completed `specs/00-analyze-existing-product/audit.md`.

## Validation steps

1. **Source-citation check** — for every finding in `audit.md`, open the cited file/config
   and confirm the value matches. Spot-check at least one finding per category (color,
   typography, spacing, components) per surface. (Validates FR-008, SC-002.)
2. **Independence check** — read only the `gridu-web` section and confirm it fully describes
   that surface's current state without needing the `gridu-landing` section. Repeat for
   `gridu-landing`. (Validates User Story 1 / FR-001 through FR-004.)
3. **Inconsistency check** — read the comparison section and confirm each listed
   inconsistency points to two specific findings that actually disagree (not just "these are
   different" without evidence). (Validates FR-005.)
4. **Gap-traceability check** — for every entry in the gaps section, confirm it links back to
   a specific finding or inconsistency rather than being asserted on its own. (Validates
   FR-006, SC-002.)
5. **No-forward-looking-content check** — confirm the document contains no proposed colors,
   components, or direction for the *new* identity — only descriptions of what exists today.
   (Validates FR-007.)
6. **Cold-read check** — hand the document (or re-read it fresh) and confirm SC-001: you can
   answer "what does this look like today and why" for color, typography, spacing, and
   components using only the document, without opening either codebase.

## Expected outcome

All six checks pass → the audit is ready to be the baseline input for Features 01-06. If any
check fails, fix `audit.md` directly (this is documentation, not code — no rebuild step).
