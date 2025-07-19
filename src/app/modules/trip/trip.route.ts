import express from 'express';
import { TripController } from './trip.controller';

const router = express.Router();

router.get('/', TripController); 

export const TripRoutes = router;
