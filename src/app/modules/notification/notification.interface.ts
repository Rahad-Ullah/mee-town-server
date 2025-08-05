import { Model, Types } from 'mongoose';

export type INotification = {
  _id?: string;
  type: string;
  title: string;
  message: string;
  receiver: Types.ObjectId;
  referenceId?: Types.ObjectId | string;
  isRead?: boolean;
  createdAt?: Date;
};

export type NotificationModel = Model<INotification>;
