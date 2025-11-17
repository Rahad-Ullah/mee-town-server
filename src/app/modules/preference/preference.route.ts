import express from 'express';
import { PreferenceController } from './preference.controller';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import validateRequest from '../../middlewares/validateRequest';
import { PreferenceValidations } from './preference.validation';

const router = express.Router();

router.patch(
  '/update',
  auth(USER_ROLES.USER),
  validateRequest(PreferenceValidations.updatePreferenceValidation),
  PreferenceController.updatePreference
); 

export const PreferenceRoutes = router;
