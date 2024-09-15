import mongoose from "mongoose";
const Schema = mongoose.Schema;

const messageSchema = new Schema({
  chat: {
    type: Schema.Types.ObjectId,
    ref: "Chat",
  },
  sender: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  text: {
    type: String,
  },
  status: {
    type: Boolean,
    default: true,
  },
},{
  timestamps:true
});

export const Message = mongoose.model("Message", messageSchema);
