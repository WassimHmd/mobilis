import { Router } from "express";
import {
  createSite,
  deleteSite,
  getAllSites,
  getSiteById,
  siteCancelCurrentStep,
  siteNextStep,
  updateCurrentStep,
  updateSite,
} from "../../../controllers/SiteControllers";

const router = Router();

/**
 * @swagger

 * /api/v1/sites:
 *   post:
 *     summary: Create a new Site
 *     description: Creates a new Site.
 *     tags:
 *       - Sites

 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:

 *               type:
 *                 type: string
 *                 example: "PYLON"
 *               startDate:
 *                 type: string
 *                 example: "2022-01-01T00:00:00.000Z"
 *               endDate:
 *                 type: string
 *                 example: "2022-01-01T00:00:00.000Z"
 *               code:
 *                 type: integer
 *                 example: 1
 *               name:
 *                 type: string
 *                 example: "Site Name"
 *               region:
 *                 type: string
 *                 example: "DZ-01"
 *               wilaya:
 *                 type: string
 *                 example: "ALGER"
 *               location:
 *                 type: string
 *                 example: "123 Main St"

 *     responses:
 *       201:
 *         description: Site created successfully
 *       400:
 *         description: Bad request

 *       500:
 *         description: Server error
 */


router.post("/", createSite);

router.post("/cancelStep/:id", siteCancelCurrentStep)

router.post("/nextStep/:id", siteNextStep)

/**
 * @swagger

 * /api/v1/sites:
 *   get:
 *     summary: Get all Sites
 *     description: Returns a list of all Sites.
 *     tags:
 *       - Sites
 *     responses:
 *       200:
 *         description: List of Sites

 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:

 *                 $ref: '#/components/schemas/Site'
 *       500:
 *         description: Server error
 */
router.get("/", getAllSites);

/**
 * @swagger

 * /api/v1/sites/{id}:
 *   get:
 *     summary: Get a Site by ID
 *     description: Returns a single Site by ID.
 *     tags:
 *       - Sites
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the Site to retrieve.

 *     responses:
 *       200:
 *         description: Site found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Site'
 *       404:
 *         description: Site not found
 *       500:
 *         description: Server error
 */
router.get("/:id", getSiteById);

/**
 * @swagger

 * /api/v1/sites/{id}:
 *   put:
 *     summary: Update a Site
 *     description: Updates a single Site by ID.
 *     tags:
 *       - Sites
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the Site to update.

 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string

 *                 example: The Best Site Ever
 *               address:
 *                 type: string
 *                 example: 123 Main St
 *               city:
 *                 type: string
 *                 example: Anytown
 *               state:
 *                 type: string
 *                 example: NY
 *               zip:
 *                 type: string
 *                 example: 12345
 *               country:
 *                 type: string
 *                 example: USA
 *               phone:
 *                 type: string
 *                 example: 555-555-5555
 *               email:
 *                 type: string
 *                 example: info@example.com
 *               website:
 *                 type: string
 *                 example: https://example.com

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

router.put("/updateStep/:id", updateCurrentStep)

router.put("/:id", updateSite);


/**
 * @swagger
 * /api/v1/sites/{id}:
 *   delete:
 *     summary: Delete a Site
 *     description: Deletes a single Site by ID.
 *     tags:
 *       - Sites
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the Site to delete.
 *     responses:
 *       200:
 *         description: Site deleted successfully

 *       404:
 *         description: Site not found
 *       500:
 *         description: Server error
 */
router.delete("/:id", deleteSite);

export default router;
