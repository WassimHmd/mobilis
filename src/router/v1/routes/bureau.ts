import {
  createBureau,
  deleteBureau,
  getAllBureaus,
  getBureauById,
  updateBureau,
} from "@/controllers/BureauControllers";
import { registerMiddleware } from "@/middleware/authMiddleware";
import { Router } from "express";

const router = Router();

router.post("/", registerMiddleware("BUREAU"), createBureau);

router.get("/", getAllBureaus);
router.get("/:id", getBureauById);

router.put("/:id", updateBureau);

router.delete("/:id", deleteBureau);

export default router;
