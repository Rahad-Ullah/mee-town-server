import express from 'express';
import { GalleryController } from './gallery.controller';
import fileUploadHandler from '../../middlewares/fileUploadHandler';
import validateRequest from '../../middlewares/validateRequest';
import { GalleryValidations } from './gallery.validation';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';

const router = express.Router();

router.post(
  '/',
  auth(USER_ROLES.USER),
  fileUploadHandler(),
  validateRequest(GalleryValidations.createGalleryZodSchema),
  GalleryController.createGallery
); 

export const GalleryRoutes = router;
