import { Server } from "socket.io";
import cookie from "cookie";
import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";
import aiService from "../services/ai.service.js"; // Gemini chat service
import messageModel from "../models/message.model.js";
import vectorService from "../services/vactor.service.js"; // Pinecone service

// Fake vector generator
function fakeVector(content, size = 768) {
  return Array.from({ length: size }, () => Math.random());
}

function initSocketServer(httpServer) {
  const io = new Server(httpServer, {});

  // JWT authentication
  io.use(async (socket, next) => {
    const cookies = cookie.parse(socket.handshake.headers.cookie || "");
    if (!cookies.token) return next(new Error("Authentication error: no token provided"));

    try {
      const decoded = jwt.verify(cookies.token, process.env.JWT_SECRET);
      const user = await userModel.findById(decoded.id);
      if (!user) return next(new Error("Authentication error: user not found"));

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

        // Save user message in MongoDB
        const savedMessage = await messageModel.create({
          chat: messagePayload.chat,
          user: socket.user._id,
          content: messagePayload.content,
          role: "user",
        });

        // Generate fake vector
        const vector = fakeVector(messagePayload.content);
        console.log("Vector generated (fake):", vector.length);

        // Save vector + message metadata in Pinecone
        await vectorService.createMemory({
          vectors: vector,
          metadata: {
            user: socket.user._id.toString(),
            chat: messagePayload.chat,
            content: messagePayload.content,
          },
          messageId: savedMessage._id.toString(),
        });

        // Fetch last 20 messages from chat
        const chatHistory = await messageModel
          .find({ chat: messagePayload.chat })
          .sort({ createdAt: -1 })
          .limit(20)
          .lean();

        const history = chatHistory.reverse();

        // Format chat for Gemini
        const formattedHistory = history.map((item) => ({
          role: item.role === "user" ? "user" : "model",
          parts: [{ text: item.content }],
        }));

        // Call Gemini AI service
        const response = await aiService.generateResponse({ contents: formattedHistory });

        // Save AI response in MongoDB
        const aiMessage = await messageModel.create({
          chat: messagePayload.chat,
          user: socket.user._id,
          content: response,
          role: "model",
        });

        // Generate fake vector for AI response and save in Pinecone
        const aiVector = fakeVector(response);
        await vectorService.createMemory({
          vectors: aiVector,
          metadata: {
            user: "AI",
            chat: messagePayload.chat,
            content: response,
          },
          messageId: aiMessage._id.toString(),
        });

        // Send AI response to client
        socket.emit("ai-message", {
          content: response,
          chat: messagePayload.chat,
        });

        console.log("Response sent to client:", response);
      } catch (err) {
        console.error("AI Service Error:", err);
        socket.emit("ai-message", {
          content: "Error processing AI request",
          chat: messagePayload.chat,
        });
      }
    });
  });
}

export default initSocketServer;
