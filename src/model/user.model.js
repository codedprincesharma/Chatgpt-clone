import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullName: {
      firstName: {
        type: String,
        required: true,
        trim: true,
      },
      lastName: {
        type: String,
        trim: true,
        default: "",
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 6, // enforce strong passwords
      select: false // hides password by default when fetching user
    }
  },
  {
    timestamps: true,
  }
);

// Pre-save hook: hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // run only if password is new/modified
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ✅ Method: compare entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
