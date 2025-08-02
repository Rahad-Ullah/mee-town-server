import { Model, Types } from 'mongoose';
import { TRIP_ACCOMMODATION, TRIP_VEHICLE } from './trip.constants';

export type ITrip = {
  _id?: string;
  user: Types.ObjectId;
  place: string;
  countryCode: string;
  startDate: Date;
  endDate: Date;
  vehicle: TRIP_VEHICLE;
  airlinesType: string;
  accommodation: TRIP_ACCOMMODATION;
  travelWith: string;
  image: string;
  isDeleted?: boolean;
};

export type TripModel = Model<ITrip>;
