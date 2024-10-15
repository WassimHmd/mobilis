import { User } from "@prisma/client";
import { Request } from "express";

export interface RequestWithImages extends Request {
  images?: Record<string, any>;
}

export interface NotificationObject {
  title: string;
  message?: string;
  payload: object;
  id?: string;
}

export interface AuthRequest extends Request {
  user?: User; // Adjust User to match your actual User type
  role?: string;
}
