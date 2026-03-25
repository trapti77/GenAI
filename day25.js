// VECTOR SIMILARITY SEARCH FOR USER DATA in chroma db
//(1) make new collection
//(2) generate embedding
//(3) add document and embedding in collection
//(4) display result

import { CloudClient } from "chromadb";
import dotenv from "dotenv";
// import { generateEmbedding } from "./day19.js";

dotenv.config();

const client = new CloudClient({
  apiKey: process.env.CHROMA_API_KEY,
  tenant: process.env.CHROMA_TENANT,
  database: process.env.CHROMA_DATABASE,
});

//WITHOUT EMBEDDING
// async function main() {
//   const collection = await client.getOrCreateCollection({ // can also use getCollection
//     name: "users",
//   });
//   collection.add({
//     ids: ["2"],
//     documents: ["trapti"],
//     embeddings: [[2,2,2,2]],
//   });
// }

// main();

//WITH EMBEDDING DATA

async function main() {
  const userData = generateEmbedding([
    "Trapti is doing job Oracle also as Software engineer",
    "Trapti is 30 years old",
    "Trapti live in gurgaon",
    "Trapti own a tata car",
    "Trapti is your friend",
  ]);
  console.log(userData);

  const collection = await client.getOrCreateCollection({
    name: "users",
  });
  collection.add({
    ids: ["1", "2", "3", "4", "5"],
    documents: [
      "Trapti is doing job Oracle also as Software engineer",
      "Trapti is 30 years old",
      "Trapti live in gurgaon",
      "Trapti own a tata car",
      "Trapti is your friend",
    ],
    embeddings: [
      userData.map((item) => {
        return item.embedding;
      }),
    ],
  });
}

// main()


async function findSimilarity() {
  const userData = await client.getCollection({
    name: "users",
  });
  const query = await generateEmbedding("who is trapti"); //or we can query any thing like get me a fruits, give 2 colors

  const result = await userData.query({
    queryEmbeddings: [query[0].embedding],
    nResults: 1, // this result like how many result you want
  });
  console.log(result);
}

findSimilarity();
