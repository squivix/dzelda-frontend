import path from "path-browserify";
import * as pdfjs from "pdfjs-dist";
import ePub from "epubjs";
import {removeHashFromHref} from "@/utils.js";

async function readPdfDocument(file: File) {
    const pdfData: ArrayBuffer = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as ArrayBuffer);
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
    });
    return await pdfjs.getDocument({data: pdfData}).promise;
}

export async function extractFileTitle(file: File): Promise<string> {
    const baseFileName = path.parse(file.name).name;
    const extension = path.parse(file.name).ext?.toLowerCase();

    if (extension === ".pdf") {
        const pdfDocument = await readPdfDocument(file);
        const metaData = (await pdfDocument.getMetadata()).info as Record<string, any>;
        return metaData["Title"] || baseFileName;
    } else {
        const book = ePub(file as any);
        const metadata = await book.loaded.metadata;
        return metadata.title || baseFileName;
    }
}

export async function extractFileContent(file: File) {
    const extension = path.parse(file.name).ext?.toLowerCase();

    if (extension === ".pdf") {
        const pdfDocument = await readPdfDocument(file);

        let fullText = "";
        for (let pageNumber = 1; pageNumber <= pdfDocument.numPages; pageNumber++) {
            const page = await pdfDocument.getPage(pageNumber);
            const textContent = await page.getTextContent();

            let lastY, pageText = "";
            for (let textItem of textContent.items) {
                if (!("str" in textItem))
                    continue;
                if (!lastY || lastY === textItem.transform[5])
                    pageText += textItem.str;
                else
                    pageText += "\n" + textItem.str;
                lastY = textItem.transform[5];
            }
            fullText += pageText;
        }
        return fullText;
    } else {
        const book = ePub(file as any);
        const navigation = await book.loaded.navigation;
        const hrefSet = new Set(navigation.toc.map(c => removeHashFromHref(c.href)));
        let fullText = "";
        for (const href of hrefSet) {
            const item = book.spine.get(href);
            const contents = await item.load(book.load.bind(book));
            fullText += contents.querySelector("body")!.textContent + "\n\n";
        }
        return fullText;
    }
}
