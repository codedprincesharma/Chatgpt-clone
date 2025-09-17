import express from 'express';
const router = express.Router()
import authMiddleware from '../middleware/auth.middleware.js';

router.post('/', authMiddleware.authUser,)




export default router