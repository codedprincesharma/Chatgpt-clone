import app from './src/app.js'
import http from 'http'
import connectDb from './src/config/db.js'
import dotenv from 'dotenv'
import initSocketServer from './src/socket/socket.server.js'

// Load environment variables
dotenv.config()

// Create HTTP server
const httpServer = http.createServer(app)

const PORT = process.env.PORT || 3000

// Connect to Database
connectDb()

// Initialize Socket Server
initSocketServer(httpServer)

// Start Server
httpServer.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
