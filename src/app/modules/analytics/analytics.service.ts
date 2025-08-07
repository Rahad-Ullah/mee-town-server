import { USER_STATUS } from '../../../enums/user';
import { Subscription } from '../subscription/subscription.model';
import { User } from '../user/user.model';

// ---------------- get analytics overview ---------------
const getAnalyticsOverview = async () => {
  const totalUsers = await User.countDocuments();
  const totalActiveUsers = await User.countDocuments({
    isDeleted: false,
    status: USER_STATUS.ACTIVE,
  });
  const totalInactiveUsers = await User.countDocuments({
    $or: [{ isDeleted: true }, { status: USER_STATUS.BLOCKED }],
  });
  const totalSubscriptions = await Subscription.countDocuments();
  const totalRevenue = await Subscription.aggregate([
    {
      $group: {
        _id: null,
        total: { $sum: '$amount' },
      },
    },
    {
      $project: {
        _id: 0,
        total: 1,
      },
    },
  ]);

  return {
    totalUsers,
    totalActiveUsers,
    totalInactiveUsers,
    totalSubscriptions,
    totalRevenue: totalRevenue[0]?.total || 0,
  };
};

// ---------------- get monthly user growth ---------------
const getMonthlyUserGrowth = async () => {
  const result = await User.aggregate([
    {
      $group: {
        _id: { $month: "$createdAt" },
        count: { $sum: 1 },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ]);

  
  // Map month number (1-12) to name
  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  const formattedResult = monthNames.map((name, index) => {
    const monthData = result.find((item) => item._id === index + 1); // Mongo month is 1-based
    return {
      month: name,
      count: monthData ? monthData.count : 0,
    };
  });

  return formattedResult;
  }

export const AnalyticsServices = { getAnalyticsOverview, getMonthlyUserGrowth };
