import { createModerator, deleteModerator, getAllModerators, getModeratorById, updateModerator } from "@/controllers/ModeratorControllers";
import { registerMiddleware } from "@/middleware/authMiddleware";
import { Router } from "express"

const router = Router();

router.post("/", registerMiddleware("MODERATOR"), createModerator)

router.get("/", getAllModerators)
router.get("/:id", getModeratorById)

router.put("/:id", updateModerator)

router.delete("/:id", deleteModerator)

export default router