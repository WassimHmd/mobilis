import {
  createModerator,
  deleteModerator,
  getAllModerators,
  getModeratorById,
  updateModerator,
} from "../../../controllers/ModeratorControllers";
import { registerMiddleware } from "../../../middleware/authMiddleware";
import { Router } from "express";

const router = Router();

/**
 * @swagger

 * /api/v1/moderator:
 *   post:
 *     summary: Register a new Moderator
 *     description: Creates a new Moderator account.
 *     tags:
 *       - Moderators
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
 *         description: Moderator registered successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
router.post("/", registerMiddleware("MODERATOR"), createModerator);

/**
 * @swagger
 * /api/v1/moderator:
 *   get:
 *     summary: Get all Moderators
 *     description: Returns a list of all Moderators.
 *     tags:
 *       - Moderators
 *     responses:
 *       200:
 *         description: List of Moderators
 *       500:
 *         description: Server error
 */
router.get("/", getAllModerators);

/**
 * @swagger
 * /api/v1/moderator/{id}:
 *   get:
 *     summary: Get a Moderator by ID
 *     description: Returns a single Moderator by ID.
 *     tags:
 *       - Moderators
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the Moderator to get.
 *     responses:
 *       200:
 *         description: Moderator by ID
 *       404:
 *         description: Moderator not found
 *       500:
 *         description: Server error
 */
router.get("/:userId", getModeratorById);

/**
 * @swagger
 * /api/v1/moderator/{id}:
 *   put:
 *     summary: Update a Moderator
 *     description: Updates a single Moderator by ID.
 *     tags:
 *       - Moderators
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the Moderator to update.
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
 *         description: Moderator updated
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
router.put("/:userId", updateModerator);

/**
 * @swagger
 * /api/v1/moderator/{id}:
 *   delete:
 *     summary: Delete a Moderator
 *     description: Deletes a single Moderator by ID.
 *     tags:
 *       - Moderators
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the Moderator to delete.
 *     responses:
 *       204:
 *         description: Moderator deleted

 *       404:
 *         description: Moderator not found
 *       500:
 *         description: Server error
 */

router.delete("/:userId", deleteModerator);

export default router;
