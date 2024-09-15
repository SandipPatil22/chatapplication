import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  deleteImages,
  getImageBychatId,
  sendImage,
  viewedImage,
} from "../controllers/sendImage.controller.js";
import { fieldsupload } from "../middlewares/multer.middleware.js";

const router = Router();

router.post("/sendImage/:chatId", verifyJWT, fieldsupload, sendImage);

router.patch("/deleteImage/:id",verifyJWT, deleteImages);

router.get("/getImages/:chatId",verifyJWT, getImageBychatId)

router.post('/markAsViewed/:imageId' , verifyJWT, viewedImage)

export default router;
