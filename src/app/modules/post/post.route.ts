import express from 'express';
import { PostController } from './post.controller';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import fileUploadHandler from '../../middlewares/fileUploadHandler';
import validateRequest from '../../middlewares/validateRequest';
import { PostValidations } from './post.validation';

const router = express.Router();

// create post
router.post(
  '/',
  auth(USER_ROLES.USER),
  fileUploadHandler(),
  validateRequest(PostValidations.createPostZodSchema),
  PostController.createPost
); 
// update post
router.patch(
  '/:id',
  auth(USER_ROLES.USER),
  fileUploadHandler(),
  validateRequest(PostValidations.updatePostZodSchema),
  PostController.updatePost
);

// soft delete post
router.delete('/:id', auth(USER_ROLES.USER), PostController.deletePost);

// get my posts
router.get('/my-posts', auth(USER_ROLES.USER), PostController.getMyPosts);

// get my liked posts
router.get('/my-liked-posts', auth(USER_ROLES.USER), PostController.getMyLikedPosts);

// get all posts
router.get('/', auth(USER_ROLES.USER, USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN), PostController.getAllPosts);

export const PostRoutes = router;
