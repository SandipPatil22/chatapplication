import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { sendMessage } from "../controllers/sendMessage.controller.js";

const router = Router();

router.post("/message", verifyJWT,  sendMessage);

export default router;
