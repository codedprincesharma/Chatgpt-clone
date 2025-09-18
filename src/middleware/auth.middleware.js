import userModel from "../models/user.model.js"
import jwt from "jsonwebtoken"

async function authUser(req, res, next) {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // get token after "Bearer"

    if (!token) {
      return res.status(401).json({ message: "unauthorized user" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "user not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("error", err);
    return res.status(401).json({ message: "invalid or expired token" });
  }
}

export default { authUser };
