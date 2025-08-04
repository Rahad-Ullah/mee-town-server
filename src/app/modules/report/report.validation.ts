import { z } from 'zod';

// create report validation schema
export const createReportSchema = z.object({
  body: z.object({
    user: z.string().nonempty('User cannot be empty'),
    reason: z.string().nonempty('Reason cannot be empty'),
  }),
});

export const ReportValidations = { createReportSchema };
