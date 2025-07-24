import { Request, Response, NextFunction } from 'express';
import { MessageServices } from './message.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';

// ----------------- create message -------------------
const createMessage = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = { ...req.body, sender: req.user.id };
    const result = await MessageServices.createMessage(payload);

    sendResponse(res, {
      success: true,
      statusCode: 201,
      message: 'Message created successfully',
      data: result,
    });
  }
);

export const MessageController = { createMessage };
