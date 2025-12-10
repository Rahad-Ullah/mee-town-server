import { z } from 'zod';
import { DisclaimerType } from './disclaimer.constants';

const createDisclaimerZodSchema = z.object({
  body: z.object({
    type: z.nativeEnum(DisclaimerType, {
      message: 'Type is required',
    }),
    content: z
      .string({
        message: 'Content is required',
      })
      .nonempty({ message: 'Content cannot be empty' }),
  }),
});

export const DisclaimerValidations = {
  createDisclaimerZodSchema,
};
