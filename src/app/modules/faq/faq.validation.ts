import { z } from 'zod';

// create a schema for the form data
const createFaqSchema = z.object({
  body: z.object({
    question: z
      .string({ required_error: 'Question is required' })
      .nonempty('Question cannot be empty'),
    answer: z
      .string({ required_error: 'Question is required' })
      .nonempty('Answer cannot be empty'),
  }),
});

// update a schema for the form data
const updateFaqSchema = z.object({
  body: z.object({
    question: z.string().optional(),
    answer: z.string().optional(),
  }),
});

export const FaqValidations = { createFaqSchema, updateFaqSchema };
