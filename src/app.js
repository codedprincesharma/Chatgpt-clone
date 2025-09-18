import express from 'express'
import cookieParser from "cookie-parser";

//routes
import authRoutes from './routes/auth.route.js'
import chatRoutes from './routes/chat.route.js'

const app = express()
//middleware
app.use(express.json())
app.use(cookieParser())

// ussing routes
app.use('/api/auth', authRoutes)
app.use('/api/chat' , chatRoutes)


export default app