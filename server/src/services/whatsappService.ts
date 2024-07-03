import { IMessage } from "../lib/whatsapp/Whatsapp";
import { whatsappManager } from "../lib/whatsapp/WhatsappManager";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export const registerWhatsapp = async (id: string) => {
  const whatsapp = "hola";
  return whatsapp;
};

export const sendMessage = async (message: IMessage) => {
  const accounts = whatsappManager.getWhatsapps();
  for (const account of accounts) {
    await account.sendMsg(message);
  }
};

export const retrieveWhatsapps = async () => {
  const whatsapps = await prisma.whatsapp.findMany({
    where: {
      active: true,
    },
  });
  return whatsapps;
};

export const deleteWhatsapp = async (id: string) => {
  const deleted = await prisma.whatsapp.update({
    where: { id },
    data: { active: false },
  });
  return deleted;
};
