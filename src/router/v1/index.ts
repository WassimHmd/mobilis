import { Router } from "express";
import auth from "./routes/auth";
import sites from "./routes/sites"
import subcontractors from "./routes/subcontractor"
import negociator from "./routes/negociator"
import moderator from "./routes/moderator"

const router = Router();

/**
 * @swagger
 * /api/v1/auth:
 *   get:
 *     summary: Auth routes endpoint
 *     description: Placeholder for the auth routes.
 */
router.use("/auth", auth);

/**
 * @swagger
 * /api/v1/sites:
 *   get:
 *     summary: Sites routes endpoint
 *     description: Placeholder for the sites routes.
 */
router.use("/sites", sites)


/**
 * @swagger
 * /api/v1/subcontractor:
 *   get:
 *     summary: Get all Subctractors
 *     description: Placeholder for the subcontractor routes.
 */
router.use("/subcontractor", subcontractors)


/**
 * @swagger
 * /api/v1/negociator:
 *   get:
 *     summary: Get all Negociators 
 *     description: Placeholder for the negociator routes.
 */
router.use("/negociator", negociator)


/**
 * @swagger
 * /api/v1/moderator:
 *   get:
 *     summary: Get all Moderators
 *     description: Placeholder for the moderator routes.
 */
router.use("/moderator", moderator)

export default router;
