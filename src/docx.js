import { DocxLoader } from "@langchain/community/document_loaders/fs/docx";

const loader = new DocxLoader("files/file-sample_100kB.docx");

const docs = await loader.load();

console.log(docs)