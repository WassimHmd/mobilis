import { uploadFile } from "../../../middleware/uploadImage";
import {
  addRPPhoto,
  addSA1CandidateController,
  chooseSA1Candidate,
  nextSubStepOCController,
  setMeetDate,
  startValidationPhaseController,
  testFeature,
} from "../../../controllers/StepsControllers";
import { Router } from "express";

const router = Router();

/**
 * @swagger
 * /api/v1/steps/oc/nextSubStep/{stepId}:
 *   post:
 *     summary: Move to next substep
 *     description: Advances the step to the next substep
 *     tags:
 *       - Steps
 *
 *     parameters:
 *       - in: path
 *         name: stepId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the Step.
 *
 *     responses:
 *       200:
 *         description: Step Successfully updated
 *       400:
 *         description: Step not found
 *
 *       500:
 *         description: Internal Server Error
 */

router.post("/oc/nextSubStep/:stepId", nextSubStepOCController);

/**
 * @swagger
 * /api/v1/steps/candidate/add/{stepId}:
 *   post:
 *     summary: Add a new candidate
 *     description: Adds a new candidate to the step
 *     tags:
 *       - Steps
 *
 *     parameters:
 *       - in: path
 *         name: stepId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the Step.
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               long:
 *                 type: string
 *                 example: 1.234567
 *               lat:
 *                 type: string
 *                 example: 4.567890
 *               location:
 *                 type: string
 *                 example: 123 Main St
 *
 *     responses:
 *       201:
 *         description: Candidate created
 *       400:
 *         description: Step not found
 *
 *       500:
 *         description: Internal Server Error
 */
router.post("/candidate/add/:stepId", addSA1CandidateController);

/**
 * @swagger
 * /api/v1/steps/candidate/choose/{candidateId}:
 *   post:
 *     summary: Choose a candidate
 *     description: Chooses a candidate based on the ID
 *     tags:
 *       - Steps
 *
 *     parameters:
 *       - in: path
 *         name: candidateId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the candidate to choose
 *
 *     responses:
 *       200:
 *         description: Candidate Successfully chosen
 *       400:
 *         description: Candidate not found
 *
 *       500:
 *         description: Internal Server Error
 */
router.post("/candidate/choose/:candidateId", chooseSA1Candidate);

router.post("/validation/:stepId", startValidationPhaseController);

router.post("/rp/addRecette/:stepId", uploadFile("step"), addRPPhoto);

router.post("/rp/setMeetDate/:stepId", setMeetDate);
export default router;
