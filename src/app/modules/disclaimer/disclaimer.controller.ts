import { Request, Response, NextFunction } from 'express';
import { DisclaimerServices } from './disclaimer.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';

// --------------- create/update disclaimer ---------------
const createDisclaimer = catchAsync(async (req: Request, res: Response) => {
  const result = await DisclaimerServices.createDisclaimer(req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Disclaimer updated successfully',
    data: result,
  });
});

export const DisclaimerController = { createDisclaimer };
