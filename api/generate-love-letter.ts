import { GoogleGenAI } from "@google/genai";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "GEMINI_API_KEY missing on server" });
    }

    const {
      recipient = "Asma",
      sender = "Mohamed",
      tone = "Deeply Romantic",
      milestones = [],
      customNote = "",
    } = req.body;

    const ai = new GoogleGenAI({ apiKey });

    const milestonesSummary =
      milestones.length > 0
        ? milestones
            .map(
              (m: any, i: number) =>
                `${i + 1}. "${m.title}" | ${m.date} | ${m.location} | ${m.fullStory || m.shortDescription}`
            )
            .join("\n")
        : "Shared beach coffee dates, starry night walks, wandering old Medina streets.";

    const prompt = `Write a deeply romantic love letter from ${sender} to ${recipient}.

Tone: ${tone}
${customNote ? `Personal note to weave in: "${customNote}"` : ""}

Milestone memories:
${milestonesSummary}

Return ONLY valid JSON in this exact format (no markdown, no code blocks):
{
  "title": "romantic title",
  "quote": "one line romantic quote",
  "letter": "the full letter in elegant paragraphs",
  "highlights": ["highlight 1", "highlight 2", "highlight 3"]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-flash-latest",
      contents: prompt,
    });

    let text = response.text || "{}";
    // Strip markdown code blocks if Gemini wraps the JSON
    text = text.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
    
    const resultData = JSON.parse(text);
    return res.status(200).json(resultData);
  } catch (err: any) {
    console.error("=== ERROR DETAILS ===");
    console.error(err);
    return res.status(500).json({
      error: "Failed to generate love letter",
      details: err.message || String(err),
      stack: err.stack,
    });
  }
}