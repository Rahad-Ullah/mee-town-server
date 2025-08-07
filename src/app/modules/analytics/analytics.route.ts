import express from 'express';
import { AnalyticsController } from './analytics.controller';

const router = express.Router();

router.get('/overview', AnalyticsController.getAnalyticsOverview);

export const AnalyticsRoutes = router;
