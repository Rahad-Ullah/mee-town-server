import { JwtPayload } from 'jsonwebtoken';
import { timeAgo } from '../../../shared/timeAgo';
import QueryBuilder from '../../builder/QueryBuilder';
import { NotificationModel } from './notification.interface';
import { FilterQuery } from 'mongoose';
import { Notification } from './notification.model';

// ----------------- get notification by id -----------------
const getNotificationFromDB = async (
  user: JwtPayload,
  query: FilterQuery<any>
): Promise<Object> => {
  const notificationQuery = new QueryBuilder(
    Notification.find({ receiver: user.id }),
    query
  ).paginate();

  const [notifications, pagination, unreadCount] = await Promise.all([
    notificationQuery.modelQuery.lean().exec(),
    notificationQuery.getPaginationInfo(),
    Notification.countDocuments({ receiver: user.id, read: false }),
  ]);

  return {
    notifications: notifications.map((notification: any) => {
      return {
        ...notification,
        timeAgo: timeAgo(notification.createdAt),
      };
    }),
    pagination,
    unreadCount,
  };
};

// ----------------- mark all notifications as read -----------------
const readNotificationToDB = async (user: JwtPayload): Promise<boolean> => {
  await Notification.bulkWrite([
    {
      updateMany: {
        filter: { receiver: user.id, isRead: false },
        update: { $set: { read: true } },
        upsert: false,
      },
    },
  ]);

  return true;
};

export const NotificationServices = { getNotificationFromDB, readNotificationToDB };
