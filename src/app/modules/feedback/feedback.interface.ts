import { Model, Types } from 'mongoose';

export type IFeedback = {
  _id?: Types.ObjectId;
  user: Types.ObjectId;
  message: string;
  rating?: number;
  createdAt?: Date;
  updatedAt?: Date;
};

export type FeedbackModel = Model<IFeedback>;
