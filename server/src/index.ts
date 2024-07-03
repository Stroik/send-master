import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import { socketMiddleware } from "./middleware/socketMiddleware";
import { handleQRCode } from "./socket/handleQRCode";
import { handleMessages } from "./socket/handleMessages";
import whatsappRoutes from "./routes/whatsappRoutes";
import messagesRoute from "./routes/messages.route";
import app from "./app";
import { whatsappManager } from "./lib/whatsapp/WhatsappManager";
import logger from "./utils/logger";
import { handleWhatsappLogin } from "./socket/handleWhatsappLogin";
import { handleWhatsappValidation } from "./socket/handleWhatsappValidation";

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(socketMiddleware(io));

app.use("/api/whatsapp", whatsappRoutes);
app.use("/api/messages", messagesRoute);

io.on("connection", (socket) => {
  logger.info(`User ${socket.id} is connected`);

  handleQRCode(socket);
  handleWhatsappLogin(socket);
  handleMessages(socket);
  handleWhatsappValidation(socket);

  socket.on("disconnect", () => {
    logger.warn(`User ${socket.id} is disconnected`);
  });
});

const PORT = process.env.PORT || 3000;

whatsappManager.resetStatus();
server.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
