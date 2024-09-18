import { createDocument, deleteDocument, downloadDocumentById, getAllDocuments, getDocumentById, updateDocument } from "@/controllers/DocumentControllers";
import { Router } from "express";

const router = Router()

router.post("/", createDocument)

router.get("/", getAllDocuments)
router.get("/:id", getDocumentById)
router.get("/download/:id", downloadDocumentById)

router.put("/:id", updateDocument)

router.delete("/:id", deleteDocument)

export default router
