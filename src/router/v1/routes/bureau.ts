import {
  createBureau,
  deleteBureau,
  getAllBureaus,
  getBureauById,
  updateBureau,
} from "@/controllers/BureauControllers";
import { registerMiddleware } from "@/middleware/authMiddleware";
import { Router } from "express";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Bureaus
 *   description: CRUD operations for managing bureaus
 */

/**
 * @swagger
 * /bureaus:
 *   post:
 *     summary: Create a new bureau
 *     tags: [Bureaus]
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
 *         description: Bureau created successfully
 *       400:
 *         description: Bad request
 */
router.post("/", registerMiddleware("BUREAU"), createBureau);

/**
 * @swagger
 * /bureaus:
 *   get:
 *     summary: Get all bureaus
 *     tags: [Bureaus]
 *     responses:
 *       200:
 *         description: A list of bureaus
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "bureau-uuid"
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
router.get("/", getAllBureaus);

/**
 * @swagger
 * /bureaus/{id}:
 *   get:
 *     summary: Get a bureau by ID
 *     tags: [Bureaus]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Bureau ID
 *     responses:
 *       200:
 *         description: Bureau found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "bureau-uuid"
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
 *         description: Bureau not found
 *       500:
 *         description: Server error
 */
router.get("/:id", getBureauById);

/**
 * @swagger
 * /bureaus/{id}:
 *   put:
 *     summary: Update a bureau by ID
 *     tags: [Bureaus]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Bureau ID
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
 *         description: Bureau updated successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Bureau not found
 *       500:
 *         description: Server error
 */
router.put("/:id", updateBureau);

/**
 * @swagger
 * /bureaus/{id}:
 *   delete:
 *     summary: Delete a bureau by ID
 *     tags: [Bureaus]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Bureau ID
 *     responses:
 *       204:
 *         description: No content, bureau deleted successfully
 *       404:
 *         description: Bureau not found
 *       500:
 *         description: Server error
 */
router.delete("/:id", deleteBureau);

export default router;
