import { Request } from "express";

export interface RequestWithImages extends Request {
  images?: Record<string, any>;
}

export interface RequestWithOcr extends Request {
  images?: Record<string, any>;
  step?: string
}

export interface NotificationObject {
  title: string;
  message?: string;
  payload: object;
  id?: string;
}
