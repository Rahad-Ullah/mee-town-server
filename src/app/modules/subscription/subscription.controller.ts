import { Request, Response, NextFunction } from 'express';
import { SubscriptionServices } from './subscription.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';

// create subscription
export const createSubscription = catchAsync(
  async (req: Request, res: Response) => {
    const payload = { ...req.body, user: req.user.id, purchaseDate: new Date() };

    const result = await SubscriptionServices.createSubscriptionIntoDB(payload);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Subscription created successfully',
      data: result,
    });
  }
);

// get all subscriptions
export const getAllSubscriptions = catchAsync(
  async (req: Request, res: Response) => {
    const result = await SubscriptionServices.getAllSubscriptions(req.query);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Subscriptions fetched successfully',
      data: result.subscriptions,
      pagination: result.pagination,
    });
  }
);

// get by user id
export const getSubscriptionByUserId = catchAsync(
  async (req: Request, res: Response) => {
    const result = await SubscriptionServices.getSubscriptionByUserId(req.params.id);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Subscription fetched successfully',
      data: result,
    });
  }
);

// get my subscriptions
export const getMySubscriptions = catchAsync(
  async (req: Request, res: Response) => {
    console.log(req.user.id);
    const result = await SubscriptionServices.getSubscriptionByUserId(req.user.id);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Subscriptions fetched successfully',
      data: result,
    });
  }
);

export const SubscriptionController = { createSubscription, getAllSubscriptions, getSubscriptionByUserId, getMySubscriptions };
