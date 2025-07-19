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

// update package
const updatePackage = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await PackageServices.updatePackageIntoDB(id, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Package updated successfully',
    data: result,
  });
})

// delete package
const deletePackage = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await PackageServices.deletePackageIntoDB(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Package deleted successfully',
    data: result,
  });
});

export const PackageController = { createPackage, updatePackage, deletePackage };
