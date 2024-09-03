import {
  cancelManagerController,
  createManagerController,
  validateManagerController,
} from "@/controllers/ManagerControllers";
import { Router } from "express";

const router = Router();

router.post("/invite/:stepId", createManagerController);
router.post("/validate/:stepId", validateManagerController);
router.post("/cancel/:stepId", cancelManagerController);

export default router;
