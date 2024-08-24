import { Request, Response } from "express";
import prisma from "../config/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import dotenv from "dotenv";
dotenv.config();

// register global
export const register = async (req: Request & { user?: any }, res: Response) => {
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
        phoneNumber
      },
    });

    req.user = user
    const token: string = jwt.sign(
      { email: user.email, ver: user.ver },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1d" }
    );

    res.cookie("token", token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });

    return res.status(200).json(user);
  } catch (err) {
    console.log(err)
    return res.status(500).json({ error: err });
  }
};

// login global
export const login = async (req: Request, res: Response, next: Function) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "All fields are required" });

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token: string = jwt.sign(
      { email: user.email, ver: user.ver },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1d" }
    );

    res.cookie("token", token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });

    return res.status(200).json(user);
  } catch (err) {
    console.log(err)
    return res.status(500).json({ error: err });
  }
};
