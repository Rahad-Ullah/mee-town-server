import express from 'express';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { AuthController } from './auth.controller';
import { AuthValidation } from './auth.validation';
const router = express.Router();

router.post(
  '/login',
  validateRequest(AuthValidation.createLoginZodSchema),
  AuthController.loginUser
);

// social login
router.post(
  '/social-login',
  validateRequest(AuthValidation.createSocialLoginZodSchema),
  AuthController.socialLogin
);

// phone login
router.post(
  '/phone-login',
  validateRequest(AuthValidation.createPhoneLoginZodSchema),
  AuthController.phoneLogin
);

router.post(
  '/forgot-password',
  validateRequest(AuthValidation.createForgetPasswordZodSchema),
  AuthController.forgetPassword
);

router.post(
  '/verify-otp',
  validateRequest(AuthValidation.createVerifyEmailZodSchema),
  AuthController.verifyEmail
);

// verify phone number
router.post(
  '/verify-phone',
  validateRequest(AuthValidation.createVerifyPhoneZodSchema),
  AuthController.verifyPhone
);

router.post(
  '/reset-password',
  validateRequest(AuthValidation.createResetPasswordZodSchema),
  AuthController.resetPassword
);

router.post(
  '/change-password',
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN, USER_ROLES.USER),
  validateRequest(AuthValidation.createChangePasswordZodSchema),
  AuthController.changePassword
);

export const AuthRoutes = router;
