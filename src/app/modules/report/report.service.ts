import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { ReportType } from './report.constants';
import { IReport } from './report.interface';
import { Report } from './report.model';
import QueryBuilder from '../../builder/QueryBuilder';

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

// -------------- toggle block/ unblock user ---------------
const toggleBlockUserIntoDB = async (user: string, currentUser: string) => {
  const existingReport = await Report.findOne({
    reporter: currentUser,
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
    reporter: currentUser,
    user,
    type: ReportType.BLOCK,
  });

  return { message: 'User blocked successfully' };
};

// -------------- get user block status -----------------
const getUserBlockStatus = async (user: string, currentUser: string) => {
  const isHeBlocked = await Report.findOne({
    reporter: currentUser,
    user,
    type: ReportType.BLOCK,
  });

  const amIBlocked = await Report.findOne({
    reporter: user,
    user: currentUser,
    type: ReportType.BLOCK,
  });

  return {
    isHeBlocked: !!isHeBlocked,
    amIBlocked: !!amIBlocked,
  };
};

// -------------- get all reports -----------------
const getAllReports = async (query: Record<string, any>) => {
  const reportQuery = new QueryBuilder(
    Report.find({ type: ReportType.REPORT })
      .sort('-createdAt')
      .populate('user reporter'),
    query
  ).paginate();

  const [reports, pagination] = await Promise.all([
    reportQuery.modelQuery.lean(),
    reportQuery.getPaginationInfo(),
  ]);

  return { reports, pagination };
};

export const ReportServices = {
  createReportIntoDB,
  toggleBlockUserIntoDB,
  getUserBlockStatus,
  getAllReports,
};
