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

// update trip
const updateTrip = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const image = getSingleFilePath(req.files, 'image');
  const paylaod = { ...req.body, image };
  const result = await TripServices.updateTripIntoDB(id, paylaod);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Trip updated successfully',
    data: result,
  });
})

// get trip by user id
const getTripByUserId = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await TripServices.getTripByUserId(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Trip retrieved successfully',
    data: result,
  });
})

// get trip by user id
const getMyTrips = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.user;
  const result = await TripServices.getTripByUserId(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Trip retrieved successfully',
    data: result,
  });
})

// get all trips
const getAllTrips = catchAsync(async (req: Request, res: Response) => {
  const result = await TripServices.getAllTrips(req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Trips retrieved successfully',
    data: result,
  });
})

export const TripController = { createTrip, updateTrip, getTripByUserId, getMyTrips, getAllTrips };
