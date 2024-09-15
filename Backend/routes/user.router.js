import { Router } from "express";
import { fieldsupload } from "../middlewares/multer.middleware.js";
import { createUser, getuser, login } from "../controllers/user.controller.js";

const router = Router();

router.post("/createUser", fieldsupload, createUser);

router.post("/login", login);

router.get("/getUser", getuser);

export default router;
