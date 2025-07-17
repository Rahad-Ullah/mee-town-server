import { Model } from 'mongoose';

export type IContactInfo = {
  _id?: string;
  email: string;
  phone?: string;
};

export type ContactInfoModel = Model<IContactInfo>;
