import { MessageMedia } from "whatsapp-web.js";
import { whatsappManager } from "../lib/whatsapp/WhatsappManager";
import logger from "../utils/logger";
import { Socket } from "socket.io";
import { PrismaClient } from "@prisma/client";

type IData = {
  phone: string;
  message: string;
  media?: string;
  format?: string;
  campaign?: string;
};

const prisma = new PrismaClient();

const saveMessage = async (
  data: IData,
  senderId: string,
  status: string,
  campaign: string,
  whatsappNumber: string
) => {
  const saved = await prisma.message.create({
    data: {
      content: data.message,
      media: data.media ?? "",
      from: whatsappNumber,
      to: data.phone,
      status,
      senderId,
      campaign,
      type: "BOT"
    },
  });

  return saved;
};

export const handleMessages = (socket: Socket) => {
  let currentIndex = 0;

  socket.on("send-message", async (data: IData) => {
    const whatsapps = whatsappManager.getWhatsapps();

    if (whatsapps.length === 0) {
      logger.error("No WhatsApps available to send message");
      return;
    }

    const currentWhatsapp = whatsapps[currentIndex];
    const whatsappNumber =
      currentWhatsapp.info !== undefined
        ? String(currentWhatsapp.info.wid._serialized).replace("@c.us", "")
        : "";
    const hasMedia = data.media?.length;
    let media;
    if (hasMedia) {
      media = MessageMedia.fromFilePath(data.media as string);
    }

    try {
      if (media instanceof MessageMedia) {
        await currentWhatsapp.sendMessage(data.phone + "@c.us", media, {
          caption: data.message,
        });
      } else {
        await currentWhatsapp.sendMessage(data.phone + "@c.us", data.message);
      }

      await saveMessage(
        data,
        currentWhatsapp.id,
        "SENT",
        data.campaign ?? "",
        whatsappNumber
      );
      socket.emit("message-success");
      logger.info(
        `Message sent to ${data.phone} using WhatsApp index ${currentIndex}`
      );
    } catch (error) {
      logger.error(
        `Failed to send message to ${data.phone} using WhatsApp index ${currentIndex}: ${error}`
      );
      await saveMessage(
        data,
        currentWhatsapp.id,
        "FAILED",
        data.campaign ?? "",
        whatsappNumber
      );
      socket.emit("message-failed");
    }
    socket.emit("message-sent");
    currentIndex = (currentIndex + 1) % whatsapps.length;
  });
};
