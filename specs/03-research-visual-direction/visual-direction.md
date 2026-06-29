# Visual Direction: gridu

**Status**: Final — owner confirmed Quiet Competence (2026-06-29)

**Scope**: This document describes candidate visual directions in prose character only — no
exact color values, typeface names/sizes, or spacing scale numbers (those are Features
04-06). No visual assets are included.

**Source**: derived from `specs/01-define-product-identity/identity.md`, checked against
`.specify/memory/constitution.md` v1.0.0.

---

## Recommendation

> **Chosen direction: Quiet Competence** — see Candidates for full description and
> principle-alignment notes. Recommendation rationale follows after the candidate detail.
>
> **Confirmation status**: Provisional — pending explicit project-owner confirmation before
> this document moves to Final and Features 04-06 begin.

### Why Quiet Competence over the others

**Over Warm Local Trust**: `identity.md`'s Personality section explicitly characterizes
gridu as *not* trying to be the owner's friend — "not friend, not corporate either." Visual
warmth risks embodying the "friendly" register that personality section specifically discounts.
Local fit is a value about *what the product handles* (WhatsApp, Chilean context, cash/transfer
payments) not about projecting geographic warmth onto the visual character. The target persona
trusts a tool that works reliably and plainly, not one that looks warm at them.

**Over Effortless Minimal**: "Effortless" is a value about *the setup experience* —
not a visual style to project. A sparse, airy visual character could make the product feel
empty rather than purposeful, and creates structural tension with Principle IV (Scale to
One) once a full day's schedule needs to fit a single screen without excessive scrolling.
Quiet Competence is restrained, not absent — it has enough presence to feel stable.

**Positive case**: Identity.md's Personality section — the richest, most specific
description in the document — reads word-for-word as Quiet Competence: "confirms and moves
on," "says so plainly," "stays even-keeled," "direct, plain, and to the point." Choosing
a visual direction that embodies the same adjectives as the personality description makes the
product feel coherent rather than like a calm persona behind a loud or warm façade.
Principle II (Fail Loud) and Principle V (Calm Under Pressure) are most directly served by
this direction — functional restraint *is* the visual equivalent of "handling each the same
calm way every time."

---

## Candidates

### A — Quiet Competence

**Mood/Character**: Understated and functional. The visual system stays out of the way of
the task — it doesn't draw attention to itself, doesn't reward idling, and doesn't
celebrate actions the owner expected to just work. The overall feeling is of a tool that
has already been handling things before you arrived and will keep handling them after you
leave.

**Color temperature and saturation tendency**: Muted and desaturated, with a single accent
color that earns attention without demanding it. The base palette reads neutral — neither
cold-clinical nor warm-personal. The accent is present enough to signal interaction and
status without competing with the content it annotates.

**Typographic character**: Plain, high-legibility letterforms with no decorative detail.
The type system's job is to be read, not to be noticed. Weight variation is used for
hierarchy (what to read first) not for personality (what to feel). Nothing in the type
draws the eye before the words do.

**Spacing/density character**: Comfortable but efficient — enough breathing room to scan
the layout without hunting, not so much that it signals "take your time." Comparable to
reading a well-formatted message, not a brochure. Tasks and status information sit at a
density that lets an owner check the schedule in a glance, not a browse.

**Imagery character**: Documentary-style captures of real tool interactions — actual
WhatsApp conversation screenshots, actual confirmation messages as a client would see them,
actual status views as an owner would check them. No staged scenes, no stock-photo smiles,
no abstract illustration. The imagery shows exactly what the product does, because that is
the most credible thing it can show.

**Identity trace**: Personality section — "direct, plain, and to the point"; "confirms and
moves on"; "stays even-keeled"; "not trying to be the owner's friend, and not corporate or
formal either." Also: Respectful brevity value — "outcome first, explanations optional."

**Principle alignment**:

| Principle | Result | Reasoning |
|---|---|---|
| I. Default Over Configure | Aligned | Restrained, muted visual system never presents visual options competing for attention — the interface defaults you to what matters without requiring visual navigation. |
| II. Fail Loud, Never Silent | Tension (manageable) | "Low-visual-noise" character risks softening error and warning states to the point where they blend into the base. This tension is real but manageable in implementation: error states in this direction must be the *only* high-contrast, high-weight moment in the system, precisely because everything else is restrained — which actually makes failures harder to miss, not easier. |
| III. Outcome First | Aligned | The information hierarchy this direction implies — outcome at the top, supporting detail below — maps directly to the layout principle the document's own structure follows (Recommendation before Candidates). |
| IV. Scale To One, Not A Thousand | Aligned | Efficient, comfortable density suits a solo operator checking a daily schedule. Restraint in decoration means the system doesn't feel overbuilt for the task at hand. |
| V. Calm Under Pressure | Strongly aligned | "Understated and functional" is the visual equivalent of "handles each the same calm way every time." The visual system's even-keeled character directly embodies the personality's most specific behavioral trait. |

---

### B — Warm Local Trust

**Mood/Character**: Warm, human, and approachable. The visual system signals that someone
who understood the context of a Chilean personal-service business made this — it doesn't
feel imported from a Silicon Valley productivity tool or an enterprise scheduling platform.
The overall feeling is of a tool that belongs in the same workspace as the hairdresser's
station or the kinesiologist's table.

**Color temperature and saturation tendency**: Warmer temperature with moderate accent
saturation — closer to sunlit and earthy than to tech-blue or corporate teal. The palette
avoids cold, clinical reads. The accent feels familiar and lived-in rather than energetic
or urgent. The base breathes like a physical space, not a dashboard.

**Typographic character**: Readable and friendly, with a slight roundness to the letterforms
that avoids clinical sharpness while stopping well short of playful or cute. The type feels
approachable to a non-technical reader who encounters it in a business context, not
intimidating or demanding special attention to decode.

**Spacing/density character**: Comfortable with noticeable breathing room — the cadence
signals "we're not rushing you," which matches the pace of a personal-service business where
clients and conversations happen face-to-face. The layout doesn't feel optimized for speed
at the expense of legibility.

**Imagery character**: Real people photographed in their own workspaces — the hairdresser
at their station, the kinesiologist with their equipment — caught in natural light rather
than staged for a stock shot. The imagery shows the world the owner lives in, not an
aspirational abstraction of it.

**Identity trace**: Local fit value — "built around how Chilean service businesses actually
run today"; Target Persona — hairdresser, kinesiologist, manicurist; purpose statement —
"never have to choose between doing the work they're actually paid for."

**Principle alignment**:

| Principle | Result | Reasoning |
|---|---|---|
| I. Default Over Configure | Aligned | Warmth and familiarity create a "just use it" register; nothing in this direction implies the user needs to configure or choose before getting value. |
| II. Fail Loud, Never Silent | Aligned | Human warmth doesn't conflict with stating problems plainly; in human conversation, saying something went wrong directly is warmer than vague or softened language. No structural conflict. |
| III. Outcome First | Aligned | Information hierarchy is independent of tone; this direction can implement "outcome first" layout as readily as any other. |
| IV. Scale To One, Not A Thousand | Aligned | Warm, personal character fits a solo-operator tool precisely; doesn't suggest enterprise or multi-location scale. |
| V. Calm Under Pressure | Aligned | Warmth and approachability maintain even tone under failure or rescheduling moments; no structural conflict. |

**Why not chosen**: `identity.md`'s Personality section explicitly characterizes gridu as
*not* trying to be the owner's friend — "not friend, not corporate either." This direction's
warmth risks embodying the "friend" register the personality description specifically rejects.
The target persona trusts a tool that works reliably and plainly, not one that looks warm
*at* them. Local fit is a value about content (what the product handles), not visual
temperature.

---

### C — Effortless Minimal

**Mood/Character**: Crisp, minimal, and self-evident. The visual system communicates "it
just works" by asking the least of the eye — nothing to interpret, nothing to explain away,
nothing that implies effort. The overall feeling is of a tool you understand before you
consciously read it.

**Color temperature and saturation tendency**: Cool-neutral with very low saturation across
the base, high contrast between background and foreground, and a single accent used only for
primary actions. The palette prioritizes immediate legibility over personality — it reads fast,
not rich.

**Typographic character**: Clean and geometric, highly legible at small sizes, no personality
details. The type system optimizes for scan speed above all: characters are distinguishable
at a glance, spacing is predictable, weight signals hierarchy without any secondary role.

**Spacing/density character**: Airy and sparse — generous whitespace signals "nothing
complicated here." The layout feels like it has more room than it needs, which reads as
ease. Nothing crowds the available space.

**Imagery character**: Iconographic or schematic rather than photographic — simple diagrams
of flows, minimal line icons, or abstract representations of the booking loop. The imagery
describes the system, not the people using it.

**Identity trace**: Effortless setup value — "should feel like a short conversation, not an
onboarding project"; Always-on reliability — "agenda runs whether or not the owner is
watching."

**Principle alignment**:

| Principle | Result | Reasoning |
|---|---|---|
| I. Default Over Configure | Strongly aligned | Minimal by design — nothing in the visual system looks like a choice or a configuration option; defaults are visually obvious. |
| II. Fail Loud, Never Silent | Tension (structural) | Very low saturation base makes it difficult to introduce high-urgency error states without feeling visually inconsistent — errors need contrast and weight that this direction's sparse character doesn't naturally support. Unlike Candidate A's tension, this one is structural: the direction's low-contrast-everywhere character conflicts with needing at least one high-contrast-always moment (errors). |
| III. Outcome First | Aligned | Sparse layout makes hierarchy through whitespace straightforward; outcome-first ordering is easy to implement. |
| IV. Scale To One, Not A Thousand | Tension | Airy, sparse spacing that works for simple flows doesn't scale cleanly to a full day's appointment schedule without collapsing into the opposite problem — dense rows that look inconsistent with the rest of the system, or excessive scrolling for a task that should be a glance. This tension is structural for a scheduling product. |
| V. Calm Under Pressure | Aligned | Clean, uncluttered base doesn't amplify stress; no structural conflict. |

**Why not chosen**: Principle II tension is structural (low-saturation everywhere makes
error states visually incongruent), and Principle IV tension is structural (sparse spacing
conflicts with data-dense views of a day's schedule). More importantly, "Effortless" is a
value about the *setup experience*, not a visual style to project — deriving a visual
character from a functional value is a category confusion. Also: iconographic/schematic
imagery makes the product feel abstract and self-referential rather than grounded in the
world the owner actually works in.
