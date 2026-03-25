//convert text to audio with ui

import OpenAI from "openai";
import dotenv from "dotenv";
import express from "express";
import { writeFileSync } from "fs";

const app = express();

app.use(express.urlencoded({ extended: true }));
dotenv.config();

const client = new OpenAI({ apiKey: process.env.OPENAPI_KEY });

app.get("/", (req, res) => {
  res.send(`<form action='/audio' method='post'>
        <input type="text" name="data"></input>
        <br/>
        <button>Convert in audio</button>
        </form>`);
});

app.post("/audio", async () => {
  const response = await client.audio.speech.create({
    model: "gpt-4o-mini-tts",
    input: req?.body?.data,
    voice: "coral",
  });

  const baseResponse = Buffer.from(await response.arrayBuffer());
    writeFileSync("audio.mp3", baseResponse);
    res.send('text convert to audio')
});


