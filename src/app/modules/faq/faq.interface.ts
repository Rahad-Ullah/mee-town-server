import { Model } from 'mongoose';

export type IFaq = {
  _id?: string;
  question: string;
  answer: string;
};

export type FaqModel = Model<IFaq>;
