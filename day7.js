import OpenAI from "openai";
import dotenv from "dotenv";
import { createReadStream,writeFileSync } from "fs"

//convert audio to text

dotenv.config();

const client = new OpenAI({ apiKey: process.env.Open_ai_key });


async function main() {
    const TextResponse =await client.audio.transcriptions.create({
        model: "whisper-1",
        file: createReadStream('speech.mp3'),// pass here audio file path
        language:'en'
    })
    console.log(TextResponse.text);
    const rawText = TextResponse.text;
    writeFileSync('audioText.txt',rawText, 'utf-8');
}

main();
