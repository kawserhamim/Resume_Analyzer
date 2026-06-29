import multer from "multer";
import path from "path";
import crypto from "crypto";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "src/uploads");
  },

  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const unique = crypto.randomUUID();
    cb(null, `${req.user.userId}-${unique}${ext}`);
  },
});

export const upload = multer({ storage });