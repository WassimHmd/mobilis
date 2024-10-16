import { Request, Response } from "express";
import prisma from "../config/db";
import { RequestWithImages } from "../types";

export const deleteImage = async (req: Request, res: Response) => {
  try {
    const { imageId } = req.params;
    const image = await prisma.images.delete({
      where: { id: imageId },
    });
    res.json(image);
  } catch (error: any) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

export const getImagesByStep = async (req: Request, res: Response) => {
  try {
    const { stepId } = req.params;
    const images = await prisma.images.findMany({
      where: { stepId },
    });
    res.json(images);
  } catch (error: any) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

export const addImagesToCollection = async (
  req: RequestWithImages,
  res: Response
) => {
  try {
    const { collectionId } = req.params;
    const { images } = req;

    if (!images) return res.status(400).json("Images not found");

    if (
      !collectionId ||
      !(await prisma.imageCollection.findUnique({
        where: { id: collectionId },
      }))
    )
      return res.status(400).json("Collection not found");

    await prisma.images.createMany({
      data: images.images.map((img: string) => ({
        path: img,
        collectionId,
      })),
    });

    return res.status(200).json("Images added successfully");
  } catch (err) {
    console.error(err);
    return res.status(400).json(err);
  }
};

export const getImageCollection = async (req: Request, res: Response) => {
  try {
    const { collectionId } = req.params;

    const collection = await prisma.imageCollection.findUnique({
      where: { id: collectionId },
      include: { Images: true },
    });

    return res.status(200).json(collection);
  } catch (error) {
    console.error(error);
    return res.status(500).json("Internal Server Error");
  }
};
