import unlinkFile from '../../../shared/unlinkFile';
import QueryBuilder from '../../builder/QueryBuilder';
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
};

// --------------- get all trips ----------------
const getAllTrips = async (query: Record<string, unknown>) => {
  const todayDayStart = new Date(new Date().setHours(0, 0, 0, 0));

  const tripQuery = new QueryBuilder(
    Trip.find({ isDeleted: false, date: { $gte: todayDayStart } }), // filter only trips that are today or later
    query
  )
    .search(['place', 'vehicle', 'accommodation'])
    .filter()
    .sort()
    .paginate();

  const [data, pagination] = await Promise.all([
    tripQuery.modelQuery.lean(),
    tripQuery.getPaginationInfo(),
  ]);

  return { data, pagination };
};

export const TripServices = {
  createTripIntoDB,
  updateTripIntoDB,
  getTripByUserId,
  getAllTrips,
};
