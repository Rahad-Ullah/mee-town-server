import unlinkFile from '../../../shared/unlinkFile';
import { ITrip } from './trip.interface';
import { Trip } from './trip.model';

// --------------- create trip ----------------
export const createTripIntoDB = async (payload: ITrip): Promise<ITrip> => {
  const result = await Trip.create(payload);

  return result;
};

// --------------- update trip ----------------
const updateTripIntoDB = async (id: string, payload: Partial<ITrip>) => {
  // check if the trip exists
  const isTripExist = await Trip.findById(id);
  if (!isTripExist) {
    throw new Error('Trip not found');
  }

  const result = await Trip.findByIdAndUpdate(id, payload, {
    new: true,
  });

  // unlink the image from the server
  if (payload.image && result) {
    unlinkFile(isTripExist.image);
  }

  return result;
};

// --------------- get trip by user id ----------------
const getTripByUserId = async (userId: string): Promise<ITrip[]> => {
  const result = await Trip.find({ user: userId, isDeleted: false });
  return result;
}

export const TripServices = { createTripIntoDB, updateTripIntoDB, getTripByUserId };
