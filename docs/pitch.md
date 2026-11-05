# Riptide: pitch

*The AI ad agency that rides virals. Run by a Grok Bot swarm.*

**The AI ad agency that rides virals.** Brands send a brief; a swarm of Grok Bot agents finds the rising trend,
extracts its DNA and ships trend-native UGC ads in minutes.

## 45-second script

| Time | Screen | Voiceover |
| --- | --- | --- |
| 0–5 s | Trend radar, a café clip climbing past 10.8M views | "Agencies need a week to jump on a trend. Trends live three days." |
| 5–12 s | Brief form: *NOIR/05 eau de parfum · women 18–30 · TikTok · tone UGC* | "So we built an agency that never sleeps. A brand sends a brief." |
| 12–20 s | Scout card: rising trend, **87% brand fit**; Geneticist splits it into hook, pacing, audio, caption | "Grok Bot agents find the rising trend and extract its DNA: the hook, the pacing, the sound, the exact second the product goes in." |
| 20–30 s | Creator renders the hero ad: an AI creator unboxes NOIR/05, sprays, *"okay, this smells expensive"*; A/B variant beside it | "Our Creator agent picks an AI creator, writes the script and renders two UGC variants with Grok Imagine." |
| 30–36 s | Critic: trend fidelity ✓, claims ✓, `#ad · AI-generated` ✓; first draft rejected, second approved | "The Critic checks brand safety, claims and disclosure. It rejected the first draft. That's real; it's in our git history." |
| 36–41 s | Same pipeline, two more campaigns: Wrocław café on *"Your First Time in a Fancy Cafe"*, then Tone = Brainrot | "Same swarm, any tone: UGC, polished ad, or full brainrot." |
| 41–45 s | Publish + metrics: hook rate, watch time, CTR → next variant. Logo | "It publishes, learns and does it again. Riptide: ride the viral before it's gone." |

## Problem

A trend peaks in 3 days. A brand's content cycle (brief, agency, approvals, shoot) takes a week or more. The ad lands
after the format is dead.

## Product

Seven Grok Bot agents run the agency workflow: Scout (trend + brand fit) → Geneticist (trend DNA + product insertion)
→ Creator (AI UGC persona, script, 9:16 A/B renders) → Critic (fidelity, brand safety, claims, disclosure) →
Publisher (schedule, human approval) → Analyst (hook rate, watch time, CTR → next variant).

**Tones:** UGC · Polished ad · Brainrot.

## Business

| | Agency | Riptide |
| --- | --- | --- |
| Time to an on-trend ad | ~1 week | minutes |
| Output | 1 concept | A/B variants per trend, per tone |
| Learning | a PDF report | trend DNA library + per-brand performance |

- **Customers:** DTC and consumer brands, local businesses, agencies that want a trend desk.
- **Pricing:** subscription per brand (campaigns per month) plus a per-variant tier.
- **Moat:** the trend-DNA library. Every campaign teaches the swarm which genes sell for which brand.

## Integrations

Live: Grok Bot (`@grok/agent-sdk`), xAI Grok Imagine (image + video), xAI X search.
Roadmap: Higgsfield (AI video / UGC avatars), TikTok Creative Center, Meta + TikTok Ads APIs, ElevenLabs voice.

## Proof in the repo

- `agents/`: a real `@grok/agent-sdk` project (orchestrator + 6 subagents, 5 tools, schedule, skill, eval).
- `generations/gen-live-001/`: the first live R&D run on `grok-4.7` (live x_search trend, 7 handoffs, Critic rejection then approval, Grok Imagine render, 2,552-event trace).
- `generations/gen-001…003`: R&D history. The swarm learned trend DNA by breeding memes from real virals; every artifact is committed by the agent that made it.

All creators are AI personas, labeled AI-generated. No real people's likeness.
