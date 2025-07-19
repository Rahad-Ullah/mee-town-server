import { ITrip } from './trip.interface';
import { Trip } from './trip.model';

// --------------- create trip ----------------
export const createTripIntoDB = async (payload: ITrip): Promise<ITrip> => {
  const result = await Trip.create(payload);

  return result;
};

export const TripServices = { createTripIntoDB };
