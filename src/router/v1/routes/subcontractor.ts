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
 * /api/v1/subcontractor:
 *   post:
 *     summary: Register a new SubContractor
 *     description: Creates a new SubContractor account.
 *     tags:
 *       - SubContractors

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
 *               status:
 *                 type: number
 *                 example: 0
 *               CAF:
 *                 type: number
 *                 example: 3
 *               SPOC:
 *                 type: string
 *                 example: John Doe

 *               deployment:
 *                 type: boolean
 *                 example: true
 *               maintenance:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       201:

 *         description: SubContractor registered successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
router.post("/", registerMiddleware("SUBCONTRACTOR"), createSubContractor)

/**
 * @swagger
 * /api/v1/subcontractor:
 *   get:
 *     summary: Get all SubContractors
 *     description: Get all SubContractors
 *     tags:
 *       - SubContractors
 *     responses:
 *       200:
 *         description: List of SubContractors
 *       500:
 *         description: Server error
 */
router.get("/", getAllSubContractors)

/**
 * @swagger
 * /api/v1/subcontractor/{id}:
 *   get:
 *     summary: Get a SubContractor by id
 *     description: Get a SubContractor by id
 *     tags:
 *       - SubContractors

 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string

 *         description: SubContractor id
 *     responses:
 *       200:
 *         description: SubContractor retrieved successfully
 *       404:
 *         description: SubContractor not found
 *       500:
 *         description: Server error
 */
router.get("/:id", getSubContractorById)

/**
 * @swagger
 * /api/v1/subcontractor/{id}:
 *   put:
 *     summary: Update a SubContractor
 *     description: Updates a single SubContractor by ID.
 *     tags:
 *       - SubContractors
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the SubContractor to update.

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
 *               status:
 *                 type: number
 *                 example: 0
 *               CAF:
 *                 type: number
 *                 example: 12345678
 *               SPOC:
 *                 type: string
 *                 example: John Doe
 *               deployment:
 *                 type: boolean
 *                 example: true
 *               maintenance:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       200:
 *         description: SubContractor updated
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
router.put("/:id", updateSubContractor)

/**
 * @swagger
 * /api/v1/subcontractor/{id}:
 *   delete:
 *     summary: Delete a SubContractor
 *     description: Deletes a single SubContractor by ID.
 *     tags:
 *       - SubContractors
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the SubContractor to delete.
 *     responses:
 *       200:
 *         description: SubContractor deleted
 *       404:
 *         description: SubContractor not found
 *       500:
 *         description: Server error
 */
router.delete("/:id", deleteSubContractor)


export default router;
