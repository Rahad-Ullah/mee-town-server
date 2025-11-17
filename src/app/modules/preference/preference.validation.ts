import { z } from 'zod';

// update preference validation
const updatePreferenceValidation = z.object({
  body: z.object({
    airline: z.string().optional(),
    airport: z.string().optional(),
    hotel: z.string().optional(),
  }),
});

export const PreferenceValidations = {
  updatePreferenceValidation,
};
