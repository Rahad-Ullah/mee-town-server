import { z } from 'zod';
import {
  GENDER,
  RELATIONSHIP_STATUS,
  USER_ROLES,
  USER_STATUS,
} from '../../../enums/user';

// create user validation
const createUserZodSchema = z.object({
  body: z
    .object({
      name: z.string().optional(),
      phone: z.string().optional(),
      email: z.string().email().optional(),
      password: z.string().min(8).optional(),
      appId: z.string().optional(),
      firebaseToken: z.string().optional(),
    })
    .strict(),
});

// update user validation
const updateUserZodSchema = z.object({
  body: z
    .object({
      name: z.string().optional(),
      role: z
        .enum(Object.values(USER_ROLES) as [string, ...string[]])
        .optional(),
      gender: z.enum(Object.values(GENDER) as [string, ...string[]]).optional(),
      relationshipStatus: z
        .enum(Object.values(RELATIONSHIP_STATUS) as [string, ...string[]])
        .optional(),
      profession: z.string().optional(),
      nationality: z.string().optional(),
      country: z.string().optional(),
      countryCode: z.string().optional(),
      birthday: z.coerce
        .date()
        .refine(isValidDate, { message: 'Invalid date' })
        .refine(isPastDate, { message: 'Date cannot be in the future' })
        .refine(isAtLeast18, {
          message: 'You need to be at least 18 years old to use this app.',
        })
        .optional(),
      bio: z.string().optional(),
      image: z.string().optional(),
      lookingFor: z.string().optional(),
      interests: z.array(z.string()).optional(),
      languages: z.array(z.string()).optional(),
      location: z
        .array(z.number())
        .length(2, 'Location must have exactly [longitude, latitude]')
        .refine(
          ([lon, lat]) => lon >= -180 && lon <= 180 && lat >= -90 && lat <= 90,
          { message: 'Invalid longitude or latitude values' }
        )
        .optional(),
      status: z
        .enum(Object.values(USER_STATUS) as [string, ...string[]])
        .optional(),
      verified: z.boolean().optional(),
      isDeleted: z.boolean().optional(),
      subscription: z.string().optional(),
      appId: z.string().optional(),
      firebaseToken: z.string().optional(),
    })
    .strict(),
});

// ---------- birthday validation utils ----------

function isValidDate(date: Date | undefined) {
  if (!date) return true;
  return !isNaN(date.getTime());
}

function isPastDate(date: Date | undefined) {
  if (!date) return true;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date <= today;
}

function isAtLeast18(date: Date | undefined) {
  if (!date) return true;
  const today = new Date();
  let age = today.getFullYear() - date.getFullYear();
  const m = today.getMonth() - date.getMonth();
  const d = today.getDate() - date.getDate();
  if (m < 0 || (m === 0 && d < 0)) age -= 1;
  return age >= 18;
}

export const UserValidation = {
  createUserZodSchema,
  updateUserZodSchema,
};
