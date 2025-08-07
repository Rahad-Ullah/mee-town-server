import { Model, ObjectId } from 'mongoose';
import { PaymentProvider, SubscriptionStatus } from './subscription.constants';

export type ISubscription = {
  _id?: string;
  user: ObjectId;
  package: ObjectId;
  purchaseDate: Date;
  expiresDate: Date;
  amount: number;
  paymentProvider: PaymentProvider;
  transactionId: string;
  status: SubscriptionStatus;
};

export type SubscriptionModel = Model<ISubscription>;
