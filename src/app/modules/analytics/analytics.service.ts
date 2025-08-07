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

export const AnalyticsServices = { getAnalyticsOverview };
