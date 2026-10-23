
import { Router } from "express";
import { chatWithZuno } from "../controllers/ai.controller.js";

const router = Router();

router.post("/chat", chatWithZuno);

export default router;
