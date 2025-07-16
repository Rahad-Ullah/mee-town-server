import { Model, Types } from 'mongoose';

export type IReaction = {
  user: Types.ObjectId;
  reactor: Types.ObjectId;
  isLike: boolean;
};

export type ReactionModel = Model<IReaction>;
