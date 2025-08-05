import { z } from 'zod';
import { ReportStatus } from './report.constants';

// create report validation schema
const createReportSchema = z.object({
  body: z.object({
    user: z.string().nonempty('User cannot be empty'),
    reason: z.string().nonempty('Reason cannot be empty'),
  }),
});

// update report validation schema
const updateReportSchema = z.object({
  body: z.object({
    status: z.nativeEnum(ReportStatus),
  }),
});

export const ReportValidations = { createReportSchema, updateReportSchema };
