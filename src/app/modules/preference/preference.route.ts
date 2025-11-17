import express from 'express';
import { PreferenceController } from './preference.controller';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import validateRequest from '../../middlewares/validateRequest';
import { PreferenceValidations } from './preference.validation';

const router = express.Router();

// update preference
router.patch(
  '/update',
  auth(USER_ROLES.USER),
  validateRequest(PreferenceValidations.updatePreferenceValidation),
  PreferenceController.updatePreference
);

// get current user preference
router.get(
  '/my-preference',
  auth(USER_ROLES.USER),
  PreferenceController.getPreference
);

// get preference by user id
router.get(
  '/:id',
  auth(),
  PreferenceController.getPreferenceByUserId
);

export const PreferenceRoutes = router;
