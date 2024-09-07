import { testFeature } from "@/controllers/StepsControllers";
import { Router } from "express"

const router = Router();

router.post("/:id", testFeature)

export default router