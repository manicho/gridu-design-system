# Design Principles: gridu

**Created**: 2026-06-29
**Status**: Final — validated against `quickstart.md` (all 5 checks pass)
**Scope**: No color, typography, component, or other visual design decision belongs in this
document (deferred to Features 03-06). Each principle below traces to a specific value or
personality trait in `identity.md` (specs/01-define-product-identity/identity.md) and
includes a concrete example decision it resolves. This document is written to convert
directly into constitution articles — each statement is normative (MUST/SHOULD), not
descriptive.

## Principles

### Default over configure

A design or product decision MUST resolve in favor of a single sensible default over
exposing a setting, unless a specific user has already demonstrated a concrete need for the
alternative.

- **Identity trace**: Effortless setup (`identity.md` Values).
- **Example decision**: Whether reminder lead time should be a fixed value or a per-business
  configurable setting. This principle resolves it as a fixed value — a setting only earns
  its place once an actual business has asked for something different, not speculatively.

### Fail loud, never silent

Every action that affects a booking MUST either visibly succeed or visibly fail to the
person it affects. A failure MUST NOT be recorded only in a log the owner never sees.

- **Identity trace**: Always-on reliability (`identity.md` Values).
- **Example decision**: What happens when an automated reminder fails to send. This
  principle resolves it as: the owner is notified that the reminder failed and what (if
  anything) they need to do — it is never just written to a log and left there.

### Outcome first

A message, whether to the owner or their client, MUST state the outcome before any
explanation or detail. Explanation SHOULD follow only if it adds something the outcome alone
didn't already convey.

- **Identity trace**: Respectful brevity (`identity.md` Values).
- **Example decision**: How a booking confirmation message is structured. This principle
  resolves it as leading with "booked" (the outcome), with date/time/details following — not
  leading with a process description of how the booking was made.

### Scale to one, not to a thousand

A feature SHOULD be designed first for a single operator managing their own business, not
for a multi-staff or multi-location organization, unless evidence shows the single-operator
case doesn't represent most users.

- **Identity trace**: Local fit (`identity.md` Values) and the Target Persona ("the owner who
  runs the whole show").
- **Example decision**: Whether to build a staff-permissions system (who can see/edit which
  bookings) before any multi-staff business has signed up. This principle resolves it as: no
  — that complexity is deferred until a real multi-staff user needs it.

### Calm under pressure

An error or edge-case message MUST use the same even, plain tone as a success message. It
MUST NOT use alarmed language, exclamation-heavy phrasing, or excessive apology.

- **Identity trace**: Personality (`identity.md` Personality — "stays even-keeled... handles
  each the same calm way every time").
- **Example decision**: How to word a double-booking conflict. This principle resolves it as
  stating the conflict and the next step plainly ("that slot is already booked — here are two
  other times"), not with alarmed or over-apologetic language.

## Tie-breaker

When two principles point in different directions for the same decision, the tie is broken
by whichever principle more directly serves `identity.md`'s purpose statement in that
specific case — not by the order principles are listed above. For example, "Default over
configure" and "Scale to one, not a thousand" could conflict if a default choice only serves
multi-staff businesses; in that case, "Scale to one, not a thousand" wins because the purpose
statement centers the single operator, not configurability for its own sake.
