import mongoose from 'mongoose'

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL)
    console.log("connect to db")
  } catch (error) {
    console.log("error", error)
  }
}


export default connectDb