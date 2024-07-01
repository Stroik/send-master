import type { Request, Response } from "express";
import { retrieveMessages } from "../services/messages.service";

export const getMessages = async (req: Request, res: Response) => {
  const whatsapps = await retrieveMessages();

  return res.status(200).json(whatsapps);
};
