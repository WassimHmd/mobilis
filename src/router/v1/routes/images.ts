import {
  addImagesToCollection,
  deleteImage,
  getImageCollection,
  getImagesByStep,
} from "@/controllers/ImageControllers";
import { uploadFile } from "@/middleware/uploadImage";
import { Router } from "express";

const router = Router();

router.post(
  "/collection/:collectionId",
  uploadFile("substep"),
  addImagesToCollection
);
router.get("/collection/:collectionId", getImageCollection);

router.get("/:stepId", getImagesByStep);

router.delete("/:imageId", deleteImage);

export default router;
