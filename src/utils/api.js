// src/utils/api.js
// Simple wrapper for Groq API calls

export async function callAI(messages) {
  let apiKey = localStorage.getItem('groq_api_key');
  if (!apiKey) {
    const apiKey = import.meta.env.VITE_GROQ_API_KEY;
    localStorage.setItem('groq_api_key', apiKey);
  }
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages,
      response_format: messages[0]?.content?.includes('JSON') ? { type: "json_object" } : undefined
    }),
  });
  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Groq request failed: ${response.status} ${err}`);
  }
  const data = await response.json();
  return data.choices[0].message.content;
}
