import { Router } from "express";
import auth from "./routes/auth";

const router = Router();

/**
 * @swagger
 * /api/v1/auth:
 *   get:
 *     summary: Auth routes endpoint
 *     description: Placeholder for the auth routes.
 */
router.use("/auth", auth);

export default router;
