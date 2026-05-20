const OPENROUTER_BASE = "https://openrouter.ai/api/v1";

// All calls go through this — model is passed in so it's easy to swap later
export async function callOpenRouter({ model, messages, apiKey }) {
  if (!apiKey) {
    throw new Error("No API key provided. Please set it in Settings.");
  }

  const res = await fetch(`${OPENROUTER_BASE}/chat/completions`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": window.location.origin,
    },
    body: JSON.stringify({ model, messages, temperature: 0.1 })
  });

  const data = await res.json();
  
  if (!res.ok) {
    throw new Error(data.error?.message || "Failed to call OpenRouter");
  }

  return data.choices[0].message.content;
}
