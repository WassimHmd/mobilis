import { deleteImage, getImagesByStep } from "@/controllers/ImageControllers";
import { Router } from "express"

const router = Router();

router.get("/:stepId", getImagesByStep)

router.delete("/:imageId", deleteImage)

export default router