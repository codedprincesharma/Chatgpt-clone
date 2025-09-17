import userModel from "../model/user.model.js";
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



export default { registerContrller }