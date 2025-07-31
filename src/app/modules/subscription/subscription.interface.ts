import { Model, ObjectId } from 'mongoose';
import { PaymentProvider, SubscriptionStatus } from './subscription.constants';

export type ISubscription = {
  _id?: string;
  user: ObjectId;
  package: ObjectId;
  purchaseDate: Date;
  expiresDate: Date;
  status: SubscriptionStatus;
  paymentProvider: PaymentProvider;
  transactionId: string;
};

export type SubscriptionModel = Model<ISubscription>;
