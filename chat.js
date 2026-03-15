import readline from "node:readline/promises";
import Groq from "groq-sdk";
import { vectorStore } from "./prepare.js";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function chat() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  while (true) {
    const question = await rl.question("You: ");

    if (question === "bye") {
      break;
    }

    // retrieval
    const relevantChunks = await vectorStore.similaritySearch(question, 3);
    console.log("relevantChunks: ", relevantChunks);

    const context = relevantChunks
      .map((chunk) => chunk.pageContent)
      .join("\n\n");
    console.log("context: ", context);

    const SYSTEM_PROMPT = `You are an assistant for question-asnwering tasks. Use the follwing relevant pieces of retrieved context to answer the question. If you don't know the answer, say I don't know`;

    const userQuery = `Question: ${question}
    Relevant context: ${context}
    Answer:`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: userQuery
        },
      ],
      model: "openai/gpt-oss-20b",
    });

    console.log(`Assistant: `,chatCompletion.choices[0]?.message?.content || "");
  }

  rl.close();
}

chat();
