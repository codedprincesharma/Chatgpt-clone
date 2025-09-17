// import userModel from "../model/user.model"
// import jwt from "jsonwebtoken"

// async function authUser(req, res, next) {
//   const { token } = req.token

//   if (!token) {
//     return res.status(401).json({
//       message: "unauthroized user"
//     })
//     const dedcode = jwt.verify(token, process.env.JWT_SECRET)
//     req.userId = dedcode._id
//     next()
//   }

// }

