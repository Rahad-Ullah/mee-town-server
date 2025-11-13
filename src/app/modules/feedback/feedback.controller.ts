import { Request, Response, NextFunction } from 'express';
import { FeedbackServices } from './feedback.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';

// create feedback
const createFeedback = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await FeedbackServices.createFeedbackIntoDB({
      user: req.user.id,
      ...req.body,
    });

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: 'Feedback created successfully',
      data: result,
    });
  }
);

// get feedback
const getFeedback = catchAsync(async (req: Request, res: Response) => {
  const result = await FeedbackServices.getAllFeedbackFromDB(req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Feedback retrieved successfully',
    data: result.data,
    pagination: result.pagination,
  });
});

export const FeedbackController = {
  createFeedback,
  getFeedback,
};
