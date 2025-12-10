import { z } from 'zod';

const createPostZodSchema = z.object({
  body: z
    .object({
      placeId: z.string().nonempty('Place ID cannot be empty'),
      title: z
        .string({
          message: 'Title is required',
        })
        .min(1, 'Title cannot be empty')
        .max(200, 'Title cannot exceed 200 characters'),
      message: z
        .string({
          message: 'Message is required',
        })
        .nonempty('Message cannot be empty'),
      // Image will be handled by file upload middleware, so we can make it optional here
      image: z.string({ message: 'Image is required' }).optional(),
    })
    .strict(),
});

const updatePostZodSchema = z.object({
  body: z
    .object({
      placeId: z.string().optional(),
      title: z
        .string()
        .min(1, 'Title cannot be empty')
        .max(200, 'Title cannot exceed 200 characters')
        .optional(),
      message: z.string().nonempty('Message cannot be empty').optional(),
      image: z.string().optional(),
    })
    .strict(),
});

export const PostValidations = {
  createPostZodSchema,
  updatePostZodSchema,
};
