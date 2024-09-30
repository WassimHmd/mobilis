import { addSignature } from "@/controllers/SignatureControllers";
import { uploadFile } from "@/middleware/uploadImage";
import { Router } from "express";

const router = Router();

/**
 * @swagger
 * /api/v1/user/signature/{userId}:
 *   post:
 *     summary: Add user signature
 *     description: Adds user signature
 *     tags:
 *       - User
 *
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the User.
 *
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               signature:
 *                 type: string
 *                 format: binary
 *
 *     responses:
 *       200:
 *         description: Signature added
 *       400:
 *         description: User not found
 *
 *       500:
 *         description: Internal Server Error
 */

router.post("/signature/:userId", uploadFile("signature"), addSignature);

export default router;
