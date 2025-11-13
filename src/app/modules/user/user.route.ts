import express from 'express';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';
import fileUploadHandler from '../../middlewares/fileUploadHandler';
import validateRequest from '../../middlewares/validateRequest';
import { UserController } from './user.controller';
import { UserValidation } from './user.validation';
import { AuthValidation } from '../auth/auth.validation';
const router = express.Router();

// create user
router.post(
  '/create-user',
  validateRequest(UserValidation.createUserZodSchema),
  UserController.createUser
);

// create admin
router.post(
  '/create-admin',
  validateRequest(UserValidation.createUserZodSchema),
  UserController.createAdmin
);

// get profile
router
  .route('/profile')
  .get(
    auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN, USER_ROLES.USER),
    UserController.getUserProfile
  );

// update profile
router.patch(
  '/profile',
  auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN, USER_ROLES.USER),
  fileUploadHandler(),
  validateRequest(UserValidation.updateUserZodSchema),
  UserController.updateProfile
);

// toggle user status
router.patch(
  '/toggle-status/:id',
  auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
  UserController.toggleUserStatus
);

// delete by email-password
router.delete(
  '/delete-account',
  validateRequest(AuthValidation.createLoginZodSchema),
  UserController.deleteByEmailPassword
);

// delete my account
router.delete(
  '/delete-my-account',
  auth(),
  UserController.deleteMyAccount
);

// delete user by id
router.delete(
  '/:id',
  auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
  UserController.deleteUserById
);

// get all users only for admin
router.get(
  '/',
  auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
  UserController.getAllUsers
);

// discover users
router.get('/discover', auth(USER_ROLES.USER), UserController.discoverUsers);

// get single user
router.get('/:id', auth(), UserController.getSingleUser);

export const UserRoutes = router;
