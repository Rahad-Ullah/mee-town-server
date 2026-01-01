import express from 'express';
import { ReactionController } from './reaction.controller';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import validateRequest from '../../middlewares/validateRequest';
import { ReactionValidation } from './reaction.validation';

const router = express.Router();

router.post(
  '/create',
  auth(USER_ROLES.USER),
  validateRequest(ReactionValidation.createReactionZodSchema),
  ReactionController.createReaction
);

// get my reactions
router.get('/my-reactions', auth(USER_ROLES.USER), ReactionController.getMyReactions);

// get reactions to me
router.get('/reactions-to-me', auth(USER_ROLES.USER), ReactionController.getReactionsToMe);

// get single reaction
router.get('/:id', auth(USER_ROLES.USER), ReactionController.getSingleReaction);

export const ReactionRoutes = router;
