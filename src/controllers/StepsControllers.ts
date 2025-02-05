import { Request, Response } from "express";
import prisma from "../config/db";
import { Site, Step, StepTypes, SubStepOCStatus } from "@prisma/client";
import { createManager, replicateManagers } from "./ManagerControllers";
//@ts-ignore
import { sendEmail } from "./../utils/sendMail";
import { formatSite, notifyUser } from "../utils/notificationUtils";

type SA1Candidate = {
  long: string;
  lat: string;
  location: string;
};
export const createStep = async (
  siteId: number,
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

    if (type === "OC") {
      await createSubStepOC(step.id, "ACTIVE", 0);
    }

    const newStep = await prisma.step.findUnique({
      where: {
        id: step.id,
      },
      include: {
        site: true,
        SubStepOC: true,
      },
    });
    if (newStep) return newStep;
    else {
      return step;
    }
  } catch (error) {
    console.log(error);
    throw Error("Failed to create step");
  }
};

export const getCurrentStep = async (siteId: number) => {
  if (!siteId) throw Error("siteId is required");
  console.log(siteId);
  try {
    const step = await prisma.step.findFirst({
      where: {
        siteId,
        status: { in: ["PENDING", "VALIDATION"] },
      },
    });
    return step;
  } catch (error) {
    console.log(error);
    throw Error("Failed to get current step");
  }
};

export const getAllSteps = async (siteId: number) => {
  try {
    const steps = await prisma.step.findMany({
      where: {
        siteId,
      },
      include: {
        Images: true,
        SA1Candidate: true,
        Document: true,
        site: true,
        SubStepOC: {
          include: {
            indoor: {
              include: {
                Images: true,
              },
            },
            outdoor: {
              include: {
                Images: true,
              },
            },
            imageCollection: {
              include: {
                Images: true,
              },
            },
          },
        },
      },

      orderBy: {
        createdAt: "asc",
      },
    });

    //TODO: don't include SA1Candidate in non SA1 steps
    return steps;
  } catch (error) {
    console.log(error);
    throw Error("Failed to get all steps");
  }
};

export const addSA1Candidate = async (stepId: string, data: SA1Candidate) => {
  const candidate = await prisma.sA1Candidate.create({
    data: {
      ...data,
      stepId,
    },
  });

  return candidate;
};

export const addSA1CandidateController = async (
  req: Request,
  res: Response
) => {
  try {
    const { stepId } = req.params;
    const { long, lat, location } = req.body; // Assuming the candidate data comes in the request body

    const candidate = await addSA1Candidate(stepId, { long, lat, location });

    res.status(201).json(candidate);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to add candidate" });
  }
};

export const chooseSA1Candidate = async (req: Request, res: Response) => {
  try {
    const { candidateId } = req.params;

    const candidate = await prisma.sA1Candidate.update({
      where: {
        id: candidateId,
      },
      data: {
        status: "CHOSEN",
      },
      include: {
        step: true,
      },
    });

    const site = await prisma.site.update({
      where: {
        id: candidate.step.siteId,
      },
      data: {
        long: candidate.long,
        lat: candidate.lat,
        location: candidate.location,
      },
    });

    return res.status(200).json(site);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to choose candidate" });
  }
};

export const nextStep = async (siteId: number) => {
  const stepOrder: StepTypes[] = [
    "SA1",
    "SA2",
    "SA3",
    "APD",
    "SA4",
    "ANF",
    "OC",
    "DOS",
  ];
  try {
    const step = await getCurrentStep(siteId);
    console.log("step: ", step);
    if (!step) throw Error("Step unavailable");
    const managers = await prisma.manager.findMany({
      where: {
        stepId: step?.id,
      },
    });

    const stepCompleteNotif = (step: string) => ({
      title: `${step} completed for site ${formatSite(siteId)}`,
      message: "Step completed",
      payload: { siteId },
    });

    if (step.status !== "VALIDATION") {
      throw Error("Step is not in validation phase");
    }

    for (let manager of managers) {
      if (
        manager.validation === "PENDING" ||
        manager.validation === "REFUSED"
      ) {
        throw Error("Manager validation is not completed");
      }
    }
    if (step) {
      const index = stepOrder.indexOf(step.type);
      if (index <= stepOrder.length - 1) {
        const nextStep = stepOrder[index + 1];
        const newStep = await createStep(siteId, nextStep);
        prisma.site
          .findUnique({
            where: {
              id: siteId,
            },
          })
          .then(async (site) => {
            console.log(site);
            if (site) {
              notifyUser({
                targetId: site.subcontractorId,
                ...stepCompleteNotif(step.type),
              });
              notifyUser({
                targetId: site.moderatorId,
                ...stepCompleteNotif(step.type),
              });
              if (site.bureauId)
                notifyUser({
                  targetId: site.bureauId,
                  ...stepCompleteNotif(step.type),
                });
              if (site.negociatorId)
                notifyUser({
                  targetId: site.negociatorId,
                  ...stepCompleteNotif(step.type),
                });
            }
          })
          .catch((err) => console.log(err));
        await prisma.step.update({
          where: {
            id: step.id,
          },
          data: {
            status: "COMPLETED",
          },
        });
        console.log(nextStep);
        const invites = await prisma.managerInvitation.findMany({
          where: {
            siteId,
            stepType: nextStep,
          },
        });

        const promises = invites.map((invite) => {
          return createManager(
            invite.email,
            invite.type,
            newStep.id,
            invite.phoneNumber
          );
        });

        await Promise.all(promises);
        return newStep;
      } else {
        await prisma.site.update({
          where: {
            id: siteId,
          },
          data: {
            status: "COMPLETED",
          },
        });
      }
    }
  } catch (error) {
    console.log(error);
    throw Error("Failed to get next step");
  }
};

export const cancelStep = async (stepId: string, comment: string) => {
  try {
    // const stepId = (await getCurrentStep(siteId))?.id
    const step = await prisma.step.update({
      where: {
        id: stepId,
      },
      data: {
        status: "FAILED",
        comment,
      },
    });
    const newStep = await createStep(step.siteId, step.type);
    await replicateManagers(stepId, newStep.id);

    return newStep;
  } catch (error) {
    console.log(error);
    throw Error("Failed to cancel step");
  }
};

export const updateStep = async (stepId: string, data: object) => {
  try {
    const step = await prisma.step.update({
      where: {
        id: stepId,
      },
      data: {
        payload: data,
      },
    });
  } catch (error) {
    console.log(error);
    throw Error("Failed to update step");
  }
};

export const testFeature = async (req: Request, res: Response) => {
  try {
    sendEmail(
      "hamedani.wassim@gmail.com",
      "Test Email",
      "<html><body><h1>Hello from Brevo</h1></body></html>"
    )
      .then((data: any) => {
        console.log("Email sent successfully:", data);
        res.status(200).json("weeeee");
      })
      .catch((error: any) => {
        console.error("Error sending email:", error);
        res.status(400).json("failed to send email");
      });
  } catch (error) {
    console.log(error);
    return res.status(500).json("internal server error");
  }
};

export const startValidationPhase = async (stepId: string) => {
  try {
    const step = await prisma.step.update({
      where: {
        id: stepId,
      },
      data: {
        status: "VALIDATION",
      },
    });

    const stepValidationNotif = (step: string, siteId: number) => ({
      title: `${step} step awaiting validation ${formatSite(siteId)}`,
      message: "Step awaiting validation",
      payload: { siteId },
    });

    const managers = await prisma.manager.findMany({
      where: {
        stepId,
      },
    });

    prisma.site
      .findUnique({
        where: {
          id: step.siteId,
        },
      })
      .then(async (site) => {
        console.log(site);
        if (site) {
          notifyUser({
            targetId: site.subcontractorId,
            ...stepValidationNotif(step.type, step.siteId),
          });
          notifyUser({
            targetId: site.moderatorId,
            ...stepValidationNotif(step.type, step.siteId),
          });
          if (site.bureauId)
            notifyUser({
              targetId: site.bureauId,
              ...stepValidationNotif(step.type, step.siteId),
            });
          if (site.negociatorId)
            notifyUser({
              targetId: site.negociatorId,
              ...stepValidationNotif(step.type, step.siteId),
            });
        }
      })
      .catch((err) => console.log(err));

    if (!managers) {
      await nextStep(step.siteId);
      return step;
    }

    //TODO: Send Validation Emails
    managers.map((manager) => {
      sendEmail(
        manager.email,
        "Step Validation",
        `https://follow-me-test-version.netlify.app/validation/form/${manager.id}`
      );
      prisma.manager.update({
        where: {
          id: manager.id,
        },
        data: {
          sentAt: new Date(),
        },
      });
    });

    return step;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const startValidationPhaseController = async (
  req: Request,
  res: Response
) => {
  try {
    const { stepId } = req.params;
    const status = (
      await prisma.step.findUnique({
        where: {
          id: stepId,
        },
      })
    )?.status;
    if (status !== "PENDING")
      return res.status(200).json("Step already in validation phase");
    const step = await startValidationPhase(stepId);
    return res.status(200).json(step);
  } catch (error) {
    console.log(error);
    return res.status(500).json("Internal Server Error.");
  }
};

export const createSubStepOC = async (
  stepId: string,
  status: SubStepOCStatus = "ACTIVE",
  index: number
) => {
  try {
    const result = await prisma.$transaction(async (prisma) => {
      // Create indoor and outdoor ImageCollections in parallel
      const [indoorCollection, outdoorCollection, regularCollection] =
        await Promise.all([
          prisma.imageCollection.create({ data: {} }),
          prisma.imageCollection.create({ data: {} }),
          prisma.imageCollection.create({ data: {} }),
        ]);

      // Create subStepOC and reference the created collections
      const subStep = await prisma.subStepOC.create({
        data: {
          stepId,
          status,
          index,
          imageCollectionId: regularCollection.id,
          indoorId: indoorCollection.id,
          outdoorId: outdoorCollection.id,
        },
      });

      return subStep; // The result returned by the transaction
    });

    return result;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const nextSubStepOC = async (stepId: string) => {
  try {
    const subStep = await prisma.subStepOC.findFirst({
      where: {
        stepId,
        status: "ACTIVE",
      },
      orderBy: {
        index: "desc",
      },
    });
    const updatedSubStep = await prisma.subStepOC.update({
      where: {
        id: subStep?.id,
      },
      data: {
        status: "INACTIVE",
      },
    });

    let nextSubStep;
    if (subStep) {
      nextSubStep = await createSubStepOC(stepId, "ACTIVE", subStep.index + 1);
    }

    return nextSubStep;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const nextSubStepOCController = async (req: Request, res: Response) => {
  try {
    const { stepId } = req.params;

    const subStep = await nextSubStepOC(stepId);

    res.status(200).json(subStep);
  } catch (error) {
    console.log(error);
    return false;
  }
};
