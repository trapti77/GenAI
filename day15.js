//Generate image with genai
//1) Use image-4.0-generate-001
//2)Get response base64
//3)Convert base64 to buffer and store image
//4)Take prompt from UI

import { GoogleGenAI } from "@google/genai";
import express from "express";
import dotenv from "dotenv";
import { writeFileSync } from "fs";
const GoogleAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

dotenv.config();

const app = express();
app.use(express.urlencoded({ extended: true }));

app.get("/image", async (req, res) => {
  res.send(
    `
        <form action='/generate' method="POST">
        <input type="text" name="imgText"></input>
        <button>generate</button>
        </form>
        `,
  );
});

app.post("/generate", async (req, res) => {
  const prompt = req.body.imgText;
  await main(prompt);
  res.send("image generated success");
});

async function main(prompt) {
  const response = await GoogleAI.models.generateImages({
    model: "imagen-4.0-generate-001",
    prompt: prompt,
    config: {
      numberOfImages: 1,
    },
  });
  //   console.log(response.generatedImages[0].image.imageBytes);
  const imgBase64 = response.generatedImages[0].image.imageBytes;
  // console.log(imgBase64);

  const buffer = Buffer.from(imgBase64, "base64");
  writeFileSync("cat.png", buffer);
}


app.listen(3000);