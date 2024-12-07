import express, { Router } from "express";
import auth from "./routes/auth";

import sites from "./routes/sites";
import subcontractors from "./routes/subcontractor";
import negociator from "./routes/negociator";
import moderator from "./routes/moderator";
import documents from "./routes/documents";
import manager from "./routes/manager";
import bureau from "./routes/bureau";
import images from "./routes/images";
import user from "./routes/user";
import steps from "./routes/steps";
import notifications from "./routes/notifications";

import { testFeature } from "../../controllers/StepsControllers";
import path from "path";

const router = Router({ mergeParams: true });

interface CustomRequest extends Request {
  images?: any;
}

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
router.use("/sites", sites);

/**
 * @swagger
 * /api/v1/subcontractor:
 *   get:
 *     summary: Get all Subctractors
 *     description: CRUD operations for managing subcontractor
 */

router.use("/subcontractor", subcontractors);

router.use("/negociator", negociator);

router.use("/bureau", bureau);

router.use("/moderator", moderator);

router.use("/documents", documents);

router.use("/manager", manager);

router.use("/images", images);

router.use("/user", user);

router.use("/step/", steps);

router.use("/notifications/", notifications);

router.post("/test", testFeature);

export default router;
