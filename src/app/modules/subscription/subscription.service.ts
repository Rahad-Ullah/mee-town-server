import { ISubscription } from './subscription.interface';

// create subscription schema
const createSubscriptionIntoDB = async (payload: ISubscription) => {
  //   const response = await appleApi.getTransactionInfo(payload.transactionId);

  // Decode the signed JWS payload to get the transaction data
  //   const transactionData = await appleApi.decodeTransaction(
  //     response.signedTransactionInfo
  //   );

  // ---- todo: after verify transaction data from apple api then save it into db and update the user subscription

  return payload;
};

// update subscription

// get all subscriptions

// get subscription by id

export const SubscriptionServices = { createSubscriptionIntoDB };
