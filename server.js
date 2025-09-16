import app from './src/app.js'
import connectDb from './src/config/db.js'
import dotenv from 'dotenv'
dotenv.config()
const PORT = process.env.PORT || 3000
connectDb()







app.listen(PORT, () => {
  console.log(`server running on ${PORT}`)
})