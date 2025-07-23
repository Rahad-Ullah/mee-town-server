import { Model } from 'mongoose';

export type IChat = {
  _id?: string;
  participants: string[];
  isDeleted: boolean;
};

export type ChatModel = Model<IChat>;
