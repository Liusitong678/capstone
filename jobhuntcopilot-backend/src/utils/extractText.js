const axios = require("axios");
const mammoth = require("mammoth");
const pdfjsLib = require("pdfjs-dist/build/pdf.js");

async function extractResumeText(url) {
  try {
    const response = await axios.get(url, {
      responseType: "arraybuffer",
    });

    const buffer = Buffer.from(response.data);

    const isPDF = buffer[0] === 0x25 && buffer[1] === 0x50; // %PDF header
    const isDOCX = buffer[0] === 0x50 && buffer[1] === 0x4B; // PK header

    if (isPDF) {
      console.log("📄 Processing PDF using pdfjs-dist...");

      // Convert Buffer to Uint8Array
      const uint8array = new Uint8Array(buffer);

      const pdf = await pdfjsLib.getDocument({ data: uint8array }).promise;
      let text = "";

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        text += content.items.map(item => item.str).join(" ") + " ";
      }

      return text.trim();
    }

    if (isDOCX) {
      console.log("📄 Processing DOCX using mammoth...");
      const docx = await mammoth.extractRawText({ buffer });
      return docx.value;
    }

    console.log("❌ Unsupported file type");
    return "";

  } catch (err) {
    console.error("❌ Text extraction failed:", err);
    return "";
  }
}

module.exports = extractResumeText;
