import {
  cancelManagerController,
  createManagerController,
  validateManagerController,
} from "@/controllers/ManagerControllers";
import { Router } from "express";

const router = Router();

router.post("/invite/:stepId", createManagerController);
router.post("/validate/:managerId", validateManagerController);
router.post("/cancel/:managerId", cancelManagerController);

export default router;
