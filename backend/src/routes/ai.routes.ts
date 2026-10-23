
import { Router } from "express";
import { chatWithZuno } from "../controllers/ai.controller";

const router = Router();

router.post("/chat", chatWithZuno);

export default router;
