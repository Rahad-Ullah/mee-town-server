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

export const AnalyticsController = { getAnalyticsOverview };
