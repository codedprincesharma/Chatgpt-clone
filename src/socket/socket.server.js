import { Server } from "socket.io";
import cookie from "cookie";
import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";
import aiService from '../services/ai.service.js'
import messageModel from "../models/message.model.js";

function initSocketServer(httpServer) {
  const io = new Server(httpServer, {});
  io.use(async (socket, next) => {
    const cookies = cookie.parse(socket.handshake.headers.cookie || "");
    // console.log(cookies);
    if (!cookies.token) {
      return next(new Error("Authentication error: no token provided"));
    }

    try {
      const decoded = jwt.verify(cookies.token, process.env.JWT_SECRET);
      const user = await userModel.findById(decoded.id);

      if (!user) {
        return next(new Error("Authentication error: user not found"));
      }
      socket.user = user;
      next();
    } catch (err) {
      console.error("JWT verification error:", err.message);
      next(new Error("Authentication error"));
    }
  });

  io.on("connection", (socket) => {
    console.log("New socket connected:", socket.id);
    socket.on("ai-message", async (messagePayload) => {
      try {
        console.log("Incoming from client:", messagePayload);

        await messageModel.create({
          chat: messagePayload.chat,
          user: socket.user._id,
          content: messagePayload.content,
          role: "user"
        })

        const chatHistory = await messageModel.find({
          chat: messagePayload.chat
        })

        console.log("chat HIstory :");


        const response = await aiService(chatHistory.map(item => {
          return {
            role: item.role,
            parts: [{ text: item.content }]
          }
        }))

        socket.emit("ai-message", {
          content: response,
          chat: messagePayload.chat
        });


        console.log("Response sent to client:", response);


      } catch (err) {
        console.error("AI Service Error:", err);
        socket.emit("ai-message", {
          content: "Error processing AI request",
          chat: messagePayload.chat
        });
      }
    });
  });

  // io.on("connection", (socket) => {
  //   // console.log("New socket connection", socket.id);
  //   // console.log("Authenticated user:", socket.user); // optional


  // });
}

export default initSocketServer;
