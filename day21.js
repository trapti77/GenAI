//Find similarity in embedding for animals
import { readFileSync } from "fs";
import { generateEmbedding } from "./day19.js";

let embeddingData = readFileSync("embedding.json");

embeddingData = JSON.parse(embeddingData);
// console.log(readembedding);

let animal = await generateEmbedding("animal");
animal = animal[0].embedding;
// console.log(animal);

const similarity = embeddingData.map((embeddingItem) => {
  // console.log(embeddingData.input);
  const embedding = embeddingItem.embedding;
  return embedding
    .map((emb, index) => emb[index] === animal[index])
    .reduce((a, b) => a + b, 0);
});

similarity.map((item, index) => {
  console.log(similarity[index], embeddingData[index].input);
});
// console.log(similarity);
