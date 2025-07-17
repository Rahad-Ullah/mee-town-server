import express from 'express';
import { DisclaimerController } from './disclaimer.controller';

const router = express.Router();

router.get('/', DisclaimerController); 

export const DisclaimerRoutes = router;
