import { Router } from "express";
import {
  registerWhatsapp,
  sendMessage,
  getWhatsapps,
  delWhatsapp,
} from "../controllers/whatsappController";

const router = Router();

router.get("/", getWhatsapps);
router.post("/register", registerWhatsapp);
router.post("/send-message", sendMessage);
router.delete("/:id", delWhatsapp);

export default router;
