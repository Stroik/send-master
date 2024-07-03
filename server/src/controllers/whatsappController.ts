import { deleteWhatsapp, retrieveWhatsapps } from "../services/whatsappService";
import { Request, Response } from "express";

export const registerWhatsapp = async (req: Request, res: Response) => {
  try {
    res.status(200).json({ id: 2 });
  } catch (error) {
    res.status(500).json({ error: "Error registering WhatsApp account" });
  }
};

export const sendMessage = async (req: Request, res: Response) => {
  try {
    res.status(200).send("Message sent from all accounts");
  } catch (error) {
    res.status(500).json({ message: "Error sending message", error });
  }
};

export const getWhatsapps = async (req: Request, res: Response) => {
  const whatsapps = await retrieveWhatsapps();

  return res.status(200).json(whatsapps);
};

export const delWhatsapp = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const deleted = await deleteWhatsapp(id);
    return res.status(200).json({
      status: "ok",
      message: "WhatsApp deleted successfully",
      deleted,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error deleting WhatsApp account", error });
  }
};
