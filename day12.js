//Content Stream in Google GenAI

import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import express from "express";
const app = express();

dotenv.config({
  path: "./.env",
});

const googleAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.get('/', async (req,res) => {
     const response = await googleAI.models.generateContentStream({
       model: "gemini-2.5-flash",
       contents: "Tell me about Ai in details",
     });
     console.log(response.text);
     for await (const chunk of response) {
         const text = chunk.text;
         res.write(text);
     }
    res.send('___content completed___')
})


app.listen(3000);

