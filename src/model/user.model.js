import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullName: {
    firstName: {
      type: String,
    },
    lasttName: {
      type: String,
    }
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
})


const user = mongoose.model("User", userSchema);
export default user;