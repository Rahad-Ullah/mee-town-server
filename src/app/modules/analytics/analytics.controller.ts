import { Request, Response } from 'express';
import { AnalyticsServices } from './analytics.service';
import sendResponse from '../../../shared/sendResponse';

// get analytics overview
const getAnalyticsOverview = async (req: Request, res: Response) => {
  const result = await AnalyticsServices.getAnalyticsOverview();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Analytics overview fetched successfully',
    data: result,
  });
};

// get monthly user growth
const getMonthlyUserGrowth = async (req: Request, res: Response) => {
  const result = await AnalyticsServices.getMonthlyUserGrowth();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Monthly user growth fetched successfully',
    data: result,
  });
}

// get monthly revenue growth
const getMonthlyRevenueGrowth = async (req: Request, res: Response) => {
  const result = await AnalyticsServices.getMonthlyRevenueGrowth();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Monthly revenue growth fetched successfully',
    data: result,
  });
}

export const AnalyticsController = { getAnalyticsOverview, getMonthlyUserGrowth, getMonthlyRevenueGrowth };
