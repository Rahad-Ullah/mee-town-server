import express from 'express';
import { CountryController } from './country.controller';

const router = express.Router();

// get all countries
router.get('/', CountryController.getAllCountries);

// get all airlines
router.get('/airlines', CountryController.getAllAirlines);

export const CountryRoutes = router;
