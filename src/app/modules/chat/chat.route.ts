import express from 'express';
import { ChatController } from './chat.controller';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import validateRequest from '../../middlewares/validateRequest';
import { ChatValidations } from './chat.validation';

const router = express.Router();

router.post(
  '/',
  auth(USER_ROLES.USER),
  validateRequest(ChatValidations.createChatValidation),
  ChatController.createChat
); 

router.delete('/:id', auth(USER_ROLES.USER), ChatController.deleteChat);

router.get('/', auth(USER_ROLES.USER), ChatController.getMyChats);

router.get('/online', auth(USER_ROLES.USER), ChatController.getOnlineChats);

export const ChatRoutes = router;
