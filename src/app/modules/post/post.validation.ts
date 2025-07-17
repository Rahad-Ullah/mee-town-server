import { z } from 'zod';

const createPostZodSchema = z.object({
  body: z.object({
    place: z
      .string({
        required_error: 'Place is required',
      })
      .min(1, 'Place cannot be empty'),
    title: z
      .string({
        required_error: 'Title is required',
      })
      .min(1, 'Title cannot be empty')
      .max(200, 'Title cannot exceed 200 characters'),
    message: z
      .string({
        required_error: 'Message is required',
      })
      .min(1, 'Message cannot be empty'),
    // Image will be handled by file upload middleware, so we can make it optional here
    image: z.string({ required_error: 'Image is required' }).optional(),
  }),
});

const updatePostZodSchema = z.object({
  body: z.object({
    place: z.string().min(1, 'Place cannot be empty').optional(),
    title: z
      .string()
      .min(1, 'Title cannot be empty')
      .max(200, 'Title cannot exceed 200 characters')
      .optional(),
    message: z.string().min(1, 'Message cannot be empty').optional(),
    image: z.string().optional(),
    isDeleted: z.boolean().optional(),
  }),
});

export const PostValidations = {
  createPostZodSchema,
  updatePostZodSchema,
};
