// find answers from data using embedding

//Questions like-
// [
//   "Trapti is doing job Oracle also as Software engineer",
//   "Trapti is 30 years old",
//   "Trapti live in gurgaon",
//   "Trapti own a tata car",
//   "Trapti is your friend",
// ];

//Learn
//Generate Embedding for data
//Generate embedding for questions
//Display match


import { readFileSync } from "fs";
import { generateEmbedding } from "./day19.js";

let embeddingData = readFileSync("QuestEmbedding.json");

embeddingData = JSON.parse(embeddingData);

let Question = await generateEmbedding("what is my age");//like- please tell me animals, please suggest me fruits, and temm me birds

Question = Question[0].embedding;

let similarity = embeddingData.map((embeddingItem) => {
  console.log(embeddingData.input);
  const embedding = embeddingItem.embedding;
  return (
    embedding
      .map((emb, index) => emb[index] === Question[index])
      .reduce((a, b) => a + b, 0)
  );
});

similarity=similarity.map((item, index) => {
    console.log(similarity[index], embeddingData[index].input);
    return { value: similarity[index], input: embeddingData[index].input };
});

similarity.sort((a, b) => b.value - a.value);

console.log(similarity);


