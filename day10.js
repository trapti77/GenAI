//Gemini setup with key in nodejs

import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config({
    path:'./.env'
})

const googleAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function main() {
    const response =await googleAI.models.generateContent({
        model: 'gemini-2.5-flash',
        contents:'Tell me 5 fruit name'
    })
    console.log(response.text);
}

main();

