# Company Document Chatbot (RAG + Conversational Memory)

This project implements a **Retrieval-Augmented Generation (RAG) chatbot** that allows users to ask questions about a company document (PDF).
The chatbot retrieves relevant information from the document using **vector embeddings** and generates answers using an **LLM**.

The system also includes **conversation memory with automatic summarization**, allowing the chatbot to remember long conversations without exceeding token limits.

---

# Features

* 📄 **PDF document ingestion**
* ✂️ **Automatic text chunking**
* 🔎 **Semantic search using vector embeddings**
* 🧠 **Conversation memory**
* 🧾 **Automatic conversation summarization**
* ⚡ **Fast LLM inference using Groq**
* 🗄 **Vector database storage using Pinecone**

---

# Architecture Overview

The project follows a **two-stage RAG architecture**.

## Stage 1 — Document Indexing

The document is processed and stored in a vector database.

```
PDF Document
     ↓
Document Loader
     ↓
Text Chunking
     ↓
Embedding Generation
     ↓
Vector Database (Pinecone)
```

Steps:

1. Load the document (PDF).
2. Split text into chunks.
3. Generate embeddings for each chunk.
4. Store embeddings in the vector database.

---

## Stage 2 — Chatbot Interaction

When the user asks a question, the chatbot retrieves relevant document chunks and uses them to generate an answer.

```
User Question
      ↓
Vector Similarity Search
      ↓
Top Relevant Chunks
      ↓
Prompt Construction
      ↓
LLM Response Generation
```

The chatbot sends the following information to the LLM:

* System prompt
* Conversation summary
* Recent chat history
* Retrieved document context
* Current user question

---

# Project Structure

```
project/
│
├── index.js        # Runs document indexing
├── prepare.js      # Handles document loading, chunking, and embeddings
├── chat.js         # Conversational chatbot logic
│
├── ABC-PVT-LTD.pdf # Example document
│
├── package.json
└── .env
```

---

# Installation

## 1. Clone the repository

```
git clone <repository-url>
cd rag-chatbot
```

## 2. Install dependencies

```
npm install
```

Dependencies include:

* LangChain
* Pinecone client
* OpenAI embeddings
* Groq SDK

---

# Environment Variables

Create a `.env` file in the project root.

```
OPENAI_API_KEY=your_openai_key
GROQ_API_KEY=your_groq_key
PINECONE_API_KEY=your_pinecone_key
PINECONE_INDEX_NAME=your_index_name
```

---

# Step 1 — Index the Document

Run the indexing script to process the PDF and store embeddings in the vector database.

```
node index.js
```

This performs:

* PDF loading
* Text chunking
* Embedding generation
* Storage in Pinecone

---

# Step 2 — Start the Chatbot

Run the chatbot:

```
node chat.js
```

Example interaction:

```
You: Who is the CTO of the company?
Assistant: The CTO of ABC PVT LTD is Vasu Patel.

You: What does the company do?
Assistant: The company provides software consulting and AI solutions.
```

Type `bye` to exit the chatbot.

---

# Memory System

The chatbot maintains two types of memory:

## Short-Term Memory

Stores recent conversation messages.

```
messages = [
  user message,
  assistant response
]
```

This helps the chatbot understand follow-up questions.

Example:

```
User: Who founded the company?
Assistant: Rahul Mehta.

User: When did he start it?
```

The chatbot understands **"he" refers to Rahul Mehta**.

---

## Long-Term Memory (Conversation Summary)

When the conversation grows too long, old messages are summarized.

```
If messages.length > 20
```

Then:

1. The oldest messages are summarized.
2. The summary is stored in `conversationSummary`.
3. Old messages are removed.

Example summary:

```
Conversation Summary:
User asked about the founder of the company and its founding year.
Assistant provided the founder name and company details.
```

This allows the chatbot to **retain important information while reducing prompt size**.

---

# Retrieval-Augmented Generation (RAG)

The chatbot retrieves relevant document content before generating an answer.

Process:

```
User Question
      ↓
Vector Similarity Search
      ↓
Top 3 Relevant Chunks
      ↓
Context Injection into Prompt
      ↓
LLM Generates Answer
```

This ensures responses are **grounded in the document content**.

---

# Technologies Used

* Node.js
* LangChain
* Pinecone Vector Database
* OpenAI Embeddings
* Groq LLM API

---

# Future Improvements

Potential enhancements:

* Multi-document knowledge base
* Source citations with page numbers
* Hybrid search (keyword + vector search)
* Web UI interface
* Streaming responses
* Agent-based workflows

---

# Summary

This project demonstrates how to build a **production-style conversational RAG chatbot** capable of:

* Document understanding
* Semantic search
* Conversational memory
* Long conversation summarization

It provides a scalable architecture for building **AI assistants for company knowledge bases and documents**.
