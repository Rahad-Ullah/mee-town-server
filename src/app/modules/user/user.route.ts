import express, { NextFunction, Request, Response } from 'express';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';
import fileUploadHandler from '../../middlewares/fileUploadHandler';
import validateRequest from '../../middlewares/validateRequest';
import { UserController } from './user.controller';
import { UserValidation } from './user.validation';
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
router.patch('/toggle-status/:id', auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN), UserController.toggleUserStatus)

// delete user
router.delete('/:id', UserController.deleteUser);

// get single user
router.get('/:id', UserController.getSingleUser);

// get all users
router.get(
  '/',
  auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN, USER_ROLES.USER),
  UserController.getAllUsers
);

export const UserRoutes = router;