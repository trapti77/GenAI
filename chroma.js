//Setup chroma DB with Nodejs
//(1) Create account on trychroma.com
//(2) create Database
//(3) install chroma package in nodejs and setup config
//(4) connect Database
//(5) create collection in chroma db through nodejs

//Add Data in chroma DB Collection with nodejs
//(1) Add data without embedding
//(2) use openAI to generate embedding
//(3) add data with embedding

import { CloudClient } from "chromadb";
import dotenv from "dotenv";
import { generateEmbedding } from "./day19.js";

dotenv.config();

const client = new CloudClient({
  apiKey: process.env.CHROMA_API_KEY,
  tenant: process.env.CHROMA_TENANT,
  database: process.env.CHROMA_DATABASE,
});

//WITHOUT EMBEDDING
// async function main() {
//   //   const collection=await client.createCollection({
//   //     name: "animal",
//     //   });
//     //if collection already exist
//   const collection = await client.getOrCreateCollection({ // can also use getCollection
//     name: "animal",
//   });
//   collection.add({
//     ids: ["2"],
//     documents: ["dog"],
//     embeddings: [[1, -1,-1,-1]],
//   });
// }

// main();

//WITH EMBEDDING DATA

async function main() {
  const colorsData = generateEmbedding("green");
  console.log(colorsData);

  const collection = await client.getOrCreateCollection({
    name: "colors",
  });
  collection.add({
    ids: ["1"],
    documents: ["green"],
    embeddings:[colorsData[0].embedding] ,
  });
}

// main();


//VECTOR similarity search in chroma DB with Nodejs
//(1) Get collection instance
//(2) Generate embedding for query
//(3) Apply Query on collection

async function findSimilarity() {
  const colors = await client.getCollection({
    name: 'colors'
  });
  const query = await generateEmbedding('get me colors'); //or we can query any thing like get me a fruits, give 2 colors  

  const result = await colors.query({
    queryEmbeddings: [query[0].embedding],
    nResults:1// this result like how many result you want 
  })
  console.log(result);
}

findSimilarity();