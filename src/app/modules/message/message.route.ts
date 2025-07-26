import express from 'express';
import { MessageController } from './message.controller';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import validateRequest from '../../middlewares/validateRequest';
import { MessageValidations } from './message.validation';
import fileUploadHandler from '../../middlewares/fileUploadHandler';

const router = express.Router();

router.post(
  '/',
  auth(USER_ROLES.USER),
  fileUploadHandler(),
  validateRequest(MessageValidations.createMessageSchema),
  MessageController.createMessage
); 

router.get(
  '/:chatId',
  auth(USER_ROLES.USER),
  MessageController.getChatMessages
);

export const MessageRoutes = router;
