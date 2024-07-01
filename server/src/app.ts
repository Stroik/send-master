import express from "express";
import cors from "cors";
import morgan from "morgan";
import whatsappRoutes from "./routes/whatsappRoutes";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.use("/api/whatsapp", whatsappRoutes);

app.use(errorHandler);

export default app;
