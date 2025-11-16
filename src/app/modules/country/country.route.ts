import express from 'express';
import { CountryController } from './country.controller';

const router = express.Router();

// get all countries
router.get('/', CountryController.getAllCountries);

export const CountryRoutes = router;
