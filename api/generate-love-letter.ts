import { GoogleGenAI, Type } from "@google/genai";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "GEMINI_API_KEY missing" });
    }

    const {
      recipient = "Asma",
      sender = "Mohamed",
      tone = "Deeply Romantic & Heartfelt",
      milestones = [],
      customNote = "",
    } = req.body;

    const ai = new GoogleGenAI({ apiKey });

    const milestonesSummary =
      milestones.length > 0
        ? milestones
            .map(
              (m: any, i: number) =>
                `${i + 1}. Title: "${m.title}" | Date: ${m.date} | Location: ${m.location} | Story: ${m.fullStory || m.shortDescription}`
            )
            .join("\n")
        : "General milestone memories of love, laughter, shared beach coffee dates, starry night walks, and wandering old city Medina streets together.";

    const prompt = `You are an exceptionally romantic, soulful, and poetic AI love letter writer. Write a deeply personal and moving love letter from ${sender} to ${recipient}.

Use the following real milestone timeline memories of ${recipient} and ${sender}:
---
${milestonesSummary}
---

Selected Tone/Style: ${tone}
${customNote ? `Additional personal wish/note to weave in: "${customNote}"` : ""}

Instructions:
1. Weave the real milestone memories naturally into a cohesive, touching narrative of their journey together.
2. The letter should feel intimately personal, poetic, and genuine.
3. Express profound devotion, appreciation, passion, and excitement for their shared future.
4. Include a romantic title and a short poetical opening quote.
5. Highlight 3 key milestone moments mentioned in the letter.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            quote: { type: Type.STRING },
            letter: { type: Type.STRING },
            highlights: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: ["title", "quote", "letter", "highlights"],
        },
      },
    });

    const resultData = JSON.parse(response.text || "{}");
    return res.status(200).json(resultData);
  } catch (err: any) {
    console.error("Error generating love letter:", err);
    return res.status(500).json({
      error: "Failed to generate love letter",
      details: err.message || String(err),
    });
  }
}