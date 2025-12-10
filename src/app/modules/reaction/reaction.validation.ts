import z from 'zod';

const createReactionZodSchema = z.object({
  body: z.object({
    user: z.string('User is required').nonempty('User is required'),
    isLike: z.boolean('Reaction type is required').nullable(),
  }),
});

export const ReactionValidation = {
  createReactionZodSchema,
};
