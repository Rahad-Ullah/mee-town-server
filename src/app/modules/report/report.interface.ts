import { Model, ObjectId } from 'mongoose';
import { ReportType } from './report.constants';

export type IReport = {
  _id?: string;
  user: ObjectId;
  reporter: ObjectId;
  reason?: string;
  type: ReportType;
};

export type ReportModel = Model<IReport>;
