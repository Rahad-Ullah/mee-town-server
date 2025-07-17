import express from 'express';
import { DisclaimerController } from './disclaimer.controller';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { DisclaimerValidations } from './disclaimer.validation';
import { USER_ROLES } from '../../../enums/user';

const router = express.Router();

router.post(
  '/',
  auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
  validateRequest(DisclaimerValidations.createDisclaimerZodSchema),
  DisclaimerController.createDisclaimer
);

// get disclaimer
router.get('/:type', DisclaimerController.getDisclaimer);

export const DisclaimerRoutes = router;
