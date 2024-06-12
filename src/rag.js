import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OllamaEmbeddings } from "@langchain/community/embeddings/ollama";
import { ChatOllama } from "@langchain/community/chat_models/ollama";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { pull } from "langchain/hub";
import {
  RunnablePassthrough,
  RunnableSequence,
} from "@langchain/core/runnables";
import { formatDocumentsAsString } from "langchain/util/document";

// 1. Load
const pTagSelector = "p";
const loader = new CheerioWebBaseLoader(
  "https://lilianweng.github.io/posts/2023-06-23-agent/",
  {
    selector: pTagSelector,
  }
);

const docs = await loader.load();

// console.log(docs[0].pageContent.length);

// 2. Split
const textSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 200,
});
const allSplits = await textSplitter.splitDocuments(docs);

// console.log(allSplits.length);
// console.log(allSplits[0].pageContent.length);

// 3. Store
const vectorStore = await MemoryVectorStore.fromDocuments(
  allSplits,
  new OllamaEmbeddings({
    model: "nomic-embed-text", // default value
    baseUrl: "http://localhost:11434",
  })
);

// console.log(vectorStore)

// 4. Retrieval
const retriever = vectorStore.asRetriever({ k: 6, searchType: "similarity" });
const retrievedDocs = await retriever.invoke(
  "What are the approaches to task decomposition?"
);

// console.log(retrievedDocs.length);
// console.log(retrievedDocs[0].pageContent);

// 5. Generate
const llm = new ChatOllama({
  baseUrl: "http://localhost:11434",
  model: "gemma:2b",
});
// https://smith.langchain.com/hub/rlm/rag-prompt
const prompt = await pull("rlm/rag-prompt");

const ragChain = RunnableSequence.from([
  {
    context: retriever.pipe(formatDocumentsAsString),
    question: new RunnablePassthrough(),
  },
  prompt,
  llm,
  new StringOutputParser(),
]);

console.log(await ragChain.invoke("What is task decomposition?"))

// for await (const chunk of await ragChain.stream(
//   "What is task decomposition?"
// )) {
//   console.log(chunk);
// }
