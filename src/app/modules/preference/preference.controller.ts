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

// get preference by user id
const getPreferenceByUserId = catchAsync(async (req: Request, res: Response) => {
  const result = await PreferenceServices.getPreferenceFromDB(req.params.id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Preference retrieved successfully',
    data: result,
  });
});

// get current user preference
const getPreference = catchAsync(async (req: Request, res: Response) => {
  const result = await PreferenceServices.getPreferenceFromDB(req.user.id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Preference retrieved successfully',
    data: result,
  });
});

export const PreferenceController = {
  updatePreference,
  getPreferenceByUserId,
  getPreference,
};
