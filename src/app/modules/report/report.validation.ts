import { z } from 'zod';
import { ReportType } from './report.constants';

// create report validation schema
export const createReportSchema = z.object({
  body: z.object({
    user: z.string().nonempty('User cannot be empty'),
    type: z.nativeEnum(ReportType),
    reason: z.string().optional(),
  }),
});

export const ReportValidations = { createReportSchema };
