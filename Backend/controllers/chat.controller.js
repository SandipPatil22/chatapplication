import { User } from "../models/user.model.js";
import { Chat } from "../models/chat.model.js";
import { Message } from "../models/message.model.js";
import { Image } from "../models/media.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  // Check if userId is present
  if (!userId) {
    return res.status(404).json({ message: "User ID is required" });
  }

  // Verify the user exists
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Check if a chat already exists with these participants
  const existingChat = await Chat.findOne({
    participants: { $all: [req.user._id, userId] },
  });

  if (existingChat) {
    return res.status(400).json({
      message: "Chat already exists between these participants",
      chat: existingChat,
    });
  }
  const chat = new Chat({
    participants: [req.user._id, userId],
  });
  console.log(chat);
  if (chat) {
    await chat.save();
    res.status(201).json({ message: "chat created succesfully ", chat });
  } else {
    return res.status(400).json({ message: "fail to create chat " });
  }
});

const getchat = asyncHandler(async (req, res) => {
  const { chatId } = req.params;
  const userId = req?.user?._id;

  const conversion = await Chat.findOne({ _id: chatId }) //participants: userId
    .populate("participants", "userName")
    .populate("messages", "text sender  createdAt")
 

  if (conversion) {
    return res
      .status(200)
      .json({ message: " chat retrive succesfully", conversion });
  } else {
    return res.status(404).json({ message: "chat not found" });
  }
});

const deleteChat = asyncHandler(async (req,res)=>{
const {chatId} = req.params 
if (chatId) {
  return res.status(404).json({ message : "chat id not found "})
}
const chat = await Chat.findById(chatId)

if (chat) {
  chat.status=false
  await chat.save()

  res.status(200).json({message : 'chat deleted succesfully'})
} else {
  return res.status(400).json({message :"chat is not found "})
}
})

export { createChat, getchat , deleteChat};

