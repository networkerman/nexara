# xAura — Pitch Deck Generation Prompt

A reusable prompt for generating the xAura pitch deck. Paste the block in
**Section 3** into Claude, Gamma, or any deck tool. Fill Section 2 first —
every `[FILL: …]` is a real number only you have, and the prompt instructs the
model never to invent them.

---

## 1. Before you generate — read this

**Audience assumption.** This deck is written for an **internal leadership
audience** (founders / CEO / CRO / board). Beats 1 and 2 of your narrative —
"our product is unstable" and "GUI will take time" — are candid internal
admissions. Never say them to a customer.

To fork a **customer-facing** version, see Section 4. Do not just re-skin the
internal one.

**The single sharpest argument in this deck** — make sure it survives whatever
the model does to your outline:

> Traditional GUI development scales **linearly** with the number of report
> screens you build. Customer demand for insight scales **combinatorially** —
> every customer wants a slightly different cut, by a different dimension, on a
> different cadence. That gap never closes by shipping more screens. It closes
> by changing the interface.

Everything else in the deck is scaffolding for that one idea.

**Integrity rule.** The prompt tells the model to leave `[FILL: …]` visibly
un-invented. If you get a deck back with confident-looking numbers you never
supplied, regenerate it — a leadership deck that gets caught with a made-up
metric is worse than one with visible blanks.

---

## 2. Fill these in first

Replace every value, then paste the whole thing at the top of your prompt.

```text
COMPANY:                Onextel (CPaaS — SMS, WhatsApp/WABA, RCS)
PRODUCT:                xAura — AI-first multi-agent marketing copilot
PRESENTER:              Udayan Das Chowdhury, Director of Products
AUDIENCE:               [FILL: e.g. CEO + leadership team / board]
MEETING LENGTH:         [FILL: e.g. 30 min, 20 present + 10 Q&A]
THE DECISION I WANT:    [FILL: e.g. approve 2 engineers + 1 designer for a
                        12-week beta with 3 design partners]

— Current state —
CUSTOMER COUNT:         [FILL: number of active enterprise logos]
MONTHLY MESSAGE VOLUME: [FILL: across SMS / WA / RCS]
TOP SUPPORT THEMES:     [FILL: e.g. "report requests", "dashboard errors"]
CURRENT GUI BACKLOG:    [FILL: e.g. 40 open analytics/reporting requests]
TIME TO SHIP ONE NEW
REPORT SCREEN TODAY:    [FILL: e.g. 6–8 weeks design→QA→release]
STABILITY EVIDENCE:     [FILL: uptime %, P1 count/quarter, or NPS verbatims —
                        one hard number is worth ten adjectives]

— The proposal —
PROPOSED PLATFORM FEE:  [FILL: e.g. ₹X/month per account, or % of spend]
TARGET ATTACH RATE:     [FILL: e.g. 30% of top-50 accounts in year 1]
BUILD COST ESTIMATE:    [FILL: team size × duration]
BETA DESIGN PARTNERS:   [FILL: named accounts, if you have soft commitment]
```

---

## 3. The prompt — copy from here

````text
You are a senior product-marketing strategist who has built board decks for
B2B SaaS and CPaaS companies. You write with executive economy: short, load-
bearing sentences, no filler, no hype adjectives. You are allergic to the word
"revolutionary."

Build a pitch deck for an internal leadership audience.

═══════════════════════════════════════════════════════════════════
CONTEXT
═══════════════════════════════════════════════════════════════════

[PASTE YOUR FILLED-IN SECTION 2 BLOCK HERE]

THE COMPANY TODAY
Onextel is a CPaaS provider. We move enterprise messaging traffic across SMS,
WhatsApp (WABA), and RCS. We already hold the data that marketers want:
delivery, DLR/status, engagement, and cost — per campaign, per channel, per
segment, across every message our customers send.

THE PRODUCT BEING PITCHED
xAura: an AI-first, multi-agent marketing copilot that sits on top of the
existing Onextel platform. It is a working prototype, not a concept — it runs
today. Its architecture:

  • xAura (orchestrator) — plans and optimizes campaigns, routes to specialists
  • Insight agent   — analyzes campaign performance, flags anomalies
  • Segment agent   — market research and customer segmentation
  • Content agent   — content creation and optimization
  • Scheduler agent — recommends send timing; runs scheduled report delivery
  • Journey agent   — designs multi-step, multi-channel customer journeys

Surfaces that exist in the prototype: a conversational home, a Campaigns
workspace, a Journeys builder, a Decisioning Engine (setup, configuration,
performance), and a Reports + Scheduled-delivery system.

Real report artifacts the prototype already produces:
  • "WhatsApp Channel Performance — This Quarter"
  • "Q3 Business Review — Campaign Snapshot"
  • "CTR Anomalies — Last 30 Days"
  • "Seasonal Engagement Trends — Trailing 12 Months"
Reports can be scheduled (daily/weekly/monthly/cron), addressed to recipient
lists, and emailed automatically.

═══════════════════════════════════════════════════════════════════
THE ARGUMENT — follow this arc exactly
═══════════════════════════════════════════════════════════════════

ACT I — THE TRAP WE ARE IN

  Beat 1: Our current product carries real stability and UX debt. State this
  plainly and briefly, with evidence, not apology. This is the setup for a
  strategic question, not a post-mortem. Two slides maximum. Never let this
  act read as self-flagellation — the tone is "here is the board we are
  playing on," not "here is what we did wrong."

  Beat 2: The conventional fix — building out the GUI — is a queue that never
  clears. Every new report screen costs design + frontend + backend + QA + a
  release cycle. Land the structural insight hard, on its own slide:

      GUI development scales LINEARLY with screens shipped.
      Demand for insight scales COMBINATORIALLY —
      every customer wants a different cut, dimension, and cadence.
      More screens will never close that gap.

  This is the deck's central idea. Give it a full slide with a visual: two
  diverging curves, a straight line and an exponential, with the widening gap
  between them labelled "unserved demand."

ACT II — WHAT CUSTOMERS ACTUALLY WANT

  Beat 3: Strip away the feature requests and every marketer is asking three
  questions: What happened? Why? What should I do next? Today those are served
  by manual exports, analyst hours, and CSM hand-holding. It is simultaneously
  our highest-frequency and lowest-differentiation request — and we are the
  best-positioned player to serve it, because the data is already ours. We are
  not asking customers for new data. We already move every message.

ACT III — THE LEAPFROG

  Beat 4: Reframe the company. We are paid to move messages. The message data
  is exhaust we currently throw away. The "extra" is converting that exhaust
  into decisions — moving from messaging pipe to marketing intelligence layer,
  without asking customers to migrate, re-integrate, or change vendors.

  Beat 5: Introduce xAura. Be precise that this is not a chatbot bolted onto a
  dashboard. It is a multi-agent system with a conversational surface that
  produces real artifacts — actual reports, segments, journeys, and schedules.
  Show the agent roster. Then a demo slide: the prototype is live, so the
  strongest slide in the deck is a screenshot and a "let me show you" moment.

ACT IV — WHY THIS, WHY NOW, WHY IT PAYS

  Beat 6: The commercial case. Three arguments, in this order:
    (a) It is ADDITIVE. This is not a replacement sale or a migration. It
        layers on existing contracts, so the sales motion is an upsell to
        accounts that already trust us — the cheapest revenue we can book.
    (b) It is a SMALL PLATFORM FEE on top of existing messaging spend. Low
        friction to land, high margin, and it raises switching costs on the
        core contract.
    (c) It ROUTES AROUND the GUI problem instead of waiting for it. Value
        reaches the customer through a surface we can iterate on weekly,
        which makes the legacy UI less load-bearing while we fix it.
    Also cover timing: competitors in the martech/engagement space are
    shipping AI copilots now. Being second here is survivable; being third
    is not.

ACT V — THE PAYOFF FOR THE MARKETER

  Beat 7: Close on the human outcome. A day in the life: the marketer stops
  asking for reports and starts receiving them. Monday's channel performance
  lands in the inbox. A CTR anomaly is flagged before the quarter closes. The
  QBR deck assembles itself. Summaries, not spreadsheets. Make this concrete
  and specific — walk through one named persona's week, before and after.

ACT VI — THE CLOSE

  Rollout plan, phased with dates. Risks with honest mitigations (include at
  minimum: AI accuracy/hallucination on customer data, data privacy and
  tenancy, and the risk that this distracts from core platform stability —
  address that last one head-on, because someone in the room will raise it).
  Then a single, unambiguous ask slide stating THE DECISION I WANT above.

═══════════════════════════════════════════════════════════════════
SLIDE PLAN — target 16 slides
═══════════════════════════════════════════════════════════════════

 1.  Title — product name, one-line positioning, presenter, date
 2.  Where we are today (stability debt, with evidence)
 3.  The conventional path and what it costs us
 4.  ★ The structural trap: linear supply vs. combinatorial demand
 5.  What every marketer actually asks (the three questions)
 6.  We already have the data — we just don't serve it back
 7.  The reframe: from messaging pipe to intelligence layer
 8.  Introducing xAura
 9.  How it works — the agent roster
10.  ★ Live demo — screenshots of the working prototype
11.  Why AI-first beats GUI-first (side-by-side comparison)
12.  The commercial model — additive, small platform fee
13.  Why now — competitive timing
14.  A day in the life of the marketer (before / after)
15.  Rollout plan + risks and mitigations
16.  ★ The ask

Slides 4, 10, and 16 are the three the audience will remember. Give them the
most design attention. If forced to cut, cut from 11 and 13, never from these.

For EVERY slide, produce:
  • Slide title (max 8 words, a claim not a label — "GUI can't catch up,"
    not "GUI Analysis")
  • The single message the slide must land, in one sentence
  • Body content — max 4 bullets, max 12 words each, OR one short paragraph
  • Speaker notes — 3–5 sentences of what the presenter actually says,
    written in natural spoken register, not written-English register
  • Visual direction — a specific description of the chart, diagram, or
    screenshot, not "add an image here"

═══════════════════════════════════════════════════════════════════
HARD RULES
═══════════════════════════════════════════════════════════════════

1. NEVER invent a number. If a metric is not supplied in the context above,
   write it as a visible [FILL: what's needed] placeholder. Do not produce
   plausible-looking figures for market size, ROI, revenue, or adoption. A
   deck caught with a fabricated metric loses the room permanently.
2. Do not claim competitor capabilities as fact. If you reference the
   competitive landscape, frame it as a category trend to be verified, and
   mark it [VERIFY].
3. No hype vocabulary: revolutionary, game-changing, cutting-edge, seamless,
   unlock, supercharge, paradigm. Executives discount decks that use them.
4. Assume the audience is technically literate and time-poor. No definitions
   of AI. No explaining what an agent is beyond one clause.
5. Every slide earns its place or gets cut. If a slide's message duplicates
   another's, merge them.
6. Acknowledge the strongest counter-argument somewhere in the deck rather
   than hiding it. The room will find it anyway, and pre-empting it is how you
   win the credibility to make the ask.

═══════════════════════════════════════════════════════════════════
DESIGN DIRECTION
═══════════════════════════════════════════════════════════════════

Onextel brand:
  Primary Navy  #1E2A5E   backgrounds, headers
  Logo Red      #C23B34   accents, CTAs, the one thing per slide to look at
  Cool Grey     #E2E8F0   secondary surfaces, dividers
  Pure White    #FFFFFF   text on dark

Headings: wide geometric sans (Orbitron or Michroma). Body: Inter.
Dense-but-calm. Heavy use of white space. One idea per slide. Charts must be
legible from the back of a room — if a number matters, it is large.

═══════════════════════════════════════════════════════════════════
OUTPUT FORMAT
═══════════════════════════════════════════════════════════════════

Deliver as a slide-by-slide outline in Markdown, using this structure per
slide:

  ## Slide N — [Title]
  **Message:** [one sentence]
  **Content:**
  - [bullet]
  **Speaker notes:** [3–5 sentences, spoken register]
  **Visual:** [specific direction]

After the outline, add a short section listing:
  • Every [FILL: …] placeholder, as a checklist of what I must supply
  • The three questions this deck is most likely to be attacked on, and a
    one-line answer for each
````

---

## 4. Forking a customer-facing version

Do **not** reuse the internal deck. Change these four things:

| | Internal deck | Customer deck |
|---|---|---|
| **Acts I–II** | "Our product is unstable, GUI is slow" | Cut entirely. Open on *their* pain: waiting days for reports, exporting CSVs, chasing analysts |
| **Beat 4 reframe** | "We're leaving data on the table" | "You already generate this data with us — here's what it's worth" |
| **Beat 6** | Margin, attach rate, upsell motion | Their ROI: hours saved per marketer per week, faster decisions |
| **The ask** | Headcount and budget approval | Beta enrolment, or a pilot on one channel |

The demo slide and the day-in-the-life slide carry over unchanged — they are
the strongest material in both versions.

---

## 5. Running it

Fastest path is to paste Section 3 into a Claude conversation and iterate on
the outline before generating any visuals. Once the outline is right:

- **For a .pptx** — ask Claude to build it with the `pptx` skill
- **For a web deck** — ask for an HTML artifact using the brand palette above
- **For Gamma / Beautiful.ai** — paste the finished outline as the source text

Iterate on the argument in text first. Never design slides for an outline you
haven't pressure-tested.
