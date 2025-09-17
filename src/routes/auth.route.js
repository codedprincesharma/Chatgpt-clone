import express from "express"
import authController from "../controllers/auth.controller.js"
const router = express.Router()

router.use('/register', authController.registerContrller)
router.use('/login', authController.loginController)


export default router