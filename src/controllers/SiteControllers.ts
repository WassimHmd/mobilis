import { Request, Response } from "express";
import prisma from "../config/db";
// @ts-ignore
import { HttpError } from "../utils/errorHandler";
// @ts-ignore
import buildReport from "../utils/pdf";
import { Readable } from "stream";
export const createSite = async (req: Request, res: Response) => {
  try {
    const site = await prisma.site.create({
      data: {
        ...req.body,
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

export const getReport = async (
  req: Request,
  res: Response,
  next: Function
): Promise<void> => {
  try {
    const { perteId } = req.params;

    const paths = [
      { path: "articles.article", populate: "categorie" },
      { path: "nature_perte" },
    ];

    const perte = await Perte.findById(perteId).populate(paths).lean();
    if (!perte) {
      return next(new HttpError.NotFoundError("perte not found"));
    }
    console.log(perte);
    const report = await buildReport(
      "SA1.hbs",
      { perte },
      {
        format: "A4",
        printBackground: true,
      }
    );

    const stream = Readable.from(report);
    stream.pipe(res);
  } catch (error) {
    next(error);
  }
};
