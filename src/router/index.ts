import { Router } from "express";
import v1 from "./v1";

const router = Router();

/**
 * @swagger
 * /api/v1:
 *   get:
 *     summary: Root API v1 endpoint
 *     description: Placeholder for the v1 API root endpoint.
 */
router.use("/api/v1", v1);

export default router;
