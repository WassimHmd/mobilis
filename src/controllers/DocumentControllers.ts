import { Request, Response } from "express";
import prisma from "../config/db";
import { DocTypes } from "@prisma/client";
//@ts-ignore
import buildReport from "./../utils/pdf";
import path from "path";
import fs from "fs";
import { addSA1Candidate, getCurrentStep } from "./StepsControllers";
import { RequestWithImages } from "@/types";

export const createDocument = async (req: RequestWithImages, res: Response) => {
  const {
    type,
    data,
    siteId,
    comment,
  }: { type: DocTypes; data: string; siteId: string; comment: string } =
    req.body;

  try {
    const parsedData = JSON.parse(data);
    const step = await getCurrentStep(parseInt(siteId));

    if (!step) {
      return res.status(404).json({ error: "Step not found" });
    }

    // if (!req.images || !("images" in req.images) || req.images.images.length !== 4) {
    //   return res.status(400).json({ error: "Please provide all 3 required images" });
    // }

    const stepId = step.id;

    const document = await prisma.document.create({
      data: {
        type,
        data: parsedData,
        stepId,
        siteId: parseInt(siteId),
      },
    });
    await prisma.step.update({
      where: { id: stepId },
      data: {
        comment,
      },
    });

    let template_file;
    switch (type) {
      case "SA1":
        template_file = "SA1.hbs";
        addSA1Candidate(stepId, {
          long: parsedData.candidat_x.long,
          lat: parsedData.candidat_x.lat,
          location: parsedData.candidat_x.addr,
        });
        addSA1Candidate(stepId, {
          long: parsedData.candidat_y.long,
          lat: parsedData.candidat_y.lat,
          location: parsedData.candidat_y.addr,
        });
        addSA1Candidate(stepId, {
          long: parsedData.candidat_z.long,
          lat: parsedData.candidat_z.lat,
          location: parsedData.candidat_z.addr,
        });
        break;

      case "SA2":
        template_file = "SA2/SA2.hbs";
        break;

      case "SA3":
        template_file = "SA3/SA3.hbs";
        break;

      case "SA4":
        template_file = "SA4.hbs";
        break;

      case "ASBUILT":
        template_file = "AsBuilt/AsBuilt_anx.hbs";
        break;

      default:
        return res.status(404).json("Unknown document type.");
    }

    await buildReport(
      template_file,
      document.data,
      document.id,
      req.images?.images
    );
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
  }: { type: DocTypes; data: object; siteId: number } = req.body;
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

export const downloadDocumentById = async (req: Request, res: Response) => {
  const { id }: { id?: string } = req.params;

  try {
    // const documentPath = path.join(__dirname, "../documents", `${id}.pdf`);
    // if (!fs.existsSync(documentPath)) {
    //   return res.status(404).json({ message: "Document not found" });
    // }
    res.setHeader(`Content-Disposition`, `attachment; filename="${id}.pdf"`);
    return res.sendFile(id + ".pdf", { root: "src/documents" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
