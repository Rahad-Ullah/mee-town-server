import { Schema, model } from 'mongoose';
import { IReport, ReportModel } from './report.interface';
import { ReportType } from './report.constants';

const reportSchema = new Schema<IReport, ReportModel>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  reporter: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: Object.values(ReportType),
    required: true,
  },
  reason: {
    type: String,
    required: false,
  },
});

export const Report = model<IReport, ReportModel>('Report', reportSchema);
