import fs from "fs/promises";
import path from "path";
import pdf from "pdf-extraction";
import mammoth from "mammoth";

/**
 * Extracts raw text from PDF, DOCX/DOC, or plain text files.
 * Uses pure JS libraries without requiring native system binaries.
 *
 * @param {string} filePath - Absolute or relative path to file on disk
 * @returns {Promise<string>} - Extracted text content
 */
export const extractText = async (filePath) => {
  const ext = path.extname(filePath).toLowerCase();

  try {
    if (ext === ".pdf") {
      const dataBuffer = await fs.readFile(filePath);
      const data = await pdf(dataBuffer);
      return data.text || "";
    }

    if (ext === ".docx" || ext === ".doc") {
      const result = await mammoth.extractRawText({ path: filePath });
      return result.value || "";
    }

    // Default fallback for plain text or markdown files
    const text = await fs.readFile(filePath, "utf-8");
    return text || "";
  } catch (error) {
    console.error(`Failed to parse file (${ext}):`, error.message);
    throw new Error(`Unable to extract text from ${ext} file.`);
  }
};

export default extractText;