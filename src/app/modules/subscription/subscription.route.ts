import express from 'express';
import { SubscriptionController } from './subscription.controller';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import validateRequest from '../../middlewares/validateRequest';
import { SubscriptionValidations } from './subscription.validation';

const router = express.Router();

router.post(
  '/create',
  auth(USER_ROLES.USER),
  validateRequest(SubscriptionValidations.createSubscriptionShcema),
  SubscriptionController.createSubscription
); 

// get all subscriptions
router.get(
  '/',
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  SubscriptionController.getAllSubscriptions
);

// get subscription by id
router.get(
  '/get-by-user/:id',
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  SubscriptionController.getSubscriptionByUserId
);

// get my subscriptions
router.get(
  '/my-subscriptions',
  auth(USER_ROLES.USER),
  SubscriptionController.getMySubscriptions
);

export const SubscriptionRoutes = router;
