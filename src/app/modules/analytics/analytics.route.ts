import express from 'express';
import { AnalyticsController } from './analytics.controller';

const router = express.Router();

router.get('/overview', AnalyticsController.getAnalyticsOverview);

router.get('/user-growth', AnalyticsController.getMonthlyUserGrowth);

export const AnalyticsRoutes = router;
