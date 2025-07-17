import { Request, Response, NextFunction } from 'express';
import { DisclaimerServices } from './disclaimer.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';

// --------------- create/update disclaimer ---------------
const createDisclaimer = catchAsync(async (req: Request, res: Response) => {
  const result = await DisclaimerServices.createDisclaimerIntoDB(req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Disclaimer updated successfully',
    data: result,
  });
});

// get disclaimer
const getDisclaimer = catchAsync(async (req: Request, res: Response) => {
  const result = await DisclaimerServices.getDisclaimerFromDB(req.params.type);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Disclaimer retrieved successfully',
    data: result,
  });
});

export const DisclaimerController = { createDisclaimer, getDisclaimer };
