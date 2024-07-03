import { Router } from "express";
import { getAnswers, getMessages } from "../controllers/messages.controller";

const router = Router();

router.get("/", getMessages);
router.get("/answers", getAnswers);

export default router;
