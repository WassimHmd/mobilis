import { NextFunction, Request, Response } from "express";
import prisma from "../config/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User, userTypes } from "@prisma/client";
import { AuthRequest } from "@/types";
import { getCurrentStep } from "@/controllers/StepsControllers";

export const checkRole = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: Function) => {
    const userRole = req.role;

    if (userRole && roles.includes(userRole)) {
      next();
    } else {
      return res.status(403).json({ message: "Forbidden" });
    }
  };
};

export const registerMiddleware = (userType: userTypes) => {
  return async (
    req: Request & { user?: any },
    res: Response,
    next: Function
  ) => {
    try {
      const { email, password, firstName, lastName, phoneNumber } = req.body;
      if (!email || !password || !firstName || !lastName)
        return res.status(400).json({ message: "All fields are required" });

      const emailAlreadyExists = await prisma.user.findUnique({
        where: { email },
      });
      if (emailAlreadyExists)
        return res.status(400).json({ message: "Email already exists" });

      const hashedPassword: string = bcrypt.hashSync(password, 10);

      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          firstName,
          lastName,
          phoneNumber,
          userType: userType,
        },
      });

      req.user = user;
      const token: string = jwt.sign(
        { email: user.email, ver: user.ver },
        process.env.JWT_SECRET || "secret",
        { expiresIn: "1d" }
      );

      res.cookie("token", token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
      });

      next();
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: err });
    }
  };
};

export const verifyToken = async (
  req: AuthRequest,
  res: Response,
  next: Function
) => {
  try {
    // const { cookies } = req;

    const token = req.cookies?.token || req.headers.authorization;
    if (!token) {
      return res.status(404).json({ message: "token not found" });
    }
    let email = "";
    let ver = undefined;

    jwt.verify(
      String(token),
      process.env.JWT_SECRET || "secret",
      (err, user: any) => {
        if (err) {
          return res.status(401).json({ message: "Invalide token" });
        }
        email = user.email;
        ver = user.ver;
        req.role = user.role;
      }
    );

    const user = await prisma.user.findUnique({
      where: { email: email },
    });
    if (user?.ver != ver)
      return res.status(401).json({ message: "Invalide token" });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error });
  }
};

export const checkAccessSite = (roles: userTypes[]) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { siteId } = req.params;
      const { user } = req;
      if (!user) return res.status(401).json({ message: "Unauthorized" });
      if (req.role === "admin") {
        next();
      }

      if (!roles.includes(user.userType)) {
        return res.status(403).json({ message: "Forbidden" });
      }

      const site = await prisma.site.findUnique({
        where: { id: parseInt(siteId) },
      });

      if (
        ![
          site?.moderatorId,
          site?.subcontractorId,
          site?.bureauId,
          site?.negociatorId,
        ].includes(user.id)
      ) {
        return res.status(403).json({ message: "Forbidden" });
      }

      next();
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error });
    }
  };
};

export const checkStepAccess = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { siteId } = req.params;
    const { user } = req;
    if (!user) return res.status(401).json({ message: "Unauthorized" });
    if (req.role === "admin") {
      return next();
    }

    const step = await getCurrentStep(parseInt(siteId));

    let roles: userTypes[] = [];

    switch (step?.type) {
      case "SA1":
        roles = ["MODERATOR", "SUBCONTRACTOR", "BUREAU", "NEGOCIATOR"];
        break;
      case "SA2":
        roles = ["MODERATOR", "SUBCONTRACTOR", "BUREAU", "NEGOCIATOR"];
        break;
      case "SA3":
        roles = ["MODERATOR", "SUBCONTRACTOR", "BUREAU", "NEGOCIATOR"];
        break;
      case "SA4":
        roles = ["MODERATOR", "SUBCONTRACTOR", "BUREAU", "NEGOCIATOR"];
        break;
      case "ANF":
        roles = ["MODERATOR", "SUBCONTRACTOR", "BUREAU", "NEGOCIATOR"];
        break;
      case "DOS":
        roles = ["MODERATOR", "SUBCONTRACTOR", "BUREAU", "NEGOCIATOR"];
        break;
      case "OC":
        roles = ["MODERATOR", "SUBCONTRACTOR", "BUREAU", "NEGOCIATOR"];
        break;
    }

    checkAccessSite(roles)(req, res, next);
  } catch (error) {}
};
