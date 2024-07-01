import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const retrieveMessages = async () => {
  const messages = await prisma.message.findMany({
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
