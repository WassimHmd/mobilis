import prisma from "@/config/db";
import { Request, Response } from "express";

export const getInvitation = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const invitation = await prisma.invitation.findUnique({
      where: {
        id,
      },
    });
    return res.status(200).json(invitation);
  } catch (error) {
    console.error(error);
  }
};
