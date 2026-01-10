import express from 'express';
import { ContactInfoController } from './contactInfo.controller';
import validateRequest from '../../middlewares/validateRequest';
import { ContactInfoValidations } from './contactInfo.validation';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';

const router = express.Router();

router.post(
  '/',
  auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
  validateRequest(ContactInfoValidations.updateContactInfoZodSchema),
  ContactInfoController.updateContactInfo
);

// get contact info
router.get('/', ContactInfoController.getContactInfo);

export const ContactInfoRoutes = router;
