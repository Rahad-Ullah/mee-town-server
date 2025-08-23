import { nativeEnum, z } from 'zod';
import { PaymentProvider, SubscriptionStatus } from './subscription.constants';

// create subscription zod schema
const createSubscriptionShcema = z.object({
  body: z.object({
    package: z.string().min(1, 'Package is required'),
    expiresDate: z.string({ required_error: 'Expires date is required' }),
    paymentProvider: nativeEnum(PaymentProvider, {
      message: 'Payment provider is required',
    }),
    transactionId: z.string().min(1, 'Transaction id is required'),
    status: nativeEnum(SubscriptionStatus).default(SubscriptionStatus.ACTIVE),
  }),
});

export const SubscriptionValidations = { createSubscriptionShcema };
