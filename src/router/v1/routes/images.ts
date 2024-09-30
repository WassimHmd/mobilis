import {
  addImagesToCollection,
  deleteImage,
  getImageCollection,
  getImagesByStep,
} from "@/controllers/ImageControllers";
import { uploadFile } from "@/middleware/uploadImage";
import { Router } from "express";

const router = Router();

/**
 * @swagger
 * /api/v1/images/collection/:collectionId:
 *   post:
 *     summary: Add images to a collection
 *     description: Adds images to a collection
 *     tags:
 *       - Images
 *     parameters:
 *       - in: path
 *         name: collectionId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the collection.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Images added successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal Server Error
 */

router.post(
  "/collection/:collectionId",
  uploadFile("substep"),
  addImagesToCollection
);

/**
 * @swagger
 * /api/v1/images/collection/{collectionId}:
 *   get:
 *     summary: Get a collection of images
 *     description: Returns a collection of images
 *     tags:
 *       - Images
 *     parameters:
 *       - in: path
 *         name: collectionId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the collection.
 *     responses:
 *       200:
 *         description: Collection of images
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal Server Error
 */
router.get("/collection/:collectionId", getImageCollection);

/**
 * @swagger
 * /api/v1/images/step/{stepId}:
 *   get:
 *     summary: Get all images for a step
 *     description: Returns all images for a given stepId
 *     tags:
 *       - Images
 *     parameters:
 *       - in: path
 *         name: stepId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the Step to retrieve images for
 *
 *     responses:
 *       200:
 *         description: List of images
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal Server Error
 */

router.get("/:stepId", getImagesByStep);

/**
 * @swagger
 * /api/v1/images/{imageId}:
 *   delete:
 *     summary: Delete an image
 *     description: Deletes an image by ID
 *     tags:
 *       - Images
 *     parameters:
 *       - in: path
 *         name: imageId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the image to delete
 *
 *     responses:
 *       200:
 *         description: Image deleted
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal Server Error
 */

router.delete("/:imageId", deleteImage);

export default router;
