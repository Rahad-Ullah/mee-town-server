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

// get postReaction by post id
router.get('/:id', auth(USER_ROLES.USER), PostReactionController.getPostReactionByPostId);

export const PostReactionRoutes = router;
