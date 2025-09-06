import mongoose from "mongoose";

const connectDb = async () => {
  try {
    mongoose.set("strictQuery", true); 
    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      autoIndex: false, 
      maxPoolSize: 10, 
      serverSelectionTimeoutMS: 5000, 
      socketTimeoutMS: 45000, // close sockets after 45s of inactivity
    });
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error(" MongoDB connection error:", error.message);
    process.exit(1); 
  }

  mongoose.connection.on("disconnected", () => {
    console.error(" MongoDB disconnected. Trying to reconnect...");
  });


  mongoose.connection.on("error", (err) => {
    console.error("MongoDB connection error:", err.message);
  });
};

export default connectDb;
