import express from 'express'
import authRoute from '../src/routes/auth.route.js'
const app = express()
//middleware
app(express.json())


//Routes
app.use('/api/auth', authRoute)








export default app