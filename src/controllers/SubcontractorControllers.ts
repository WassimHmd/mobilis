import { Request, Response } from "express";
import prisma from "../config/db";

export const createSubContractor = async (req: any, res: Response) => {
  try {
    const { fullName, address, CAF, SPOC, deployment, maintenance } = req.body;
    const subContractor = await prisma.subContractor.create({
      data: {
        fullName,
        address,
        CAF,
        SPOC,
        deployment,
        maintenance,
        userId: req.user.id,
      },
    });
    res.status(201).json(subContractor);
  } catch (error: any) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

export const getSubContractorById = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const subContractor = await prisma.subContractor.findUnique({
      where: { userId },
      include: {
        user: true,
        sites: true,
      },
    });
    if (!subContractor) {
      return res.status(404).json({ error: "SubContractor not found" });
    }
    return res.status(200).json(subContractor);
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

export const getAllSubContractors = async (_req: Request, res: Response) => {
  try {
    const subContractors = await prisma.subContractor.findMany({
      include: {
        user: true,
        sites: true,
      },
    });
    res.json(subContractors);
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

export const updateSubContractor = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const subContractor = await prisma.subContractor.update({
      where: { userId },
      data: req.body,
    });
    res.json(subContractor);
  } catch (error: any) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

export const deleteSubContractor = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    await prisma.subContractor.delete({
      where: { userId },
    });
    res.status(204).send();
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};
