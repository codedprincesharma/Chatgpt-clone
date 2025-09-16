import userModel from "../model/user.mode.jsl";
import bcrypt from "bcrypt"


const registerController = async (req, res) => {
  const { fullName: { firstName, lastName }, email, password } = req.body

  try {
    // check user Exist
    const existUSer = await userModel.findOne({
      email
    })
    if (existUSer) {
      return res.status(409).json({
        message: "user already exist !"
      })
    }

    // create user
    const hash = await bcrypt.hash(password, 10)
    const newUser = await userModel.create({
      fullName: {
        firstName,
        lastName
      },
      email,
      password: hash
    })

    res.status(201).json({
      success: true,
      message: "User registered successfully!",
      user: {
        id: newUser._id,
        email: newUser.email,
        fullName: newUser.fullName
      }
    })

  } catch (error) {
    console.log('error', error.message)
  }

}



export default { registerController }