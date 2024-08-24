import {
  createModerator,
  deleteModerator,
  getAllModerators,
  getModeratorById,
  updateModerator,
} from "@/controllers/ModeratorControllers";
import { registerMiddleware } from "@/middleware/authMiddleware";
import { Router } from "express";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Moderators
 *   description: CRUD operations for managing moderators
 */

/**
 * @swagger
 * /moderators:
 *   post:
 *     summary: Create a new moderator
 *     tags: [Moderators]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               region:
 *                 type: string
 *                 example: "North"
 *     responses:
 *       201:
 *         description: Moderator created successfully
 *       400:
 *         description: Bad request
 */
router.post("/", registerMiddleware("MODERATOR"), createModerator);

/**
 * @swagger
 * /moderators:
 *   get:
 *     summary: Get all moderators
 *     tags: [Moderators]
 *     responses:
 *       200:
 *         description: A list of moderators
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "moderator-uuid"
 *                   region:
 *                     type: string
 *                     example: "North"
 *                   user:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "user-uuid"
 *                       fullName:
 *                         type: string
 *                         example: "John Doe"
 *       500:
 *         description: Server error
 */
router.get("/", getAllModerators);

/**
 * @swagger
 * /moderators/{id}:
 *   get:
 *     summary: Get a moderator by ID
 *     tags: [Moderators]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Moderator ID
 *     responses:
 *       200:
 *         description: Moderator found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "moderator-uuid"
 *                 region:
 *                   type: string
 *                   example: "North"
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "user-uuid"
 *                     fullName:
 *                       type: string
 *                       example: "John Doe"
 *       404:
 *         description: Moderator not found
 *       500:
 *         description: Server error
 */
router.get("/:id", getModeratorById);

/**
 * @swagger
 * /moderators/{id}:
 *   put:
 *     summary: Update a moderator by ID
 *     tags: [Moderators]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Moderator ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               region:
 *                 type: string
 *                 example: "South"
 *               otherField:
 *                 type: string
 *                 example: "Some value"
 *     responses:
 *       200:
 *         description: Moderator updated successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Moderator not found
 *       500:
 *         description: Server error
 */
router.put("/:id", updateModerator);

/**
 * @swagger
 * /moderators/{id}:
 *   delete:
 *     summary: Delete a moderator by ID
 *     tags: [Moderators]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Moderator ID
 *     responses:
 *       204:
 *         description: No content, moderator deleted successfully
 *       404:
 *         description: Moderator not found
 *       500:
 *         description: Server error
 */
router.delete("/:id", deleteModerator);

export default router;
