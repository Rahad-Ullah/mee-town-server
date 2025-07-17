import express from 'express';
import { FaqController } from './faq.controller';
import validateRequest from '../../middlewares/validateRequest';
import { FaqValidations } from './faq.validation';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';

const router = express.Router();

router.post(
  '/',
  auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
  validateRequest(FaqValidations.createFaqSchema),
  FaqController.createFaq
);

router.patch(
  '/:id',
  auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
  validateRequest(FaqValidations.updateFaqSchema),
  FaqController.updateFaq
);

router.delete(
  '/:id',
  auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
  FaqController.deleteFaq
);

router.get('/', FaqController.getFaq);

export const FaqRoutes = router;
