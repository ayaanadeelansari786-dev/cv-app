export function buildExtractionMessages(base64, fileType) {
  const isImage = fileType.startsWith("image/");

  const systemPrompt = `You are a CV parser. Extract structured information from the provided CV and return ONLY a valid JSON object — no markdown, no explanation, no backticks. Use exactly this shape:
{
  "name": "",
  "email": "",
  "phone": "",
  "location": "",
  "summary": "",
  "skills": [],
  "experience": [{"title":"","company":"","years":"","description":""}],
  "education": [{"degree":"","institution":"","year":""}],
  "languages": [],
  "totalYearsExperience": 0
}
If a field is not found, use null for strings and [] for arrays.`;

  if (isImage) {
    return [
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: [
          { type: "image_url", image_url: { url: `data:${fileType};base64,${base64}` } },
          { type: "text", text: "Extract all CV information from this image." }
        ]
      }
    ];
  } else {
    // PDF — send as text after extraction, or if model supports it, as base64 doc
    // Most OpenRouter models: extract text client-side first using pdf.js, then send as text
    return [
      { role: "system", content: systemPrompt },
      { role: "user", content: `Extract all CV information from this CV text:\n\n${base64}` }
    ];
  }
}
