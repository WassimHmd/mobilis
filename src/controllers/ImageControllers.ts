import { Request, Response } from "express";
import prisma from "../config/db";

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
}

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
}