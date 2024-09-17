import { addSignature } from "@/controllers/SignatureControllers";
import { uploadFile } from "@/middleware/uploadImage";
import { Router } from "express";

const router = Router();

router.post("/signature/:userId", uploadFile("signature"), addSignature)

export default router