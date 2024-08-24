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
 * tags:
 *   name: Negociators
 *   description: CRUD operations for managing negociators
 */

/**
 * @swagger
 * /negociators:
 *   post:
 *     summary: Create a new negociator
 *     tags: [Negociators]
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
 *                 type: string
 *                 example: "user-uuid"
 *     responses:
 *       201:
 *         description: Negociator created successfully
 *       400:
 *         description: Bad request
 */
router.post("/", registerMiddleware("NEGOCIATOR"), createNegociator);

/**
 * @swagger
 * /negociators:
 *   get:
 *     summary: Get all negociators
 *     tags: [Negociators]
 *     responses:
 *       200:
 *         description: A list of negociators
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "negociator-uuid"
 *                   userId:
 *                     type: string
 *                     example: "user-uuid"
 *                   user:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "user-uuid"
 *                       fullName:
 *                         type: string
 *                         example: "John Doe"
 *                   sites:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           example: "site-uuid"
 *                         name:
 *                           type: string
 *                           example: "Site A"
 *       500:
 *         description: Server error
 */
router.get("/", getAllNegociators);

/**
 * @swagger
 * /negociators/{id}:
 *   get:
 *     summary: Get a negociator by ID
 *     tags: [Negociators]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Negociator ID
 *     responses:
 *       200:
 *         description: Negociator found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "negociator-uuid"
 *                 userId:
 *                   type: string
 *                   example: "user-uuid"
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "user-uuid"
 *                     fullName:
 *                       type: string
 *                       example: "John Doe"
 *                 sites:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "site-uuid"
 *                       name:
 *                         type: string
 *                         example: "Site A"
 *       404:
 *         description: Negociator not found
 *       500:
 *         description: Server error
 */
router.get("/:id", getNegociatorById);

/**
 * @swagger
 * /negociators/{id}:
 *   put:
 *     summary: Update a negociator by ID
 *     tags: [Negociators]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Negociator ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "user-uuid"
 *               otherField:
 *                 type: string
 *                 example: "Some value"
 *     responses:
 *       200:
 *         description: Negociator updated successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Negociator not found
 *       500:
 *         description: Server error
 */
router.put("/:id", updateNegociator);

/**
 * @swagger
 * /negociators/{id}:
 *   delete:
 *     summary: Delete a negociator by ID
 *     tags: [Negociators]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Negociator ID
 *     responses:
 *       204:
 *         description: No content, negociator deleted successfully
 *       404:
 *         description: Negociator not found
 *       500:
 *         description: Server error
 */
router.delete("/:id", deleteNegociator);

export default router;
