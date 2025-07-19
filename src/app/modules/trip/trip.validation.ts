import { z } from 'zod';
import { TRIP_ACCOMMODATION, TRIP_VEHICLE } from './trip.constants';

// create a schema for the trip
const createTripSchema = z.object({
  body: z.object({
    place: z.string().nonempty('Place cannot be empty'),
    date: z.coerce.date(), // Accepts string or Date
    vehicle: z.nativeEnum(TRIP_VEHICLE),
    airlinesType: z.string().optional(),
    accommodation: z.nativeEnum(TRIP_ACCOMMODATION),
    image: z.string().optional(),
    isDeleted: z.boolean().optional(),
  }),
});

// update a schema for the trip
const updateTripSchema = z.object({
  body: z.object({
    place: z.string().nonempty('Place cannot be empty').optional(),
    date: z.coerce.date().optional(), // Accepts string or Date
    vehicle: z.nativeEnum(TRIP_VEHICLE).optional(),
    airlinesType: z.string().optional(),
    accommodation: z.nativeEnum(TRIP_ACCOMMODATION).optional(),
    image: z.string().optional(),
    isDeleted: z.boolean().optional(),
  }),
});

export const TripValidations = { createTripSchema, updateTripSchema };
