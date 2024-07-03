import type { Socket } from "socket.io";
import { whatsappManager } from "../lib/whatsapp/WhatsappManager";
import { v4 as uuid } from "uuid";
import logger from "../utils/logger";

export const handleQRCode = (socket: Socket) => {
  socket.on("needQR", () => {
    logger.debug("[needQR] - El usuario solicita un nuevo QR");
    socket.emit("new-whatsapp");
    socket.emit("qrProcessing");
  });

  socket.on("new-whatsapp", async () => {
    const id = uuid();

    logger.debug(
      "[new-whatsapp] - Registrando un nuevo whatsapp con id: " + id
    );

    const whatsapp = await whatsappManager.register(id, socket);
    socket.emit("whatsapp-created", whatsapp.id);
  });

  socket.on("initQR", async (id) => {
    logger.debug("[initQR] - Starting QR generation for id: " + id);
    const whatsapp = whatsappManager.getWhatsapp(id);
    whatsapp?.qrCode();
  });
};
