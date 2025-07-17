import { z } from 'zod';

// create a zod schema for validation
const createGalleryZodSchema = z.object({
  body: z.object({
    user: z
      .string({
        required_error: 'user is required',
      })
      .nonempty('user is cannot be empty'),
    image: z
      .string({
        required_error: 'image is required',
      })
      .nonempty('image is cannot be empty'),
  }),
});

// update a zod schema for validation
const updateGalleryZodSchema = z.object({
  body: z.object({
    user: z
      .string({
        required_error: 'user is required',
      })
      .nonempty('user is cannot be empty'),
    image: z
      .string({
        required_error: 'image is required',
      })
      .nonempty('image is cannot be empty'),
  }),
});

export const GalleryValidations = {createGalleryZodSchema, updateGalleryZodSchema};
