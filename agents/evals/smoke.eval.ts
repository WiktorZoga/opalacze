import { defineEval } from "@grok/agent-sdk/evals";

export default defineEval({
  tags: ["smoke"],
  description: "The Overlord starts a generation by sending the scout to x_trends.",
  async test(t) {
    await t.send("Start a new generation. Only do the scouting step and tell me the two parents.");
    t.succeeded();
    t.calledTool("x_trends");
  },
});
