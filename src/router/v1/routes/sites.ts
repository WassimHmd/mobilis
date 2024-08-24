import { Router } from "express";
import {
  createSite,
  deleteSite,
  getAllSites,
  getSiteById,
  updateSite,
} from "../../../controllers/SiteControllers";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Sites
 *   description: CRUD operations for managing sites
 */

/**
 * @swagger
 * /sites:
 *   post:
 *     summary: Create a new site
 *     tags: [Sites]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Site A"
 *               location:
 *                 type: string
 *                 example: "New York"
 *               siteType:
 *                 type: string
 *                 enum: [RESIDENTIAL, COMMERCIAL, INDUSTRIAL]
 *                 example: "COMMERCIAL"
 *               subcontractorId:
 *                 type: string
 *                 example: "subcontractor-uuid"
 *               negociatorId:
 *                 type: string
 *                 example: "negociator-uuid"
 *     responses:
 *       201:
 *         description: Site created successfully
 *       400:
 *         description: Bad request
 */
router.post("/", createSite);

/**
 * @swagger
 * /sites:
 *   get:
 *     summary: Get all sites
 *     tags: [Sites]
 *     responses:
 *       200:
 *         description: A list of sites
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "site-uuid"
 *                   name:
 *                     type: string
 *                     example: "Site A"
 *                   location:
 *                     type: string
 *                     example: "New York"
 *                   siteType:
 *                     type: string
 *                     example: "COMMERCIAL"
 *                   subcontractor:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "subcontractor-uuid"
 *                       fullName:
 *                         type: string
 *                         example: "John Doe"
 *                   negociator:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "negociator-uuid"
 *                       fullName:
 *                         type: string
 *                         example: "Jane Smith"
 *       500:
 *         description: Server error
 */
router.get("/", getAllSites);

/**
 * @swagger
 * /sites/{id}:
 *   get:
 *     summary: Get a site by ID
 *     tags: [Sites]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Site ID
 *     responses:
 *       200:
 *         description: Site found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "site-uuid"
 *                 name:
 *                   type: string
 *                   example: "Site A"
 *                 location:
 *                   type: string
 *                   example: "New York"
 *                 siteType:
 *                   type: string
 *                   example: "COMMERCIAL"
 *                 subcontractor:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "subcontractor-uuid"
 *                     fullName:
 *                       type: string
 *                       example: "John Doe"
 *                 negociator:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "negociator-uuid"
 *                     fullName:
 *                       type: string
 *                       example: "Jane Smith"
 *       404:
 *         description: Site not found
 *       500:
 *         description: Server error
 */
router.get("/:id", getSiteById);

/**
 * @swagger
 * /sites/{id}:
 *   put:
 *     summary: Update a site by ID
 *     tags: [Sites]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Site ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               location:
 *                 type: string
 *               siteType:
 *                 type: string
 *               subcontractorId:
 *                 type: string
 *               negociatorId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Site updated successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Site not found
 *       500:
 *         description: Server error
 */
router.put("/:id", updateSite);
/**
 * @swagger
 * /sites/{id}:
 *   delete:
 *     summary: Delete a site by ID
 *     tags: [Sites]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Site ID
 *     responses:
 *       204:
 *         description: No content, site deleted successfully
 *       404:
 *         description: Site not found
 *       500:
 *         description: Server error
 */
router.delete("/:id", deleteSite);

export default router;
