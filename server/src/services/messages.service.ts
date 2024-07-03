import logger from "../utils/logger";
import { PrismaClient } from "@prisma/client";

type ISaveAnswers = {
  id: string;
  body: string;
  from: string;
  media: boolean;
  to: string;
  status: string;
  type: string;
  campaign?: string;
};

const prisma = new PrismaClient();

export const retrieveMessages = async (type: string) => {
  const messages = await prisma.message.findMany({
    where: {
      type,
    },
    include: {
      Whatsapp: {
        select: {
          phone: true,
        },
      },
    },
  });
  return messages;
};

export const saveAnswers = async (data: ISaveAnswers) => {
  const contact = await prisma.message.findFirst({
    where: {
      to: data.from.replace("@c.us", ""),
    },
  });

  const newMessage = await prisma.message.create({
    data: {
      senderId: data.id,
      content: data.body,
      from: data.from,
      media: `${data.media ? "<multimedia>" : ""}`,
      to: data.to,
      status: data.status,
      type: data.type,
      campaign: contact?.campaign,
    },
  });

  return newMessage;
};
