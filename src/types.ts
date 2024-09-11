import { Request } from "express";


export interface RequestWithImages extends Request {
  images?: Record<string, any>;
}