import { z } from 'zod';
import { TRIP_ACCOMMODATION, TRIP_VEHICLE } from './trip.constants';

// create a schema for the trip
const createTripSchema = z.object({
  body: z.object({
    placeId: z.string().nonempty('Place ID cannot be empty'),
    startDate: z.coerce.date().refine(
      date => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const inputDate = new Date(date);
        inputDate.setHours(0, 0, 0, 0);
        return inputDate > today;
      },
      { message: 'Date must be at tomorrow or later' }
    ),
    endDate: z.coerce.date().refine(
      date => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const inputDate = new Date(date);
        inputDate.setHours(0, 0, 0, 0);
        return inputDate > today;
      },
      { message: 'Date must be at tomorrow or later' }
    ),
    vehicle: z.nativeEnum(TRIP_VEHICLE),
    airlinesType: z.string().optional(),
    accommodation: z.nativeEnum(TRIP_ACCOMMODATION),
    isDeleted: z.boolean().optional(),
  }),
});

// update a schema for the trip
const updateTripSchema = z.object({
  body: z.object({
    placeId: z.string().optional(),
    startDate: z.coerce
      .date()
      .refine(
        date => {
          if (!date) return true; // allow undefined
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const inputDate = new Date(date);
          inputDate.setHours(0, 0, 0, 0);
          return inputDate >= today;
        },
        { message: 'Date cannot be in the past' }
      )
      .optional(),
    endDate: z.coerce
      .date()
      .refine(
        date => {
          if (!date) return true; // allow undefined
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const inputDate = new Date(date);
          inputDate.setHours(0, 0, 0, 0);
          return inputDate >= today;
        },
        { message: 'Date cannot be in the past' }
      )
      .optional(),
    vehicle: z.nativeEnum(TRIP_VEHICLE).optional(),
    airlinesType: z.string().optional(),
    accommodation: z.nativeEnum(TRIP_ACCOMMODATION).optional(),
    isDeleted: z.boolean().optional(),
  }),
});

export const TripValidations = { createTripSchema, updateTripSchema };
