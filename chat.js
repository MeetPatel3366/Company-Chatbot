import readline from "node:readline/promises";
import Groq from "groq-sdk";
import { vectorStore } from "./prepare.js";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SYSTEM_PROMPT = `You are an assistant for question-asnwering tasks. Use the follwing relevant pieces of retrieved context to answer the question. If you don't know the answer, say I don't know`;

const messages = [];

let conversationSummary = "";

async function summarizeConversation(oldMessages) {
  const text = oldMessages
    .map((msg) => `${msg.role}: ${msg.content}`)
    .join("\n");

  const response = await groq.chat.completions.create({
    messages: [
      { role: "system", content: "You summarize conversations." },
      {
        role: "user",
        content: `
        Summarize the following conversation briefly while keeping important facts.
        
        Conversation:${text}`,
      },
    ],
    model: "openai/gpt-oss-20b",
  });

  return response.choices[0]?.message?.content || "";
}

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
          role: "system",
          content: `Conversation Summary: ${conversationSummary}`,
        },
        ...messages,
        {
          role: "user",
          content: userQuery,
        },
      ],
      model: "openai/gpt-oss-20b",
    });

    const answer = chatCompletion.choices[0]?.message?.content || "";
    console.log(`Assistant: `, answer);

    messages.push({
      role: "user",
      content: question,
    });

    messages.push({
      role: "assistant",
      content: answer,
    });

    if (messages.length > 20) {
      const oldMessages = messages.slice(1, 11);

      const summary = await summarizeConversation(oldMessages);

      conversationSummary += "\n" + summary;

      messages.splice(1, 10);
    }
  }

  rl.close();
}

chat();
