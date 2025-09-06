import dotenv from 'dotenv'
import app from './src/app.js'
dotenv.config()








app.listen(3000, () => {
  console.log("server running on port no 3000");
})