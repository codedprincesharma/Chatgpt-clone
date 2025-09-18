import { Server } from "socket.io";
import cookie from "cookie";
import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";

function initSocketServer(httpServer) {
  const io = new Server(httpServer, {});

  io.use(async (socket, next) => {
    const cookies = cookie.parse(socket.handshake.headers.cookie || "");
    console.log(cookies);

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
    console.log("New socket connection", socket.id);
    console.log("Authenticated user:", socket.user?.email); // optional
  });
}

export default initSocketServer;
