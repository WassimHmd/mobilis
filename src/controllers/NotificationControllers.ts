import prisma from "../config/db";
import { Request, Response } from "express";

export const readNotification = async (req: Request, res: Response) => {
  try {
    const { notificationId } = req.params;

    const notification = await prisma.notification.update({
      where: {
        id: notificationId,
      },
      data: {
        read: true,
      },
    });

    return res.status(200).json(notification);
  } catch (error) {
    console.log(error);
    res.status(500).json("Internal server error");
  }
};

export const getNotificationsByUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const notifications = await prisma.notification.findMany({
      where: {
        targetId: userId,
      },
    });

    return res.status(200).json(notifications);
  } catch (error) {
    console.error(error);
    res.status(500).json("Internal server error");
  }
};
