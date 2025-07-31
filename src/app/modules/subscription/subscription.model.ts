import { Schema, model } from 'mongoose';
import { ISubscription, SubscriptionModel } from './subscription.interface';
import { PaymentProvider, SubscriptionStatus } from './subscription.constants';

const subscriptionSchema = new Schema<ISubscription, SubscriptionModel>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  package: {
    type: Schema.Types.ObjectId,
    ref: 'Package',
    required: true,
  },
  purchaseDate: {
    type: Date,
    required: true,
  },
  expiresDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: Object.values(SubscriptionStatus),
    default: SubscriptionStatus.ACTIVE,
  },
  paymentProvider: {
    type: String,
    enum: Object.values(PaymentProvider),
    required: true,
  },
  transactionId: {
    type: String,
    required: true,
  },
});

export const Subscription = model<ISubscription, SubscriptionModel>(
  'Subscription',
  subscriptionSchema
);
