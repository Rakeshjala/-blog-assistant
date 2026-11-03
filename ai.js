const router = require("express").Router();
const { wrap, protect } = require("../middleware/auth");
const { generate } = require("../gemini");

router.use(protect);

// Prompt engineering: each feature has a role, a clear task, format rules and constraints
const PROMPTS = {
  titles: (tone) =>
    `You are an expert blog editor. Generate exactly 8 catchy, SEO-friendly blog titles for the topic the user gives. ` +
    `Tone: ${tone}. Keep each title under 70 characters. Output a numbered list only, with no extra commentary.`,
  content: (tone) =>
    `You are a professional blog writer. Write a complete blog post of about 400-600 words on the topic the user gives. ` +
    `Tone: ${tone}. Use a short intro, 3-4 sections with markdown "##" headings, and a conclusion. Be accurate and do not invent statistics.`,
  summary: () =>
    `You are a precise summarizer. Summarize the text the user gives in 3-5 short bullet points followed by a one-sentence takeaway. ` +
    `Use only information from the text.`,
};

router.post("/chat", wrap(async (req, res) => {
  const { messages } = req.body;
  if (!Array.isArray(messages) || !messages.length || messages.length > 30)
    return res.status(400).json({ error: "Send between 1 and 30 messages" });
  const contents = messages.map((m) => ({ role: m.role === "assistant" ? "model" : "user", parts: [{ text: String(m.content).slice(0, 4000) }] }));
  const system = "You are a friendly writing assistant that helps bloggers with ideas, outlines, editing and SEO. Keep answers clear and concise.";
  res.json({ result: await generate(system, contents) });
}));

router.post("/:kind", wrap(async (req, res) => {
  const build = PROMPTS[req.params.kind];
  const { input, tone = "friendly" } = req.body;
  if (!build) return res.status(404).json({ error: "Unknown AI feature" });
  if (!input || !input.trim()) return res.status(400).json({ error: "Please enter some text first" });
  if (input.length > 6000) return res.status(400).json({ error: "Input is too long (max 6000 characters)" });
  const result = await generate(build(String(tone).slice(0, 30)), [{ role: "user", parts: [{ text: input }] }]);
  res.json({ result });
}));

module.exports = router;
