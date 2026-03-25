//Here in this model one we will give one input then llm give output
//and it doesnt predict from previous chat

// import { GoogleGenAI } from "@google/genai";

// const ai = new GoogleGenAI({ apiKey: "YOUR_API_KEY" });

// async function main() {
//     const response = await ai.models.generateContent({
//         models: "gemini-2.0-flash",
//         contents: "Example how AI works in a few words",
//     })
//     console.log(response.text);

// }

// main();

//Here in this model one we will give multiple input then llm give output
//and it  predict from previous chat but heare we should manually type previous chat
// here we store chat in array

// import { GoogleGenAI } from "@google/genai";

// const ai = new GoogleGenAI({ apiKey: "YOUR_API_KEY" });

// async function main() {
//   const response = await ai.models.generateContent({
//     models: "gemini-2.0-flash",
//     contents: [
//       {
//         role: "user", //user input
//         parts: [{ text: "hi i am trapti patel" }],
//       },
//       {
//         role: "model", // model output
//         parts: [{ text: "hi trapit nice to meet you" }],
//       },
//       {
//         role: "user", //user input
//         parts: [{ text: "what is my name" }],
//       },
//     ],//here like we give previous chatto llm
//   });
//   console.log(response.text);
// }

// main();



//Here we will doesnt type manually previous chat we will store it in history array


// import { GoogleGenAI } from "@google/genai";
// import readlineSync from "readline-sync"
// const ai = new GoogleGenAI({ apiKey: "YOUR_API_KEY" });
// const History = [];
// async function Chatting(userProblem) {

//     History.push({
//       role: "user",
//       parts: [{ text: userProblem }],
//     });
//   const response = await ai.models.generateContent({
//     models: "gemini-2.0-flash",
//     contents:History//here like we give previous chatto llm
//   });
//     History.push({
//         role: "model",
//         parts:[{text:response.text}]
//     })
    
//     console.log("\n");
//     console.log(response.text);
    
// }

// async function main() {
//     const userProblem = readlineSync.question("ASK me anything.....");
//     await Chatting(userProblem);
//     main();
// }


// main();


//Wothout Creating History Array Manually

import { GoogleGenAI } from "@google/genai";
import readlineSync from "readline-sync";
const ai = new GoogleGenAI({ apiKey: "YOUR_API_KEY" });

const chat = ai.chats.create({
    model: "gemini-2.0-flash",
    history:[]
})



async function main() {
  const userProblem = readlineSync.question("ASK me anything.....");
    const response = await chat.sendMessage({
      message: userProblem,
    });
    console.log(response.text);
    
  main();
}

main();

