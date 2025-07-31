import { Request, Response, NextFunction } from 'express';
import { SubscriptionServices } from './subscription.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';

// create subscription
export const createSubscription = catchAsync(
  async (req: Request, res: Response) => {
    const payload = { ...req.body, user: req.user.id };

    const result = await SubscriptionServices.createSubscriptionIntoDB(payload);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Subscription created successfully',
      data: result,
    });
  }
);

export const SubscriptionController = { createSubscription };
