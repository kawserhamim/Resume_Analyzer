import fs from "fs-extra";

export const deleteFile = async (filePath) => {
  try {
    await fs.remove(filePath);
  } catch (err) {
    console.error("File delete error:", err);
  }
};