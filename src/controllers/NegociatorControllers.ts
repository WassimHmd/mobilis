import { Request, Response } from "express";
import prisma from "../config/db";

export const createNegociator = async (req: any, res: Response) => {
  try {
    const negociator = await prisma.negociator.create({
      data: {
        userId: req.user.id,
      },
    });

    res.status(201).json(negociator);
  } catch (error: any) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

export const getNegociatorById = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const negociator = await prisma.negociator.findUnique({
      where: { userId },
      include: { user: true, sites: true },
    });
    if (!negociator) {
      return res.status(404).json({ error: "Negociator not found" });
    }
    res.json(negociator);
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

export const getAllNegociators = async (_req: Request, res: Response) => {
  try {
    const negociators = await prisma.negociator.findMany({
      include: { user: true, sites: true },
    });
    res.json(negociators);
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

export const updateNegociator = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const negociator = await prisma.negociator.update({
      where: { userId },
      data: req.body,
    });
    res.json(negociator);
  } catch (error: any) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

export const deleteNegociator = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    await prisma.negociator.delete({
      where: { userId },
    });
    res.status(204).send();
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};