import {
  createDocument,
  deleteDocument,
  downloadDocumentById,
  getAllDocuments,
  getDocumentById,
  updateDocument,
} from "../../../controllers/DocumentControllers";
import { Router } from "express";

const router = Router();

/**
 * @swagger
 * /api/v1/documents:
 *   post:
 *     summary: Create a Document
 *     description: Creates a new Document.
 *     tags:
 *       - Documents
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 example: "SA1"
 *               data:
 *                 type: object
 *                 example: { foo: "bar" }
 *               siteId:
 *                 type: string
 *                 example: "e0c3c5f1-6e45-4b1f-8a16-9f2c7c00a6a6"
 *
 *     responses:
 *       201:
 *         description: Document created successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal Server Error
 */

router.post("/", createDocument);

/**
 * @swagger
 * /api/v1/documents:
 *   get:
 *     summary: Get all Documents
 *     description: Returns a list of all Documents.
 *     tags:
 *       - Documents
 *     responses:
 *       200:
 *         description: List of Documents
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Document'
 *       500:
 *         description: Internal Server Error
 */

router.get("/", getAllDocuments);

/**
 * @swagger
 * /api/v1/documents/{id}:
 *   get:
 *     summary: Get a Document by ID
 *     description: Returns a single Document by ID.
 *     tags:
 *       - Documents
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the Document to retrieve.
 *     responses:
 *       200:
 *         description: Document found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Document'
 *       404:
 *         description: Document not found
 *       500:
 *         description: Internal Server Error
 */
router.get("/:id", getDocumentById);

/**
 * @swagger
 * /api/v1/documents/download/{id}:
 *   get:
 *     summary: Download a Document by ID
 *     description: Downloads a single Document by ID.
 *     tags:
 *       - Documents
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the Document to download.
 *     responses:
 *       200:
 *         description: Document found
 *         content:
 *           application/octet-stream:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: Document not found
 *       500:
 *         description: Internal Server Error
 */
router.get("/download/:id", downloadDocumentById);

/**
 * @swagger
 * /api/v1/documents/{id}:
 *   put:
 *     summary: Update a Document
 *     description: Updates a single Document by ID.
 *     tags:
 *       - Documents
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the Document to update.
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 example: "SA1"
 *               data:
 *                 type: object
 *                 example: { foo: "bar" }
 *               siteId:
 *                 type: string
 *                 example: "e0c3c5f1-6e45-4b1f-8a16-9f2c7c00a6a6"
 *
 *     responses:
 *       200:
 *         description: Document updated successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Document not found
 *       500:
 *         description: Internal Server Error
 */
router.put("/:id", updateDocument);

/**
 * @swagger
 * /api/v1/documents/{id}:
 *   delete:
 *     summary: Delete a Document
 *     description: Deletes a single Document by ID.
 *     tags:
 *       - Documents
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the Document to delete.
 *
 *     responses:
 *       204:
 *         description: Document deleted
 *       404:
 *         description: Document not found
 *       500:
 *         description: Internal Server Error
 */

router.delete("/:id", deleteDocument);

export default router;
