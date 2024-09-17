import multer from "multer";
import { Request, Response, NextFunction } from "express";
import path from "path";
import fs from "fs";
import crypto from "crypto";

type FileFolders = "site" | "step" | "signature"

interface CustomRequest extends Request {
  images?: Record<string, any>;
}

const createFolderIfNotExists = (folder: string) => {
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
  }
};
const getHash = (str: string) => {
  return crypto.createHash("md5").update(str).digest("hex");
};
export const uploadFile = (folder: FileFolders) => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = path.join("uploads", folder);
      createFolderIfNotExists(uploadPath);
      cb(null, uploadPath);
    },
    filename: (req: CustomRequest, file, cb) => {
      const fileHash = getHash(file.originalname);

      const uploadPath = path.join(
        "uploads",
        folder,
        `${fileHash}${path.extname(file.originalname)}`
      );

      if (fs.existsSync(uploadPath)) {
        if (!req.images) req.images = {};
        req.images[file.fieldname] = uploadPath;
        console.log("File already exists.");
        cb(null, `${fileHash}${path.extname(file.originalname)}`);
        // cb(new Error("File already exists. No need to upload again."));
      } else {
        if (!req.images) req.images = {};
        req.images[file.fieldname] = uploadPath;
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

  return (req: CustomRequest, res: Response, next: NextFunction) => {
    const uploader = upload.any();

    uploader(req, res, (err: any) => {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: err.message });
      } else if (err) {
        if (err.message === "File already exists. No need to upload again.") {
          // console.log("File already exists.");
        } else {
          return res.status(400).json({ message: err.message });
        }
      }

      const fields: { [key: string]: any } = {};

      try {
        if (Array.isArray(req.files)) {
          for (const file of req.files) {
            if (!fields[file.fieldname]) {
              fields[file.fieldname] = [];
            }
            fields[file.fieldname].push(file.path);
          }
        }
        for (const field in fields) {
          (req.images as Record<string, any>)[field] = fields[field];
        }
      } catch (err: any) {
        console.error(err);
        return res.status(400).json({ message: err.message });
      }

      next();
    });
  };
};
