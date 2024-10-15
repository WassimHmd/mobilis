import {
  createBureau,
  deleteBureau,
  getAllBureaus,
  getBureauById,
  updateBureau,
} from "../../../controllers/BureauControllers";
import { registerMiddleware } from "../../../middleware/authMiddleware";
import { Router } from "express";

const router = Router();

/**
 * @swagger

 * /api/v1/bureau:
 *   post:
 *     summary: Register a new Bureau
 *     description: Creates a new Bureau account.
 *     tags:
 *       - Bureaus
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: yourpassword
 *               firstName:
 *                 type: string
 *                 example: John
 *               lastName:
 *                 type: string
 *                 example: Doe
 *               phoneNumber:
 *                 type: string
 *                 example: 202-555-1234
 *     responses:
 *       201:
 *         description: Bureau registered successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
router.post("/", registerMiddleware("BUREAU"), createBureau);

/**
 * @swagger
 * /api/v1/bureau:
 *   get:
 *     summary: Get all Bureaus
 *     description: Returns a list of all Bureaus.
 *     tags:
 *       - Bureaus
 *     responses:
 *       200:
 *         description: List of Bureaus
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Bureau'
 *       500:
 *         description: Server error
 */
router.get("/", getAllBureaus);

/**
 * @swagger
 * /api/v1/bureau/{id}:
 *   get:
 *     summary: Get a Bureau by ID
 *     description: Returns a single Bureau by ID.
 *     tags:
 *       - Bureaus
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the Bureau to retrieve.
 *     responses:
 *       200:
 *         description: Bureau found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Bureau'
 *       404:
 *         description: Bureau not found
 *       500:
 *         description: Server error
 */
router.get("/:userId", getBureauById);

/**
 * @swagger
 * /api/v1/bureau/{id}:
 *   put:
 *     summary: Update a Bureau
 *     description: Updates a single Bureau by ID.
 *     tags:
 *       - Bureaus
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the Bureau to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: yourpassword
 *               firstName:
 *                 type: string
 *                 example: John
 *               lastName:
 *                 type: string
 *                 example: Doe
 *               phoneNumber:
 *                 type: string
 *                 example: 202-555-1234
 *     responses:
 *       200:
 *         description: Bureau updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Bureau'
 *       400:
 *         description: Bad request
 *       404:
 *         description: Bureau not found
 *       500:
 *         description: Server error
 */
router.put("/:userId", updateBureau);

/**
 * @swagger
 * /api/v1/bureau/{id}:
 *   delete:
 *     summary: Delete a Bureau
 *     description: Deletes a single Bureau by ID.
 *     tags:
 *       - Bureaus
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the Bureau to delete.
 *     responses:
 *       204:
 *         description: Bureau deleted
 *       404:
 *         description: Bureau not found
 *       500:
 *         description: Server error
 */
router.delete("/:userId", deleteBureau);

export default router;
