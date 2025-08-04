import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { ReportType } from './report.constants';
import { IReport } from './report.interface';
import { Report } from './report.model';

// ------------- create report -------------
const createReportIntoDB = async (payload: IReport) => {
  const isAlreadyBlocked = await Report.findOne({
    reporter: payload.reporter,
    user: payload.user,
    type: ReportType.BLOCK,
  });

  if (isAlreadyBlocked) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'You have already blocked this user')
  }

  const result = await Report.create(payload);

  return result;
};

export const ReportServices = { createReportIntoDB };