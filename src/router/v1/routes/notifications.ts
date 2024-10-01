import {
  getNotificationsByUser,
  readNotification,
} from "@/controllers/NotificationControllers";
import { Router } from "express";

const router = Router();

/**
 * @swagger
 * /api/v1/notifications/read/{notificationId}:
 *   post:
 *     summary: Mark a notification as read
 *     description: Marks a notification as read by ID
 *     tags:
 *       - Notifications
 *     parameters:
 *       - in: path
 *         name: notificationId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the notification to mark as read.
 *
 *     responses:
 *       200:
 *         description: Notification marked as read
 *       404:
 *         description: Notification not found
 *       500:
 *         description: Internal Server Error
 */

router.post("/read/:notificationId", readNotification);

/**
 * @swagger
 * /api/v1/notifications/{userId}:
 *   get:
 *     summary: Get all notifications for a user
 *     description: Gets all notifications for a user by ID
 *     tags:
 *       - Notifications
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the user to get notifications for
 *
 *     responses:
 *       200:
 *         description: Notifications
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal Server Error
 */

router.get("/:userId", getNotificationsByUser);

export default router;
