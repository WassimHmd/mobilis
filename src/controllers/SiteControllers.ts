import { Request, Response } from "express";
import prisma from "../config/db";
// @ts-ignore
import { HttpError } from "../utils/errorHandler";
// @ts-ignore
import buildReport from "../utils/pdf";
import { Readable } from "stream";
import { SiteTypes } from "@prisma/client";
import {
  cancelStep,
  createStep,
  getAllSteps,
  getCurrentStep,
  nextStep,
  startValidationPhase,
  updateStep,
} from "./StepsControllers";

import { RequestWithImages } from "./../types";
import { createManager, createPendingInvite } from "./ManagerControllers";

export const createSite = async (req: Request, res: Response) => {
  try {
    const {
      type,
      startDate,
      endDate,
      code,
      name,
      region,
      wilaya,
      location,
      progression,
      subcontractorId,
      moderatorId,
    } = req.body;
    const site = await prisma.site.create({
      data: {
        type,
        startDate,
        endDate,
        code,
        name,
        region,
        wilaya,
        location,
        progression,
        subcontractorId,
        moderatorId,
      },
    });
    const step = await createStep(site.id, "SA1");
    const managers = req.body.managers;
    if (!managers) return res.status(400).json("Managers not found");
    const promises = managers.map((manager: any) => {
      if (manager.step === "SA1") {
        return createManager(
          manager.email,
          manager.type,
          step.id,
          manager.phoneNumber
        );
      } else {
        return createPendingInvite(
          manager.email,
          manager.phoneNumber,
          manager.type,
          manager.step,
          site.id
        );
      }
    });

    await Promise.all(promises);
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
      where: { id: parseInt(id) },
      include: {
        subcontractor: true,
        negociator: true,
        steps: true,
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
        steps: true,
      },
    });
    // const sites = await prisma.site
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
      where: { id: parseInt(id) },
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
    await prisma.site.update({
      where: { id: parseInt(id) },
      data: { status: "CANCELLED" },
    });
    res.status(204).send();
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

// export const getReport = async (
//   req: Request,
//   res: Response,
//   next: Function
// ): Promise<void> => {
//   try {
//     const { perteId } = req.params;

//     const report = await buildReport(
//       "SA1.hbs",
//       { perte },
//       {
//         format: "A4",
//         printBackground: true,
//       }
//     );

//     const stream = Readable.from(report);
//     stream.pipe(res);
//   } catch (error) {
//     next(error);
//   }
// };
export const siteCancelCurrentStep = async (req: Request, res: Response) => {
  try {
    const { siteId } = req.params;
    const stepId = (await getCurrentStep(parseInt(siteId)))?.id;
    if (!stepId) return res.status(400).json("Step not found");
    const newStep = await cancelStep(stepId);
    return res.status(200).json(newStep);
  } catch (error: any) {
    console.log(error);
    return res.status(500).json("Internal Server Error");
  }
};

export const siteNextStep = async (req: Request, res: Response) => {
  try {
    const { siteId } = req.params;
    const newStep = await nextStep(parseInt(siteId));
    return res.status(200).json(newStep);
  } catch (err) {
    console.error(err);
    return res.status(500).json(err);
  }
};

export const siteValidationPhase = async (req: Request, res: Response) => {
  try {
    const { siteId } = req.params;
    const step = await getCurrentStep(parseInt(siteId));
    if (!step) return res.status(400).json("Step not found");
    const newStep = await startValidationPhase(step.id);

    return res.status(200).json(newStep);
  } catch (error) {
    console.log(error);
    return res.status(500).json("Internal Server Error");
  }
};

export const updateCurrentStep = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { payload } = req.body;
    const currentStep = await getCurrentStep(parseInt(id));
    if (currentStep) updateStep(currentStep.id, payload);
  } catch (err) {
    console.error(err);
    return res.status(200).json(err);
  }
};

export const inviteNegociator = async (req: Request, res: Response) => {
  try {
    const { siteId } = req.params;
    const { email } = req.body;

    if (!email) return res.status(400).json("Email not found");

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      //TODO: mailing logic
      return res.status(400).json("Email invitations not implemented yet");
    } else {
      await prisma.site.update({
        where: { id: parseInt(siteId) },
        data: { negociatorId: user.id },
      });

      return res.status(200).json("Negociator Added to Site successfully");
    }
  } catch (err) {
    console.error(err);
    return res.status(200).json(err);
  }
};

export const inviteBureau = async (req: Request, res: Response) => {
  try {
    const { siteId } = req.params;
    const { email } = req.body;

    if (!email) return res.status(400).json("Email not found");

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      //TODO: mailing logic
      return res.status(400).json("Email invitations not implemented yet");
    } else {
      await prisma.site.update({
        where: { id: parseInt(siteId) },
        data: { bureauId: user.id },
      });

      return res.status(200).json("Bureau Added to Site successfully");
    }
  } catch (err) {
    console.error(err);
    return res.status(200).json(err);
  }
};

export const addImagesToSite = async (
  req: RequestWithImages,
  res: Response
) => {
  try {
    const { siteId } = req.params;
    const { images } = req;

    if (!images) return res.status(400).json("Images not found");

    const step = await getCurrentStep(parseInt(siteId));
    if (!step) return res.status(400).json("Step not found");

    await prisma.images.createMany({
      data: images.images.map((img: string) => ({
        stepId: step.id,
        path: img,
      })),
    });

    return res.status(200).json("Images added successfully");
  } catch (err) {
    console.error(err);
    return res.status(400).json(err);
  }
};

export const siteGetAllSteps = async (req: Request, res: Response) => {
  try {
    const { siteId } = req.params;
    const steps = await getAllSteps(parseInt(siteId));
    return res.status(200).json(steps);
  } catch (err) {
    console.error(err);
    return res.status(200).json(err);
  }
};
