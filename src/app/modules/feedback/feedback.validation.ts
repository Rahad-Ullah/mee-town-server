import { z } from 'zod';

// create feedback validation
const createFeedbackValidation = z.object({
  body: z.object({
    message: z
      .string({
        required_error: 'Message is required',
      })
      .nonempty('Message cannot be empty'),
    rating: z
      .number({
        required_error: 'Rating is required',
      })
      .min(1, 'Rating must be at least 1')
      .max(5, 'Rating must be at most 5')
      .default(0)
      .optional(),
  }),
});

export const FeedbackValidations = {
  createFeedbackValidation,
};
