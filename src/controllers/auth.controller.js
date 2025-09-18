import userModel from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

async function registerContrller(req, res) {
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

export default { registerContrller, loginController }