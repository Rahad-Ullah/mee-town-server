import { z } from 'zod';

// create a zod schema for validation
const createGalleryZodSchema = z.object({
  body: z.object({
    image: z
      .string("Image is required")
      .optional(),
  }),
});

// update a zod schema for validation
const updateGalleryZodSchema = z.object({
  body: z.object({
    image: z
      .string()
      .optional(),
  }),
});

export const GalleryValidations = {createGalleryZodSchema, updateGalleryZodSchema};
