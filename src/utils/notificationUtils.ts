import admin from "../config/firebase";
import prisma from "../config/db";
import io, { userSockets } from "../config/socket";
import { Message } from "firebase-admin/lib/messaging/messaging-api";

export const notifyUser = async ({
  targetId,
  title,
  message,
  payload,
}: {
  targetId: string;
  title: string;
  message: string;
  payload: object;
}) => {
  try {
    console.log("targetId: ", targetId);
    prisma.notification
      .create({
        data: {
          targetId,
          title,
          message,
          payload,
        },
      })
      .then((notification) => console.log(notification));
    // console.log(notification);

    io.in(userSockets[targetId]).emit("notification", {
      title,
      message,
      payload,
    });

    const targets = await prisma.notificationTarget.findMany({
      where: {
        userId: targetId,
      },
    });
    for (let target of targets) {
      const fb_object: Message = {
        token: target.token,
        notification: {
          title,
          body: message,
        },
      };

      admin
        .messaging()
        .send(fb_object)
        .then((response) => {
          console.log("Successfully sent message:", response);
        })
        .catch((error) => {
          console.error("Error sending message:", error);
        });
    }
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const formatSite = (siteId: number) => {
  return `#${siteId.toString().padStart(5, "0")}`;
};
