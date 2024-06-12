import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

const loader = new PDFLoader("files/file-sample_150kB.pdf");

const docs = await loader.load();

console.log(docs)