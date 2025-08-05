import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { ReportType } from './report.constants';
import { IReport } from './report.interface';
import { Report } from './report.model';
import QueryBuilder from '../../builder/QueryBuilder';
import { sendNotifications } from '../../../helpers/notificationHelper';
import { User } from '../user/user.model';
import { USER_ROLES, USER_STATUS } from '../../../enums/user';
import { ObjectId, Schema } from 'mongoose';

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

  //  send notification to the admins
  const admins = await User.find({
    role: { $in: [USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN] },
    isDeleted: false,
    status: USER_STATUS.ACTIVE,
  }).lean();

  await Promise.all(
    admins.map(admin =>
      sendNotifications({
        type: 'report',
        receiver: admin._id,
        title: 'New Report',
        message: `New report from a user`,
        referenceId: payload.user.toString(),
      })
    )
  );

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

// -------------- update report status -----------------
const updateReportIntoDB = async (id: string, status: string) => {
  // check if the report is exist
  const existingReport = await Report.findById(id);
  if (!existingReport) throw new ApiError(StatusCodes.BAD_REQUEST, 'Report not found')
  
  const result = await Report.findByIdAndUpdate(id, { status }, {new: true});
  return result;
}

export const ReportServices = {
  createReportIntoDB,
  toggleBlockUserIntoDB,
  getUserBlockStatus,
  getAllReports,
  updateReportIntoDB,
};
