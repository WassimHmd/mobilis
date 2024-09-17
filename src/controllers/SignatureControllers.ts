import { Request, Response } from "express";
import prisma from "../config/db";
import { RequestWithImages } from "@/types";

export const createSignature = async (signaturePath: string) => {
  try {
    const signature = await prisma.signaNum.create({
      data: {
        path: signaturePath,
      }
    })

    return signature
  }catch(error){
    console.log(error)
    return false
  }
}

export const addSignature = async (req: RequestWithImages, res: Response) => {
  try {
    const {userId} = req.params 
    const signature = req.images?.signature[0]
    if(!signature){
      return res.status(400).json({message: "Signature not found"})
    }
    
    const user = await prisma.user.update({
      where: {
        id: userId
      },
      data: {
        signature: {
          create: {
            path: signature
          }
        }
      }
    })

    return res.status(200).json(user)

  }catch(error){
    console.log(error)
    return res.status(500).json({message: "Internal server error"})
  }
}