import {
  cancelManagerController,
  createManagerController,
  getManagerDetailsController,
  getManagersByStepController,
  validateManagerController,
} from "../../../controllers/ManagerControllers";
import { uploadFile } from "../../../middleware/uploadImage";
import { Router } from "express";

const router = Router();

/**
 * @swagger
 * /api/v1/manager/invite/{stepId}:
 *   post:
 *     summary: Invite a new manager to a step
 *     description: Creates a new manager invitation
 *     tags:
 *       - Manager
 *
 *     parameters:
 *       - in: path
 *         name: stepId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the step.
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
 *               type:
 *                 type: string
 *                 example: "SA1"
 *               phoneNumber:
 *                 type: string
 *                 example: "+2136987654321"
 *
 *     responses:
 *       201:
 *         description: Manager created
 *       400:
 *         description: Bad request
 *
 *       500:
 *         description: Internal Server Error
 */
router.post("/invite/:stepId", createManagerController);

/**
 * @swagger
 * /api/v1/manager/validate/{managerId}:
 *   post:
 *     summary: Validate a manager
 *     description: Validates a manager by sending a signature image
 *     tags:
 *       - Manager
 *
 *     parameters:
 *       - in: path
 *         name: managerId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the manager to validate.
 *
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               signature:
 *                 type: string
 *                 format: binary
 *
 *     responses:
 *       200:
 *         description: Manager validated successfully
 *       400:
 *         description: Bad request
 *
 *       500:
 *         description: Internal Server Error
 */

router.post(
  "/validate/:managerId",
  uploadFile("signature"),
  validateManagerController
);

/**
 * @swagger
 * /api/v1/manager/cancel/{managerId}:
 *   post:
 *     summary: Cancel a manager
 *     description: Cancels a manager by ID
 *     tags:
 *       - Manager
 *
 *     parameters:
 *       - in: path
 *         name: managerId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the manager to cancel.
 *
 *     responses:
 *       200:
 *         description: Manager canceled successfully
 *       400:
 *         description: Bad request
 *
 *       500:
 *         description: Internal Server Error
 */

router.post("/cancel/:managerId", cancelManagerController);

router.get("/details/:managerId", getManagerDetailsController);

router.get("/:stepId", getManagersByStepController);

export default router;
