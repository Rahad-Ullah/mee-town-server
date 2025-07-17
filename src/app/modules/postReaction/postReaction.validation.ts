import { z } from 'zod';

const createPostReactionZodSchema = z.object({
  body: z.object({
    post: z
      .string({
        required_error: 'Post ID is required',
      })
      .nonempty('Post ID cannot be empty'),
    isLike: z.boolean({
      required_error: 'Reaction type is required',
    }),
  }),
});

const updatePostReactionZodSchema = z.object({
  body: z.object({
    post: z
      .string({
        required_error: 'Post ID is required',
      })
      .optional(),
    isLike: z
      .boolean({
        required_error: 'Reaction type is required',
      })
      .optional(),
  }),
});

export const PostReactionValidations = {
  createPostReactionZodSchema,
  updatePostReactionZodSchema,
};
