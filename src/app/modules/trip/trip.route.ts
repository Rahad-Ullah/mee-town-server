import express from 'express';
import { TripController } from './trip.controller';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import validateRequest from '../../middlewares/validateRequest';
import { TripValidations } from './trip.validation';
import fileUploadHandler from '../../middlewares/fileUploadHandler';

const router = express.Router();

// create trip
router.post(
  '/',
  auth(USER_ROLES.USER),
  fileUploadHandler(),
  validateRequest(TripValidations.createTripSchema),
  TripController.createTrip
); 

// update trip
router.patch(
  '/:id',
  auth(USER_ROLES.USER),
  fileUploadHandler(),
  validateRequest(TripValidations.updateTripSchema),
  TripController.updateTrip
);

// get trip by user id
router.get('/:id', auth(USER_ROLES.USER), TripController.getTripByUserId);

export const TripRoutes = router;
