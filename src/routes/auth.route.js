import express from "express"
import authController from "../controllers/auth.controller"
const router = express.Router()

router.use('/register', authController)









export default router