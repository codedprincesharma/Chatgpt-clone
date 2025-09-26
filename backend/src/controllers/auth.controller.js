import userModel from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

async function registerController(req, res) {
  try {
    const { fullName = {}, email, password } = req.body || {};
    const { firstName, lastName } = fullName;

    //check user exists
    const isUseralreadyExist = await userModel.findOne({
      email
    })
    if (isUseralreadyExist) {
      return res.status(400).json({
        message: "user already exists"
      })
    }

    //hash password
    const hashPassword = await bcrypt.hash(password, 10)


    // create user 
    const newUser = await userModel.create({
      fullName: {
        firstName,
        lastName
      },
      email,
      password: hashPassword
    })

    // create tocken 
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d"
    })

    res.cookie("token", token)
    res.status(201).json({
      message: "user create",
      user: {
        fullName: newUser.fullName,
        email: newUser.email,
        _id: newUser._id
      }
    })


  } catch (err) {
    console.log("error", err),
      res.status(500).json({
        message: "server error",
        err: err.message
      })

  }

}

async function loginController(req, res) {
  try {
    const { email, password } = req.body
    // check userExist
    const user = await userModel.findOne({
      email
    })

    if (!user) {
      return res.status(500).json({
        message: "invalid user"
      })
    }

    // check validPassword
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return res.json({
        message: "incorrect password pls try again"
      })
    }
    // email and password is correct then set token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
    res.cookie("token", token)
    res.status(200).json({
      message: "user logged in successfully",
      user: {
        email: user.email,
        _id: user._id,
        fullName: user.fullName
      }
    })
  } catch (err) {
    console.log("error", err)
    res.status(500).json({
      message: "server error",
      err: err.message
    })
  }
}


async function logoutController(req, res) {
  try {
    // clear cookie
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error during logout",
      error: error.message,
    });
  }
}

async function forgetPasswordController(req, res) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = Date.now() + 1000 * 60 * 10; 


    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiry = resetTokenExpiry;
    await user.save();

    // Reset link (frontend route ke sath jodna padega)
    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    // Yahan email bhejna hoga 
    console.log("Password reset link:", resetLink);

    return res.status(200).json({
      message: "Password reset link has been sent to your email",
      resetLink // sirf testing ke liye bhej rahe hain
    });

  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
}

export default { registerController, loginController, logoutController, forgetPasswordController };