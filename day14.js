//Read image through GenAI with UI
import { GoogleGenAI } from "@google/genai";
import express from "express";
import multer from "multer";
import dotenv from "dotenv";
import { readFileSync } from "fs";

const app = express();

dotenv.config({
  path: "./.env",
});

// ✅ correct multer config
const upload = multer({ dest: "uploads/" });

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.get("/", (req, res) => {
  res.send(`
    <form action='/upload' method='post' enctype='multipart/form-data'>
        <input type="file" name="image"/>
        <button type="submit">Read Image</button>
    </form>
  `);
});

app.post("/upload", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.send("No file uploaded");
    }

    const filePath = req.file.path;

    const base64Img = readFileSync(filePath, {
      encoding: "base64",
    });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          inlineData: {
            mimeType: req.file.mimetype,
            data: base64Img,
          },
        },
        { text: "Read text from this image" },
      ],
    });

    res.send(response.text);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error processing image");
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});