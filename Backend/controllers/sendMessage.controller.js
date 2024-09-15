import { User } from "../models/user.model.js";
import { Chat } from "../models/chat.model.js";
import { Message } from "../models/message.model.js";
import { Image } from "../models/media.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const sendMessage = asyncHandler(async (req, res) => {
  
  const { chatId, text } = req.body;
  

  const chat = await Chat.findById(chatId);
  if (!chat) {
    return res.status(404).json({ message: "Chat not found" });
  }

  
  const senderId = req?.user?._id;

  const newMessage = new Message({
    chat: chatId,
    sender: senderId,
    
    text,
  });
  await newMessage.save();

  chat.messages.push(newMessage._id);
  await chat.save();

  res
    .status(200)
    .json({ message: "messages created successfully", newMessage });
});

export { sendMessage };
