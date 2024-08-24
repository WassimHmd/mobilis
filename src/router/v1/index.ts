import { Router } from "express";
import auth from "./routes/auth";
import sites from "./routes/sites";
import subcontractors from "./routes/subcontractor";
import negociator from "./routes/negociator";
import moderator from "./routes/moderator";

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
 * tags:
 *   name: Sites routes endpoint
 *   description: CRUD operations for managing sites
 */
router.use("/sites", sites);
/**
 * @swagger
 * tags:
 *   name: Sites routes endpoint
 *   description: CRUD operations for managing subcontractor
 */

router.use("/subcontractor", subcontractors);
/**
 * @swagger
 * tags:
 *   name: Sites routes endpoint
 *   description: CRUD operations for managing negociator
 */

router.use("/negociator", negociator);
/**
 * @swagger
 * tags:
 *   name: Sites routes endpoint
 *   description: CRUD operations for managing moderator
 */

router.use("/moderator", moderator);

export default router;
