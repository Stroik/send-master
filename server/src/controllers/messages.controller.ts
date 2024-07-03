import type { Request, Response } from "express";
import { retrieveMessages } from "../services/messages.service";

export const getMessages = async (req: Request, res: Response) => {
  const whatsapps = await retrieveMessages("BOT");

  return res.status(200).json(whatsapps);
};

export const getAnswers = async (req: Request, res: Response) => {
  const answers = await retrieveMessages("HUMAN");

  return res.status(200).json(answers);
};
