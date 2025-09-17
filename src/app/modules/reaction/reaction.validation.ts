import z from 'zod';

const createReactionZodSchema = z.object({
  body: z.object({
    user: z.string({ required_error: 'User is required' }),
    isLike: z.boolean({ required_error: 'Is like is required' }).nullable(),
  }),
});

export const ReactionValidation = {
  createReactionZodSchema,
};
