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
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'You have already blocked this user'
    );
  }

  const result = await Report.create(payload);

  return result;
};

// toggle block/ unblock user
const toggleBlockUserIntoDB = async (user: string, reporter: string) => {
  const existingReport = await Report.findOne({
    reporter,
    user,
    type: ReportType.BLOCK,
  });
  // delete block report if exist
  if (existingReport) {
    await Report.findByIdAndDelete(existingReport._id);
    return { message: 'User unblocked successfully' };
  }

  // create block report if not exist
  await Report.create({
    reporter,
    user,
    type: ReportType.BLOCK,
  });

  return { message: 'User blocked successfully' };
};

export const ReportServices = { createReportIntoDB, toggleBlockUserIntoDB };
