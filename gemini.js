// Calls the Gemini API from the server only, so the API key is never sent to the browser.
async function generate(system, contents, temperature = 0.7) {
  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
  const generationConfig = { temperature, maxOutputTokens: 2048 };
  if (model.includes("flash")) generationConfig.thinkingConfig = { thinkingBudget: 0 }; // faster, cheaper replies

  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-goog-api-key": process.env.GEMINI_API_KEY },
    body: JSON.stringify({ systemInstruction: { parts: [{ text: system }] }, contents, generationConfig }),
  });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const msg = res.status === 429 ? "AI rate limit reached. Please wait a minute and try again."
      : res.status === 400 || res.status === 403 ? "AI request rejected. Check your GEMINI_API_KEY and model name."
      : "The AI service had a problem. Please try again.";
    console.error("Gemini error:", res.status, data.error?.message);
    throw Object.assign(new Error(msg), { status: res.status === 429 ? 429 : 502 });
  }
  const text = (data.candidates?.[0]?.content?.parts || []).map((p) => p.text || "").join("").trim();
  if (!text) throw Object.assign(new Error("The AI returned nothing. Try rephrasing your request."), { status: 502 });
  return text;
}

module.exports = { generate };
