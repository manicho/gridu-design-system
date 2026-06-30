<!--
Sync Impact Report
- Version change: (template, unratified) → 1.0.0
- Modified principles: n/a (initial ratification)
- Added sections: Core Principles (I-V), Scope Boundaries, Development Workflow, Governance
- Removed sections: none
- Source: specs/02-define-design-principles/principles.md (Feature 02), itself derived from
  specs/01-define-product-identity/identity.md (Feature 01)
- Templates requiring updates:
  - ✅ .specify/templates/plan-template.md — Constitution Check section is generic
    ("[Gates determined based on constitution file]"); no edit needed, it will reference
    these principles dynamically starting with Feature 03's plan.md.
  - ✅ .specify/templates/spec-template.md — no constitution-driven mandatory section
    changes; these principles govern design/product decisions made during planning, not
    spec structure.
  - ✅ .specify/templates/tasks-template.md — no new principle-driven task category
    introduced (no testing/observability/versioning mandate added).
  - ✅ README.md — already states "Project principles, once defined (Feature 02), live in
    .specify/memory/constitution.md"; accurate as written, no edit needed.
  - ✅ CLAUDE.md — managed plan-reference block is feature-specific, not principle-specific;
    no edit needed.
- Deferred items: none.
-->

# Gridu Design System Constitution

## Core Principles

### I. Default Over Configure

A design or product decision MUST resolve in favor of a single sensible default over
exposing a setting, unless a specific user has already demonstrated a concrete need for the
alternative.

**Rationale**: Traces to the Effortless setup value in `identity.md`. Example: whether
reminder lead time should be a fixed value or a per-business configurable setting resolves
to a fixed value — a setting only earns its place once an actual business has asked for
something different, not speculatively.

### II. Fail Loud, Never Silent

Every action that affects a booking MUST either visibly succeed or visibly fail to the
person it affects. A failure MUST NOT be recorded only in a log the owner never sees.

**Rationale**: Traces to the Always-on reliability value in `identity.md`. Example: when an
automated reminder fails to send, the owner is notified of the failure and what (if
anything) they need to do — it is never just written to a log and left there.

### III. Outcome First

A message, whether to the owner or their client, MUST state the outcome before any
explanation or detail. Explanation SHOULD follow only if it adds something the outcome alone
didn't already convey.

**Rationale**: Traces to the Respectful brevity value in `identity.md`. Example: a booking
confirmation leads with "booked" (the outcome), with date/time/details following — not with
a process description of how the booking was made.

### IV. Scale To One, Not A Thousand

A feature SHOULD be designed first for a single operator managing their own business, not
for a multi-staff or multi-location organization, unless evidence shows the single-operator
case doesn't represent most users.

**Rationale**: Traces to the Local fit value and the Target Persona ("the owner who runs the
whole show") in `identity.md`. Example: a staff-permissions system (who can see/edit which
bookings) is deferred until a real multi-staff user needs it — it is not built speculatively.

### V. Calm Under Pressure

An error or edge-case message MUST use the same even, plain tone as a success message. It
MUST NOT use alarmed language, exclamation-heavy phrasing, or excessive apology.

**Rationale**: Traces to the Personality description in `identity.md` ("stays even-keeled...
handles each the same calm way every time"). Example: a double-booking conflict is worded
plainly — stating the conflict and the next step — never with alarmed or over-apologetic
language.

## Scope Boundaries

These principles govern design and product *decisions* — they do not themselves define
colors, typography, components, or other visual design choices; those are ratified
separately in Features 04-06 and MUST NOT contradict these principles once ratified.

**Conflict resolution**: When two principles point in different directions for the same
decision, the tie is broken by whichever principle more directly serves the purpose
statement in `identity.md` for that specific case — not by the order principles are listed
above. Example: "Default Over Configure" (I) and "Scale To One, Not A Thousand" (IV) could
conflict if a default choice only serves multi-staff businesses; in that case, Principle IV
wins because the purpose statement centers the single operator, not configurability for its
own sake.

## Development Workflow

Every feature in this repository (Features 03 through 22 of the Product Identity Refresh
epic, and any feature added afterward) follows the Spec Kit cycle: `/speckit-specify` →
`/speckit-clarify` (optional) → `/speckit-plan` → `/speckit-tasks` → `/speckit-analyze` →
`/speckit-implement`. Each feature's `plan.md` MUST include a Constitution Check section
that explicitly verifies the feature's approach against Principles I-V before Phase 0
research begins, and re-checks after Phase 1 design. A violation that cannot be resolved by
adjusting the feature's approach MUST be justified in that plan's Complexity Tracking table,
not silently waived.

## Governance

This constitution supersedes any informal or undocumented design convention in this
repository. Amendments require: (1) a documented rationale (a new or updated feature spec,
or an explicit amendment note), (2) a version bump per the rules below, and (3) propagation
to any dependent template or guidance file flagged in that amendment's Sync Impact Report.

**Versioning policy** (semantic versioning): MAJOR for backward-incompatible principle
removals or redefinitions; MINOR for a new principle or materially expanded guidance; PATCH
for wording clarifications with no normative change.

**Compliance review**: Every feature's `plan.md` Constitution Check section is the
compliance gate — `/speckit-analyze` treats any unresolved conflict with a MUST principle
above as CRITICAL, blocking `/speckit-implement` until resolved.

**Version**: 1.0.0 | **Ratified**: 2026-06-29 | **Last Amended**: 2026-06-29
