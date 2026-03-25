import { ChatOpenAI } from "@langchain/openai";
import dotenv from "dotenv";
import { response } from "express";

dotenv.config();
const model = new ChatOpenAI({
  model: "gpt-4o-mini",
  openAIApiKey: process.env.OPENAI_API_KEY,
});

//---------------------------INVOKE METHOD--------------------------------

// async function chat() {
//   const response = await model.invoke("Tell me five fruits name");
//   console.log(response.content);
// }

//---------------------------BATCH METHOD-----------------------------------

// async function chat() {
//     const response = await model.batch([
//         "top 5 country name",
//         "top 5 cricketers name",
//         "top 5 state name",
//         "top five place name in india to travel"
//   ]);
// for (let i = 0; i < response.writableLength; i++){
//     console.log(response[i].content);
// }
// }

//------------------------------STREAM METHOD -------------------------------------

// async function chat() {
//     const response = await model.model("top 5 cricketers name");
//    for (await const chunk of reaponse){
// console.log(chunk.content);
// }
// }

chat();

// | Feature    | invoke()      | batch()            | stream()         |
// | ---------- | ------------- | ------------------ | ---------------- |
// | Input type | Single        | Multiple           | Single           |
// | Speed      | Normal        | Fast (parallel)    | Real-time        |
// | Output     | Full response | Array of responses | Chunked response |
// | Use case   | API calls     | Bulk jobs          | Chat UI          |
