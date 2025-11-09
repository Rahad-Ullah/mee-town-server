import { z } from 'zod';
import {
  GENDER,
  RELATIONSHIP_STATUS,
  USER_ROLES,
  USER_STATUS,
} from '../../../enums/user';

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

const updateUserZodSchema = z.object({
  body: z
    .object({
      name: z.string().optional(),
      role: z
        .enum(Object.values(USER_ROLES) as [string, ...string[]])
        .optional(),
      location: z.string().optional(),
      gender: z.enum(Object.values(GENDER) as [string, ...string[]]).optional(),
      relationshipStatus: z
        .enum(Object.values(RELATIONSHIP_STATUS) as [string, ...string[]])
        .optional(),
      profession: z.string().optional(),
      nationality: z.string().optional(),
      birthday: z.coerce.date().optional(),
      bio: z.string().optional(),
      image: z.string().optional(),
      interests: z.array(z.string()).optional(),
      languages: z.array(z.string()).optional(),
      visitedPlaces: z.array(z.string()).optional(),
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

export const UserValidation = {
  createUserZodSchema,
  updateUserZodSchema,
};
