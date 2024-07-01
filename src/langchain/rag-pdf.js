import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatOllama } from "@langchain/community/chat_models/ollama";
import { OllamaEmbeddings } from "@langchain/community/embeddings/ollama";
import { FaissStore } from "@langchain/community/vectorstores/faiss";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

// 1. Initialize the models
const model = new ChatOllama({ model: "phi3" });
const embeddings = new OllamaEmbeddings({ model: "all-minilm:l6-v2" });

// 2. Load PDF document and split it into smaller chunks
const loader = new PDFLoader("terms-of-service.pdf", { splitPages: false });
const pdfDocument = await loader.load();
const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000, chunkOverlap: 100 });
const documents = await splitter.splitDocuments(pdfDocument);

// 3. Put the documents into a vector store and convert them to vectors
const store = await FaissStore.fromDocuments(documents, embeddings);

// 4. Create the RAG chain that retrieves and combines the prompt with the documents
const combineDocsChain = await createStuffDocumentsChain({
  llm: model,
  prompt: ChatPromptTemplate.fromMessages([
    ["system", "You're a helpful assistant"],
    ["human", "Answer the question: {input}\nusing the following documents:\n\n{context}"],
  ]),
});

const chain = await createRetrievalChain({
  retriever: store.asRetriever(),
  combineDocsChain,
});

// 5. Generate the result
const response = await chain.invoke({ input: "What's our mission?" });
console.log(response);