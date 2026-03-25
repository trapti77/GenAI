//Generate Image with open ai in nodejs app
//for good and to genearte high quanlity images use  gpt-image-1 model
import OpenAI from "openai";
import dotenv from "dotenv";
import {writeFileSync} from "fs"

dotenv.config();

const client = new OpenAI({ apiKey: process.env.Open_ai_key });


async function main() {
    const response =await client.images.generate({
        model: "dall-e-2",
        prompt: "generate image for cat in bus",
        size:"512x512",
        response_format:"b64_json",
        n:1
    })
    console.log(response);
    const rawImage = response.data[0].b64_json;
    const path = "./generativeImg.png";
    const buffer = Buffer.from(rawImage, "base64");
    writeFileSync(path, buffer);
    console.log("image is saved and path"+path); 
}

main();
