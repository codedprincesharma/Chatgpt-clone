import express from 'express'
import cookieParser from "cookie-parser";
import authRoutes from './routes/auth.route.js'

//middleware
const app = express()
app.use(express.json())
app.use(cookieParser())

// routes

app.use('/api/auth', authRoutes)


export default app