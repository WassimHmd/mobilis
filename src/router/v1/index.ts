import { Router } from "express";
import auth from "./routes/auth";

import sites from "./routes/sites";
import subcontractors from "./routes/subcontractor";
import negociator from "./routes/negociator";
import moderator from "./routes/moderator";
import documents from "./routes/documents";
import manager from "./routes/manager";
import bureau from "./routes/bureau";
import images from "./routes/images";
import user from "./routes/user"
import steps from "./routes/steps"

import { testFeature } from "@/controllers/StepsControllers";

const router = Router({ mergeParams: true });

interface CustomRequest extends Request { images?: any };

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
 * tags:
 *   name: Sites routes endpoint
 *   description: CRUD operations for managing subcontractor
 */

/**
 * @swagger
 * /api/v1/subcontractor:
 *   get:
 *     summary: Get all Subctractors
 *     description: CRUD operations for managing subcontractor
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
 *   name: Bureau routes endpoint
 *   description: CRUD operations for managing Bureau
 */

router.use("/bureau", bureau);
/**
 * @swagger
 * tags:
 *   name: Sites routes endpoint
 *   description: CRUD operations for managing moderator
 */

router.use("/moderator", moderator);

router.use("/documents", documents);

router.use("/manager", manager);

router.use("/images", images)

router.use("/user", user)

router.use("/step/", steps);
// router.post("/test", uploadFile("test"), (req: any, res) => {
//   if (!req.images) {
//     return res.status(400).json({ message: "No file uploaded!" });
//   }

//   // Return the uploaded file information for testing purposes
//   console.log(req.images)
//   res.status(200).json({
//     message: "File uploaded successfully!",
//     file: req.images,
//   });
// });
export default router;
