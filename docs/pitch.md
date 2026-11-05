# ROT BOT / BRANDROT: pitch

**We don't follow trends. We mutate them.**

## Problem

The internet produces thousands of memes an hour. A trend lives 3–7 days. A brand's content cycle (brief, agency,
approvals) takes two weeks. By the time a brand posts the "relatable" video, the format is dead and the comments say so.

## Product

**ROT BOT** is a swarm of seven Grok Bot agents that treats memes as organisms:

1. **Scout** 🐦 watches X and TikTok and ranks trends by velocity, not size.
2. **Geneticist** 🦫 sequences each trend into a genome: hook, hero, setting, humor, audio, visual, catchphrase, structure.
3. **Mutator** 🐊 crosses two genomes and mutates the child into a new, original format. No creator footage is reused: we inherit mechanics, not frames.
4. **Critic** 🐱 rejects until it's funny, fresh, loopable and brand-safe.
5. **Publisher** 🦜 renders it with Grok Imagine and queues native posts for TikTok and X, and a human approves.
6. **Analyst** 🦉 scores fitness; the fittest child parents the next generation, every 6 hours.

## Business: BRANDROT

*Turn any brand into brainrot.* The brand is a seed genome that is always one parent, so it survives every crossover.

| | Agency | BRANDROT |
| --- | --- | --- |
| Time to post | ~2 weeks | ~6 hours |
| Output | 1 campaign | 1 new on-trend meme per generation |
| Learning | a PDF report | a genome library: which genes sell, per brand |

- **Customers:** consumer brands, cities and tourism boards, local businesses with no content team.
- **Pricing:** subscription per brand (generations per month), plus a performance tier on fitness.
- **Moat:** every post adds a scored genome. The library makes each next generation fitter, for every client.

## Proof in the repo

- `generations/gen-live-001/`: a real live run on `grok-4.7` (live x_search trend, 7 subagent handoffs, Critic rejection then approval, Grok Imagine render, 2,552-event trace).
- `agents/`: a real `@grok/agent-sdk` project (orchestrator + 6 subagents, 5 tools, schedule, skill, eval).
- `generations/`: three generations bred from real trends of the week, each artifact committed by the agent that made it.
- `git log --graph`: the meme family tree. Crossovers are merges.
- Worked example: brief **Wrocław** → **Krasnal CEO**, a bronze dwarf who closes his Series A
  (*"we are not a dwarf, we are a Small Language Model"*).

## Ask

Pilot brands for BRANDROT. Bring a mascot; we bring the swarm.
