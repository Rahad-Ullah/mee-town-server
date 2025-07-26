import { Request, Response, NextFunction } from 'express';
import { NotificationServices } from './notification.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';

// get notifications
const getNotificationFromDB = catchAsync(
  async (req: Request, res: Response) => {
    const result = await NotificationServices.getNotificationFromDB(
      req.user,
      req.query
    );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Notifications Retrieved Successfully',
      data: result,
    });
  }
);

export const NotificationController = { getNotificationFromDB };
