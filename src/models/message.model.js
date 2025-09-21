import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({

  user: {
    type: mongoose.Schema.ObjectId,
    ref: "user"
  },
  chat: {
    type: mongoose.Schema.ObjectId,
    ref: "chat"
  },
  content: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ["user", "model", "system"],
    default: "user"
  }
}, {
  timestamps: true
})

const messageModel = mongoose.model("Message", messageSchema);
export default messageModel;