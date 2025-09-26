import express from "express"
import authController from "../controllers/auth.controller.js"
const router = express.Router()

router.use('/register', authController.registerController)
router.use('/login', authController.loginController)
router.use('/logout', authController.loginController)
router.use('/forget', authController.forgetPasswordController)


export default router