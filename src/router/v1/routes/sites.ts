import { Router } from "express";
import {
  addImagesToSite,
  createSite,
  deleteSite,
  getAllSites,
  getSiteById,
  inviteBureau,
  inviteNegociator,
  siteCancelCurrentStep,
  siteGetAllSteps,
  siteNextStep,
  siteValidationPhase,
  updateCurrentStep,
  updateSite,
} from "../../../controllers/SiteControllers";
import { uploadFile } from "@/middleware/uploadImage";
import {
  checkAccessSite,
  checkRole,
  checkStepAccess,
  verifyToken,
} from "@/middleware/authMiddleware";

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

router.post("/", verifyToken, checkRole(["admin", "MODERATOR"]), createSite);

/**
 * @swagger

 * /api/v1/sites/cancelStep/{siteId}:
 *   post:
 *     summary: Cancel current step
 *     description: Cancels the currect step
 *     tags:
 *       - Sites

 *     parameters:
 *       - in: path
 *         name: siteId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the Site.
 *       

 *     responses:
 *       200:
 *         description: Step Successfully Canceled
 *       400:
 *         description: Step not found

 *       500:
 *         description: Internal Server Error
 */

router.post(
  "/cancelStep/:siteId",
  verifyToken,
  checkStepAccess,
  siteCancelCurrentStep
);

/**
 * @swagger

 * /api/v1/sites/nextStep/{siteId}:
 *   post:
 *     summary: Advance to next step
 *     description: Advances the site to the next step
 *     tags:
 *       - Sites

 *     parameters:
 *       - in: path
 *         name: siteId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the Site.
 *       

 *     responses:
 *       200:
 *         description: Step Successfully Canceled
 *       400:
 *         description: Step not found

 *       500:
 *         description: Internal Server Error
 */

router.post("/nextStep/:siteId", verifyToken, checkStepAccess, siteNextStep);

/**
 * @swagger

 * /api/v1/sites/invite/negociator/{siteId}:
 *   post:
 *     summary: Invite negociator to validate step
 *     description: Invites negociator to project
 *     tags:
 *       - Sites

 *     parameters:
 *       - in: path
 *         name: siteId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the Site.
 * 
 *     requestBody:
 *       required: true
 *       content:
 *         application/json: 
 *           schema:
 *             type: object 
 *             properties:
 *               email:
 *                 type: string
 *                 example: "user@email.com"

 *     responses:
 *       200:
 *         description: Step Successfully Canceled
 *       400:
 *         description: Step not found

 *       500:
 *         description: Internal Server Error
 */

router.post(
  "/invite/negociator/:siteId",
  verifyToken,
  checkAccessSite(["SUBCONTRACTOR", "MODERATOR"]),
  inviteNegociator
);

/**
 * @swagger

 * /api/v1/sites/invite/bureau/{siteId}:
 *   post:
 *     summary: Invite bureau to validate step
 *     description: Invites bureau to project
 *     tags:
 *       - Sites

 *     parameters:
 *       - in: path
 *         name: siteId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the Site.
 * 
 *     requestBody:
 *       required: true
 *       content:
 *         application/json: 
 *           schema:
 *             type: object 
 *             properties:
 *               email:
 *                 type: string
 *                 example: "user@email.com"

 *     responses:
 *       200:
 *         description: Step Successfully Canceled
 *       400:
 *         description: Step not found

 *       500:
 *         description: Internal Server Error
 */

router.post(
  "/invite/bureau/:siteId",
  verifyToken,
  checkAccessSite(["SUBCONTRACTOR", "MODERATOR"]),
  inviteBureau
);

router.post(
  "/testing/:siteId",
  verifyToken,
  checkAccessSite(["NEGOCIATOR"]),
  (req, res) => {
    return res.status(200).json({
      success: true,
    });
  }
);

router.post("/validation/:siteId", siteValidationPhase);

/**
 * @swagger

 * /api/v1/sites/addImages/{siteId}:
 *   post:
 *     summary: Add images to site
 *     description: Adds images to site
 *     tags:
 *       - Sites

 *     parameters:
 *       - in: path
 *         name: siteId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the Site.
 * 
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object 
 *             properties:
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Images added successfully
 *       400:
 *         description: Bad request

 *       500:
 *         description: Internal Server Error
 */

router.post(
  "/addImages/:siteId",
  verifyToken,
  checkStepAccess,
  uploadFile("step"),
  addImagesToSite
);

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
router.get("/", verifyToken, checkRole(["admin"]), getAllSites);

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
router.get(
  "/:id",
  verifyToken,
  checkAccessSite(["BUREAU", "MODERATOR", "NEGOCIATOR", "SUBCONTRACTOR"]),
  getSiteById
);

/**
 * @swagger
 * /api/v1/sites/steps/{siteId}:
 *   get:
 *     summary: Get all steps
 *     description: Returns all steps for a given siteId
 *     tags:
 *       - Sites
 *     parameters:
 *       - in: path
 *         name: siteId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the Site to retrieve steps for
 *
 *     responses:
 *       200:
 *         description: Steps found
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Step'
 *       404:
 *         description: Steps not found
 *       500:
 *         description: Server error
 */

router.get(
  "/steps/:siteId",
  verifyToken,
  checkAccessSite(["BUREAU", "MODERATOR", "NEGOCIATOR", "SUBCONTRACTOR"]),
  siteGetAllSteps
);

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

router.put("/updateStep/:id", verifyToken, checkStepAccess, updateCurrentStep);

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
 *
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
 *               type:
 *                 type: string
 *                 example: PYLON
 *               startDate:
 *                 type: string
 *                 example: 2023-01-01T00:00:00.000Z
 *               endDate:
 *                 type: string
 *                 example: 2023-01-01T00:00:00.000Z
 *               region:
 *                 type: string
 *                 example: DZ-01
 *               wilaya:
 *                 type: string
 *                 example: ALGER
 *               location:
 *                 type: string
 *                 example: 123 Main St
 *
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

router.put(
  "/:id",
  verifyToken,
  checkAccessSite(["BUREAU", "MODERATOR", "NEGOCIATOR", "SUBCONTRACTOR"]),
  updateSite
);

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
router.delete("/:id", verifyToken, checkAccessSite(["MODERATOR"]), deleteSite);

export default router;
