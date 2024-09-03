import { Request, Response } from "express";
import prisma from "../config/db";

export const createModerator = async (req: any, res: Response) => {
  try {
    const { region } = req.body;

    const moderator = await prisma.moderator.create({
      data: {
        userId: req.user.id,
        region,
      },
    });

    res.status(201).json(moderator);
  } catch (error: any) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

export const getModeratorById = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const moderator = await prisma.moderator.findUnique({
      where: { userId },
      include: { user: true },
    });
    if (!moderator) {
      return res.status(404).json({ error: "Moderator not found" });
    }
    res.status(200).json(moderator);
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

export const getAllModerators = async (_req: Request, res: Response) => {
  try {
    const moderators = await prisma.moderator.findMany({
      include: { user: true },
    });
    res.status(200).json(moderators);
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

export const updateModerator = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const moderator = await prisma.moderator.update({
      where: { userId },
      data: req.body,
    });
    res.status(200).json(moderator);
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

export const deleteModerator = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    await prisma.moderator.delete({
      where: { userId },
    });
    res.status(204).send();
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};
