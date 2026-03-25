//1) what is embedding
//how it work with machine learning

//Embedding -- convert data (words or images , or anything) into numbers so a computer can understand their meaning.
//              vector help them to make relation btw data compare , categories etc.
//              we can store embedding in vector databases
//            like --  pinecode, weaviate, milvus,Qdrant ,FAISS
//   some operations like ---   (1) Insert  (2)  similarity search  (3)  distance metrics (4) update (5) delete (6) filter

import OpenAI from "openai";
import { configDotenv } from "dotenv";
import {writeFileSync} from "fs"

const client = new OpenAI({ apiKey: process.env.OPENAI_KEY });

async function main() {
  const response =await  client.embeddings.create({
    model: "text-embedding-3-small",
    input: "dog",
  });
    console.log(response.data);
    writeFileSync("dog.json", response.data[0].embedding);
}

main();
