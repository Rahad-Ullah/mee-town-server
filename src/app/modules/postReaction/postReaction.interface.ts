import { Model, Types } from 'mongoose';

export type IPostReaction = {
  _id?: Types.ObjectId;
  post: Types.ObjectId;
  reactor: Types.ObjectId;
  isLike: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

export type PostReactionModel = Model<IPostReaction>;
