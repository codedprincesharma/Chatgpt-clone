import express from 'express'
import authController from '../controllers/auth.controller.js'
const routes = express.Router()

routes(express.json())


//controller
routes.use('/', authController)





export default routes