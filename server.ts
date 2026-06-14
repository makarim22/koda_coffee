import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API route for Brew Guide
  app.post("/api/brew-guide", async (req, res) => {
    try {
      const { origin, roastLevel, method } = req.body;
      
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Provide the optimal brewing parameters for ${roastLevel} roast coffee from ${origin} using the ${method || 'standard'} brewing method.`,
        config: {
          systemInstruction: "You are an expert coffee barista. Respond only in JSON. Do not add markdown blocks or formatting. Provide the keys 'temperature' (in Celsius with C, e.g. 93°C), 'grindSize' (e.g. Medium-Fine), 'steepTime' (e.g. 2:30 or 3 mins), and 'steepSeconds' (an exact integer of total brewing seconds like 150).",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              temperature: { type: Type.STRING, description: "Water temperature with unit" },
              grindSize: { type: Type.STRING, description: "Descriptive grind size (e.g., Medium, Medium-Fine, Coarse)" },
              steepTime: { type: Type.STRING, description: "Recommended steep/brew time as a readable string" },
              steepSeconds: { type: Type.INTEGER, description: "Recommended steep/brew time in total seconds" }
            },
            required: ["temperature", "grindSize", "steepTime", "steepSeconds"]
          }
        }
      });

      const data = JSON.parse(response.text || '{}');
      res.json(data);
    } catch (err) {
      console.error('Error generating brew guide:', err);
      res.status(500).json({ error: 'Failed to generate brew guide' });
    }
  });

  // API route for Coffee Personality Quiz
  app.post("/api/coffee-personality", async (req, res) => {
    try {
      const { answers, menuItems } = req.body;
      
      const prompt = `Based on the following user preferences: ${JSON.stringify(answers)}, recommend one coffee from this menu: ${JSON.stringify(menuItems)}. Return a JSON object with 'recommendedId' (the id of the matching coffee) and 'reason' (a 2-sentence explanation of why it fits their profile).`;
      
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: "You are an expert coffee sommelier. Respond only in JSON. Do not add markdown blocks or formatting.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              recommendedId: { type: Type.STRING, description: "The ID of the recommended menu item" },
              reason: { type: Type.STRING, description: "A brief reason for the recommendation" }
            },
            required: ["recommendedId", "reason"]
          }
        }
      });

      const data = JSON.parse(response.text || '{}');
      res.json(data);
    } catch (err) {
      console.error('Error generating coffee personality:', err);
      res.status(500).json({ error: 'Failed to recommend coffee' });
    }
  });

  // API route for Semantic Search
  app.post("/api/semantic-search", async (req, res) => {
    try {
      const { query, menuItems } = req.body;
      
      const prompt = `Based on the following user query: "${query}", find the best matching coffee beans from this menu: ${JSON.stringify(menuItems)}. Focus on matching flavor notes, origins, or processes described in natural language. Return a JSON object with 'matchedIds' (an array of string IDs of the matching coffees). Return up to 4 matches, ordered by relevance.`;
      
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: "You are an expert coffee barista and semantic search engine. Respond only in JSON. Do not add markdown blocks or formatting.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              matchedIds: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Array of matching menu item IDs" }
            },
            required: ["matchedIds"]
          }
        }
      });

      const data = JSON.parse(response.text || '{}');
      res.json(data);
    } catch (err) {
      console.error('Error in semantic search:', err);
      res.status(500).json({ error: 'Failed to search' });
    }
  });

  // API route for Generating Share Graphic
  app.post("/api/generate-share-graphic", async (req, res) => {
    try {
      const { title, origin, process, flavorNotes } = req.body;
      const prompt = `A highly aesthetic, minimalist, coffee-themed social media graphic for a premium coffee bean. The graphic should have beautiful typography (though do not render actual words in the scene if it messes up, just pure aesthetic visual that represents the coffee). The coffee is named "${title}", from ${origin}, process: ${process}, and has notes of: ${flavorNotes}. Make it look like a gorgeous abstract or artistic representation of these flavors, high quality.`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            { text: prompt },
          ],
        },
        config: {
          imageConfig: {
            aspectRatio: "1:1",
          }
        },
      });

      let base64String = '';
      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          base64String = part.inlineData.data;
          break;
        }
      }
      
      if (!base64String) {
        throw new Error('No image generated');
      }

      res.json({ imageUrl: `data:image/jpeg;base64,${base64String}` });
    } catch (err) {
      console.error('Error generating share graphic:', err);
      if (err?.message?.includes('RESOURCE_EXHAUSTED') || err?.status === 429) {
        return res.status(429).json({ error: 'Your API key prepayment credits are depleted. Please top up your AI Studio billing.' });
      }
      res.status(500).json({ error: 'Failed to generate graphic' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
