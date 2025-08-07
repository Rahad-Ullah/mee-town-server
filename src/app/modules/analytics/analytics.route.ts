import express from 'express';
import { AnalyticsController } from './analytics.controller';

const router = express.Router();

router.get('/overview', AnalyticsController.getAnalyticsOverview);

router.get('/user-growth', AnalyticsController.getMonthlyUserGrowth);

router.get('/revenue-growth', AnalyticsController.getMonthlyRevenueGrowth);

export const AnalyticsRoutes = router;
