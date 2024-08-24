import {
  createNegociator,
  deleteNegociator,
  getAllNegociators,
  getNegociatorById,
  updateNegociator,
} from "@/controllers/NegociatorControllers";
import { registerMiddleware } from "@/middleware/authMiddleware";
import { Router } from "express";

const router = Router();

router.post("/", registerMiddleware("NEGOCIATOR"), createNegociator);

router.get("/", getAllNegociators);
router.get("/:id", getNegociatorById);

router.put("/:id", updateNegociator);

router.delete("/:id", deleteNegociator);

export default router;
