import express, { Request, Response } from "express";
import morgan from "morgan";
import cors from "cors";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import routes from "./router/v1";
import setupSwagger from "./config/swagger";
// FIXME: change usage so the log of database connection is printed on here(low priority)
import { PrismaClient } from "@prisma/client";
// Load environment variables
dotenv.config();

// Initialize server
const app = express();

// Initialize CORS
app.use(cors());

// Initialize Swagger
setupSwagger(app);

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

app.use("/api/v1/", routes);

// Run server
const port: number = parseInt(process.env.PORT || "3000", 10);
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

export default app;