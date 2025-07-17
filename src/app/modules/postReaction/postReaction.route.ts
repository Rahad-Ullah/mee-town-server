import express from 'express';
import { PostReactionController } from './postReaction.controller';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import validateRequest from '../../middlewares/validateRequest';
import { PostReactionValidations } from './postReaction.validation';

const router = express.Router();

router.post(
  '/',
  auth(USER_ROLES.USER),
  validateRequest(PostReactionValidations.createPostReactionZodSchema),
  PostReactionController.createPostReaction
);

export const PostReactionRoutes = router;
