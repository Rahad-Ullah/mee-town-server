import { Model, Types } from 'mongoose';

export type IPost = {
  _id?: Types.ObjectId;
  user: Types.ObjectId;
  place: string;
  title: string;
  message: string;
  image: string;
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

export type PostModel = Model<IPost>;
