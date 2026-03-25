//find similarity with different input
// (1) apply sorting
//(2) find similarity for animal, birds, fruits
//(3) find similarity with syntax

import { readFileSync } from "fs";
import { generateEmbedding } from "./day19.js";

let embeddingData = readFileSync("embedding.json");

embeddingData = JSON.parse(embeddingData);
// console.log(readembedding);

// let animal = await generateEmbedding("animal");// here instead of we can add fruits, birds

// animal = animal[0].embedding;
// console.log(animal);

// you can give suggestion
let suggetion = await generateEmbedding("please tell me fruites");//like- please tell me animals, please suggest me fruits, and temm me birds

suggetion = suggetion[0].embedding;

let similarity = embeddingData.map((embeddingItem) => {
  // console.log(embeddingData.input);
  const embedding = embeddingItem.embedding;
  return (
    embedding
      // .map((emb, index) => emb[index] === animal[index])
      .map((emb, index) => emb[index] === suggetion[index])
      .reduce((a, b) => a + b, 0)
  );
});

similarity=similarity.map((item, index) => {
    console.log(similarity[index], embeddingData[index].input);
    return { value: similarity[index], input: embeddingData[index].input };
});

similarity.sort((a, b) => b.value - a.value);

console.log(similarity);
