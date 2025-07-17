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

// delete gallery
router.delete('/:id', auth(USER_ROLES.USER), GalleryController.deleteGallery);

// get my gallery
router.get('/my-gallery', auth(USER_ROLES.USER), GalleryController.getMyGallery);

// get gallery by user id
router.get('/:id', GalleryController.getGalleryByUserId);

export const GalleryRoutes = router;
