import { Request, Response, NextFunction } from 'express';
import { ReportServices } from './report.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';

// create report controller
const createReport = catchAsync(async (req: Request, res: Response) => {
  const payload = {
    reporter: req.user.id,
    ...req.body,
  };

  const result = await ReportServices.createReportIntoDB(payload);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Report created successfully',
    data: result,
  });
});

// toggle block/ unblock user
const toggleBlockUser = catchAsync(async (req: Request, res: Response) => {

  const result = await ReportServices.toggleBlockUserIntoDB(req.params.id, req.user.id);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Report updated successfully',
    data: result,
  });
})

// get user block status
const getUserBlockStatus = catchAsync(async (req: Request, res: Response) => {
  const result = await ReportServices.getUserBlockStatus(req.params.id, req.user.id);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Report retrieved successfully',
    data: result,
  });
})

// get all reports
const getAllReports = catchAsync(async (req: Request, res: Response) => {
  const result = await ReportServices.getAllReports(req.query);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Reports retrieved successfully',
    data: result,
  });
})

export const ReportController = { createReport, toggleBlockUser, getUserBlockStatus, getAllReports };
