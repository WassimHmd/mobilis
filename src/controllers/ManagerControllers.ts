import e, { Request, Response } from "express";
import prisma from "../config/db";
import { ManagerValidation } from "@prisma/client";
import { cancelStep } from "./StepsControllers";

export const createManager = async (
  email: string,
  type: string,
  stepId: string
) => {
  try {
    
    const manager = await prisma.manager.create({
      data: {
        email,
        type,
        stepId,
      },
    });
    return manager;
  } catch (error) {
    console.log(error);
    throw Error("Failed to create manager");
  }
};

export const createManagerController = async (req: Request, res: Response) => {
  const { email, type, stepId } = req.body as {
    email: string;
    validation: ManagerValidation;
    type: string;
    stepId: string;
  };
  try {
    const manager = await createManager(email, type, stepId);
    return res.status(200).json(manager);
  } catch (error) {
    console.log(error);
    return res.status(500).json("internal server error");
  }
};

export const validateManager = async (id: string) => {
  try {
    const manager = await prisma.manager.update({
      where: {
        id,
      },
      data: {
        validation: "VALID",
      },
    });
    return manager;
  } catch (error) {
    console.log(error);
    throw Error("Failed to validate manager");
  }
};

export const validateManagerController = async (
  req: Request,
  res: Response
) => {
  try {
    const { managerId } = req.params;
    const manager = await validateManager(managerId);
    return res.status(200).json(manager);
  } catch (error) {
    console.log(error);
    return res.status(500).json("internal server error");
  }
};

export const cancelManager = async (id: string) => {
  try {
    const manager = await prisma.manager.update({
      where: {
        id,
      },
      data: {
        validation: "REFUSED",
      },
    });
    await cancelStep(manager.stepId);
  } catch (error) {
    console.log(error);
    throw Error("Failed to cancel manager");
  }
};

export const cancelManagerController = async (req: Request, res: Response) => {
  try {
    const { managerId } = req.params;
    const manager = await cancelManager(managerId);
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
        validation: true,
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
