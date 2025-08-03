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
    Trip.find({
      isDeleted: false,
      startDate: { $gte: todayDayStart },
      endDate: { $gte: todayDayStart },
    }), // filter only trips that are today or later
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

// --------------- get all matched trips ----------------
const getAllMatchedTrips = async (query: Record<string, unknown>) => {
  const todayDayStart = new Date(new Date().setHours(0, 0, 0, 0));
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const aggregationPipeline: any[] = [
    {
      $match: {
        isDeleted: false,
        startDate: query.startDate
          ? { $eq: new Date(query.startDate as string) }
          : { $gte: todayDayStart },
        endDate: query.endDate
          ? { $eq: new Date(query.endDate as string) }
          : { $gte: todayDayStart },
      },
    },
    {
      $group: {
        _id: {
          place: '$place',
          startDate: '$startDate',
          endDate: '$endDate',
          vehicle: '$vehicle',
        },
        trips: { $push: '$$ROOT' },
        matchCount: { $sum: 1 },
        place: { $first: '$place' },
        countryCode: { $first: '$countryCode' },
        vehicle: { $first: '$vehicle' },
        startDate: { $first: '$startDate' },
        endDate: { $first: '$endDate' },
      },
    },
    {
      $project: {
        _id: 0,
        // place: 1,
        // date: 1,
        // trips: 1,
        // matchCount: 1,
      },
    },
    { $sort: { matchCount: -1 as 1 | -1 } },
    { $skip: skip },
    { $limit: limit },
  ];

  const result = await Trip.aggregate(aggregationPipeline);

  // Get total count for pagination (count groups)
  const countPipeline: any[] = [
    {
      $match: {
        isDeleted: false,
        startDate: query.startDate
          ? { $eq: new Date(query.startDate as string) }
          : { $gte: todayDayStart },
        endDate: query.endDate
          ? { $eq: new Date(query.endDate as string) }
          : { $gte: todayDayStart },
      },
    },
    {
      $group: {
        _id: {
          place: '$place',
          startDate: '$startDate',
          endDate: '$endDate',
          vehicle: '$vehicle',
        },
      },
    },
    { $count: 'total' },
  ];
  const totalCountResult = await Trip.aggregate(countPipeline);
  const total = totalCountResult[0]?.total || 0;

  return {
    data: result,
    pagination: {
      page,
      limit,
      total,
      totalPage: Math.ceil(total / limit),
    },
  };
};

// --------------- get popular matched trips ----------------
const getPopularMatchedTrips = async () => {
  const todayDayStart = new Date(new Date().setHours(0, 0, 0, 0));

  const aggregationPipeline: any[] = [
    {
      $match: {
        isDeleted: false,
        startDate: { $gte: todayDayStart },
        endDate: { $gte: todayDayStart },
      },
    },
    {
      $group: {
        _id: {
          place: '$place',
          startDate: '$startDate',
          endDate: '$endDate',
          vehicle: '$vehicle',
        },
        trips: { $push: '$$ROOT' },
        matchCount: { $sum: 1 },
        place: { $first: '$place' },
        countryCode: { $first: '$countryCode' },
        vehicle: { $first: '$vehicle' },
        startDate: { $first: '$startDate' },
        endDate: { $first: '$endDate' },
      },
    },
    {
      $project: {
        _id: 0,
      },
    },
    { $sort: { matchCount: -1 as 1 | -1 } },
    { $limit: 5 },
  ];

  const result = await Trip.aggregate(aggregationPipeline);

  return {
    data: result,
  };
};

export const TripServices = {
  createTripIntoDB,
  updateTripIntoDB,
  getTripByUserId,
  getAllTrips,
  getAllMatchedTrips,
  getPopularMatchedTrips,
};
