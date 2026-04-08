import { GoogleGenAI } from "@google/genai";
import readlineSync from "readline-sync"
const ai = new GoogleGenAI({ apiKey: "YOUR_API_KEY" });
const History = [];
async function Chatting(userProblem) {

    History.push({
      role: "user",
      parts: [{ text: userProblem }],
    });
  const response = await ai.models.generateContent({
    models: "gemini-2.0-flash",
    contents: History,
    config: {
        systemInstruction: `I am trapti patel`,
    },
  });
    History.push({
        role: "model",
        parts:[{text:response.text}]
    })

    console.log("\n");
    console.log(response.text);

}

async function main() {
    const userProblem = readlineSync.question("ASK me anything.....");
    await Chatting(userProblem);
    main();
}

main();
