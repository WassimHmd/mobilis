import { Request, Response } from "express";
import prisma from "../config/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { userTypes } from "@prisma/client";

export const checkRole = (role: string) => {
  return (
    req: Request & { user: { role: string } },
    res: Response,
    next: Function
  ) => {
    const userRole = req.user.role;

    if (userRole === role) {
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
  req: Request & { email?: string, ver?: string },
  res: Response,
  next: Function
) => {
  const { cookies } = req;

  const token = cookies.jwtoken;
  if (!token) {
    return res.status(404).json({ message: "token not found" });
  }

  jwt.verify(
    String(token),
    process.env.JWT_SECRET || "secret",
    (err, user: any ) => {
      if (err) {
        return res.status(401).json({ message: "Invalide token" });
      }
      req.email = user.email;
      req.ver = user.ver
    }
  );

  const user = await prisma.user.findUnique({
    where: { email: req.email },
  })
  if(user?.ver != req.ver) return res.status(401).json({ message: "Invalide token" });
  next();
};
