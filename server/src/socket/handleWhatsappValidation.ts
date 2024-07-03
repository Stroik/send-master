import type { Socket } from "socket.io";
import { whatsappManager } from "../lib/whatsapp/WhatsappManager";
import logger from "../utils/logger";

export const handleWhatsappValidation = async (socket: Socket) => {
  let currentIndex = 0;
  socket.on("validate", async (data) => {
    try {
      const whatsapps = whatsappManager.getWhatsapps();

      if (whatsapps.length === 0) {
        logger.error("No WhatsApps available to send message");
        return;
      }

      const currentWhatsapp = whatsapps[currentIndex];

      const isValid = await currentWhatsapp?.validateNumber(data.phone);

      if (isValid) {
        socket.emit("valid", data);
        return;
      } else {
        socket.emit("not_valid", data);
        return;
      }
    } catch (error) {
      socket.emit("validated_error", {
        message: "Los whatsapps han sido banneados",
      });
      return;
    }
  });
};
