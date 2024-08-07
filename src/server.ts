import express, { Request, Response } from "express";
import morgan from "morgan";
import cors from "cors";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Initialize server
const app = express();

// Initialize CORS
app.use(cors());

// Use JSON parser
app.use(express.json());

// Use logger
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  {
    flags: "a",
    encoding: "utf8",
  }
);

app.use(
  morgan("common", {
    stream: accessLogStream,
    skip: (req: Request, res: Response) => res.statusCode < 500,
  })
);

// Run server
const port: number = parseInt(process.env.PORT || "3000", 10);
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

export default app;
