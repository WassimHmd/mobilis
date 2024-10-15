import prisma from "../config/db";
import io, { userSockets } from "../config/socket";

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
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const formatSite = (siteId: number) => {
  return `#${siteId.toString().padStart(5, "0")}`;
};
