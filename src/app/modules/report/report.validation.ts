import { z } from 'zod';
import { ReportType } from './report.constants';

// create report validation schema
export const createReportSchema = z.object({
  user: z.string().min(1, 'User is required'),
  type: z.nativeEnum(ReportType),
  reason: z.string().optional(),
});

export const ReportValidations = { createReportSchema };
