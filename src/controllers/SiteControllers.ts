import { Request, Response } from "express";
import prisma from "../config/db";
import { SiteTypes } from "@prisma/client";
import { cancelStep, createStep, getCurrentStep, nextStep, updateStep } from "./StepsControllers";

export const createSite = async (req: Request, res: Response) => {
  //TODO: create SA1 on creation
  try {
    const site = await prisma.site.create({
      data: {
        ...req.body
      },
    });
    createStep(site.id, "SA1");
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

export const siteCancelCurrentStep = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const newStep = await cancelStep(id)
    return res.status(200).json(newStep)
  } catch (error: any) {
    console.log(error);
    return res.status(500).json("Internal Server Error");
  }
}

export const siteNextStep = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const newStep = await nextStep(id)
    return res.status(200).json(newStep)
  }catch(err){
    console.error(err)
    return res.status(200).json(err)
  }
}

export const updateCurrentStep = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { payload } = req.body
    const currentStep = await getCurrentStep(id)
    if(currentStep)
      updateStep(currentStep.id, payload)
  }catch(err){
    console.error(err)
    return res.status(200).json(err)
  }
}