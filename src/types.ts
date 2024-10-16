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
