import { nativeEnum, z } from 'zod';
import { PaymentProvider, SubscriptionStatus } from './subscription.constants';

// create subscription zod schema
const createSubscriptionShcema = z.object({
  body: z.object({
    user: z.string().min(1, 'User is required'),
    package: z.string().min(1, 'Package is required'),
    purchaseDate: z.date({ required_error: 'Purchase date is required' }),
    expiresDate: z.date({ required_error: 'Expires date is required' }),
    status: nativeEnum(SubscriptionStatus).default(SubscriptionStatus.ACTIVE),
    paymentProvider: nativeEnum(PaymentProvider, {
      message: 'Payment provider is required',
    }),
    transactionId: z.string().min(1, 'Transaction id is required'),
  }),
});

export const SubscriptionValidations = { createSubscriptionShcema };
