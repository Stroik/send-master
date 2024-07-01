import type { Socket } from "socket.io";
import logger from "../utils/logger";
import { whatsappManager } from "../lib/whatsapp/WhatsappManager";

export const handleWhatsappLogin = (socket: Socket) => {
  socket.on("login-whatsapp", async (id) => {
    logger.info(
      "[login-whatsapp] - El whatsapp " + id + " está iniciando sesión"
    );

    const whatsapp = await whatsappManager.register(id, socket);
    socket.emit("whatsapp-loging", whatsapp.id);
  });
};
