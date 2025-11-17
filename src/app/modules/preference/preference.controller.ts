import { Request, Response, NextFunction } from 'express';
import { PreferenceServices } from './preference.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';

// update preference
const updatePreference = catchAsync(async (req: Request, res: Response) => {
  const result = await PreferenceServices.updatePreferenceIntoDB({
    ...req.body,
    user: req.user.id,
  });

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Preference updated successfully',
    data: result,
  });
});

export const PreferenceController = { updatePreference };
