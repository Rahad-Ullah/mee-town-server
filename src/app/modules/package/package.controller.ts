import { Request, Response, NextFunction } from 'express';
import { PackageServices } from './package.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';

// create package
const createPackage = catchAsync(async (req: Request, res: Response) => {
  const result = await PackageServices.createPackageIntoDB(req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Package created successfully',
    data: result,
  });
});

export const PackageController = { createPackage };
