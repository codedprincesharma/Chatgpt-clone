import mongoose from 'mongoose'

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL)
    console.log("connect to db")
  } catch (error) {
    console.error("db connection error", error.message)
  }
}


export default connectDb