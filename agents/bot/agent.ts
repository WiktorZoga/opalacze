import { defineAgent } from "@grok/agent-sdk";

export default defineAgent({
  description: "Overlord: orchestrates a swarm that breeds new memes from viral TikTok + X trends.",
  model: {
    id: "grok-4.7",
    params: [
      { id: "reasoning_effort", value: "high" },
      { id: "fast", value: "true" },
    ],
  },
});
