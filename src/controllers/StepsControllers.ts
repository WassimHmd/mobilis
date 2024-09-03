import { Request, Response } from "express";
import prisma from "../config/db";
import { Site, Step, StepTypes } from "@prisma/client";
import { replicateManagers } from "./ManagerControllers";

export const createStep = async (
  siteId: string,
  type: StepTypes,
  payload: object = {}
) => {
  try {
    const step = await prisma.step.create({
      data: {
        siteId,
        type,
        payload,
      },
    });
    return step;
  } catch (error) {
    console.log(error);
    throw Error("Failed to create step");
  }
};

export const getCurrentStep = async (siteId: string) => {
  if(!siteId) throw Error("siteId is required")
  console.log(siteId)
  try {
    const step = await prisma.step.findFirst({
      where: {
        siteId,
        status: "PENDING",
      },
    });
    return step;
  } catch (error) {
    console.log(error);
    throw Error("Failed to get current step")
  }
};

export const getAllSteps = async (siteId: string) => {
  try {
    const steps = await prisma.step.findMany({
      where: {
        siteId,
      },
    })
    return steps
  }catch(error){
    console.log(error)
    throw Error("Failed to get all steps")
  }
}

export const nextStep = async (siteId: string) => {
  const stepOrder: StepTypes[] = [
    "SA1",
    "SA2",
    "SA3",
    "SA4",
    "ANF",
    "DOS",
    "OC",
  ];
  try {
    const step = await getCurrentStep(siteId);
    console.log(step)
    if (step) {
      const index = stepOrder.indexOf(step.type);
      if (index < stepOrder.length - 1) {
        const nextStep = stepOrder[index + 1];
        const newStep = await createStep(siteId, nextStep);
        await prisma.step.update({
          where: {
            id: step.id
          },
          data: {
            status: "COMPLETED"
          }
        })
        return newStep;
      }
    }
  } catch (error) {
    console.log(error);
    throw Error("Failed to get next step")
  }
};

export const cancelStep = async (stepId: string) => {

  
  try {
    // const stepId = (await getCurrentStep(siteId))?.id
    const step = await prisma.step.update({
      where: {
        id:stepId
      },
      data: {
        status: "FAILED"
      }
    })
    const newStep = await createStep(step.siteId, step.type)
    await replicateManagers(stepId, newStep.id)

    return newStep
    
  }catch(error){
    console.log(error)
    throw Error("Failed to cancel step")
  }
}

export const updateStep = async (stepId: string, data: object) => {
  try {
    const step = await prisma.step.update({
      where: {
        id: stepId
      },
      data: {
        payload: data
      }
    })
  }catch(error){
    console.log(error)
    throw Error("Failed to update step")
  }
}

export const testFeature = async (req: Request, res: Response) => {
  try {
    
    const {id} = req.params
    const step = await cancelStep(id)
    return res.status(200).json(step)
  }catch(error){
    console.log(error)
    return res.status(500).json("internal server error")
  }
}