import { Request, Response } from "express";
import prisma from "../config/db";
import { DocTypes } from "@prisma/client";
//@ts-ignore
import buildReport from './../utils/pdf';

export const createDocument = async (req: Request, res: Response) => {
  const {
    type,
    data,
    siteId,
  }: { type: DocTypes; data: object; siteId: string } = req.body;
  try {
    const document = await prisma.document.create({
      data: {
        type,
        data,
        siteId,
      },
    });
    
    await buildReport("SA1.hbs", document.data)
    res.status(201).json(document);
  } catch (error: any) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

export const getAllDocuments = async (req: Request, res: Response) => {
  try {
    const documents = await prisma.document.findMany();
    res.status(200).json(documents);
  } catch (error: any) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};
export const getDocumentById = async (req: Request, res: Response) => {
  const { id }: { id?: string } = req.query;
  try {
    const document = await prisma.document.findUnique({
      where: { id },
    });
    if (!document) {
      return res.status(404).json({ error: "Document not found" });
    }
    res.status(200).json(document);
  } catch (error: any) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

export const updateDocument = async (req: Request, res: Response) => {
  const { id }: { id?: string } = req.query;
  const {
    type,
    data,
    siteId,
  }: { type: DocTypes; data: object; siteId: string } = req.body;
  const string_data: string = JSON.stringify(data);
  try {
    const document = await prisma.document.update({
      where: { id },
      data: {
        type,
        data: string_data,
        siteId,
      },
    });
    res.status(200).json(document);
  } catch (error: any) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

export const deleteDocument = async (req: Request, res: Response) => {
  const { id }: { id?: string } = req.query;
  try {
    const document = await prisma.document.delete({
      where: { id },
    });
    res.status(200).json({ message: "Document deleted" });
  } catch (error: any) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};
