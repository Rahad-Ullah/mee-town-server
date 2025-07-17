import express from 'express';
import { DisclaimerController } from './disclaimer.controller';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { DisclaimerValidations } from './disclaimer.validation';

const router = express.Router();

router.post(
  '/',
  validateRequest(DisclaimerValidations.createDisclaimerZodSchema),
  DisclaimerController.createDisclaimer
); 

export const DisclaimerRoutes = router;
