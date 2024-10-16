import { Request, Response } from "express";
import prisma from "../config/db";

export const createBureau = async (req: any, res: Response) => {
  try {
    const { siteId } = req.body;
    const bureau = await prisma.bureau.create({
      data: {
        userId: req.user.id,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phoneNumber: true,
          },
        },
      },
    });
    if (siteId) {
      if (await prisma.site.findUnique({ where: { id: parseInt(siteId) } })) {
        await prisma.site.update({
          where: { id: parseInt(siteId) },
          data: { bureauId: bureau.userId },
        });
      }
    }

    res.status(201).json(bureau);
  } catch (error: any) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

export const getBureauById = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const bureau = await prisma.bureau.findUnique({
      where: { userId },
      include: { user: true, sites: true },
    });
    if (!bureau) {
      return res.status(404).json({ error: "Bureau not found" });
    }
    res.json(bureau);
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

export const getAllBureaus = async (_req: Request, res: Response) => {
  try {
    const bureaus = await prisma.bureau.findMany({
      include: { user: true, sites: true },
    });
    res.json(bureaus);
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

export const updateBureau = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const bureau = await prisma.bureau.update({
      where: { userId },
      data: req.body,
    });
    res.json(bureau);
  } catch (error: any) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

export const deleteBureau = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    await prisma.bureau.delete({
      where: { userId },
    });
    res.status(204).send();
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};
