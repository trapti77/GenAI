import { writeFileSync, readFileSync } from "fs";
import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

const client = new OpenAI({ apiKey: process.env.OPENAI_KEY });

export async function generateEmbedding(dataArray) {
    const response = await client.embeddings.create({
        model: "text-embedding-3-small",
        input:dataArray
    });

    return response.data;
    
}

function createFileForEmbedding(data,file) {
    const fileData = JSON.stringify(data);
    const bufferData = Buffer.from(fileData);
    writeFileSync(file,bufferData)
}

async function readFile() {
    const data = readFileSync("anyData.json");
    const dataInArray = JSON.parse(data.toString());
    let responseData = await generateEmbedding(dataInArray);
    responseData = responseData.map((Items, index) => {
        return {input:dataInArray[index],embedding:Items.embedding}
    })
    createFileForEmbedding(responseData, "animalEmbedding.json");
}