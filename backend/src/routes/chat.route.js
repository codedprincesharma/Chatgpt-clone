import authMiddleware from '../middleware/auth.middleware.js';
import createChat from '../controllers/chat.controller.js';
import express from 'express';

const router = express.Router()

router.post('/', authMiddleware.authUser , createChat.createChat) 

export default router
