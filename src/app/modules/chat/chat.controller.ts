import { Request, Response, NextFunction } from 'express';
import { ChatServices } from './chat.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';

// create chat
const createChat = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await ChatServices.createChatIntoDB(req.user, req.body);

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: 'Chat created successfully',
      data: result,
    });
  }
);

export const ChatController = { createChat };
