import { Request, Response, NextFunction } from 'express';
import { TripServices } from './trip.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { getSingleFilePath } from '../../../shared/getFilePath';
import { popularTripsCache } from '../../../DB/cache';
import { getPlaceDetails } from '../../../util/getCityName';

// create trip
const createTrip = catchAsync(async (req: Request, res: Response) => {
  const image = getSingleFilePath(req.files, 'image');
  const payload = { ...req.body, user: req.user?.id, image };

  const { city, countryCode } = await getPlaceDetails(payload.placeId);
  payload.place = city;
  payload.countryCode = countryCode;

  const result = await TripServices.createTripIntoDB(payload);

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
  const payload = { ...req.body, image };

  if (payload.country) {
    // Split by one or more spaces using regex and add to the payload
    const [countryCode, ...countryName] = payload.country.trim().split(/\s+/);
    payload.countryCode = countryCode;
  }

  const result = await TripServices.updateTripIntoDB(id, payload);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Trip updated successfully',
    data: result,
  });
});

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
});

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
});

// get all trips
const getAllTrips = catchAsync(async (req: Request, res: Response) => {
  const result = await TripServices.getAllTrips(req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Trips retrieved successfully',
    data: result,
  });
});

// get all matched trips
const getAllMatchedTrips = catchAsync(async (req: Request, res: Response) => {
  const result = await TripServices.getAllMatchedTrips(req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Matched trips retrieved successfully',
    data: result?.data,
    pagination: result?.pagination,
  });
});

// get popular matched trips
const getPopularMatchedTrips = catchAsync(
  async (req: Request, res: Response) => {
    const now = Date.now();
    const cacheDuration = 2 * 60 * 1000; // 2 minutes in milliseconds

    // Check if cache is fresh
    if (
      popularTripsCache.data &&
      now - popularTripsCache.lastFetched < cacheDuration
    ) {
      return sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Matched trips retrieved from cache',
        data: popularTripsCache.data,
      });
    }

    // Fetch fresh data and update cache
    const result = await TripServices.getPopularMatchedTrips();
    popularTripsCache.data = result?.data;
    popularTripsCache.lastFetched = now;

    return sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Matched trips retrieved successfully',
      data: result?.data,
    });
  }
);

// get my matched trips
const getMyMatchedTrips = catchAsync(async (req: Request, res: Response) => {
  const result = await TripServices.getMyMatchedTrips(req.user.id, req.query);
  return sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Matched trips retrieved successfully',
    data: result,
  });
});

export const TripController = {
  createTrip,
  updateTrip,
  getTripByUserId,
  getMyTrips,
  getAllTrips,
  getAllMatchedTrips,
  getPopularMatchedTrips,
  getMyMatchedTrips,
};
