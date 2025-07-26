import { Model, ObjectId } from 'mongoose';

export type INotification = {
  _id?: string;
  type: string;
  title: string;
  message: string;
  receiver: ObjectId;
  referenceId?: string;
  isRead: boolean;
  createdAt: Date;
};

export type NotificationModel = Model<INotification>;
