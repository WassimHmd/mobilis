import {
  createNegociator,
  deleteNegociator,
  getAllNegociators,
  getNegociatorById,
  updateNegociator,
} from "@/controllers/NegociatorControllers";
import { registerMiddleware } from "@/middleware/authMiddleware";
import { Router } from "express";

const router = Router();

/**
 * @swagger
 * /api/v1/negociator:
 *   post:
 *     summary: Register a new Negociator
 *     description: Creates a new Negociator account.
 *     tags:
 *       - Negociators
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Negociator registered successfully
 *       400:
 *         description: Bad request
 */
router.post("/", registerMiddleware("NEGOCIATOR"), createNegociator);

/**
 * @swagger
 * /api/v1/negociator:
 *   get:
 *     summary: Get all Negociators
 *     description: Get all Negociators
 *     tags:
 *       - Negociators
 *     responses:
 *       200:
 *         description: All Negociators retrieved successfully
 *       404:
 *         description: No Negociators found
 */
router.get("/", getAllNegociators);

/**
 * @swagger
 * /api/v1/negociator/{id}:
 *   get:
 *     summary: Get a Negociator by id
 *     description: Get a Negociator by id
 *     tags:
 *       - Negociators
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Negociator id
 *     responses:
 *       200:
 *         description: Negociator retrieved successfully
 *       404:
 *         description: Negociator not found
 */
router.get("/:id", getNegociatorById);

/**
 * @swagger
 * /api/v1/negociator/{id}:
 *   put:
 *     summary: Update a Negociator by id
 *     description: Update a Negociator by id
 *     tags:
 *       - Negociators
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Negociator id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Negociator updated successfully
 *       404:
 *         description: Negociator not found
 */
router.put("/:id", updateNegociator);

/**
 * @swagger
 * /api/v1/negociator/{id}:
 *   delete:
 *     summary: Delete a Negociator by id
 *     description: Delete a Negociator by id
 *     tags:
 *       - Negociators
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Negociator id
 *     responses:
 *       204:
 *         description: Negociator deleted successfully
 *       404:
 *         description: Negociator not found
 */
router.delete("/:id", deleteNegociator);

export default router;
