import express from 'express';
import { PostController } from './post.controller';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import fileUploadHandler from '../../middlewares/fileUploadHandler';
import validateRequest from '../../middlewares/validateRequest';
import { PostValidations } from './post.validation';

const router = express.Router();

router.post(
  '/',
  auth(USER_ROLES.USER),
  fileUploadHandler(),
  validateRequest(PostValidations.createPostZodSchema),
  PostController.createPost
); 

export const PostRoutes = router;
