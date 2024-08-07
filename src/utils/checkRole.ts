import { Request, Response } from "express";

export const checkRole = (role: string) => {
  return (req: Request & { user: { role: string } }, res: Response, next: Function) => {
    const userRole = req.user.role;

    if (userRole === role) {
      next();
    }else {
      return res.status(403).json({ message: "Forbidden" });
    }  
  }
};
