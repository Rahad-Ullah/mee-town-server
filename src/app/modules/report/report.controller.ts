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

export const ReportController = { createReport };
