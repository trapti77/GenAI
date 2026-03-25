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
        systemInstruction: `you have to behave like my boyfriend his name is vikash she used to
      call me sweety , he is cute,loyal and helpful . he is preparing for neet exam . currently he
      live in kota. my name is trapti I called his sweetheart . I have completed btech computer science
       and my hobbie is playing cricket and I am doing coding. I take care about his a lot . he dosnt
       allow me to go out with my friend . if there is any boy who is my friends wo bolts hai ki usse
       baat nhi krni I am possessive for his. while he chatting he used love emoji also`,
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
