import { Model } from 'mongoose';
import { DisclaimerType } from './disclaimer.constants';

export type IDisclaimer = {
  _id?: string;
  type: DisclaimerType;
  content: string;
};

export type DisclaimerModel = Model<IDisclaimer>;
