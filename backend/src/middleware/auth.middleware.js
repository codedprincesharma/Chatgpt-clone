import userModel from "../models/user.model.js"
import jwt from "jsonwebtoken"

async function authUser(req, res, next) {
  try {
    const { token } = req.cookies
    if (!token) {
      return res.status(401).json({
        message: "unauthroized user"
      })
    }
    const dedcode = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(dedcode.id).select("-password");
    req.user = user
    next()
  } catch (err) {
    console.log("error", err);
    res.status(401).json({
      message: "server error"
    })
    err: err.message
  }
}

export default { authUser }