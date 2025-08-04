import { Model, ObjectId } from 'mongoose';
import { ReportStatus, ReportType } from './report.constants';

export type IReport = {
  _id?: string;
  user: ObjectId;
  reporter: ObjectId;
  reason?: string;
  type: ReportType;
  status: ReportStatus;
};

export type ReportModel = Model<IReport>;
