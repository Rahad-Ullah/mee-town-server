import express from 'express';
import { MessageController } from './message.controller';

const router = express.Router();

router.get('/', MessageController); 

export const MessageRoutes = router;
