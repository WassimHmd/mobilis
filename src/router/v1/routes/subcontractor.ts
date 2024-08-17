import { Router } from "express";

import {
  createSubContractor,
  getSubContractorById,
  getAllSubContractors,
  updateSubContractor,
  deleteSubContractor,
} from "../../../controllers/SubcontractorControllers";
import { registerMiddleware } from "@/middleware/authMiddleware"

const router = Router();

router.post("/", registerMiddleware("SUBCONTRACTOR"), createSubContractor)

router.get("/", getAllSubContractors)
router.get("/:id", getSubContractorById)

router.put("/:id", updateSubContractor)

router.delete("/:id", deleteSubContractor)

export default router