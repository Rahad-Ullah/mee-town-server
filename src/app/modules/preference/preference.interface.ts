import { Model, Types } from 'mongoose';

export type IPreference = {
  _id?: Types.ObjectId;
  user: Types.ObjectId;
  airline: string;
  airport: string;
  hotel: string;
};

export type PreferenceModel = Model<IPreference>;
