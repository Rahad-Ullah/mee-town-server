import { Request, Response, NextFunction } from 'express';
import { TripServices } from './trip.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { getSingleFilePath } from '../../../shared/getFilePath';

// create trip
const createTrip = catchAsync(async (req: Request, res: Response) => {
  const image = getSingleFilePath(req.files, 'image');
  const paylaod = { ...req.body, user: req.user?.id, image };
  const result = await TripServices.createTripIntoDB(paylaod);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Trip created successfully',
    data: result,
  });
});

export const TripController = { createTrip };
