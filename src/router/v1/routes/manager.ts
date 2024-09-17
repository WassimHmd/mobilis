import {
  cancelManagerController,
  createManagerController,
  validateManagerController,
} from "@/controllers/ManagerControllers";
import { uploadFile } from "@/middleware/uploadImage";
import { Router } from "express";

const router = Router();

router.post("/invite/:stepId", createManagerController);
router.post("/validate/:managerId", uploadFile("signature") , validateManagerController);
router.post("/cancel/:managerId", cancelManagerController);

export default router;
