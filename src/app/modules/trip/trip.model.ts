import { Schema, model } from 'mongoose';
import { ITrip, TripModel } from './trip.interface';
import { TRIP_ACCOMMODATION, TRIP_VEHICLE } from './trip.constants';

const tripSchema = new Schema<ITrip, TripModel>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    place: {
      type: String,
      required: true,
    },
    countryCode: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    vehicle: {
      type: String,
      enum: Object.values(TRIP_VEHICLE),
      required: true,
    },
    airlinesType: {
      type: String,
      required: false,
    },
    accommodation: {
      type: String,
      enum: Object.values(TRIP_ACCOMMODATION),
      required: true,
    },
    travelWith: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Add schema-level validation for updates
tripSchema.pre(['findOneAndUpdate', 'updateOne', 'updateMany'], function () {
  this.setOptions({ runValidators: true });
});

export const Trip = model<ITrip, TripModel>('Trip', tripSchema);
