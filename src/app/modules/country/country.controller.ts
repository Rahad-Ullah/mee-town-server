import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { CountryServices } from './country.service';
import { AIRLINES } from '../../../DB/airlines';

// get all countries
const getAllCountries = catchAsync(async (req: Request, res: Response) => {
  const result = await CountryServices.getAllCountriesFromDB(req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Countries retrieved successfully',
    data: result,
  });
});

// get all airlines
const getAllAirlines = catchAsync(async (req: Request, res: Response) => {
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Airlines retrieved successfully',
    data: AIRLINES,
  });
});

export const CountryController = {
  getAllCountries,
  getAllAirlines,
};
