import express from 'express';
import { TripController } from './trip.controller';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import validateRequest from '../../middlewares/validateRequest';
import { TripValidations } from './trip.validation';
import fileUploadHandler from '../../middlewares/fileUploadHandler';

const router = express.Router();

router.post(
  '/',
  auth(USER_ROLES.USER),
  fileUploadHandler(),
  validateRequest(TripValidations.createTripSchema),
  TripController.createTrip
); 

router.patch(
  '/:id',
  auth(USER_ROLES.USER),
  fileUploadHandler(),
  validateRequest(TripValidations.updateTripSchema),
  TripController.updateTrip
);

export const TripRoutes = router;
