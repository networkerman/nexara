# xAura — Pitch Deck Outline

**Presenter:** Udayan Das Chowdhury, Director of Products
**Audience:** CEO, CBO, CPO, fellow Product Managers, leadership
**Length:** 30 minutes
**The ask:** Approve budget for a 3-person AI pod

---

## Read this before the deck

**On the room.** The CPO and your fellow PMs own the roadmap this deck calls
slow. Every line of Acts I–II must land on the *arithmetic*, never on the team.
The sentence that keeps you safe, and it belongs in your mouth on slide 3:
*"The work is good. The math is bad."* Slide 9 exists entirely to make the
AND-not-INSTEAD point explicit. Do not cut it, even for time.

**On timing.** 30 minutes with this room is realistically ~14 minutes of slides,
4 for demo, 12 of interruption. Slides 4, 8, and 13 are the ones they remember.
If you are running long when you reach slide 10, skip 11 and go straight to
rollout — never compress the ask.

**On the blanks.** Six `[FILL: …]` values are still missing and three of them
are load-bearing. See the checklist at the end. **Slide 3 does not work without
your time-to-ship-one-report-screen number** — that single figure is what makes
slide 4 undeniable rather than theoretical.

---

## Slide 1 — xAura

**Message:** We can turn the data we already move into decisions our customers
act on, without asking them to change anything.

**Content:**
- xAura — AI-first marketing copilot for Onextel
- Presenter, date

**Speaker notes:** Keep this to fifteen seconds. "I want to show you a way to
serve the single most common thing our customers ask us for, without waiting on
the platform roadmap to clear. I have a working prototype and a three-person
ask. Let me earn that in twelve minutes."

**Visual:** Full-bleed Navy `#1E2A5E`. xAura mark centred. Nothing else.

---

## Slide 2 — Where we are today

**Message:** Our platform carries stability and UX debt, and it surfaces as
support load rather than as engineering tickets.

**Content:**
- `[FILL: P1 count]` critical incidents per quarter
- `[FILL: uptime %]` against a `[FILL: target]` commitment
- Top support themes: `[FILL: e.g. report requests, dashboard errors]`
- `[FILL: N]` open analytics and reporting requests

**Speaker notes:** Say the disclaimer out loud and mean it: "This is not a
criticism of anyone's roadmap — every number here is a symptom of scale, not of
effort." Then move fast. You are establishing the board you are playing on, not
running a post-mortem. Thirty seconds, maximum. If you linger here you lose the
CPO for the rest of the deck.

**Visual:** Four stat tiles, generous white space. Only the worst number gets
Logo Red `#C23B34`. The other three stay Navy.

---

## Slide 3 — The queue never clears

**Message:** Every new report screen costs a full release cycle, and requests
arrive faster than screens ship.

**Content:**
- One report screen = `[FILL: N weeks]` design → FE → BE → QA → release
- `[FILL: N]` requests open today
- Every one is a different cut of data we already hold

**Speaker notes:** This is where you say it: "The work is good. The math is
bad." Walk the five stages and land on the number. Then the turn — "and here is
what I could not un-see once I did this arithmetic" — which sets up slide 4.
Do not editorialise about the platform team here; the numbers are doing the
work and any adjective you add will be heard as blame.

**Visual:** Five-stage pipeline left to right with the week count beneath each,
and a backlog stack growing on the right that visibly outpaces it.

---

## Slide 4 — ★ Screens can't catch up

**Message:** Screen supply grows linearly while insight demand grows
combinatorially — so shipping faster never closes the gap.

**Content:**
- Supply: one screen per release cycle → **linear**
- Demand: customers × dimensions × time windows × cadences → **combinatorial**
- The gap is structural. It is not a resourcing problem.

**Speaker notes:** Slow down. This is the whole deck. "If I doubled the
frontend team tomorrow, this line gets steeper — it does not become the other
curve." Then stop talking and let the picture sit for three full seconds. If
one idea survives this meeting, it is this one. Everything after this slide is
just evidence that we have a way to change the interface instead of racing a
curve we cannot win.

**Visual:** Two curves on an otherwise empty slide. A straight Navy line,
"screens we ship." An exponential Red curve, "questions customers ask." The
widening area between them shaded and labelled **unserved demand**. No bullets
on the rendered slide — the three content lines above are speaker scaffolding.

---

## Slide 5 — Three questions, over and over

**Message:** Behind every report request are the same three questions, and we
already hold the data to answer them.

**Content:**
- **What happened? Why? What should I do next?**
- Served today by CSV exports, analyst hours, CSM hand-holding
- We already move every message: delivery, DLR, engagement, cost
- Zero new integration required from the customer

**Speaker notes:** The strategic point is the last line, so do not rush it. Our
competitors have to ask a customer to integrate before they can answer any of
these. We do not — the data is already on our side of the wire, for every
message across SMS, WhatsApp, and RCS. That is a structural advantage we are
currently not charging for.

**Visual:** The three questions large and centred. Beneath them, a thin strip:
SMS / WhatsApp / RCS icons flowing into data types we already store.

---

## Slide 6 — From pipe to intelligence layer

**Message:** We are paid to move messages, and we throw away the exhaust that is
worth more than the transport.

**Content:**
- Today: messaging pipe, priced per message
- The data exhaust is entirely unmonetized
- Tomorrow: an intelligence layer on the same contract

**Speaker notes:** This is the CBO's slide — pitch it at them. We are in a
category where per-message pricing compresses every year and competitors win on
rate cards. Intelligence does not compress the same way. This is the argument
for why the company should care, not just why marketers would like it.

**Visual:** Before/after positioning. Left: a pipe with messages flowing
through and data draining away. Right: the same pipe with the exhaust captured
and feeding a layer above it.

---

## Slide 7 — Introducing xAura

**Message:** A multi-agent copilot that produces real artifacts, not a chatbot
bolted onto a dashboard.

**Content:**
- **xAura** orchestrates; five specialists execute
- **Insight** — performance analysis, anomaly detection
- **Segment** — research and customer segmentation
- **Content** — creation and optimization
- **Scheduler** — send timing, and scheduled report delivery
- **Journey** — multi-step, multi-channel journeys
- Output is artifacts: reports, segments, journeys, schedules

**Speaker notes:** One clause on what a multi-agent system is, then move — this
room does not need AI explained. The load-bearing word is *artifacts*. Ask for
a report and you get a report you can send to your CMO, not a paragraph of
chat. That distinction is what separates this from every AI feature they have
seen demoed this year.

**Visual:** Hub and spoke. xAura centre in Red, five specialists in Navy.

---

## Slide 8 — ★ It already runs

**Message:** This is not a concept deck — the prototype works today.

**Content:**
- Ask a question in plain language → get a report artifact
- Schedule it → it arrives every Monday, addressed to whoever you choose
- Live: WhatsApp Channel Performance, Q3 Business Review, CTR Anomalies,
  Seasonal Engagement Trends

**Speaker notes:** Budget four minutes and do not exceed it. Show exactly two
things: one question becoming a real report, and that report becoming a
recurring schedule. Resist showing the journey builder — it is impressive and
it will eat your remaining time. **Record a backup video and have it open in
another tab.** A failed live demo in front of this room costs you the ask.

**Visual:** Two or three real screenshots from the running prototype. Live if
the room is warm, video if you are already behind.

---

## Slide 9 — This is AND, not INSTEAD

**Message:** xAura routes around the queue while the platform team fixes the
foundation — it does not compete for their roadmap or their people.

**Content:**
- Core team: stability and existing GUI, entirely unchanged
- xAura: a new surface, iterated weekly, no migration for anyone
- A question answered by conversation is a screen we never had to build

**Speaker notes:** Deliver this to the CPO directly, by name if that is your
culture. "Nothing I am asking for takes a person, a sprint, or a priority slot
from the platform roadmap. If anything it takes pressure off it — every
reporting request xAura absorbs is one that stops arriving in your backlog."
This slide is why the rest of the deck is allowed to exist. Do not skip it for
time.

**Visual:** Two parallel horizontal tracks, clearly separate, with a single
arrow from the xAura track pointing at the platform backlog and shrinking it.

---

## Slide 10 — Additive, not a migration

**Message:** This is an upsell to accounts that already trust us, at a small
platform fee on top of spend they are already committed to.

**Content:**
- Not a replacement sale, not a migration, no new procurement cycle
- Small platform fee layered on existing messaging spend
- Raises switching cost on the core contract
- `[FILL: proposed fee]` × `[FILL: target attach rate]` = `[FILL: year-1 ARR]`

**Speaker notes:** The cheapest revenue in the building is an upsell to a logo
that already has our contract, our integration, and our data. There is no
security review, no new MSA, no migration risk. And the retention effect
matters as much as the revenue — a customer whose weekly reporting runs through
us is materially harder to displace on rate card alone.

**Visual:** A simple stacked bar: existing messaging spend in Navy, the platform
fee as a thin Red band on top. The point is visual — the fee is small.

---

## Slide 11 — The marketer's week

**Message:** They stop asking for reports and start receiving them.

**Content:**
- **Before** — Monday: request a pull. Thursday: analyst delivers. The number
  is now stale and the campaign already ran.
- **After** — Monday 9am: channel performance is in the inbox. Tuesday: a CTR
  anomaly is flagged mid-flight. Quarter-end: the QBR assembles itself.

**Speaker notes:** Name a real customer's marketing manager if you have
permission. Specific beats abstract every time. The line to land: "the report
they never asked for is the one that saved the quarter, because the anomaly
surfaced while the campaign was still running." **This is the slide to cut if
you are behind** — slide 8 already made the emotional case.

**Visual:** Two horizontal week-timelines. Before in flat grey. After in brand
colour with three marked moments.

---

## Slide 12 — Twelve weeks, three risks

**Message:** A beta in twelve weeks, and the three questions you are about to
ask me all have answers.

**Content:**
- Weeks 1–4: insight + reports grounded in existing data
- Weeks 5–8: scheduling and delivery
- Weeks 9–12: beta with `[FILL: N]` design partners

| Risk | Mitigation |
|---|---|
| AI gets a customer's numbers wrong | Grounded in our own data, every figure links to source, human approval before anything sends |
| Data privacy and tenancy | Per-tenant isolation, no cross-customer training, `[VERIFY: our DPA position]` |
| "This distracts from stability" | Separate pod, zero draw on the core platform team — see slide 9 |

**Speaker notes:** Raise the third risk yourself before anyone else does.
Pre-empting the strongest objection in the room is what buys you the
credibility to make the ask on the next slide. If you let someone else say it
first, you spend the rest of the meeting defending instead of closing.

**Visual:** A twelve-week bar split into three phases, with the risk table
beneath it.

---

## Slide 13 — ★ The ask

**Message:** Approve a three-person pod for twelve weeks to put a beta in front
of design partners.

**Content:**
- **3 people:** `[CONFIRM: 1 AI/full-stack, 1 backend/data, 1 design]`
- **12 weeks** to a working beta
- **Success:** `[FILL: N]` design partners running weekly reports through xAura
- **Decision needed by:** `[FILL: date]`

**Speaker notes:** State it once, plainly, then stop talking. Do not re-explain
the deck. The most common failure in this room is filling the silence after the
ask — let them respond first. If you get a "yes, but smaller," take two people
and a shorter phase one rather than negotiating the timeline; scope is
recoverable, momentum is not.

**Visual:** The ask in large type. Nothing else on the slide.

---

## What you still owe this deck

Three of these are load-bearing — the deck weakens noticeably without them.

- [ ] **Time to ship one report screen** ★ — slide 3, and slide 4 depends on it
- [ ] **Open analytics/reporting backlog count** ★ — slides 2 and 3
- [ ] **Proposed platform fee + target attach rate** ★ — slide 10 is empty without it
- [ ] P1 incidents per quarter, or uptime % — slide 2
- [ ] Top support themes — slide 2
- [ ] Named design partners — slide 12
- [ ] Decision-by date — slide 13
- [ ] Confirm the 3-role split — slide 13

Customer count and monthly message volume turned out not to be needed. The
argument runs on backlog and cycle time, not on scale.

---

## The four attacks, and your one-line answers

**"Why not fix the core product first?"**
We are, and this pod does not touch that team. This exists because there is a
class of demand we cannot ship screens for at any team size — slide 4.

**"Will customers trust AI with their numbers?"**
Every figure is grounded in their own data and links back to source, and
nothing sends without human approval. A report they can verify beats a CSV they
have to build themselves.

**"Can three people ship this in twelve weeks?"**
The prototype already runs — you just watched it. We are hardening a working
system against live data, not starting from zero.

**"What if a competitor does this better?"**
They would need the customer to integrate first. We already hold the data on
our side of the wire, which is a head start measured in sales cycles.
