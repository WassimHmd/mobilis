import multer from "multer";
import { Request, Response, NextFunction } from "express";
import path from "path";
import fs from "fs";
import crypto from "crypto";
interface CustomRequest extends Request {
  filePath?: string;
}
const createFolderIfNotExists = (folder: string) => {
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
  }
};
const getHash = (str: string) => {
  return crypto.createHash("md5").update(str).digest("hex");
};
export const uploadFile = (folder: string) => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = path.join("uploads", folder);
      createFolderIfNotExists(uploadPath);
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const fileHash = getHash(file.originalname);

      const uploadPath = path.join(
        "uploads",
        folder,
        `${fileHash}${path.extname(file.originalname)}`
      );

      if (fs.existsSync(uploadPath)) {
        (req as CustomRequest).filePath = uploadPath;
        cb(new Error("File already exists. No need to upload again."));
      } else {
        (req as CustomRequest).filePath = uploadPath;
        cb(null, `${fileHash}${path.extname(file.originalname)}`);
      }
    },
  });

  const fileFilter = (
    req: Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback
  ) => {
    const fileTypes = /jpeg|jpg|png|gif|pdf|doc|docx|xls|xlsx/;
    const extname = fileTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = fileTypes.test(file.mimetype);

    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error("Only images, PDFs, Word, and Excel files are allowed!"));
    }
  };

  const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
  });

  return (req: Request, res: Response, next: NextFunction) => {
    const uploader = upload.single("file");

    uploader(req, res, (err: any) => {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: err.message });
      } else if (err) {
        if (err.message === "File already exists. No need to upload again.") {
          return res.status(200).json({
            message: "File already exists.",
            path: (req as CustomRequest).filePath,
          });
        }
        return res.status(400).json({ message: err.message });
      }

      (req as CustomRequest).filePath = path.join(
        "uploads",
        folder,
        req.file!.filename
      );
      next();
    });
  };
};
