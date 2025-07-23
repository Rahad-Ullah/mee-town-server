import express from 'express';
import { ChatController } from './chat.controller';

const router = express.Router();

router.get('/', ChatController); 

export const ChatRoutes = router;
