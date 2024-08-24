import { Request, Response } from "express";
import prisma from "../config/db";
import { SiteTypes } from "@prisma/client";

export const createSite = async (req: Request, res: Response) => {
  try {
    const site = await prisma.site.create({
      data: {
        ...req.body
      },
    });
    res.status(201).json(site);
  } catch (error: any) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

export const getSiteById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const site = await prisma.site.findUnique({
      where: { id },
      include: {
        subcontractor: true,
        negociator: true,
      },
    });
    if (!site) {
      return res.status(404).json({ error: "Site not found" });
    }
    res.json(site);
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

export const getAllSites = async (_req: Request, res: Response) => {
  try {
    const sites = await prisma.site.findMany({
      include: {
        subcontractor: true,
        negociator: true,
      },
    });
    res.json(sites);
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

export const updateSite = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const site = await prisma.site.update({
      where: { id },
      data: req.body,
    });
    res.json(site);
  } catch (error: any) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

export const deleteSite = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.site.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};
