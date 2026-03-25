//In-Memory Database in LangChain
//(1) what is in-memory database means--Storing data for some time like - redis
//(2) define data which we want to store in memory
//(3) store data
//(4) check data stored or not
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OpenAIEmbeddings } from "@langchain/openai";
import { Document } from "langchain/core/document";
import dotenv from "dotenv";

dotenv.config();
const myData = [
  "my name is trapti patel",
  "my age is 22 year old",
  "i live in maihar",
];

// async function main() {
//   const vectorStore = new MemoryVectorStore(new OpenAIEmbeddings());
//   vectorStore.addDocuments(
//     myData.map((item) => new Document({ pageContent: item })),
//   );
// }

// main();

//Search in in-memory DB in langchain
//(1) define config for retriever or search
//(2) define question
//(3)get result as per question

// const question = "what is your name";
// async function main() {
//   const vectorStore = new MemoryVectorStore(new OpenAIEmbeddings());
//   vectorStore.addDocuments(
//     myData.map((item) => new Document({ pageContent: item })),
//   );

//   const retriever = vectorStore.asRetriever({
//     k: 1, // kitne result chahiye 1 -mean ek result , yadi kuchh nhi hoga to sare result ayenge
//   });
//   const results = await retriever._getRelevantDocuments(question);
//   // console.log(results);
//   const resultDoc = results.map((item) => item.pageContent);
//   console.log(resultDoc);
// }

// main();

//Update and Delete in Langchain db

const question = "what is your name";
async function main() {
  //start data store
  let vectorStore = new MemoryVectorStore(new OpenAIEmbeddings());
  vectorStore.addDocuments(
    myData.map((item) => new Document({ pageContent: item })),
  );
  //end data store

  //start data retrieve

  const retriever = vectorStore.asRetriever({
    k: 1, // kitne result chahiye 1 -mean ek result , yadi kuchh nhi hoga to sare result ayenge
  });
  const results = await retriever._getRelevantDocuments(question);
  // console.log(results);
  const resultDoc = results.map((item) => item.pageContent);
  console.log(resultDoc);

  //end data retrieve

  //start data update
  vectorStore.addDocuments([
    new Document({ pageContent: "I am learning gen AI" }),
  ]);
  const updatedresults = await retriever._getRelevantDocuments(
    "what you are learning",
  );
  console.log(updatedresults[0].pageContent);

  //Remove Data

    const filterData = myData.filter((item) =>
      !item.includes("i live in maihar"),
    );
 vectorStore = new MemoryVectorStore(new OpenAIEmbeddings());
  vectorStore.addDocuments(
    filterData.map((item) => new Document({ pageContent: item })),
  );
}

main();
