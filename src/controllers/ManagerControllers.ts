import e, { Request, Response } from "express";
import prisma from "../config/db";
import { ManagerValidation, StepTypes } from "@prisma/client";
import { cancelStep } from "./StepsControllers";
import { RequestWithImages } from "../types";
import { createSignature } from "./SignatureControllers";

export const createManager = async (
  email: string,
  type: string,
  stepId: string,
  phoneNumber: string
) => {
  try {
    const manager = await prisma.manager.create({
      data: {
        email,
        type,
        stepId,
        phoneNumber: phoneNumber,
      },
    });
    return manager;
  } catch (error) {
    console.log(error);
    throw Error("Failed to create manager");
  }
};

export const createManagerController = async (req: Request, res: Response) => {
  const { email, type, stepId, phoneNumber } = req.body as {
    email: string;
    validation: ManagerValidation;
    type: string;
    stepId: string;
    phoneNumber: string;
  };
  try {
    const manager = await createManager(email, type, stepId, phoneNumber);
    return res.status(200).json(manager);
  } catch (error) {
    console.log(error);
    return res.status(500).json("internal server error");
  }
};

export const validateManager = async (
  id: string,
  signaturePath: string,
  res?: Response
) => {
  try {
    if (!signaturePath) {
      return false;
      // throw new Error("Signature not found")
    }
    const signature = await createSignature(signaturePath);
    if (!signature) {
      return false;
    }

    const manager = await prisma.manager.update({
      where: {
        id,
      },
      data: {
        validation: "VALID",
        signatureId: signature.id,
      },
    });
    return manager;
  } catch (error) {
    console.log(error);
    throw Error("Failed to validate manager");
  }
};

export const validateManagerController = async (
  req: RequestWithImages,
  res: Response
) => {
  try {
    const { managerId } = req.params;
    const signature = req.images?.signature[0];

    console.log(req.images);
    if (!signature) {
      return res.status(400).json("signature not found");
    }
    const manager = await validateManager(managerId, signature, res);
    return res.status(200).json(manager);
  } catch (error) {
    console.log(error);
    return res.status(500).json("internal server error");
  }
};

export const cancelManager = async (id: string, comment: string) => {
  try {
    const manager = await prisma.manager.update({
      where: {
        id,
      },
      data: {
        validation: "REFUSED",
      },
    });
    await cancelStep(manager.stepId, comment);
  } catch (error) {
    console.log(error);
    throw Error("Failed to cancel manager");
  }
};

export const cancelManagerController = async (req: Request, res: Response) => {
  try {
    const { managerId } = req.params;
    const { comment } = req.body;
    const manager = await cancelManager(managerId, comment);
    return res.status(200).json(manager);
  } catch (error) {
    console.log(error);
    return res.status(500).json("internal server error");
  }
};

export const replicateManagers = async (stepId: string, newStepId: string) => {
  try {
    const managers = await prisma.manager.findMany({
      where: {
        stepId,
      },
      select: {
        email: true,
        // validation: true,
        type: true,
      },
    });
    const newManagers = await prisma.manager.createManyAndReturn({
      data: managers.map((manager) => {
        return {
          ...manager,
          stepId: newStepId,
        };
      }),
    });

    return newManagers;
  } catch (error) {
    console.log(error);
    throw Error("Failed to replicate managers");
  }
};

export const createPendingInvite = async (
  email: string,
  phoneNumber: string,
  type: string,
  stepType: StepTypes,
  siteId: number
) => {
  try {
    const invite = await prisma.managerInvitation.create({
      data: {
        email,
        phoneNumber,
        type,
        stepType,
        siteId,
      },
    });

    return invite;
  } catch (error) {
    console.log(error);
    throw Error("Failed to create pending invite");
  }
};

export const getManagersByStepController = async (
  req: Request,
  res: Response
) => {
  try {
    const { stepId } = req.params;
    const managers = await prisma.manager.findMany({
      where: {
        stepId,
      },
    });

    return res.status(200).json(managers);
  } catch (error) {
    console.log(error);
    return res.status(500).json("Internal server error");
  }
};

export const getManagerDetailsController = async (
  req: Request,
  res: Response
) => {
  try {
    const { managerId } = req.params;
    const manager = await prisma.manager.findUnique({
      where: { id: managerId },
      include: {
        step: {
          include: {
            site: {
              include: {
                steps: true, // Include all steps associated with the site
                subcontractor: true,
              },
            },
            Document: true,
            Images: true,
          },
        },
      },
    });
    return res.status(200).json(manager);
  } catch (error) {
    console.log(error);
    return res.status(500).json("Internal server error");
  }
};
