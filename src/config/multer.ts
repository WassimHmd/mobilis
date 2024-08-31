import path from "path"
import fs from "fs"
import multer from "multer"
import cuid from "cuid"

const documentsDir = path.resolve(__dirname, '../../documents');
if (!fs.existsSync(documentsDir)) {
    fs.mkdirSync(documentsDir);
}

// Configure Multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, documentsDir);
    },
    filename: (req, file, cb) => {
        const fileExtension = path.extname(file.originalname);
        const fileName = `${cuid()}${fileExtension}`;
        cb(null, fileName);
    }
});