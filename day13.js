//Read and Understand With GenAI

import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { readFileSync } from "fs";

dotenv.config({
  path: "./.env",
});

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const base64Img = readFileSync("Screenshot (1231).png", {
  encoding: "base64",
});
async function main() {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [
      {
        inlineData: {
          mimeType: "image/png",
          data: base64Img,
        },
      },
      { text: "read Text from this image" },
    ],
  });
  console.log(response.text);
}

main();
