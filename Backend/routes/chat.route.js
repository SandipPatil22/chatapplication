import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createChat,
  deleteChat,
  getchat,
} from "../controllers/chat.controller.js";

const router = Router();

router.post("/createChat", verifyJWT, createChat);

router.get("/getChat/:chatId", verifyJWT, getchat);

router.patch("/deletechat/:chatId", verifyJWT, deleteChat);

export default router;
