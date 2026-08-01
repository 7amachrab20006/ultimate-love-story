import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route: Generate AI Love Letter from Milestone Entries
  app.post("/api/generate-love-letter", async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "GEMINI_API_KEY environment variable is missing" });
      }

      const {
        recipient = "Asma",
        sender = "Mohamed",
        tone = "Deeply Romantic & Heartfelt",
        milestones = [],
        customNote = ""
      } = req.body;

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      const milestonesSummary = milestones.length > 0
        ? milestones.map((m: any, i: number) => 
            `${i + 1}. Title: "${m.title}" | Date: ${m.date} | Location: ${m.location} | Story: ${m.fullStory || m.shortDescription}`
          ).join("\n")
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
2. The letter should feel intimately personal, poetic, and genuine—not overly generic.
3. Express profound devotion, appreciation, passion, and excitement for their shared future.
4. Include a romantic title and a short poetical opening quote.
5. Highlight 3 key milestone moments mentioned in the letter.

Return the response strictly as valid JSON with the following structure:
{
  "title": "A romantic title for the letter",
  "quote": "A short, beautiful 1-line quote about their love",
  "letter": "The full love letter text written in elegant paragraphs",
  "highlights": ["Highlight 1 description", "Highlight 2 description", "Highlight 3 description"]
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
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
                items: { type: Type.STRING }
              }
            },
            required: ["title", "quote", "letter", "highlights"]
          }
        }
      });

      const rawText = response.text || "{}";
      const resultData = JSON.parse(rawText);

      return res.json(resultData);
    } catch (err: any) {
      console.error("Error generating love letter:", err);
      return res.status(500).json({
        error: "Failed to generate love letter",
        details: err.message || String(err)
      });
    }
  });

  // Health check
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  // Vite middleware in dev mode
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
