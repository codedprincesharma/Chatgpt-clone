import { Server } from "socket.io";

function initSocketServer(httpServer) {

  const io = new Server(httpServer, {})
  io.on("connection", (socket) => {
    console.log("New socket connection", socket.id)
  })
}


export default initSocketServer;