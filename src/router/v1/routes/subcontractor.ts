import { Router } from "express";
import {
  createSubContractor,
  getSubContractorById,
  getAllSubContractors,
  updateSubContractor,
  deleteSubContractor,
} from "../../../controllers/SubcontractorControllers";
import { registerMiddleware } from "@/middleware/authMiddleware";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Subcontractors
 *   description: CRUD operations for managing subcontractors
 */

/**
 * @swagger
 * /subcontractors:
 *   post:
 *     summary: Create a new subcontractor
 *     tags: [Subcontractors]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: "John Doe"
 *               address:
 *                 type: string
 *                 example: "123 Main St"
 *               CAF:
 *                 type: string
 *                 example: "CAF12345"
 *               SPOC:
 *                 type: string
 *                 example: "Jane Smith"
 *               deployment:
 *                 type: boolean
 *                 example: true
 *               maintenance:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       201:
 *         description: Subcontractor created successfully
 *       400:
 *         description: Bad request
 */
router.post("/", registerMiddleware("SUBCONTRACTOR"), createSubContractor);

/**
 * @swagger
 * /subcontractors:
 *   get:
 *     summary: Get all subcontractors
 *     tags: [Subcontractors]
 *     responses:
 *       200:
 *         description: A list of subcontractors
 *       500:
 *         description: Server error
 */
router.get("/", getAllSubContractors);

/**
 * @swagger
 * /subcontractors/{id}:
 *   get:
 *     summary: Get a subcontractor by ID
 *     tags: [Subcontractors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Subcontractor ID
 *     responses:
 *       200:
 *         description: Subcontractor found
 *       404:
 *         description: Subcontractor not found
 *       500:
 *         description: Server error
 */
router.get("/:id", getSubContractorById);

/**
 * @swagger
 * /subcontractors/{id}:
 *   put:
 *     summary: Update a subcontractor by ID
 *     tags: [Subcontractors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Subcontractor ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *               address:
 *                 type: string
 *               CAF:
 *                 type: string
 *               SPOC:
 *                 type: string
 *               deployment:
 *                 type: boolean
 *               maintenance:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Subcontractor updated successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Subcontractor not found
 *       500:
 *         description: Server error
 */
router.put("/:id", updateSubContractor);

/**
 * @swagger
 * /subcontractors/{id}:
 *   delete:
 *     summary: Delete a subcontractor by ID
 *     tags: [Subcontractors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Subcontractor ID
 *     responses:
 *       204:
 *         description: No content, subcontractor deleted successfully
 *       404:
 *         description: Subcontractor not found
 *       500:
 *         description: Server error
 */
router.delete("/:id", deleteSubContractor);

export default router;
