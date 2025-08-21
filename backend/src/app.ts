import express from "express";
import axios from "axios";
import multer from "multer";
import fs from "fs";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

export const app = express();
app.use(express.json());
app.use(cors());

const upload = multer({ dest: "uploads/" });

import type { Request } from "express";

app.post(
  "/api/gemini-analyze",
  upload.single("image"),
  async (req: Request, res) => {
    try {
      const { prompt } = req.body;
      // Cast req to include file property from multer
      const imageFile = (req as Request & { file?: Express.Multer.File }).file;
      if (!prompt || !imageFile) {
        return res
          .status(400)
          .json({ error: "Prompt and image are required." });
      }

      // Read image and convert to base64
      const imagePath = path.resolve(imageFile.path);
      const imageBuffer = fs.readFileSync(imagePath);
      const imageBase64 = imageBuffer.toString("base64");

      // Gemini expects image as data inline (base64)
      const geminiPayload = {
        contents: [
          {
            parts: [
              { text: prompt },
              {
                inline_data: {
                  mime_type: imageFile.mimetype,
                  data: imageBase64,
                },
              },
            ],
          },
        ],
      };

      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey) {
        return res.status(500).json({ error: "Gemini API key not set." });
      }

      const response = await axios.post(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
        geminiPayload,
        {
          headers: {
            "Content-Type": "application/json",
            "X-goog-api-key": apiKey,
          },
        }
      );

      // Clean up uploaded file
      fs.unlinkSync(imagePath);

      // Extract and clean JSON from Gemini response
      let result = response.data;
      try {
        const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          // Remove Markdown code block and parse JSON
          const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
          if (jsonMatch && jsonMatch[1]) {
            result = JSON.parse(jsonMatch[1]);
          } else {
            // Fallback: try to parse as plain JSON
            result = JSON.parse(text);
          }
        }
      } catch (e) {
        // If parsing fails, send raw text
        result = {
          description:
            response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
            "Could not parse response.",
        };
      }
      console.log("\n\n", result, "\n\n");
      res.json(result);
    } catch (error: any) {
      res
        .status(500)
        .json({ error: error.message || "Gemini request failed." });
    }
  }
);
