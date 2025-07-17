import { z } from 'zod';
import { DisclaimerType } from './disclaimer.constants';

const createDisclaimerZodSchema = z.object({
  body: z.object({
    type: z.nativeEnum(DisclaimerType, {
      required_error: 'Type is required',
    }),
    content: z.string({
      required_error: 'Content is required',
    }),
  }),
});

const updateDisclaimerZodSchema = z.object({
  body: z.object({
    type: z.nativeEnum(DisclaimerType, {
      required_error: 'Type is required',
    }),
    content: z.string({
      required_error: 'Content is required',
    }),
  }),
});

export const DisclaimerValidations = {
  createDisclaimerZodSchema,
  updateDisclaimerZodSchema,
};
