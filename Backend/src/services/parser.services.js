import textract from "textract";

export const extractText = (filePath) => {
  return new Promise((resolve, reject) => {
    textract.fromFileWithPath(filePath, (err, text) => {
      if (err) reject(err);
      else resolve(text);
    });
  });
};