//Generate video with GENAI
//1) use veo-3.0-generate-001
//2)use loop to show progress and check status
//3) use ai method to store video

import { GoogleGenAI, Operations } from "@google/genai";
import express from "express";
import dotenv from "dotenv";
import { writeFileSync } from "fs";
const GoogleAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

dotenv.config();

const app = express();
app.use(express.urlencoded({ extended: true }));

app.get("/video", async (req, res) => {
  res.send(
    `
        <form action='/generate' method="POST">
        <input type="text" name="videoText"></input>
        <button>generate</button>
        </form>
        `,
  );
});

app.post("/generate", async (req, res) => {
  const prompt = req.body.videoText;
  await main(prompt);
  res.send("video generated success");
});

async function main(prompt) {
  let operation = await GoogleAI.models.generateVideos({
    model: "veo-3.1-generate-preview",
    prompt: prompt,
    config: {
      aspectRatio: "9:16",
    },
  });
  while (!operation.done) {
    console.log("please wait . video is getting ready");
    await new Promise((resolve) => setTimeout(resolve, 1000));
    operation=await GoogleAI.operations.getVideosOperation({
      operation: operation,
    });
    }
    GoogleAI.files.download({
        file: operation.response.generatedVideos[0].video,
        downloadPath:"video.mp4"
    })
}

app.listen(3000);
