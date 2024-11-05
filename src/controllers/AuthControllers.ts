import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import prisma from "../config/db";

import dotenv from "dotenv";
import crypto from "crypto";
import { sendEmail } from "@/utils/sendMail";
dotenv.config();

// register global
export const register = async (
  req: Request & { user?: any },
  res: Response
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
      },
    });

    delete (user as { password?: string }).password;

    req.user = user;
    const token: string = jwt.sign(
      { email: user.email, ver: user.ver },
      process.env.JWT_SECRET || "secret@2025",
      { expiresIn: "1d" }
    );

    // res.cookie("token", token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });

    return res.status(200).json({ user });
  } catch (err) {
    console.log(err);
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

    if (!user.valid) {
      return res.status(401).json({ message: "Please validate your email" });
    }

    console.log(user.valid);

    const token: string = jwt.sign(
      { email: user.email, ver: user.ver },
      process.env.JWT_SECRET || "secret@2025",
      { expiresIn: "1d" }
    );

    res.cookie("token", token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });

    return res.status(200).json({ user, token });
  } catch (err) {
    return res.status(500).json({ error: err });
  }
};

// password forgot global
export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "12h" }
    );
    await prisma.resetToken.create({
      data: {
        ownerId: user.id,
        token,
      },
    });
    return res
      .status(200)
      .json({ message: "Password reset link sent to your email." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

// password reset global
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res
        .status(400)
        .json({ message: "Token and new password are required" });
    }
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
    } catch (err) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }
    const resetToken = await prisma.resetToken.findFirst({
      where: { token },
    });

    if (!resetToken) {
      return res.status(404).json({ message: "Invalid token" });
    }
    const user = await prisma.user.findUnique({
      where: { id: resetToken.ownerId },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const hashedPassword = bcrypt.hashSync(newPassword, 10);
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });
    await prisma.resetToken.delete({
      where: { id: resetToken.id },
    });
    return res
      .status(200)
      .json({ message: "Password has been reset successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

export const validateEmail = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: "Token is required" });
    }

    const validation = await prisma.emailValidation.findUnique({
      where: {
        token,
      },
      include: {
        user: {
          select: {
            email: true,
          },
        },
      },
    });
    if (!validation) {
      return res.status(400).json({ message: "Invalid token" });
    }
    if (validation?.createdAt < new Date(Date.now() - 24 * 60 * 60 * 1000)) {
      return res.status(403).json({ message: "Token expired" });
    }

    const user = await prisma.user.update({
      where: {
        id: validation.userId,
      },
      data: {
        valid: true,
      },
    });

    prisma.emailValidation.update({
      where: {
        id: validation.id,
      },
      data: {
        valid: true,
      },
    });

    return res
      .status(200)
      .json({ message: "Email has been validated successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err });
  }
};
